import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

import { LANGUAGE_KEY } from "@/constants/params";
import {
  ensureAppNotificationChannel,
  ensureNotificationPermission,
  normalizeNotificationLang,
  scheduleLocalNotification,
  type NotificationLang,
} from "@/services/notificationCenter";

export type ReminderLang = NotificationLang;

type ReminderSlot = "midday" | "evening";

type ReminderMessage = {
  title: string;
  body: string;
};

type ReminderDictionary = Record<
  ReminderLang,
  Record<ReminderSlot, ReminderMessage[]>
>;

type ReminderScheduleMeta = {
  version: number;
  lang: ReminderLang;
  scheduledAt: string;
  scheduledThrough: string;
  ids: string[];
};

const DAILY_REMINDER_META_KEY = "notifications:daily-reminders:meta:v1";
const DAILY_REMINDER_VERSION = 1;
const DAYS_TO_SCHEDULE = 30;
const RESCHEDULE_THRESHOLD_DAYS = 5;
const MINUTES_BEFORE_TRIGGER = 5;

const REMINDERS: ReminderDictionary = {
  ru: {
    midday: [
      {
        title: "Пора пройтись 👟",
        body: "Если шагов сегодня пока немного, добавь короткую прогулку. Даже 10 минут хорошо перезапускают день.",
      },
      {
        title: "Прогноз на день ✨",
        body: "Сегодня лучше работают спокойствие и уверенные шаги. Сделай одно важное действие без суеты.",
      },
      {
        title: "Немного движения 🌿",
        body: "Тело любит ритм. Пройдись чуть-чуть, разомнись и верни себе ясность.",
      },
      {
        title: "Мягкий импульс ☀️",
        body: "Пусть день не застаивается. Пара сотен шагов сейчас, и энергии станет заметно больше.",
      },
      {
        title: "День в движении 💙",
        body: "Иногда лучший способ собраться — просто выйти и пройтись. Небольшая активность уже считается.",
      },
    ],
    evening: [
      {
        title: "Вечерний ритм 🌙",
        body: "До конца дня ещё есть время красиво добрать шаги. Небольшая прогулка сейчас пойдёт на пользу.",
      },
      {
        title: "Спокойный финиш ✨",
        body: "Закрой день лёгким движением и ясной головой. Даже короткая прогулка вечером ощущается приятно.",
      },
      {
        title: "Ещё немного энергии 🚶",
        body: "Если хочешь мягко снять напряжение, выйди на несколько минут. Вечер любит спокойный темп.",
      },
      {
        title: "Тёплое напоминание 💫",
        body: "Сделай для себя что-то простое и полезное: движение, воздух и ещё немного шагов.",
      },
      {
        title: "Красивое завершение дня 🤍",
        body: "Подарь себе тихую прогулку перед отдыхом. Это хороший способ выдохнуть и завершить день.",
      },
    ],
  },
  en: {
    midday: [
      {
        title: "Time to move 👟",
        body: "If your step count is still low today, take a short walk. Even 10 minutes can reset the day.",
      },
      {
        title: "Daily vibe ✨",
        body: "Today works best with calm focus and confident steps. Do one important thing without rushing.",
      },
      {
        title: "A little movement 🌿",
        body: "Your body loves rhythm. Walk a bit, stretch, and bring your mind back into focus.",
      },
      {
        title: "Gentle nudge ☀️",
        body: "Do not let the day go flat. A few hundred steps right now can lift your energy.",
      },
      {
        title: "Move with the day 💙",
        body: "Sometimes the best way to refocus is simply to walk. A little activity already counts.",
      },
    ],
    evening: [
      {
        title: "Evening rhythm 🌙",
        body: "There is still time to finish the day with a few more steps. A short walk now would feel great.",
      },
      {
        title: "Soft finish ✨",
        body: "Close the day with light movement and a clear head. Even a short evening walk helps.",
      },
      {
        title: "A bit more energy 🚶",
        body: "If you want to release some tension, step outside for a few minutes. Evenings love a calm pace.",
      },
      {
        title: "Warm reminder 💫",
        body: "Do one simple, good thing for yourself: move, breathe fresh air, and add a few more steps.",
      },
      {
        title: "A beautiful end to the day 🤍",
        body: "Give yourself a quiet walk before rest. It is a lovely way to exhale and wrap up the day.",
      },
    ],
  },
  kz: {
    midday: [
      {
        title: "Жүруге уақыт 👟",
        body: "Егер бүгін қадам аз болса, қысқа серуенге шық. Тіпті 10 минуттың өзі сергітеді.",
      },
      {
        title: "Күн болжамы ✨",
        body: "Бүгін сабыр мен сенімді қадамдар жақсы нәтиже береді. Бір маңызды істі асықпай аяқта.",
      },
      {
        title: "Сәл қозғалыс 🌿",
        body: "Дене ырғақты жақсы көреді. Аздап жүріп, сергіп, ойыңды жинап ал.",
      },
      {
        title: "Жұмсақ серпін ☀️",
        body: "Күн тоқтап қалмасын. Қазір бірнеше жүз қадам жасасаң, энергияң арта түседі.",
      },
      {
        title: "Қозғалыстағы күн 💙",
        body: "Кейде жиналудың ең жақсы жолы — жай ғана жүріп келу. Аз ғана белсенділік те маңызды.",
      },
    ],
    evening: [
      {
        title: "Кешкі ырғақ 🌙",
        body: "Күн аяқталғанша әлі уақыт бар. Біраз жүріп, қадамдарыңды әдемі толықтыр.",
      },
      {
        title: "Кешті тыныш аяқта ✨",
        body: "Күнді жеңіл қозғалыспен жап. Қысқа серуен кешкі демалысқа жақсы әсер етеді.",
      },
      {
        title: "Тағы аздап қуат 🚶",
        body: "Шаршауды жұмсақ түсіргің келсе, бірнеше минутқа сыртқа шық. Кеш тыныш қарқынды ұнатады.",
      },
      {
        title: "Жылы еске салу 💫",
        body: "Өзің үшін пайдалы бір нәрсе жаса: қозғалыс, таза ауа және тағы бірнеше қадам.",
      },
      {
        title: "Күннің әдемі соңы 🤍",
        body: "Демалыс алдында тыныш серуенге уақыт бөл. Бұл күнді жайлы аяқтаудың жақсы жолы.",
      },
    ],
  },
  tr: {
    midday: [
      {
        title: "Yürüme zamanı 👟",
        body: "Bugün adımın az kaldıysa kısa bir yürüyüş yap. 10 dakika bile günü tazeler.",
      },
      {
        title: "Günün mesajı ✨",
        body: "Bugün sakinlik ve kararlı adımlar iyi çalışır. Tek bir önemli işi acele etmeden tamamla.",
      },
      {
        title: "Biraz hareket 🌿",
        body: "Beden ritmi sever. Azıcık yürü, esne ve zihnini toparla.",
      },
      {
        title: "Nazik bir itiş ☀️",
        body: "Günün enerjisi beklemesin. Şimdi atacağın birkaç yüz adım fark yaratır.",
      },
      {
        title: "Hareketli bir gün 💙",
        body: "Bazen toparlanmanın en iyi yolu sadece yürümektir. Küçük bir hareket bile yeter.",
      },
    ],
    evening: [
      {
        title: "Akşam ritmi 🌙",
        body: "Günün bitmesine daha var. Biraz yürüyüp adımlarını güzelce tamamlayabilirsin.",
      },
      {
        title: "Sakin kapanış ✨",
        body: "Günü hafif bir hareketle kapat. Kısa bir akşam yürüyüşü gerçekten iyi gelir.",
      },
      {
        title: "Biraz daha enerji 🚶",
        body: "Gerginliği yumuşatmak istiyorsan birkaç dakikalığına dışarı çık. Akşam sakin tempoyu sever.",
      },
      {
        title: "Tatlı bir hatırlatma 💫",
        body: "Kendin için basit ve faydalı bir şey yap: hareket, temiz hava ve birkaç adım daha.",
      },
      {
        title: "Güzel bir gün sonu 🤍",
        body: "Dinlenmeden önce kısa, sakin bir yürüyüş yap. Günü tamamlamanın hoş bir yolu.",
      },
    ],
  },
};

const pad = (value: number) => String(value).padStart(2, "0");

const formatDateKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const isSameDay = (left: Date, right: Date) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pickRandom = <T,>(items: T[]) =>
  items[getRandomInt(0, Math.max(items.length - 1, 0))];

const getWindowDate = (baseDate: Date, hour: number, minute = 0) => {
  const date = new Date(baseDate);
  date.setHours(hour, minute, 0, 0);
  return date;
};

const getRandomDateInWindow = (
  baseDate: Date,
  startHour: number,
  endHour: number,
  now: Date,
) => {
  const windowStart = getWindowDate(baseDate, startHour, 0);
  const windowEnd = getWindowDate(baseDate, endHour, 0);
  const lastMoment = new Date(windowEnd.getTime() - 1000);

  const minDate = isSameDay(baseDate, now)
    ? new Date(now.getTime() + MINUTES_BEFORE_TRIGGER * 60 * 1000)
    : windowStart;

  const effectiveStart =
    minDate.getTime() > windowStart.getTime() ? minDate : windowStart;

  if (effectiveStart.getTime() >= lastMoment.getTime()) {
    return null;
  }

  return new Date(
    getRandomInt(effectiveStart.getTime(), lastMoment.getTime()),
  );
};

const readScheduleMeta = async (): Promise<ReminderScheduleMeta | null> => {
  try {
    const raw = await AsyncStorage.getItem(DAILY_REMINDER_META_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<ReminderScheduleMeta>;
    if (
      parsed &&
      typeof parsed.version === "number" &&
      typeof parsed.lang === "string" &&
      typeof parsed.scheduledAt === "string" &&
      typeof parsed.scheduledThrough === "string" &&
      Array.isArray(parsed.ids)
    ) {
      return {
        version: parsed.version,
        lang: normalizeNotificationLang(parsed.lang),
        scheduledAt: parsed.scheduledAt,
        scheduledThrough: parsed.scheduledThrough,
        ids: parsed.ids.filter((id): id is string => typeof id === "string"),
      };
    }
  } catch (error) {
    console.warn("Failed to parse daily reminder meta", error);
  }

  return null;
};

const writeScheduleMeta = async (meta: ReminderScheduleMeta) => {
  await AsyncStorage.setItem(DAILY_REMINDER_META_KEY, JSON.stringify(meta));
};

const clearScheduleMeta = async () => {
  await AsyncStorage.removeItem(DAILY_REMINDER_META_KEY);
};

const cancelScheduledByIds = async (ids: string[]) => {
  await Promise.all(
    ids.map(async (id) => {
      try {
        await Notifications.cancelScheduledNotificationAsync(id);
      } catch {
        // ignore stale ids
      }
    }),
  );
};

const shouldReschedule = (
  meta: ReminderScheduleMeta | null,
  lang: ReminderLang,
  now: Date,
) => {
  if (!meta) return true;
  if (meta.version !== DAILY_REMINDER_VERSION) return true;
  if (meta.lang !== lang) return true;
  if (!meta.ids.length) return true;

  const thresholdKey = formatDateKey(addDays(now, RESCHEDULE_THRESHOLD_DAYS));
  return meta.scheduledThrough < thresholdKey;
};

const scheduleOneReminder = async (
  lang: ReminderLang,
  slot: ReminderSlot,
  scheduledFor: Date,
  now: Date,
) => {
  const triggerDate =
    slot === "midday"
      ? getRandomDateInWindow(scheduledFor, 10, 12, now)
      : getRandomDateInWindow(scheduledFor, 16, 18, now);

  if (!triggerDate) {
    return null;
  }

  const message = pickRandom(REMINDERS[lang][slot]);

  const identifier = await scheduleLocalNotification({
    title: message.title,
    body: message.body,
    data: {
      source: "daily-reminders",
      slot,
      lang,
      dateKey: formatDateKey(scheduledFor),
    },
    triggerDate,
  });

  return identifier;
};

export async function syncDailyReminderNotifications(
  preferredLang?: string | null,
) {
  const fallbackLang = normalizeNotificationLang(preferredLang);

  try {
    const lang = normalizeNotificationLang(
      preferredLang ?? (await AsyncStorage.getItem(LANGUAGE_KEY)),
    );
    const now = new Date();
    const existingMeta = await readScheduleMeta();

    if (!shouldReschedule(existingMeta, lang, now)) {
      return { status: "up_to_date" as const, lang };
    }

    await ensureAppNotificationChannel();

    const permitted = await ensureNotificationPermission();
    if (!permitted) {
      return { status: "permission_denied" as const, lang };
    }

    if (existingMeta?.ids?.length) {
      await cancelScheduledByIds(existingMeta.ids);
    }

    const ids: string[] = [];
    const firstDay = startOfDay(now);

    for (let offset = 0; offset < DAYS_TO_SCHEDULE; offset += 1) {
      const day = addDays(firstDay, offset);

      const middayId = await scheduleOneReminder(lang, "midday", day, now);
      if (middayId) ids.push(middayId);

      const eveningId = await scheduleOneReminder(lang, "evening", day, now);
      if (eveningId) ids.push(eveningId);
    }

    if (!ids.length) {
      await clearScheduleMeta();
      return { status: "empty_schedule" as const, lang };
    }

    await writeScheduleMeta({
      version: DAILY_REMINDER_VERSION,
      lang,
      scheduledAt: now.toISOString(),
      scheduledThrough: formatDateKey(addDays(firstDay, DAYS_TO_SCHEDULE - 1)),
      ids,
    });

    return {
      status: "scheduled" as const,
      lang,
      count: ids.length,
    };
  } catch (error) {
    console.warn("Failed to sync daily reminders", error);
    return { status: "error" as const, lang: fallbackLang };
  }
}
