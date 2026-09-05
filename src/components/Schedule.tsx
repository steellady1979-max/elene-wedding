import { Reveal } from "./Reveal";
import { FloralCorner } from "./FloralCorner";
import { SparkleTitle } from "./SparkleTitle";
import { Church, MapPin, PenLine, UtensilsCrossed } from "lucide-react";

const CHURCH_MAP =
  "https://www.google.com/maps/place/%E1%83%A1%E1%83%95%E1%83%94%E1%83%A2%E1%83%98%E1%83%AA%E1%83%AE%E1%83%9D%E1%83%95%E1%83%9A%E1%83%98%E1%83%A1+%E1%83%A1%E1%83%90%E1%83%99%E1%83%90%E1%83%97%E1%83%94%E1%83%93%E1%83%A0%E1%83%9D+%E1%83%A2%E1%83%90%E1%83%AB%E1%83%90%E1%83%A0%E1%83%98/@41.8422257,44.720956,17z";
const VENUE_MAP =
  "https://www.google.com/maps/place/%E1%83%A4%E1%83%A3%E1%83%A0%E1%83%A8%E1%83%94%E1%83%A2%E1%83%98%E1%83%9C%E1%83%9D+%E1%83%90%E1%83%92%E1%83%90%E1%83%A0%E1%83%90%E1%83%99%E1%83%96%E1%83%94/data=!4m2!3m1!1s0x40445f7bb5e37c51:0x4f341e9b0cea6e95";

const ITEMS = [
  {
    time: "16:00",
    icon: Church,
    title: "ჯვრისწერა",
    place: "სვეტიცხოვლის საკათედრო ტაძარი",
    map: CHURCH_MAP,
    image: "/images/svetitskhoveli.jpg",
    alt: "სვეტიცხოვლის საკათედრო ტაძრის აკვარელი",
  },
  {
    time: "18:00",
    icon: PenLine,
    title: "ხელისმოწერა",
    place: "ფურშეტინო აგარაკი",
    map: VENUE_MAP,
    image: "/images/furshetino-signing.jpg",
    alt: "ფურშეტინო აგარაკის საქორწილო გაფორმების აკვარელი",
  },
  {
    time: "18:30",
    icon: UtensilsCrossed,
    title: "ვახშამი",
    place: "ფურშეტინო აგარაკი",
    map: VENUE_MAP,
    image: "/images/furshetino-dinner.jpg",
    alt: "ფურშეტინო აგარაკის საქორწილო ვახშმის დარბაზი",
  },
];

export function Schedule() {
  return (
    <section className="relative overflow-hidden bg-backdrop px-0 pb-4 sm:px-6">
      <FloralCorner className="left-0 top-0 w-[48%] max-w-[13rem] sm:left-[-8%] sm:top-[-3%] sm:w-[52%] sm:max-w-[18rem]" />
      <FloralCorner
        className="bottom-0 right-0 w-[48%] max-w-[13rem] rotate-180 sm:bottom-[-4%] sm:right-[-8%] sm:w-[52%] sm:max-w-[18rem]"
        flip
        level="medium"
      />
      <FloralCorner
        className="left-0 top-[42%] w-[30%] max-w-[9rem] sm:left-[-6%] sm:w-[34%] sm:max-w-[11rem]"
        level="max"
      />
      <div className="relative z-10 mx-auto max-w-none sm:max-w-3xl">
        <Reveal>
          <div className="relative overflow-hidden rounded-none border-x-0 border-t-0 border-b border-ink/10 bg-parchment/95 py-5 shadow-none sm:rounded-2xl sm:border sm:p-7 sm:shadow-soft">
            <FloralCorner className="right-0 top-0 w-[38%] max-w-[10rem] sm:right-[-4%] sm:top-[-6%] sm:w-[42%] sm:max-w-[13rem]" flip level="medium" />
            <FloralCorner
              className="bottom-0 left-0 w-[36%] max-w-[9.5rem] rotate-180 sm:bottom-[-6%] sm:left-[-5%] sm:w-[40%] sm:max-w-[12rem]"
              level="max"
            />

            <div className="relative px-5 sm:px-0">
              <SparkleTitle className="font-geo text-lg tracking-[0.15em]">დღის განრიგი</SparkleTitle>
            </div>
            <ol className="mt-6 grid gap-5">
              {ITEMS.map(({ time, icon: Icon, title, place, map, image, alt }, i) => (
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
                    <p className="font-geo text-sm text-ink/70">{place}</p>
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
                      <div className="mt-4 flex justify-center -ml-[3.25rem] sm:ml-0">
                        <img
                          src={image}
                          alt={alt}
                          loading="lazy"
                          className="mx-auto w-full max-w-sm rounded-none border-y border-ink/10 shadow-soft sm:max-w-md sm:rounded-xl sm:border"
                        />
                      </div>
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
