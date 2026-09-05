import { useEffect, useState } from "react";
import { useInView } from "./Reveal";

export function Typewriter({
  text,
  speed = 55,
  startDelay = 200,
  className = "",
  as: Tag = "p",
}: {
  text: string;
  speed?: number;
  startDelay?: number;
  className?: string;
  as?: "p" | "h2" | "span";
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(text.length);
      return;
    }
    let i = 0;
    let interval: number | undefined;
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= text.length && interval) window.clearInterval(interval);
      }, speed);
    }, startDelay);
    return () => {
      window.clearTimeout(start);
      if (interval) window.clearInterval(interval);
    };
  }, [inView, text, speed, startDelay]);

  const done = count >= text.length;

  return (
    <div ref={ref}>
      <Tag className={className}>
        <span aria-hidden="true">{text.slice(0, count)}</span>
        <span className="sr-only">{text}</span>
        <span
          aria-hidden="true"
          className={`ml-[1px] inline-block w-[1px] self-stretch bg-current align-middle ${
            done ? "opacity-0" : "animate-caret-blink"
          }`}
          style={{ height: "1em" }}
        />
      </Tag>
    </div>
  );
}
