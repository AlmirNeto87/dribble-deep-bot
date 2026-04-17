import { ICONIC_MOMENTS } from "@/data/nbaKnowledge";

interface ControlDeckProps {
  onAsk: (q: string) => void;
  onReset: () => void;
}

const QUICK_PROMPTS = [
  { label: "Visão das Finais 2024", q: "Conte sobre as Finais NBA" },
  { label: "Análise: Boston Celtics", q: "Conte sobre o Boston Celtics" },
  { label: "Scout: Nikola Jokić", q: "Quem é Nikola Jokić?" },
  { label: "Tracker de MVP", q: "Quem foi o MVP?" },
];

export const ControlDeck = ({ onAsk, onReset }: ControlDeckProps) => {
  return (
    <aside className="hidden md:flex w-64 flex-shrink-0 border-r border-border flex-col bg-arena-panel/50 backdrop-blur-md">
      <div className="p-6 border-b border-border">
        <button
          onClick={onReset}
          className="font-display text-2xl font-bold tracking-tight text-foreground uppercase flex items-center gap-2 hover:text-led-orange transition-colors"
        >
          <div className="size-3 bg-led-orange animate-pulse-led" />
          NBA // Desk
        </button>
        <div className="text-xs tracking-[0.2em] text-muted-foreground uppercase mt-1">
          Finals Terminal
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-6">
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 font-display">
            Análises rápidas
          </div>
          <ul className="space-y-1">
            {QUICK_PROMPTS.map((p) => (
              <li key={p.label}>
                <button
                  onClick={() => onAsk(p.q)}
                  className="w-full text-left px-3 py-2 hover:bg-arena-surface text-sm text-muted-foreground hover:text-foreground border-l-2 border-transparent hover:border-led-orange transition-all"
                >
                  {p.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 font-display">
            Momentos icônicos
          </div>
          <ul className="space-y-1">
            {ICONIC_MOMENTS.map((m) => (
              <li key={m.year}>
                <button
                  onClick={() => onAsk(`Conte sobre as Finais de ${m.year}`)}
                  className="w-full text-left px-3 py-2 hover:bg-arena-surface text-sm transition-colors group"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-display text-led-orange">{m.year}</span>
                    <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors truncate">
                      {m.matchup}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
          Status
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="size-1.5 bg-led-cyan animate-pulse-led" />
          <span className="text-xs text-foreground">Sistema operacional</span>
        </div>
      </div>
    </aside>
  );
};
