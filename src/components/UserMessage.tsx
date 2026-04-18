interface UserMessageProps {
  timestamp: string;
  text: string;
}

export function UserMessage({ timestamp, text }: UserMessageProps) {
  return (
    <div className="max-w-[65ch] ml-auto animate-fade-up">
      <div className="text-right text-xs text-muted-foreground uppercase tracking-wider mb-2 font-display">
        Analista // {timestamp}
      </div>
      <div className="bg-arena-surface p-4 border border-border text-foreground leading-relaxed">
        {text}
      </div>
    </div>
  );
}
