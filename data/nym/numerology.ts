/**
 * Файл: numerology.ts
 * Описание: Расчет Числа Проблемы (нумерология) и предоставление результата на выбранном языке.
 */

// --- Типы для обеспечения безопасности типов ---

/**
 * Допустимые коды языка.
 */
export type LangCode = "ru" | "en" | "kz" | "tr";

/**
 * Число Проблемы может быть от 0 до 8.
 */
export type ProblemNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/**
 * Структура ответа.
 */
export interface ProblemResult {
  problemNumber: ProblemNumber;
  description: string;
}

/**
 * Структура для хранения описаний проблем на разных языках.
 */
interface Localization {
  [key: number]: {
    title: string;
    karmaTask: string;
  };
}

/**
 * Хранилище описаний проблем (локализация)
 * Использует предоставленные тексты для 'ru' и машинный перевод для остальных языков.
 */
const problemDescriptions: { [lang in LangCode]: Localization } = {
  ru: {
    // Русский (на основе предоставленного текста)
    0: {
      title: "Число Проблемы 0",
      karmaTask:
        "Указывает на сильную неопределенность в жизни. Человек теряется в целях, мечется между направлениями и не может понять свой путь. Кармическая задача — развиваться сразу во всех сферах, искать себя, учиться, слушать мудрых наставников и не бросать духовный путь.",
    },
    1: {
      title: "Число Проблемы 1",
      karmaTask:
        "Слабое влияние Солнца может проявляться как проблемы с отцом, неуверенность, сердечно-сосудистые сложности, эго-реакции. Необходимо укреплять самостоятельность, режим, внутренний баланс и здоровье. Главная работа — над уверенностью и отношениями с отцом.",
    },
    2: {
      title: "Число Проблемы 2",
      karmaTask:
        "Задачи связаны с отношениями: непонимание партнера, зависимость, эмоциональная нестабильность. Часто — проблемы с матерью, у женщин – гинекология. Нужно учиться здоровым отношениям, понимать причины конфликтов, прорабатывать ожидания и эмоции.",
    },
    3: {
      title: "Число Проблемы 3",
      karmaTask:
        "Проблема мягкая: жизнь требует постоянного развития, обучения, расширения благосостояния и мудрости. Возможны сложности с детьми и в принятии/даче советов. Женщинам важно прожить полноценный семейный опыт. Мужчинам — дарить женщинам уважение, заботу, поддержку.",
    },
    4: {
      title: "Число Проблемы 4",
      karmaTask:
        "Раху создаёт страхи, иллюзии, импульсивность и неосознанные действия. Задача — убрать внутренние блоки через трансформацию сознания, духовные практики, связь с природой. Важно избегать «иллюзорного мира» мегаполисов, токсичных сред и работать над причинами страхов.",
    },
    5: {
      title: "Число Проблемы 5",
      karmaTask:
        "Может проявляться как нехватка интереса к учебе, слабая концентрация, рассеянность, трудности в общении. Задача — развивать интеллект, речь, коммуникацию, порядок вокруг и внутри себя. Учиться внимательности и убирать лишнее — вещи, связи, хаос.",
    },
    6: {
      title: "Число Проблемы 6",
      karmaTask:
        "Проблемы возникают при чрезмерном стремлении к удовольствиям. Нужно учиться контролировать желания, развивать верность и уважение к партнёру. Важно заниматься творчеством и духовностью, а не погоней за комфортом и наслаждениями.",
    },
    7: {
      title: "Число Проблемы 7",
      karmaTask:
        "Кету даёт ощущение потерянности, нестабильность энергии, иллюзии и иногда — сложности в интимной сфере. Решение — духовные практики, медитации, развитие мудрости. Здесь проблема тонкая, кармическая, и решается только через внутреннюю работу и повышение сознания.",
    },
    8: {
      title: "Число Проблемы 8",
      karmaTask:
        "Сатурн приносит испытания — препятствия в работе, задержки, уроки судьбы. Возможны болезни костей, ног, хронические проблемы. Главное — труд, дисциплина, полезность обществу. Избегать лени, действовать серьёзно и ответственно. Такой подход постепенно выводит к успеху.",
    },
  },
  en: {
    // English (машинный перевод)
    0: {
      title: "Problem Number 0",
      karmaTask:
        "Indicates a strong uncertainty in life. A person loses sight of goals, rushes between directions, and cannot understand their path. The karmic task is to develop in all areas at once, search for oneself, learn, listen to wise mentors, and not abandon the spiritual path.",
    },
    1: {
      title: "Problem Number 1",
      karmaTask:
        "The weak influence of the Sun can manifest as problems with the father, insecurity, cardiovascular complications, and ego reactions. It is necessary to strengthen independence, routine, internal balance, and health. The main work is on confidence and the relationship with the father.",
    },
    2: {
      title: "Problem Number 2",
      karmaTask:
        "Tasks are associated with relationships: misunderstanding a partner, dependence, emotional instability. Often – problems with the mother; for women – gynecological issues. You need to learn healthy relationships, understand the causes of conflicts, work through expectations and emotions.",
    },
    3: {
      title: "Problem Number 3",
      karmaTask:
        "The problem is mild: life requires constant development, learning, expansion of well-being and wisdom. Possible difficulties with children and in giving/receiving advice. It is important for women to live a fulfilling family experience. For men – to give women respect, care, and support.",
    },
    4: {
      title: "Problem Number 4",
      karmaTask:
        "Rahu creates fears, illusions, impulsiveness, and unconscious actions. The task is to remove internal blocks through transformation of consciousness, spiritual practices, and connection with nature. It is important to avoid the 'illusory world' of megacities, toxic environments, and work on the causes of fears.",
    },
    5: {
      title: "Problem Number 5",
      karmaTask:
        "Can manifest as a lack of interest in studies, poor concentration, absentmindedness, and difficulties in communication. The task is to develop intellect, speech, communication, order around and within oneself. Learn attentiveness and remove the unnecessary – things, connections, chaos.",
    },
    6: {
      title: "Problem Number 6",
      karmaTask:
        "Problems arise with an excessive pursuit of pleasure. You need to learn to control desires, develop fidelity, and respect for your partner. It is important to engage in creativity and spirituality, not the pursuit of comfort and enjoyment.",
    },
    7: {
      title: "Problem Number 7",
      karmaTask:
        "Ketu gives a feeling of being lost, energy instability, illusions, and sometimes – difficulties in the intimate sphere. The solution is spiritual practices, meditations, development of wisdom. Here, the problem is subtle, karmic, and is solved only through inner work and raising consciousness.",
    },
    8: {
      title: "Problem Number 8",
      karmaTask:
        "Saturn brings trials – obstacles in work, delays, lessons of fate. Possible diseases of the bones, legs, chronic problems. The main thing is hard work, discipline, usefulness to society. Avoid laziness, act seriously and responsibly. This approach gradually leads to success.",
    },
  },
  kz: {
    // Казахский (машинный перевод)
    0: {
      title: "Проблема саны 0",
      karmaTask:
        "Өмірдегі қатты белгісіздікті көрсетеді. Адам мақсаттардан адасады, бағыттар арасында ауытқиды және өз жолын түсіне алмайды. Кармалық міндет – бірден барлық салада даму, өзін іздеу, үйрену, дана тәлімгерлерді тыңдау және рухани жолдан бас тартпау.",
    },
    1: {
      title: "Проблема саны 1",
      karmaTask:
        "Күннің әлсіз әсері әкемен проблемалар, сенімсіздік, жүрек-қан тамырлары аурулары, эго-реакциялар ретінде көрінуі мүмкін. Өз бетінше болуды, режимді, ішкі тепе-теңдікті және денсаулықты нығайту қажет. Негізгі жұмыс – сенімділік және әкемен қарым-қатынас үстінде.",
    },
    2: {
      title: "Проблема саны 2",
      karmaTask:
        "Міндеттер қарым-қатынаспен байланысты: серіктесті түсінбеу, тәуелділік, эмоциялық тұрақсыздық. Жиі – анамен проблемалар, әйелдерде – гинекология. Салауатты қарым-қатынасқа үйрену, жанжал себептерін түсіну, күтулер мен эмоцияларды пысықтау қажет.",
    },
    3: {
      title: "Проблема саны 3",
      karmaTask:
        "Проблема жұмсақ: өмір тұрақты дамуды, оқуды, әл-ауқатты және даналықты кеңейтуді талап етеді. Балалармен және кеңес беру/қабылдауда қиындықтар болуы мүмкін. Әйелдер үшін толыққанды отбасылық тәжірибеден өту маңызды. Ерлер үшін – әйелдерге құрмет, қамқорлық, қолдау көрсету.",
    },
    4: {
      title: "Проблема саны 4",
      karmaTask:
        "Раху қорқыныштар, елестер, импульсивтілік және бейсаналық әрекеттер тудырады. Міндет – сананы өзгерту, рухани тәжірибелер, табиғатпен байланыс арқылы ішкі блоктарды алып тастау. Мегаполистердің «елесті әлемінен», улы орталардан аулақ болу және қорқыныш себептерімен жұмыс істеу маңызды.",
    },
    5: {
      title: "Проблема саны 5",
      karmaTask:
        "Оқуға қызығушылықтың жоқтығы, әлсіз зейін, ұмытшақтық, қарым-қатынастағы қиындықтар ретінде көрінуі мүмкін. Міндет – интеллект, сөйлеу, қарым-қатынас, өзіңнің айналаңдағы және ішіңдегі тәртіпті дамыту. Зейінділікке үйрену және артық нәрселерді – заттарды, байланыстарды, хаосты алып тастау.",
    },
    6: {
      title: "Проблема саны 6",
      karmaTask:
        "Проблемалар ләззатқа шамадан тыс ұмтылу кезінде туындайды. Құмарлықтарды бақылауды, адалдықты және серіктеске құрметті дамытуды үйрену керек. Комфорт пен ләззатқа ұмтылмай, шығармашылық пен руханиятпен айналысу маңызды.",
    },
    7: {
      title: "Проблема саны 7",
      karmaTask:
        "Кету жоғалған сезімді, энергияның тұрақсыздығын, елестерді және кейде – интимдік салада қиындықтар береді. Шешім – рухани тәжірибелер, медитациялар, даналықты дамыту. Мұнда проблема нәзік, кармалық, және тек ішкі жұмыс және сананы көтеру арқылы шешіледі.",
    },
    8: {
      title: "Проблема саны 8",
      karmaTask:
        "Сатурн сынақтар әкеледі – жұмыстағы кедергілер, кідірістер, тағдыр сабақтары. Сүйектердің, аяқтардың аурулары, созылмалы проблемалар болуы мүмкін. Ең бастысы – еңбек, тәртіп, қоғамға пайдалы болу. Жалқаулықтан аулақ болу, байсалды және жауапты әрекет ету. Мұндай тәсіл біртіндеп табысқа жетелейді.",
    },
  },
  tr: {
    // Турецкий (машинный перевод)
    0: {
      title: "Problem Numarası 0",
      karmaTask:
        "Hayatta güçlü bir belirsizliğe işaret eder. Kişi hedeflerde kaybolur, yönler arasında gidip gelir ve yolunu anlayamaz. Karmik görev, aynı anda tüm alanlarda gelişmek, kendini aramak, öğrenmek, bilge danışmanları dinlemek ve manevi yolu terk etmemektir.",
    },
    1: {
      title: "Problem Numarası 1",
      karmaTask:
        "Güneş'in zayıf etkisi, babayla ilgili sorunlar, güvensizlik, kardiyovasküler zorluklar, ego reaksiyonları olarak ortaya çıkabilir. Bağımsızlığı, düzeni, iç dengeyi ve sağlığı güçlendirmek gereklidir. Asıl çalışma, özgüven ve babayla olan ilişki üzerinedir.",
    },
    2: {
      title: "Problem Numarası 2",
      karmaTask:
        "Görevler ilişkilerle ilişkilidir: partneri yanlış anlama, bağımlılık, duygusal dengesizlik. Sıklıkla – anneyle sorunlar, kadınlarda – jinekolojik sorunlar. Sağlıklı ilişkileri öğrenmek, çatışmaların nedenlerini anlamak, beklentileri ve duyguları işlemek gerekir.",
    },
    3: {
      title: "Problem Numarası 3",
      karmaTask:
        "Problem hafiftir: hayat sürekli gelişim, öğrenme, refah ve bilgeliğin genişlemesini gerektirir. Çocuklarla ve tavsiye verme/almada zorluklar olabilir. Kadınların tam bir aile deneyimi yaşaması önemlidir. Erkekler için – kadınlara saygı, özen ve destek sunmak.",
    },
    4: {
      title: "Problem Numarası 4",
      karmaTask:
        "Rahu korkular, yanılsamalar, dürtüsellik ve bilinçsiz eylemler yaratır. Görev, bilinç dönüşümü, ruhsal pratikler ve doğayla bağlantı yoluyla iç blokajları kaldırmaktır. Büyük şehirlerin 'yanıltıcı dünyasından', toksik ortamlardan kaçınmak ve korkuların nedenleri üzerinde çalışmak önemlidir.",
    },
    5: {
      title: "Problem Numarası 5",
      karmaTask:
        "Öğrenmeye ilgi eksikliği, zayıf konsantrasyon, dalgınlık ve iletişimde zorluklar olarak kendini gösterebilir. Görev, zekayı, konuşmayı, iletişimi, çevresindeki ve içindeki düzeni geliştirmektir. Dikkatliliği öğrenmek ve gereksiz olanı – eşyaları, bağlantıları, kaosu – ortadan kaldırmak.",
    },
    6: {
      title: "Problem Numarası 6",
      karmaTask:
        "Aşırı zevk arayışı ile sorunlar ortaya çıkar. Arzuları kontrol etmeyi, sadakati ve partnere saygıyı geliştirmeyi öğrenmek gerekir. Rahatlık ve keyif peşinde koşmak yerine, yaratıcılık ve maneviyatla ilgilenmek önemlidir.",
    },
    7: {
      title: "Problem Numarası 7",
      karmaTask:
        "Ketu kaybolmuşluk hissi, enerji dengesizliği, yanılsamalar ve bazen – cinsel alanda zorluklar verir. Çözüm – ruhsal pratikler, meditasyonlar, bilgeliği geliştirmek. Burada problem incedir, karmiktir ve sadece içsel çalışma ve bilinci yükseltme yoluyla çözülür.",
    },
    8: {
      title: "Problem Numarası 8",
      karmaTask:
        "Satürn denemeler getirir – işte engeller, gecikmeler, kader dersleri. Kemik, bacak hastalıkları, kronik sorunlar mümkün olabilir. Ana şey – çalışkanlık, disiplin, topluma faydalı olmak. Tembellikten kaçınmak, ciddi ve sorumlu hareket etmek. Bu yaklaşım yavaş yavaş başarıya götürür.",
    },
  },
};

// --- Вспомогательные функции ---

/**
 * Сводит число (или сумму цифр) к однозначному числу (от 1 до 9),
 * используя нумерологическое сложение.
 * Исключение: в данном расчете "Числа Проблемы" 0 и 9 допускаются в промежуточных шагах,
 * но финальное число проблемы не будет 9 (так как расчет всегда идет вычитанием).
 * Предоставленный пример показывает, что 1+9+9+9=28=10=1.
 * В контексте этого метода, мы продолжаем сложение до однозначного числа (1-9),
 * но для числа проблемы 0 и 9 обрабатываются особо в тексте.
 *
 * @param n Число для сведения.
 * @returns Сведенное однозначное число (1-9).
 */
function reduceToSingleDigit(n: number): number {
  let sum = n;
  while (sum > 9) {
    sum = sum
      .toString()
      .split("")
      .map(Number)
      .reduce((a, b) => a + b, 0);
  }
  // В нумерологии часто 0 при сведении до 9=9, но в контексте "Числа проблемы"
  // где расчет идет вычитанием, итоговым результатом может быть 0.
  // Для чисел дня/месяца/года сведение всегда должно быть до 1-9.
  return sum;
}

/**
 * Сводит число к однозначному или двузначному (11, 22),
 * но в контексте расчета "Числа Проблемы" мы всегда сводим до 1-9.
 * По примеру: 1+9+9+9=28 => 2+8=10 => 1+0=1.
 * @param n Число для сведения.
 * @returns Сведенное число.
 */
function reduceDatePart(n: number): number {
  return reduceToSingleDigit(n);
}

// --- Основная логика расчета ---

/**
 * Рассчитывает Число Проблемы на основе даты рождения.
 * Логика:
 * 1. Свести день, месяц и год к однозначным числам (1-9).
 * 2. Найти Число А: |День - Месяц| (большее минус меньшее) .
 * 3. Найти Число Б: |День - Год| (большее минус меньшее) .
 * 4. Найти Число Проблемы: |Б - А| (большее минус меньшее) .
 *
 * @param dateOfBirth Дата рождения в формате YYYY-MM-DD.
 * @returns Число Проблемы (0-8).
 * @throws Error Если формат даты неверный или результат выходит за рамки 0-8.
 */
function calculateProblemNumber(dateOfBirth: string): ProblemNumber {
  const parts = dateOfBirth.split("-");
  if (parts.length !== 3) {
    throw new Error("Неверный формат даты. Ожидается YYYY-MM-DD.");
  }

  // YYYY-MM-DD
  const day = parseInt(parts[2], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[0], 10);

  // 1. Сведение частей даты до однозначных чисел
  // Примечание: Для месяца и года нужно сначала сложить цифры

  // Пример: 16 => 1+6=7.
  const reducedDay = reduceDatePart(day);
  // Пример: 05 => 0+5=5.
  const reducedMonth = reduceDatePart(month);
  // Пример: 1999 => 1+9+9+9=28 => 10 => 1.
  const reducedYear = reduceDatePart(year);

  // 2. Число А: |День - Месяц| (большее минус меньшее)
  // Пример: 7 - 5 = 2.
  const numberA = Math.abs(reducedDay - reducedMonth);

  // 3. Число Б: |День - Год| (большее минус меньшее)
  // Пример: 7 - 1 = 6.
  const numberB = Math.abs(reducedDay - reducedYear);

  // 4. Число Проблемы: |Б - А| (большее минус меньшее)
  // Пример: 6 - 2 = 4.
  const problemNumber = Math.abs(numberB - numberA);

  // Проверка на допустимые значения 0-8
  if (problemNumber < 0 || problemNumber > 8) {
    throw new Error(
      `Результат расчета Числа Проблемы (${problemNumber}) выходит за ожидаемый диапазон 0-8.`
    );
  }

  return problemNumber as ProblemNumber;
}

// --- Функция экспорта ---

/**
 * Рассчитывает Число Проблемы и возвращает описание на указанном языке.
 *
 * @param dateOfBirth Дата рождения в формате "YYYY-MM-DD" (например, "1999-05-16").
 * @param lang Код языка ('ru', 'en', 'kz', 'tr').
 * @returns Объект ProblemResult с числом проблемы и ее описанием.
 * @throws Error Если дата или код языка недействительны.
 */
export function getNumerologyProblemResult(
  dateOfBirth: string,
  lang: LangCode
): ProblemResult {
  // 1. Проверка языка
  if (!problemDescriptions[lang]) {
    throw new Error(
      `Неподдерживаемый код языка: ${lang}. Допустимые коды: ru, en, kz, tr.`
    );
  }

  // 2. Расчет числа проблемы
  let problemNumber: ProblemNumber;
  try {
    problemNumber = calculateProblemNumber(dateOfBirth);
  } catch (e) {
    // Перебрасываем ошибку с датой
    throw e;
  }

  // 3. Получение локализованного описания
  const localization = problemDescriptions[lang];
  const problemData = localization[problemNumber];

  if (!problemData) {
    // Этого не должно произойти, если calculateProblemNumber корректен (возвращает 0-8)
    throw new Error(`Описание для числа Проблемы ${problemNumber} не найдено.`);
  }

  const description = `${problemData.title}\n\n${problemData.karmaTask}`;

  return {
    problemNumber,
    description,
  };
}

// --- Пример использования (для демонстрации) ---

// // Пример использования: 16.05.1999 => 4
// const dobExample = "1999-05-16";
// const langRu = 'ru' as LangCode;
// const langEn = 'en' as LangCode;

// try {
//     const resultRu = getNumerologyProblemResult(dobExample, langRu);
//     console.log(`--- Результат для ${dobExample} на русском ---`);
//     console.log(`Число Проблемы: ${resultRu.problemNumber}`);
//     console.log(resultRu.description);

//     console.log(`\n--- Результат для ${dobExample} на английском ---`);
//     const resultEn = getNumerologyProblemResult(dobExample, langEn);
//     console.log(`Число Проблемы: ${resultEn.problemNumber}`);
//     console.log(resultEn.description);

//     // Пример с другим числом (например, 20.01.1985)
//     // День: 2+0=2, Месяц: 0+1=1, Год: 1+9+8+5=23=5
//     // А: |2-1|=1
//     // Б: |5-2|=3
//     // Проблема: |3-1|=2
//     const dobExample2 = "1985-01-20";
//     const resultKz = getNumerologyProblemResult(dobExample2, 'kz' as LangCode);
//     console.log(`\n--- Результат для ${dobExample2} на казахском ---`);
//     console.log(`Число Проблемы: ${resultKz.problemNumber}`);
//     console.log(resultKz.description);

// } catch (error) {
//     if (error instanceof Error) {
//         console.error("Ошибка:", error.message);
//     } else {
//         console.error("Неизвестная ошибка:", error);
//     }
// }
