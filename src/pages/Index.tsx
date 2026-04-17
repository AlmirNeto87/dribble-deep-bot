import { useEffect, useRef, useState } from "react";
import { ControlDeck } from "@/components/ControlDeck";
import { MatchupBoard } from "@/components/MatchupBoard";
import { UserMessage } from "@/components/UserMessage";
import { AssistantMessage } from "@/components/AssistantMessage";
import { generateResponse, type BotResponse } from "@/lib/nbaBot";

type Message =
  | { id: string; role: "user"; text: string; ts: string }
  | { id: string; role: "assistant"; response: BotResponse; ts: string };

const now = () =>
  new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

const WELCOME: Message = {
  id: "welcome",
  role: "assistant",
  ts: now(),
  response: generateResponse("oi"),
};

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || thinking) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text: trimmed,
      ts: now(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setThinking(true);

    // Simulated processing delay for broadcast feel
    setTimeout(() => {
      const response = generateResponse(trimmed);
      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), role: "assistant", response, ts: now() },
      ]);
      setThinking(false);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const reset = () => setMessages([{ ...WELCOME, ts: now() }]);

  return (
    <>
      <header className="sr-only">
        <h1>Chatbot NBA Finals — Análises de times, jogadores e momentos icônicos</h1>
      </header>
      <div className="min-h-dvh w-full bg-arena-base flex text-foreground overflow-hidden">
        <ControlDeck onAsk={send} onReset={reset} />

        {/* Center chat */}
        <main className="flex-1 flex flex-col relative min-w-0">
          <div className="absolute inset-0 scanlines pointer-events-none opacity-40" />

          <div className="h-14 border-b border-border flex items-center px-4 md:px-8 justify-between z-10 bg-arena-base/80 backdrop-blur-sm">
            <div className="flex items-center gap-3 md:gap-4">
              <span className="px-2 py-0.5 bg-led-orange/10 text-led-orange border border-led-orange/20 text-xs font-bold uppercase tracking-widest font-display">
                ● Live Session
              </span>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Terminal NBA Finals
              </span>
            </div>
            <div className="text-xs text-muted-foreground tabular-nums hidden sm:block">
              {now()}
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 z-10">
            {messages.map((m) =>
              m.role === "user" ? (
                <UserMessage key={m.id} timestamp={m.ts} text={m.text} />
              ) : (
                <AssistantMessage key={m.id} timestamp={m.ts} response={m.response} />
              ),
            )}

            {thinking && (
              <div className="max-w-[60ch] flex items-center gap-3 text-muted-foreground">
                <div className="size-2 bg-led-orange animate-pulse-led" />
                <span className="text-sm font-display uppercase tracking-wider">
                  Analisando dados
                </span>
                <span className="flex gap-0.5">
                  <span className="animate-blink">.</span>
                  <span className="animate-blink" style={{ animationDelay: "0.2s" }}>.</span>
                  <span className="animate-blink" style={{ animationDelay: "0.4s" }}>.</span>
                </span>
              </div>
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
                placeholder="Pergunte sobre times, jogadores, finais ou momentos..."
                className="w-full bg-transparent text-foreground placeholder:text-muted-foreground px-4 py-4 outline-none font-body"
                disabled={thinking}
                aria-label="Pergunta para o terminal NBA"
              />
              <button
                type="submit"
                disabled={thinking || !input.trim()}
                className="mr-2 px-3 py-1.5 bg-foreground text-arena-base text-xs font-bold uppercase tracking-wider hover:bg-led-orange hover:text-primary-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-display"
              >
                Enviar
              </button>
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2 hidden sm:block">
              Tente: "Quem é Jokić?" • "Conte sobre os Lakers" • "Finais de 1998"
            </div>
          </form>
        </main>

        <MatchupBoard onAsk={send} />
      </div>
    </>
  );
};

export default Index;
