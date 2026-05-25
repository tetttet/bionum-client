import { PortraitLang } from "@/data/dummy/portrait";
import { getDateParts } from "@/utils/_func";
import { EN } from "./en";
import { KZ } from "./kz";
import { RU } from "./ru";
import { TR } from "./tr";

export type DestinyNumberValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 11 | 22;

export type DestinyNumberMap = Record<DestinyNumberValue, string>;
export type DestinyNumberContent = Record<PortraitLang, DestinyNumberMap>;

export const destinyNumberContent: DestinyNumberContent = {
  ru: RU,
  en: EN,
  tr: TR,
  kz: KZ,
};

function sumDigits(numbers: number[]): number {
  return numbers.reduce((acc, num) => acc + num, 0);
}

function reduceToDestinyNumber(value: number): DestinyNumberValue {
  if (value === 11 || value === 22) {
    return value;
  }

  let current = value;

  while (current > 9) {
    if (current === 11 || current === 22) {
      return current;
    }

    current = String(current)
      .split("")
      .map(Number)
      .reduce((acc, num) => acc + num, 0);
  }

  return current as DestinyNumberValue;
}

function extractDigitsFromBirthDate(dateString: string): number[] {
  const parts = getDateParts(dateString);

  if (!parts) return [];

  const day = parts.day.toString().padStart(2, "0");
  const month = parts.month.toString().padStart(2, "0");
  const year = parts.year.toString();

  return `${day}${month}${year}`.split("").map(Number);
}

export function calculateDestinyNumber(
  dateString: string,
): DestinyNumberValue | null {
  if (!dateString) return null;

  const digits = extractDigitsFromBirthDate(dateString);

  if (!digits.length) return null;

  const firstSum = sumDigits(digits);

  return reduceToDestinyNumber(firstSum);
}

export function getDestinyNumberMarkdown(
  lang: PortraitLang,
  destinyNumber: DestinyNumberValue,
): string {
  const safeLang: PortraitLang = destinyNumberContent[lang] ? lang : "en";
  return destinyNumberContent[safeLang][destinyNumber] ?? "";
}
