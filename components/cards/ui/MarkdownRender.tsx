import React from "react";
import { Text, View } from "react-native";

type Props = {
  markdown: string;
  textColor: string;
};

const MarkdownRender = ({ markdown, textColor }: Props) => {
  if (!markdown)
    return <Text style={{ color: textColor }}>No content available.</Text>;

  // Разделяем по пустым строкам
  const blocks = markdown.trim().split(/\n\s*\n/);

  return (
    <View>
      {blocks.map((block, i) => {
        // ===== HEADINGS =====
        if (/^#{1,3}\s/.test(block)) {
          const level = block.match(/^#{1,3}/)?.[0].length ?? 1;
          const content = block.replace(/^#{1,3}\s*/, "");
          const size = level === 1 ? 24 : level === 2 ? 20 : 18;
          const marginTop = level === 1 ? 16 : 12;

          return (
            <Text
              key={i}
              style={{
                fontSize: size,
                fontWeight: "700",
                marginTop,
                marginBottom: 6,
                color: textColor,
              }}
            >
              {content}
            </Text>
          );
        }

        // ===== LISTS =====
        if (/^[\-\*]\s+/m.test(block)) {
          const items = block
            .split(/\n/)
            .map((line) => line.replace(/^[\-\*]\s+/, ""));
          return (
            <View key={i} style={{ marginVertical: 6 }}>
              {items.map((item, idx) => (
                <View
                  key={idx}
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    marginBottom: 4,
                  }}
                >
                  <Text
                    style={{
                      color: textColor,
                      fontSize: 18,
                      lineHeight: 22,
                      marginRight: 6,
                    }}
                  >
                    •
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 16,
                      lineHeight: 22,
                      color: textColor,
                    }}
                  >
                    {renderInline(item, textColor)}
                  </Text>
                </View>
              ))}
            </View>
          );
        }

        // ===== PARAGRAPHS =====
        return (
          <Text
            key={i}
            style={{
              fontSize: 16,
              lineHeight: 22,
              marginBottom: 8,
              color: textColor,
            }}
          >
            {renderInline(block, textColor)}
          </Text>
        );
      })}
    </View>
  );
};

// ==== INLINE FORMATTING (bold, italic) ====
function renderInline(text: string, textColor: string) {
  const tokens = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);

  return tokens.map((token, i) => {
    if (/^\*\*[^*]+\*\*$/.test(token)) {
      return (
        <Text key={i} style={{ fontWeight: "700", color: textColor }}>
          {token.replace(/\*\*/g, "")}
        </Text>
      );
    }
    if (/^\*[^*]+\*$/.test(token)) {
      return (
        <Text key={i} style={{ fontStyle: "italic", color: textColor }}>
          {token.replace(/\*/g, "")}
        </Text>
      );
    }
    return <Text key={i}>{token}</Text>;
  });
}

export default MarkdownRender;
