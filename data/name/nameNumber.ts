// nameNumber.ts
// TypeScript module: вычисление "числа имени" по таблицам (en, kz, tr, ru).
// Источники (алфавиты и значения чисел) — пользовательские файлы: "Алфавиты в цифрах.docx" и "Число Имени.docx". :contentReference[oaicite:2]{index=2} :contentReference[oaicite:3]{index=3}

import {
  NUMBER_MEANINGS_EN,
  NUMBER_MEANINGS_KZ,
  NUMBER_MEANINGS_RU,
  NUMBER_MEANINGS_TR,
} from "./dbNUMBER_MEANINGS";

export type Lang = "en" | "kz" | "tr" | "ru";

export interface LetterValue {
  letter: string;
  value: number;
}

export interface NameNumberResult {
  inputName: string;
  lang: Lang;
  normalizedName: string;
  letters: LetterValue[]; // по каждой букве значение (пропущенные символы не включаются)
  rawSum: number; // простая сумма значений букв
  reduced: number; // сведённое число (однозначное) или 11/22 если получилось
  isMasterNumber: boolean; // true если 11 или 22
  steps: number[]; // последовательность сумм при сведении (например [17, 8])
  meaning?: string; // краткий смысл числа на языке выбранного алфавита.
}

/** --- Алфавиты в порядке, соответствующем файлу "Алфавиты в цифрах.docx" --- **
 * Для каждой последовательности значение буквы = (index % 9) + 1
 * (индекс начинается с 0 для первой буквы, что даёт 1..9 повторно).
 *
 * Примечание: мы перечисляем буквы в том порядке, в котором они были в документе пользователя.
 * Там же перечислены специальные буквы для kazakh и turkish.
 */

const RU_ALPHABET = [
  "А",
  "Б",
  "В",
  "Г",
  "Д",
  "Е",
  "Ё",
  "Ж",
  "З",
  "И",
  "Й",
  "К",
  "Л",
  "М",
  "Н",
  "О",
  "П",
  "Р",
  "С",
  "Т",
  "У",
  "Ф",
  "Х",
  "Ц",
  "Ч",
  "Ш",
  "Щ",
  "Ъ",
  "Ы",
  "Ь",
  "Э",
  "Ю",
  "Я",
];

const EN_ALPHABET = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

const KZ_ALPHABET = [
  "А",
  "Ә",
  "Б",
  "В",
  "Г",
  "Ғ",
  "Д",
  "Е",
  "Ё",
  "Ж",
  "З",
  "И",
  "Й",
  "К",
  "Қ",
  "Л",
  "М",
  "Н",
  "Ң",
  "О",
  "Ө",
  "П",
  "Р",
  "С",
  "Т",
  "У",
  "Ұ",
  "Ү",
  "Ф",
  "Х",
  "Һ",
  "Ц",
  "Ч",
  "Ш",
  "Щ",
  "Ъ",
  "Ы",
  "І",
  "Ь",
  "Э",
  "Ю",
  "Я",
];

const TR_ALPHABET = [
  "A",
  "B",
  "C",
  "Ç",
  "D",
  "E",
  "F",
  "G",
  "Ğ",
  "H",
  "I",
  "İ",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "Ö",
  "P",
  "R",
  "S",
  "T",
  "U",
  "Ü",
  "V",
  "Y",
  "Z",
];

const LETTER_VALUE_OVERRIDES: Partial<Record<Lang, Record<string, number>>> = {
  tr: {
    Ş: 4,
  },
};

/** --- Вспомогательные функции --- */

const KZ_SPECIFIC_RE = /[ӘәҒғҚқҢңӨөҰұҮүҺһІі]/;
const TR_SPECIFIC_RE = /[ÇçĞğİıÖöŞşÜü]/;
const CYRILLIC_RE = /[А-Яа-яЁёӘәҒғҚқҢңӨөҰұҮүҺһІі]/g;
const LATIN_RE = /[A-Za-zÇçĞğİıÖöŞşÜü]/g;

function countMatches(value: string, pattern: RegExp): number {
  return value.match(pattern)?.length ?? 0;
}

export function detectNameLanguage(name: string): Lang {
  const normalized = normalizeNameForProcessing(name);

  if (KZ_SPECIFIC_RE.test(normalized)) return "kz";
  if (TR_SPECIFIC_RE.test(normalized)) return "tr";

  const cyrillicCount = countMatches(normalized, CYRILLIC_RE);
  const latinCount = countMatches(normalized, LATIN_RE);

  if (cyrillicCount > 0 && cyrillicCount >= latinCount) return "ru";
  if (latinCount > 0) return "en";

  return "ru";
}

/** Нормализация имени: приводим к верхнему регистру, убираем пробелы в начале/конце,
 * оставляем буквы и знаки, которые есть в алфавите (внутри функции сопоставления). */
function normalizeNameForProcessing(name: string): string {
  return name.trim();
}

function normalizeLetterForLang(letter: string, lang: Lang): string {
  if (lang === "tr") return letter.toLocaleUpperCase("tr-TR");
  return letter.toUpperCase();
}

/** Получаем алфавит по коду языка */
function getAlphabet(lang: Lang): string[] {
  switch (lang) {
    case "ru":
      return RU_ALPHABET;
    case "en":
      return EN_ALPHABET;
    case "kz":
      return KZ_ALPHABET;
    case "tr":
      return TR_ALPHABET;
    default:
      return RU_ALPHABET;
  }
}

/** Создаём быстрый map: буква -> значение (1..9) */
function buildLetterValueMap(alphabet: string[], lang: Lang): Map<string, number> {
  const map = new Map<string, number>();
  for (let i = 0; i < alphabet.length; i++) {
    const letter = alphabet[i];
    const value = (i % 9) + 1; // 1..9 циклически
    map.set(normalizeLetterForLang(letter, lang), value);
    // Для латинских букв можем также добавить lower-case для безопасности (но мы будем приводить к upper).
    map.set(letter.toLowerCase(), value);
  }

  const overrides = LETTER_VALUE_OVERRIDES[lang];
  if (overrides) {
    Object.entries(overrides).forEach(([letter, value]) => {
      map.set(normalizeLetterForLang(letter, lang), value);
      map.set(letter.toLowerCase(), value);
    });
  }

  return map;
}

/** Суммирование цифр числа (например 17 -> 1+7 = 8). */
function sumDigits(n: number): number {
  return n
    .toString()
    .split("")
    .reduce((s, ch) => s + Number(ch), 0);
}

/** Сведение числа до однозначного, за исключением 11 и 22 (мастер-числа).
 * Возвращаем последовательность шагов и финальное число.
 */
function reduceToNameNumber(n: number): {
  reduced: number;
  steps: number[];
  isMaster: boolean;
} {
  const steps: number[] = [n];
  // если уже 11 или 22 — считаем мастер-числом и не сводим
  if (n === 11 || n === 22) {
    return { reduced: n, steps, isMaster: true };
  }
  let current = n;
  while (current > 9 && current !== 11 && current !== 22) {
    current = sumDigits(current);
    steps.push(current);
  }
  return {
    reduced: current,
    steps,
    isMaster: current === 11 || current === 22,
  };
}

/** Основная экспортируемая функция */
export function calculateNameNumber(
  name: string,
  lang: Lang = "ru"
): NameNumberResult {
  const normalized = normalizeNameForProcessing(name);
  const alphabet = getAlphabet(lang);
  const letterMap = buildLetterValueMap(alphabet, lang);

  const letters: LetterValue[] = [];

  // Проходим по символам имени; учитываем пробелы, дефисы и т.п.:
  // - если символ найден в map, считаем его;
  // - если не найден (например цифры, знаки препинания, буквы другой азбуки) — пропускаем.
  for (const ch of normalized) {
    // приведём к верхнему регистру для поиска ключа (учтены и верх/низ при построении map)
    const key = normalizeLetterForLang(ch, lang);
    if (letterMap.has(key)) {
      letters.push({ letter: ch, value: letterMap.get(key)! });
    } else {
      // игнорируем символы, которые не принадлежат выбранному алфавиту
      continue;
    }
  }

  const rawSum = letters.reduce((s, lv) => s + lv.value, 0);
  const reduction = reduceToNameNumber(rawSum);

  let NUMBER_MEANINGS = NUMBER_MEANINGS_RU;
  switch (lang) {
    case "ru":
      NUMBER_MEANINGS = NUMBER_MEANINGS_RU;
      break;
    case "en":
      NUMBER_MEANINGS = NUMBER_MEANINGS_EN;
      break;
    case "kz":
      NUMBER_MEANINGS = NUMBER_MEANINGS_KZ;
      break;
    case "tr":
      NUMBER_MEANINGS = NUMBER_MEANINGS_TR;
      break;
    default:
      break;
  }

  const meaning = NUMBER_MEANINGS[reduction.reduced] ?? undefined;

  return {
    inputName: name,
    lang,
    normalizedName: normalized,
    letters,
    rawSum,
    reduced: reduction.reduced,
    isMasterNumber: reduction.isMaster,
    steps: reduction.steps,
    meaning,
  };
}

/** --- Пример использования (можно удалить/закомментировать в продакшене) --- */
/*
if (require.main === module) {
  const examples = [
    { name: 'Айгуль', lang: 'ru' as Lang },
    { name: 'Aygul', lang: 'tr' as Lang },
    { name: 'Turan', lang: 'en' as Lang },
    { name: 'Айгүл', lang: 'kz' as Lang } // кириллическая казахская версия
  ];
  for (const ex of examples) {
    console.log('---------------------------');
    console.log(calculateNameNumber(ex.name, ex.lang));
  }
}
*/
