import { Dimensions } from "react-native";

export const { width } = Dimensions.get("window");
export const CARD_WIDTH = Math.min(360, width - 32);
export const CARD_HEIGHT = 176;
export const BORDER_RADIUS = 16;

export const languages = [
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
  { code: "kz", label: "Қазақша" },
  { code: "tr", label: "Türkçe" },
];

export const LANGUAGE_KEY = "user_language";
export const PRIVACY_POLICY_CONSENT_KEY = "privacy_policy_consent";
