import type { FrameDraw, FrameSpec } from "@/data/topics";

const stroke = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
};

function Label({
  x,
  y,
  children,
  size = 8,
}: {
  x: number;
  y: number;
  children: string;
  size?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      fill="currentColor"
      fontSize={size}
      textAnchor="middle"
    >
      {children}
    </text>
  );
}

/** Side-view eyeball. Cornea at the left. No scale, no needle, no incision. */
function EyeShell({ children }: { children?: React.ReactNode }) {
  return (
    <g>
      <path
        d="M46 28 C70 18 118 18 132 36 C146 50 146 70 132 84 C118 102 70 102 46 92 C34 84 28 68 30 50 C32 36 36 32 46 28 Z"
        {...stroke}
      />
      <path d="M40 36 Q28 50 40 64" {...stroke} />
      <ellipse cx="52" cy="50" rx="8" ry="14" {...stroke} />
      <path d="M118 34 Q132 50 118 86" {...stroke} strokeOpacity="0.55" />
      {children}
    </g>
  );
}

function FrontEye({ children }: { children?: React.ReactNode }) {
  return (
    <g>
      <ellipse cx="70" cy="52" rx="28" ry="16" {...stroke} />
      <circle cx="70" cy="52" r="7" {...stroke} />
      {children}
    </g>
  );
}

function Draw({ draw, labels }: { draw: FrameDraw; labels?: string[] }) {
  const a = labels?.[0] ?? "";
  const b = labels?.[1] ?? "";
  switch (draw) {
    case "ivt-concept":
      return (
        <EyeShell>
          <circle cx="96" cy="58" r="4" fill="currentColor" />
          {a ? <Label x={96} y={78}>{a}</Label> : null}
        </EyeShell>
      );
    case "ivt-drops":
      return (
        <FrontEye>
          <path d="M70 18 v10" {...stroke} />
          <path d="M66 14 h8 l-2 6 h-4 z" {...stroke} />
          <circle cx="70" cy="32" r="1.6" fill="currentColor" />
        </FrontEye>
      );
    case "ivt-hold":
      return (
        <FrontEye>
          <path d="M42 40 q-8 -6 -6 -14" {...stroke} />
          <path d="M42 64 q-8 6 -6 14" {...stroke} />
          <circle cx="78" cy="50" r="3" fill="currentColor" />
        </FrontEye>
      );
    case "ivt-enter":
      return (
        <EyeShell>
          <path d="M24 24 C40 40 70 48 92 56" {...stroke} strokeDasharray="3 3" />
          <circle cx="96" cy="58" r="4" fill="currentColor" />
        </EyeShell>
      );
    case "ivt-spot":
      return (
        <>
          <rect x="28" y="28" width="104" height="64" rx="4" {...stroke} />
          <circle cx="78" cy="58" r="10" {...stroke} strokeDasharray="2 2" />
        </>
      );
    case "ivt-red":
      return (
        <FrontEye>
          <path d="M86 46 q10 6 6 16 q-10 4 -16 -2 q2 -12 10 -14 z" fill="#b54b4b" stroke="none" />
        </FrontEye>
      );
    case "ch-gland":
      return (
        <>
          <path d="M36 28 h88 v52 h-88 z" {...stroke} />
          <path d="M70 36 v28" {...stroke} />
          <circle cx="70" cy="58" r="8" {...stroke} />
          <path d="M66 36 h8" {...stroke} />
          {a ? <Label x={96} y={62}>{a}</Label> : null}
        </>
      );
    case "ch-numb":
      return (
        <>
          <path d="M36 36 h88 v36 h-88 z" {...stroke} />
          <rect x="58" y="46" width="28" height="16" rx="3" fill="currentColor" opacity="0.12" stroke="currentColor" />
        </>
      );
    case "ch-inner":
      return (
        <>
          <path d="M40 70 q40 -48 80 0" {...stroke} />
          <path d="M52 58 q28 -20 56 0" {...stroke} />
          <circle cx="80" cy="54" r="3" fill="currentColor" />
        </>
      );
    case "ch-ointment":
      return (
        <FrontEye>
          <path d="M96 70 q16 8 8 16" {...stroke} />
          <rect x="100" y="78" width="22" height="10" rx="2" {...stroke} />
        </FrontEye>
      );
    case "ch-bruise":
      return (
        <>
          <path d="M36 40 h88 v28 h-88 z" {...stroke} />
          <ellipse cx="78" cy="52" rx="16" ry="8" fill="#7a6ea0" opacity="0.45" stroke="none" />
        </>
      );
    case "bar-fundus":
      return (
        <>
          <circle cx="78" cy="56" r="36" {...stroke} />
          <circle cx="78" cy="56" r="3" fill="currentColor" />
          <path d="M40 38 l8 6 l-2 8 z" {...stroke} />
          {a ? <Label x={36} y={28}>{a}</Label> : null}
          <path d="M108 70 l10 2 m-8 4 l12 1 m-10 4 l8 1" {...stroke} />
          {b ? <Label x={118} y={96}>{b}</Label> : null}
        </>
      );
    case "bar-sit":
      return (
        <>
          <rect x="88" y="36" width="36" height="28" rx="2" {...stroke} />
          <path d="M88 64 h36" {...stroke} />
          <ellipse cx="58" cy="58" rx="16" ry="10" {...stroke} />
          <circle cx="58" cy="58" r="5" {...stroke} />
        </>
      );
    case "bar-contact":
      return (
        <EyeShell>
          <path d="M30 40 q-8 10 -2 22" {...stroke} />
        </EyeShell>
      );
    case "bar-spots":
      return (
        <>
          <circle cx="78" cy="56" r="36" {...stroke} />
          <path d="M48 40 l6 4 l-1 5 z" {...stroke} />
          {[0, 30, 60, 90, 120, 150].map((deg) => {
            const r = 16;
            const rad = ((deg - 90) * Math.PI) / 180;
            const cx = 52 + r * Math.cos(rad);
            const cy = 44 + r * Math.sin(rad);
            return <circle key={deg} cx={cx} cy={cy} r="1.5" fill="currentColor" />;
          })}
          {a ? <Label x={100} y={100} size={7}>{a}</Label> : null}
        </>
      );
    case "bar-leave":
      return (
        <FrontEye>
          <circle cx="70" cy="52" r="11" {...stroke} />
        </FrontEye>
      );
    case "yag-fog":
      return (
        <EyeShell>
          <rect x="46" y="42" width="14" height="16" fill="currentColor" opacity="0.08" stroke="currentColor" />
          <path d="M62 42 h3 v16 h-3" fill="#9aa3ad" stroke="none" />
          <path d="M118 34 Q132 50 118 86" {...stroke} />
        </EyeShell>
      );
    case "yag-sit":
      return (
        <>
          <rect x="92" y="40" width="28" height="22" {...stroke} />
          <path d="M78 62 h22" {...stroke} />
          <ellipse cx="58" cy="60" rx="14" ry="9" {...stroke} />
          <circle cx="58" cy="60" r="6" {...stroke} />
        </>
      );
    case "yag-flash":
      return (
        <FrontEye>
          <path d="M70 36 v8 m0 16 v8 m-12 -16 h8 m8 0 h8" {...stroke} />
          <circle cx="70" cy="52" r="4" fill="currentColor" />
        </FrontEye>
      );
    case "yag-window":
      return (
        <EyeShell>
          <path d="M60 44 h6 v12 h-6" fill="none" stroke="currentColor" strokeDasharray="2 2" />
          <path d="M118 34 Q132 50 118 86" {...stroke} />
        </EyeShell>
      );
    case "yag-iop":
      return (
        <FrontEye>
          <path d="M70 28 v8" {...stroke} />
          <circle cx="88" cy="44" r="1.4" fill="currentColor" />
          <circle cx="96" cy="52" r="1.4" fill="currentColor" />
          <circle cx="90" cy="62" r="1.4" fill="currentColor" />
        </FrontEye>
      );
    case "cat-cloud":
      return (
        <EyeShell>
          <ellipse cx="52" cy="50" rx="8" ry="14" fill="#9aa3ad" opacity="0.55" stroke="currentColor" />
        </EyeShell>
      );
    case "cat-light":
      return (
        <>
          <path d="M36 24 h70 v8 h-70 z" {...stroke} />
          <circle cx="118" cy="28" r="6" {...stroke} />
          <ellipse cx="70" cy="70" rx="22" ry="12" {...stroke} />
        </>
      );
    case "cat-water":
      return (
        <EyeShell>
          <path d="M24 30 q6 4 4 10" {...stroke} />
          <path d="M22 42 q6 3 3 8" {...stroke} />
        </EyeShell>
      );
    case "cat-iol":
      return (
        <EyeShell>
          <ellipse cx="52" cy="50" rx="8" ry="14" fill="currentColor" opacity="0.06" stroke="currentColor" />
        </EyeShell>
      );
    case "cat-classes":
      return (
        <>
          {[0, 1, 2, 3, 4].map((i) => {
            const x = 18 + i * 30;
            return (
              <g key={i}>
                <circle cx={x + 10} cy="46" r="10" {...stroke} />
                {i === 0 ? <circle cx={x + 10} cy="46" r="2" fill="currentColor" /> : null}
                {i === 1 ? <ellipse cx={x + 10} cy="46" rx="2" ry="5" fill="currentColor" /> : null}
                {i === 2 ? <path d={`M${x + 4} 46 h12`} {...stroke} /> : null}
                {i === 3 ? <path d={`M${x + 10} 38 v16`} {...stroke} strokeWidth="3" strokeOpacity="0.35" /> : null}
                {i === 4
                  ? [0, 120, 240].map((deg) => {
                      const rad = (deg * Math.PI) / 180;
                      return (
                        <circle
                          key={deg}
                          cx={x + 10 + 4 * Math.cos(rad)}
                          cy={46 + 4 * Math.sin(rad)}
                          r="1.5"
                          fill="currentColor"
                        />
                      );
                    })
                  : null}
              </g>
            );
          })}
          {a ? <Label x={80} y={78} size={7}>{a}</Label> : null}
        </>
      );
    case "cat-shield":
      return (
        <FrontEye>
          <path d="M48 40 h44 v20 q-22 16 -44 0 z" {...stroke} />
        </FrontEye>
      );
    default:
      return null;
  }
}

export function ProcedureFrames({ frames }: { frames: FrameSpec[] }) {
  return (
    <div className="min-w-0 max-w-full">
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-1">
        {frames.map((frame) => (
          <figure
            key={frame.draw}
            className="w-64 shrink-0 snap-start rounded-lg border border-line bg-card p-3"
          >
            <figcaption className="text-[0.82rem] font-semibold text-navy">
              {frame.title}
            </figcaption>
            <svg
              viewBox="0 0 160 110"
              className="mt-2 h-28 w-full text-navy"
              role="img"
              aria-label={frame.title}
            >
              <Draw draw={frame.draw} labels={frame.labels} />
            </svg>
            <p className="mt-1 text-[0.78rem] leading-snug text-ink">{frame.caption}</p>
          </figure>
        ))}
      </div>
    </div>
  );
}
