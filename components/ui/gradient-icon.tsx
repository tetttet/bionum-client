import React from "react";
import { View } from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

const GradientIcon = () => {
  return (
    <View style={{ flexDirection: "row", gap: -20 }}>
      <View style={{ marginTop: 6 }}>
        <Svg width={54} height={54} viewBox="0 0 24 24">
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#7b5cff" />
              <Stop offset="1" stopColor="#ff6fcf" />
            </LinearGradient>
          </Defs>
          <Path
            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67
         0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            fill="url(#grad)"
          />
        </Svg>
      </View>
      <View style={{ marginLeft: -38, zIndex: 1 }}>
        <Svg width={68} height={68} viewBox="0 0 24 24">
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#7b5cff" />
              <Stop offset="1" stopColor="#ff6fcf" />
            </LinearGradient>
          </Defs>
          <Path
            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67
         0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            fill="url(#grad)"
          />
        </Svg>
      </View>
    </View>
  );
};

export default GradientIcon;
