import React from "react";
import {
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import LogoText from "../cards/ui/LogoText";
import Lang from "./Lang";

const Header: React.FC<any> = ({ theme }) => {
  const [langOpen, setLangOpen] = React.useState(false);

  return (
    <View
      style={{
        width: "100%",
        backgroundColor: theme.background,
        position: "relative",
      }}
    >
      <ImageBackground
        source={require("../../assets/images/header-copy.png")}
        resizeMode="cover"
        style={[
          styles.headerBackground,
          { backgroundColor: "rgba(217, 236, 250, 0.95)" },
        ]}
        imageStyle={styles.headerImage}
      >
        <View style={styles.overlay} />

        <View style={styles.headerInner}>
          <LogoText theme={theme} />

          <View style={styles.headerRight}>
            <Lang.Button open={langOpen} setOpen={setLangOpen} />
          </View>
        </View>
      </ImageBackground>

      <Lang.Dropdown open={langOpen} onClose={() => setLangOpen(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerBackground: {
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) : 78,
    paddingBottom: 28,
    borderRadius: 28,
    overflow: "hidden",
    position: "relative",
  },
  headerImage: {
    borderRadius: 28,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.12)",
    borderRadius: 28,
  },
  headerInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    zIndex: 2,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default Header;
