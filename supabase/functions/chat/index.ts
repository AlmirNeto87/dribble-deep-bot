// NBA-focused chatbot with broad knowledge fallback. Uses Lovable AI Gateway with streaming.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é "NBA Core", um assistente especializado em basquete (NBA, finais, times, jogadores, estatísticas e momentos icônicos), mas também responde sobre QUALQUER assunto.

Diretrizes de RESPOSTA (siga rigorosamente):
- SEMPRE em português do Brasil, claro e factual.
- SEJA CONCISO: máximo ~250 palavras por resposta padrão. Use frases curtas.
- Estruture com markdown leve: até 2 subtítulos curtos (###) e listas com no máx 5 itens.
- NÃO repita contexto já dado. NÃO faça introduções longas. Vá direto ao ponto.
- Só estenda a resposta (até ~500 palavras) se o usuário pedir explicitamente "detalhe", "aprofunde", "explique completo".
- Para perguntas simples (1 fato), responda em 1-3 frases. Sem listas.
- Nunca invente estatísticas. Se não souber, diga "não tenho certeza".
- Se ambíguo, faça UMA pergunta curta de clarificação.`;

const MAX_MESSAGES = 12;
const MAX_CONTENT_LENGTH = 4000;
const ALLOWED_ROLES = new Set(["user", "assistant"]);

type CleanMsg = { role: "user" | "assistant"; content: string };

function validateMessages(input: unknown): { ok: true; messages: CleanMsg[] } | { ok: false; error: string } {
  if (!Array.isArray(input)) return { ok: false, error: "messages must be an array" };
  if (input.length === 0) return { ok: false, error: "messages cannot be empty" };
  if (input.length > 100) return { ok: false, error: "too many messages" };

  const cleaned: CleanMsg[] = [];
  for (const m of input) {
    if (!m || typeof m !== "object") return { ok: false, error: "invalid message format" };
    const role = (m as Record<string, unknown>).role;
    const content = (m as Record<string, unknown>).content;
    if (typeof role !== "string" || !ALLOWED_ROLES.has(role)) {
      return { ok: false, error: "invalid message role" };
    }
    if (typeof content !== "string" || content.length === 0) {
      return { ok: false, error: "message content must be a non-empty string" };
    }
    if (content.length > MAX_CONTENT_LENGTH) {
      return { ok: false, error: `message content exceeds ${MAX_CONTENT_LENGTH} characters` };
    }
    // Strip any extra fields by only keeping role and content
    cleaned.push({ role: role as "user" | "assistant", content });
  }
  return { ok: true, messages: cleaned.slice(-MAX_MESSAGES) };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Corpo da requisição inválido." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const validation = validateMessages((body as { messages?: unknown })?.messages);
    if (!validation.ok) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(JSON.stringify({ error: "Serviço indisponível no momento." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...validation.messages],
        stream: true,
        max_tokens: 800,
        temperature: 0.6,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições atingido. Tente novamente em instantes." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos esgotados. Adicione créditos no workspace Lovable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro no gateway de IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: "Erro interno. Tente novamente." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
