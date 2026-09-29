/**
 * Abstract objects that stand where the reference world had its illustrated cast. Adult by construction:
 * lobes, capsules and the course objects themselves (a session card, a stack of modules). Decorative only.
 */

/** Home: today's session as an object resting among lobes. */
export function SessionObject({ video }: { video: boolean }) {
  return (
    <svg viewBox="0 0 560 480" className="fd-objects" aria-hidden focusable="false">
      <circle cx="330" cy="236" r="192" className="fd-f-field-deep" />
      <path d="M560 0 V178 A178 178 0 0 1 382 0 Z" className="fd-f-coral" />
      <path d="M40 480 A160 160 0 0 1 360 480 Z" className="fd-f-cream" />
      <rect x="44" y="96" width="156" height="56" rx="28" transform="rotate(-18 122 124)" className="fd-f-signal" />
      <g transform="rotate(-6 330 250)">
        <rect x="178" y="146" width="304" height="200" rx="36" className="fd-f-white" />
        <circle cx="244" cy="214" r="36" className="fd-f-signal" />
        {video ? (
          <path d="M233 197 L261 214 L233 231 Z" className="fd-f-ink" />
        ) : (
          <g className="fd-f-ink">
            <rect x="226" y="202" width="36" height="5" rx="2.5" />
            <rect x="226" y="212" width="36" height="5" rx="2.5" />
            <rect x="226" y="222" width="24" height="5" rx="2.5" />
          </g>
        )}
        <rect x="300" y="196" width="146" height="14" rx="7" className="fd-f-mist" />
        <rect x="300" y="222" width="98" height="14" rx="7" className="fd-f-mist" />
        <rect x="214" y="292" width="232" height="10" rx="5" className="fd-f-mist" />
        <rect x="214" y="292" width="64" height="10" rx="5" className="fd-f-field" />
      </g>
      <circle cx="470" cy="400" r="14" className="fd-f-signal" />
    </svg>
  );
}

/** Course: the modules as a small stack of slabs, the current one marked. */
export function StackObject({ current, count }: { current: number; count: number }) {
  const layers = Array.from({ length: count }, (_, i) => i);
  return (
    <svg viewBox="0 0 560 480" className="fd-objects" aria-hidden focusable="false">
      <circle cx="360" cy="220" r="180" className="fd-f-field-deep" />
      <path d="M0 480 V330 A150 150 0 0 1 150 480 Z" className="fd-f-coral" />
      {layers.map((i) => {
        const y = 120 + i * 92;
        const tone = i % 2 === 0 ? "fd-f-cream" : "fd-f-white";
        return (
          <g key={i} transform={`rotate(${-4 + i * 2} 330 ${y + 60})`}>
            <rect x={130 + i * 18} y={y} width="340" height="150" rx="40" className={tone} />
            <circle cx={184 + i * 18} cy={y + 50} r="24" className={i === current ? "fd-f-signal" : "fd-f-field"} />
            <rect x={226 + i * 18} y={y + 38} width={i === current ? 170 : 130} height="12" rx="6" className="fd-f-mist" />
            <rect x={226 + i * 18} y={y + 60} width="90" height="12" rx="6" className="fd-f-mist" />
          </g>
        );
      })}
    </svg>
  );
}

/** My Learning: a small mark per course, so capsules differ without pictures. */
export function CourseMark({ index }: { index: number }) {
  const v = index % 3;
  return (
    <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden focusable="false" className="flex-none">
      <circle cx="32" cy="32" r="32" className={v === 1 ? "fd-f-cream" : "fd-f-field-deep"} />
      {v === 0 ? <path d="M8 44 A24 24 0 0 1 56 44 Z" className="fd-f-cream" /> : null}
      {v === 1 ? <path d="M32 8 V32 H56 A24 24 0 0 0 32 8 Z" className="fd-f-coral" /> : null}
      {v === 2 ? <rect x="12" y="24" width="40" height="16" rx="8" transform="rotate(-24 32 32)" className="fd-f-signal" /> : null}
    </svg>
  );
}
