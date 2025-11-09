import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface StepCircleProps {
  value: number;
  maxValue: number;
  size?: number;
  color?: string;
  backgroundColor?: string;
}

const StepCircle: React.FC<StepCircleProps> = ({
  value,
  maxValue,
  size = 240,
  color = "#3B82F6", // синий
  backgroundColor = "#1E293B", // темно-серый
}) => {
  const radius = size / 2 - 14;
  const strokeWidth = 22;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / maxValue, 1);

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 1000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [progress, animatedValue]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  // Анимация угла стрелки
  const rotate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const iconSize = 18;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Circle
          stroke={backgroundColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />

        <AnimatedCircle
          stroke={color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset as any}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      <Animated.View
        style={[
          styles.iconWrapper,
          {
            transform: [{ rotate }, { translateY: -(radius + iconSize / 2) }],
            marginTop: iconSize / 2 + 4,
          },
        ]}
      >
        <AntDesign name="arrow-right" size={iconSize} color="#F1F5F9" />
      </Animated.View>

      <View style={styles.center}>
        <Text style={styles.valueText}>{value}</Text>
        <Text style={styles.labelText}>
          / {maxValue}
          <Text style={{ fontSize: 14, color: "#94A3B8" }}>km</Text>
        </Text>
      </View>
    </View>
  );
};

// Animated Circle
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
    marginBottom: -30,
  },
  center: {
    position: "absolute",
    alignItems: "center",
  },
  iconWrapper: {
    position: "absolute",
    top: "50%",
    left: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  valueText: {
    fontSize: 36,
    fontWeight: "800",
    color: "#F1F5F9",
  },
  labelText: {
    fontSize: 16,
    color: "#94A3B8",
    marginTop: 4,
  },
});

export default StepCircle;
