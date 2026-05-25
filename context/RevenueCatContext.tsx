import { AuthContext } from "@/context/AuthContext";
import {
  checkPremiumAccess,
  configureRevenueCat,
  getCurrentOffering,
  getCustomerInfo,
  getExpiresAtFromCustomerInfo,
  getNextBillingAtFromCustomerInfo,
  getOfferings,
  getPackageForProductId,
  getPremiumEntitlement,
  getRevenueCatErrorMessage,
  getSubscriptionPlanFromCustomerInfo,
  getSubscriptionStatusFromCustomerInfo,
  isPurchaseCancelledError,
  logInToRevenueCat,
  logOutFromRevenueCat,
  MONTHLY_PRODUCT_ID,
  PREMIUM_ENTITLEMENT_ID,
  purchasePackage,
  restorePurchases,
  SubscriptionPlan,
  SubscriptionStatus,
  YEARLY_PRODUCT_ID,
} from "@/services/revenueCat";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Purchases, {
  CustomerInfo,
  CustomerInfoUpdateListener,
  PurchasesOffering,
  PurchasesOfferings,
  PurchasesPackage,
} from "react-native-purchases";

type PurchaseActionResult = {
  success: boolean;
  cancelled?: boolean;
  message?: string;
  customerInfo?: CustomerInfo | null;
};

type RestoreActionResult = {
  success: boolean;
  restored: boolean;
  message?: string;
  customerInfo?: CustomerInfo | null;
};

type RevenueCatContextValue = {
  offerings: PurchasesOfferings | null;
  currentOffering: PurchasesOffering | null;
  monthlyPackage: PurchasesPackage | null;
  yearlyPackage: PurchasesPackage | null;
  customerInfo: CustomerInfo | null;
  isPremium: boolean;
  isLoading: boolean;
  isPurchasing: boolean;
  isRevenueCatAvailable: boolean;
  entitlementId: string;
  subscriptionPlan: SubscriptionPlan;
  subscriptionStatus: SubscriptionStatus;
  nextBillingAt: string | null;
  expiresAt: string | null;
  refreshCustomerInfo: () => Promise<CustomerInfo | null>;
  refreshOfferings: () => Promise<PurchasesOfferings | null>;
  purchaseMonthly: () => Promise<PurchaseActionResult>;
  purchaseYearly: () => Promise<PurchaseActionResult>;
  restore: () => Promise<RestoreActionResult>;
};

const RevenueCatContext = createContext<RevenueCatContextValue | undefined>(
  undefined,
);

type RevenueCatProviderProps = {
  children: ReactNode;
};

export function RevenueCatProvider({ children }: RevenueCatProviderProps) {
  const { user, loading: isAuthLoading } = useContext(AuthContext);

  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRevenueCatAvailable, setIsRevenueCatAvailable] = useState(false);

  const hasInitializedRef = useRef(false);
  const lastSyncedUserIdRef = useRef<string | null>(null);

  const appUserID = user?.id ? String(user.id) : null;

  const refreshCustomerInfo = async () => {
    const nextCustomerInfo = await getCustomerInfo();

    if (nextCustomerInfo) {
      setCustomerInfo(nextCustomerInfo);
    }

    return nextCustomerInfo;
  };

  const refreshOfferings = async () => {
    const nextOfferings = await getOfferings();

    if (nextOfferings) {
      setOfferings(nextOfferings);
    }

    return nextOfferings;
  };

  useEffect(() => {
    let isMounted = true;

    if (isAuthLoading || hasInitializedRef.current) {
      return () => {
        isMounted = false;
      };
    }

    const initializeRevenueCat = async () => {
      try {
        setIsLoading(true);

        const configured = await configureRevenueCat(appUserID);

        if (!isMounted) return;

        hasInitializedRef.current = true;
        lastSyncedUserIdRef.current = appUserID;
        setIsRevenueCatAvailable(configured);

        if (!configured) return;

        await Promise.all([refreshCustomerInfo(), refreshOfferings()]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void initializeRevenueCat();

    return () => {
      isMounted = false;
    };
  }, [appUserID, isAuthLoading]);

  useEffect(() => {
    if (!isRevenueCatAvailable) return;

    const handleCustomerInfoUpdate: CustomerInfoUpdateListener = (
      updatedCustomerInfo,
    ) => {
      setCustomerInfo(updatedCustomerInfo);
    };

    Purchases.addCustomerInfoUpdateListener(handleCustomerInfoUpdate);

    return () => {
      Purchases.removeCustomerInfoUpdateListener(handleCustomerInfoUpdate);
    };
  }, [isRevenueCatAvailable]);

  useEffect(() => {
    let isMounted = true;

    if (isAuthLoading || !hasInitializedRef.current || !isRevenueCatAvailable) {
      return () => {
        isMounted = false;
      };
    }

    if (lastSyncedUserIdRef.current === appUserID) {
      return () => {
        isMounted = false;
      };
    }

    const syncRevenueCatUser = async () => {
      try {
        setIsLoading(true);

        const syncedCustomerInfo = appUserID
          ? await logInToRevenueCat(appUserID)
          : await logOutFromRevenueCat();

        if (!isMounted) return;

        if (syncedCustomerInfo) {
          setCustomerInfo(syncedCustomerInfo);
        }

        await refreshOfferings();
        lastSyncedUserIdRef.current = appUserID;
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void syncRevenueCatUser();

    return () => {
      isMounted = false;
    };
  }, [appUserID, isAuthLoading, isRevenueCatAvailable]);

  const currentOffering = useMemo(
    () => getCurrentOffering(offerings),
    [offerings],
  );

  const monthlyPackage = useMemo(
    () => getPackageForProductId(offerings, MONTHLY_PRODUCT_ID),
    [offerings],
  );

  const yearlyPackage = useMemo(
    () => getPackageForProductId(offerings, YEARLY_PRODUCT_ID),
    [offerings],
  );

  const isPremium = useMemo(
    () => checkPremiumAccess(customerInfo),
    [customerInfo],
  );

  const subscriptionPlan = useMemo(
    () => getSubscriptionPlanFromCustomerInfo(customerInfo),
    [customerInfo],
  );

  const subscriptionStatus = useMemo(
    () => getSubscriptionStatusFromCustomerInfo(customerInfo),
    [customerInfo],
  );

  const nextBillingAt = useMemo(
    () => getNextBillingAtFromCustomerInfo(customerInfo),
    [customerInfo],
  );

  const expiresAt = useMemo(
    () => getExpiresAtFromCustomerInfo(customerInfo),
    [customerInfo],
  );
  const entitlementId = useMemo(
    () =>
      getPremiumEntitlement(customerInfo)?.identifier ?? PREMIUM_ENTITLEMENT_ID,
    [customerInfo],
  );

  const purchaseSelectedPackage = async (
    targetPackage: PurchasesPackage | null,
    productId: string,
  ): Promise<PurchaseActionResult> => {
    if (!isRevenueCatAvailable) {
      return {
        success: false,
        message:
          "Purchases are temporarily unavailable. Please try again in a moment.",
      };
    }

    if (!targetPackage) {
      console.warn(
        `[RevenueCat] Purchase package is missing for product "${productId}"`,
      );

      return {
        success: false,
        message:
          "This subscription option is currently unavailable. Please try again later.",
      };
    }

    try {
      setIsPurchasing(true);

      const result = await purchasePackage(targetPackage);

      setCustomerInfo(result.customerInfo);

      return {
        success: checkPremiumAccess(result.customerInfo),
        customerInfo: result.customerInfo,
      };
    } catch (error) {
      if (isPurchaseCancelledError(error)) {
        return {
          success: false,
          cancelled: true,
        };
      }

      console.warn(
        `[RevenueCat] Failed to purchase product "${productId}"`,
        error,
      );

      return {
        success: false,
        message: getRevenueCatErrorMessage(
          error,
          "Purchase failed. Please try again later.",
        ),
      };
    } finally {
      setIsPurchasing(false);
    }
  };

  const purchaseMonthly = async () =>
    purchaseSelectedPackage(monthlyPackage, MONTHLY_PRODUCT_ID);

  const purchaseYearly = async () =>
    purchaseSelectedPackage(yearlyPackage, YEARLY_PRODUCT_ID);

  const restore = async (): Promise<RestoreActionResult> => {
    if (!isRevenueCatAvailable) {
      return {
        success: false,
        restored: false,
        message:
          "Purchases are temporarily unavailable. Please try again in a moment.",
      };
    }

    try {
      setIsPurchasing(true);

      const restoredCustomerInfo = await restorePurchases();
      const restoredPremium = checkPremiumAccess(restoredCustomerInfo);

      setCustomerInfo(restoredCustomerInfo);

      if (!restoredPremium) {
        return {
          success: false,
          restored: false,
          customerInfo: restoredCustomerInfo,
          message: "No active purchases were found to restore.",
        };
      }

      return {
        success: true,
        restored: true,
        customerInfo: restoredCustomerInfo,
      };
    } catch (error) {
      console.warn("[RevenueCat] Failed to restore purchases", error);

      return {
        success: false,
        restored: false,
        message: getRevenueCatErrorMessage(
          error,
          "Restore failed. Please try again later.",
        ),
      };
    } finally {
      setIsPurchasing(false);
    }
  };

  const value: RevenueCatContextValue = {
    offerings,
    currentOffering,
    monthlyPackage,
    yearlyPackage,
    customerInfo,
    isPremium,
    isLoading,
    isPurchasing,
    isRevenueCatAvailable,
    entitlementId,
    subscriptionPlan,
    subscriptionStatus,
    nextBillingAt,
    expiresAt,
    refreshCustomerInfo,
    refreshOfferings,
    purchaseMonthly,
    purchaseYearly,
    restore,
  };

  return (
    <RevenueCatContext.Provider value={value}>
      {children}
    </RevenueCatContext.Provider>
  );
}

export function useRevenueCatContext() {
  const context = useContext(RevenueCatContext);

  if (!context) {
    throw new Error("useRevenueCatContext must be used within RevenueCatProvider");
  }

  return context;
}
