import { getPairText, Locale, t } from "@/data/compa/name";
import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import NumerologyDisclaimer from "../legal/NumerologyDisclaimer";
import { fs, lh } from "@/constants/typography";

type Props = {
  locale?: Locale;

  partner1Initial?: {
    firstName?: string;
    lastName?: string;
    middleName?: string;
  };
  partner2Initial?: {
    firstName?: string;
    lastName?: string;
    middleName?: string;
  };

  partner1Label?: string;
  partner2Label?: string;
};

// Русский алфавит (с Ё). Значение = позиция по порядку, сведённая к 1..9 (по кругу)
const RU_ALPHABET = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";

// Строим мапу: буква -> 1..9
const LETTER_MAP: Record<string, number> = (() => {
  const map: Record<string, number> = {};
  for (let i = 0; i < RU_ALPHABET.length; i++) {
    const letter = RU_ALPHABET[i];
    map[letter] = (i % 9) + 1;
  }
  return map;
})();

function digitalRoot1to9(n: number): number {
  let x = Math.abs(n);
  if (x === 0) return 0;

  while (x >= 10) {
    let s = 0;
    while (x > 0) {
      s += x % 10;
      x = Math.floor(x / 10);
    }
    x = s;
  }
  return x; // 1..9
}

function normalizeFioText(s: string): string {
  return (s || "")
    .trim()
    .toUpperCase()
    .replace(/[^А-ЯЁA-Z\- ]/g, "");
}

function fioToNumber(full: string): {
  sum: number;
  root: number;
  unknownChars: string[];
} {
  const norm = normalizeFioText(full);
  let sum = 0;
  const unknown: string[] = [];

  for (const ch of norm) {
    if (ch === " " || ch === "-") continue;

    const v = LETTER_MAP[ch];
    if (typeof v === "number") sum += v;
    else unknown.push(ch);
  }

  const root = sum === 0 ? 0 : digitalRoot1to9(sum);
  return { sum, root, unknownChars: Array.from(new Set(unknown)) };
}

function joinFio(
  lastName: string,
  firstName: string,
  middleName: string,
): string {
  return [lastName, firstName, middleName]
    .map((x) => x?.trim())
    .filter(Boolean)
    .join(" ");
}

const Field = ({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (t: string) => void;
  placeholder?: string;
}) => {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        style={styles.input}
        autoCapitalize="characters"
      />
    </View>
  );
};

const CompaName: React.FC<Props> = ({
  locale = "ru",
  partner1Initial,
  partner2Initial,
  partner1Label,
  partner2Label,
}) => {
  const [p1First, setP1First] = useState(partner1Initial?.firstName ?? "");
  const [p1Last, setP1Last] = useState(partner1Initial?.lastName ?? "");
  const [p1Middle, setP1Middle] = useState(partner1Initial?.middleName ?? "");

  const [p2First, setP2First] = useState(partner2Initial?.firstName ?? "");
  const [p2Last, setP2Last] = useState(partner2Initial?.lastName ?? "");
  const [p2Middle, setP2Middle] = useState(partner2Initial?.middleName ?? "");

  const p1Full = useMemo(
    () => joinFio(p1Last, p1First, p1Middle),
    [p1Last, p1First, p1Middle],
  );
  const p2Full = useMemo(
    () => joinFio(p2Last, p2First, p2Middle),
    [p2Last, p2First, p2Middle],
  );

  const p1Calc = useMemo(() => fioToNumber(p1Full), [p1Full]);
  const p2Calc = useMemo(() => fioToNumber(p2Full), [p2Full]);

  const pairNumber = useMemo(() => {
    if (p1Calc.root === 0 || p2Calc.root === 0) return 0;
    return digitalRoot1to9(p1Calc.root + p2Calc.root);
  }, [p1Calc.root, p2Calc.root]);

  const pairText = useMemo(() => {
    if (!pairNumber) return null;
    return getPairText(locale, pairNumber);
  }, [locale, pairNumber]);

  const label1 = partner1Label?.trim().length
    ? partner1Label
    : t(locale, "partner1LabelDefault");

  const label2 = partner2Label?.trim().length
    ? partner2Label
    : t(locale, "partner2LabelDefault");

  const showUnknownP1 = p1Calc.unknownChars.length > 0;
  const showUnknownP2 = p2Calc.unknownChars.length > 0;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>{t(locale, "title")}</Text>
        <Text style={styles.subtitle}>{t(locale, "subtitle")}</Text>

        {/* Partner 1 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {label1 || t(locale, "p1.cardTitle")}
          </Text>

          <View style={styles.row}>
            <Field
              label={t(locale, "p1.firstNameLabel")}
              value={p1First}
              onChange={setP1First}
              placeholder={t(locale, "p1.firstNamePlaceholder")}
            />
            <View style={styles.gap} />
            <Field
              label={t(locale, "p1.lastNameLabel")}
              value={p1Last}
              onChange={setP1Last}
              placeholder={t(locale, "p1.lastNamePlaceholder")}
            />
          </View>

          <Field
            label={t(locale, "p1.middleNameLabel")}
            value={p1Middle}
            onChange={setP1Middle}
            placeholder={t(locale, "p1.middleNamePlaceholder")}
          />

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>{t(locale, "p1.fioLabel")}</Text>
            <Text style={styles.resultValue} numberOfLines={2}>
              {p1Full || "—"}
            </Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>
              {t(locale, "p1.fioNumberLabel")}
            </Text>
            <Text style={styles.badge}>{p1Calc.root ? p1Calc.root : "—"}</Text>
          </View>

          {showUnknownP1 && (
            <Text style={styles.hint}>
              {t(locale, "p1.unknownCharsHintPrefix")}
              {p1Calc.unknownChars.join(", ")}{" "}
              {t(locale, "p1.unknownCharsHintSuffix")}
            </Text>
          )}


        </View>

        {/* Partner 2 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {label2 || t(locale, "p2.cardTitle")}
          </Text>

          <View style={styles.row}>
            <Field
              label={t(locale, "p2.firstNameLabel")}
              value={p2First}
              onChange={setP2First}
              placeholder={t(locale, "p2.firstNamePlaceholder")}
            />
            <View style={styles.gap} />
            <Field
              label={t(locale, "p2.lastNameLabel")}
              value={p2Last}
              onChange={setP2Last}
              placeholder={t(locale, "p2.lastNamePlaceholder")}
            />
          </View>

          <Field
            label={t(locale, "p2.middleNameLabel")}
            value={p2Middle}
            onChange={setP2Middle}
            placeholder={t(locale, "p2.middleNamePlaceholder")}
          />

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>{t(locale, "p2.fioLabel")}</Text>
            <Text style={styles.resultValue} numberOfLines={2}>
              {p2Full || "—"}
            </Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>
              {t(locale, "p2.fioNumberLabel")}
            </Text>
            <Text style={styles.badge}>{p2Calc.root ? p2Calc.root : "—"}</Text>
          </View>

          {showUnknownP2 && (
            <Text style={styles.hint}>
              {t(locale, "p2.unknownCharsHintPrefix")}
              {p2Calc.unknownChars.join(", ")}{" "}
              {t(locale, "p2.unknownCharsHintSuffix")}
            </Text>
          )}


        </View>

        {/* Pair result */}
        <View style={[styles.card, styles.cardAccent]}>
          <Text style={styles.cardTitle}>{t(locale, "cardResultTitle")}</Text>

          <View style={styles.pairLine}>
            <Text style={styles.pairSmall}>
              {t(locale, "result.partner1Number")}
            </Text>
            <Text style={styles.pairBig}>
              {p1Calc.root ? p1Calc.root : "—"}
            </Text>
          </View>

          <View style={styles.pairLine}>
            <Text style={styles.pairSmall}>
              {t(locale, "result.partner2Number")}
            </Text>
            <Text style={styles.pairBig}>
              {p2Calc.root ? p2Calc.root : "—"}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.pairLine}>
            <Text style={styles.pairSmall}>
              {t(locale, "result.pairNumber")}
            </Text>
            <Text style={styles.pairBig}>{pairNumber ? pairNumber : "—"}</Text>
          </View>

          {pairText ? (
            <View style={styles.pairTextBox}>
              <Text style={styles.pairTitle}>{pairText.title}</Text>
              <Text style={styles.pairBody}>{pairText.body}</Text>
            </View>
          ) : (
            <Text style={styles.hint}>{t(locale, "result.fillBothHint")}</Text>
          )}

          <NumerologyDisclaimer lang={locale} />
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CompaName;

/** ---------- Styles ---------- */

const colors = {
  text: "#0B0B0F",
  subtext: "#5A5A63",
  placeholder: "#9A9AA3",

  cardBg: "#FFFFFF",

  border: "#E7E7EE",
  inputBg: "#FFFFFF",

  accentBg: "#F2F8FF",
  accentBorder: "#CFE4FF",

  badgeBg: "#3594DE",
  badgeText: "#FFFFFF",

  divider: "#E7E7EE",
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  scroll: { padding: 0, paddingBottom: 60 },

  title: {
    color: colors.text,
    fontSize: fs(22),
    fontWeight: "800",
    marginBottom: 6,
  },
  subtitle: {
    color: colors.subtext,
    fontSize: fs(13),
    marginBottom: 14,
    lineHeight: lh(18),
  },

  card: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,

    // лёгкая "карточность"
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 1,
  },

  cardAccent: {
    backgroundColor: colors.accentBg,
    borderColor: colors.accentBorder,
    marginTop: 6,
  },

  cardTitle: {
    color: colors.text,
    fontSize: fs(16),
    fontWeight: "800",
    marginBottom: 12,
  },

  row: { flexDirection: "row" },
  gap: { width: 10 },

  field: { flex: 1, marginBottom: 10 },
  fieldLabel: { color: colors.subtext, fontSize: fs(12), marginBottom: 6 },

  input: {
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: fs(14),
  },

  resultRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  resultLabel: { color: colors.subtext, fontSize: fs(12), width: 110 },
  resultValue: { color: colors.text, fontSize: fs(13), flex: 1 },

  badge: {
    color: colors.badgeText,
    backgroundColor: colors.badgeBg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: "hidden",
    fontWeight: "800",
  },

  hint: { color: colors.text, fontSize: fs(12), marginTop: 8, lineHeight: lh(16) },

  pairLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pairSmall: { color: colors.subtext, fontSize: fs(12) },
  pairBig: { color: colors.text, fontSize: fs(22), fontWeight: "900" },

  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 12,
  },

  pairTextBox: { marginTop: 12 },
  pairTitle: {
    color: colors.text,
    fontSize: fs(14),
    fontWeight: "900",
    marginBottom: 6,
  },
  pairBody: { color: colors.text, fontSize: fs(13), lineHeight: lh(18) },

});
