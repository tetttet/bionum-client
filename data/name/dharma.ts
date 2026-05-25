import { TEXTS } from "./dbTEXTS";

// dharma.ts
type Lang = "kz" | "tr" | "ru" | "en";

export interface DharmaResult {
  dharmaNumber: number;
  rawSum: number; // сумма цифр дня и месяца перед сведением
  lang: Lang;
  text: string;
}

/**
 * Парсит дату рождения из разных форматов и возвращает {day, month}.
 * Поддерживает: YYYY-MM-DD, DD.MM.YYYY, DD.MM, DD-MM, D/M/YYYY и т.п.
 */
function parseDayMonth(input: string): { day: number; month: number } | null {
  if (!input || typeof input !== "string") return null;
  input = input.trim();
  // Если формат ISO: YYYY-MM-DD
  const iso = input.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (iso) {
    return { day: Number(iso[3]), month: Number(iso[2]) };
  }
  // DD.MM.YYYY or DD.MM
  const dot = input.match(/^(\d{1,2})\.(\d{1,2})(?:\.(\d{2,4}))?$/);
  if (dot) {
    return { day: Number(dot[1]), month: Number(dot[2]) };
  }
  // DD-MM-YYYY or DD-MM
  const dash = input.match(/^(\d{1,2})-(\d{1,2})(?:-(\d{2,4}))?$/);
  if (dash) {
    return { day: Number(dash[1]), month: Number(dash[2]) };
  }
  // D/M/YYYY or D/M
  const slash = input.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?$/);
  if (slash) {
    return { day: Number(slash[1]), month: Number(slash[2]) };
  }
  // Попробуем распознать просто числа (например "20 11" или "20,11")
  const sep = input.split(/[\s,;]+/);
  if (sep.length >= 2) {
    const d = Number(sep[0]);
    const m = Number(sep[1]);
    if (!Number.isNaN(d) && !Number.isNaN(m)) return { day: d, month: m };
  }
  return null;
}

function sumDigits(n: number): number {
  return String(n)
    .split("")
    .map((c) => Number(c))
    .reduce((a, b) => a + b, 0);
}

/** Сводим до однозначного (1..9). Если получится 0 — возвращаем 0 (на случай неверных данных). */
function reduceToSingle(n: number): number {
  let x = n;
  while (x >= 10) {
    x = sumDigits(x);
  }
  return x;
}

/**
 * Основная экспортируемая функция.
 * @param birthDateStr - строка даты рождения (форматы: YYYY-MM-DD, DD.MM.YYYY, DD.MM, DD-MM, D/M/YYYY, "20 11" и т.д.)
 * @param lang - 'kz' | 'tr' | 'ru' | 'en'
 */
export function getDharma(
  birthDateStr: string,
  lang: Lang = "ru"
): DharmaResult {
  const parsed = parseDayMonth(birthDateStr);
  if (!parsed) {
    // в случае ошибки парсинга возвращаем 0 и понятное сообщение
    return {
      dharmaNumber: 0,
      rawSum: 0,
      lang,
      text:
        lang === "en"
          ? "Could not parse birth date. Please provide day and month (e.g. 1986-11-20 or 20.11 or 20/11)."
          : lang === "tr"
          ? "Doğum tarihi çözümlenemedi. Lütfen gün ve ayı belirtin (örn. 1986-11-20 veya 20.11)."
          : lang === "kz"
          ? "Туған күнді талдау мүмкін болмады. Күн мен айды көрсетіңіз (мысалы: 1986-11-20 немесе 20.11)."
          : "Не удалось распарсить дату. Укажите день и месяц (например: 1986-11-20 или 20.11).",
    };
  }

  const { day, month } = parsed;

  // Суммируем все цифры дня и месяца: например 20 и 11 => 2+0+1+1 = 4
  const rawSum = sumDigits(day) + sumDigits(month);
  const dharmaNumber = reduceToSingle(rawSum);

  const t = TEXTS[dharmaNumber] && TEXTS[dharmaNumber][lang];
  const text = t
    ? `${t.title}\n\n${t.body}`
    : // fallback на русский
      `${TEXTS[dharmaNumber].ru.title}\n\n${TEXTS[dharmaNumber].ru.body}`;

  return {
    dharmaNumber,
    rawSum,
    lang,
    text,
  };
}

/* Примеры использования:

import { getDharma } from "./dharma";

console.log(getDharma("1989-11-20", "ru"));
console.log(getDharma("20.11", "en"));
console.log(getDharma("5/3/1990", "tr"));
console.log(getDharma("01-09", "kz"));

*/
