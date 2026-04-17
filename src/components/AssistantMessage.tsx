import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AssistantMessageProps {
  timestamp: string;
  content: string;
  streaming?: boolean;
}

export const AssistantMessage = ({ timestamp, content, streaming }: AssistantMessageProps) => {
  return (
    <div className="max-w-[75ch] animate-fade-up">
      <div className="flex items-center gap-2 mb-2">
        <div className="size-2 bg-foreground" />
        <div className="text-xs text-foreground uppercase tracking-wider font-bold font-display">
          NBA Core
        </div>
        <div className="text-xs text-muted-foreground">// {timestamp}</div>
        {streaming && (
          <div className="text-[10px] text-led-orange uppercase tracking-widest font-bold animate-pulse-led ml-2">
            ● transmitindo
          </div>
        )}
      </div>
      <div className="bg-arena-panel border-t-2 border-led-orange p-6 shadow-panel">
        {content ? (
          <div className="prose prose-sm prose-invert max-w-none text-foreground leading-relaxed
            prose-headings:font-display prose-headings:uppercase prose-headings:text-foreground
            prose-strong:text-led-orange prose-strong:font-semibold
            prose-a:text-led-cyan prose-a:no-underline hover:prose-a:underline
            prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5
            prose-code:text-led-amber prose-code:bg-arena-base prose-code:px-1 prose-code:py-0.5 prose-code:rounded-none prose-code:before:content-[''] prose-code:after:content-['']
            prose-blockquote:border-l-led-orange prose-blockquote:text-muted-foreground
            prose-hr:border-border">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            {streaming && (
              <span className="inline-block w-2 h-4 bg-led-orange align-middle ml-1 animate-blink" />
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="size-2 bg-led-orange animate-pulse-led" />
            <span className="text-sm font-display uppercase tracking-wider">Conectando ao terminal</span>
          </div>
        )}
      </div>
    </div>
  );
};
