import React from "react";
import { fs, lh } from "@/constants/typography";
import { Platform, View } from "react-native";
import Markdown from "react-native-markdown-display";

type Props = {
  markdown: string;
  textColor: string;
  textSize?: number;
  accentColor?: string;
};

const capitalizeFirst = (text: string) => {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const MarkdownRender = ({
  markdown,
  textColor,
  textSize = 16,
  accentColor = "#007AFF",
}: Props) => {
  const baseTextSize = fs(textSize);

  const markdownStyles = {
    body: {
      color: textColor,
      fontSize: baseTextSize,
      lineHeight: lh(textSize * 1.4),
    },
    heading1: {
      color: textColor,
      fontSize: fs(textSize * 1.6),
      lineHeight: lh(textSize * 1.6),
      fontWeight: "800" as const,
      marginTop: 24,
      marginBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: `${textColor}33`,
      paddingBottom: 8,
    },
    heading2: {
      color: textColor,
      fontSize: fs(textSize * 1.4),
      fontWeight: "700" as const,
      marginTop: 20,
      marginBottom: 10,
    },
    heading3: {
      color: textColor,
      fontSize: fs(textSize * 1.2),
      fontWeight: "600" as const,
      marginTop: 16,
      marginBottom: 8,
    },

    table: {
      borderWidth: 1,
      borderColor: `${textColor}44`,
      borderRadius: 6,
      marginVertical: 15,
      overflow: "hidden" as const,
    },
    thead: {
      backgroundColor: `${textColor}10`,
      borderBottomWidth: 2,
      borderBottomColor: `${textColor}44`,
    },
    th: {
      padding: 10,
      fontWeight: "bold" as const,
      color: textColor,
    },
    td: {
      padding: 10,
      color: textColor,
      borderBottomWidth: 1,
      borderBottomColor: `${textColor}15`,
    },
    tr: {
      borderBottomWidth: 0,
    },

    code_inline: {
      backgroundColor: `${textColor}15`,
      color: accentColor,
      fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
      borderRadius: 4,
      paddingHorizontal: 5,
    },
    fence: {
      backgroundColor: "#1e1e1e",
      color: "#efefef",
      fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
      padding: 15,
      borderRadius: 10,
      marginVertical: 10,
    },

    link: {
      color: accentColor,
      textDecorationLine: "underline" as const,
    },
    blockquote: {
      backgroundColor: `${accentColor}10`,
      borderLeftColor: accentColor,
      borderLeftWidth: 4,
      paddingHorizontal: 15,
      paddingVertical: 10,
      marginVertical: 10,
      borderRadius: 4,
    },
    hr: {
      backgroundColor: `${textColor}22`,
      height: 2,
      marginVertical: 20,
    },
  };

  return (
    <View style={{ flex: 1, width: "100%" }}>
      <Markdown style={markdownStyles}>{capitalizeFirst(markdown)}</Markdown>
    </View>
  );
};

export default MarkdownRender;
