import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pedometer } from "expo-sensors";

import { LANGUAGE_KEY } from "@/constants/params";
import {
  ensureAppNotificationChannel,
  ensureNotificationPermission,
  normalizeNotificationLang,
  sendImmediateLocalNotification,
} from "@/services/notificationCenter";
import {
  DEFAULT_DAILY_STEP_GOAL,
  getStartOfDay,
  loadStoredTodayStats,
  saveTodayStats,
} from "@/services/stepStats";

import {
  evaluateStepNotification,
  type StepNotificationHistoryEntry,
} from "./stepNotificationEngine";
import { buildStepNotificationContent } from "./stepNotificationText";

type StepNotificationHistoryStore = {
  version: number;
  entries: StepNotificationHistoryEntry[];
};

type ResolvedStepProgress = {
  currentSteps: number;
  source: "provided" | "pedometer" | "storage";
};

export type StepNotificationSyncOptions = {
  lang?: string | null;
  goalSteps?: number;
  currentSteps?: number;
  now?: Date;
};

export type StepNotificationSyncResult =
  | {
      status: "sent";
      lang: string;
      type: string;
      currentSteps: number;
    }
  | {
      status:
        | "no_candidate"
        | "permission_denied"
        | "missing_progress"
        | "error";
      lang: string;
      currentSteps?: number;
    };

const STEP_NOTIFICATION_HISTORY_KEY = "notifications:step-history:v1";
const STEP_NOTIFICATION_HISTORY_VERSION = 1;
const STEP_NOTIFICATION_HISTORY_LIMIT = 120;
const STEP_NOTIFICATION_RETENTION_DAYS = 45;
const DAY_MS = 24 * 60 * 60 * 1000;

let syncChain: Promise<unknown> = Promise.resolve();

const isObjectRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const isValidHistoryEntry = (
  value: unknown,
): value is StepNotificationHistoryEntry => {
  if (!isObjectRecord(value) || !isObjectRecord(value.progress)) {
    return false;
  }

  return (
    typeof value.type === "string" &&
    typeof value.sentAt === "string" &&
    typeof value.dedupeKey === "string" &&
    typeof value.progress.dateKey === "string" &&
    typeof value.progress.goalSteps === "number" &&
    typeof value.progress.currentSteps === "number" &&
    typeof value.progress.remainingSteps === "number" &&
    typeof value.progress.progressRatio === "number" &&
    typeof value.progress.progressPercent === "number" &&
    typeof value.progress.hour === "number" &&
    typeof value.progress.timeOfDay === "string"
  );
};

const pruneHistoryEntries = (
  entries: StepNotificationHistoryEntry[],
  now: Date,
) => {
  const minTimestamp = now.getTime() - STEP_NOTIFICATION_RETENTION_DAYS * DAY_MS;

  return entries
    .filter((entry) => {
      const sentAt = new Date(entry.sentAt).getTime();

      return Number.isFinite(sentAt) && sentAt >= minTimestamp;
    })
    .slice(-STEP_NOTIFICATION_HISTORY_LIMIT);
};

const readHistoryStore = async (): Promise<StepNotificationHistoryStore> => {
  try {
    const raw = await AsyncStorage.getItem(STEP_NOTIFICATION_HISTORY_KEY);

    if (!raw) {
      return {
        version: STEP_NOTIFICATION_HISTORY_VERSION,
        entries: [],
      };
    }

    const parsed = JSON.parse(raw) as Partial<StepNotificationHistoryStore>;
    const entries = Array.isArray(parsed.entries)
      ? parsed.entries.filter(isValidHistoryEntry)
      : [];

    return {
      version:
        parsed.version === STEP_NOTIFICATION_HISTORY_VERSION
          ? parsed.version
          : STEP_NOTIFICATION_HISTORY_VERSION,
      entries,
    };
  } catch (error) {
    console.warn("Failed to read step notification history", error);
    return {
      version: STEP_NOTIFICATION_HISTORY_VERSION,
      entries: [],
    };
  }
};

const writeHistoryStore = async (
  entries: StepNotificationHistoryEntry[],
  now: Date,
) => {
  const prunedEntries = pruneHistoryEntries(entries, now);

  await AsyncStorage.setItem(
    STEP_NOTIFICATION_HISTORY_KEY,
    JSON.stringify({
      version: STEP_NOTIFICATION_HISTORY_VERSION,
      entries: prunedEntries,
    }),
  );
};

const resolveCurrentSteps = async (
  goalSteps: number,
  now: Date,
  providedSteps?: number,
): Promise<ResolvedStepProgress | null> => {
  if (typeof providedSteps === "number" && Number.isFinite(providedSteps)) {
    return {
      currentSteps: Math.max(0, Math.round(providedSteps)),
      source: "provided",
    };
  }

  try {
    const permission = await Pedometer.getPermissionsAsync();

    if (permission.granted) {
      const result = await Pedometer.getStepCountAsync(getStartOfDay(now), now);
      const currentSteps = Math.max(0, Math.round(result.steps));

      await saveTodayStats(currentSteps, goalSteps, now);

      return {
        currentSteps,
        source: "pedometer",
      };
    }
  } catch {
    // fall through to cached data
  }

  const stored = await loadStoredTodayStats(goalSteps, now);

  if (!stored) {
    return null;
  }

  return {
    currentSteps: Math.max(0, Math.round(stored.steps)),
    source: "storage",
  };
};

const performSync = async (
  options: StepNotificationSyncOptions = {},
): Promise<StepNotificationSyncResult> => {
  const fallbackLang = normalizeNotificationLang(options.lang);
  const goalSteps =
    typeof options.goalSteps === "number" && options.goalSteps > 0
      ? Math.round(options.goalSteps)
      : DEFAULT_DAILY_STEP_GOAL;

  try {
    const lang = normalizeNotificationLang(
      options.lang ?? (await AsyncStorage.getItem(LANGUAGE_KEY)),
    );
    const now = options.now ?? new Date();

    await ensureAppNotificationChannel();

    const permitted = await ensureNotificationPermission();
    if (!permitted) {
      return {
        status: "permission_denied",
        lang,
      };
    }

    const resolved = await resolveCurrentSteps(
      goalSteps,
      now,
      options.currentSteps,
    );

    if (!resolved) {
      return {
        status: "missing_progress",
        lang,
      };
    }

    const historyStore = await readHistoryStore();
    const history = pruneHistoryEntries(historyStore.entries, now);

    const candidate = evaluateStepNotification(
      {
        now,
        goalSteps,
        currentSteps: resolved.currentSteps,
      },
      history,
    );

    if (!candidate) {
      return {
        status: "no_candidate",
        lang,
        currentSteps: resolved.currentSteps,
      };
    }

    const content = buildStepNotificationContent(candidate, lang);

    await sendImmediateLocalNotification({
      title: content.title,
      body: content.body,
      data: {
        source: "step-progress",
        lang,
        type: candidate.type,
        contentKey: candidate.contentKey,
        dedupeKey: candidate.dedupeKey,
        dateKey: candidate.progress.dateKey,
        goalSteps: candidate.progress.goalSteps,
        currentSteps: candidate.progress.currentSteps,
        remainingSteps: candidate.progress.remainingSteps,
        progressPercent: candidate.progress.progressPercent,
        timeOfDay: candidate.progress.timeOfDay,
        syncSource: resolved.source,
        ...candidate.metadata,
      },
    });

    const nextEntry: StepNotificationHistoryEntry = {
      type: candidate.type,
      sentAt: now.toISOString(),
      dedupeKey: candidate.dedupeKey,
      progress: candidate.progress,
      metadata: {
        contentKey: candidate.contentKey,
        lang,
        syncSource: resolved.source,
        ...candidate.metadata,
      },
    };

    await writeHistoryStore([...history, nextEntry], now);

    return {
      status: "sent",
      lang,
      type: candidate.type,
      currentSteps: resolved.currentSteps,
    };
  } catch (error) {
    console.warn("Failed to sync step notifications", error);
    return {
      status: "error",
      lang: fallbackLang,
    };
  }
};

export const syncStepProgressNotifications = (
  options: StepNotificationSyncOptions = {},
) => {
  const task = syncChain.then(() => performSync(options));
  syncChain = task.then(
    () => undefined,
    () => undefined,
  );

  return task;
};

export const readStepNotificationHistory = async () => {
  const store = await readHistoryStore();
  return store.entries;
};
