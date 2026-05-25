import data_en from "./data_en.json";
import data_kz from "./data_kz.json";
import data_ru from "./data_ru.json";
import data_tr from "./data_tr.json";

const dict: Record<string, any> = {
  en: data_en,
  ru: data_ru,
  kz: data_kz,
  tr: data_tr,
};

export function lifePathMeanings({
  lang,
  final,
}: {
  lang: string;
  final: number;
}) {
  const data = dict[lang]; // выбираем JSON по языку
  if (!data) return {}; // если языка нет — пусто

  const result = data[String(final)]; // выбираем путь по числу
  return result || {}; // если ключа нет — пусто
}
