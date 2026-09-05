const floralImg = "/images/floral-corner.png";

export function FloralCorner({
  className,
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <img
      src={floralImg}
      alt=""
      aria-hidden="true"
      loading="lazy"
      width={1024}
      height={1024}
      className={`pointer-events-none absolute select-none ${flip ? "-scale-x-100" : ""} ${
        className ?? ""
      }`}
    />
  );
}
