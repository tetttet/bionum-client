import { Article } from "@/constants/data";
import { PortraitLang } from "@/data/dummy/portrait";

export function getTitle(lang: PortraitLang) {
  return TITLES[lang] ?? TITLES.ru;
}

export function getPsychoArticle(lang: PortraitLang): Article {
  return articles[lang] ?? articles.ru;
}

const TITLES: Record<PortraitLang, string> = {
  en: "USEFUL ARTICLES",
  kz: "ПАЙДАЛЫ МАҚАЛАЛАР",
  tr: "FAYDALI MAKALELER",
  ru: "ПОЛЕЗНЫЕ СТАТЬИ",
};

const shared = {
  id: "1",
  image: require("../../assets/images/bg/clever.png"),
};

const articles: Record<PortraitLang, Article> = {
  ru: {
    ...shared,
    title: "Код личности (по числу рождения)",
    subtitle:
      "Описание вашего характера и внутреннего потенциала, основанное на дате рождения, показывающее, как вы проявляетесь в жизни и взаимодействуете с миром.",
    markdown: `
# Код личности
Здесь появится персональное описание вашей личности, основанное на дне вашего рождения.
`,
  },
  kz: {
    ...shared,
    title: "Тұлға портреті (туған күн бойынша)",
    subtitle:
      "Туған күніңізге негізделген жеке тұлғаңыздың сипаттамасы, ол сіздің өмірде қалай көрінетініңізді және әлеммен қалай әрекеттесетініңізді көрсетеді.",
    markdown: `
# Тұлға портреті
Мұнда сіздің туған күніңізге негізделген жеке тұлғаңыздың сипаттамасы пайда болады.
`,
  },
  tr: {
    ...shared,
    title: "Kişilik Portresi (Doğum Tarihine Göre)",
    subtitle:
      "Doğum tarihinize dayalı kişisel kişilik tanımınız, hayatınızda nasıl göründüğünüzü ve dünyayla nasıl etkileşimde bulunduğunuzu gösterir.",
    markdown: `
# Kişilik Portresi
Burada, doğum gününüze dayalı kişisel kişilik tanımınız görünecektir.
`,
  },
  en: {
    ...shared,
    title: "Personality Portrait (by Birth Date)",
    subtitle:
      "A personal description of your personality based on your birth date, showing how you manifest in life and interact with the world.",
    markdown: `
# Personality Portrait
Here will appear a personal description of your personality based on your birth date.
`,
  },
};

function formatDOB(date?: string) {
  if (!date) return "";
  const [year, month, day] = date.split("-");
  return `${day}.${month}.${year}`;
}
