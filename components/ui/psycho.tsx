import React, { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { PortraitLang } from "@/data/dummy/portrait";
import { Digit, getDescriptionForDigit } from "@/data/psycho/psychomatrixCore";
import {
  calculatePsychomatrixDiagonalComparison,
  calculatePsychomatrixLines,
  type PsychomatrixLineType,
} from "@/data/psycho/psychomatrixLines";
import NumerologyDisclaimer from "../legal/NumerologyDisclaimer";
import { fs } from "@/constants/typography";

type Language = "ru" | "en" | "kz" | "tr";

type LocalizedValue =
  | string
  | Partial<Record<Language, string>>
  | null
  | undefined;

interface LocalizedDescription {
  title?: LocalizedValue;
  label?: LocalizedValue;
  text?: LocalizedValue;
  recommendation?: LocalizedValue;
  near?: LocalizedValue;
  upgrade?: LocalizedValue;
  general?: LocalizedValue;
}

interface PsychomatrixProps {
  birthDate: string;
  style?: ViewStyle;
  shiftedBirthDate: string;
  is21Century: boolean;
  sum1: number;
  sum2: number;
  sum3: number;
  sum4: number;
  grid: (Digit | null)[][];
  counts: Record<Digit, number>;
  activeDigits: Digit[];
  openBlocks: Record<Digit, boolean>;
  toggleBlock: (digit: Digit) => void;
  language?: PortraitLang;
}

const translations: Record<
  Language,
  {
    title: string;
    birthDate: string;
    intro: string;
    quantity: string;
    recommendationsForSelf: string;
    recommendationsForLovedOnes: string;
    howToDevelopQuality: string;
    howToBalanceQuality: string;
    digitGeneral: string;
    linesInterpretation: string;
    linesCountLabel: string;
    diagonalComparisonTitle: string;
    lineGroupTitles: Record<PsychomatrixLineType, string>;
    zero: string;
    fallbackTitle: string;
  }
> = {
  ru: {
    title: "Психоматрица",
    birthDate: "Дата рождения",
    intro:
      "Когда какое-то качество выражено у вас сильнее нормы, оно становится вашей опорой — природным источником уверенности, таланта и успеха, который легко проявляется в делах, отношениях и работе и может приносить доход. Это ваш внутренний ресурс, который вы постоянно «производите» и можете использовать с пользой. Но важно помнить: любое сильное качество требует осознанного управления — без направленности оно может проявляться чрезмерно, поэтому важно реализовывать его в созидании, развитии и конкретных делах.",
    quantity: "Количество",
    recommendationsForSelf: "Рекомендации для себя",
    recommendationsForLovedOnes: "Рекомендации для близких",
    howToDevelopQuality: "Как наработать качество",
    howToBalanceQuality: "Как отработать качество",
    digitGeneral: "Общее по цифре",
    linesInterpretation: "Интерпретация линий",
    linesCountLabel: "цифр",
    diagonalComparisonTitle: "Описание",
    lineGroupTitles: {
      row: "Горизонтали",
      column: "Вертикали",
      diagonal: "Диагонали",
    },
    zero: "0",
    fallbackTitle: "Описание",
  },
  en: {
    title: "Psychomatrix",
    birthDate: "Date of birth",
    intro:
      "When a certain quality is expressed in you more strongly than usual, it becomes your support — a natural source of confidence, talent, and success that easily shows up in work, relationships, and daily life and can even generate income. This is your inner resource that you continuously produce and can use to your advantage. But it is important to remember: any strong quality requires conscious management — without direction it can become excessive, so it is important to channel it into creation, growth, and concrete actions.",
    quantity: "Quantity",
    recommendationsForSelf: "Recommendations for yourself",
    recommendationsForLovedOnes: "Recommendations for loved ones",
    howToDevelopQuality: "How to develop the quality",
    howToBalanceQuality: "How to balance the quality",
    digitGeneral: "General meaning of the digit",
    linesInterpretation: "Lines Interpretation",
    linesCountLabel: "digits",
    diagonalComparisonTitle: "Description",
    lineGroupTitles: {
      row: "Rows",
      column: "Columns",
      diagonal: "Diagonals",
    },
    zero: "0",
    fallbackTitle: "Description",
  },
  kz: {
    title: "Психоматрица",
    birthDate: "Туған күні",
    intro:
      "Егер қандай да бір қасиет сізде қалыптыдан күштірек көрінсе, ол сіздің тірегіңізге айналады — сенімділік, талант және жетістік көзі болады. Бұл қасиет істе, қарым-қатынаста және жұмыста оңай байқалып, тіпті табыс әкелуі мүмкін. Бұл — сіз үнемі «өндіретін» ішкі ресурсыңыз. Бірақ кез келген күшті қасиет саналы басқаруды талап етеді: егер оны дұрыс бағыттамаса, ол шамадан тыс көрінуі мүмкін. Сондықтан оны жасампаздыққа, дамуға және нақты әрекеттерге бағыттау маңызды.",
    quantity: "Саны",
    recommendationsForSelf: "Өзіңізге арналған ұсыныстар",
    recommendationsForLovedOnes: "Жақындарыңызға арналған ұсыныстар",
    howToDevelopQuality: "Қасиетті қалай дамыту керек",
    howToBalanceQuality: "Қасиетті қалай теңгеру керек",
    digitGeneral: "Сан бойынша жалпы мағына",
    linesInterpretation: "Сызықтардың түсіндірмесі",
    linesCountLabel: "цифр",
    diagonalComparisonTitle: "Сипаттама",
    lineGroupTitles: {
      row: "Көлденеңдер",
      column: "Тік сызықтар",
      diagonal: "Диагональдар",
    },
    zero: "0",
    fallbackTitle: "Сипаттама",
  },
  tr: {
    title: "Psikomatriks",
    birthDate: "Doğum tarihi",
    intro:
      "Bir özellik sende normalden daha güçlü ifade edildiğinde, bu senin dayanağın hâline gelir — özgüven, yetenek ve başarının doğal bir kaynağı olur. Bu özellik işte, ilişkilerde ve günlük hayatta kolayca ortaya çıkar ve hatta gelir getirebilir. Bu, sürekli ürettiğin ve faydalı şekilde kullanabileceğin içsel kaynağındır. Ancak şunu unutmamak gerekir: her güçlü özellik bilinçli yönetim ister — yön verilmezse aşırı şekilde ortaya çıkabilir. Bu yüzden onu üretkenliğe, gelişime ve somut eylemlere yönlendirmek önemlidir.",
    quantity: "Miktar",
    recommendationsForSelf: "Kendin için öneriler",
    recommendationsForLovedOnes: "Yakınların için öneriler",
    howToDevelopQuality: "Bu özellik nasıl geliştirilir",
    howToBalanceQuality: "Bu özellik nasıl dengelenir",
    digitGeneral: "Rakamın genel anlamı",
    linesInterpretation: "Çizgi Yorumları",
    linesCountLabel: "rakam",
    diagonalComparisonTitle: "Açıklama",
    lineGroupTitles: {
      row: "Yataylar",
      column: "Dikeyler",
      diagonal: "Diyagonaller",
    },
    zero: "0",
    fallbackTitle: "Açıklama",
  },
};

const lineGroupOrder: PsychomatrixLineType[] = ["row", "column", "diagonal"];

const isLanguage = (value?: string): value is Language => {
  return value === "ru" || value === "en" || value === "kz" || value === "tr";
};

const getSafeLanguage = (language?: string): Language => {
  return isLanguage(language) ? language : "ru";
};

const pickLocalizedText = (
  value: LocalizedValue,
  language: Language,
  fallbackLanguage: Language = "ru",
): string => {
  if (!value) return "";

  if (typeof value === "string") {
    return value;
  }

  return (
    value[language] ||
    value[fallbackLanguage] ||
    value.en ||
    value.ru ||
    value.kz ||
    value.tr ||
    ""
  );
};

const getUpgradeSectionTitle = (
  count: number,
  t: (typeof translations)[Language],
) => {
  return count <= 2 ? t.howToDevelopQuality : t.howToBalanceQuality;
};

const renderMatrixCell = (digit: Digit, counts: Record<Digit, number>) => {
  const count = counts[digit];
  const content = count > 0 ? new Array(count).fill(digit).join("") : "-";

  return (
    <View key={digit} style={styles.cell}>
      <Text style={styles.cellDigit}>{digit}</Text>
      <Text style={styles.cellValue}>{content}</Text>
    </View>
  );
};

const renderLinePath = (numbers: string) => {
  const values = numbers.split("-");

  return (
    <View style={styles.linePath}>
      {values.map((value, index) => (
        <React.Fragment key={`${numbers}-${value}-${index}`}>
          <View style={styles.linePathDot}>
            <Text style={styles.linePathDotText}>{value}</Text>
          </View>

          {index < values.length - 1 && (
            <View style={styles.linePathConnector} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

const PsychoDisplay = ({
  birthDate,
  style,
  shiftedBirthDate,
  is21Century,
  sum1,
  sum2,
  sum3,
  sum4,
  grid,
  counts,
  activeDigits,
  openBlocks,
  toggleBlock,
  language = "ru",
}: PsychomatrixProps) => {
  const lang = getSafeLanguage(language);

  const t = useMemo(() => translations[lang], [lang]);
  const lines = useMemo(
    () => calculatePsychomatrixLines(counts, lang),
    [counts, lang],
  );
  const diagonalComparison = useMemo(
    () => calculatePsychomatrixDiagonalComparison(counts, lang),
    [counts, lang],
  );

  return (
    <ScrollView
      style={[styles.container, style]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>{t.title}</Text>
      <Text style={styles.subtitle}>
        {t.birthDate}: {shiftedBirthDate}
      </Text>

      <View style={styles.matrix}>
        {grid.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.matrixRow}>
            {row.map((digit, colIndex) =>
              digit !== null ? (
                <React.Fragment key={`cell-${rowIndex}-${colIndex}-${digit}`}>
                  {renderMatrixCell(digit, counts)}
                </React.Fragment>
              ) : (
                <View
                  key={`empty-${rowIndex}-${colIndex}`}
                  style={styles.cell}
                />
              ),
            )}
          </View>
        ))}
      </View>

      <Text style={styles.desc}>{t.intro}</Text>

      <View style={styles.descriptionsContainer}>
        {activeDigits.map((digit) => {
          const count = counts[digit];
          const rawDesc = getDescriptionForDigit(
            digit,
            count,
            lang,
          ) as LocalizedDescription | null;

          if (!rawDesc) return null;

          const title =
            pickLocalizedText(rawDesc.title, lang) || t.fallbackTitle;
          const label = pickLocalizedText(rawDesc.label, lang);
          const text = pickLocalizedText(rawDesc.text, lang);
          const recommendation = pickLocalizedText(
            rawDesc.recommendation,
            lang,
          );
          const near = pickLocalizedText(rawDesc.near, lang);
          const upgrade = pickLocalizedText(rawDesc.upgrade, lang);
          const general = pickLocalizedText(rawDesc.general, lang);

          const isOpen = openBlocks[digit];

          return (
            <View key={digit} style={styles.descriptionBlock}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleBlock(digit)}
              >
                <View style={styles.accordionHeader}>
                  <Text style={styles.descriptionTitle}>{title}</Text>
                  <Text style={styles.chevron}>{isOpen ? "▲" : "▼"}</Text>
                </View>

                <Text style={styles.descriptionSubTitle}>
                  {t.quantity}:
                  {count === 0 ? t.zero : Array(count).fill(digit).join(" ")}
                </Text>
              </TouchableOpacity>

              {isOpen && (
                <View style={styles.accordionBody}>
                  {!!label && (
                    <Text style={styles.descriptionLabel}>{label}</Text>
                  )}

                  {!!text && <Text style={styles.descriptionText}>{text}</Text>}

                  {!!recommendation && (
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>
                        {t.recommendationsForSelf}
                      </Text>
                      <Text style={styles.sectionText}>{recommendation}</Text>
                    </View>
                  )}

                  {!!near && (
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>
                        {t.recommendationsForLovedOnes}
                      </Text>
                      <Text style={styles.sectionText}>{near}</Text>
                    </View>
                  )}

                  {!!upgrade && (
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>
                        {getUpgradeSectionTitle(count, t)}
                      </Text>
                      <Text style={styles.sectionText}>{upgrade}</Text>
                    </View>
                  )}

                  {!!general && (
                    <View style={styles.sectionGeneral}>
                      <Text style={styles.sectionTitleSmall}>
                        {t.digitGeneral}
                      </Text>
                      <Text style={styles.sectionTextGeneral}>{general}</Text>
                    </View>
                  )}

                  <NumerologyDisclaimer lang={lang} />
                </View>
              )}
            </View>
          );
        })}
      </View>

      <View style={styles.linesSection}>
        <Text style={styles.linesTitle}>{t.linesInterpretation}</Text>

        <View style={styles.lineGroups}>
          {lineGroupOrder.map((groupType) => {
            const groupLines = lines.filter((line) => line.type === groupType);

            return (
              <View key={groupType} style={styles.lineGroup}>
                <View style={styles.lineGroupHeader}>
                  <View style={styles.lineGroupAccent} />
                  <Text style={styles.lineGroupTitle}>
                    {t.lineGroupTitles[groupType]}
                  </Text>
                </View>

                <View style={styles.lineGroupBody}>
                  {groupLines.map((line, index) => (
                    <View
                      key={line.key}
                      style={[
                        styles.lineItem,
                        index === groupLines.length - 1 && styles.lineItemLast,
                      ]}
                    >
                      <View style={styles.lineItemMeta}>
                        {renderLinePath(line.numbers)}

                        <View style={styles.lineCountBadge}>
                          <Text style={styles.lineCountText}>
                            {line.count}
                          </Text>
                          <Text style={styles.lineCountLabel}>
                            {t.linesCountLabel}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.lineName}>{line.name}</Text>

                      {line.type !== "diagonal" && !!line.interpretation && (
                        <Text style={styles.lineInterpretation}>
                          {line.interpretation}
                        </Text>
                      )}
                    </View>
                  ))}

                  {groupType === "diagonal" && diagonalComparison && (
                    <View style={styles.diagonalComparisonItem}>
                      <Text style={styles.diagonalComparisonTitle}>
                        {t.diagonalComparisonTitle}
                      </Text>
                      <Text style={styles.lineInterpretation}>
                        {diagonalComparison.interpretation}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 16 },
  scrollContent: { gap: 8, paddingBottom: 40 },
  title: { fontSize: fs(24), fontWeight: "800", color: "#000000" },
  subtitle: { fontSize: fs(14), color: "#666666" },
  desc: {
    fontSize: fs(13),
    color: "#666666",
    paddingHorizontal: 4,
    paddingTop: 8,
  },
  numbersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  numberText: { fontSize: fs(14), color: "#444444" },
  matrix: {
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    overflow: "hidden",
  },
  matrixRow: { flexDirection: "row" },
  linesSection: {
    gap: 12,
    marginTop: 20,
  },
  linesTitle: {
    color: "#000000",
    fontSize: fs(17),
    fontWeight: "700",
  },
  lineGroups: {
    gap: 12,
  },
  lineGroup: {
    backgroundColor: "#ffffff",
    borderColor: "#e0e0e0",
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  lineGroupHeader: {
    alignItems: "center",
    backgroundColor: "#fbfdff",
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  lineGroupAccent: {
    backgroundColor: "#369cef",
    borderRadius: 2,
    height: 16,
    width: 4,
  },
  lineGroupTitle: {
    color: "#000000",
    fontSize: fs(14),
    fontWeight: "700",
  },
  lineGroupBody: {
    borderTopColor: "#edf2f7",
    borderTopWidth: 1,
  },
  lineItem: {
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomColor: "#edf2f7",
    borderBottomWidth: 1,
  },
  lineItemLast: {
    borderBottomWidth: 0,
  },
  lineItemMeta: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  linePath: {
    alignItems: "center",
    flexDirection: "row",
    flexShrink: 1,
  },
  linePathDot: {
    alignItems: "center",
    backgroundColor: "#f1f7fd",
    borderColor: "#d6e8f8",
    borderRadius: 14,
    borderWidth: 1,
    height: 28,
    justifyContent: "center",
    width: 28,
  },
  linePathDotText: {
    color: "#1f6da8",
    fontSize: fs(12),
    fontWeight: "800",
  },
  linePathConnector: {
    backgroundColor: "#d6e8f8",
    height: 1,
    width: 16,
  },
  lineName: {
    color: "#000000",
    fontSize: fs(14),
    fontWeight: "700",
  },
  lineCountBadge: {
    alignItems: "center",
    backgroundColor: "#fff8ec",
    borderColor: "#f1ddb9",
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    gap: 4,
    justifyContent: "center",
    minHeight: 28,
    paddingHorizontal: 10,
  },
  lineCountText: {
    color: "#a36c16",
    fontSize: fs(13),
    fontWeight: "800",
  },
  lineCountLabel: {
    color: "#a36c16",
    fontSize: fs(11),
    fontWeight: "600",
  },
  lineInterpretation: {
    color: "#444444",
    fontSize: fs(13),
    lineHeight: fs(19),
  },
  diagonalComparisonItem: {
    backgroundColor: "#fbfdff",
    borderTopColor: "#edf2f7",
    borderTopWidth: 1,
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  diagonalComparisonTitle: {
    color: "#000000",
    fontSize: fs(14),
    fontWeight: "700",
  },
  cell: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRightWidth: 1,
    borderRightColor: "#e0e0e0",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
  },
  cellDigit: { fontSize: fs(12), color: "#000000", marginBottom: 2 },
  cellValue: { fontSize: fs(16), fontWeight: "600", color: "#000000" },
  errorText: { color: "#ff0000", fontSize: fs(14) },
  descriptionsContainer: { marginTop: 16, gap: 12 },
  descriptionBlock: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  descriptionSubTitle: { fontSize: fs(14), color: "#666666", marginTop: 4 },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chevron: { fontSize: fs(16), color: "#000000" },
  accordionBody: { marginTop: 10 },
  descriptionTitle: { fontSize: fs(15), fontWeight: "700", color: "#000000" },
  descriptionLabel: {
    fontSize: fs(14),
    fontWeight: "600",
    color: "#c9a86a",
    marginBottom: 4,
  },
  descriptionText: { fontSize: fs(13), color: "#444444", marginBottom: 4 },
  section: { marginTop: 6 },
  sectionTitle: {
    fontSize: fs(13),
    fontWeight: "600",
    color: "#000000",
    marginBottom: 2,
  },
  sectionText: { fontSize: fs(13), color: "#444444" },
  sectionGeneral: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 6,
  },
  sectionTitleSmall: {
    fontSize: fs(12),
    fontWeight: "600",
    color: "#bbbbbb",
    marginBottom: 2,
  },
  sectionTextGeneral: { fontSize: fs(12), color: "#aaaaaa" },
});

export default PsychoDisplay;
