import { useEffect, useRef, useState } from "react";
import { ControlDeck } from "@/components/ControlDeck";
import { MatchupBoard } from "@/components/MatchupBoard";
import { UserMessage } from "@/components/UserMessage";
import { AssistantMessage } from "@/components/AssistantMessage";
import { streamChat, type ChatMsg } from "@/lib/chatClient";
import { useToast } from "@/hooks/use-toast";

type Message =
  | { id: string; role: "user"; content: string; ts: string }
  | { id: string; role: "assistant"; content: string; ts: string; streaming?: boolean };

const now = () =>
  new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

const WELCOME: Message = {
  id: "welcome",
  role: "assistant",
  ts: now(),
  content:
    "**Sistema online.** Bem-vindo ao terminal **NBA Core**. Sou especialista em basquete (NBA, finais, times, jogadores, momentos icônicos), mas também respondo coerentemente sobre **qualquer outro assunto**. Por onde quer começar?\n\n- 🏆 Análise das Finais 2024\n- 🎯 Scout de jogador (Jokić, Tatum, Luka, LeBron, Curry)\n- 📜 Momentos históricos da liga\n- 🌐 Ou pergunte sobre qualquer outro tema",
};

const Index = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || thinking) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      ts: now(),
    };
    const assistantId = crypto.randomUUID();
    const assistantMsg: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      ts: now(),
      streaming: true,
    };

    setMessages((m) => [...m, userMsg, assistantMsg]);
    setInput("");
    setThinking(true);

    // Build history from existing messages (excluding the just-added empty assistant)
    const history: ChatMsg[] = [...messages, userMsg]
      .filter((m) => m.id !== "welcome")
      .map((m) => ({ role: m.role, content: m.content }));

    const controller = new AbortController();
    abortRef.current = controller;

    let acc = "";
    streamChat({
      messages: history,
      signal: controller.signal,
      onDelta: (chunk) => {
        acc += chunk;
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: acc } : m)),
        );
      },
      onDone: () => {
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, streaming: false } : m)),
        );
        setThinking(false);
      },
      onError: (err) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  streaming: false,
                  content:
                    acc ||
                    `**Erro de conexão.** ${err.message}\n\nVerifique sua conexão ou tente novamente.`,
                }
              : m,
          ),
        );
        setThinking(false);
        toast({
          title: "Erro no terminal",
          description: err.message,
          variant: "destructive",
        });
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const reset = () => {
    abortRef.current?.abort();
    setMessages([{ ...WELCOME, ts: now() }]);
  };

  return (
    <>
      <header className="sr-only">
        <h1>Chatbot NBA Finals — Análises de basquete e respostas sobre qualquer assunto</h1>
      </header>
      <div className="min-h-dvh w-full bg-arena-base flex text-foreground overflow-hidden">
        <ControlDeck onAsk={send} onReset={reset} />

        <main className="flex-1 flex flex-col relative min-w-0">
          <div className="absolute inset-0 scanlines pointer-events-none opacity-40" />

          <div className="h-14 border-b border-border flex items-center px-4 md:px-8 justify-between z-10 bg-arena-base/80 backdrop-blur-sm">
            <div className="flex items-center gap-3 md:gap-4">
              <span className="px-2 py-0.5 bg-led-orange/10 text-led-orange border border-led-orange/20 text-xs font-bold uppercase tracking-widest font-display">
                ● Live Session
              </span>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Terminal NBA + Conhecimento Geral
              </span>
            </div>
            <div className="text-xs text-muted-foreground tabular-nums hidden sm:block">
              {now()}
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 z-10">
            {messages.map((m) =>
              m.role === "user" ? (
                <UserMessage key={m.id} timestamp={m.ts} text={m.content} />
              ) : (
                <AssistantMessage
                  key={m.id}
                  timestamp={m.ts}
                  content={m.content}
                  streaming={m.streaming}
                />
              ),
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-4 md:p-6 z-10 bg-arena-base/90 backdrop-blur-md border-t border-border"
          >
            <div className="relative flex items-center bg-arena-surface border border-border shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] focus-within:border-led-orange/60 transition-colors">
              <div className="pl-4 text-led-orange font-bold font-display text-xl">{">"}</div>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pergunte sobre NBA ou qualquer outro assunto..."
                className="w-full bg-transparent text-foreground placeholder:text-muted-foreground px-4 py-4 outline-none font-body"
                disabled={thinking}
                aria-label="Pergunta para o terminal"
              />
              <button
                type="submit"
                disabled={thinking || !input.trim()}
                className="mr-2 px-3 py-1.5 bg-foreground text-arena-base text-xs font-bold uppercase tracking-wider hover:bg-led-orange hover:text-primary-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-display"
              >
                {thinking ? "..." : "Enviar"}
              </button>
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2 hidden sm:block">
              Tente: "Quem é Jokić?" • "Finais de 1998" • "Explique fotossíntese" • "Capital do Japão"
            </div>
          </form>
        </main>

        <MatchupBoard onAsk={send} />
      </div>
    </>
  );
};

export default Index;
