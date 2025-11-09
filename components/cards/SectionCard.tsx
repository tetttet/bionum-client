// App.tsx
import { Theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const SectionCard: React.FC<{
  theme: Theme;
  sectionLabel: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  pillText: string;
}> = ({ theme, sectionLabel, icon, title, description, pillText }) => {
  return (
    <View
      style={{
        paddingHorizontal: 0,
        marginTop: 14,
        width: "90%",
        marginHorizontal: 20,
      }}
    >
      <TopHeader theme={theme} sectionLabel={sectionLabel} />

      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.cardBackground,
            shadowColor: theme.shadowColor,
            borderColor: useAlpha(theme.cardBackground, 0.12),
          },
        ]}
      >
        <View style={styles.cardContent}>
          <View style={styles.iconBox}>
            <View
              style={[
                styles.iconCircle,
                {
                  backgroundColor: useAlpha(theme.accent, 0.12),
                },
              ]}
            >
              {React.isValidElement(icon)
                ? React.cloneElement(
                    icon as React.ReactElement<any, any>,
                    {
                      color: theme.accent,
                    } as any
                  )
                : null}
            </View>
          </View>

          <View style={styles.textBox}>
            <Text style={[styles.cardTitle, { color: theme.title }]}>
              {title}
            </Text>
            <Text
              style={[styles.cardDesc, { color: theme.subtitle }]}
              numberOfLines={6}
            >
              {description}
            </Text>

            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.pill, { backgroundColor: theme.accent }]}
            >
              <Text style={[styles.pillText, { color: theme.pillText }]}>
                {pillText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export const TopHeader = ({
  theme,
  sectionLabel,
}: {
  theme: Theme;
  sectionLabel: string;
}) => {
  return (
    <View style={styles.sectionLabelRow}>
      <Text style={[styles.sectionLabel, { color: theme.sectionLabel }]}>
        {sectionLabel}
      </Text>
      <TouchableOpacity style={styles.closeButton} activeOpacity={0.6}>
        <Ionicons name="close" size={18} color={theme.sectionLabel} />
      </TouchableOpacity>
    </View>
  );
};

export const TopHeaderWithOutDel = ({
  theme,
  sectionLabel,
}: {
  theme: Theme;
  sectionLabel: string;
}) => {
  return (
    <View style={[styles.sectionLabelRow, { marginBottom: 16 }]}>
      <Text style={[styles.sectionLabel, { color: theme.sectionLabel }]}>
        {sectionLabel}
      </Text>
    </View>
  );
};

/* ---------- Helpers & styles ---------- */

export const useAlpha = (hex: string, alpha: number) => {
  // simple rgba from hex fallback
  if (hex.startsWith("rgba") || hex.startsWith("rgb")) return hex;
  const sanitized = hex.replace("#", "");
  if (sanitized.length !== 6) return hex;
  const r = parseInt(sanitized.slice(0, 2), 16);
  const g = parseInt(sanitized.slice(2, 4), 16);
  const b = parseInt(sanitized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const styles = StyleSheet.create({
  sectionLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    alignItems: "center",
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
  closeButton: {
    padding: 6,
    borderRadius: 8,
  },

  card: {
    borderRadius: 18,
    padding: 14,
    // shadow (iOS)
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    // elevation (Android)
    elevation: 4,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardContent: {
    flexDirection: "row",
  },
  iconBox: {
    width: 56,
    alignItems: "center",
    justifyContent: "flex-start",
    marginRight: 8,
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
    paddingRight: 6,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  pill: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pillText: {
    fontSize: 14,
    fontWeight: "700",
  },
});

export default SectionCard;
