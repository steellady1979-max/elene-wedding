import { Sparkles } from "lucide-react";

const DOTS = [
  { top: "-12%", left: "-5%", size: 13, delay: 0 },
  { top: "5%", left: "101%", size: 10, delay: 900 },
  { top: "72%", left: "30%", size: 8, delay: 1800 },
  { top: "58%", left: "86%", size: 11, delay: 2700 },
];

export function SparkleTitle({
  children,
  as: Tag = "h2",
  className = "",
  shimmer = true,
}: {
  children: React.ReactNode;
  as?: "h2" | "h3" | "p";
  className?: string;
  /** false = keep solid wine text, only delicate sparkles around it */
  shimmer?: boolean;
}) {
  return (
    <span className="relative inline-block">
      <Tag className={`${shimmer ? "shimmer-text" : "text-wine"} ${className}`}>{children}</Tag>
      <span aria-hidden="true" className="pointer-events-none absolute inset-0">
        {DOTS.map((d, i) => (
          <Sparkles
            key={i}
            className="absolute text-[oklch(0.84_0.11_88)]"
            strokeWidth={1.3}
            style={{
              top: d.top,
              left: d.left,
              width: d.size,
              height: d.size,
              animation: "twinkle 3.4s ease-in-out infinite",
              animationDelay: `${d.delay}ms`,
            }}
          />
        ))}
      </span>
    </span>
  );
}
