import { Lang } from "./nameNumber";
import {
  dharmaOne_Ru,
  dharmaOne_En,
  dharmaOne_Tr,
  dharmaOne_Kz,
} from "./dharma/one";
import {
  dharmaFour_Ru,
  dharmaFour_En,
  dharmaFour_Tr,
  dharmaFour_Kz,
} from "./dharma/four";
import {
  dharmaTwo_Ru,
  dharmaTwo_En,
  dharmaTwo_Tr,
  dharmaTwo_Kz,
} from "./dharma/two";
import {
  dharmaThree_Ru,
  dharmaThree_En,
  dharmaThree_Tr,
  dharmaThree_Kz,
} from "./dharma/three";
import {
  dharmaFive_Ru,
  dharmaFive_En,
  dharmaFive_Tr,
  dharmaFive_Kz,
} from "./dharma/five";
import {
  dharmaSix_Ru,
  dharmaSix_En,
  dharmaSix_Tr,
  dharmaSix_Kz,
} from "./dharma/six";
import {
  dharmaSeven_Ru,
  dharmaSeven_En,
  dharmaSeven_Tr,
  dharmaSeven_Kz,
} from "./dharma/seven";
import {
  dharmaEight_Ru,
  dharmaEight_En,
  dharmaEight_Tr,
  dharmaEight_Kz,
} from "./dharma/eight";
import {
  dharmaNine_Ru,
  dharmaNine_En,
  dharmaNine_Tr,
  dharmaNine_Kz,
} from "./dharma/nine";

export const TEXTS: Record<
  number,
  Record<Lang, { title: string; body: string }>
> = {
  1: {
    ru: {
      title: "Дхарма 1 — Энергия Солнца, ответственность",
      body: dharmaOne_Ru,
    },
    en: {
      title: "Dharma 1 — Solar energy, responsibility",
      body: dharmaOne_En,
    },
    tr: {
      title: "Dharma 1 — Güneş enerjisi, sorumluluk",
      body: dharmaOne_Tr,
    },
    kz: {
      title: "Дхарма 1 — Күннің энергиясы, жауапкершілік",
      body: dharmaOne_Kz,
    },
  },
  2: {
    ru: {
      title: "Дхарма 2 — Лунная энергия, гармоничные отношения",
      body: dharmaTwo_Ru,
    },
    en: {
      title: "Dharma 2 — Lunar energy, relationships",
      body: dharmaTwo_En,
    },
    tr: {
      title: "Dharma 2 — Ay enerjisi, ilişkiler",
      body: dharmaTwo_Tr,
    },
    kz: {
      title: "Дхарма 2 — Ай энергиясы, қатынастар",
      body: dharmaTwo_Kz,
    },
  },
  3: {
    ru: {
      title: "Дхарма 3 — Творчество, наставничество, взросление",
      body: dharmaThree_Ru,
    },
    en: {
      title: "Dharma 3 — Creativity, mentorship, maturity",
      body: dharmaThree_En,
    },
    tr: {
      title: "Dharma 3 — Yaratıcılık, rehberlik, olgunlaşma",
      body: dharmaThree_Tr,
    },
    kz: {
      title: "Дхарма 3 — Шығармашылық, тәлімгерлік, жетілу",
      body: dharmaThree_Kz,
    },
  },
  4: {
    ru: {
      title:
        "Число Дхармы 4 связано с энергией Раху и требует одного главного: отказаться от иллюзий и смотреть на жизнь предельно трезво. Людям с этой вибрацией важно учиться самопознанию, чтобы видеть истинные причины своих проблем, а не бесконечно менять внешние обстоятельства.",
      body: dharmaFour_Ru,
    },
    en: {
      title:
        "Dharma number 4 is associated with the energy of Rahu and requires one key goal: to abandon illusions and view life with utmost sobriety. People with this vibration need to learn self-knowledge to see the true causes of their problems, rather than endlessly changing external circumstances.",
      body: dharmaFour_En,
    },
    tr: {
      title:
        "Dharma sayısı 4, Rahu'nun enerjisiyle ilişkilidir ve tek bir temel hedef gerektirir: yanılsamaları terk etmek ve hayata son derece gerçekçi bir bakış açısıyla yaklaşmak. Bu titreşime sahip kişilerin, dış koşulları sürekli değiştirmek yerine, sorunlarının gerçek nedenlerini görebilmek için öz-bilgi edinmeleri gerekir.",
      body: dharmaFour_Tr,
    },
    kz: {
      title:
        "№4 дхарма Раху энергиясымен байланысты және бір негізгі мақсатты талап етеді: иллюзиялардан бас тарту және өмірге барынша байсалдылықпен қарау. Бұл дірілге ие адамдар шексіз өзгеретін сыртқы жағдайларды емес, олардың проблемаларының шынайы себептерін көру үшін өзін-өзі тануды үйренуі керек.",
      body: dharmaFour_Kz,
    },
  },
  5: {
    ru: {
      title: "Дхарма 5 — Свобода, движение, гибкость",
      body: dharmaSix_Ru,
    },
    en: {
      title: "Dharma 5 — Freedom, movement, adaptability",
      body: dharmaSix_En,
    },
    tr: {
      title: "Dharma 5 — Özgürlük, hareket, uyum",
      body: dharmaSix_Tr,
    },
    kz: {
      title: "Дхарма 5 — Бостандық, қозғалу, икемділік",
      body: dharmaSix_Kz,
    },
  },
  6: {
    ru: {
      title: "Дхарма 6 — Баланс, забота, творческая энергия",
      body: dharmaFive_Ru,
    },
    en: {
      title: "Dharma 6 — Balance, nurturing, creative energy",
      body: dharmaFive_En,
    },
    tr: {
      title: "Dharma 6 — Denge, şefkat, yaratıcı enerji",
      body: dharmaFive_Tr,
    },
    kz: {
      title: "Дхарма 6 — Теңгерім, қамқорлық, шығармашылық энергия",
      body: dharmaFive_Kz,
    },
  },
  7: {
    ru: {
      title: "Дхарма 7 — Духовность, уединение, внутренняя трансформация",
      body: dharmaSeven_Ru,
    },
    en: {
      title: "Dharma 7 — Spirituality, solitude, inner transformation",
      body: dharmaSeven_En,
    },
    tr: {
      title: "Dharma 7 — Maneviyat, yalnızlık, iç dönüşüm",
      body: dharmaSeven_Tr,
    },
    kz: {
      title: "Дхарма 7 — Руханият, жалғыздық, ішкі трансформация",
      body: dharmaSeven_Kz,
    },
  },
  8: {
    ru: {
      title: "Дхарма 8 — Дисциплина, труд, карма-йога",
      body: dharmaEight_Ru,
    },
    en: {
      title: "Dharma 8 — Discipline, work, karma-yoga",
      body: dharmaEight_En,
    },
    tr: {
      title: "Dharma 8 — Disiplin, çalışma, karma-yoga",
      body: dharmaEight_Tr,
    },
    kz: {
      title: "Дхарма 8 — Тәртіп, еңбек, карма-йога",
      body: dharmaEight_Kz,
    },
  },
  9: {
    ru: {
      title: "Дхарма 9 — Динамика, щедрость, движение вперёд",
      body: dharmaNine_Ru,
    },
    en: {
      title: "Dharma 9 — Action, generosity, forward movement",
      body: dharmaNine_En,
    },
    tr: {
      title: "Dharma 9 — Hareket, cömertlik, ileriye doğru adım",
      body: dharmaNine_Tr,
    },
    kz: {
      title: "Дхарма 9 — Қозғалыс, жомарттық, алға басу",
      body: dharmaNine_Kz,
    },
  },
};
