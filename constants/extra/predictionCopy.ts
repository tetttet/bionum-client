import { LocaleKey } from "@/utils/_func";

export type TabKey = "lifeCode" | "futureNumber" | "compatibilityForecast";

export const PredictionCopy: Record<
  LocaleKey,
  {
    heroTitle: string;
    heroSubtitle: string;
    activeBlock: string;
    infoSubtitle: string;
    unlock: string;
    premium: string;
    but: string;
    check: string;
    tabs: Record<
      TabKey,
      {
        label: string;
        title: string;
        subtitle: string;
      }
    >;
  }
> = {
  ru: {
    heroTitle: "Прогноз",
    heroSubtitle: "Ваш персональный прогноз на основе данных",
    activeBlock: "Выберите блок",
    check: "Проверить доступ",
    unlock: "Разблокировать",
    premium: "Премиум",
    but: "Нажмите, чтобы открыть",
    infoSubtitle:
      "Выберите один из трёх блоков ниже, чтобы открыть подробное окно поверх модального экрана.",
    tabs: {
      lifeCode: {
        label: "Жизненный код",
        title: "Жизненный код",
        subtitle:
          "Это персональный прогноз на год, показывающий ключевые темы, задачи и энергии вашего возраста в текущем жизненном периоде.",
      },
      futureNumber: {
        label: "Число будущего",
        title: "Число будущего",
        subtitle:
          "Отражает, кем человек становится после внутренней трансформации и накопленного опыта.",
      },
      compatibilityForecast: {
        label: "Совместимость пары",
        title: "Прогноз совместимости по числу будущего пары",
        subtitle:
          "Показывает, к какому результату могут прийти отношения со временем.",
      },
    },
  },

  en: {
    heroTitle: "Prediction",
    heroSubtitle: "Your personal forecast based on your data",
    activeBlock: "Choose a section",
    check: "Check access",
    unlock: "Unlock",
    premium: "Premium",
    but: "Tap to open",
    infoSubtitle:
      "Choose one of the three sections below to open a detailed window over the modal screen.",
    tabs: {
      lifeCode: {
        label: "Life code",
        title: "Life code",
        subtitle:
          "This is a personal annual forecast showing the key themes, tasks, and energies of your age in the current life period.",
      },
      futureNumber: {
        label: "Future number",
        title: "Future number",
        subtitle:
          "Reflects who a person becomes after inner transformation and accumulated experience.",
      },
      compatibilityForecast: {
        label: "Couple compatibility",
        title: "Compatibility forecast by the couple’s future number",
        subtitle: "Shows what result a relationship may come to over time.",
      },
    },
  },

  tr: {
    heroTitle: "Tahmin",
    heroSubtitle: "Verilerinize dayalı kişisel tahmininiz",
    activeBlock: "Bir bölüm seçin",
    check: "Erişimi kontrol et",
    unlock: "Kilidi aç",
    premium: "Premium",
    but: "Açmak için dokunun",
    infoSubtitle:
      "Detaylı pencereyi açmak için aşağıdaki üç bölümden birini seçin.",
    tabs: {
      lifeCode: {
        label: "Yaşam kodu",
        title: "Yaşam kodu",
        subtitle:
          "Bu, mevcut yaşam döneminizde yaşınızın temel temalarını, görevlerini ve enerjilerini gösteren kişisel yıllık tahmininizdir.",
      },
      futureNumber: {
        label: "Gelecek sayısı",
        title: "Gelecek sayısı",
        subtitle:
          "Kişinin içsel dönüşüm ve biriken deneyimden sonra kim olduğunu yansıtır.",
      },
      compatibilityForecast: {
        label: "Çift uyumu",
        title: "Çiftin gelecek sayısına göre uyum tahmini",
        subtitle: "İlişkinin zamanla hangi sonuca varabileceğini gösterir.",
      },
    },
  },

  ar: {
    heroTitle: "التوقع",
    heroSubtitle: "توقعك الشخصي بناءً على بياناتك",
    activeBlock: "اختر قسماً",
    check: "تحقق من الوصول",
    unlock: "فتح",
    premium: "مميز",
    but: "اضغط لفتح",
    infoSubtitle:
      "اختر أحد الأقسام الثلاثة أدناه لفتح نافذة تفصيلية فوق الشاشة.",
    tabs: {
      lifeCode: {
        label: "رمز الحياة",
        title: "رمز الحياة",
        subtitle:
          "توقع شخصي سنوي يوضح الموضوعات والمهام والطاقات الأساسية لعمرك الحالي.",
      },
      futureNumber: {
        label: "رقم المستقبل",
        title: "رقم المستقبل",
        subtitle:
          "يعكس من يصبح عليه الإنسان بعد التحول الداخلي وتراكم الخبرة. يبدأ بعد سن 56.",
      },
      compatibilityForecast: {
        label: "توافق الزوجين",
        title: "توقع التوافق حسب رقم مستقبل الزوجين",
        subtitle: "يوضح إلى أي نتيجة قد تصل العلاقة مع مرور الوقت بعد سن 56.",
      },
    },
  },

  kz: {
    heroTitle: "Болжам",
    heroSubtitle: "Сіздің деректеріңізге негізделген жеке болжам",
    activeBlock: "Бөлімді таңдаңыз",
    check: "Қол жетімділікті тексеру",
    unlock: "Ашу",
    premium: "Премиум",
    but: "Ашу үшін түртіңіз",
    infoSubtitle:
      "Модальды экранның үстінде егжей-тегжейлі терезені ашу үшін төмендегі үш бөлімнің бірін таңдаңыз.",
    tabs: {
      lifeCode: {
        label: "Өмір коды",
        title: "Өмір коды",
        subtitle:
          "Бұл ағымдағы өмір кезеңіндегі жасыңыздың негізгі тақырыптарын, тапсырмаларын және энергияларын көрсететін жеке жылдық болжам.",
      },
      futureNumber: {
        label: "Болашақ саны",
        title: "Болашақ саны",
        subtitle:
          "Ішкі трансформация мен жинақталған тәжірибеден кейін адамның кімге айналатынын көрсетеді.",
      },
      compatibilityForecast: {
        label: "Жұп үйлесімділігі",
        title: "Жұптың болашақ саны бойынша үйлесімділік болжамы",
        subtitle:
          "Қарым-қатынастың уақыт өте келе қандай нәтижеге келуі мүмкін екенін көрсетеді.",
      },
    },
  },
};
