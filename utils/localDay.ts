const LOCALE_BY_LANG: Record<string, string> = {
  ru: "ru-RU",
  en: "en-US",
  tr: "tr-TR",
  kz: "kk-KZ",
};

export function getUserTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return undefined;
  }
}

export function getTodayDateKey(date: Date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatLocalDate(lang: string, date: Date = new Date()) {
  const locale = LOCALE_BY_LANG[lang] || "en-US";
  const timeZone = getUserTimeZone();
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  if (timeZone) {
    options.timeZone = timeZone;
  }

  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function getMillisecondsUntilNextLocalMidnight(
  from: Date = new Date(),
) {
  const nextMidnight = new Date(from);
  nextMidnight.setHours(24, 0, 0, 0);

  return Math.max(nextMidnight.getTime() - from.getTime(), 1000);
}
