import {
  getDynamicAffirmation,
  getLocalAffirmation,
  isAffirmationLanguageValid,
} from "@/constants/affirmations";
import { getAffirmationNumber } from "@/constants/affUtils";
import { Theme } from "@/constants/theme";
import { User } from "@/interface/User";
import { getTodayDateKey } from "@/utils/localDay";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useMemo, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { fs, lh } from "@/constants/typography";

const AFFIRM_CACHE_PREFIX = "AFFIRM_V2";
const MAX_AFFIRM_CACHE_ITEMS = 12;

type AffirmationCacheItem = {
  dateKey: string;
  lang: string;
  dob: string;
  num: number;
  text: string;
  updatedAt: number;
};

function buildAffirmCacheKey(
  dateKey: string,
  lang: string,
  dob: string,
  num: number,
) {
  return `${AFFIRM_CACHE_PREFIX}:${dateKey}:${lang}:${dob}:${num}`;
}

function getFallbackAffirmation(lang: string, num: number = 1) {
  return getLocalAffirmation(num, lang) || getLocalAffirmation(1, lang);
}

function cleanupSpaces(text: string) {
  return text
    .replace(/\*\*/g, "")
    .replace(/[_#>`~\-]{2,}/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitSentences(text: string) {
  return text
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?…])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function cleanAffirmationText(raw: string, lang: string, fallback: string) {
  if (!raw || typeof raw !== "string") {
    return fallback;
  }

  let text = cleanupSpaces(raw);

  text = text
    .replace(/^(аффирмация|affirmation|olumlama|аффирмация дня)[:\-\s]*/i, "")
    .replace(/^(today'?s affirmation|your affirmation for today)[:\-\s]*/i, "")
    .trim();

  const badParts = [
    "как ии",
    "я как",
    "я не могу",
    "искусственный интеллект",
    "as an ai",
    "i can’t",
    "i can't",
    "i cannot",
    "here is",
    "your affirmation",
    "bugünün olumlaması",
    "олумlama",
    "affirmation:",
    "аффирмация:",
  ];

  const sentences = splitSentences(text)
    .filter((s) => {
      const lower = s.toLowerCase();
      return !badParts.some((bad) => lower.includes(bad));
    })
    .slice(0, 3);

  let result = sentences.join(" ").trim();

  // Если модель вернула простыню без нормальных разделений
  if (!result) {
    result = text.slice(0, 220).trim();
  }

  // Аффирмация должна быть короткой
  if (result.length > 220) {
    result = result.slice(0, 220).trim();
    result = result.replace(/[,:;.\-–—\s]+$/, "");
    result += ".";
  }

  if (result.length < 12 || !isAffirmationLanguageValid(result, lang)) {
    return fallback;
  }

  return result;
}

async function cleanupAffirmationCache(currentKey: string) {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const affKeys = keys.filter((k) => k.startsWith(`${AFFIRM_CACHE_PREFIX}:`));

    if (!affKeys.length) return;

    const keysToDelete: string[] = [];
    const activeKeys: { key: string; updatedAt: number }[] = [];
    const today = getTodayDateKey();

    for (const key of affKeys) {
      if (key === currentKey) continue;

      try {
        const raw = await AsyncStorage.getItem(key);

        if (!raw) {
          keysToDelete.push(key);
          continue;
        }

        const parsed = JSON.parse(raw) as AffirmationCacheItem;

        if (parsed.dateKey !== today) {
          keysToDelete.push(key);
          continue;
        }

        activeKeys.push({
          key,
          updatedAt: parsed.updatedAt || 0,
        });
      } catch {
        keysToDelete.push(key);
      }
    }

    activeKeys
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(MAX_AFFIRM_CACHE_ITEMS - 1)
      .forEach((item) => keysToDelete.push(item.key));

    if (keysToDelete.length) {
      await AsyncStorage.multiRemove([...new Set(keysToDelete)]);
    }
  } catch (error) {
    console.log("cleanupAffirmationCache error:", error);
  }
}

const Aff = ({
  theme,
  user,
  lang,
  dateKey,
  getTodayAffirmationName,
}: {
  theme: Theme;
  user: User;
  lang: string;
  dateKey: string;
  getTodayAffirmationName: (lang: string) => string;
}) => {
  const [text, setText] = useState("");

  const dob = useMemo(
    () => user?.date_of_birth || "2000-01-01",
    [user?.date_of_birth],
  );

  useEffect(() => {
    let mounted = true;

    async function loadAffirmation() {
      let fallback = getFallbackAffirmation(lang);

      try {
        const num = getAffirmationNumber(dob, dateKey);
        const base = getFallbackAffirmation(lang, num);
        fallback = base;
        const cacheKey = buildAffirmCacheKey(dateKey, lang, dob, num);

        const saved = await AsyncStorage.getItem(cacheKey);
        if (saved) {
          try {
            const parsed = JSON.parse(saved) as AffirmationCacheItem;

            if (
              parsed.dateKey === dateKey &&
              parsed.lang === lang &&
              parsed.dob === dob &&
              parsed.num === num &&
              parsed.text
            ) {
              if (mounted) {
                setText(cleanAffirmationText(parsed.text, lang, base));
              }

              await cleanupAffirmationCache(cacheKey);
              return;
            }
          } catch {
            // ignore broken cache
          }
        }

        let dynamic = "";

        try {
          dynamic = await getDynamicAffirmation(num, lang);
        } catch (error) {
          console.log("getDynamicAffirmation error:", error);
        }

        // если динамика плохая/пустая — fallback на локальную аффирмацию текущего языка
        const candidate = cleanAffirmationText(dynamic || base, lang, base);

        const payload: AffirmationCacheItem = {
          dateKey,
          lang,
          dob,
          num,
          text: candidate,
          updatedAt: Date.now(),
        };

        await AsyncStorage.setItem(cacheKey, JSON.stringify(payload));
        await cleanupAffirmationCache(cacheKey);

        if (mounted) {
          setText(candidate);
        }
      } catch (error) {
        console.log("Affirmation load error:", error);

        if (mounted) {
          setText(fallback);
        }
      }
    }

    loadAffirmation();

    return () => {
      mounted = false;
    };
  }, [dateKey, dob, lang]);

  return (
    <View style={{ marginTop: 12 }}>
      <View style={styles.cardContent}>
        <View style={styles.iconBox}>
          <View style={styles.iconCircle}>
            <Image
              source={require("../../../assets/images/bg/clever.png")}
              style={{ position: "absolute", width: 44, height: 44 }}
            />
          </View>
        </View>

        <View style={[styles.textBox, { marginTop: -7 }]}>
          <Text style={[styles.cardTitle, { color: theme.title }]}>
            {getTodayAffirmationName(lang)}
          </Text>
        </View>
      </View>

      <Text
        style={{
          color: theme.subtitle,
          fontSize: fs(16),
          lineHeight: lh(22),
          marginTop: 4,
        }}
      >
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContent: {
    flexDirection: "row",
  },
  iconBox: {
    width: 46,
    marginLeft: -4,
    alignItems: "center",
    marginRight: 5,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  textBox: {
    flex: 1,
  },
  cardTitle: {
    fontSize: fs(18),
    fontWeight: "700",
    marginBottom: 10,
    paddingTop: 12,
  },
});

export default Aff;
