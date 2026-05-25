import enJson from "@/data/psychomatrix_interpretation/en.json";
import kzJson from "@/data/psychomatrix_interpretation/kz.json";
import ruJson from "@/data/psychomatrix_interpretation/ru.json";
import trJson from "@/data/psychomatrix_interpretation/tr.json";
import { Digit } from "@/data/psycho/psychomatrixCore";

export type PsychomatrixLineLanguage = "ru" | "en" | "tr" | "kz";
export type PsychomatrixLineType = "row" | "column" | "diagonal";
export type PsychomatrixCellValue = number | string | null | undefined;
export type PsychomatrixLineMatrix = Partial<
  Record<Digit, PsychomatrixCellValue>
> &
  Partial<Record<`${Digit}`, PsychomatrixCellValue>>;

export interface PsychomatrixLineResult {
  key: string;
  type: PsychomatrixLineType;
  name: string;
  numbers: string;
  count: number;
  interpretation: string;
}

export interface PsychomatrixDiagonalComparisonResult {
  key: "diagonal_comparison";
  type: "diagonal";
  descendingCount: number;
  ascendingCount: number;
  condition?: string;
  interpretation: string;
}

type InterpretationMap = Record<string, string | undefined>;

interface LineDefinition {
  name?: string;
  numbers?: string;
  interpretations?: InterpretationMap;
  description?: string;
}

interface DiagonalComparisonRule {
  condition?: string;
  result?: string;
}

interface InterpretationContent {
  rows?: Record<string, LineDefinition | undefined>;
  columns?: Record<string, LineDefinition | undefined>;
  diagonals?: Record<string, LineDefinition | unknown>;
  [key: string]: unknown;
}

interface InterpretationJson {
  psychomatrix_interpretation?: InterpretationContent;
  [key: string]: unknown;
}

interface LineSpec {
  key: string;
  type: PsychomatrixLineType;
  digits: Digit[];
  numbers: string;
  aliases: string[];
  section: "rows" | "columns" | "diagonals";
}

const interpretationDataByLanguage: Record<
  PsychomatrixLineLanguage,
  InterpretationJson
> = {
  ru: ruJson as InterpretationJson,
  en: enJson as InterpretationJson,
  tr: trJson as InterpretationJson,
  kz: kzJson as InterpretationJson,
};

const lineSpecs: LineSpec[] = [
  {
    key: "row_1",
    type: "row",
    digits: [1, 4, 7],
    numbers: "1-4-7",
    aliases: ["row_1"],
    section: "rows",
  },
  {
    key: "row_2",
    type: "row",
    digits: [2, 5, 8],
    numbers: "2-5-8",
    aliases: ["row_2"],
    section: "rows",
  },
  {
    key: "row_3",
    type: "row",
    digits: [3, 6, 9],
    numbers: "3-6-9",
    aliases: ["row_3"],
    section: "rows",
  },
  {
    key: "col_1",
    type: "column",
    digits: [1, 2, 3],
    numbers: "1-2-3",
    aliases: ["col_1", "column_1"],
    section: "columns",
  },
  {
    key: "col_2",
    type: "column",
    digits: [4, 5, 6],
    numbers: "4-5-6",
    aliases: ["col_2", "column_2"],
    section: "columns",
  },
  {
    key: "col_3",
    type: "column",
    digits: [7, 8, 9],
    numbers: "7-8-9",
    aliases: ["col_3", "column_3"],
    section: "columns",
  },
  {
    key: "diagonal_1",
    type: "diagonal",
    digits: [1, 5, 9],
    numbers: "1-5-9",
    aliases: ["diagonal_1", "descending_1_5_9"],
    section: "diagonals",
  },
  {
    key: "diagonal_2",
    type: "diagonal",
    digits: [3, 5, 7],
    numbers: "3-5-7",
    aliases: ["diagonal_2", "ascending_3_5_7"],
    section: "diagonals",
  },
];

const isLineLanguage = (language?: string): language is PsychomatrixLineLanguage =>
  language === "ru" || language === "en" || language === "tr" || language === "kz";

const normalizeLineLanguage = (language?: string): PsychomatrixLineLanguage => {
  return isLineLanguage(language) ? language : "en";
};

const getInterpretationContent = (
  language: PsychomatrixLineLanguage,
): InterpretationContent => {
  const data = interpretationDataByLanguage[language];
  return data.psychomatrix_interpretation ?? data;
};

const isLineDefinition = (value: unknown): value is LineDefinition => {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
};

const findLineDefinition = (
  language: PsychomatrixLineLanguage,
  spec: LineSpec,
): LineDefinition | undefined => {
  const content = getInterpretationContent(language);
  const section = content[spec.section];

  for (const alias of spec.aliases) {
    if (section && !Array.isArray(section)) {
      const sectionValue = section[alias];

      if (isLineDefinition(sectionValue)) {
        return sectionValue;
      }
    }

    const rootValue = content[alias];

    if (isLineDefinition(rootValue)) {
      return rootValue;
    }
  }

  return undefined;
};

const getInterpretationKey = (count: number) => {
  if (count <= 0) return "0";
  if (count >= 6) return "6+";
  return String(count);
};

const findRangeInterpretation = (
  interpretations: InterpretationMap,
  count: number,
) => {
  for (const [key, value] of Object.entries(interpretations)) {
    const match = key.match(/^(\d+)\s*-\s*(\d+)$/);

    if (!match || !value) continue;

    const from = Number(match[1]);
    const to = Number(match[2]);

    if (count >= from && count <= to) {
      return value;
    }
  }

  return undefined;
};

const pickInterpretation = (
  definition: LineDefinition | undefined,
  count: number,
) => {
  const interpretations = definition?.interpretations;

  if (!interpretations) {
    return undefined;
  }

  const exact = interpretations[getInterpretationKey(count)];

  if (exact) {
    return exact;
  }

  return findRangeInterpretation(interpretations, count);
};

const countCellValue = (value: PsychomatrixCellValue, digit: Digit): number => {
  if (value === null || value === undefined) {
    return 0;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? Math.max(0, Math.trunc(value)) : 0;
  }

  const normalizedValue = value.trim();

  if (!normalizedValue || normalizedValue === "." || normalizedValue === "·") {
    return 0;
  }

  return normalizedValue
    .split("")
    .filter((char) => char === String(digit)).length;
};

const getDigitCount = (matrix: PsychomatrixLineMatrix, digit: Digit): number => {
  return countCellValue(matrix[digit] ?? matrix[String(digit) as `${Digit}`], digit);
};

const calculateLineCount = (
  matrix: PsychomatrixLineMatrix,
  digits: Digit[],
): number => {
  return digits.reduce((sum, digit) => sum + getDigitCount(matrix, digit), 0);
};

const isDiagonalComparisonRule = (
  value: unknown,
): value is DiagonalComparisonRule => {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
};

const getDiagonalComparisonRules = (
  language: PsychomatrixLineLanguage,
): DiagonalComparisonRule[] => {
  const diagonals = getInterpretationContent(language).diagonals;
  const rules =
    diagonals && !Array.isArray(diagonals)
      ? diagonals.comparison_rules
      : undefined;

  if (!Array.isArray(rules)) {
    return [];
  }

  return rules.filter(isDiagonalComparisonRule);
};

const getDiagonalComparisonRuleIndex = (
  descendingCount: number,
  ascendingCount: number,
): number | undefined => {
  const difference = Math.abs(descendingCount - ascendingCount);

  if (descendingCount <= 2 && ascendingCount <= 2) {
    return 0;
  }

  if (descendingCount >= 3 && ascendingCount >= 3 && difference <= 2) {
    return 1;
  }

  if (descendingCount < ascendingCount && difference >= 3) {
    return 2;
  }

  if (ascendingCount < descendingCount && difference >= 3) {
    return 3;
  }

  return undefined;
};

export const calculatePsychomatrixDiagonalComparison = (
  matrix: PsychomatrixLineMatrix,
  language: string = "en",
): PsychomatrixDiagonalComparisonResult | null => {
  const lang = normalizeLineLanguage(language);
  const fallbackLang: PsychomatrixLineLanguage = "en";
  const descendingCount = calculateLineCount(matrix, [1, 5, 9]);
  const ascendingCount = calculateLineCount(matrix, [3, 5, 7]);
  const ruleIndex = getDiagonalComparisonRuleIndex(
    descendingCount,
    ascendingCount,
  );

  if (ruleIndex === undefined) {
    return null;
  }

  const rule =
    getDiagonalComparisonRules(lang)[ruleIndex] ??
    getDiagonalComparisonRules(fallbackLang)[ruleIndex];

  if (!rule?.result) {
    return null;
  }

  return {
    key: "diagonal_comparison",
    type: "diagonal",
    descendingCount,
    ascendingCount,
    condition: rule.condition,
    interpretation: rule.result,
  };
};

export const calculatePsychomatrixLines = (
  matrix: PsychomatrixLineMatrix,
  language: string = "en",
): PsychomatrixLineResult[] => {
  const lang = normalizeLineLanguage(language);
  const fallbackLang: PsychomatrixLineLanguage = "en";

  return lineSpecs.map((spec) => {
    const count = calculateLineCount(matrix, spec.digits);
    const definition = findLineDefinition(lang, spec);
    const fallbackDefinition = findLineDefinition(fallbackLang, spec);
    const name = definition?.name ?? fallbackDefinition?.name ?? spec.key;
    const numbers = definition?.numbers ?? fallbackDefinition?.numbers ?? spec.numbers;
    const interpretation =
      pickInterpretation(definition, count) ??
      pickInterpretation(fallbackDefinition, count) ??
      definition?.description ??
      fallbackDefinition?.description ??
      "";

    return {
      key: spec.key,
      type: spec.type,
      name,
      numbers,
      count,
      interpretation,
    };
  });
};
