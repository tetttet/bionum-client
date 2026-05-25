import { useEffect, useState } from "react";
import { AppState } from "react-native";

import {
  getMillisecondsUntilNextLocalMidnight,
  getTodayDateKey,
} from "@/utils/localDay";

export function useLocalDay() {
  const [dateKey, setDateKey] = useState(() => getTodayDateKey());

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const syncDateKey = () => {
      setDateKey(getTodayDateKey());
    };

    const scheduleNextSync = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        syncDateKey();
        scheduleNextSync();
      }, getMillisecondsUntilNextLocalMidnight() + 1000);
    };

    syncDateKey();
    scheduleNextSync();

    const subscription = AppState.addEventListener("change", (state) => {
      if (state !== "active") return;

      syncDateKey();
      scheduleNextSync();
    });

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      subscription.remove();
    };
  }, []);

  return dateKey;
}
