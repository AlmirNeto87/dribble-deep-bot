# 🏀 NBA Core — Terminal de Basquete com IA

**NBA Core** é um chatbot em formato de terminal "Broadcast Studio" especializado em **basquete (NBA, finais, times, jogadores e momentos icônicos)**, mas que também responde de forma coerente sobre **qualquer outro assunto**. As respostas são geradas em tempo real por IA, com streaming token a token direto na interface.

---

## ✨ O que o chat faz

- 💬 **Conversa em streaming**: as respostas aparecem palavra por palavra (server-sent events), simulando uma transmissão ao vivo.
- 🏆 **Especialista em NBA**: análises de finais, scout de jogadores (Jokić, Tatum, Luka, LeBron, Curry…), elencos, estatísticas e história da liga.
- 🌐 **Conhecimento geral**: também responde sobre ciência, geografia, cultura, tecnologia — qualquer tema.
- 🎛️ **Painel de controle (ControlDeck)**: atalhos rápidos para perguntas comuns e botão de reset da sessão.
- 📊 **MatchupBoard**: cards laterais com sugestões temáticas que viram perguntas com 1 clique.
- ⚡ **Concisão automática**: o system prompt força respostas curtas (máx. ~250 palavras), com markdown leve e listas enxutas.
- 🛑 **Cancelamento**: cada requisição usa `AbortController` — resetar a conversa interrompe o stream.
- 🚨 **Tratamento de erros**: mensagens claras para limite de requisições (429) e créditos esgotados (402).

---

## 🏗️ Como foi criado

### Stack

| Camada | Tecnologia |
|---|---|
| Frontend | **React 18 + Vite + TypeScript** |
| Estilização | **Tailwind CSS v3** + design tokens semânticos (HSL) em `index.css` |
| UI base | **shadcn/ui** (botões, toasts, tooltip, etc.) |
| Markdown | **react-markdown + remark-gfm** |
| Backend | **Lovable Cloud** (Supabase gerenciado) — Edge Functions em Deno |
| IA | **Lovable AI Gateway** — modelo `google/gemini-3-flash-preview` |

### Arquitetura

```
┌──────────────────┐    POST /functions/v1/chat     ┌──────────────────────┐
│  React (Index)   │ ─────────────────────────────▶ │  Edge Function chat  │
│  streamChat()    │ ◀──── SSE (data: chunks) ───── │  (Deno + validação)  │
└──────────────────┘                                └──────────┬───────────┘
                                                               │
                                                               ▼
                                                  ┌────────────────────────┐
                                                  │  Lovable AI Gateway    │
                                                  │  (Gemini 3 Flash)      │
                                                  └────────────────────────┘
```

### Componentes principais

- **`src/pages/Index.tsx`** — orquestra o estado das mensagens, monta o histórico (filtrando a mensagem de boas-vindas), dispara `streamChat` e atualiza a UI conforme os tokens chegam.
- **`src/lib/chatClient.ts`** — cliente de streaming. Faz `fetch` na edge function, lê o `ReadableStream` byte a byte, faz parse do formato SSE (`data: {...}\n\n`) e emite `onDelta` para cada pedaço de texto.
- **`src/components/AssistantMessage.tsx`** — renderiza a resposta com markdown e mostra um indicador "● transmitindo" + cursor piscando enquanto o stream está ativo.
- **`src/components/ControlDeck.tsx`** e **`MatchupBoard.tsx`** — painéis laterais com atalhos contextuais.
- **`supabase/functions/chat/index.ts`** — edge function que valida a entrada, monta o prompt do sistema e faz proxy do streaming do AI Gateway de volta para o navegador.

### Segurança no backend

A edge function aplica várias camadas de proteção:

- ✅ **Validação rigorosa** — cada mensagem precisa ter `role ∈ {user, assistant}` e `content` string não-vazia com no máximo **4 000 caracteres**.
- ✅ **Limite de contexto** — apenas as **últimas 12 mensagens** são enviadas ao modelo (controle de custo de tokens).
- ✅ **Strip de campos extras** — só `role` e `content` são repassados; campos arbitrários do cliente são descartados.
- ✅ **Erros genéricos** — falhas internas nunca vazam stack traces ou caminhos para o cliente; detalhes ficam só em `console.error`.
- ✅ **CORS configurado** — preflight `OPTIONS` tratado corretamente.
- ✅ **Limites do modelo** — `max_tokens: 800` e `temperature: 0.6` para respostas previsíveis e econômicas.

### System prompt (resumo)

> "Você é NBA Core, especialista em basquete que também responde sobre qualquer assunto. Responda em PT-BR, seja conciso (máx. ~250 palavras), use markdown leve, nunca invente estatísticas, e só estenda a resposta se o usuário pedir 'detalhe' ou 'aprofunde'."

---

## 🚀 Rodando localmente

```bash
npm install
npm run dev
```

As variáveis de ambiente do Lovable Cloud (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`) já vêm configuradas automaticamente em `.env`.

A edge function `chat` é deployada automaticamente pelo Lovable a cada alteração — não é necessário comando manual.

---

## 🧪 Como testar

1. Pergunta NBA: *"Quem é Jokić?"*
2. Pergunta histórica: *"Finais de 1998"*
3. Conhecimento geral: *"Explique fotossíntese"*
4. Verificação de robustez: enviar mensagem com mais de 4 000 caracteres → deve retornar erro 400.

---

## 📁 Estrutura resumida

```
src/
├── components/        # ControlDeck, MatchupBoard, AssistantMessage, UserMessage…
├── lib/
│   ├── chatClient.ts  # Streaming SSE para a edge function
│   └── nbaBot.ts      # Conhecimento NBA estático (fallback / contexto)
├── pages/
│   └── Index.tsx      # Tela principal do terminal
└── index.css          # Design tokens (cores, fontes, scanlines)

supabase/
├── config.toml        # verify_jwt = false para a função chat
└── functions/
    └── chat/index.ts  # Proxy de streaming + validação + Lovable AI
```

---

Construído com [Lovable](https://lovable.dev) ⚡
