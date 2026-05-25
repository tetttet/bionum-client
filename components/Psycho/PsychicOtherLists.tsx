import { StyleSheet, Text, View } from "react-native";
import { Theme } from "@/constants/theme";
import { fs, lh } from "@/constants/typography";

export const PsychicOtherLists = ({ theme }: { theme: Theme }) => {
  return (
    <View>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: theme.title,
          },
        ]}
      >
        Психоматрица
      </Text>

      <Text
        style={[
          styles.sectionDescription,
          {
            color: theme.subtitle,
          },
        ]}
      >
        Здесь будет детальный разбор психоматрицы: сильные стороны, зоны роста,
        потенциал и рекомендации. Можно вывести числа, расшифровки и подсказки
        для пользователя.
      </Text>

      <View
        style={[
          styles.card,
          {
            borderColor: theme.subtitle,
          },
        ]}
      >
        <Text
          style={[
            styles.cardTitle,
            {
              color: theme.title,
            },
          ]}
        >
          Пример блока психоматрицы
        </Text>
        <Text
          style={[
            styles.cardText,
            {
              color: theme.text,
            },
          ]}
        >
          Добавь сюда свои данные: значения квадратов, интерпретации и советы.
          Карточка сделана воздушной и аккуратной — можешь дублировать её для
          других блоков.
        </Text>
      </View>
    </View>
  );
};

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  /* PsychicOtherLists */
  sectionTitle: {
    fontSize: fs(18),
    fontWeight: "800",
    marginBottom: 6,
  },
  sectionDescription: {
    fontSize: fs(14),
    lineHeight: lh(20),
    marginBottom: 12,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginTop: 4,
    opacity: 0.96,
  },
  cardTitle: {
    fontSize: fs(15),
    fontWeight: "700",
    marginBottom: 6,
  },
  cardText: {
    fontSize: fs(14),
    lineHeight: lh(20),
  },
});
