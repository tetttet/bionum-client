import * as Localization from "expo-localization";

import { PortraitLang, PortraitKeys } from "@/data/dummy/portrait";

export const DEFAULT_LANG: PortraitLang = "ru";

/* ------------------------- DETECT LANGUAGE ------------------------- */
export function detectLang(): PortraitLang {
  const rawLocale =
    (Localization as any)?.locale ??
    (typeof navigator !== "undefined" ? navigator.language : DEFAULT_LANG);
  const locale = String(rawLocale).split("-")[0].toLowerCase();

  if (locale === "ru") return "ru";
  if (locale === "en") return "en";
  if (locale === "kz" || locale === "kk") return "kz";
  if (locale === "tr") return "tr";

  return DEFAULT_LANG;
}

/* ------------------------- DICTIONARY ------------------------- */
/**
 * ВАЖНО:
 * PortraitKeys — это внутренние ключи данных ("data" | "abilities" | "weaknesses"),
 * по ним мы берём текст из PortraitItem.
 *
 * В этом словаре:
 * - sections: отображение internal-ключа → локализованный заголовок.
 *
 * Тогда:
 *  - content берём: portrait[key as PortraitKeys]
 *  - title берём:   PsychoDict[lang].sections[key]
 */
export const PsychoDict: Record<
  PortraitLang,
  {
    youNumber: string;
    name: string;
    dob: string;

    sections: Record<PortraitKeys, string>;

    modalTitle: string;
    modalSubtitle: string;
  }
> = {
  ru: {
    youNumber: "Ваше число рождения",
    name: "Имя",
    dob: "Дата рождения",

    sections: {
      data: "Исходные данные",
      abilities: "Возможности",
      weaknesses: "Минусы",
    },

    modalTitle: "Портрет личности",
    modalSubtitle: "Персональное описание вашей личности",
  },

  en: {
    youNumber: "Your Birth Number",
    name: "Name",
    dob: "Date of Birth",

    sections: {
      data: "Basic Traits",
      abilities: "Abilities",
      weaknesses: "Weaknesses",
    },

    modalTitle: "Personality Portrait",
    modalSubtitle: "Personal description of your personality",
  },

  kz: {
    youNumber: "Туған күн саныңыз",
    name: "Атыңыз",
    dob: "Туған күні",

    sections: {
      data: "Бастапқы мәліметтер",
      abilities: "Мүмкіндіктер",
      weaknesses: "Әлсіз тұстар",
    },

    modalTitle: "Тұлға портреті",
    modalSubtitle: "Сіздің тұлғалық сипаттамаңыз",
  },

  tr: {
    youNumber: "Doğum Sayınız",
    name: "İsim",
    dob: "Doğum Tarihi",

    sections: {
      data: "Temel Bilgiler",
      abilities: "Yetenekler",
      weaknesses: "Zayıf Yönler",
    },

    modalTitle: "Kişilik Portresi",
    modalSubtitle: "Kişiliğinizin açıklaması",
  },
};
