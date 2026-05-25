import type {
  StepNotificationCandidate,
  StepNotificationContentKey,
  StepNotificationLang,
} from "./stepNotificationEngine";

export type StepNotificationMessage = {
  title: string;
  body: string;
};

type MessageBuilder = (
  candidate: StepNotificationCandidate,
) => StepNotificationMessage;

const formatSteps = (value: number) => `${Math.max(0, Math.round(value))}`;

const getSeedIndex = (seed: string, size: number) => {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return size === 0 ? 0 : hash % size;
};

const pickVariant = <T,>(items: T[], seed: string) =>
  items[getSeedIndex(seed, items.length)];

const MESSAGES: Record<
  StepNotificationLang,
  Record<StepNotificationContentKey, MessageBuilder[]>
> = {
  ru: {
    progress: [
      (candidate) => ({
        title: "Цель уже движется вперёд",
        body: `Сегодня уже ${formatSteps(candidate.progress.currentSteps)} из ${formatSteps(candidate.progress.goalSteps)} шагов. До цели осталось ${formatSteps(candidate.progress.remainingSteps)}.`,
      }),
      (candidate) => ({
        title: "Хороший темп на сегодня",
        body: `Ты прошёл ${formatSteps(candidate.progress.currentSteps)} шагов. Ещё ${formatSteps(candidate.progress.remainingSteps)} и дневная цель будет закрыта.`,
      }),
    ],
    near_goal: [
      (candidate) => ({
        title: "Ты уже почти у цели",
        body: `Осталось всего ${formatSteps(candidate.progress.remainingSteps)} шагов. Небольшая прогулка, и день будет закрыт красиво.`,
      }),
      (candidate) => ({
        title: "Финиш уже рядом",
        body: `До дневной цели не хватает ${formatSteps(candidate.progress.remainingSteps)} шагов. Совсем чуть-чуть осталось.`,
      }),
    ],
    goal_reached: [
      () => ({
        title: "Цель по шагам достигнута",
        body: "Отличная работа. Сегодняшняя дневная цель уже выполнена.",
      }),
      () => ({
        title: "Поздравляем с целью дня",
        body: "Ты закрыл дневную норму шагов. Это сильный и очень полезный ритм.",
      }),
    ],
    over_goal: [
      (candidate) => ({
        title: "Сегодня шагов заметно больше цели",
        body: `Ты уже превысил цель на ${formatSteps(candidate.progress.currentSteps - candidate.progress.goalSteps)} шагов. Очень мощный день.`,
      }),
      (candidate) => ({
        title: "Сильный запас сверх цели",
        body: `Дневная цель давно позади: сверху ещё ${formatSteps(candidate.progress.currentSteps - candidate.progress.goalSteps)} шагов.`,
      }),
    ],
    low_activity_midday: [
      (candidate) => ({
        title: "Небольшая прогулка сейчас будет кстати",
        body: `Пока только ${formatSteps(candidate.progress.currentSteps)} шагов. Короткий выход на 5–10 минут поможет мягко разогнать день.`,
      }),
      (candidate) => ({
        title: "День можно оживить движением",
        body: `Шагов пока немного: ${formatSteps(candidate.progress.currentSteps)}. Пара минут ходьбы уже изменит самочувствие.`,
      }),
    ],
    low_activity_evening: [
      (candidate) => ({
        title: "До цели ещё можно спокойно добрать",
        body: `До дневной цели осталось ${formatSteps(candidate.progress.remainingSteps)} шагов. Неспешная вечерняя прогулка уже поможет.`,
      }),
      (candidate) => ({
        title: "Мягкое напоминание про шаги",
        body: `Сегодня пока ${formatSteps(candidate.progress.currentSteps)} шагов. Если есть силы, короткая прогулка приятно завершит день.`,
      }),
    ],
    forecast_alert: [
      () => ({
        title: "Прогноз на день готов",
        body: "Сегодняшняя подсказка уже ждёт тебя в приложении.",
      }),
      () => ({
        title: "Есть новый прогноз",
        body: "Загляни в приложение: прогноз дня уже обновился.",
      }),
    ],
  },
  en: {
    progress: [
      (candidate) => ({
        title: "You are moving toward today’s goal",
        body: `You have ${formatSteps(candidate.progress.currentSteps)} of ${formatSteps(candidate.progress.goalSteps)} steps today. ${formatSteps(candidate.progress.remainingSteps)} left to go.`,
      }),
      (candidate) => ({
        title: "Nice pace so far",
        body: `You are already at ${formatSteps(candidate.progress.currentSteps)} steps. Just ${formatSteps(candidate.progress.remainingSteps)} more to complete the daily goal.`,
      }),
    ],
    near_goal: [
      (candidate) => ({
        title: "You are almost there",
        body: `Only ${formatSteps(candidate.progress.remainingSteps)} steps left. A short walk will finish the goal beautifully.`,
      }),
      (candidate) => ({
        title: "The finish is close",
        body: `You only need ${formatSteps(candidate.progress.remainingSteps)} more steps to close the day’s goal.`,
      }),
    ],
    goal_reached: [
      () => ({
        title: "Daily step goal reached",
        body: "Great work. You have already completed today’s goal.",
      }),
      () => ({
        title: "You did it today",
        body: "Your daily step target is complete. That is a strong rhythm to keep.",
      }),
    ],
    over_goal: [
      (candidate) => ({
        title: "You are well beyond the goal",
        body: `You are already ${formatSteps(candidate.progress.currentSteps - candidate.progress.goalSteps)} steps above target. Powerful day.`,
      }),
      (candidate) => ({
        title: "Extra steps on top of the goal",
        body: `The goal is far behind now: ${formatSteps(candidate.progress.currentSteps - candidate.progress.goalSteps)} extra steps and counting.`,
      }),
    ],
    low_activity_midday: [
      (candidate) => ({
        title: "A short walk would help right now",
        body: `You are still at ${formatSteps(candidate.progress.currentSteps)} steps. Even 5–10 minutes of movement can reset the day.`,
      }),
      (candidate) => ({
        title: "A gentle movement break",
        body: `Your step count is still low at ${formatSteps(candidate.progress.currentSteps)}. A few minutes outside could lift your energy.`,
      }),
    ],
    low_activity_evening: [
      (candidate) => ({
        title: "There is still time to close the gap",
        body: `${formatSteps(candidate.progress.remainingSteps)} steps remain. A calm evening walk would already help.`,
      }),
      (candidate) => ({
        title: "A soft reminder about today’s steps",
        body: `You are at ${formatSteps(candidate.progress.currentSteps)} steps today. If you have the energy, a short walk could end the day well.`,
      }),
    ],
    forecast_alert: [
      () => ({
        title: "Your daily forecast is ready",
        body: "There is a fresh insight waiting for you in the app.",
      }),
      () => ({
        title: "New forecast available",
        body: "Open the app to see the latest daily forecast.",
      }),
    ],
  },
  kz: {
    progress: [
      (candidate) => ({
        title: "Бүгінгі мақсатқа жақындап келесің",
        body: `Қазір ${formatSteps(candidate.progress.currentSteps)} / ${formatSteps(candidate.progress.goalSteps)} қадам бар. Мақсатқа дейін ${formatSteps(candidate.progress.remainingSteps)} қадам қалды.`,
      }),
      (candidate) => ({
        title: "Қарқының жақсы",
        body: `Сен ${formatSteps(candidate.progress.currentSteps)} қадам жүрдің. Күндік мақсатқа жету үшін тағы ${formatSteps(candidate.progress.remainingSteps)} қадам керек.`,
      }),
    ],
    near_goal: [
      (candidate) => ({
        title: "Мақсатқа өте жақынсың",
        body: `Бар болғаны ${formatSteps(candidate.progress.remainingSteps)} қадам қалды. Кішкентай серуен жеткілікті.`,
      }),
      (candidate) => ({
        title: "Финиш қасыңда",
        body: `Күндік мақсатқа дейін ${formatSteps(candidate.progress.remainingSteps)} қадам ғана жетпейді.`,
      }),
    ],
    goal_reached: [
      () => ({
        title: "Күндік қадам мақсаты орындалды",
        body: "Өте жақсы. Бүгінгі қадам мақсатың орындалды.",
      }),
      () => ({
        title: "Бүгінгі мақсат жабылды",
        body: "Күндік қадам нормасын орындадың. Бұл өте жақсы ырғақ.",
      }),
    ],
    over_goal: [
      (candidate) => ({
        title: "Мақсаттан әлдеқайда жоғарысың",
        body: `Сен мақсаттан ${formatSteps(candidate.progress.currentSteps - candidate.progress.goalSteps)} қадамға артық жүрдің. Керемет күн.`,
      }),
      (candidate) => ({
        title: "Қосымша қадамдар көп болды",
        body: `Күндік мақсат артта қалды: үстіне тағы ${formatSteps(candidate.progress.currentSteps - candidate.progress.goalSteps)} қадам қостың.`,
      }),
    ],
    low_activity_midday: [
      (candidate) => ({
        title: "Қазір қысқа серуен пайдалы болады",
        body: `Әзірге ${formatSteps(candidate.progress.currentSteps)} қадам ғана. 5–10 минуттық жүріс күнді сергітеді.`,
      }),
      (candidate) => ({
        title: "Қозғалысқа шағын үзіліс жаса",
        body: `Қадам саны әзірге аз: ${formatSteps(candidate.progress.currentSteps)}. Аздап жүру қуат береді.`,
      }),
    ],
    low_activity_evening: [
      (candidate) => ({
        title: "Мақсатты әлі де тыныш толықтыруға болады",
        body: `Мақсатқа дейін ${formatSteps(candidate.progress.remainingSteps)} қадам қалды. Кешкі жай серуен көмектеседі.`,
      }),
      (candidate) => ({
        title: "Қадамдар жайлы жұмсақ еске салу",
        body: `Бүгін әзірге ${formatSteps(candidate.progress.currentSteps)} қадам. Күш болса, қысқа серуен күнді жақсы аяқтайды.`,
      }),
    ],
    forecast_alert: [
      () => ({
        title: "Күндік болжам дайын",
        body: "Қосымшада саған жаңа күндік белгі күтіп тұр.",
      }),
      () => ({
        title: "Жаңа болжам бар",
        body: "Қосымшаға кіріп, жаңа күндік болжамды қара.",
      }),
    ],
  },
  tr: {
    progress: [
      (candidate) => ({
        title: "Bugünkü hedefe iyi gidiyorsun",
        body: `Şu anda ${formatSteps(candidate.progress.currentSteps)} / ${formatSteps(candidate.progress.goalSteps)} adımdasın. Hedef için ${formatSteps(candidate.progress.remainingSteps)} adım kaldı.`,
      }),
      (candidate) => ({
        title: "Tempon güzel ilerliyor",
        body: `${formatSteps(candidate.progress.currentSteps)} adıma ulaştın. Günlük hedefi kapatmak için sadece ${formatSteps(candidate.progress.remainingSteps)} adım daha gerekiyor.`,
      }),
    ],
    near_goal: [
      (candidate) => ({
        title: "Hedefe çok yaklaştın",
        body: `Sadece ${formatSteps(candidate.progress.remainingSteps)} adım kaldı. Kısa bir yürüyüş yetebilir.`,
      }),
      (candidate) => ({
        title: "Bitiş çizgisi çok yakın",
        body: `Günlük hedef için yalnızca ${formatSteps(candidate.progress.remainingSteps)} adım daha gerekiyor.`,
      }),
    ],
    goal_reached: [
      () => ({
        title: "Günlük adım hedefi tamamlandı",
        body: "Harika iş. Bugünkü adım hedefini tamamladın.",
      }),
      () => ({
        title: "Bugünün hedefi kapandı",
        body: "Günlük adım hedefin bitti. Bu çok iyi bir ritim.",
      }),
    ],
    over_goal: [
      (candidate) => ({
        title: "Hedefin epey üstündesin",
        body: `Hedefi ${formatSteps(candidate.progress.currentSteps - candidate.progress.goalSteps)} adım aştın. Çok güçlü bir gün.`,
      }),
      (candidate) => ({
        title: "Hedef üstüne ekstra adımlar",
        body: `Günlük hedef geride kaldı: üstüne ${formatSteps(candidate.progress.currentSteps - candidate.progress.goalSteps)} adım daha ekledin.`,
      }),
    ],
    low_activity_midday: [
      (candidate) => ({
        title: "Kısa bir yürüyüş şimdi iyi gelir",
        body: `Şimdilik ${formatSteps(candidate.progress.currentSteps)} adımdasın. 5–10 dakikalık hareket bile günü tazeleyebilir.`,
      }),
      (candidate) => ({
        title: "Nazik bir hareket molası",
        body: `Adım sayın hâlâ düşük: ${formatSteps(candidate.progress.currentSteps)}. Birkaç dakika yürümek enerjini yükseltebilir.`,
      }),
    ],
    low_activity_evening: [
      (candidate) => ({
        title: "Açığı kapatmak için hâlâ zaman var",
        body: `${formatSteps(candidate.progress.remainingSteps)} adım kaldı. Sakin bir akşam yürüyüşü bile yardımcı olur.`,
      }),
      (candidate) => ({
        title: "Bugünkü adımlar için yumuşak hatırlatma",
        body: `Bugün ${formatSteps(candidate.progress.currentSteps)} adımdasın. Enerjin varsa kısa bir yürüyüş günü iyi kapatır.`,
      }),
    ],
    forecast_alert: [
      () => ({
        title: "Günlük öngörün hazır",
        body: "Uygulamada seni bekleyen yeni bir günlük mesaj var.",
      }),
      () => ({
        title: "Yeni öngörü hazır",
        body: "Son günlük öngörü için uygulamayı aç.",
      }),
    ],
  },
};

export const buildStepNotificationContent = (
  candidate: StepNotificationCandidate,
  lang: StepNotificationLang,
): StepNotificationMessage => {
  const dictionaries = MESSAGES[lang] ?? MESSAGES.en;
  const variants =
    dictionaries[candidate.contentKey] ?? dictionaries.forecast_alert;
  const factory = pickVariant(variants, candidate.dedupeKey);

  return factory(candidate);
};
