import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

import { API_BASE_URL } from "@/context/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";

const PREMIUM_CACHE_TTL_MS = 5 * 60 * 1000;
const PREMIUM_CACHE_KEY_PREFIX = "premium_status_cache_v1:";

type PremiumCacheEntry = {
  value: boolean;
  fetchedAt: number;
};

type SubscriptionResponse = {
  success: boolean;
  data?: {
    status?: string | null;
  } | null;
  message?: string;
};

const memoryCache = new Map<number, PremiumCacheEntry>();
const pendingRequests = new Map<number, Promise<boolean>>();

function getStorageKey(userId: number) {
  return `${PREMIUM_CACHE_KEY_PREFIX}${userId}`;
}

function isFresh(entry: PremiumCacheEntry | null | undefined) {
  return Boolean(entry && Date.now() - entry.fetchedAt < PREMIUM_CACHE_TTL_MS);
}

function getMemoryEntry(userId?: number | null) {
  if (!userId) return null;
  return memoryCache.get(userId) ?? null;
}

async function readCachedEntry(userId: number) {
  try {
    const raw = await AsyncStorage.getItem(getStorageKey(userId));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<PremiumCacheEntry>;

    if (
      typeof parsed?.value !== "boolean" ||
      typeof parsed?.fetchedAt !== "number"
    ) {
      return null;
    }

    return parsed as PremiumCacheEntry;
  } catch (error) {
    console.warn("Failed to read premium cache", error);
    return null;
  }
}

async function persistCachedEntry(userId: number, entry: PremiumCacheEntry) {
  memoryCache.set(userId, entry);

  try {
    await AsyncStorage.setItem(getStorageKey(userId), JSON.stringify(entry));
  } catch (error) {
    console.warn("Failed to persist premium cache", error);
  }
}

async function fetchPremiumStatus(userId: number) {
  const response = await fetch(
    `${API_BASE_URL}/api/subscriptions/user/${userId}/active`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Premium status request failed with ${response.status}`);
  }

  const result: SubscriptionResponse = await response.json();

  return Boolean(result?.success && result?.data?.status === "active");
}

async function loadPremiumStatus(userId: number) {
  const cachedInMemory = memoryCache.get(userId);
  if (cachedInMemory && isFresh(cachedInMemory)) {
    return cachedInMemory.value;
  }

  const cachedOnDisk = await readCachedEntry(userId);
  if (cachedOnDisk) {
    memoryCache.set(userId, cachedOnDisk);
    if (isFresh(cachedOnDisk)) return cachedOnDisk.value;
  }

  const existingRequest = pendingRequests.get(userId);
  if (existingRequest) return existingRequest;

  const request = (async () => {
    try {
      const active = await fetchPremiumStatus(userId);
      await persistCachedEntry(userId, {
        value: active,
        fetchedAt: Date.now(),
      });
      return active;
    } catch (error) {
      console.warn("Failed to fetch premium status", error);
      return cachedOnDisk?.value ?? cachedInMemory?.value ?? false;
    } finally {
      pendingRequests.delete(userId);
    }
  })();

  pendingRequests.set(userId, request);
  return request;
}

export function usePremiumStatus(
  userId?: number | null,
  enabled: boolean = true,
) {
  const {
    customerInfo,
    isPremium,
    isLoading: isRevenueCatLoading,
    isRevenueCatAvailable,
  } = useSubscription();

  const [fallbackHasPremium, setFallbackHasPremium] = useState(() =>
    Boolean(getMemoryEntry(userId)?.value),
  );
  const [isCheckingFallbackPremium, setIsCheckingFallbackPremium] = useState(
    () =>
      Boolean(enabled && userId && !isFresh(getMemoryEntry(userId))),
  );

  useEffect(() => {
    let isMounted = true;
    const cachedEntry = getMemoryEntry(userId);

    if (isRevenueCatAvailable && (customerInfo || isRevenueCatLoading)) {
      return () => {
        isMounted = false;
      };
    }

    if (!enabled) {
      setIsCheckingFallbackPremium(false);
      return () => {
        isMounted = false;
      };
    }

    if (!userId) {
      setFallbackHasPremium(false);
      setIsCheckingFallbackPremium(false);
      return () => {
        isMounted = false;
      };
    }

    if (cachedEntry) {
      setFallbackHasPremium(cachedEntry.value);
    }

    if (isFresh(cachedEntry)) {
      setIsCheckingFallbackPremium(false);
      return () => {
        isMounted = false;
      };
    }

    const syncPremiumStatus = async () => {
      try {
        setIsCheckingFallbackPremium(true);
        const active = await loadPremiumStatus(userId);

        if (isMounted) {
          setFallbackHasPremium(active);
        }
      } finally {
        if (isMounted) {
          setIsCheckingFallbackPremium(false);
        }
      }
    };

    syncPremiumStatus();

    return () => {
      isMounted = false;
    };
  }, [
    customerInfo,
    enabled,
    isRevenueCatAvailable,
    isRevenueCatLoading,
    userId,
  ]);

  if (isRevenueCatAvailable && (customerInfo || isRevenueCatLoading)) {
    return {
      hasPremium: isPremium,
      isCheckingPremium: enabled ? isRevenueCatLoading : false,
    };
  }

  return {
    hasPremium: fallbackHasPremium,
    isCheckingPremium: isCheckingFallbackPremium,
  };
}
