import { Theme } from "@/constants/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAlpha } from "../SectionCard";

const TopCard = ({ theme }: { theme: Theme }) => {
  return (
    <View
      style={{
        width: "100%",
        alignItems: "center",
        marginBottom: 14,
        marginTop: -14,
      }}
    >
      <View
        style={{
          paddingHorizontal: 0,
          marginTop: 14,
          width: "90%",
          marginHorizontal: 20,
        }}
      >
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
              {/* Иконка с цветным фоном */}
              <View
                style={[
                  styles.iconCircle,
                  {
                    backgroundColor: useAlpha(theme.accent, 0.12),
                  },
                ]}
              >
                {React.isValidElement(
                  <MaterialIcons name="today" size={24} color="black" />
                )
                  ? React.cloneElement(
                      <MaterialIcons name="today" size={24} color="black" />,
                      {
                        color: theme.accent,
                      } as any
                    )
                  : null}
              </View>
            </View>

            <View style={styles.textBox}>
              <Text style={[styles.cardTitle, { color: theme.title }]}>
                Сегодня 31 октября 2025 г.
              </Text>
            </View>
          </View>
          <View style={{ marginTop: 8 }}>
            <Text
              style={[styles.cardDesc, { color: theme.subtitle }]}
              numberOfLines={6}
            >
              Сегодня по гороскопу вас ждет удача и успех во всех начинаниях. Не
              упустите возможность проявить себя!
            </Text>
            <Text
              style={[
                styles.cardDesc,
                { color: theme.subtitle, marginTop: -4 },
              ]}
              numberOfLines={6}
            >
              Ваше эмоциональное состояние сегодня будет стабильным, что
              позволит вам эффективно справляться с повседневными задачами.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    paddingRight: 0,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    paddingTop: 12,
  },
  cardDesc: {
    fontSize: 17,
    lineHeight: 18,
    marginBottom: 12,
  },
});

export default TopCard;
