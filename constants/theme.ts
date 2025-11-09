/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export type Theme = {
  background: string;
  pageGradient: readonly [string, string, ...string[]];
  pageGradient2: readonly [string, string, ...string[]];
  title: string;
  subtitle: string;
  cardBackground: string;
  primary: string;
  summaryCardBackground: string;
  sectionLabel: string;
  accent: string;
  pillText: string;
  avatarBackground: string;
  ModalBackground: string;
  shadowColor: string;
  mainTitle: string;
  text: string;
  healthCardTheme: {
    background: string;
    border: string;
    card: string;
    muted: string;
    text: string;
    subText: string;
    accent: string;
    bar: string;
  };
};

// export const buildTheme = (dark: boolean): Theme =>
//   dark
//     ? {
//         background: "#000000",
//         primary: "#1E1E1E",
//         // pageGradient: ["#4b2b6e", "#341c3dff", "#512801ff", "#241200ff"],
//         pageGradient: ["#433d95", "#573c7b", "#6b3a58", "#682a27"],
//         pageGradient2: ["#682a27", "#6b3a58", "#573c7b", "#433d95"],
//         title: "#FFFFFF",
//         subtitle: "#BFBFBF",
//         cardBackground: "rgba(255,255,255,0.05)",
//         summaryCardBackground: "rgba(255,255,255,0.1)",
//         sectionLabel: "#9A9A9A",
//         accent: "#1083FF",
//         pillText: "#FFFFFF",
//         avatarBackground: "#2b2b2b",
//         ModalBackground: "#1c1c1e",
//         shadowColor: "#000000",
//         mainTitle: "#FFFFFF",
//         text: "#FFFFFF",
//         healthCardTheme: {
//           background: "#0d0d0d",
//           border: "rgba(255,255,255,0.05)",
//           card: "#111214",
//           muted: "#8a8a8a",
//           text: "#ffffff",
//           subText: "#cfcfcf",
//           accent: "#ff6a2e", // orange
//           bar: "#3a3a3a",
//         },
//       }
//     : {
//         background: "#F2F5F8",
//         primary: "#FFFFFF",
//         pageGradient: ["#433d95", "#573c7b", "#6b3a58", "#682a27"],
//         pageGradient2: ["#682a27", "#6b3a58", "#573c7b", "#433d95"],
//         title: "#111827",
//         subtitle: "#4B5563",
//         cardBackground: "#FFFFFF",
//         summaryCardBackground: "#eeeeee",
//         sectionLabel: "#6B7280",
//         ModalBackground: "#eeeeee",
//         accent: "#0B76FF",
//         pillText: "#FFFFFF",
//         avatarBackground: "#E6EEF9",
//         shadowColor: "#000000",
//         mainTitle: "white",
//         text: "#000000",
//         healthCardTheme: {
//           background: "#ffffff",
//           border: "rgba(0,0,0,0.05)",
//           card: "#f4f4f5",
//           muted: "#666666",
//           text: "#0b0b0b",
//           subText: "#4b4b4b",
//           accent: "#ff6a2e",
//           bar: "#d8d8d8",
//         },
//       };

export const buildTheme = (dark: boolean): Theme =>
  dark
    ? {
        background: "#000000",
        primary: "#1E1E1E",
        // pageGradient: ["#4b2b6e", "#341c3dff", "#512801ff", "#241200ff"],
        pageGradient: ["#433d95", "#573c7b", "#6b3a58", "#682a27"],
        pageGradient2: ["#682a27", "#6b3a58", "#573c7b", "#433d95"],
        title: "#FFFFFF",
        subtitle: "#BFBFBF",
        cardBackground: "rgba(255,255,255,0.05)",
        summaryCardBackground: "rgba(255,255,255,0.1)",
        sectionLabel: "#9A9A9A",
        accent: "#1083FF",
        pillText: "#FFFFFF",
        avatarBackground: "#2b2b2b",
        ModalBackground: "#1c1c1e",
        shadowColor: "#000000",
        mainTitle: "#FFFFFF",
        text: "#FFFFFF",
        healthCardTheme: {
          background: "#0d0d0d",
          border: "rgba(255,255,255,0.05)",
          card: "#111214",
          muted: "#8a8a8a",
          text: "#ffffff",
          subText: "#cfcfcf",
          accent: "#ff6a2e", // orange
          bar: "#3a3a3a",
        },
      }
    : {
        background: "#000000",
        primary: "#1E1E1E",
        // pageGradient: ["#4b2b6e", "#341c3dff", "#512801ff", "#241200ff"],
        pageGradient: ["#433d95", "#573c7b", "#6b3a58", "#682a27"],
        pageGradient2: ["#682a27", "#6b3a58", "#573c7b", "#433d95"],
        title: "#FFFFFF",
        subtitle: "#BFBFBF",
        cardBackground: "rgba(255,255,255,0.05)",
        summaryCardBackground: "rgba(255,255,255,0.1)",
        sectionLabel: "#9A9A9A",
        accent: "#1083FF",
        pillText: "#FFFFFF",
        avatarBackground: "#2b2b2b",
        ModalBackground: "#1c1c1e",
        shadowColor: "#000000",
        mainTitle: "#FFFFFF",
        text: "#FFFFFF",
        healthCardTheme: {
          background: "#0d0d0d",
          border: "rgba(255,255,255,0.05)",
          card: "#111214",
          muted: "#8a8a8a",
          text: "#ffffff",
          subText: "#cfcfcf",
          accent: "#ff6a2e", // orange
          bar: "#3a3a3a",
        },
      };

// export const buildTheme = (dark: boolean): Theme =>
//   dark
//     ? {
//         background: "#F2F5F8",
//         pageGradient: ["#433d95", "#573c7b", "#6b3a58", "#682a27"],
//         pageGradient2: ["#682a27", "#6b3a58", "#573c7b", "#433d95"],
//         title: "#111827",
//         subtitle: "#4B5563",
//         cardBackground: "#FFFFFF",
//         summaryCardBackground: "#eeeeee",
//         sectionLabel: "#6B7280",
//         ModalBackground: "#eeeeee",
//         accent: "#0B76FF",
//         pillText: "#FFFFFF",
//         avatarBackground: "#E6EEF9",
//         shadowColor: "#000000",
//         mainTitle: "white",
//         text: "#000000",
//         healthCardTheme: {
//           background: "#ffffff",
//           border: "rgba(0,0,0,0.05)",
//           card: "#f4f4f5",
//           muted: "#666666",
//           text: "#0b0b0b",
//           subText: "#4b4b4b",
//           accent: "#ff6a2e",
//           bar: "#d8d8d8",
//         },
//       }
//     : {
//         background: "#F2F5F8",
//         pageGradient: ["#433d95", "#573c7b", "#6b3a58", "#682a27"],
//         pageGradient2: ["#682a27", "#6b3a58", "#573c7b", "#433d95"],
//         title: "#111827",
//         subtitle: "#4B5563",
//         cardBackground: "#FFFFFF",
//         summaryCardBackground: "#eeeeee",
//         sectionLabel: "#6B7280",
//         ModalBackground: "#eeeeee",
//         accent: "#0B76FF",
//         pillText: "#FFFFFF",
//         avatarBackground: "#E6EEF9",
//         shadowColor: "#000000",
//         mainTitle: "white",
//         text: "#000000",
//         healthCardTheme: {
//           background: "#ffffff",
//           border: "rgba(0,0,0,0.05)",
//           card: "#f4f4f5",
//           muted: "#666666",
//           text: "#0b0b0b",
//           subText: "#4b4b4b",
//           accent: "#ff6a2e",
//           bar: "#d8d8d8",
//         },
//       };

export const healthCardTheme = {
  dark: {
    background: "#0d0d0d",
    border: "rgba(255,255,255,0.05)",
    card: "#111214",
    muted: "#8a8a8a",
    text: "#ffffff",
    subText: "#cfcfcf",
    accent: "#ff6a2e", // orange
    bar: "#3a3a3a",
  },
  light: {
    background: "#ffffff",
    border: "rgba(0,0,0,0.05)",
    card: "#f4f4f5",
    muted: "#666666",
    text: "#0b0b0b",
    subText: "#4b4b4b",
    accent: "#ff6a2e",
    bar: "#d8d8d8",
  },
};

export type ThemeType = "dark" | "light";
