import { GEMINI_API_URL, GEMINI_API_KEY } from "@/components/cards/ui/TopCard";
import {
  DataPromptValue,
  normalizeDailyForecastLang,
  type DailyForecastLang,
} from "./data";

const GEMINI_TIMEOUT_MS = 12000;
const CYRILLIC_RE = /[А-Яа-яЁёӘәҒғҚқҢңӨөҰұҮүҺһІі]/;
const RU_CYRILLIC_RE = /[А-Яа-яЁё]/;
const KZ_SPECIFIC_RE = /[ӘәҒғҚқҢңӨөҰұҮүҺһІі]/;
const LATIN_RE = /[A-Za-zÇçĞğİıÖöŞşÜü]/;

export const localizedBaseAffirmations: Record<
  DailyForecastLang,
  Record<number, string>
> = {
  ru: {
    1: "Я лидер своей жизни. Я действую уверенно и смело. Всё, к чему я прикасаюсь, наполняется успехом.",
    2: "Я в гармонии с собой и миром. Моя доброта и понимание создают вокруг меня атмосферу любви и доверия.",
    3: "Я позволяю своему свету сиять. Мои слова и идеи вдохновляют других. Я творю легко и радостно.",
    4: "Я строю свой успех шаг за шагом. Моя настойчивость приносит прочные результаты. Я спокоен и уверен в себе.",
    5: "Я открыт новому. Любые перемены ведут меня к лучшему. Я двигаюсь свободно, легко и с вдохновением.",
    6: "Моё сердце излучает любовь. Я создаю тепло, уют и гармонию в своей жизни и отношениях.",
    7: "Я слушаю голос своей интуиции. Мудрость уже внутри меня. Я спокоен, осознан и защищён.",
    8: "Я управляю своей энергией и своими ресурсами. Я создаю изобилие и уверенно достигаю своих целей.",
    9: "Я отпускаю прошлое с благодарностью. Очищая пространство, я открываю дорогу новому и лучшему.",
  },
  en: {
    1: "I lead my life with confidence and courage. Everything I touch moves toward success.",
    2: "I am in harmony with myself and the world. My kindness creates trust, warmth, and love around me.",
    3: "I let my light shine. My words and ideas inspire others, and I create with ease and joy.",
    4: "I build my success step by step. My persistence creates lasting results, and I feel calm and steady.",
    5: "I am open to the new. Every change guides me toward something better, and I move freely with inspiration.",
    6: "My heart radiates love. I create warmth, comfort, and harmony in my life and relationships.",
    7: "I listen to my intuition. Wisdom already lives within me, and I am calm, aware, and protected.",
    8: "I direct my energy and resources wisely. I create abundance and move confidently toward my goals.",
    9: "I release the past with gratitude. As I clear space, I welcome what is new and good.",
  },
  kz: {
    1: "Мен өмірімнің көшбасшысымын. Сенімді әрі батыл әрекет етемін, әр ісім сәттілікке жол ашады.",
    2: "Мен өзіммен және әлеммен үйлесімдемін. Мейірімім айналама сенім, жылулық және махаббат әкеледі.",
    3: "Мен ішкі нұрымды еркін жарқыратамын. Сөздерім мен идеяларым шабыт береді, шығармашылығым жеңіл ағады.",
    4: "Мен табысымды біртіндеп құрамын. Табандылығым берік нәтиже береді, өзімді сабырлы әрі сенімді сезінемін.",
    5: "Мен жаңалыққа ашықпын. Әр өзгеріс мені жақсылыққа жетелейді, еркін әрі шабытпен қозғаламын.",
    6: "Жүрегім махаббатқа толы. Өмірімде және қарым-қатынасымда жылулық, жайлылық пен үйлесім жасаймын.",
    7: "Мен ішкі түйсігімді тыңдаймын. Даналық менің ішімде, мен сабырлы, саналы және қорғалғанмын.",
    8: "Мен энергиям мен ресурстарымды ақылмен басқарамын. Молшылық жасап, мақсаттарыма сенімді жетемін.",
    9: "Мен өткенді ризашылықпен босатамын. Ішкі кеңістік ашылған сайын, жаңа әрі жақсы мүмкіндіктерді қабылдаймын.",
  },
  tr: {
    1: "Hayatımın lideriyim. Güvenle ve cesaretle hareket ederim; dokunduğum her şey başarıya yaklaşır.",
    2: "Kendimle ve dünyayla uyum içindeyim. Nezaketim çevremde güven, sıcaklık ve sevgi oluşturur.",
    3: "Işığımın parlamasına izin veriyorum. Sözlerim ve fikirlerim ilham verir; kolaylıkla ve neşeyle üretirim.",
    4: "Başarımı adım adım inşa ediyorum. Azmim kalıcı sonuçlar getirir; sakin ve kendimden eminim.",
    5: "Yeniliğe açığım. Her değişim beni daha iyi olana taşır; özgürce ve ilhamla ilerlerim.",
    6: "Kalbim sevgi yayar. Hayatımda ve ilişkilerimde sıcaklık, huzur ve uyum yaratırım.",
    7: "Sezgimin sesini dinliyorum. Bilgelik içimde; sakin, farkında ve güvendeyim.",
    8: "Enerjimi ve kaynaklarımı bilgece yönetirim. Bolluk yaratır ve hedeflerime güvenle ilerlerim.",
    9: "Geçmişi minnetle bırakıyorum. Alan açtıkça yeni ve güzel olanı hayatıma davet ediyorum.",
  },
};

export const baseAffirmations: Record<number, string> =
  localizedBaseAffirmations.ru;

export function getLocalAffirmation(num: number, lang: string = "ru") {
  const affirmationLang = normalizeDailyForecastLang(lang);
  const safeNumber = Number.isInteger(num) && num >= 1 && num <= 9 ? num : 1;

  return (
    localizedBaseAffirmations[affirmationLang]?.[safeNumber] ||
    localizedBaseAffirmations.ru[safeNumber] ||
    localizedBaseAffirmations.en[safeNumber]
  );
}

export function isAffirmationLanguageValid(text: string, lang: string = "ru") {
  const affirmationLang = normalizeDailyForecastLang(lang);

  switch (affirmationLang) {
    case "en":
    case "tr":
      return LATIN_RE.test(text) && !CYRILLIC_RE.test(text);
    case "kz":
      return KZ_SPECIFIC_RE.test(text);
    case "ru":
    default:
      return RU_CYRILLIC_RE.test(text) && !KZ_SPECIFIC_RE.test(text);
  }
}

export async function getDynamicAffirmation(num: number, lang: string = "ru") {
  const text = getLocalAffirmation(num, lang);

  const prompt = DataPromptValue(lang, text);
  const controller =
    typeof AbortController !== "undefined" ? new AbortController() : null;
  const timeoutId = controller
    ? setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS)
    : undefined;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller?.signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 120,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini affirmation failed: ${response.status}`);
    }

    const data = await response.json();
    const generated = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    return generated && isAffirmationLanguageValid(generated, lang)
      ? generated
      : text;
  } catch (error) {
    console.log("Dynamic affirmation fallback:", error);
    return text;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}
