import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export type NotificationLang = "ru" | "en" | "kz" | "tr";

export const APP_NOTIFICATION_CHANNEL_ID = "daily-reminders";

type NotificationPayload = Record<
  string,
  string | number | boolean | null | undefined
>;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const normalizeNotificationLang = (
  lang?: string | null,
): NotificationLang => {
  if (lang === "ru" || lang === "en" || lang === "kz" || lang === "tr") {
    return lang;
  }

  return "en";
};

export const ensureNotificationPermission = async () => {
  const settings = await Notifications.getPermissionsAsync();

  if (
    settings.granted ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  ) {
    return true;
  }

  const requested = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  });

  return (
    requested.granted ||
    requested.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
};

export const ensureAppNotificationChannel = async () => {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync(APP_NOTIFICATION_CHANNEL_ID, {
    name: "BioNum reminders",
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 150, 250],
    lightColor: "#2982DA",
  });
};

export const scheduleLocalNotification = async ({
  title,
  body,
  data,
  triggerDate,
}: {
  title: string;
  body: string;
  data?: NotificationPayload;
  triggerDate: Date;
}) => {
  return Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      data,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
      channelId:
        Platform.OS === "android" ? APP_NOTIFICATION_CHANNEL_ID : undefined,
    },
  });
};

export const sendImmediateLocalNotification = async ({
  title,
  body,
  data,
}: {
  title: string;
  body: string;
  data?: NotificationPayload;
}) =>
  scheduleLocalNotification({
    title,
    body,
    data,
    triggerDate: new Date(Date.now() + 1000),
  });
