import { PortraitLang } from "../dummy/portrait";

type KarmicItem = {
  code: string;
  title: string;
  pointTask: string;
  howShow: string;
  whatToDo: string;
};

export const buildKarmicItems = (
  codes: string[],
  lang: PortraitLang,
): KarmicItem[] => {
  console.log("buildKarmicItems", { codes, lang });
  if (lang === "tr") {
    return codes.map((code) => ({
      code,
      title:
        (karmic_tr as Record<string, any>)[code]?.title ||
        `Кармический код ${code}`,
      pointTask:
        (karmic_tr as Record<string, any>)[code]?.pointTask ||
        "Суть задачи (заполни позже)",
      howShow:
        (karmic_tr as Record<string, any>)[code]?.howShow ||
        "Как проявляется в жизни (заполни позже)",
      whatToDo:
        (karmic_tr as Record<string, any>)[code]?.whatToDo ||
        "Что важно делать для проработки (заполни позже)",
    }));
  } else if (lang === "en") {
    return codes.map((code) => ({
      code,
      title:
        (karmic_en as Record<string, any>)[code]?.title ||
        `Кармический код ${code}`,
      pointTask:
        (karmic_en as Record<string, any>)[code]?.pointTask ||
        "Суть задачи (заполни позже)",
      howShow:
        (karmic_en as Record<string, any>)[code]?.howShow ||
        "Как проявляется в жизни (заполни позже)",
      whatToDo:
        (karmic_en as Record<string, any>)[code]?.whatToDo ||
        "Что важно делать для проработки (заполни позже)",
    }));
  } else if (lang === "kz") {
    return codes.map((code) => ({
      code,
      title:
        (karmic_kz as Record<string, any>)[code]?.title ||
        `Кармический код ${code}`,
      pointTask:
        (karmic_kz as Record<string, any>)[code]?.pointTask ||
        "Суть задачи (заполни позже)",
      howShow:
        (karmic_kz as Record<string, any>)[code]?.howShow ||
        "Как проявляется в жизни (заполни позже)",
      whatToDo:
        (karmic_kz as Record<string, any>)[code]?.whatToDo ||
        "Что важно делать для проработки (заполни позже)",
    }));
  }
  return codes.map((code) => ({
    code,
    title:
      (karmic_ru as Record<string, any>)[code]?.title ||
      `Кармический код ${code}`,
    pointTask:
      (karmic_ru as Record<string, any>)[code]?.pointTask ||
      "Суть задачи (заполни позже)",
    howShow:
      (karmic_ru as Record<string, any>)[code]?.howShow ||
      "Как проявляется в жизни (заполни позже)",
    whatToDo:
      (karmic_ru as Record<string, any>)[code]?.whatToDo ||
      "Что важно делать для проработки (заполни позже)",
  }));
};

export const karmic_ru = {
  "1": {
    title: "1 — Эго и самооценка",
    pointTask: "научиться здоровой уверенности без гордыни и без самоунижения.",
    howShow:
      "либо чрезмерная самоуверенность, упрямство и желание доказать превосходство, либо страх проявляться и зависимость от мнения людей. Часто жизнь «учит» через критику, унижение, ограничения в деньгах.",
    whatToDo:
      "развивать волю, терпение и осознанность. Проявляться спокойно и по делу, брать ответственность за поступки, перестать жить из желания «доказать». Победа над эго = выполненная задача.",
  },
  "2": {
    title: "2 — Решения и опора на себя",
    pointTask: "преодолеть внутреннюю двойственность и научиться выбирать.",
    howShow:
      "сомнения между «да/нет», колебания, страх ошибиться, зависимость от партнёра или близких. Если 2 стоит первой — одиночество переносится особенно тяжело.",
    whatToDo:
      "тренировать самостоятельность: принимать решения и не перекладывать их на других. Отличать нерешительность от разумной смены мнения. Развивать знания и опыт — через это приходит уверенность. Часто реализация идёт через наставничество/психологию/обучение других.",
  },
  "3": {
    title: "3 — Любовь, служение, отдача",
    pointTask:
      "жить через пользу миру — помощь, исцеление, поддержку, творчество.",
    howShow:
      "жизнь проверяет на щедрость и бескорыстие; главный экзамен — жадность и закрытость.",
    whatToDo:
      "принцип «отдал и отпустил»: делиться временем, знаниями, заботой, ресурсом. Развивать доброту и альтруизм. Чем свободнее отдача (без ожиданий), тем сильнее обратный поток.",
  },
  "4": {
    title: "4 — Материализация и ответственность",
    pointTask:
      "сильная энергия исполнения желаний, но с высокой ответственностью.",
    howShow:
      "мысли и намерения быстрее «собирают реальность»; при неэкологичных поступках последствия ощущаются сильнее. Часто есть трудность принимать деньги, помощь, подарки и оплату — отсюда чувство нехватки.",
    whatToDo:
      "освоить баланс «давать/брать», учиться принимать без вины. Принять, что абсолютной стабильности не бывает: жизнь будет проверять переменами. Самореализация, дисциплина и здоровое отношение к деньгам защищают от тревоги и зависимостей.",
  },
  "5": {
    title: "5 — Свобода и самореализация",
    pointTask:
      "внутренняя свобода, творчество, идеи, тема детей и проявления личности.",
    howShow:
      "ограничения через обстоятельства, работу, семью или страхи; творческие кризисы; протест против рамок. Без реализации возможны зависимости и саморазрушительные привычки.",
    whatToDo:
      "перестать бороться с жизнью «в лоб», учиться проживать ограничения осознанно. Найти своё дело: если нет времени — нет свободы; если свободы много, но пусто — нужен смысл и реализация. Важно выходить из долгов/зависимостей и направлять энергию в созидание.",
  },
  "6": {
    title: "6 — Деньги и спокойствие",
    pointTask:
      "гармоничные отношения с материальным, умение принимать изобилие без тревоги.",
    howShow:
      "страх потерь притягивает нестабильность; возможна чрезмерная фиксация на деньгах. Часто это «проверка на привязанность» к материальному при хорошем потенциале достатка.",
    whatToDo:
      "развивать доверие к жизни и внутреннее спокойствие. Деньги воспринимать как инструмент, а не источник тревоги. Учиться принимать и сохранять баланс: расход/накопления/щедрость.",
  },
  "7": {
    title: "7 — Семья и отношения",
    pointTask: "глубокая проработка партнёрства, семьи и родовых связей.",
    howShow:
      "крайности (сильное желание семьи ↔ отрицание), сложные браки, «люблю/ненавижу», повторяющиеся сценарии. Часто много обид: человек «залипает» в конфликте и теряет энергию.",
    whatToDo:
      "учиться зрелым отношениям: уважение к противоположному полу, границы, диалог, видение в партнёре личности, а не «обязанностей». Отдельная задача — отпускать обиды и не питать конфликт внутренней борьбой.",
  },
  "8": {
    title: "8 — Удача, сила, зрелость",
    pointTask: "научиться правильно обращаться с удачей и потерями.",
    howShow:
      "судьбоносные шансы, власть/влияние, резкие взлёты и проверки. При непроработке — «сбрасывание с пьедестала» через кризисы, зависимости, потери, разрушение карьеры.",
    whatToDo:
      "благодарность вместо гордыни, спокойствие вместо отчаяния. Уметь держать баланс в успехе и в падениях. Развивать зрелость и управление ресурсами — тогда приходят устойчивость и сила.",
  },
  "9": {
    title: "9 — Ум и мудрость",
    pointTask: "соединить интеллект с интуицией и внутренним знанием.",
    howShow:
      "рациональность доминирует, появляется высокомерие, жёсткость, конфликты, «гордыня ума». Жизнь учит терпимости и гибкости. На фоне стресса возможны перегрузка, проблемы «от головы».",
    whatToDo:
      "развивать мудрость: слушать не только логику, но и интуицию. Учиться сомневаться, расширять картину мира, не подавлять других знаниями. Формула 9: «чем больше знаю — тем больше понимаю, как много не знаю».",
  },
  "0": {
    title: "0 — Обнуление и обновления",
    pointTask: "школа гибкости и умения отпускать прошлое.",
    howShow:
      "жизнь периодически «обнуляет» планы, стабильность, материальные опоры — особенно если человек слишком привязывается к результату.",
    whatToDo:
      "легче принимать перемены и не цепляться за контроль. Видеть в обнулении очищение и новый старт. Чем меньше сопротивления — тем мягче проходят потери.",
  },
  "11": {
    title: "11 — Власть и лидерство",
    pointTask: "сильная энергия руководителя и организатора.",
    howShow:
      "независимость, амбиции, «я сам». При непроработке — гордыня, убеждённость в своей абсолютной правоте, болезненная реакция на критику.",
    whatToDo:
      "лидерство через ответственность и зрелость: слышать людей, уважать чужую точку зрения, управлять без давления.",
  },
  "22": {
    title: "22 — Контроль и человечность",
    pointTask: "мощный управленческий потенциал, усиленный вдвое.",
    howShow:
      "жёсткость, давление, нетерпимость, стремление контролировать всё. При минусе — унижение подчинённых, управление из страха, накопленная злость (часто «бьёт» по телу).",
    whatToDo:
      "развивать терпение, мягкость и уважение. Принимать людей такими, какие они есть. Управлять справедливо и взвешенно — тогда за человеком идут из доверия, а не из страха.",
  },
  "33": {
    title: "33 — Миссия помощи и границы",
    pointTask: "путь любви, служения, поддержки; «целитель душ».",
    howShow:
      "сильное желание помогать, вдохновлять, лечить, наставлять. Риск — тащить всё на себе, переживать за всех, забывая о границах. Если отказаться от миссии — закрытие потока отдачи может отражаться на состоянии.",
    whatToDo:
      "помогать экологично: служение + личные границы. Не «спасать всех», а делать своё дело честно, регулярно и с заботой о себе.",
  },
  "44": {
    title: "44 — Сила слова и влияния",
    pointTask: "способность сильно влиять на реальность и людей.",
    howShow:
      "слово и установки быстро материализуются. При минусе — жалобы и негатив «притягивают» соответствующие сценарии.",
    whatToDo:
      "контролировать речь и внутренние установки: меньше жалоб — больше конструктивных формулировок. Использовать влияние этично и созидательно.",
  },
  "55": {
    title: "55 — Слово, творчество, тема детей",
    pointTask: "мощная сила слова и творческого воздействия.",
    howShow:
      "харизма, влияние на атмосферу и людей, «слово запускает события». Главная кармическая тема — дети (вариативно: много детей/сложности/поздние сценарии — в зависимости от продолжения кода). В минусе — обиды и злость могут «портить» судьбу и отношения.",
    whatToDo:
      "следить за словами и мыслями, развивать творчество, проживать эмоции экологично. Не держать обиды, не копить зло. Реализация и созидание усиливают удачу кода.",
  },
  "66": {
    title: "66 — Денежный поток",
    pointTask:
      "большие материальные возможности и урок правильного обращения с деньгами.",
    howShow:
      "крайности «коплю/боюсь потерять» или «деньги утекают». Возможны денежные программы прошлого: страх бедности, голода, потерь.",
    whatToDo:
      "деньги должны «дышать»: тратить спокойно, обновлять поток, не застревать в накоплении. Работать со страхом потерь и учиться решениям. Дисциплина и финансовая система — ключ.",
  },
  "77": {
    title: "77 — Любовь и выбор партнёра",
    pointTask: "зрелая любовь и семья без идеализации.",
    howShow:
      "высокие требования, поиск «идеала», зависимость от внешних критериев, разочарования. При непроработке — одиночество, эмоциональные качели, сложности в теме семьи.",
    whatToDo:
      "выбирать сердцем и ценностями, а не иллюзиями. Учиться принимать людей, строить зрелые союзы и работать с ожиданиями.",
  },
  "88": {
    title: "88 — Удача и развитие",
    pointTask:
      "вы являетесь любимчиком Бога. Удача даётся авансом, но требуется движение вперёд.",
    howShow:
      "двери открываются легко; риск — расслабиться, стать пассивным, «привыкнуть к лёгкому». При игнорировании — апатия, зависимости, падение с высоты.",
    whatToDo:
      "благодарить и действовать. Развиваться, учиться, расширять горизонты, делиться благами. Удача держится на активности и щедрости.",
  },
  "99": {
    title: "99 — Мудрость вместо превосходства",
    pointTask: "сильный интеллект и влияние на мышление людей.",
    howShow:
      "в плюсе — учитель/мудрец, в минусе — гордыня ума, неприятие чужого мнения, внутреннее одиночество и конфликты.",
    whatToDo:
      "не доказывать, что ты самый умный, а передавать знания: учить, объяснять, помогать людям понимать. Настоящая сила 99 — в мудрости и пользе.",
  },
  "00": {
    title: "00 — Интуиция и усиленные обнуления",
    pointTask: "мощная интуиция + уроки обновления и защиты.",
    howShow:
      "ощущение «я другой(ая)», частые перезапуски, повышенная чувствительность к энергии среды.",
    whatToDo:
      "осознанные практики, дисциплина, духовное развитие и гигиена окружения. Использовать интуицию как навигатор, а не жить в тревоге.",
  },
  "10-01": {
    title: "10–01 — Смелость и осознанный риск",
    pointTask: "пройти страхи и научиться действовать смело, но разумно.",
    howShow: "внезапные события, проверка на храбрость, ощущение «по краю».",
    whatToDo:
      "развивать осознанный риск: видеть опасность, но не жить в панике; укреплять уверенность через опыт и подготовку.",
  },
  "20-02": {
    title: "20–02 — Закон и ответственность",
    pointTask: "жить честно, уважая правила и договорённости.",
    howShow:
      "темы документов, проверок, официальных структур; обман и уход от ответственности быстро возвращаются «бумерангом».",
    whatToDo:
      "действовать прозрачно, соблюдать договоры, решать вопросы официально. Закон здесь — ориентир, а не враг.",
  },
  "30-03": {
    title: "30–03 — Помощь и поддержка",
    pointTask: "быть полезным(ой) людям: исцелять, поддерживать, служить.",
    howShow:
      "человек тонко чувствует, кому нужна помощь, становится «опорой». Если закрыться — энергия застаивается и может отражаться на самочувствии.",
    whatToDo:
      "помогать по силам и без спасательства. Достаточно честно делать своё дело и делиться теплом там, где уместно.",
  },
  "40-04": {
    title: "40–04 — Нестабильность и внутренняя опора",
    pointTask: "перестать цепляться за иллюзию полной стабильности.",
    howShow:
      "сбои планов, перемены, «проверки на выдержку». Страх потерь притягивает сценарии, которых человек боится.",
    whatToDo:
      "укреплять внутреннюю опору: гибкость, спокойствие, план Б, финансовая подушка. Меньше драматизации — больше адаптации и доверия к жизни.",
  },
  "50-05": {
    title: "50–05 — Свобода, творчество, дети",
    pointTask: "свобода через зрелость и реализацию.",
    howShow:
      "творческие кризисы, нестабильность в отношениях, неудовлетворённость выбором; у женщин — тревога и контроль по теме детей, что может блокировать материнство. В напряжении возможен уход в зависимости (чаще у мужчин).",
    whatToDo:
      "отпускать контроль, проживать творческие спады спокойно, не искать «выход» в разрушительных привычках. Найти своё дело и укреплять внутреннюю устойчивость.",
  },
  "60-06": {
    title: "60–06 — Финансовая зрелость и безопасность",
    pointTask: "управлять деньгами без паники и без авантюр.",
    howShow:
      "деньги могут приходить и уходить волнами; потери возможны из-за спешки, амбиций, кредитов «не по средствам», желания впечатлить. Если встречается 060 — повышенная осторожность в дороге/технике/поездках.",
    whatToDo:
      "финансовые решения — только осознанно: расчёт, план, обязательства «по силам». Спокойная реакция на колебания быстрее возвращает поток.",
  },
  "70-07": {
    title: "70–07 — Любовь, семья, родовые сценарии",
    pointTask: "распутать семейные узлы и строить зрелые отношения.",
    howShow:
      "разочарования в любви, риск ранних решений, сильная привязанность, «растворение» в семье, неравные чувства.",
    whatToDo:
      "не спешить с официальным браком, сначала выстроить фундамент отношений. Учиться границам, честности, уважению и осознанию родовых повторов.",
  },
  "80-08": {
    title: "80–08 — Судьбоносные испытания и трансформация",
    pointTask: "пройти сильные жизненные повороты и выйти взрослее и сильнее.",
    howShow:
      "потери, травмы, утраты, резкие перемены; ощущение «рока». Это не наказание, а глубокая перестройка и очищение (часто затрагивает и родовые программы).",
    whatToDo:
      "не уходить в отчаяние, принимать поддержку, держаться за смысл и движение вперёд. Принятие уроков превращает испытания в силу и уважение.",
  },
  "90-09": {
    title: "90–09 — Мышление и “горе от ума”",
    pointTask: "управлять умом, а не жить в накручивании.",
    howShow:
      "тревожные ожидания, зацикленность на негативе, обидчивость, жалобы, мнительность. При сильном стрессе могут проявляться проблемы «по голове/сосудам» как сигнал перегруза.",
    whatToDo:
      "тренировать фокус: замечать хорошее, менять мыслительные сценарии, развивать спокойствие и мудрость. Уму нужна гигиена: отдых, режим, меньше самонакрутки.",
  },
  "010": {
    title: "010 — Страх и контроль",
    pointTask: "научиться видеть риски без паники.",
    howShow: "либо игнор опасности, либо тревожная сверхреакция.",
    whatToDo: "действовать осознанно: оценка риска → план → спокойное решение.",
  },
  "020": {
    title: "020 — Закон и порядок",
    pointTask: "честность, правила, ответственность.",
    howShow: "документы, финансы, проверки, недоразумения с системами.",
    whatToDo:
      "порядок в бумагах и деньгах, прозрачные договорённости, спокойствие.",
  },
  "030": {
    title: "030 — Отдача и зрелость",
    pointTask: "гармоничный обмен с миром.",
    howShow:
      "если закрыться — появляются сигналы через стресс/усталость/мелкие трудности.",
    whatToDo: "делиться в комфортных рамках: внимание, знания, участие.",
  },
  "040": {
    title: "040 — Дом и материальная опора",
    pointTask: "ответственность за быт и имущество.",
    howShow: "поломки, потери, ошибки в сделках, доверие не тем людям.",
    whatToDo:
      "проверять документы, не спешить, не отдавать контроль посторонним.",
  },
  "050": {
    title: "050 — Дети, эмоции, спокойствие",
    pointTask: "забота без тревожного контроля.",
    howShow: "зацикленность на детской теме, страхи, внутреннее напряжение.",
    whatToDo:
      "учиться доверию и мудрому родительству: поддержка вместо паники.",
  },
  "060": {
    title: "060 — Деньги и ответственность",
    pointTask: "зрелые финансовые решения.",
    howShow: "потери из-за спешки, кредитов, желания впечатлить.",
    whatToDo:
      "считать риски, брать обязательства только «по силам», планировать.",
  },
  "070": {
    title: "070 — Род и отношения",
    pointTask: "повторяющиеся сценарии в любви как родовой урок.",
    howShow: "разрывы, одиночество «в паре», семейные узлы.",
    whatToDo: "осознать семейные сценарии, строить честные и зрелые отношения.",
  },
  "080": {
    title: "080 — Утраты и взросление",
    pointTask: "принятие перемен и потерь как пути роста.",
    howShow: "сильные перемены, которые меняют мировоззрение.",
    whatToDo:
      "поддержка, вера, постепенное принятие, движение маленькими шагами.",
  },
  "090": {
    title: "090 — Ум и гибкость",
    pointTask: "интеллект + гибкость = мудрость.",
    howShow: "жёсткость мышления, уверенность в своей правоте, кризисы.",
    whatToDo: "учиться слушать, сомневаться, расширять взгляд на жизнь.",
  },
};

export const karmic_tr = {
  "1": {
    title: "1 – Ego ve özgüven",
    pointTask:
      "Gurur duymadan ve kendini küçümsemeden sağlıklı özgüveni öğren.",
    howShow:
      "ya aşırı özgüven, inatçılık ve üstünlüğü kanıtlama arzusu ya da ortaya çıkma korkusu ve insanların görüşlerine bağımlılık. Hayat çoğu zaman eleştiri, aşağılama ve para kısıtlamaları yoluyla “öğretir”.",
    whatToDo:
      'irade, sabır ve farkındalık geliştirin. Sakince ve net bir şekilde ortaya çıkın, eylemlerinizin sorumluluğunu alın, "kanıtlama" arzusuyla yaşamayı bırakın. Egoyu yenmek = görev tamamlandı.',
  },
  "2": {
    title: "2 - Kararlar ve özgüven",
    pointTask: "içsel dualitenin üstesinden gelin ve seçim yapmayı öğrenin.",
    howShow:
      "“evet/hayır” arasındaki şüpheler, tereddüt, hata yapma korkusu, partnere ya da sevdiklerine bağımlılık. Eğer 2 önce gelirse, yalnızlığa katlanmak özellikle zordur.",
    whatToDo:
      "Bağımsızlığı eğitin: kararlar alın ve bunları başkalarına aktarmayın. Kararsızlık ile makul görüş değişikliği arasındaki farkı ayırt edin. Bilgi ve deneyimin geliştirilmesi - bu sayede güven gelir. Uygulama genellikle mentorluk/psikoloji/başkalarını eğitmek yoluyla gerçekleşir.",
  },
  "3": {
    title: "3 – Sevgi, hizmet, vermek",
    pointTask:
      "dünyaya fayda sağlayarak yaşayın - yardım, şifa, destek, yaratıcılık.",
    howShow:
      "hayat cömertliği ve özveriyi sınar; asıl sınav açgözlülük ve kapalılıktır.",
    whatToDo:
      '"Ver ve bırak" ilkesi: zamanı, bilgiyi, ilgiyi, kaynağı paylaşmak. Nezaket ve fedakarlığı geliştirin. Geri dönüş ne kadar özgürse (beklentiler olmadan), geri dönüş akışı da o kadar güçlü olur.',
  },
  "4": {
    title: "4 – Gerçekleştirme ve sorumluluk",
    pointTask:
      "Arzuları yerine getirmek için güçlü enerji, ancak yüksek sorumlulukla.",
    howShow:
      "düşünceler ve niyetler daha hızlı “gerçeği bir araya getirir”; Çevreye aykırı davranıldığında sonuçları daha güçlü hissedilir. Genellikle parayı, yardımı, hediyeleri ve ödemeleri kabul etmede zorluk yaşanır; dolayısıyla eksiklik hissi oluşur.",
    whatToDo:
      "“Verme/alma” dengesinde ustalaşın, suçluluk duymadan kabul etmeyi öğrenin. Mutlak istikrar diye bir şeyin olmadığını kabul edin: Hayat sizi değişimlerle sınayacaktır. Kendini gerçekleştirme, disiplin ve paraya karşı sağlıklı bir tutum, kaygı ve bağımlılıklara karşı koruma sağlar.",
  },
  "5": {
    title: "5 – Özgürlük ve kendini gerçekleştirme",
    pointTask:
      "iç özgürlük, yaratıcılık, fikirler, çocuk teması ve kişiliğin tezahürleri.",
    howShow:
      "koşullar, iş, aile veya korkulardan kaynaklanan kısıtlamalar; yaratıcı krizler; çerçeveyi protesto ediyorum. Farkındalık olmadan bağımlılıklar ve kendine zarar veren alışkanlıklar mümkündür.",
    whatToDo:
      "Hayatla doğrudan mücadele etmeyi bırakın, sınırlamalarla bilinçli olarak yaşamayı öğrenin. Kendi işinizi bulun: Zaman yoksa özgürlük de yoktur; Çok fazla özgürlük varsa ama boşsa, anlam ve uygulamaya ihtiyacınız var. Borç/bağımlılıklardan kurtulmak ve enerjiyi yaratıma yönlendirmek önemlidir.",
  },
  "6": {
    title: "6 – Para ve gönül rahatlığı",
    pointTask:
      "maddi şeylerle uyumlu ilişkiler, bolluğu kaygısızca kabul etme yeteneği.",
    howShow:
      'kaybetme korkusu istikrarsızlığı çeker; Paraya aşırı bağlılık mümkündür. Çoğu zaman bu, iyi bir zenginlik potansiyeline sahip maddi şeylere yönelik bir "bağlılık testidir".',
    whatToDo:
      "hayata güveninizi ve iç huzurunuzu geliştirin. Parayı bir kaygı kaynağı olarak değil, bir araç olarak görün. Dengeyi kabul etmeyi ve korumayı öğrenin: harcama/tasarruf/cömertlik.",
  },
  "7": {
    title: "7 – Aile ve ilişkiler",
    pointTask: "ortaklık, aile ve ata bağlarının derinlemesine incelenmesi.",
    howShow:
      "aşırılıklar (aileye yönelik güçlü arzu ↔ inkar), zor evlilikler, “aşk/nefret”, tekrarlanan senaryolar. Çoğu zaman pek çok şikayet vardır: Kişi bir çatışmanın içinde sıkışıp kalır ve enerjisini kaybeder.",
    whatToDo:
      'Olgun ilişkileri öğrenin: karşı cinse saygı, sınırlar, diyalog, partnerinizi "sorumluluklar" olarak değil, bir birey olarak görmeyi öğrenin. Ayrı bir görev, şikayetlerden vazgeçmek ve çatışmayı iç mücadeleyle körüklememektir.',
  },
  "8": {
    title: "8 – Şans, güç, olgunluk",
    pointTask:
      "Şans ve kayıplarla nasıl doğru şekilde başa çıkılacağını öğrenin.",
    howShow:
      'kaçınılmaz şanslar, güç/nüfuz, keskin yükselişler ve kontroller. Eğer üzerinde çalışılmazsa bu, krizler, bağımlılıklar, kayıplar ve kariyer yıkımı yoluyla "kaideden aşağı atılmak" anlamına gelir.',
    whatToDo:
      "Gurur yerine şükran, umutsuzluk yerine sakinlik. Başarı ve başarısızlık arasında denge kurabilmek. Olgunluğu ve kaynak yönetimini geliştirin; ardından dayanıklılık ve güç gelir.",
  },
  "9": {
    title: "9 - Zeka ve bilgelik",
    pointTask: "Zekayı sezgi ve içsel bilişle birleştirin.",
    howShow:
      "rasyonellik hakim olur, kibir, katılık, çatışmalar ve “gurur” ortaya çıkar. Hayat hoşgörüyü ve esnekliği öğretir. Stresin arka planında aşırı yüklenme ve “kafadan” sorunlar mümkündür.",
    whatToDo:
      "Bilgeliği geliştirin: sadece mantığı değil aynı zamanda sezgiyi de dinleyin. Şüphe etmeyi öğrenin, dünya resminizi genişletin ve başkalarını bilgiyle bastırmayın. Formül 9: “Ne kadar çok bilirsem, ne kadar çok şey bilmediğimi de o kadar iyi anlıyorum.”",
  },
  "0": {
    title: "0 — Sıfırlama ve güncellemeler",
    pointTask: "esneklik ve geçmişi bırakma yeteneği okulu.",
    howShow:
      'hayat periyodik olarak planları, istikrarı, maddi desteği "sıfırlar" - özellikle de kişi sonuca fazla bağlanırsa.',
    whatToDo:
      "Değişimi kabul etmek ve kontrole bağlı kalmamak daha kolaydır. Sıfırlamayı arınma ve yeni bir başlangıç ​​olarak görün. Direnç ne kadar az olursa kayıplar da o kadar yumuşak olur.",
  },
  "11": {
    title: "11 - Güç ve liderlik",
    pointTask: "Bir liderin ve organizatörün güçlü enerjisi.",
    howShow:
      "bağımsızlık, hırs, “kendim”. Eğer derinlemesine çalışılmazsa, bu gururla, kişinin kesinlikle haklı olduğu inancıyla ve eleştiriye acı veren bir tepkiyle sonuçlanır.",
    whatToDo:
      "Sorumluluk ve olgunluk yoluyla liderlik: insanları dinlemek, diğer insanların bakış açılarına saygı duymak, baskı olmadan yönetmek.",
  },
  "22": {
    title: "22 – Kontrol ve insanlık",
    pointTask: "Güçlü yönetim potansiyeli iki katına çıktı.",
    howShow:
      'katılık, baskı, hoşgörüsüzlük, her şeyi kontrol etme arzusu. Eksi - astların aşağılanması, korkudan yönetim, birikmiş öfke (genellikle vücuda "vurur").',
    whatToDo:
      "Sabır, nezaket ve saygıyı geliştirin. İnsanları olduğu gibi kabul edin. Adil ve dengeli bir şekilde yönetmek için - o zaman insanlar bir kişiyi korkudan değil güvenden takip eder.",
  },
  "33": {
    title: "33 – Yardım misyonu ve sınırlar",
    pointTask: 'sevginin, hizmetin, desteğin yolu; "ruhların şifacısı"',
    howShow:
      "yardım etmek, ilham vermek, iyileştirmek, talimat vermek için güçlü bir arzu. Risk, her şeyi kendi üzerine taşımak, herkes için endişelenmek, sınırları unutmaktır. Görevi bırakırsanız geri dönüş akışının kapanması durumunuzu etkileyebilir.",
    whatToDo:
      'Çevresel yardım: hizmet + kişisel sınırlar. "Herkesi kurtarmak" değil, işinizi dürüst, düzenli ve öz bakımla yapmak.',
  },
  "44": {
    title: "44 – Kelimelerin ve etkinin gücü",
    pointTask: "gerçekliği ve insanları büyük ölçüde etkileme yeteneği.",
    howShow:
      "sözler ve tutumlar hızla hayata geçer. Olumsuzsa, şikayetler ve olumsuzluk ilgili senaryoları “çeker”.",
    whatToDo:
      "Konuşmayı ve iç tutumları kontrol edin: daha az şikayet - daha yapıcı formülasyonlar. Etkiyi etik ve yaratıcı bir şekilde kullanın.",
  },
  "55": {
    title: "55 – Kelime, yaratıcılık, çocuk teması",
    pointTask: "kelimelerin güçlü gücü ve yaratıcı etki.",
    howShow:
      "karizma, atmosfer ve insanlar üzerindeki etki, “söz olayları tetikler.” Ana karmik tema çocuklardır (değişken: birçok çocuk/karmaşıklık/sonraki senaryolar - kodun devamına bağlı olarak). Diğer taraftan, kızgınlık ve öfke kaderi ve ilişkileri “bozabilir”.",
    whatToDo:
      "kelimeleri ve düşünceleri izleyin, yaratıcılığı geliştirin, duyguları çevreci olarak yaşayın. Kin tutmayın, kötülük biriktirmeyin. Uygulama ve oluşturma, kodun şansını artırır.",
  },
  "66": {
    title: "66 - Nakit akışı",
    pointTask:
      "harika maddi fırsatlar ve paranın doğru kullanılması konusunda bir ders.",
    howShow:
      'aşırılıklar: "Biriktiriyorum/kaybetmekten korkuyorum" veya "para akıp gidiyor." Geçmişin olası parasal programları: yoksulluk korkusu, açlık, kayıp.',
    whatToDo:
      "para “nefes almalı”: sakince harcayın, akışı yenileyin ve birikime takılıp kalmayın. Kayıp korkusuyla çalışın ve çözümleri öğrenin. Disiplin ve finansal sistem anahtardır.",
  },
  "77": {
    title: "77 – Sevgi ve partner seçimi",
    pointTask: "idealleştirme olmadan olgun aşk ve aile.",
    howShow:
      "yüksek talepler, “ideal” arayışı, dış kriterlere bağımlılık, hayal kırıklıkları. Üzerinde çalışılmazsa - yalnızlık, duygusal dalgalanmalar, aile konusundaki zorluklar.",
    whatToDo:
      "yanılsamalarla değil, kalbinizle ve değerlerinizle seçin. İnsanları kabul etmeyi, olgun ittifaklar kurmayı ve beklentilerle çalışmayı öğrenin.",
  },
  "88": {
    title: "88 – Şans ve gelişme",
    pointTask:
      "sen Tanrı'nın gözdesisin. Şans önceden verilir ama ileri hareket gereklidir.",
    howShow:
      "kapılar kolayca açılır; Risk rahatlamak, pasifleşmek, “kolay şeylere alışmaktır”. Göz ardı edilirse - ilgisizlik, bağımlılık, yüksekten düşme.",
    whatToDo:
      "teşekkür edin ve harekete geçin. Geliştirin, öğrenin, ufukları genişletin, faydaları paylaşın. Şans aktiviteye ve cömertliğe bağlıdır.",
  },
  "99": {
    title: "99 - Üstünlük yerine bilgelik",
    pointTask: "Güçlü zeka ve insanların düşünceleri üzerinde etki.",
    howShow:
      "artı öğretmen/bilge, eksi gurur, diğer insanların fikirlerinin reddedilmesi, içsel yalnızlık ve çatışmalardır.",
    whatToDo:
      "En zeki olduğunuzu kanıtlamayın, ancak bilgiyi aktarın: öğretin, açıklayın, insanların anlamalarına yardımcı olun. 99'un gerçek gücü bilgelik ve kullanışlılıktır.",
  },
  "00": {
    title: "00 — Sezgi ve geliştirilmiş sıfırlama",
    pointTask: "güçlü sezgi + yenilenme ve koruma dersleri.",
    howShow:
      "“Ben farklıyım” hissi, sık sık yeniden başlama, çevresel enerjiye karşı artan hassasiyet.",
    whatToDo:
      "bilinçli uygulamalar, disiplin, manevi gelişim ve çevre hijyeni. Kaygı içinde yaşamak yerine sezgilerinizi yön bulma aracı olarak kullanın.",
  },
  "10-01": {
    title: "10–01 — Cesaret ve bilinçli risk",
    pointTask:
      "Korkuların üstesinden gelin ve cesur ama akıllıca hareket etmeyi öğrenin.",
    howShow: "ani olaylar, bir cesaret sınavı, “sınırda olma” hissi.",
    whatToDo:
      "bilinçli risk geliştirin: tehlikeyi görün ama panik içinde yaşamayın; Deneyim ve eğitim yoluyla güven inşa edin.",
  },
  "20-02": {
    title: "20–02 — Hukuk ve sorumluluk",
    pointTask: "dürüstçe, kurallara ve anlaşmalara saygı göstererek yaşayın.",
    howShow:
      "belge konuları, denetimler, resmi yapılar; aldatma ve sorumluluktan kaçma hızla bir bumerang olarak geri döner.",
    whatToDo:
      "Şeffaf davranın, sözleşmelere uyun, sorunları resmi olarak çözün. Burada kanun bir düşman değil, bir rehberdir.",
  },
  "30-03": {
    title: "30–03 — Yardım ve destek",
    pointTask:
      "insanlara faydalı olmak: iyileştirmek, desteklemek, hizmet etmek.",
    howShow:
      "kişi kimin yardıma ihtiyacı olduğunu incelikle sezer ve “destek” olur. Kendinizi kapatırsanız enerjiniz durur ve sağlığınızı etkileyebilir.",
    whatToDo:
      "kurtarmadan mümkün olduğunca yardım edin. İşinizi dürüstçe yapmanız ve yeri geldiğinde sıcaklığı paylaşmanız yeterlidir.",
  },
  "40-04": {
    title: "40–04 - İstikrarsızlık ve iç destek",
    pointTask: "Tam istikrar yanılsamasına tutunmayı bırakın.",
    howShow:
      "planlardaki başarısızlıklar, değişiklikler, “dayanıklılık testleri”. Kaybetme korkusu kişinin korktuğu senaryoları kendine çeker.",
    whatToDo:
      "İç desteği güçlendirin: esneklik, sakinlik, B planı, finansal yastık. Daha az dramatizasyon, hayata daha fazla uyum ve güven anlamına gelir.",
  },
  "50-05": {
    title: "50–05 — Özgürlük, yaratıcılık, çocuklar",
    pointTask: "Olgunluk ve gerçekleşme yoluyla özgürlük.",
    howShow:
      "yaratıcı krizler, ilişkilerde istikrarsızlık, seçimlerden memnuniyetsizlik; kadınlarda - anneliği engelleyebilecek çocuk konusu üzerinde kaygı ve kontrol. Gerginlik durumunda bağımlı bakım mümkündür (daha sıklıkla erkeklerde).",
    whatToDo:
      "kontrolü bırakmak, yaratıcı çöküşleri sakince yaşamak, yıkıcı alışkanlıklarda bir “çıkış yolu” aramamak. Kendi işinizi bulun ve iç istikrarınızı güçlendirin.",
  },
  "60-06": {
    title: "60–06 — Finansal olgunluk ve güvenlik",
    pointTask: "Panik yapmadan ve macera yaşamadan parayı yönetin.",
    howShow:
      'para dalgalar halinde gelip gidebilir; Acelecilik, hırs, "kendi imkanlarının ötesinde" krediler ve etkileme arzusu nedeniyle kayıplar mümkündür. 060 meydana gelirse - yolda/ekipmanda/seyahatte daha fazla dikkat.',
    whatToDo:
      'mali kararlar - yalnızca bilinçli olarak: hesaplama, plan, "kişinin gücü dahilindeki" yükümlülükler. Titreşimlere verilen sakin tepki, akışı daha hızlı döndürür.',
  },
  "70-07": {
    title: "70–07 — Aşk, aile, genel senaryolar",
    pointTask: "aile düğümlerini çözün ve olgun ilişkiler kurun.",
    howShow:
      "aşkta hayal kırıklıkları, erken karar verme riski, güçlü bağlılık, ailede “çözülme”, eşitsiz duygular.",
    whatToDo:
      "Resmi evliliğe acele etmeyin, önce ilişkinin temelini oluşturun. Sınırları, dürüstlüğü, saygıyı ve doğum tekrarlarına dair farkındalığı öğrenin.",
  },
  "80-08": {
    title: "80–08 - Kader denemeleri ve dönüşüm",
    pointTask:
      "Güçlü yaşam değişimlerinden geçin ve daha olgun ve daha güçlü çıkın.",
    howShow:
      'kayıplar, travmalar, yaslar, ani değişimler; "kaya" hissi. Bu bir ceza değil, derin bir yeniden yapılanma ve temizliktir (genellikle genel programları etkiler).',
    whatToDo:
      "Umutsuzluğa kapılmayın, desteği kabul edin, anlama tutunun ve ilerleyin. Dersleri kabul etmek, zorlukları güce ve saygıya dönüştürür.",
  },
  "90-09": {
    title: "90–09 — Düşünme ve “zihinden gelen keder”",
    pointTask: "Zihnini kontrol et ve gerilim içinde yaşama.",
    howShow:
      "endişeli beklentiler, olumsuza odaklanma, alınganlık, şikayetler, şüphecilik. Şiddetli stres altında kafa/damar sorunları aşırı yüklenmenin sinyali olarak ortaya çıkabilir.",
    whatToDo:
      "Odaklanmayı eğitin: iyiyi fark edin, zihinsel senaryoları değiştirin, sakinliği ve bilgeliği geliştirin. Zihnin hijyene ihtiyacı vardır: dinlenmeye, rutine, daha az kendini aldatmaya.",
  },
  "010": {
    title: "010 – Korku ve kontrol",
    pointTask: "Panik yapmadan riskleri görmeyi öğrenin.",
    howShow:
      "ya tehlikeyi görmezden gelmek ya da endişeli bir aşırı tepki vermek.",
    whatToDo:
      "bilinçli hareket edin: risk değerlendirmesi → plan → sakin karar.",
  },
  "020": {
    title: "020 – Kanun ve Düzen",
    pointTask: "dürüstlük, kurallar, sorumluluk.",
    howShow: "belgeler, finans, çekler, sistemlerle ilgili yanlış anlamalar.",
    whatToDo: "Kağıt ve parada düzen, şeffaf anlaşmalar, gönül rahatlığı.",
  },
  "030": {
    title: "030 – Geri verme ve olgunluk",
    pointTask: "dünyayla uyumlu alışveriş.",
    howShow:
      "kendinizi kapatırsanız stres/yorgunluk/küçük zorluklar yoluyla sinyaller ortaya çıkar.",
    whatToDo: "rahat bir çerçevede paylaşın: dikkat, bilgi, katılım.",
  },
  "040": {
    title: "040 – Ev ve malzeme desteği",
    pointTask: "can ve mal sorumluluğu.",
    howShow: "arızalar, kayıplar, işlemlerde hatalar, yanlış kişilere güvenme.",
    whatToDo:
      "Belgeleri kontrol edin, acele etmeyin, kontrolü yabancılara bırakmayın.",
  },
  "050": {
    title: "050 – Çocuklar, duygular, sakinlik",
    pointTask: "endişeli kontrol olmadan bakım.",
    howShow: "çocuk temalarına takıntı, korkular, iç gerilim.",
    whatToDo: "Güven ve akıllı ebeveynliği öğrenin: panik yerine destek.",
  },
  "060": {
    title: "060 – Para ve Sorumluluk",
    pointTask: "olgun finansal kararlar.",
    howShow: "acele, krediler, etkileme arzusundan kaynaklanan kayıplar.",
    whatToDo:
      'Riskleri göz önünde bulundurun, yalnızca "kendi gücü dahilinde" yükümlülükler üstlenin ve plan yapın.',
  },
  "070": {
    title: "070 – Cinsiyet ve ilişkiler",
    pointTask: "Bir doğum dersi olarak aşkta senaryoların tekrarlanması.",
    howShow: "ayrılıklar, “çift olarak yalnızlık”, aile düğümleri.",
    whatToDo: "aile senaryolarını anlayın, dürüst ve olgun ilişkiler kurun.",
  },
  "080": {
    title: "080 – Kayıp ve Büyümek",
    pointTask: "Değişimi ve kaybı büyümenin bir yolu olarak kabul etmek.",
    howShow: "Dünya görüşünü değiştiren güçlü değişiklikler.",
    whatToDo:
      "destek, inanç, yavaş yavaş kabullenme, küçük adımlarla ilerleme.",
  },
  "090": {
    title: "090 - Zeka ve esneklik",
    pointTask: "zeka + esneklik = bilgelik.",
    howShow: "düşüncenin katılığı, kendine güven, krizler.",
    whatToDo: "dinlemeyi öğrenin, şüphe edin, hayata bakış açınızı genişletin.",
  },
};

export const karmic_en = {
  "1": {
    title: "1 – Ego and self-esteem",
    pointTask:
      "learn healthy confidence without pride and without self-deprecation.",
    howShow:
      "either excessive self-confidence, stubbornness and a desire to prove superiority, or fear of showing up and dependence on people’s opinions. Often life “teaches” through criticism, humiliation, and money restrictions.",
    whatToDo:
      "develop will, patience and awareness. Show up calmly and to the point, take responsibility for your actions, stop living out of a desire to “prove.” Defeating the ego = task accomplished.",
  },
  "2": {
    title: "2 - Decisions and self-reliance",
    pointTask: "overcome internal duality and learn to choose.",
    howShow:
      "doubts between “yes/no”, hesitation, fear of making mistakes, dependence on a partner or loved ones. If 2 comes first, loneliness is especially difficult to bear.",
    whatToDo:
      "train independence: make decisions and not shift them to others. Distinguish between indecision and a reasonable change of opinion. Developing knowledge and experience - through this comes confidence. Often implementation comes through mentoring/psychology/training others.",
  },
  "3": {
    title: "3 – Love, service, giving",
    pointTask:
      "live through benefit to the world - help, healing, support, creativity.",
    howShow:
      "life tests generosity and selflessness; the main test is greed and closedness.",
    whatToDo:
      "the principle of “gave and let go”: sharing time, knowledge, care, resource. Develop kindness and altruism. The freer the return (without expectations), the stronger the return flow.",
  },
  "4": {
    title: "4 – Materialization and responsibility",
    pointTask:
      "strong energy for fulfilling desires, but with high responsibility.",
    howShow:
      "thoughts and intentions “gather reality” faster; When acting unenvironmentally, the consequences are felt more strongly. There is often difficulty accepting money, help, gifts and payment - hence the feeling of lack.",
    whatToDo:
      "master the “give/take” balance, learn to accept without guilt. Accept that there is no such thing as absolute stability: life will test you with changes. Self-actualization, discipline and a healthy attitude towards money protect against anxiety and addictions.",
  },
  "5": {
    title: "5 – Freedom and self-realization",
    pointTask:
      "inner freedom, creativity, ideas, the theme of children and manifestations of personality.",
    howShow:
      "restrictions due to circumstances, work, family or fears; creative crises; protest against the framework. Without realization, addictions and self-destructive habits are possible.",
    whatToDo:
      "stop fighting life head-on, learn to live through limitations consciously. Find your own business: if there is no time, there is no freedom; if there is a lot of freedom, but it is empty, you need meaning and implementation. It is important to get out of debt/addictions and direct energy into creation.",
  },
  "6": {
    title: "6 – Money and peace of mind",
    pointTask:
      "harmonious relationships with material things, the ability to accept abundance without anxiety.",
    howShow:
      "fear of loss attracts instability; excessive fixation on money is possible. Often this is a “test of attachment” to material things with good potential for wealth.",
    whatToDo:
      "develop confidence in life and inner peace. See money as a tool, not a source of anxiety. Learn to accept and maintain balance: spending/savings/generosity.",
  },
  "7": {
    title: "7 – Family and relationships",
    pointTask: "deep study of partnership, family and ancestral ties.",
    howShow:
      "extremes (strong desire for family ↔ denial), difficult marriages, “love/hate”, repeating scenarios. There are often a lot of grievances: a person gets stuck in a conflict and loses energy.",
    whatToDo:
      "learn mature relationships: respect for the opposite sex, boundaries, dialogue, seeing your partner as an individual, not as “responsibilities.” A separate task is to let go of grievances and not fuel the conflict with internal struggle.",
  },
  "8": {
    title: "8 – Luck, strength, maturity",
    pointTask: "learn how to properly handle luck and losses.",
    howShow:
      "fateful chances, power/influence, sharp ups and checks. If not worked through, it means being “thrown off the pedestal” through crises, addictions, losses, and career destruction.",
    whatToDo:
      "gratitude instead of pride, calm instead of despair. Be able to keep a balance in success and in failure. Develop maturity and resource management - then resilience and strength come.",
  },
  "9": {
    title: "9 - Intelligence and wisdom",
    pointTask: "connect intellect with intuition and inner knowing.",
    howShow:
      "rationality dominates, arrogance, rigidity, conflicts, and “pride of mind” appear. Life teaches tolerance and flexibility. Against the background of stress, overload and problems “from the head” are possible.",
    whatToDo:
      "develop wisdom: listen not only to logic, but also to intuition. Learn to doubt, expand your picture of the world, and not suppress others with knowledge. Formula 9: “the more I know, the more I understand how much I don’t know.”",
  },
  "0": {
    title: "0 — Reset and updates",
    pointTask: "a school of flexibility and the ability to let go of the past.",
    howShow:
      "life periodically “resets” plans, stability, material support - especially if a person becomes too attached to the result.",
    whatToDo:
      "It’s easier to accept change and not cling to control. See zeroing as cleansing and a new start. The less resistance, the softer the losses.",
  },
  "11": {
    title: "11 - Power and leadership",
    pointTask: "strong energy of a leader and organizer.",
    howShow:
      "независимость, амбиции, «я сам». При непроработке — гордыня, убеждённость в своей абсолютной правоте, болезненная реакция на критику.",
    whatToDo:
      "leadership through responsibility and maturity: hearing people, respecting other people's points of view, managing without pressure.",
  },
  "22": {
    title: "22 – Control and humanity",
    pointTask: "powerful management potential, doubled.",
    howShow:
      "rigidity, pressure, intolerance, the desire to control everything. With a minus - humiliation of subordinates, management out of fear, accumulated anger (often “hits” the body).",
    whatToDo:
      "develop patience, gentleness and respect. Accept people as they are. To manage fairly and balancedly - then people follow a person out of trust, and not out of fear.",
  },
  "33": {
    title: "33 – Relief mission and borders",
    pointTask: 'the path of love, service, support; "healer of souls"',
    howShow:
      "a strong desire to help, inspire, heal, instruct. Risk is carrying everything on yourself, worrying about everyone, forgetting about boundaries. If you abandon the mission, the closure of the flow of return may affect your condition.",
    whatToDo:
      "helping environmentally: service + personal boundaries. Not to “save everyone,” but to do your job honestly, regularly and with self-care.",
  },
  "44": {
    title: "44 – The power of words and influence",
    pointTask: "the ability to greatly influence reality and people.",
    howShow:
      "words and attitudes quickly materialize. If it is negative, complaints and negativity “attract” the corresponding scenarios.",
    whatToDo:
      "control speech and internal attitudes: fewer complaints - more constructive formulations. Use influence ethically and creatively.",
  },
  "55": {
    title: "55 – Word, creativity, children’s theme",
    pointTask: "the powerful power of words and creative influence.",
    howShow:
      "charisma, influence on the atmosphere and people, “the word triggers events.” The main karmic theme is children (variably: many children/complexities/later scenarios - depending on the continuation of the code). On the downside, resentment and anger can “spoil” fate and relationships.",
    whatToDo:
      "monitor words and thoughts, develop creativity, live emotions environmentally. Do not hold grudges, do not accumulate evil. Implementation and creation enhance the luck of the code.",
  },
  "66": {
    title: "66 - Cash flow",
    pointTask:
      "great material opportunities and a lesson in proper handling of money.",
    howShow:
      "extremes: “I’m saving/I’m afraid to lose” or “money is flowing away.” Possible monetary programs of the past: fear of poverty, hunger, loss.",
    whatToDo:
      "money should “breathe”: spend it calmly, renew the flow, and not get stuck in accumulation. Work with fear of losses and learn solutions. Discipline and financial system are the key.",
  },
  "77": {
    title: "77 – Love and choosing a partner",
    pointTask: "mature love and family without idealization.",
    howShow:
      "high demands, search for an “ideal”, dependence on external criteria, disappointments. If not worked through - loneliness, emotional swings, difficulties in the topic of family.",
    whatToDo:
      "choose with your heart and values, not with illusions. Learn to accept people, build mature alliances and work with expectations.",
  },
  "88": {
    title: "88 – Luck and development",
    pointTask:
      "you are God's favorite. Luck is given in advance, but forward movement is required.",
    howShow:
      "doors open easily; The risk is to relax, become passive, “get used to the easy stuff.” If ignored - apathy, addiction, falling from a height.",
    whatToDo:
      "give thanks and take action. Develop, learn, expand horizons, share benefits. Luck rests on activity and generosity.",
  },
  "99": {
    title: "99 - Wisdom instead of superiority",
    pointTask: "strong intellect and influence on people's thinking.",
    howShow:
      "a plus is a teacher/sage, a minus is pride of mind, rejection of other people’s opinions, internal loneliness and conflicts.",
    whatToDo:
      "do not prove that you are the smartest, but transfer knowledge: teach, explain, help people understand. The real power of 99 is in wisdom and usefulness.",
  },
  "00": {
    title: "00 — Intuition and enhanced zeroing",
    pointTask: "powerful intuition + lessons in renewal and protection.",
    howShow:
      "the feeling of “I am different,” frequent restarts, increased sensitivity to environmental energy.",
    whatToDo:
      "conscious practices, discipline, spiritual development and environmental hygiene. Use intuition as a navigator rather than living in anxiety.",
  },
  "10-01": {
    title: "10–01 — Courage and conscious risk",
    pointTask: "overcome fears and learn to act boldly but wisely.",
    howShow:
      "sudden events, a test of courage, a feeling of being “on the edge.”",
    whatToDo:
      "develop conscious risk: see the danger, but do not live in panic; build confidence through experience and training.",
  },
  "20-02": {
    title: "20–02 — Law and responsibility",
    pointTask: "live honestly, respecting rules and agreements.",
    howShow:
      "topics of documents, inspections, official structures; deception and evasion of responsibility quickly return as a boomerang.",
    whatToDo:
      "act transparently, comply with contracts, resolve issues officially. The law here is a guide, not an enemy.",
  },
  "30-03": {
    title: "30–03 — Help and support",
    pointTask: "to be useful to people: to heal, support, serve.",
    howShow:
      "a person subtly senses who needs help and becomes a “support”. If you close yourself, your energy stagnates and can affect your well-being.",
    whatToDo:
      "help as much as possible without rescue. It is enough to do your job honestly and share warmth where appropriate.",
  },
  "40-04": {
    title: "40–04 - Instability and internal support",
    pointTask: "stop clinging to the illusion of complete stability.",
    howShow:
      "failures in plans, changes, “tests of endurance.” Fear of loss attracts scenarios that a person fears.",
    whatToDo:
      "strengthen internal support: flexibility, calmness, plan B, financial cushion. Less dramatization means more adaptation and trust in life.",
  },
  "50-05": {
    title: "50–05 — Freedom, creativity, children",
    pointTask: "freedom through maturity and realization.",
    howShow:
      "creative crises, instability in relationships, dissatisfaction with choices; in women - anxiety and control over the topic of children, which can block motherhood. In tension, dependent care is possible (more often in men).",
    whatToDo:
      "letting go of control, living through creative slumps calmly, not looking for a “way out” in destructive habits. Find your own business and strengthen your internal stability.",
  },
  "60-06": {
    title: "60–06 — Financial maturity and security",
    pointTask: "manage money without panic and without adventures.",
    howShow:
      "money can come and go in waves; losses are possible due to haste, ambition, loans “beyond one’s means,” and the desire to impress. If 060 occurs - increased caution on the road/equipment/travel.",
    whatToDo:
      "financial decisions - only consciously: calculation, plan, obligations “within one’s strength.” A calm response to vibrations returns the flow faster.",
  },
  "70-07": {
    title: "70–07 — Love, family, generic scenarios",
    pointTask: "unravel family knots and build mature relationships.",
    howShow:
      "disappointments in love, risk of early decisions, strong attachment, “dissolution” in the family, unequal feelings.",
    whatToDo:
      "do not rush into official marriage, first build the foundation of the relationship. Learn boundaries, honesty, respect and awareness of birth repetitions.",
  },
  "80-08": {
    title: "80–08 — Fateful trials and transformation",
    pointTask:
      "go through strong life turns and come out more mature and stronger.",
    howShow:
      'losses, traumas, bereavements, sudden changes; "rock" feeling. This is not a punishment, but a deep restructuring and cleansing (often affects generic programs).',
    whatToDo:
      "don’t give in to despair, accept support, hold on to meaning and move forward. Accepting lessons turns challenges into strength and respect.",
  },
  "90-09": {
    title: "90–09 — Thinking and “woe from mind”",
    pointTask: "control the mind, and not live in tension.",
    howShow:
      "anxious expectations, fixation on the negative, touchiness, complaints, suspiciousness. Under severe stress, head/vascular problems may appear as a signal of overload.",
    whatToDo:
      "train focus: notice the good, change mental scenarios, develop calmness and wisdom. The mind needs hygiene: rest, routine, less self-cheating.",
  },
  "010": {
    title: "010 – Fear and control",
    pointTask: "learn to see risks without panic.",
    howShow: "either ignoring the danger or an anxious overreaction.",
    whatToDo: "act consciously: risk assessment → plan → calm decision.",
  },
  "020": {
    title: "020 – Law and Order",
    pointTask: "honesty, rules, responsibility.",
    howShow: "documents, finances, checks, misunderstandings with systems.",
    whatToDo:
      "order in papers and money, transparent agreements, peace of mind.",
  },
  "030": {
    title: "030 – Giving back and maturity",
    pointTask: "harmonious exchange with the world.",
    howShow:
      "if you close yourself, signals appear through stress/fatigue/minor difficulties.",
    whatToDo:
      "share within a comfortable framework: attention, knowledge, participation.",
  },
  "040": {
    title: "040 – Home and material support",
    pointTask: "responsibility for life and property.",
    howShow:
      "breakdowns, losses, mistakes in transactions, trusting the wrong people.",
    whatToDo: "check documents, do not rush, do not give control to strangers.",
  },
  "050": {
    title: "050 – Children, emotions, calm",
    pointTask: "care without anxious control.",
    howShow: "obsession with children's themes, fears, internal tension.",
    whatToDo: "learn trust and wise parenting: support instead of panic.",
  },
  "060": {
    title: "060 – Money and responsibility",
    pointTask: "mature financial decisions.",
    howShow: "losses due to haste, loans, desire to impress.",
    whatToDo:
      "consider risks, take obligations only “within one’s strength”, and plan.",
  },
  "070": {
    title: "070 – Gender and relationships",
    pointTask: "repeating scenarios in love as a birth lesson.",
    howShow: "breakups, loneliness “as a couple,” family knots.",
    whatToDo:
      "understand family scenarios, build honest and mature relationships.",
  },
  "080": {
    title: "080 – Loss and Growing Up",
    pointTask: "accepting change and loss as a path to growth.",
    howShow: "strong changes that change the worldview.",
    whatToDo: "support, faith, gradual acceptance, moving in small steps.",
  },
  "090": {
    title: "090 - Intelligence and flexibility",
    pointTask: "intelligence + flexibility = wisdom.",
    howShow: "rigidity of thinking, self-confidence, crises.",
    whatToDo: "learn to listen, doubt, expand your outlook on life.",
  },
};

export const karmic_kz = {
  "1": {
    title: "1 – Эго және өзін-өзі бағалау",
    pointTask:
      "мақтанышсыз және өзін-өзі қорламай салауатты сенімділікті үйреніңіз.",
    howShow:
      "не өзіне шамадан тыс сенімділік, қыңырлық және артықшылықты дәлелдеуге ұмтылу, не көрінуден қорқу және адамдардың пікіріне тәуелділік. Көбінесе өмір сын, қорлау және ақшаны шектеу арқылы «үйретеді».",
    whatToDo:
      "ерік-жігерін, шыдамдылығын және саналылығын дамыту. Сабырлы және нақты көрсетіңіз, өз әрекеттеріңіз үшін жауапкершілікті алыңыз, «дәлелдеу» ниетімен өмір сүруді доғарыңыз. Эгоды жеңу = тапсырма орындалды.",
  },
  "2": {
    title: "2 - Шешім қабылдау және өз бетінше жұмыс істеу",
    pointTask: "ішкі дуализмді жеңу және таңдауды үйрену.",
    howShow:
      "«иә/жоқ» арасындағы күмән, тартыну, қателесуден қорқу, серіктеске немесе жақын адамдарға тәуелділік. 2 бірінші орында тұрса, жалғыздыққа шыдау әсіресе қиын.",
    whatToDo:
      "тәуелсіздікке тәрбиелеу: шешім қабылдаңыз және оларды басқаларға ауыстырмаңыз. Шешімсіздік пен пікірді орынды өзгертуді ажыратыңыз. Білім мен тәжірибені дамыту – осы арқылы сенім пайда болады. Көбінесе іске асыру тәлімгерлік/психология/басқаларды оқыту арқылы жүзеге асады.",
  },
  "3": {
    title: "3 – Сүйіспеншілік, қызмет көрсету, беру",
    pointTask:
      "әлемге пайда әкелу арқылы өмір сүру - көмек, емдеу, қолдау, шығармашылық.",
    howShow:
      "өмір жомарттық пен жанқиярлықты сынайды; басты сынақ – сараңдық пен тұйықтық.",
    whatToDo:
      "«Берді және жіберді» принципі: уақыт, білім, қамқорлық, ресурспен бөлісу. Мейірімділік пен альтруизмді дамыту. Қайтару неғұрлым еркін болса (күтусіз), қайтару ағыны соғұрлым күшті болады.",
  },
  "4": {
    title: "4 – Материалдандыру және жауапкершілік",
    pointTask:
      "тілектерді орындау үшін күшті энергия, бірақ жоғары жауапкершілік.",
    howShow:
      "ойлар мен ниеттер «шындықты тезірек жинайды»; Қоршаған ортаға әсер етпейтін әрекеттің салдары күштірек сезіледі. Көбінесе ақшаны, көмекті, сыйлықтарды және төлемді қабылдау қиынға соғады - сондықтан жетіспеушілік сезімі.",
    whatToDo:
      "«беру/алу» тепе-теңдігін меңгеріңіз, кінәсіз қабылдауды үйреніңіз. Абсолютті тұрақтылық жоқ екенін қабылдаңыз: өмір сізді өзгерістермен сынайды. Өзін-өзі таныту, тәртіп және ақшаға деген салауатты көзқарас уайым мен тәуелділіктен сақтайды.",
  },
  "5": {
    title: "5 – Бостандық және өзін-өзі жүзеге асыру",
    pointTask:
      "ішкі еркіндік, шығармашылық, идеялар, балалар тақырыбы және тұлғаның көріністері.",
    howShow:
      "жағдайларға, жұмысқа, отбасына немесе қорқынышқа байланысты шектеулер; шығармашылық дағдарыстар; шеңберіне наразылық. Түсінбестен, тәуелділік пен өзін-өзі жою әдеттері болуы мүмкін.",
    whatToDo:
      "өмірмен бетпе-бет күресуді тоқтатыңыз, шектеулермен саналы түрде өмір сүруді үйреніңіз. Өз ісіңді тап: уақыт болмаса, еркіндік жоқ; егер еркіндік көп болса, бірақ ол бос болса, сізге мән мен іске асыру қажет. Қарыздан/тәуелділіктен құтылу және энергияны құруға бағыттау маңызды.",
  },
  "6": {
    title: "6 – Ақша және жан тыныштығы",
    pointTask:
      "материалдық заттармен үйлесімді қарым-қатынас, молшылықты уайымсыз қабылдай білу.",
    howShow:
      "жоғалту қорқынышы тұрақсыздықты тартады; ақшаға шамадан тыс бекіту мүмкін. Көбінесе бұл байлық үшін жақсы әлеуеті бар материалдық заттарға «байланыс сынағы».",
    whatToDo:
      "өмірге деген сенімділік пен ішкі тыныштықты дамыту. Ақшаны қобалжу көзі емес, құрал ретінде қараңыз. Тепе-теңдікті қабылдауды және сақтауды үйреніңіз: жұмсау/үнемдеу/жомарттық.",
  },
  "7": {
    title: "7 – Отбасы және қарым-қатынас",
    pointTask: "серіктестік, отбасылық, ата-баба байланыстарын терең меңгеру.",
    howShow:
      "шектен шығу (отбасына деген күшті тілек ↔ бас тарту), қиын некелер, «махаббат/жек көру», қайталанатын сценарийлер. Көбінесе көп шағымдар бар: адам жанжалда қалып, күш-қуатын жоғалтады.",
    whatToDo:
      "жетілген қарым-қатынастарды үйреніңіз: қарама-қарсы жынысты құрметтеу, шекаралар, диалог, серіктесіңізді «жауапкершілік» ретінде емес, жеке тұлға ретінде көру. Бір бөлек міндет – наразылықтан бас тартып, ішкі күреспен қақтығысты өршітпеу.",
  },
  "8": {
    title: "8 – Сәттілік, күш, жетілу",
    pointTask: "сәттілік пен шығынды қалай дұрыс шешу керектігін үйреніңіз.",
    howShow:
      "тағдырлы мүмкіндіктер, күш/ықпал, өткір және тексерулер. Егер жұмыс жасалмаса, бұл дағдарыстар, тәуелділіктер, жоғалтулар және мансаптың жойылуы арқылы «тұғырдан лақтыруды» білдіреді.",
    whatToDo:
      "мақтаныштың орнына алғыс, үмітсіздіктің орнына тыныштық. Сәттілік пен сәтсіздікте тепе-теңдікті сақтай білу. Жетілуді және ресурстарды басқаруды дамытыңыз - содан кейін тұрақтылық пен күш келеді.",
  },
  "9": {
    title: "9 – Ақыл мен даналық",
    pointTask: "интуициямен және ішкі таныммен интеллектіні байланыстыру.",
    howShow:
      "ұтымдылық үстемдік етеді, менмендік, қаталдық, қақтығыстар, «ақыл-парасат» пайда болады. Өмір төзімділік пен икемділікке үйретеді. Стресс, шамадан тыс жүктеме және «басынан» проблемалар фонында мүмкін.",
    whatToDo:
      "даналықты дамыту: логиканы ғана емес, түйсігін де тыңдау. Күмәндануды үйреніңіз, әлем туралы суретіңізді кеңейтіңіз және басқаларды біліммен қыспаңыз. Формула 9: «Мен неғұрлым көп білсем, соғұрлым білмейтінімді түсінемін».",
  },
  "0": {
    title: "0 — Қалпына келтіру және жаңартулар",
    pointTask: "икемділік мектебі және өткеннен бас тарту мүмкіндігі.",
    howShow:
      "өмір жоспарларды, тұрақтылықты, материалдық қолдауды мезгіл-мезгіл «қалпына келтіреді» - әсіресе адам нәтижеге тым байланып қалса.",
    whatToDo:
      "Өзгерістерді қабылдау оңайырақ және басқаруға жабыспау керек. Нөлді тазарту және жаңа бастама ретінде қарастырыңыз. Қарсылық неғұрлым аз болса, шығындар соғұрлым жұмсақ болады.",
  },
  "11": {
    title: "11 - Билік және көшбасшылық",
    pointTask: "көшбасшы мен ұйымдастырушының күшті энергиясы.",
    howShow:
      "тәуелсіздік, амбиция, «өзім». Егер жұмыс жасалмаса, бұл мақтанышқа, адамның мүлдем дұрыс екеніне сенімділікке және сынға ауыр реакцияға әкеледі.",
    whatToDo:
      "жауапкершілік пен жетілу арқылы көшбасшылық: адамдарды тыңдау, басқа адамдардың көзқарасын құрметтеу, қысымсыз басқару.",
  },
  "22": {
    title: "22 – Бақылау және адамгершілік",
    pointTask: "қуатты басқару әлеуеті екі есеге артты.",
    howShow:
      "қаттылық, қысым, төзімсіздік, бәрін бақылауға ұмтылу. Минуспен - бағыныштыларды қорлау, қорқыныштан басқару, жиналған ашу (денені «жиі ұрады»).",
    whatToDo:
      "шыдамдылыққа, сыпайылыққа, сыйластыққа тәрбиелеу. Адамдарды сол қалпында қабылдаңыз. Әділ және теңгерімді басқару үшін - сонда адамдар қорқыныштан емес, сеніммен адамға ереді.",
  },
  "33": {
    title: "33 – Көмек көрсету миссиясы және шекаралары",
    pointTask: "махаббат жолы, қызмет көрсету, қолдау; «жандардың емшісі»",
    howShow:
      "көмектесуге, шабыттандыруға, сауықтыруға, нұсқауға деген күшті ұмтылыс. Тәуекел – бәрін өз мойныңа алу, барлығын уайымдау, шекараны ұмыту. Егер сіз миссиядан бас тартсаңыз, қайтару ағынының жабылуы сіздің жағдайыңызға әсер етуі мүмкін.",
    whatToDo:
      "қоршаған ортаға көмектесу: қызмет көрсету + жеке шекаралар. «Барлығын құтқару» үшін емес, өз жұмысыңызды адал, жүйелі түрде және өзіңізге қамқорлықпен орындау.",
  },
  "44": {
    title: "44 – Сөз бен әсердің күші",
    pointTask: "шындыққа және адамдарға үлкен әсер ету қабілеті.",
    howShow:
      "сөздер мен көзқарастар тез жүзеге асады. Егер ол теріс болса, шағымдар мен негативтілік сәйкес сценарийлерді «тартады».",
    whatToDo:
      "сөйлеуді және ішкі қатынасты бақылау: аз шағымдар - конструктивті тұжырымдар. Әсер етуді этикалық және шығармашылықпен пайдаланыңыз.",
  },
  "55": {
    title: "55 – Сөз, шығармашылық, балалар тақырыбы",
    pointTask: "сөздің құдіретті күші мен шығармашылық әсері.",
    howShow:
      "харизма, атмосфераға және адамдарға әсер ету, «сөз оқиғаларды тудырады». Негізгі кармалық тақырып - балалар (әр түрлі: көптеген балалар/күрделіліктер/кейінгі сценарийлер - кодтың жалғасуына байланысты). Теріс жағы, реніш пен ашу тағдыр мен қарым-қатынасты «бұзуы» мүмкін.",
    whatToDo:
      "сөздер мен ойларды бақылау, шығармашылықты дамыту, эмоцияларды қоршаған ортада өмір сүру. Кек сақтама, жамандық жинама. Іске асыру және жасау кодтың сәттілігін арттырады.",
  },
  "66": {
    title: "66 - Ақша қаражатының қозғалысы",
    pointTask:
      "үлкен материалдық мүмкіндіктер және ақшаны дұрыс пайдалану сабағы.",
    howShow:
      "шектен шығу: «Мен үнемдеп жатырмын/жоғалтудан қорқамын» немесе «ақша ағып жатыр». Бұрынғы мүмкін ақша бағдарламалары: кедейліктен, аштықтан, жоғалтудан қорқу.",
    whatToDo:
      "ақша «тыныс алуы» керек: оны тыныш жұмсаңыз, ағынды жаңартыңыз және жинақтауға болмайды. Жоғалтудан қорқумен жұмыс жасаңыз және шешімдерді үйреніңіз. Тәртіп пен қаржылық жүйе басты рөл атқарады.",
  },
  "77": {
    title: "77 – Сүйіспеншілік пен серіктес таңдау",
    pointTask: "идеализациясыз жетілген махаббат пен отбасы.",
    howShow:
      "жоғары талаптар, «идеалды іздеу», сыртқы критерийлерге тәуелділік, көңілсіздік. Егер жұмыс жасалмаса - жалғыздық, эмоционалды ауытқулар, отбасы тақырыбындағы қиындықтар.",
    whatToDo:
      "елеспен емес, жүрегіңізбен және құндылықтарыңызбен таңдаңыз. Адамдарды қабылдауды, жетілген альянстарды құруды және үмітпен жұмыс істеуді үйреніңіз.",
  },
  "88": {
    title: "88 – Сәттілік пен даму",
    pointTask:
      "сен Құдайдың сүйіктісісің. Сәттілік алдын ала беріледі, бірақ алға жылжу қажет.",
    howShow:
      "есіктер оңай ашылады; Тәуекел - демалу, пассивті болу, «оңай нәрсеге үйрену». Елеусіз болса - апатия, тәуелділік, биіктіктен құлау.",
    whatToDo:
      "алғыс айтып, әрекет ету. Дамытыңыз, үйреніңіз, көкжиегіңізді кеңейтіңіз, артықшылықтармен бөлісіңіз. Сәттілік белсенділік пен жомарттыққа негізделген.",
  },
  "99": {
    title: "99 - артықшылықтың орнына даналық",
    pointTask: "күшті интеллект пен адамдардың ойлауына әсер ету.",
    howShow:
      "плюс - мұғалім/данышпан, минус - ақыл-ойдың мақтанышы, басқа адамдардың пікірін қабылдамау, ішкі жалғыздық және қақтығыстар.",
    whatToDo:
      "өзіңіздің ең ақылды екеніңізді дәлелдемеңіз, бірақ білімді тасымалдаңыз: үйретіңіз, түсіндіріңіз, адамдарға түсінуге көмектесіңіз. 99-ның нағыз күші даналық пен пайдалылықта.",
  },
  "00": {
    title: "00 — Интуиция және күшейтілген нөлдеу",
    pointTask: "күшті интуиция + жаңарту және қорғау сабақтары.",
    howShow:
      "«Мен басқамын» сезімі, жиі қайта қосу, қоршаған ортаның энергиясына сезімталдықтың жоғарылауы.",
    whatToDo:
      "саналы тәжірибе, тәртіп, рухани даму және қоршаған ортаның гигиенасы. Мазасыздықта өмір сүрудің орнына интуицияны навигатор ретінде пайдаланыңыз.",
  },
  "10-01": {
    title: "10–01 — Батылдық пен саналы тәуекел",
    pointTask: "қорқыныштарды жеңіп, батыл, бірақ дана әрекет етуді үйреніңіз.",
    howShow:
      "кенеттен болатын оқиғалар, батылдық сынағы, «шетінде» болу сезімі.",
    whatToDo:
      "саналы тәуекелді дамыту: қауіпті қараңыз, бірақ дүрбелеңмен өмір сүрмеңіз; тәжірибе мен оқыту арқылы сенімділікті арттыру.",
  },
  "20-02": {
    title: "20–02 — Заң және жауапкершілік",
    pointTask: "ережелер мен келісімдерді сақтай отырып, адал өмір сүру.",
    howShow:
      "құжаттардың, тексерулердің, ресми құрылымдардың тақырыптары; алдау және жауапкершіліктен жалтару бумеранг ретінде тез оралады.",
    whatToDo:
      "ашық әрекет ету, келісім-шарттарды орындау, мәселелерді ресми түрде шешу. Мұндағы заң жау емес, жол көрсетуші.",
  },
  "30-03": {
    title: "30–03 — Көмек және қолдау",
    pointTask: "адамдарға пайдалы болу: емдеу, қолдау, қызмет ету.",
    howShow:
      "адам кімнің көмекке мұқтаж екенін нәзік сезеді және «тірек» болады. Егер сіз өзіңізді жапсаңыз, сіздің энергияңыз тоқырауға ұшырайды және сіздің әл-ауқатыңызға әсер етуі мүмкін.",
    whatToDo:
      "құтқарусыз мүмкіндігінше көмектесіңіз. Жұмысыңызды адал атқарып, орынды жерде жылылықпен бөліссеңіз жеткілікті.",
  },
  "40-04": {
    title: "40–04 - Тұрақсыздық және ішкі қолдау",
    pointTask: "толық тұрақтылық иллюзиясына жабысуды тоқтатыңыз.",
    howShow:
      "жоспарлардағы сәтсіздіктер, өзгерістер, «шыдамдылық сынақтары». Жоғалту қорқынышы адам қорқатын сценарийлерді тартады.",
    whatToDo:
      "ішкі қолдауды күшейту: икемділік, тыныштық, В жоспары, қаржылық жастық. Аз драматизация өмірге көбірек бейімделу мен сенім білдіреді.",
  },
  "50-05": {
    title: "50–05 — Бостандық, шығармашылық, балалар",
    pointTask: "жетілу және жүзеге асыру арқылы еркіндік.",
    howShow:
      "шығармашылық дағдарыстар, қарым-қатынастардағы тұрақсыздық, таңдауға қанағаттанбау; әйелдерде - ана болуды бұғаттай алатын балалар тақырыбына алаңдаушылық және бақылау. Шиеленіс кезінде тәуелді күтім мүмкін (көбінесе ерлерде).",
    whatToDo:
      "бақылауды босатып, шығармашылық құлдырауды сабырмен бастан кешіру, деструктивті әдеттерден «шығу жолын» іздемеу. Өз бизнесіңізді тауып, ішкі тұрақтылықты нығайтыңыз.",
  },
  "60-06": {
    title: "60–06 — Қаржылық өтеу және қауіпсіздік",
    pointTask: "ақшаны дүрбелеңсіз және приключениясыз басқарыңыз.",
    howShow:
      "ақша толқынмен келіп, кетуі мүмкін; Шығындар асығыстық, амбиция, «өз мүмкіндігінен тыс» несиелер және әсер қалдыруға ұмтылу салдарынан мүмкін болады. 060 пайда болса - жолда/жабдықта/саяхатта сақтықты арттырыңыз.",
    whatToDo:
      "қаржылық шешімдер - тек саналы түрде: есептеу, жоспар, міндеттемелер «өз күшімен». Дірілге сабырлы жауап ағынды тезірек қайтарады.",
  },
  "70-07": {
    title: "70–07 - Махаббат, отбасы, жалпы сценарийлер",
    pointTask: "отбасылық түйіндерді шешіп, жетілген қарым-қатынастарды құру.",
    howShow:
      "махаббаттағы көңілсіздік, ерте шешім қабылдау қаупі, күшті қосылу, отбасындағы «тарау», тең емес сезімдер.",
    whatToDo:
      "ресми некеге асықпаңыз, алдымен қарым-қатынастың негізін салыңыз. Шекараларды, адалдықты, сыйластықты және туудың қайталануын білуді үйреніңіз.",
  },
  "80-08": {
    title: "80-08 - Тағдырлы сынақтар және трансформация",
    pointTask:
      "өмірдің күшті бұрылыстарынан өтіп, жетілген және күштірек шығады.",
    howShow:
      "жоғалтулар, жарақаттар, қайтыс болулар, кенеттен өзгерістер; «рок» сезімі. Бұл жаза емес, терең қайта құрылымдау және тазарту (көбінесе жалпы бағдарламаларға әсер етеді).",
    whatToDo:
      "үмітсіздікке берілмеңіз, қолдауды қабылдаңыз, мағынаны ұстаныңыз және алға жылжыңыз. Сабақтарды қабылдау қиындықтарды күш пен құрметке айналдырады.",
  },
  "90-09": {
    title: "90–09 - Ойлау және «ақылдың қасіреті»",
    pointTask: "ақыл-ойды басқарыңыз және шиеленіспен өмір сүрмеңіз.",
    howShow:
      "мазасыз күтулер, негативтіге бекіну, жанасу, шағымдар, күдік. Қатты стресс жағдайында бас/тамыр проблемалары шамадан тыс жүктеме сигналы ретінде пайда болуы мүмкін.",
    whatToDo:
      "зейінді жаттықтырыңыз: жақсылықты байқаңыз, психикалық сценарийлерді өзгертіңіз, тыныштық пен даналықты дамытыңыз. Ақыл гигиенаны қажет етеді: демалыс, күнделікті, өзін-өзі алдау.",
  },
  "010": {
    title: "010 - Қорқыныш және бақылау",
    pointTask: "қауіптерді дүрбелеңсіз көруді үйреніңіз.",
    howShow: "қауіпті елемеу немесе мазасызданған шамадан тыс реакция.",
    whatToDo: "саналы әрекет ету: тәуекелді бағалау → жоспар → сабырлы шешім.",
  },
  "020": {
    title: "020 – Құқықтық тәртіп",
    pointTask: "адалдық, ережелер, жауапкершілік.",
    howShow: "құжаттар, қаржылар, тексерулер, жүйелермен түсінбеушілік.",
    whatToDo: "қағаз бен ақшадағы тәртіп, мөлдір келісім, жан тыныштығы.",
  },
  "030": {
    title: "030 – Қайтару және жетілу",
    pointTask: "әлеммен үйлесімді алмасу.",
    howShow:
      "егер сіз өзіңізді жапсаңыз, сигналдар стресс/шаршау/болмашы қиындықтар арқылы пайда болады.",
    whatToDo: "ыңғайлы шеңберде бөлісу: зейін, білім, қатысу.",
  },
  "040": {
    title: "040 – Тұрмыстық және материалдық қамтамасыз ету",
    pointTask: "өмірі мен мүлкі үшін жауапкершілік.",
    howShow:
      "бұзылулар, шығындар, транзакциялардағы қателер, дұрыс емес адамдарға сену.",
    whatToDo:
      "құжаттарды тексеру, асықпау, бейтаныс адамдарға бақылауды бермеу.",
  },
  "050": {
    title: "050 – Балалар, эмоциялар, тыныштық",
    pointTask: "алаңдаушылықсыз бақылаусыз қамқорлық.",
    howShow: "балалардың тақырыптарына әуестену, қорқыныш, ішкі шиеленіс.",
    whatToDo:
      "сенім мен дана ата-ананы үйреніңіз: дүрбелеңнің орнына қолдау көрсету.",
  },
  "060": {
    title: "060 – Ақша және жауапкершілік",
    pointTask: "жетілген қаржылық шешімдер.",
    howShow: "асығыс, несиелер, әсер қалдыру ниетінен болған шығындар.",
    whatToDo:
      "тәуекелдерді қарастырыңыз, міндеттемелерді тек «өз күшіңізбен» алыңыз және жоспарлаңыз.",
  },
  "070": {
    title: "070 – Жыныс және қарым-қатынас",
    pointTask: "туу сабағы ретінде махаббаттағы сценарийлерді қайталау.",
    howShow: "ажырасу, «ерлі-зайыптылар» жалғыздық, отбасылық түйіндер.",
    whatToDo:
      "отбасылық сценарийлерді түсіну, адал және жетілген қарым-қатынастарды құру.",
  },
  "080": {
    title: "080 - Жоғалту және өсу",
    pointTask: "өзгерістер мен жоғалтуларды өсу жолы ретінде қабылдау.",
    howShow: "дүниетанымын өзгертетін күшті өзгерістер.",
    whatToDo: "қолдау, сенім, бірте-бірте қабылдау, шағын қадамдармен қозғалу.",
  },
  "090": {
    title: "090 - Интеллект және икемділік",
    pointTask: "интеллект + икемділік = даналық.",
    howShow: "ойлаудың қатаңдығы, өзіне деген сенімділік, дағдарыстар.",
    whatToDo:
      "тыңдауды, күмәндануды үйреніңіз, өмірге көзқарасыңызды кеңейтіңіз.",
  },
};
