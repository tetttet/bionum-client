import { Lang } from "../name/nameNumber";
import { EnPrediction } from "./lang/en";
import { KzPrediction } from "./lang/kz";
import { RuPrediction } from "./lang/ru";
import { TrPrediction } from "./lang/tr";

const predictionByLang = {
  ru: RuPrediction,
  en: EnPrediction,
  tr: TrPrediction,
  kz: KzPrediction,
} as const;

/**
 * Преобразует строковый код (в т.ч. форматы "10-01", "0")
 * в числовой ключ для поиска в объекте Prediction.
 */
export function getPredictionText(number: string, lang: Lang): string {
  let predict: number;

  if (number === "0") {
    predict = 0;
  } else if (number.includes("-")) {
    predict = parseInt(number.replace("-", ""), 10);
  } else {
    predict = parseInt(number, 10);
  }

  const predictionSet = predictionByLang[lang];

  if (isNaN(predict) || !predictionSet[predict as keyof typeof predictionSet]) {
    return "Информация недоступна.";
  }

  return predictionSet[predict as keyof typeof predictionSet].markdown;
}
