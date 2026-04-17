import { type BotResponse } from "@/lib/nbaBot";

interface AssistantMessageProps {
  timestamp: string;
  response: BotResponse;
}

const highlightColor: Record<string, string> = {
  orange: "text-led-orange",
  cyan: "text-led-cyan",
  amber: "text-led-amber",
};

export const AssistantMessage = ({ timestamp, response }: AssistantMessageProps) => {
  return (
    <div className="max-w-[75ch] animate-fade-up">
      <div className="flex items-center gap-2 mb-2">
        <div className="size-2 bg-foreground" />
        <div className="text-xs text-foreground uppercase tracking-wider font-bold font-display">
          NBA Core
        </div>
        <div className="text-xs text-muted-foreground">// {timestamp}</div>
      </div>
      <div className="bg-arena-panel border-t-2 border-led-orange p-6 shadow-panel">
        <div className="text-xs uppercase tracking-widest text-led-orange font-bold mb-3 font-display">
          {response.intro}
        </div>
        <p className="text-foreground leading-relaxed mb-4 text-pretty">{response.body}</p>

        {response.bullets && (
          <ul className="space-y-1.5 mb-4 border-l-2 border-led-orange/30 pl-4">
            {response.bullets.map((b, i) => (
              <li key={i} className="text-sm text-muted-foreground leading-relaxed">
                <span className="text-led-orange mr-2">▸</span>
                {b}
              </li>
            ))}
          </ul>
        )}

        {response.data && (
          <div className="bg-arena-base border border-border p-4 mt-4">
            <div className="font-display text-base uppercase text-foreground mb-3 tracking-tight">
              {response.data.title}
            </div>
            <div className="grid grid-cols-3 gap-4">
              {response.data.stats.map((s, i) => (
                <div key={i} className="space-y-1">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {s.label}
                  </div>
                  <div
                    className={`font-display text-3xl tabular-nums tracking-tighter ${
                      s.highlight ? highlightColor[s.highlight] : "text-foreground"
                    }`}
                  >
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {response.followUp && (
          <p className="text-xs text-muted-foreground mt-4 italic font-body">
            ↳ {response.followUp}
          </p>
        )}
      </div>
    </div>
  );
};
