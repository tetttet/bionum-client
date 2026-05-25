import { Lang } from "../name/nameNumber";
import { coupleEn } from "./couple/en";
import { coupleKz } from "./couple/kz";
import { coupleRu } from "./couple/ru";
import { coupleTr } from "./couple/tr";

type Meaning = {
  title: string;
  desc: string;
};

export function coupleMeaning(n: number, lang: Lang): Meaning {
  const dictionaries: Record<Lang, Record<number, Meaning>> = {
    ru: coupleRu,
    en: coupleEn,
    tr: coupleTr,
    kz: coupleKz,
  };

  return (
    dictionaries[lang]?.[n] ?? {
      title:
        lang === "en"
          ? "Compatibility"
          : lang === "tr"
            ? "Uyum"
            : lang === "kz"
              ? "Үйлесімділік"
              : "Совместимость",
      desc: ``,
    }
  );
}
