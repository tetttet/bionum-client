import { LocaleKey } from "@/utils/_func";

export type ItemKey =
  | "compatibilityDestiny"
  | "compatibilityName"
  | "karmicConnection";

export const CompaCopy: Record<
  LocaleKey,
  {
    activeBlock: string;
    defaultSubtitle: string;
    partnerYou: string;
    partnerOther: string;
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
      "Выберите один из трёх блоков ниже, чтобы открыть подробное окно поверх модального экрана.",
    partnerYou: "Вы",
    partnerOther: "Партнёр",
    check: "Проверить доступ",
    unlock: "Разблокировать",
    premium: "Премиум",
    but: "Нажмите, чтобы открыть",
    items: {
      compatibilityDestiny: {
        label: "Совместимость по числу судьбы",
        title: "Совместимость по числу судьбы",
        subtitle:
          "Этот расчёт показывает уровень гармонии и потенциал отношений пары.",
      },
      compatibilityName: {
        label: "Совместимость по числу имени",
        title: "Совместимость по числу имени",
        subtitle:
          "Нумерологический расчёт, показывающий, как энергия имён партнёров влияет на отношения и уровень гармонии в паре.",
      },
      karmicConnection: {
        label: "Кармическая связь",
        title: "Кармическая связь",
        subtitle:
          "Анализ показывает, связаны ли партнёры прошлым опытом, какие кармические задачи и долги между ними существуют и на какой период дана эта связь в текущей жизни.",
      },
    },
  },

  en: {
    activeBlock: "Choose a section",
    defaultSubtitle:
      "Choose one of the three sections below to open a detailed popup above the modal screen.",
    partnerYou: "You",
    partnerOther: "Partner",
    unlock: "Unlock",
    premium: "Premium",
    but: "Tap to open",
    check: "Check access",
    items: {
      compatibilityDestiny: {
        label: "Compatibility by destiny number",
        title: "Compatibility by destiny number",
        subtitle:
          "This calculation shows the level of harmony and the relationship potential of the couple.",
      },
      compatibilityName: {
        label: "Compatibility by name number",
        title: "Compatibility by name number",
        subtitle:
          "A numerological calculation showing how the energy of the partners’ names affects their relationship and harmony level.",
      },
      karmicConnection: {
        label: "Karmic connection",
        title: "Karmic connection",
        subtitle:
          "This analysis shows whether the partners are connected by past experience, what karmic tasks and debts exist between them, and for what period this connection is given in the current life.",
      },
    },
  },

  tr: {
    activeBlock: "Bir bölüm seçin",
    defaultSubtitle:
      "Detaylı pencereyi açmak için aşağıdaki üç bölümden birini seçin.",
    partnerYou: "Siz",
    partnerOther: "Partner",
    unlock: "Kilidi aç",
    premium: "Premium",
    but: "Açmak için dokunun",
    check: "Erişimi kontrol et",
    items: {
      compatibilityDestiny: {
        label: "Kader sayısına göre uyum",
        title: "Kader sayısına göre uyum",
        subtitle:
          "Bu hesaplama çiftin uyum seviyesini ve ilişkinin potansiyelini gösterir.",
      },
      compatibilityName: {
        label: "İsim sayısına göre uyum",
        title: "İsim sayısına göre uyum",
        subtitle:
          "Partnerlerin isim enerjisinin ilişkiye ve uyum düzeyine nasıl etki ettiğini gösteren numerolojik hesaplama.",
      },
      karmicConnection: {
        label: "Karmik bağ",
        title: "Karmik bağ",
        subtitle:
          "Bu analiz, partnerlerin geçmiş deneyimlerle bağlı olup olmadığını, aralarında hangi karmik görevler ve borçlar bulunduğunu ve bu bağın bu yaşamda ne kadar süre için verildiğini gösterir.",
      },
    },
  },

  ar: {
    activeBlock: "اختر قسماً",
    defaultSubtitle:
      "اختر أحد الأقسام الثلاثة أدناه لفتح نافذة تفصيلية فوق الشاشة.",
    partnerYou: "أنت",
    partnerOther: "الشريك",
    unlock: "فتح",
    premium: "مميز",
    but: "اضغط لفتح",
    check: "تحقق من الوصول",
    items: {
      compatibilityDestiny: {
        label: "التوافق حسب رقم القدر",
        title: "التوافق حسب رقم القدر",
        subtitle:
          "يوضح هذا الحساب مستوى الانسجام وإمكانات العلاقة بين الشريكين.",
      },
      compatibilityName: {
        label: "التوافق حسب رقم الاسم",
        title: "التوافق حسب رقم الاسم",
        subtitle:
          "حساب عددي يوضح كيف تؤثر طاقة اسمي الشريكين على العلاقة ومستوى الانسجام بينهما.",
      },
      karmicConnection: {
        label: "الرابطة الكارمية",
        title: "الرابطة الكارمية",
        subtitle:
          "يوضح هذا التحليل ما إذا كان الشريكان مرتبطين بخبرة سابقة، وما المهام والديون الكارمية الموجودة بينهما، ولأي فترة مُنحت هذه العلاقة في الحياة الحالية.",
      },
    },
  },

  kz: {
    activeBlock: "Бөлімді таңдаңыз",
    defaultSubtitle:
      "Төмендегі үш блоктың бірін таңдап, модаль экран үстінен толық терезені ашыңыз.",
    partnerYou: "Сіз",
    partnerOther: "Серіктес",
    unlock: "Ашу",
    premium: "Премиум",
    but: "Ашу үшін түртіңіз",
    check: "Қол жетімділікті тексеру",
    items: {
      compatibilityDestiny: {
        label: "Тағдыр саны бойынша үйлесімділік",
        title: "Тағдыр саны бойынша үйлесімділік",
        subtitle:
          "Бұл есеп жұптың үйлесімділік деңгейі мен қарым-қатынас әлеуетін көрсетеді.",
      },
      compatibilityName: {
        label: "Есім саны бойынша үйлесімділік",
        title: "Есім саны бойынша үйлесімділік",
        subtitle:
          "Серіктестердің есім энергиясы олардың қарым-қатынасына және жұптағы үйлесім деңгейіне қалай әсер ететінін көрсететін нумерологиялық есеп.",
      },
      karmicConnection: {
        label: "Кармикалық байланыс",
        title: "Кармикалық байланыс",
        subtitle:
          "Бұл талдау серіктестердің өткен тәжірибемен байланысқанын, олардың арасында қандай кармикалық міндеттер мен қарыздар бар екенін және бұл байланыстың қазіргі өмірде қанша уақытқа берілгенін көрсетеді.",
      },
    },
  },
};
