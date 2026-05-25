import AsyncStorage from "@react-native-async-storage/async-storage";

import type { PortraitLang } from "@/data/dummy/portrait";

export type StepStatsLang = "en" | "ru" | "tr" | "kz";

export type WeekDayStats = {
  dateKey: string;
  short: string;
  full: string;
  time: string;
  steps: number;
  km: number;
  kcal: number;
  progress: number;
  isToday: boolean;
};

type StoredDayStats = {
  dateKey: string;
  steps: number;
  km: number;
  kcal: number;
  updatedAt: string;
};

type StoredWeekData = {
  weekKey: string;
  goalSteps: number;
  days: Record<string, StoredDayStats>;
};

export type TodayStoredStats = StoredDayStats & {
  goalSteps: number;
};

export const DEFAULT_DAILY_STEP_GOAL = 10000;

const STEP_LENGTH_M = 0.75;
const KCAL_PER_STEP = 0.04;
const STORAGE_WEEK_KEY = "health:steps:current-week-v1";

const translations: Record<
  StepStatsLang,
  {
    weekdayShort: string[];
    weekdayFull: string[];
  }
> = {
  ru: {
    weekdayShort: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
    weekdayFull: [
      "Понедельник",
      "Вторник",
      "Среда",
      "Четверг",
      "Пятница",
      "Суббота",
      "Воскресенье",
    ],
  },
  en: {
    weekdayShort: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    weekdayFull: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  },
  tr: {
    weekdayShort: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
    weekdayFull: [
      "Pazartesi",
      "Salı",
      "Çarşamba",
      "Perşembe",
      "Cuma",
      "Cumartesi",
      "Pazar",
    ],
  },
  kz: {
    weekdayShort: ["Дс", "Сс", "Ср", "Бс", "Жм", "Сб", "Жс"],
    weekdayFull: [
      "Дүйсенбі",
      "Сейсенбі",
      "Сәрсенбі",
      "Бейсенбі",
      "Жұма",
      "Сенбі",
      "Жексенбі",
    ],
  },
};

export const normalizeStepStatsLang = (
  lang?: PortraitLang | StepStatsLang | null,
): StepStatsLang => {
  if (lang === "en" || lang === "ru" || lang === "tr" || lang === "kz") {
    return lang;
  }

  return "en";
};

const pad = (n: number) => String(n).padStart(2, "0");

export const getStartOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const formatStepDateKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const formatTimeLabel = (iso?: string) => {
  if (!iso) return "—";

  const date = new Date(iso);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const getWeekStart = (date = new Date()) => {
  const start = getStartOfDay(date);
  const jsDay = start.getDay();
  const diff = jsDay === 0 ? -6 : 1 - jsDay;

  start.setDate(start.getDate() + diff);
  return start;
};

const getWeekKey = (date = new Date()) => formatStepDateKey(getWeekStart(date));

const getCurrentWeekDateKeys = (date = new Date()) => {
  const start = getWeekStart(date);

  return Array.from({ length: 7 }, (_, index) => {
    const current = new Date(start);
    current.setDate(start.getDate() + index);
    return formatStepDateKey(current);
  });
};

const buildEmptyWeek = (goalSteps: number, now = new Date()): StoredWeekData => ({
  weekKey: getWeekKey(now),
  goalSteps,
  days: {},
});

export const stepsToKm = (steps: number) => (steps * STEP_LENGTH_M) / 1000;
export const stepsToKcal = (steps: number) => steps * KCAL_PER_STEP;

const parseWeekData = (
  raw: string | null,
  fallbackGoalSteps: number,
  now = new Date(),
): StoredWeekData => {
  if (!raw) return buildEmptyWeek(fallbackGoalSteps, now);

  try {
    const parsed = JSON.parse(raw) as Partial<StoredWeekData>;
    const currentWeekKey = getWeekKey(now);

    if (!parsed || parsed.weekKey !== currentWeekKey) {
      return buildEmptyWeek(fallbackGoalSteps, now);
    }

    return {
      weekKey: currentWeekKey,
      goalSteps:
        typeof parsed.goalSteps === "number"
          ? parsed.goalSteps
          : fallbackGoalSteps,
      days: parsed.days && typeof parsed.days === "object" ? parsed.days : {},
    };
  } catch {
    return buildEmptyWeek(fallbackGoalSteps, now);
  }
};

const saveWeekData = async (data: StoredWeekData) => {
  await AsyncStorage.setItem(STORAGE_WEEK_KEY, JSON.stringify(data));
};

export const saveTodayStats = async (
  steps: number,
  goalSteps = DEFAULT_DAILY_STEP_GOAL,
  now = new Date(),
) => {
  const raw = await AsyncStorage.getItem(STORAGE_WEEK_KEY);
  const weekData = parseWeekData(raw, goalSteps, now);
  const dateKey = formatStepDateKey(now);

  weekData.goalSteps = goalSteps;
  weekData.days[dateKey] = {
    dateKey,
    steps,
    km: stepsToKm(steps),
    kcal: stepsToKcal(steps),
    updatedAt: now.toISOString(),
  };

  const allowedKeys = new Set(getCurrentWeekDateKeys(now));
  const cleanedDays = Object.fromEntries(
    Object.entries(weekData.days).filter(([key]) => allowedKeys.has(key)),
  );

  await saveWeekData({
    ...weekData,
    days: cleanedDays,
  });
};

export const loadStoredTodayStats = async (
  goalSteps = DEFAULT_DAILY_STEP_GOAL,
  now = new Date(),
): Promise<TodayStoredStats | null> => {
  const raw = await AsyncStorage.getItem(STORAGE_WEEK_KEY);
  const weekData = parseWeekData(raw, goalSteps, now);
  const todayKey = formatStepDateKey(now);
  const stored = weekData.days[todayKey];

  if (!stored) return null;

  return {
    ...stored,
    goalSteps: weekData.goalSteps || goalSteps,
  };
};

export const loadWeeklyHistory = async (
  goalSteps = DEFAULT_DAILY_STEP_GOAL,
  lang: StepStatsLang = "ru",
  now = new Date(),
): Promise<WeekDayStats[]> => {
  const raw = await AsyncStorage.getItem(STORAGE_WEEK_KEY);
  const weekData = parseWeekData(raw, goalSteps, now);
  const weekStart = getWeekStart(now);
  const todayKey = formatStepDateKey(now);
  const currentLang = normalizeStepStatsLang(lang);
  const t = translations[currentLang];

  return Array.from({ length: 7 }, (_, index) => {
    const current = new Date(weekStart);
    current.setDate(weekStart.getDate() + index);

    const dateKey = formatStepDateKey(current);
    const stored = weekData.days[dateKey];

    const steps = stored?.steps ?? 0;
    const km = stored?.km ?? stepsToKm(steps);
    const kcal = stored?.kcal ?? stepsToKcal(steps);

    return {
      dateKey,
      short: t.weekdayShort[index],
      full: t.weekdayFull[index],
      time: formatTimeLabel(stored?.updatedAt),
      steps,
      km,
      kcal,
      progress: Math.min(steps / (weekData.goalSteps || goalSteps), 1),
      isToday: dateKey === todayKey,
    };
  });
};
