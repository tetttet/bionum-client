import { PortraitLang } from "@/data/dummy/portrait";

const padDatePart = (value: number) => String(value).padStart(2, "0");

type DateParts = {
  day: number;
  month: number;
  year: number;
};

export function getDateParts(
  value: string | Date | null | undefined,
): DateParts | null {
  if (!value) return null;

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;

    return {
      day: value.getDate(),
      month: value.getMonth() + 1,
      year: value.getFullYear(),
    };
  }

  return parseDateString({ s: value });
}

export function parseDateOnlyToLocalDate(
  value: string | Date | null | undefined,
) {
  const parts = getDateParts(value);

  if (!parts) return null;

  return new Date(parts.year, parts.month - 1, parts.day);
}

export function toDateOnlyString(date?: Date | null): string {
  if (!date) return "";

  const year = date.getFullYear();
  const month = padDatePart(date.getMonth() + 1);
  const day = padDatePart(date.getDate());

  return `${year}-${month}-${day}`;
}

export function shiftDateOnlyString(value: string, dayOffset: number): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match || !Number.isInteger(dayOffset)) return value;

  let year = Number(match[1]);
  let month = Number(match[2]);
  let day = Number(match[3]);

  let remaining = dayOffset;
  while (remaining < 0) {
    day -= 1;
    if (day < 1) {
      month -= 1;
      if (month < 1) {
        month = 12;
        year -= 1;
      }
      day = getDaysInMonth(year, month);
    }
    remaining += 1;
  }

  while (remaining > 0) {
    day += 1;
    const daysInMonth = getDaysInMonth(year, month);
    if (day > daysInMonth) {
      day = 1;
      month += 1;
      if (month > 12) {
        month = 1;
        year += 1;
      }
    }
    remaining -= 1;
  }

  return `${year}-${padDatePart(month)}-${padDatePart(day)}`;
}

export function formatDateOnlyForDisplay(value?: string | null): string {
  if (!value) return "";

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return "";

  const [, year, month, day] = match;
  return `${day}.${month}.${year}`;
}

export function formatDateOnlyForLocale(
  value: string | Date | null | undefined,
  locale = "en-GB",
  options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  },
) {
  const date = parseDateOnlyToLocalDate(value);

  if (!date) return "—";

  return date.toLocaleDateString(locale, options);
}

export function formatDate(date?: string | null): string {
  if (!date) return "";
  const [year, month, day] = date.split("-");
  return `${day}.${month}.${year}`;
}

export function isValidDate({ d, m, y }: { d: number; m: number; y: number }) {
  if (y < 1000 || y > 9999) return false;
  if (m < 1 || m > 12) return false;
  const mdays = getDaysInMonth(y, m);
  if (d < 1 || d > mdays) return false;
  return true;
}

function getDaysInMonth(year: number, month: number) {
  return [
    31,
    isLeapYear(year) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ][month - 1];
}

function isLeapYear(year: number) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

export function reduceToDigit({ n }: { n: number }) {
  n = Math.abs(Math.floor(Number(n)) || 0);
  while (n > 9 && n !== 11 && n !== 22) {
    n = sumDigits({ x: n });
  }
  return n;
}

export function sumDigits({ x }: { x: number }) {
  return String(x)
    .split("")
    .reduce((acc, ch) => acc + Number(ch || 0), 0);
}

export function formatDateMatrix({ d, m, y }: { d: number; m: number; y: number }) {
  const dd = padDatePart(d);
  const mm = padDatePart(m);
  return `${dd}.${mm}.${y}`;
}

export function parseDateString({ s }: { s: string }) {
  if (!s || typeof s !== "string") return null;
  s = s.trim();

  // 1) ISO формат YYYY-MM-DD или YYYY/MM/DD
  const isoMatch = s.match(
    /^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})(?:[T\s].*)?$/,
  );
  if (isoMatch) {
    const y = parseInt(isoMatch[1], 10);
    const m = parseInt(isoMatch[2], 10);
    const d = parseInt(isoMatch[3], 10);
    if (isValidDate({ d, m, y })) return { day: d, month: m, year: y };
  }

  // 2) DD.MM.YYYY or DD/MM/YYYY or DD-MM-YYYY
  const dotMatch = s.match(/^(\d{1,2})[.\-\/](\d{1,2})[.\-\/](\d{2,4})$/);
  if (dotMatch) {
    let d = parseInt(dotMatch[1], 10);
    let m = parseInt(dotMatch[2], 10);
    let y = parseInt(dotMatch[3], 10);
    if (y < 100) {
      // предположим 19xx/20xx: если > 30 -> 1900s, иначе 2000s (простая эвристика)
      y += y > 30 ? 1900 : 2000;
    }
    if (isValidDate({ d, m, y })) return { day: d, month: m, year: y };
  }

  // date_of_birth is a calendar date, so avoid Date string parsing here.
  return null;
}

export const formatDateReverse = (date: string | Date) => {
  const parts = getDateParts(date);

  if (!parts) return "";

  return `${parts.year}-${padDatePart(parts.month)}-${padDatePart(parts.day)}`;
};

export type LocaleKey = "ru" | "en" | "tr" | "ar" | "kz";

export function getLocale(lang: PortraitLang): LocaleKey {
  const value = String(lang || "").toLowerCase();

  if (value.includes("tr")) return "tr";
  if (value.includes("en")) return "en";
  if (value.includes("ar")) return "ar";
  if (value.includes("kz") || value.includes("kk")) return "kz";

  return "ru";
}
