import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

// ---------- ArticleCard + Screen ----------
import { Theme } from "@/constants/theme";
import { AuthContext } from "@/context/AuthContext";
import {
  getPortraitByNumber,
  type PortraitItem,
  type PortraitLang,
} from "@/data/dummy/portrait";
import BottomSheet from "../cards/BottomSheet";
import { TopHeaderWithOutDel } from "../cards/SectionCard";
import MarkdownRender from "../cards/ui/MarkdownRender";
import CloseGlassButton from "../ui/close-glass-button";
import FastImageDemo from "../ui/fast-image-demo";
import { getDateParts } from "@/utils/_func";
import { fs, lh } from "@/constants/typography";

export type Article = {
  id: string;
  title: string;
  subtitle: string;
  markdown?: string;
  image: any;
};

export const sampleArticles: Article[] = [
  {
    id: "2",
    title: "Совместимость по числам",
    subtitle: "Как энергия дат рождения влияет на отношения и любовь",
    markdown: `
# Совместимость по числам

(Контент пока статичный. Можно позже тоже сделать персонализированным.)

# Введение

Числа дат рождения могут многое рассказать о совместимости людей в отношениях. Понимание этих чисел помогает глубже понять динамику между партнёрами и выявить сильные и слабые стороны их взаимодействия.

# Основные принципы совместимости

1. **Энергетические вибрации**: Каждое число несёт определённую вибрацию, которая влияет на личность человека. Совместимость часто определяется тем, насколько гармонично эти вибрации взаимодействуют друг с другом.

2. **Стихии чисел**: Числа можно классифицировать по стихиям (огонь, земля, воздух, вода). Люди с числами одной стихии обычно лучше понимают друг друга.

3. **Кармические связи**: Некоторые числа указывают на кармические уроки, которые пары должны пройти вместе. Понимание этих уроков может помочь укрепить отношения.

`,
    image: require("../../assets/images/articles/together.jpg"),
  },
  {
    id: "3",
    title: "Кармический жизненный код",
    subtitle: "О чем рассказывает число вашей судьбы",
    markdown: `
# Кармический жизненный код
(Контент пока статичный. Можно позже тоже сделать персонализированным.)

# Понимание жизненного кода

Жизненный код — это число, полученное из вашей полной даты рождения, которое раскрывает основные черты вашей личности, жизненные цели и кармические задачи. Этот код помогает понять, какие уроки вам предстоит усвоить в этой жизни.

# Как вычислить жизненный код   
Чтобы вычислить свой жизненный код, сложите все цифры вашей даты рождения до тех пор, пока не получите однозначное число. Например, для даты 15.08.1990:
1 + 5 + 0 + 8 + 1 + 9 + 9 + 0 = 33
3 + 3 = 6

Таким образом, жизненный код для этой даты рождения — 6.

# Значение жизненного кода

- **1**: Лидерство, независимость, новаторство.
- **2**: Сотрудничество, дипломатия, чувствительность.
- **3**: Творчество, общительность, оптимизм.
- **4**: Практичность, стабильность, трудолюбие.
- **5**: Свобода, приключения, адаптивность.
- **6**: Ответственность, забота, гармония.
- **7**: Аналитичность, духовность, интроспекция.
- **8**: Амбиции, власть, материальный успех.
- **9**: Гуманизм, сострадание, идеализм.
    `,
    image: require("../../assets/images/articles/lifecode.jpeg"),
  },
  {
    id: "4",
    title: "Предназначение",
    subtitle: "Как найти своё место и реализовать потенциал",
    markdown: `
# Предназначение и путь души

(Контент пока статичный. Можно позже тоже сделать персонализированным.)
# Введение

Понимание своего предназначения и пути души — важный аспект личностного роста и самореализации. Это помогает найти смысл жизни, определить цели и направить энергию в нужное русло.

# Как найти своё предназначение

1. **Самоанализ**: Размышляйте о своих интересах, талантах и ценностях. Что приносит вам радость и удовлетворение?

2. **Обратная связь**: Слушайте мнения близких людей. Иногда окружающие могут видеть в нас то, что мы сами не замечаем.

3. **Эксперименты**: Пробуйте новые виды деятельности и роли. Это поможет выявить скрытые таланты и интересы.

4. **Интуиция**: Доверяйте своим внутренним ощущениям и предчувствиям. Часто они указывают на правильный путь.
`,
    image: require("../../assets/images/articles/future.jpg"),
  },
];

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const HORIZONTAL_PADDING = 20;
const CARD_WIDTH = SCREEN_W - HORIZONTAL_PADDING * 2;
const CARD_ASPECT = 16 / 9;
const IMAGE_HEIGHT = CARD_WIDTH / CARD_ASPECT;

export interface User {
  id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  date_of_birth?: string; // ожидаем строку, например "1990-05-17"
}

export default function SummaryScreen({ theme }: { theme: Theme }) {
  const colorScheme = useColorScheme();
  const { user } = useContext(AuthContext) as { user: User | null };
  const [selected, setSelected] = useState<Article | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  const [lang, setLang] = useState<PortraitLang>("ru" as PortraitLang);
  const [, setPortrait] = useState<PortraitItem | null>(null);

  // 1) Берём язык из AsyncStorage
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const storedLang = await AsyncStorage.getItem("user_language");
        if (storedLang && mounted) {
          setLang(storedLang as PortraitLang);
        }
      } catch (e) {
        console.warn("Failed to load user_language from AsyncStorage", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // 2) Считаем день рождения и берём соответствующий портрет
  useEffect(() => {
    if (!user?.date_of_birth) {
      setPortrait(null);
      return;
    }

    try {
      const dob = getDateParts(user.date_of_birth);
      if (!dob) {
        setPortrait(null);
        return;
      }

      const day = dob.day; // 1–31

      if (!Number.isFinite(day) || day < 1 || day > 31) {
        setPortrait(null);
        return;
      }

      const p = getPortraitByNumber(lang, day);
      setPortrait(p || null);
    } catch (e) {
      console.warn("Failed to parse date_of_birth for portrait", e);
      setPortrait(null);
    }
  }, [user?.date_of_birth, lang]);

  // 3) Формируем динамический markdown для первой статьи ("Портрет личности")
  const articles = useMemo<Article[]>(() => {
    const base = [...sampleArticles];
    return base;
  }, []);

  function openArticle(a: Article) {
    setSelected(a);
    setSheetVisible(true);
  }

  function closeSheet() {
    setSheetVisible(false);
    setTimeout(() => setSelected(null), 300);
  }

  return (
    <View style={[{ backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        style={{ marginTop: -40 }}
      >
        <TopHeaderWithOutDel theme={theme} sectionLabel={"ПОЛЕЗНЫЕ СТАТЬИ"} />

        <View style={[styles.list, { marginTop: 1 }]}>
          {articles.map((a) => (
            <TouchableOpacity
              key={a.id}
              activeOpacity={0.85}
              style={[
                styles.card,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.summaryCardBackground,
                },
              ]}
              onPress={() => openArticle(a)}
              accessibilityRole="button"
              accessibilityLabel={`${a.title}. ${a.subtitle}`}
            >
              <Image source={a.image} style={styles.image} resizeMode="cover" />

              <View
                style={[
                  styles.textWrap,
                  { backgroundColor: theme.summaryCardBackground },
                ]}
              >
                <Text
                  numberOfLines={2}
                  style={[styles.title, { color: theme.title }]}
                >
                  {a.title}
                </Text>
                <Text
                  numberOfLines={2}
                  style={[styles.subtitle, { color: theme.subtitle }]}
                >
                  {a.subtitle}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 48 }} />
      </ScrollView>

      {/* Bottom sheet */}
      <BottomSheet
        visible={sheetVisible}
        onClose={closeSheet}
        snapPoint={SCREEN_H * 0.95}
      >
        {selected ? (
          <View
            style={[
              styles.modalRoot,
              { backgroundColor: theme.ModalBackground },
            ]}
          >
            <View>
              <View
                style={{
                  paddingTop: 20,
                  paddingHorizontal: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={[styles.modalTitle, { color: theme.title }]}>
                  {selected.title}
                </Text>
              </View>
              <CloseGlassButton closeSheet={closeSheet} />
            </View>

            <FastImageDemo source={selected.image} />

            {/* Content and Dropdown */}
            <View style={styles.modalContent}>
              <Text style={[styles.modalTitleBigger, { color: theme.title }]}>
                {selected.title}
              </Text>
              <Text style={[styles.modalSubtitle, { color: theme.subtitle }]}>
                {selected.subtitle}
              </Text>

              <MarkdownRender
                markdown={selected.markdown || ""}
                textColor={theme.text}
              />

              <View style={{ height: 32 }} />
            </View>
          </View>
        ) : null}
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 14,
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  sectionTitle: { fontSize: fs(22), fontWeight: "700", marginBottom: 12 },
  list: { gap: 16 as any },
  card: {
    width: CARD_WIDTH,
    alignSelf: "center",
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 4 },
    }),
  },
  image: { width: "100%", height: IMAGE_HEIGHT },
  textWrap: { paddingHorizontal: 16, paddingVertical: 14 },
  title: { fontSize: fs(20), fontWeight: "800", marginBottom: 6 },
  subtitle: { fontSize: fs(14), lineHeight: lh(18) },

  modalRoot: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: "hidden",
  },

  modalContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  modalTitle: { fontSize: fs(18), fontWeight: "800", marginBottom: 6 },
  modalTitleBigger: {
    fontSize: fs(20),
    fontWeight: "800",
    marginBottom: 6,
    width: "80%",
  },
  modalSubtitle: { fontSize: fs(14), lineHeight: lh(20), marginBottom: 6 },
});
