import dailyForecastsRaw from "@/data/prediction/dailyForecasts.json";

export type Article = {
  id: string;
  title: string;
  subtitle: string;
  markdown?: string;
};

export const sampleArticles: Article[] = [
  {
    id: "1",
    title: "Портрет личности",
    subtitle: "Как цифры рождения раскрывают внутренний мир личности",
    markdown: `
# Портрет личности

    `,
  },
  {
    id: "2",
    title: "Совместимость по числам",
    subtitle: "Как энергия дат рождения влияет на отношения и любовь",
    markdown: `
# Совместимость по числам

Совместимость — одна из самых увлекательных тем нумерологии. Ведь каждый человек несёт свой числовой код, а при встрече двух людей их энергии начинают взаимодействовать, создавая гармонию или, наоборот, вызывая внутреннее напряжение.

### Энергия взаимодействия

Каждая пара чисел образует определённую вибрацию. Одни комбинации усиливают друг друга — такие союзы строятся на вдохновении, поддержке и лёгкости. Другие требуют проработки — в них заложен рост через испытания, но именно такие отношения чаще всего становятся глубочайшими и судьбоносными.

### Типы совместимости

- **Эмоциональная** — насколько партнёры чувствуют друг друга сердцем.  
- **Интеллектуальная** — совпадают ли их взгляды и ритм мышления.  
- **Кармическая** — есть ли между ними долги из прошлых воплощений.  
- **Духовная** — соединены ли их пути одной целью.

### Искусство понимания

Истинная совместимость не в идеальности, а в осознанности. Если вы понимаете, какие качества приносит партнёр, вы можете научиться не бороться, а дополнять друг друга. Психоматрица помогает увидеть эту динамику и превратить любые отношения в пространство роста.

> Совместимость — это не совпадение, а способность настроиться на одну волну.
    `,
  },
  {
    id: "3",
    title: "Кармический жизненный код",
    subtitle: "О чем рассказывает число вашей судьбы",
    markdown: `
# Кармический жизненный код

Кармический код — это число, получаемое из полной даты рождения. Оно несёт информацию о задачах души, предназначении и тех уроках, которые человек проходит в текущем воплощении.  
Понимание этого числа даёт возможность осознанно проживать свою жизнь, не сопротивляясь судьбе, а взаимодействуя с ней.

### Что отражает кармический код

Каждая цифра от 1 до 9 (а также мастер-числа 11 и 22) имеет свою вибрацию, и именно она определяет ритм жизни человека. Например:

- **1** — путь лидера и самостоятельности;  
- **2** — гармония и дипломатия;  
- **3** — творчество и самовыражение;  
- **4** — стабильность и трудолюбие;  
- **5** — свобода и перемены;  
- **6** — семья и забота;  
- **7** — духовное развитие и анализ;  
- **8** — сила и материальный успех;  
- **9** — гуманизм и завершение цикла.

### Работа с кармой

Карма — не наказание, а обучение. Она приходит через людей, события и повторяющиеся ситуации, указывая на то, что требует осознания. Когда человек принимает ответственность и учится проходить испытания с мудростью, его энергия очищается, и жизнь становится гармоничнее.

> “Карма — это не приговор, а приглашение к осознанности.”

### Путь освобождения

Поняв свой кармический код, вы начинаете видеть закономерности и учитесь выбирать осознанно. Каждое решение, каждое слово — это часть большой картины вашей эволюции. Освобождение начинается тогда, когда вы перестаёте сопротивляться своему пути и начинаете идти по нему с открытым сердцем.
    `,
  },
  {
    id: "4",
    title: "Предназначение",
    subtitle: "Как найти своё место и реализовать потенциал",
    markdown: `
# Предназначение и путь души

Каждый человек приходит в этот мир с особой задачей. Но часто в повседневной суете мы теряем связь с собой и начинаем жить так, как «нужно», а не так, как откликается сердце. Понимание предназначения возвращает осознанность и даёт внутреннюю силу.

### Что такое предназначение

Предназначение — это не профессия и не должность. Это состояние, когда твои действия приносят радость тебе и пользу миру. Это путь, где твои таланты становятся инструментом служения, а жизнь наполняется смыслом.

### Как его распознать

1. Прислушайтесь к тому, что вдохновляет и зажигает вас.  
2. Обратите внимание на то, что легко даётся.  
3. Заметьте, где вы чувствуете поток — там, где время перестаёт существовать.  
4. Вспомните детские мечты — часто именно они несут подсказку от души.

### Взаимосвязь с психоматрицей

В психоматрице предназначение отражается через сочетание чисел силы, интуиции и воли. Она показывает, как именно человек может проявить свой потенциал в реальности — через творчество, служение, лидерство или духовное наставничество.

> “Твоё предназначение — это путь, на котором ты становишься собой.”

### Осознанная реализация

Когда человек следует зову души, Вселенная открывает перед ним двери. Появляются нужные люди, ресурсы, возможности. Всё начинает складываться естественно, потому что энергия идёт в резонанс с истинным направлением.  
Жизнь становится не борьбой, а танцем — танцем души, нашедшей своё место в мире.
    `,
  },
];

export type DailyForecastLang = "ru" | "en" | "kz" | "tr";
export type DailyForecastNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type DailyForecastEntry = {
  label: string;
  energy: string;
  source: string;
  fallbacks: string[];
};

const DAILY_FORECAST_NUMBERS: DailyForecastNumber[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9,
];

const DAILY_FORECASTS = dailyForecastsRaw as Record<
  DailyForecastLang,
  Record<string, DailyForecastEntry>
>;

const LANGUAGE_NAMES: Record<DailyForecastLang, string> = {
  ru: "Russian / русский",
  en: "English",
  kz: "Kazakh / қазақша",
  tr: "Turkish / Türkçe",
};

const ADVICE_LABELS: Record<DailyForecastLang, string> = {
  ru: "Совет:",
  en: "Advice:",
  kz: "Кеңес:",
  tr: "Öneri:",
};

const AFFIRMATIONS_BY_NUMBER: Record<DailyForecastNumber, string> = {
  1: "«Я лидер своей жизни. Я действую уверенно и смело. Всё, к чему я прикасаюсь, наполняется успехом.»",
  2: "«Я в гармонии с собой и миром. Моя доброта и понимание создают атмосферу любви.»",
  3: "«Я позволяю своему свету сиять. Мои идеи вдохновляют других.»",
  4: "«Я строю свой успех шаг за шагом. Моя настойчивость приносит плоды.»",
  5: "«Я открыт новому. Перемены ведут меня к лучшему.»",
  6: "«Моё сердце излучает любовь. Я создаю уют и гармонию.»",
  7: "«Я слушаю свою интуицию и нахожу ответы внутри себя.»",
  8: "«Я управляю своей жизнью и притягиваю изобилие.»",
  9: "«Я отпускаю прошлое и открываю дорогу новому.»",
};

export function normalizeDailyForecastLang(
  lang?: string | null,
): DailyForecastLang {
  const value = String(lang || "").toLowerCase();

  if (value.includes("ru")) return "ru";
  if (value.includes("tr")) return "tr";
  if (value.includes("kz") || value.includes("kk")) return "kz";

  return "en";
}

function normalizeDailyForecastNumber(value: number): DailyForecastNumber {
  if (DAILY_FORECAST_NUMBERS.includes(value as DailyForecastNumber)) {
    return value as DailyForecastNumber;
  }

  return 1;
}

function reduceDigits(total: number): DailyForecastNumber {
  let value = Math.abs(Math.floor(Number(total) || 0));

  while (value > 9) {
    value = String(value)
      .split("")
      .reduce((sum, digit) => sum + Number(digit || 0), 0);
  }

  return normalizeDailyForecastNumber(value || 1);
}

function reduceDigitsFromText(value: string): DailyForecastNumber {
  const digits = String(value || "").match(/\d/g);

  if (!digits?.length) return 1;

  const total = digits.reduce((sum, digit) => sum + Number(digit), 0);

  return reduceDigits(total);
}

function hashSeed(seed: string) {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function getDailyForecastEntry(
  number: DailyForecastNumber,
  lang: DailyForecastLang,
) {
  return DAILY_FORECASTS[lang]?.[String(number)] ?? DAILY_FORECASTS.ru["1"];
}

function stripDailyForecastHeader(text: string) {
  return String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => {
      const lower = line.toLowerCase();

      return !(
        lower.startsWith("число дня") ||
        lower.startsWith("day number") ||
        lower.startsWith("күн саны") ||
        lower.startsWith("günün sayısı")
      );
    })
    .join("\n")
    .trim();
}

export const DAY_DATA: Record<number, { energy: string; aff: string }> =
  DAILY_FORECAST_NUMBERS.reduce(
    (acc, number) => {
      acc[number] = {
        energy: getDailyForecastEntry(number, "ru").source,
        aff: AFFIRMATIONS_BY_NUMBER[number],
      };

      return acc;
    },
    {} as Record<number, { energy: string; aff: string }>,
  );

export function getDailyForecastNumber(dob: string, dateKey: string) {
  const birthNumber = reduceDigitsFromText(dob);
  const dayNumber = reduceDigitsFromText(dateKey);
  const forecastNumber = reduceDigits(birthNumber + dayNumber);

  return {
    birthNumber,
    dayNumber,
    forecastNumber,
  };
}

export function getDailyForecastFallbackByNumber(
  number: DailyForecastNumber,
  lang: string,
  seed: string,
) {
  const forecastLang = normalizeDailyForecastLang(lang);
  const entry = getDailyForecastEntry(number, forecastLang);
  const variants = entry.fallbacks?.length ? entry.fallbacks : [entry.source];
  const index = hashSeed(`${seed}:${forecastLang}:${number}`) % variants.length;

  return stripDailyForecastHeader(variants[index] || entry.source);
}

export function getDailyForecastFallback(
  dob: string,
  dateKey: string,
  lang: string,
) {
  const { forecastNumber } = getDailyForecastNumber(dob, dateKey);

  return getDailyForecastFallbackByNumber(
    forecastNumber,
    lang,
    `${dateKey}:${dob}`,
  );
}

export function getDailyForecastPromptSource(
  number: DailyForecastNumber,
  lang: string,
) {
  const forecastLang = normalizeDailyForecastLang(lang);

  return getDailyForecastEntry(number, forecastLang).source;
}

function getPromptExamples(
  number: DailyForecastNumber,
  lang: DailyForecastLang,
) {
  const exampleNumbers = [
    number,
    (((number + 1 - 1) % 9) + 1) as DailyForecastNumber,
    (((number + 4 - 1) % 9) + 1) as DailyForecastNumber,
  ];

  return [...new Set(exampleNumbers)]
    .map((exampleNumber) =>
      stripDailyForecastHeader(getDailyForecastEntry(exampleNumber, lang).source),
    )
    .join("\n\n");
}

export const DataPrompt = (dob: string, dateKey: string, lang: string) => {
  const forecastLang = normalizeDailyForecastLang(lang);
  const { birthNumber, dayNumber, forecastNumber } = getDailyForecastNumber(
    dob,
    dateKey,
  );
  const target = getDailyForecastEntry(forecastNumber, forecastLang);
  const examples = getPromptExamples(forecastNumber, forecastLang);

  return `Ты — астролог-нумеролог приложения BioNum.
Твоя задача — написать прогноз дня в стиле сохраненных шаблонов ниже.

Дано:
- Дата рождения пользователя: ${dob}
- Текущая дата: ${dateKey}
- Личное число пользователя: ${birthNumber}
- Число календарного дня: ${dayNumber}
- Итоговое число прогноза: ${forecastNumber}
- Язык ответа: ${LANGUAGE_NAMES[forecastLang]}

Правила вычисления:
1) Личное число пользователя = сумма всех цифр даты рождения, пока не получится однозначное число.
2) Число дня = сумма всех цифр текущей даты, также сведи до однозначного числа.
3) Итоговое число прогноза = личное число + число дня, при необходимости тоже сведи к однозначному.

Главный смысл для сегодняшнего числа, но без показа строки с номером:
${stripDailyForecastHeader(target.source)}

Примеры стиля:
${examples}

Формат ответа:
- Пиши только сам прогноз, без заголовка и без строки "${target.label} ${forecastNumber} — ${target.energy}".
- Не показывай число дня пользователю.
- Дай 2 коротких предложения о настроении дня, действиях, отношениях или делах.
- Последняя строка должна начинаться с "${ADVICE_LABELS[forecastLang]}" и давать один конкретный совет.
- Стиль: премиальный, теплый, уверенный, похожий на примеры.
- Не повторяй шаблон дословно: сохрани смысл числа, но переформулируй живо и естественно.
- Не используй markdown, списки, нумерацию и длинные объяснения.
- Оптимальная длина: 260-380 символов.
`;
};

export const DataPromptValue = (lang: string, text: string) => {
  const affirmationLang = normalizeDailyForecastLang(lang);
  const languageName = LANGUAGE_NAMES[affirmationLang];

  return `
You are rewriting a short affirmation for the BioNum app.
Text: "${text}".

Format and requirements:
- Output language: ${languageName}.
- Return only one finished affirmation in ${languageName}.
- Do not use Russian unless the output language is Russian.
- If the output language is Kazakh, write in Kazakh only.
- Keep the meaning, but make the wording light, friendly, and modern.
- No lists, numbering, markdown, explanations, or extra details.
`;
};

export type Locale = "en" | "tr" | "kz" | "ru";
export const COPY: Record<
  Locale,
  {
    chooseLangTitle: string;
    skip: string;
    next: string;
    back: string;
    start: string;
    page1Title: string;
    page1Body: string;
    page2Title: string;
    page2Body: string;
    page3Title: string;
    page3Body: string;
    page4Title: string;
    page4Body: string;
    page5Title: string;
    page5Body: string;
  }
> = {
  ru: {
    chooseLangTitle: "Выбери язык",
    skip: "Пропустить",
    next: "Далее",
    back: "Назад",
    start: "Начать",
    page1Title: "Добро пожаловать в BioNum",
    page1Body:
      "BioNum — умное приложение для гармонии энергии, тела и разума.\n\nОно помогает мягко выстроить баланс и лучше понимать себя каждый день.",
    page2Title: "Нумерология + технологии",
    page2Body:
      "BioNum соединяет нумерологию и технологии, чтобы ты понял себя глубже.\n\nПриложение анализирует твой нумерологический код и показывает сильные и слабые стороны.",
    page3Title: "Персональный прогноз",
    page3Body:
      "Каждый день ты получаешь персональный прогноз, основанный на энергии дня и года — с подсказками, как использовать её с пользой.",
    page4Title: "Активность и баланс",
    page4Body:
      "Раздел активности помогает оставаться в движении: напомнит, если ты долго сидишь, и вдохновит на простые шаги к балансу.",
    page5Title: "BioNum",
    page5Body:
      "BioNum — это синтез древней мудрости и современных технологий. Твоя энергия. Твоя осознанность. Твоя сила.",
  },
  en: {
    chooseLangTitle: "Choose language",
    skip: "Skip",
    next: "Next",
    back: "Back",
    start: "Get started",
    page1Title: "Welcome to BioNum",
    page1Body:
      "BioNum is a smart app for harmony of energy, body, and mind.\n\nIt helps you build balance gently and understand yourself better every day.",
    page2Title: "Numerology + technology",
    page2Body:
      "BioNum combines numerology with modern tech to help you go deeper.\n\nIt analyzes your numerology code and highlights strengths and weak points.",
    page3Title: "Daily personal forecast",
    page3Body:
      "Each day you get a personal forecast based on the energy of the day and year.\n\nYou’ll get tips on how to use it wisely in actions, communication, and decisions.",
    page4Title: "Activity & balance",
    page4Body:
      "The activity section keeps you moving: it reminds you if you sit too long and motivates simple steps.\n\nYour energy. Your awareness. Your power.",
    page5Title: "BioNum",
    page5Body:
      "BioNum is a blend of ancient wisdom and modern technology. Your energy. Your awareness. Your power.",
  },
  tr: {
    chooseLangTitle: "Dil seç",
    skip: "Geç",
    next: "İleri",
    back: "Geri",
    start: "Başla",
    page1Title: "BioNum’a hoş geldin",
    page1Body:
      "BioNum; enerji, beden ve zihin uyumu için akıllı bir uygulamadır.\n\nHer gün daha iyi kendini anlamana ve dengeni kurmana yardımcı olur.",
    page2Title: "Numeroloji + teknoloji",
    page2Body:
      "BioNum, numerolojiyi teknolojiyle birleştirerek seni daha derin tanımana yardım eder.\n\nNumeroloji kodunu analiz eder; güçlü ve zayıf yönlerini gösterir.",
    page3Title: "Günlük kişisel tahmin",
    page3Body:
      "Her gün, günün ve yılın enerjisine göre kişisel bir tahmin alırsın.\n\nİşlerde, iletişimde ve kararlarda bunu nasıl faydaya çevireceğini söyler.",
    page4Title: "Aktivite ve denge",
    page4Body:
      "Aktivite bölümü hareketli kalmanı sağlar: uzun süre oturursan hatırlatır ve basit adımlarla motive eder.\n\nEnerjin. Farkındalığın. Gücün.",
    page5Title: "BioNum",
    page5Body:
      "BioNum, eski bilgelik ile modern teknolojinin bir karışımıdır. Enerjin. Farkındalığın. Gücün.",
  },
  kz: {
    chooseLangTitle: "Тілді таңда",
    skip: "Өткізу",
    next: "Келесі",
    back: "Артқа",
    start: "Бастау",
    page1Title: "BioNum-ға қош келдің",
    page1Body:
      "BioNum — энергия, дене және сана үйлесімі үшін ақылды қолданба.\n\nКүн сайын өзіңді жақсырақ түсініп, тепе-теңдікті жұмсақ қалыптастыруға көмектеседі.",
    page2Title: "Нумерология + технология",
    page2Body:
      "BioNum нумерология мен технологияны біріктіріп, өзіңді тереңірек тануға көмектеседі.\n\nНумерологиялық кодыңды талдап, күшті және әлсіз тұстарды көрсетеді.",
    page3Title: "Жеке күндік болжам",
    page3Body:
      "Күн сайын күн мен жылдың энергиясына сүйенген жеке болжам аласың.\n\nОны пайдалы қолдануға арналған кеңестер береді — істе, қарым-қатынаста, шешімде.",
    page4Title: "Белсенділік және баланс",
    page4Body:
      "Белсенділік бөлімі қозғалыста ұстауға көмектеседі: ұзақ отырсаң еске салады және қарапайым қадамдарға ынталандырады.\n\nЭнергияң. Саналылығың. Күшің.",
    page5Title: "BioNum",
    page5Body:
      "BioNum — ежелгі даналық пен заманауи технологияның үйлесімі. Энергияң. Саналылығың. Күшің.",
  },
};
