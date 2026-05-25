import { Theme } from "@/constants/theme";
import { Image, StyleSheet, Text, View } from "react-native";
import { fs } from "@/constants/typography";

export const TopCardHeader = ({
  theme,
  dateString,
  lang,
  getTodayName,
}: {
  theme: Theme;
  dateString?: string;
  lang: string;
  getTodayName: (lang: string) => string;
}) => {
  return (
    <View style={styles.cardContent}>
      <View style={styles.iconBox}>
        <View style={[styles.iconCircle]}>
          <Image
            source={require("../../../assets/images/bg/clever.png")}
            style={{ position: "absolute", width: 44, height: 44 }}
          />
        </View>
      </View>

      <View style={[styles.textBox, { marginTop: -7 }]}>
        <Text style={[styles.cardTitle, { color: theme.title }]}>
          {getTodayName(lang)}
        </Text>
        {dateString && (
          <Text style={{ color: theme.subtitle, marginTop: -10 }}>
            {dateString}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  },
  cardTitle: {
    fontSize: fs(18),
    fontWeight: "700",
    marginBottom: 10,
    paddingTop: 12,
  },
});
