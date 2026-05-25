// portrait.ts
import data_en from "./data_en.json";
import data_kz from "./data_kz.json";
import data_ru from "./data_ru.json";
import data_tr from "./data_tr.json";

/* ------------------ КЛЮЧИ ПОРТРЕТА ------------------ */
/**
 * Внутренние ключи секций портрета.
 * Эти строки используются для доступа к полям PortraitItem
 * и совпадают с ключами в JSON.
 */
export type PortraitKeys = "data" | "abilities" | "weaknesses";

/* ------------------ ТИП ПОРТРЕТА ------------------ */

export interface PortraitItem {
  number: number;
  data: string;
  abilities: string;
  weaknesses: string;
}

/* ------------------ ФАЙЛЫ С ДАННЫМИ ------------------ */

export const portraits_en: PortraitItem[] = data_en as PortraitItem[];
export const portraits_kz: PortraitItem[] = data_kz as PortraitItem[];
export const portraits_ru: PortraitItem[] = data_ru as PortraitItem[];
export const portraits_tr: PortraitItem[] = data_tr as PortraitItem[];

/* ------------------ ГЛАВНЫЙ ОБЪЕКТ ------------------ */

export const portraits = {
  en: portraits_en,
  kz: portraits_kz,
  ru: portraits_ru,
  tr: portraits_tr,
};

export type PortraitLang = keyof typeof portraits;

/* ------------------ ФУНКЦИИ ------------------ */

// получить все элементы портрета
export function getPortraits(lang: PortraitLang): PortraitItem[] {
  return portraits[lang];
}

// получить конкретный портрет по числу
export function getPortraitByNumber(
  lang: PortraitLang,
  number: number
): PortraitItem | undefined {
  return portraits[lang].find((item) => item.number === number);
}
