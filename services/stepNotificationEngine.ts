export type StepNotificationLang = "ru" | "en" | "kz" | "tr";

export type AppNotificationType =
  | "STEPS_PROGRESS"
  | "STEPS_GOAL_REACHED"
  | "STEPS_OVER_GOAL"
  | "STEPS_LOW_ACTIVITY"
  | "FORECAST_ALERT";

export type StepNotificationContentKey =
  | "progress"
  | "near_goal"
  | "goal_reached"
  | "over_goal"
  | "low_activity_midday"
  | "low_activity_evening"
  | "forecast_alert";

export type StepNotificationMetadata = Record<
  string,
  string | number | boolean | null
>;

export type StepNotificationTimeOfDay =
  | "morning"
  | "midday"
  | "afternoon"
  | "evening"
  | "night";

export type StepNotificationProgressSnapshot = {
  dateKey: string;
  goalSteps: number;
  currentSteps: number;
  remainingSteps: number;
  progressRatio: number;
  progressPercent: number;
  hour: number;
  timeOfDay: StepNotificationTimeOfDay;
};

export type StepNotificationHistoryEntry = {
  type: AppNotificationType;
  sentAt: string;
  dedupeKey: string;
  progress: StepNotificationProgressSnapshot;
  metadata?: StepNotificationMetadata;
};

export type StepNotificationCandidate = {
  type: AppNotificationType;
  contentKey: StepNotificationContentKey;
  dedupeKey: string;
  progress: StepNotificationProgressSnapshot;
  metadata?: StepNotificationMetadata;
};

export type StepNotificationContext = {
  now: Date;
  goalSteps: number;
  currentSteps: number;
};

const STEP_PROGRESS_MILESTONES = [75, 50, 25];
const NEAR_GOAL_THRESHOLD = 90;
const OVER_GOAL_THRESHOLD = 120;

const LOW_ACTIVITY_WINDOWS = [
  {
    slot: "midday" as const,
    startHour: 11,
    endHour: 14,
    maxProgressPercent: 20,
  },
  {
    slot: "evening" as const,
    startHour: 17,
    endHour: 20,
    maxProgressPercent: 55,
  },
];

const pad = (value: number) => String(value).padStart(2, "0");

const formatDateKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const getTimeOfDay = (hour: number): StepNotificationTimeOfDay => {
  if (hour < 6) return "night";
  if (hour < 12) return "morning";
  if (hour < 15) return "midday";
  if (hour < 19) return "afternoon";
  if (hour < 23) return "evening";
  return "night";
};

const hasDedupeKey = (
  history: StepNotificationHistoryEntry[],
  dedupeKey: string,
) => history.some((entry) => entry.dedupeKey === dedupeKey);

const hasTypeForDate = (
  history: StepNotificationHistoryEntry[],
  type: AppNotificationType,
  dateKey: string,
) =>
  history.some(
    (entry) => entry.type === type && entry.progress.dateKey === dateKey,
  );

const getLowActivitySlot = (
  snapshot: StepNotificationProgressSnapshot,
): "midday" | "evening" | null => {
  for (const window of LOW_ACTIVITY_WINDOWS) {
    const withinWindow =
      snapshot.hour >= window.startHour && snapshot.hour < window.endHour;

    if (
      withinWindow &&
      snapshot.progressPercent < window.maxProgressPercent &&
      snapshot.currentSteps < snapshot.goalSteps
    ) {
      return window.slot;
    }
  }

  return null;
};

export const buildStepNotificationProgress = (
  context: StepNotificationContext,
): StepNotificationProgressSnapshot => {
  const goalSteps = Math.max(1, Math.round(context.goalSteps || 1));
  const currentSteps = Math.max(0, Math.round(context.currentSteps || 0));
  const progressRatio = currentSteps / goalSteps;
  const hour = context.now.getHours();

  return {
    dateKey: formatDateKey(context.now),
    goalSteps,
    currentSteps,
    remainingSteps: Math.max(goalSteps - currentSteps, 0),
    progressRatio,
    progressPercent: Math.floor(progressRatio * 100),
    hour,
    timeOfDay: getTimeOfDay(hour),
  };
};

export const evaluateStepNotification = (
  context: StepNotificationContext,
  history: StepNotificationHistoryEntry[],
): StepNotificationCandidate | null => {
  const progress = buildStepNotificationProgress(context);
  const dateKey = progress.dateKey;

  if (
    progress.progressPercent >= OVER_GOAL_THRESHOLD &&
    hasTypeForDate(history, "STEPS_GOAL_REACHED", dateKey)
  ) {
    const dedupeKey = `${dateKey}:STEPS_OVER_GOAL`;

    if (!hasDedupeKey(history, dedupeKey)) {
      return {
        type: "STEPS_OVER_GOAL",
        contentKey: "over_goal",
        dedupeKey,
        progress,
        metadata: {
          extraSteps: progress.currentSteps - progress.goalSteps,
          thresholdPercent: OVER_GOAL_THRESHOLD,
        },
      };
    }
  }

  if (progress.progressRatio >= 1) {
    const dedupeKey = `${dateKey}:STEPS_GOAL_REACHED`;

    if (!hasDedupeKey(history, dedupeKey)) {
      return {
        type: "STEPS_GOAL_REACHED",
        contentKey: "goal_reached",
        dedupeKey,
        progress,
      };
    }
  }

  if (
    progress.progressPercent >= NEAR_GOAL_THRESHOLD &&
    progress.progressRatio < 1
  ) {
    const dedupeKey = `${dateKey}:STEPS_PROGRESS:near_goal`;

    if (!hasDedupeKey(history, dedupeKey)) {
      return {
        type: "STEPS_PROGRESS",
        contentKey: "near_goal",
        dedupeKey,
        progress,
        metadata: {
          thresholdPercent: NEAR_GOAL_THRESHOLD,
        },
      };
    }
  }

  const highestReachedMilestone = STEP_PROGRESS_MILESTONES.find(
    (milestonePercent) => progress.progressPercent >= milestonePercent,
  );

  if (highestReachedMilestone) {
    const dedupeKey = `${dateKey}:STEPS_PROGRESS:milestone:${highestReachedMilestone}`;

    if (!hasDedupeKey(history, dedupeKey)) {
      return {
        type: "STEPS_PROGRESS",
        contentKey: "progress",
        dedupeKey,
        progress,
        metadata: {
          milestonePercent: highestReachedMilestone,
        },
      };
    }
  }

  const lowActivitySlot = getLowActivitySlot(progress);

  if (lowActivitySlot) {
    const dedupeKey = `${dateKey}:STEPS_LOW_ACTIVITY:${lowActivitySlot}`;

    if (!hasDedupeKey(history, dedupeKey)) {
      return {
        type: "STEPS_LOW_ACTIVITY",
        contentKey:
          lowActivitySlot === "midday"
            ? "low_activity_midday"
            : "low_activity_evening",
        dedupeKey,
        progress,
        metadata: {
          slot: lowActivitySlot,
        },
      };
    }
  }

  return null;
};
