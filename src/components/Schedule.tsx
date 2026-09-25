import { Reveal } from "./Reveal";

import { SparkleTitle } from "./SparkleTitle";
import { Camera, Church, MapPin, UtensilsCrossed } from "lucide-react";
const writersHouse = { url: "/images/writers-house.jpg" };
const sioni = { url: "/images/sioni.jpg" };
const lisiMere = { url: "/images/lisi-mere.jpg" };

const WRITERS_HOUSE_MAP =
  "https://www.google.com/maps/place/Writers'+House+of+Georgia/@41.6902356,44.7971553,650m/data=!3m2!1e3!4b1!4m6!3m5!1s0x40440cf20e8d460d:0xedb1bb704c7c475e!8m2!3d41.6902356!4d44.7997302!16s%2Fg%2F11c6z6r18f";
const SIONI_MAP =
  "https://www.google.com/maps/place/Sioni+Church/@41.6902356,44.7971553,650m/data=!3m1!1e3!4m6!3m5!1s0x40440d0079a63b3f:0xd68818f2272b606d!8m2!3d41.6913325!4d44.8074476!16s%2Fg%2F11z5v57p68";
const LISI_MAP =
  "https://www.google.com/maps/place/Lisi+Mere/@41.7492613,44.682438,650m/data=!3m2!1e3!4b1!4m6!3m5!1s0x404473d22f726ca1:0x29a77e334817e08e!8m2!3d41.7492613!4d44.6850129!16s%2Fg%2F11fb0849g8";

const ITEMS = [
  {
    time: "13:00",
    icon: Camera,
    title: "ფოტოსესია",
    place: "მწერალთა სახლი",
    map: WRITERS_HOUSE_MAP,
    image: writersHouse.url,
    width: 1024,
    height: 768,
    alt: "მწერალთა სახლის აკვარელი",
  },
  {
    time: "15:00",
    icon: Church,
    title: "ჯვრისწერა",
    place: "სიონის ტაძარი",
    map: SIONI_MAP,
    image: sioni.url,
    width: 1366,
    height: 768,
    alt: "სიონის ტაძრის აკვარელი",
  },
  {
    time: "17:00",
    icon: UtensilsCrossed,
    title: "ვახშამი",
    place: "ლისი მერე",
    map: LISI_MAP,
    image: lisiMere.url,
    width: 682,
    height: 1024,
    alt: "ლისი მერეს საქორწილო დარბაზის აკვარელი",
  },
];

export function Schedule() {
  return (
    <section className="relative overflow-hidden bg-backdrop px-0 pb-4 sm:px-6">
      <div className="relative z-10 mx-auto max-w-none sm:max-w-3xl">
        <Reveal>
          <div className="relative overflow-hidden rounded-none border-x-0 border-t-0 border-b border-ink/10 bg-parchment/95 py-5 shadow-none sm:rounded-2xl sm:border sm:p-7 sm:shadow-soft">

            <div className="relative px-5 sm:px-0">
              <SparkleTitle className="font-geo text-lg tracking-[0.15em]">დღის განრიგი</SparkleTitle>
            </div>
            <ol className="mt-6 grid gap-5">
              {ITEMS.map(({ time, icon: Icon, title, place, map, image, alt, width, height }, i) => (
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
                          src={image} width={width} height={height} decoding="async"
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
