import { SPOTLIGHT_TEAMS, SERIES_STATS } from "@/data/nbaKnowledge";

interface MatchupBoardProps {
  onAsk: (q: string) => void;
}

export const MatchupBoard = ({ onAsk }: MatchupBoardProps) => {
  const home = SPOTLIGHT_TEAMS.find((t) => t.abbr === "BOS")!;
  const away = SPOTLIGHT_TEAMS.find((t) => t.abbr === "DAL")!;

  return (
    <aside className="hidden xl:flex w-96 flex-shrink-0 bg-arena-panel border-l border-border flex-col">
      <div className="h-14 border-b border-border flex items-center px-6 justify-between bg-arena-panel">
        <div className="font-display text-lg font-bold tracking-wider text-foreground uppercase">
          Matchup Board
        </div>
        <div className="size-2 bg-led-cyan animate-pulse-led" aria-label="live indicator" />
      </div>

      <div className="p-6 space-y-8 overflow-y-auto">
        {/* Teams header */}
        <div className="flex justify-between items-end border-b border-border pb-4">
          <button
            onClick={() => onAsk(`Conte sobre o ${home.name}`)}
            className="text-left hover:opacity-80 transition-opacity"
          >
            <div className="text-[10px] text-led-orange font-bold uppercase tracking-widest">
              Campeão 2024
            </div>
            <div className="font-display text-3xl text-foreground uppercase tracking-tighter leading-none mt-1">
              {home.abbr}
            </div>
          </button>
          <div className="font-display text-xl text-muted-foreground">VS</div>
          <button
            onClick={() => onAsk(`Conte sobre o ${away.name}`)}
            className="text-right hover:opacity-80 transition-opacity"
          >
            <div className="text-[10px] text-led-cyan font-bold uppercase tracking-widest">
              Vice 2024
            </div>
            <div className="font-display text-3xl text-foreground uppercase tracking-tighter leading-none mt-1">
              {away.abbr}
            </div>
          </button>
        </div>

        {/* Stars */}
        <div>
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 font-display">
            Estrelas em destaque
          </div>
          <div className="space-y-2">
            {[...home.stars.slice(0, 2), ...away.stars.slice(0, 2)].map((star, i) => (
              <button
                key={star}
                onClick={() => onAsk(`Quem é ${star}?`)}
                className="w-full text-left flex items-center justify-between bg-arena-surface px-3 py-2 border border-border hover:border-led-orange transition-colors group"
              >
                <span className="text-sm text-foreground group-hover:text-led-orange transition-colors">
                  {star}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {i < 2 ? home.abbr : away.abbr}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Series metrics */}
        <div>
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 font-display">
            Métricas da série
          </div>
          <div className="grid grid-cols-2 gap-3">
            {SERIES_STATS.map((s) => (
              <div key={s.label} className="bg-arena-surface border border-border p-3">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {s.label}
                </div>
                <div
                  className={`font-display text-2xl tabular-nums mt-1 ${
                    s.highlight === "orange"
                      ? "text-led-orange"
                      : s.highlight === "cyan"
                        ? "text-led-cyan"
                        : s.highlight === "amber"
                          ? "text-led-amber"
                          : "text-foreground"
                  }`}
                >
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tip */}
        <div className="border-t border-border pt-4">
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">
            💡 Dica
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Clique em qualquer time, jogador ou estatística para perguntar ao terminal.
          </p>
        </div>
      </div>
    </aside>
  );
};
