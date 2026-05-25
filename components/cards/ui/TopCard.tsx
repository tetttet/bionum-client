import { DataPrompt, getDailyForecastFallback } from "@/constants/data";
import { BORDER_RADIUS } from "@/constants/params";
import { Theme } from "@/constants/theme";
import { useLocalDay } from "@/hooks/useLocalDay";
import { User } from "@/interface/User";
import { formatLocalDate, getTodayDateKey } from "@/utils/localDay";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  View,
} from "react-native";
import { useAlpha } from "../SectionCard";
import MarkdownRender from "./MarkdownRender";
import { TopCardHeader } from "./TopCardHeader";

export const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent";
export const GEMINI_API_KEY = "AIzaSyBu4MjYyMeWLmIHnK7EYuAe3CXelA4eCOY";

/**
 * ВАЖНО:
 * Для продакшна API key нельзя держать в клиенте.
 * Его лучше вынести в backend / edge function / server proxy.
 */

const HOROSCOPE_CACHE_PREFIX = "HOROSCOPE_V3";
const MAX_CACHE_ITEMS = 10;
const GEMINI_TIMEOUT_MS = 12000;

type HoroscopeCacheItem = {
  dateKey: string;
  lang: string;
  dob: string;
  text: string;
  updatedAt: number;
};

function getTodayName(lang: string) {
  switch (lang) {
    case "kz":
      return "Бүгінгі күннің болжамы";
    case "en":
      return "Forecast for today";
    case "tr":
      return "Bugünün tahmini";
    default:
      return "Прогноз на сегодня";
  }
}

function getFallbackHoroscope(lang: string, dob: string, dateKey: string) {
  return getDailyForecastFallback(dob, dateKey, lang);
}

function buildHoroscopeCacheKey(dateKey: string, lang: string, dob: string) {
  return `${HOROSCOPE_CACHE_PREFIX}:${dateKey}:${lang}:${dob}`;
}

function cleanupSpaces(text: string) {
  return text
    .replace(/\r/g, "")
    .replace(/\*\*/g, "")
    .replace(/[_#>`~]{2,}/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function trimForecastLength(text: string) {
  if (text.length <= 520) return text;

  const clipped = text.slice(0, 520);
  const lastSentenceEnd = Math.max(
    clipped.lastIndexOf("."),
    clipped.lastIndexOf("!"),
    clipped.lastIndexOf("?"),
    clipped.lastIndexOf("…"),
  );

  return (lastSentenceEnd > 220 ? clipped.slice(0, lastSentenceEnd + 1) : clipped)
    .trim()
    .replace(/[,:;\-\s]+$/, ".");
}

function cleanHoroscopeText(raw: string, fallback: string) {
  if (!raw || typeof raw !== "string") {
    return fallback;
  }

  let text = cleanupSpaces(raw);

  text = text
    .replace(/^(вот прогноз|готовый прогноз|here is|here's|işte|міне)[:\-\s]*/i, "")
    .trim();

  const badParts = [
    "как ии",
    "я не могу",
    "я как",
    "искусственный интеллект",
    "as an ai",
    "i can't",
    "i cannot",
    "yapay zeka",
    "жасанды интеллект",
  ];

  const result = trimForecastLength(
    text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .filter((line) => {
        const lower = line.toLowerCase();

        return !(
          lower.startsWith("число дня") ||
          lower.startsWith("day number") ||
          lower.startsWith("күн саны") ||
          lower.startsWith("günün sayısı")
        );
      })
      .filter((line) => {
        const lower = line.toLowerCase();
        return !badParts.some((bad) => lower.includes(bad));
      })
      .join("\n"),
  );

  return result.length >= 40 ? result : fallback;
}

async function cleanupHoroscopeCache(currentKey: string) {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const horoscopeKeys = keys.filter((k) =>
      k.startsWith(`${HOROSCOPE_CACHE_PREFIX}:`),
    );

    if (!horoscopeKeys.length) return;

    const keysToDelete: string[] = [];
    const activeKeys: { key: string; updatedAt: number }[] = [];

    for (const key of horoscopeKeys) {
      if (key === currentKey) continue;

      try {
        const raw = await AsyncStorage.getItem(key);
        if (!raw) {
          keysToDelete.push(key);
          continue;
        }

        const parsed = JSON.parse(raw) as HoroscopeCacheItem;

        // Удаляем всё не за сегодня
        if (parsed.dateKey !== getTodayDateKey()) {
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

    // Доп. защита от разрастания
    activeKeys
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(MAX_CACHE_ITEMS - 1)
      .forEach((item) => keysToDelete.push(item.key));

    if (keysToDelete.length) {
      await AsyncStorage.multiRemove([...new Set(keysToDelete)]);
    }
  } catch (error) {
    console.log("cleanupHoroscopeCache error:", error);
  }
}

async function fetchGeminiHoroscope(
  lang: string,
  dateKey: string,
  dob: string,
) {
  const businessPrompt = DataPrompt(dob, dateKey, lang);
  const fallback = getFallbackHoroscope(lang, dob, dateKey);

  const strictPrompt = `
${businessPrompt}

IMPORTANT RULES:
- Write only the final daily forecast text.
- No intro, no title, no day-number header, no bullets, no markdown.
- No AI phrases, no explanations, no extra commentary.
- Do not show "day number", "число дня", "күн саны", or "günün sayısı".
- Keep only forecast sentences and the advice line.
- Keep it compact: 260-380 characters if possible.
`.trim();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);
  let response: Response;

  try {
    response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: strictPrompt }] }],
        generationConfig: {
          temperature: 0.8,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 220,
        },
      }),
    });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw new Error(`Gemini horoscope failed: ${response.status}`);
  }

  const data = await response.json();

  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    fallback
  ).trim();
}

export default function TopCard({ theme, user }: { theme: Theme; user: User }) {
  const [horoscope, setHoroscope] = useState("");
  const [lang, setLang] = useState("en");
  const [loading, setLoading] = useState(true);

  const dateKey = useLocalDay();
  const dob = useMemo(
    () => user?.date_of_birth || "2000-01-01",
    [user?.date_of_birth],
  );
  const dateString = formatLocalDate(lang);

  const saveToStorage = useCallback(
    async (cacheKey: string, text: string, currentLang: string) => {
      const payload: HoroscopeCacheItem = {
        dateKey,
        lang: currentLang,
        dob,
        text,
        updatedAt: Date.now(),
      };

      await AsyncStorage.setItem(cacheKey, JSON.stringify(payload));
      await cleanupHoroscopeCache(cacheKey);
    },
    [dateKey, dob],
  );

  const loadHoroscope = useCallback(async () => {
    try {
      setLoading(true);

      const userLang = (await AsyncStorage.getItem("user_language")) || "en";
      setLang(userLang);

      const cacheKey = buildHoroscopeCacheKey(dateKey, userLang, dob);

      const saved = await AsyncStorage.getItem(cacheKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as HoroscopeCacheItem;
          if (
            parsed.dateKey === dateKey &&
            parsed.lang === userLang &&
            parsed.dob === dob &&
            parsed.text
          ) {
            setHoroscope(
              cleanHoroscopeText(
                parsed.text,
                getFallbackHoroscope(userLang, dob, dateKey),
              ),
            );
            await cleanupHoroscopeCache(cacheKey);
            return;
          }
        } catch {
          // ignore broken cache
        }
      }

      const newText = await fetchGeminiHoroscope(userLang, dateKey, dob);
      const cleaned = cleanHoroscopeText(
        newText,
        getFallbackHoroscope(userLang, dob, dateKey),
      );

      setHoroscope(cleaned);
      await saveToStorage(cacheKey, cleaned, userLang);
    } catch (err) {
      console.log("Horoscope load error:", err);

      let currentLang = "en";

      try {
        currentLang = (await AsyncStorage.getItem("user_language")) || currentLang;
      } catch (languageError) {
        console.log("Fallback language load error:", languageError);
      }

      const fallback = getFallbackHoroscope(currentLang, dob, dateKey);

      setLang(currentLang);
      setHoroscope(fallback);

      try {
        await saveToStorage(
          buildHoroscopeCacheKey(dateKey, currentLang, dob),
          fallback,
          currentLang,
        );
      } catch (storageError) {
        console.log("Fallback horoscope cache error:", storageError);
      }
    } finally {
      setLoading(false);
    }
  }, [dateKey, dob, saveToStorage]);

  useEffect(() => {
    loadHoroscope();
  }, [loadHoroscope]);

  return (
    <View
      style={{
        width: "100%",
        alignItems: "center",
        marginBottom: 14,
        marginTop: -14,
      }}
    >
      <View style={{ width: "90%", marginTop: 14 }}>
        <ImageBackground
          source={require("../../../assets/images/bg/bg-1.png")}
          resizeMode="cover"
          imageStyle={{ borderRadius: BORDER_RADIUS, opacity: 0.35 }}
          style={[
            styles.card,
            {
              backgroundColor: theme.cardBackground,
              shadowColor: theme.shadowColor,
              borderColor: useAlpha(theme.cardBackground, 0.12),
            },
          ]}
        >
          <TopCardHeader
            theme={theme}
            dateString={dateString}
            lang={lang}
            getTodayName={getTodayName}
          />

          {loading ? (
            <ActivityIndicator color={theme.accent} style={{ marginTop: 16 }} />
          ) : (
            <View style={{ marginTop: 8 }}>
              <MarkdownRender markdown={horoscope} textColor={theme.subtitle} />
            </View>
          )}
        </ImageBackground>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS,
    padding: 14,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    overflow: "hidden",
  },
});
