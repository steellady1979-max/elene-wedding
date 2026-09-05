import {
  FLORAL_DENSITY,
  FLORAL_OPACITY,
  floralVisible,
  type FloralDensity,
} from "@/config/floral";

const floralImg = "/images/floral-corner.png";

export function FloralCorner({
  className,
  flip = false,
  level = "min",
}: {
  className?: string;
  flip?: boolean;
  /** მინიმალური ინტენსივობა, რომელზეც ეს დეკორაცია ჩანს */
  level?: FloralDensity;
}) {
  if (!floralVisible(level)) return null;

  return (
    <img
      src={floralImg}
      alt=""
      aria-hidden="true"
      loading="lazy"
      width={1024}
      height={1024}
      style={{ opacity: FLORAL_OPACITY[FLORAL_DENSITY] }}
      className={`pointer-events-none absolute z-0 select-none ${flip ? "-scale-x-100" : ""} ${
        className ?? ""
      }`}
    />
  );
}
