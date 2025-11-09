import { Theme } from "@/constants/theme";
import React from "react";
import { View } from "react-native";
import StepCircle from "./StepCircle";
import WeekDays from "./WeekDays";

const StepCounter = ({ theme }: { theme: Theme }) => {
  // usePushNotifications();

  return (
    <View style={{ alignItems: "center" }}>
      <View style={{ marginTop: -20 }}>
        <StepCircle value={5430} maxValue={10000} />
        <WeekDays theme={theme} />
      </View>
    </View>
  );
};

export default StepCounter;
