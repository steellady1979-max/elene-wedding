export type FloralDensity = "min" | "medium" | "max";

/**
 * ვარდების რაოდენობა/ინტენსივობა მთელ ლენდინგზე.
 * შეცვალე ერთი მნიშვნელობა: "min" | "medium" | "max"
 */
export const FLORAL_DENSITY: FloralDensity = "medium";

const ORDER: Record<FloralDensity, number> = { min: 1, medium: 2, max: 3 };

/** ჩანს თუ არა მოცემული დეკორაცია მიმდინარე ინტენსივობაზე */
export function floralVisible(level: FloralDensity = "min") {
  return ORDER[FLORAL_DENSITY] >= ORDER[level];
}

/** გამჭვირვალობა ინტენსივობის მიხედვით (ტექსტი არასდროს იფარება) */
export const FLORAL_OPACITY: Record<FloralDensity, number> = {
  min: 0.45,
  medium: 0.65,
  max: 0.85,
};
