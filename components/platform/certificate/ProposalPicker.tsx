"use client";

import * as React from "react";

/**
 * Prototype variant picker (harness chrome, not part of the design): a dark pill, bottom
 * centre. Number keys 1–N and ←/→ switch; the choice lives in a URL param so a reload keeps it.
 * Used by proposals that are compared live before one is promoted.
 */
export function ProposalPicker<T extends string>({
  variants,
  value,
  onChange,
  label = "Prototype variants",
}: {
  variants: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  label?: string;
}) {
  const nav = React.useRef<HTMLElement>(null);
  const highlight = React.useRef<HTMLSpanElement>(null);
  const items = React.useRef<(HTMLButtonElement | null)[]>([]);
  const [ready, setReady] = React.useState(false);
  const current = Math.max(0, variants.findIndex((v) => v.id === value));

  const move = React.useCallback(() => {
    const el = items.current[current];
    if (!el || !highlight.current) return;
    highlight.current.style.width = `${el.offsetWidth}px`;
    highlight.current.style.transform = `translateX(${el.offsetLeft}px)`;
  }, [current]);

  React.useLayoutEffect(move, [move]);
  React.useEffect(() => {
    window.addEventListener("resize", move);
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
    return () => {
      window.removeEventListener("resize", move);
      cancelAnimationFrame(id);
    };
  }, [move]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= variants.length) onChange(variants[n - 1].id);
      else if (e.key === "ArrowRight") onChange(variants[(current + 1) % variants.length].id);
      else if (e.key === "ArrowLeft") onChange(variants[(current - 1 + variants.length) % variants.length].id);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [current, onChange, variants]);

  return (
    <nav ref={nav} className="proto-picker" aria-label={label} data-ready={ready ? "" : undefined}>
      <span ref={highlight} className="proto-picker-highlight" aria-hidden="true" />
      {variants.map((v, i) => (
        <button
          key={v.id}
          ref={(el) => {
            items.current[i] = el;
          }}
          type="button"
          className="proto-picker-item"
          data-active={i === current ? "" : undefined}
          aria-current={i === current ? "true" : undefined}
          onClick={() => onChange(v.id)}
        >
          {v.label}
        </button>
      ))}
      <style>{PICKER_CSS}</style>
    </nav>
  );
}

const PICKER_CSS = `
.proto-picker{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:2147483647;display:flex;align-items:center;gap:2px;padding:4px;border-radius:999px;background:rgba(10,10,10,.82);-webkit-backdrop-filter:blur(12px) saturate(1.4);backdrop-filter:blur(12px) saturate(1.4);box-shadow:0 0 0 1px rgba(255,255,255,.08) inset,0 8px 24px rgba(0,0,0,.24),0 2px 6px rgba(0,0,0,.12);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:13px;line-height:1;-webkit-font-smoothing:antialiased;user-select:none;-webkit-user-select:none}
.proto-picker-highlight{position:absolute;top:4px;left:0;height:28px;border-radius:999px;background:rgba(255,255,255,.12);will-change:transform}
.proto-picker[data-ready] .proto-picker-highlight{transition:transform 250ms cubic-bezier(.23,1,.32,1),width 250ms cubic-bezier(.23,1,.32,1)}
@media (prefers-reduced-motion:reduce){.proto-picker[data-ready] .proto-picker-highlight{transition:none}}
.proto-picker-item{position:relative;display:flex;align-items:center;height:28px;padding:0 12px;border:0;border-radius:999px;background:transparent;color:rgba(255,255,255,.55);font:inherit;cursor:pointer;transition:color 150ms ease-out;white-space:nowrap}
.proto-picker-item:hover{color:rgba(255,255,255,.85)}
.proto-picker-item:active{transform:scale(.97)}
.proto-picker-item:focus-visible{outline:2px solid rgba(255,255,255,.4);outline-offset:2px}
.proto-picker-item[data-active]{color:#fff}
`;
