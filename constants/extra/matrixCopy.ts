import { LocaleKey } from "@/utils/_func";

export type ItemKey =
  | "lifePathCode"
  | "karmicCode"
  | "destinyProblems"
  | "dharma";

export const MatrixCopy: Record<
  LocaleKey,
  {
    activeBlock: string;
    defaultSubtitle: string;
    unlock: string;
    premium: string;
    but: string;
    check: string;
    items: Record<
      ItemKey,
      {
        label: string;
        title: string;
        subtitle: string;
      }
    >;
  }
> = {
  ru: {
    activeBlock: "Выберите блок",
    defaultSubtitle:
      "Выберите один из четырёх блоков ниже, чтобы открыть подробное окно поверх модального экрана.",
    unlock: "Разблокировать",
    premium: "Премиум",
    but: "Нажмите, чтобы открыть",
    check: "Проверить доступ",
    items: {
      lifePathCode: {
        label: "Код жизненного пути",
        title: "Код жизненного пути",
        subtitle:
          "Ключ к пониманию вашего основного жизненного сценария: через какие качества, задачи и направления вам легче всего реализоваться и чувствовать смысл своего пути.",
      },
      karmicCode: {
        label: "Кармический код",
        title: "Кармический код",
        subtitle:
          "Показатель прошлых жизненных и родовых задач, отражающий уроки, которые душа пришла осознать и отработать в текущем воплощении.",
      },
      destinyProblems: {
        label: "Проблема на пути к предназначению",
        title: "Проблема на пути к предназначению",
        subtitle:
          "Это внутренние и внешние препятствия, которые мешают вам реализовать свой потенциал и указывают, какие качества важно проработать для движения вперёд.",
      },
      dharma: {
        label: "Предназначение",
        title: "Предназначение",
        subtitle:
          "Это ваша главная жизненная задача показывающая, в чём вы можете реализовать себя наиболее полно и гармонично.",
      },
    },
  },

  en: {
    activeBlock: "Choose a section",
    defaultSubtitle:
      "Choose one of the four sections below to open a detailed popup above the modal screen.",
    unlock: "Unlock",
    premium: "Premium",
    but: "Tap to open",
    check: "Check access",
    items: {
      lifePathCode: {
        label: "Life path code",
        title: "Life path code",
        subtitle:
          "The key to understanding your main life scenario: which qualities, tasks, and directions help you realize yourself and feel the meaning of your path.",
      },
      karmicCode: {
        label: "Karmic code",
        title: "Karmic code",
        subtitle:
          "An indicator of past-life and ancestral tasks, reflecting the lessons your soul came to understand and work through in this incarnation.",
      },
      destinyProblems: {
        label: "Problem on the way to destiny",
        title: "Problem on the way to destiny",
        subtitle:
          "These are internal and external obstacles that prevent you from realizing your potential and indicate which qualities are important to develop in order to move forward.",
      },
      dharma: {
        label: "Destiny",
        title: "Destiny",
        subtitle:
          "This is your main life task, showing where you can realize yourself most fully and harmoniously.",
      },
    },
  },

  tr: {
    activeBlock: "Bir bölüm seçin",
    defaultSubtitle:
      "Detaylı pencereyi açmak için aşağıdaki dört bölümden birini seçin.",
    unlock: "Kilidi aç",
    premium: "Premium",
    but: "Açmak için dokunun",
    check: "Erişimi kontrol et",
    items: {
      lifePathCode: {
        label: "Yaşam yolu kodu",
        title: "Yaşam yolu kodu",
        subtitle:
          "Ana yaşam senaryonuzu anlamanın anahtarıdır: hangi nitelikler, görevler ve yönler sayesinde kendinizi daha kolay gerçekleştirebilirsiniz.",
      },
      karmicCode: {
        label: "Karmik kod",
        title: "Karmik kod",
        subtitle:
          "Ruhun bu yaşamda anlaması ve çözmesi gereken dersleri yansıtan geçmiş yaşam ve soy görevlerinin göstergesidir.",
      },
      destinyProblems: {
        label: "Kader yolunda karşılaşılan sorun",
        title: "Kader yolunda karşılaşılan sorun",
        subtitle:
          "Bu, potansiyelinizi gerçekleştirmenizi engelleyen ve ilerlemek için hangi niteliklerin geliştirilmesinin önemli olduğunu gösteren iç ve dış engellerdir.",
      },
      dharma: {
        label: "Amaç",
        title: "Amaç",
        subtitle:
          "Bu, kendinizi en dolu ve uyumlu şekilde nerede gerçekleştirebileceğinizi gösteren ana yaşam görevinizdir.",
      },
    },
  },

  ar: {
    activeBlock: "اختر قسماً",
    defaultSubtitle:
      "اختر أحد الأقسام الأربعة أدناه لفتح نافذة تفصيلية فوق الشاشة.",
    unlock: "فتح",
    premium: "مميز",
    but: "اضغط لفتح",
    check: "تحقق من الوصول",
    items: {
      lifePathCode: {
        label: "رمز مسار الحياة",
        title: "رمز مسار الحياة",
        subtitle:
          "مفتاح لفهم السيناريو الأساسي في حياتك: من خلال أي صفات ومهام واتجاهات يمكنك تحقيق ذاتك والشعور بمعنى طريقك.",
      },
      karmicCode: {
        label: "الرمز الكارمي",
        title: "الرمز الكارمي",
        subtitle:
          "مؤشر على مهام الحياة السابقة والمهام العائلية، ويعكس الدروس التي جاءت الروح لتفهمها وتعمل عليها في هذا التجسد.",
      },
      destinyProblems: {
        label: "الغاية والعوائق",
        title: "الغاية ومشكلات الغاية",
        subtitle:
          "المهمة الأساسية في حياتك، وتوضح أين يمكنك تحقيق نفسك بشكل أكثر اكتمالاً وانسجاماً، وما العقبات التي تحتاج إلى العمل عليها.",
      },
      dharma: {
        label: "رقم الدارما",
        title: "رقم الدارما",
        subtitle:
          "يعكس رسالتك الروحية وهدف حياتك، ويساعدك على فهم الصفات والمهام المهمة للنمو والانسجام.",
      },
    },
  },

  kz: {
    activeBlock: "Бөлімді таңдаңыз",
    unlock: "Ашу",
    premium: "Премиум",
    but: "Ашу үшін түртіңіз",
    check: "Қол жетімділікті тексеру",
    defaultSubtitle:
      "Төмендегі төрт блоктың бірін таңдап, модаль экран үстінен толық терезені ашыңыз.",
    items: {
      lifePathCode: {
        label: "Өмір жолы коды",
        title: "Өмір жолы коды",
        subtitle:
          "Өмірлік негізгі сценарийіңізді түсінудің кілті: қандай қасиеттер, міндеттер және бағыттар арқылы өзіңізді толық аша аласыз.",
      },
      karmicCode: {
        label: "Кармикалық код",
        title: "Кармикалық код",
        subtitle:
          "Өткен өмір мен әулеттік міндеттердің көрсеткіші, жанның осы өмірде түсініп, пысықтауы тиіс сабақтарын бейнелейді.",
      },
      destinyProblems: {
        label: "Тағдыр жолындағы мәселе",
        title: "Тағдыр жолындағы мәселе",
        subtitle:
          "Бұл сіздің негізгі өмірлік міндетіңіз, өзіңізді неғұрлым толық және үйлесімді жүзеге асыра алатындығыңызды көрсетеді.",
      },
      dharma: {
        label: "Мақсат",
        title: "Мақсат",
        subtitle:
          "Бұл сіздің негізгі өмірлік міндетіңіз, өзіңізді неғұрлым толық және үйлесімді жүзеге асыра алатындығыңызды көрсетеді.",
      },
    },
  },
};
