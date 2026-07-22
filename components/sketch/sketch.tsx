import type { ReactNode } from "react";

// Reusable "pen on paper" sketch kit. Shapes get a wobble filter so lines look
// hand-drawn; <text> carries no filter so labels stay crisp. Repeated marks
// (arrowheads) vary per `seed` so nothing looks copy-pasted.
export const ROUGH = "rough-wobble";

export function SketchFilter() {
  return (
    <filter
      id={ROUGH}
      x="-15%"
      y="-15%"
      width="130%"
      height="130%"
    >
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.014"
        numOctaves="2"
        seed="7"
        result="noise"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="noise"
        scale="4.5"
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  );
}

export function SketchBox({
  x,
  y,
  w,
  h,
  title,
  sub,
  dashed = false,
  color = "#1f2937",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub?: string;
  dashed?: boolean;
  color?: string;
}) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={10}
        fill="#ffffff"
        fillOpacity={0.45}
        stroke={color}
        strokeWidth={2.4}
        strokeDasharray={dashed ? "9 7" : undefined}
        filter={`url(#${ROUGH})`}
      />
      <text
        x={cx}
        y={sub ? cy - 9 : cy}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Kalam, cursive"
        fontSize={22}
        fontWeight={700}
        fill={color}
      >
        {title}
      </text>
      {sub && (
        <text
          x={cx}
          y={cy + 15}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="Kalam, cursive"
          fontSize={15}
          fill="#6b7280"
        >
          {sub}
        </text>
      )}
    </g>
  );
}

export function SketchArrow({
  x1,
  y1,
  x2,
  y2,
  color = "#1f2937",
  seed = 0,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  seed?: number;
}) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const len = 13 + (seed % 3) * 2;
  const spread = 0.4 + (seed % 2) * 0.1;
  const hx1 = x2 + Math.cos(angle + Math.PI - spread) * len;
  const hy1 = y2 + Math.sin(angle + Math.PI - spread) * len;
  const hx2 = x2 + Math.cos(angle + Math.PI + spread) * len;
  const hy2 = y2 + Math.sin(angle + Math.PI + spread) * len;
  return (
    <g
      stroke={color}
      strokeWidth={2.3}
      fill="none"
      strokeLinecap="round"
      filter={`url(#${ROUGH})`}
    >
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <line x1={x2} y1={y2} x2={hx1} y2={hy1} />
      <line x1={x2} y1={y2} x2={hx2} y2={hy2} />
    </g>
  );
}

export function SketchNote({
  x,
  y,
  lines,
  color = "#c0392b",
  size = 23,
  font = "Caveat",
}: {
  x: number;
  y: number;
  lines: string[];
  color?: string;
  size?: number;
  font?: string;
}) {
  return (
    <text
      x={x}
      y={y}
      fontFamily={`${font}, cursive`}
      fontSize={size}
      fontWeight={600}
      fill={color}
    >
      {lines.map((ln, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : size + 3}>
          {ln}
        </tspan>
      ))}
    </text>
  );
}

export function SketchPaper({ children }: { children: ReactNode }) {
  return (
    <main
      className="flex min-h-screen items-center justify-center p-4 sm:p-8"
      style={{ background: "#e6e2d6" }}
    >
      <div
        className="w-full max-w-4xl overflow-hidden rounded-lg p-3 shadow-2xl sm:p-5"
        style={{
          background: "#fdfaf0",
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      >
        {children}
      </div>
    </main>
  );
}
