import { Reveal } from "./Reveal";
import { SparkleTitle } from "./SparkleTitle";
import { Church, MapPin, PenLine, UtensilsCrossed } from "lucide-react";

const shatoImg = "/images/shato-gelati.jpg";
const dinnerImg = "/images/venue-dinner.jpg";

const ITEMS = [
  {
    time: "15:00",
    icon: Church,
    title: "ჯვრისწერა",
    map: "https://maps.app.goo.gl/xAxkSFnDiWZfSAY59",
    image: null as string | null,
  },
  {
    time: "17:00",
    icon: PenLine,
    title: "ხელისმოწერა",
    map: "https://maps.app.goo.gl/ARufmDYp83TKBAQ57",
    image: shatoImg,
  },
  {
    time: "18:00",
    icon: UtensilsCrossed,
    title: "ვახშამი",
    map: "https://maps.app.goo.gl/ARufmDYp83TKBAQ57",
    image: dinnerImg,
  },
];

export function Schedule() {
  return (
    <section className="bg-backdrop px-0 pb-4 sm:px-6">
      <div className="mx-auto max-w-none sm:max-w-3xl">
        <Reveal>
          <div className="rounded-none border-x-0 border-t-0 border-b border-ink/10 bg-parchment/95 py-5 shadow-none sm:rounded-2xl sm:border sm:p-7 sm:shadow-soft">
            <div className="px-5 sm:px-0">
              <SparkleTitle className="font-geo text-lg tracking-[0.15em]">დღის განრიგი</SparkleTitle>
            </div>
            <ol className="mt-6 grid gap-5">
              {ITEMS.map(({ time, icon: Icon, title, map, image }, i) => (
                <li key={time} className="relative flex gap-4">
                  <div className="flex flex-col items-center pl-5 sm:pl-1">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-wine/20 bg-wine/10">
                      <Icon className="h-4 w-4 text-wine" strokeWidth={1.5} />
                    </span>
                    {i < ITEMS.length - 1 && <span className="mt-1 w-px flex-1 bg-ink/15" />}
                  </div>
                  <div className="min-w-0 flex-1 pb-1 pr-5 sm:pr-0">
                    <p className="font-geo text-xs tracking-[0.25em] text-ink/55">{time}</p>
                    <p className="font-geo text-base text-ink">{title}</p>
                    <a
                      href={map}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-2 rounded-full border border-wine/25 px-4 py-1.5 font-geo text-xs tracking-[0.15em] text-wine transition hover:bg-wine hover:text-parchment"
                    >
                      <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />
                      რუკაზე ნახვა
                    </a>
                    {image && (
                      <img
                        src={image}
                        alt="შატო გელათის საქორწილო ცერემონიის აკვარელი"
                        loading="lazy"
                        className="mt-4 w-full rounded-none border-y border-ink/10 shadow-soft sm:rounded-xl sm:border"
                      />
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
