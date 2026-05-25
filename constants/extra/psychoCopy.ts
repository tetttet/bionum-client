import { LocaleKey } from "@/utils/_func";

export const BLUE = "#2982da";
export type TabKey =
  | "birthNumber"
  | "nameNumber"
  | "psychomatrix"
  | "psychomatrixFriend"
  | "destinyNumber";

export const PsychoCopy: Record<
  LocaleKey,
  {
    activeBlock: string;
    open: string;
    close: string;
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
    activeBlock: "Выберите блок",
    open: "Открыть",
    close: "Закрыть",
    check: "Проверить доступ",
    unlock: "Разблокировать",
    premium: "Премиум",
    but: "Нажмите, чтобы открыть",
    tabs: {
      birthNumber: {
        label: "Число рождения",
        title: "Число рождения",
        subtitle:
          "Врождённые качества, сильные стороны и базовый характер, с которыми вы пришли в эту жизнь.",
      },
      nameNumber: {
        label: "Число имени",
        title: "Число имени",
        subtitle:
          "Энергия вашего имени и как она влияет на ваш характер, поведение и проявляется в жизни.",
      },
      psychomatrix: {
        label: "Психоматрица",
        title: "Психоматрица",
        subtitle: "Познай себя, свои слабые и сильные стороны",
      },
      psychomatrixFriend: {
        label: "Психоматрица друга",
        title: "Психоматрица друга",
        subtitle: "Глубже понять другого человека через его матрицу.",
      },
      destinyNumber: {
        label: "Число судьбы",
        title: "Число судьбы",
        subtitle:
          "Показывает ваш жизненный путь, врождённые качества и основные сценарии судьбы, включая таланты, сильные стороны, вызовы и задачи на протяжении жизни.",
      },
    },
  },

  en: {
    activeBlock: "Choose a section",
    open: "Open",
    close: "Close",
    check: "Check access",
    unlock: "Unlock",
    premium: "Premium",
    but: "Tap to open",
    tabs: {
      birthNumber: {
        label: "Birth number",
        title: "Birth number",
        subtitle:
          "The innate qualities, strengths and basic character that you came into this life with.",
      },
      nameNumber: {
        label: "Name number",
        title: "Name number",
        subtitle:
          "The energy of your name and how it influences your character, behavior and manifests in life.",
      },
      psychomatrix: {
        label: "Psychomatrix",
        title: "Psychomatrix",
        subtitle: "Know yourself, your strengths and weaknesses.",
      },
      psychomatrixFriend: {
        label: "Friend psychomatrix",
        title: "Friend psychomatrix",
        subtitle: "Understand another person more deeply through their matrix.",
      },
      destinyNumber: {
        label: "Destiny number",
        title: "Destiny number",
        subtitle:
          "Shows your life path, innate qualities and main destiny scenarios, including talents, strengths, challenges and tasks throughout life.",
      },
    },
  },

  tr: {
    activeBlock: "Bir bölüm seçin",
    open: "Aç",
    close: "Kapat",
    unlock: "Kilidi aç",
    check: "Erişimi kontrol et",
    premium: "Premium",
    but: "Açmak için dokunun",
    tabs: {
      birthNumber: {
        label: "Doğum sayısı",
        title: "Doğum sayısı",
        subtitle:
          "Bu hayata geldiğinizde sahip olduğunuz doğuştan gelen nitelikler, güçlü yönler ve temel karakter.",
      },
      nameNumber: {
        label: "İsim sayısı",
        title: "İsim sayısı",
        subtitle:
          "Adınızın enerjisi ve karakterinizi, davranışınızı nasıl etkilediği ve hayatta nasıl tezahür ettiği.",
      },
      psychomatrix: {
        label: "Psikomatrisiniz",
        title: "Psikomatrisiniz",
        subtitle: "Kendinizi, güçlü ve zayıf yönlerinizi tanıyın.",
      },
      psychomatrixFriend: {
        label: "Arkadaş psikomatrisı",
        title: "Arkadaş psikomatrisı",
        subtitle: "Bir başka kişiyi onun matrisi üzerinden daha derin anlamak.",
      },
      destinyNumber: {
        label: "Kader sayısı",
        title: "Kader sayısı",
        subtitle:
          "Yaşam yolunuzu, doğuştan gelen özelliklerinizi ve başlıca kader senaryolarınızı, yeteneklerinizi, güçlü yönlerinizi, zorluklarınızı ve hayatınız boyunca üstlenmeniz gereken görevleri gösterir.",
      },
    },
  },

  ar: {
    activeBlock: "اختر قسماً",
    open: "فتح",
    close: "إغلاق",
    unlock: "فتح",
    premium: "مميز",
    but: "اضغط لفتح",
    check: "تحقق من الوصول",
    tabs: {
      birthNumber: {
        label: "رقم الميلاد",
        title: "رقم الميلاد",
        subtitle: "الصفات الفطرية ونقاط القوة والطاقة الداخلية الأساسية.",
      },
      nameNumber: {
        label: "رقم الاسم",
        title: "رقم الاسم",
        subtitle: "كيف تظهر طاقة الاسم في السلوك والشخصية والتواصل.",
      },
      psychomatrix: {
        label: "المصفوفة النفسية الخاصة بك",
        title: "المصفوفة النفسية الخاصة بك",
        subtitle: "صورة أكبر للشخصية والطباع والإمكانات.",
      },
      psychomatrixFriend: {
        label: "المصفوفة النفسية للصديق",
        title: "المصفوفة النفسية للصديق",
        subtitle: "فهم شخص آخر بعمق أكبر من خلال مصفوفتِه.",
      },
      destinyNumber: {
        label: "رقم القدر",
        title: "رقم القدر",
        subtitle:
          "الطريق الذي اخترته لنفسك في هذه الحياة والدروس التي جئت لتتعلمها.",
      },
    },
  },

  kz: {
    activeBlock: "Бөлімді таңдаңыз",
    open: "Ашу",
    close: "Жабу",
    check: "Қол жетімділікті тексеру",
    unlock: "Ашу",
    premium: "Премиум",
    but: "Ашу үшін түртіңіз",
    tabs: {
      birthNumber: {
        label: "Туған күн саны",
        title: "Туған күн саны",
        subtitle:
          "Бұл өмірге келгенде сізде болатын туғаннан келе жатқан қасиеттер, күшті жақтар және temel характер.",
      },
      nameNumber: {
        label: "Есім саны",
        title: "Есім саны",
        subtitle:
          "Атыңыздың энергиясы және ол сіздің мінезіңізге, мінез-құлқыңызға қалай әсер етеді және өмірде қалай көрініс табады.",
      },
      psychomatrix: {
        label: "Психоматрицаңыз",
        title: "Психоматрицаңыз",
        subtitle: "Өзіңізді, күшті және әлсіз жақтарыңызды біліңіз.",
      },
      psychomatrixFriend: {
        label: "Дос психоматрицасы",
        title: "Дос психоматрицасы",
        subtitle: "Басқа адамды оның матрицасы арқылы тереңірек түсіну.",
      },
      destinyNumber: {
        label: "Тағдыр саны",
        title: "Тағдыр саны",
        subtitle:
          "Өмір жолыңызды, туғаннан келе жатқан қасиеттеріңізді және негізгі тағдыр сценарийлеріңізді, соның ішінде таланттар, күшті жақтар, қиындықтар және өмір бойы атқаруыңыз керек міндеттерді көрсетеді.",
      },
    },
  },
};
