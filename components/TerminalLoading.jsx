/**
 * Compact faux-terminal loading state (title bar + prompt + status line).
 */
export default function TerminalLoading({ cwd = '~/portfolio', command = 'fetch data' }) {
  const title = `theron@portfolio: ${cwd}`;
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-xl border border-white/10 bg-black/50 font-mono text-xs shadow-lg ring-1 ring-white/5">
      <div className="flex items-center gap-2 border-b border-white/5 bg-black/50 px-2.5 py-1.5">
        <div className="flex gap-1">
          <span className="size-2 rounded-full bg-red-500/85" />
          <span className="size-2 rounded-full bg-yellow-500/85" />
          <span className="size-2 rounded-full bg-green-500/85" />
        </div>
        <span className="min-w-0 flex-1 truncate text-center text-[10px] text-zinc-500">{title}</span>
      </div>
      <div className="space-y-1 px-2.5 py-2 text-[11px] leading-relaxed text-zinc-300">
        <div>
          <span className="text-emerald-400">theron@portfolio</span>
          <span className="text-zinc-600">:</span>
          <span className="text-sky-400">{cwd}</span>
          <span className="text-zinc-600"> $ </span>
          <span className="text-zinc-200">{command}</span>
        </div>
        <div className="text-zinc-500">
          <span className="text-zinc-600">stdout</span>
          <span className="mx-1.5 text-zinc-700">|</span>
          <span className="animate-pulse text-emerald-400/90">reading stream…</span>
          <span className="ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 animate-pulse bg-emerald-400/70" aria-hidden />
        </div>
      </div>
    </div>
  );
}
