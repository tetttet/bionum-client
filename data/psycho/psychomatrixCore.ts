// psychomatrixCore.ts
// Вся логика: расчёт психоматрицы + выбор текстов из JSON по языку

import enJson from "@/data/psycho/en.json";
import kzJson from "@/data/psycho/kz.json";
import ruJson from "@/data/psycho/ru.json";
import trJson from "@/data/psycho/tr.json";

import type { PortraitLang } from "../dummy/portrait";

// ======= ТИПЫ ДЛЯ ЦИФР И РЕЗУЛЬТАТА =======

export type Digit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type DigitCounts = Record<Digit, number>;

export interface PsychomatrixResult {
  birthDate: string;
  is21Century: boolean;
  baseDigits: string;
  baseSum: number;
  constant: 19 | null;
  primarySum: number;
  secondarySum: number;
  intermediate: number | null;
  thirdNumber: number | null;
  fourthNumber: number | null;
  digitsForMatrix: string;
  matrix: Record<Digit, string>;
  initialDigits: number[];
  sum1: number;
  sum2: number;
  sum3: number;
  sum4: number;
  allDigits: number[];
  counts: DigitCounts;
}

// ======= ТИПЫ ДЛЯ ПСИХО-ТЕКСТОВ (JSON) =======

export type PsychoCountKey =
  | "zero"
  | "one"
  | "two"
  | "three"
  | "four"
  | "five"
  | "sixPlus";

export interface PsychoCountBlock {
  label: string;
  text: string;
  recommendation?: string;
  near?: string;
  upgrade?: string;
}

export interface PsychoDigitData {
  title: string;
  general?: string;
  zero?: PsychoCountBlock;
  one?: PsychoCountBlock;
  two?: PsychoCountBlock;
  three?: PsychoCountBlock;
  four?: PsychoCountBlock;
  five?: PsychoCountBlock;
  sixPlus?: PsychoCountBlock;
}

export type PsychoJson = Record<string, PsychoDigitData>;

// ======= ЯЗЫКИ =======

export type SupportedPsychoLang = "ru" | "en" | "tr" | "kz";

const psychoDataByLang: Record<SupportedPsychoLang, PsychoJson> = {
  ru: ruJson as unknown as PsychoJson,
  en: enJson as unknown as PsychoJson,
  tr: trJson as unknown as PsychoJson,
  kz: kzJson as unknown as PsychoJson,
};

const normalizeLang = (lang: PortraitLang | string): SupportedPsychoLang => {
  if (lang === "ru" || lang === "en" || lang === "tr" || lang === "kz") {
    return lang;
  }

  return "ru";
};

const getPsychoDataByLang = (lang: PortraitLang | string): PsychoJson => {
  return psychoDataByLang[normalizeLang(lang)];
};

// ======= ХЕЛПЕРЫ ДЛЯ ЧИСЕЛ =======

/**
 * Разбиваем число на цифры (без нулей).
 */
export const getDigitsFromNumber = (num: number): number[] => {
  return String(Math.abs(num))
    .split("")
    .map((d) => parseInt(d, 10))
    .filter((d) => d !== 0);
};

const getDigitsFromString = (value: string): number[] => {
  return value
    .split("")
    .map((d) => parseInt(d, 10))
    .filter((d) => !Number.isNaN(d));
};

const getNonZeroDigitsFromString = (value: string): number[] => {
  return getDigitsFromString(value).filter((d) => d !== 0);
};

const getNumberDigitString = (num: number): string => {
  return String(Math.abs(num));
};

/**
 * Сумма цифр числа (один раз).
 * Например: 34 -> 3+4 = 7, 91 -> 9+1 = 10.
 * Никаких дальнейших "сжатий" до одной цифры мы НЕ делаем.
 */
export const sumDigitsOnce = (num: number): number => {
  const digits = getDigitsFromString(getNumberDigitString(num));
  return digits.reduce((acc, d) => acc + d, 0);
};

type DateParts = {
  day: number;
  month: number;
  year: number;
};

export type PsychomatrixDateInput = string | Date;

const padDatePart = (value: number) => String(value).padStart(2, "0");

const getDaysInMonth = (year: number, month: number): number => {
  return [
    31,
    year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28,
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
};

const isValidDateParts = ({ day, month, year }: DateParts): boolean => {
  if (
    !Number.isInteger(day) ||
    !Number.isInteger(month) ||
    !Number.isInteger(year)
  ) {
    return false;
  }

  if (year < 1000 || year > 9999) return false;
  if (month < 1 || month > 12) return false;

  return day >= 1 && day <= getDaysInMonth(year, month);
};

const parseDateObject = (value: Date): DateParts | null => {
  if (Number.isNaN(value.getTime())) return null;

  const hasUtcMidnightTime =
    value.getUTCHours() === 0 &&
    value.getUTCMinutes() === 0 &&
    value.getUTCSeconds() === 0 &&
    value.getUTCMilliseconds() === 0;

  const parts = hasUtcMidnightTime
    ? {
        day: value.getUTCDate(),
        month: value.getUTCMonth() + 1,
        year: value.getUTCFullYear(),
      }
    : {
        day: value.getDate(),
        month: value.getMonth() + 1,
        year: value.getFullYear(),
      };

  return isValidDateParts(parts) ? parts : null;
};

const parseBirthDate = (birthDate: PsychomatrixDateInput): DateParts => {
  if (birthDate instanceof Date) {
    const parts = parseDateObject(birthDate);

    if (parts) return parts;
  }

  if (typeof birthDate === "string") {
    const value = birthDate.trim();

    const isoMatch = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s].*)?$/.exec(value);
    if (isoMatch) {
      const parts = {
        year: parseInt(isoMatch[1], 10),
        month: parseInt(isoMatch[2], 10),
        day: parseInt(isoMatch[3], 10),
      };

      if (isValidDateParts(parts)) return parts;
    }

    const dotMatch = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(value);
    if (dotMatch) {
      const parts = {
        day: parseInt(dotMatch[1], 10),
        month: parseInt(dotMatch[2], 10),
        year: parseInt(dotMatch[3], 10),
      };

      if (isValidDateParts(parts)) return parts;
    }
  }

  throw new Error(
    "Неверный формат даты. Ожидается DD.MM.YYYY, YYYY-MM-DD, ISO string или Date",
  );
};

const formatBirthDate = ({ day, month, year }: DateParts): string => {
  return `${padDatePart(day)}.${padDatePart(month)}.${year}`;
};

const buildMatrix = (digitsForMatrix: string): Record<Digit, string> => {
  const counts = countDigits(digitsForMatrix);

  return {
    1: counts[1] > 0 ? "1".repeat(counts[1]) : "-",
    2: counts[2] > 0 ? "2".repeat(counts[2]) : "-",
    3: counts[3] > 0 ? "3".repeat(counts[3]) : "-",
    4: counts[4] > 0 ? "4".repeat(counts[4]) : "-",
    5: counts[5] > 0 ? "5".repeat(counts[5]) : "-",
    6: counts[6] > 0 ? "6".repeat(counts[6]) : "-",
    7: counts[7] > 0 ? "7".repeat(counts[7]) : "-",
    8: counts[8] > 0 ? "8".repeat(counts[8]) : "-",
    9: counts[9] > 0 ? "9".repeat(counts[9]) : "-",
  };
};

const countDigits = (digitsForMatrix: string): DigitCounts => {
  const counts: DigitCounts = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
  };

  getDigitsFromString(digitsForMatrix).forEach((d) => {
    if (d >= 1 && d <= 9) {
      counts[d as Digit] += 1;
    }
  });

  return counts;
};

/**
 * Основной расчёт психоматрицы по дате рождения.
 * Формат даты: DD.MM.YYYY, YYYY-MM-DD, ISO string или Date.
 */
export const calculatePsychomatrix = (
  birthDate: PsychomatrixDateInput,
): PsychomatrixResult => {
  const dateParts = parseBirthDate(birthDate);
  const normalizedBirthDate = formatBirthDate(dateParts);
  const dayStr = padDatePart(dateParts.day);
  const monthStr = padDatePart(dateParts.month);
  const yearStr = String(dateParts.year);
  const fullDateDigits = getDigitsFromString(dayStr + monthStr + yearStr);

  // Цифры даты без нулей
  const baseDigits = getNonZeroDigitsFromString(dayStr + monthStr + yearStr)
    .join("");
  const initialDigits = getDigitsFromString(baseDigits);

  if (initialDigits.length === 0) {
    throw new Error("Не удалось получить цифры из даты рождения");
  }

  const is21Century = dateParts.year >= 2000;
  const baseSum = fullDateDigits.reduce((acc, d) => acc + d, 0);
  const constant = is21Century ? 19 : null;
  const primarySum = baseSum;
  const secondarySum = sumDigitsOnce(primarySum);

  let intermediate: number | null = null;
  let thirdNumber: number | null = null;
  let fourthNumber: number | null = null;
  const matrixParts = [
    baseDigits,
    getNumberDigitString(primarySum),
    getNumberDigitString(secondarySum),
  ];

  if (is21Century) {
    thirdNumber = primarySum + 19;
    fourthNumber =
      Math.abs(thirdNumber) < 10 ? thirdNumber : sumDigitsOnce(thirdNumber);
    matrixParts.push(
      getNumberDigitString(thirdNumber),
      getNumberDigitString(fourthNumber),
      getNumberDigitString(19),
    );
  } else {
    intermediate = initialDigits[0] * 2;
    thirdNumber = primarySum - intermediate;
    fourthNumber =
      Math.abs(thirdNumber) < 10 ? thirdNumber : sumDigitsOnce(thirdNumber);
    matrixParts.push(
      getNumberDigitString(thirdNumber),
      getNumberDigitString(fourthNumber),
    );
  }

  const digitsForMatrix = matrixParts.join("");

  const allDigits = getDigitsFromString(digitsForMatrix);
  const counts = countDigits(digitsForMatrix);
  const matrix = buildMatrix(digitsForMatrix);

  return {
    birthDate: normalizedBirthDate,
    is21Century,
    baseDigits,
    baseSum,
    constant,
    primarySum,
    secondarySum,
    intermediate,
    thirdNumber,
    fourthNumber,
    digitsForMatrix,
    matrix,
    initialDigits,
    sum1: primarySum,
    sum2: secondarySum,
    sum3: thirdNumber ?? 0,
    sum4: fourthNumber ?? 0,
    allDigits,
    counts,
  };
};

// ======= ЛОГИКА ВЫБОРА ТЕКСТА ПО КОЛИЧЕСТВУ ЦИФР =======

/**
 * Маппинг количества в ключ JSON:
 * 0 → zero
 * 1 → one
 * 2 → two
 * 3 → three
 * 4 → four
 * 5 → five
 * 6+ → sixPlus
 */
export const getCountKey = (count: number): PsychoCountKey => {
  if (count <= 0) return "zero";
  if (count === 1) return "one";
  if (count === 2) return "two";
  if (count === 3) return "three";
  if (count === 4) return "four";
  if (count === 5) return "five";
  return "sixPlus";
};

export interface DigitDescription {
  digit: Digit;
  count: number;
  title: string;
  general?: string;
  label?: string;
  text?: string;
  recommendation?: string;
  near?: string;
  upgrade?: string;
}

/**
 * Получаем описание по конкретной цифре и количеству повторений
 * с учётом выбранного языка.
 */
export const getDescriptionForDigit = (
  digit: Digit,
  count: number,
  lang: PortraitLang,
): DigitDescription | null => {
  const psychoData = getPsychoDataByLang(lang);
  const digitKey = String(digit);
  const data = psychoData[digitKey];

  if (!data) {
    return null;
  }

  // 1. Пытаемся взять "идеальный" ключ по количеству
  const primaryKey = getCountKey(count);
  let block: PsychoCountBlock | undefined = data[primaryKey];
  let usedKey: PsychoCountKey | null = block ? primaryKey : null;

  // 2. Если блока нет — откатываемся к ближайшему меньшему количеству
  if (!block) {
    const start = Math.min(Math.max(count - 1, 0), 6);

    for (let c = start; c >= 0; c--) {
      const k = getCountKey(c);

      if (k === primaryKey || k === usedKey) continue;

      const candidate = data[k];
      if (candidate) {
        block = candidate;
        usedKey = k;
        break;
      }
    }
  }

  // 3. Если блока нет и нет general — возвращаем null
  if (!block && !data.general) {
    return null;
  }

  return {
    digit,
    count,
    title: data.title,
    general: data.general,
    label: block?.label,
    text: block?.text,
    recommendation: block?.recommendation,
    near: block?.near,
    upgrade: block?.upgrade,
  };
};
