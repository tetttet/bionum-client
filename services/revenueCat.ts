import { Platform } from "react-native";
import Purchases, {
  CustomerInfo,
  LOG_LEVEL,
  PurchasesEntitlementInfo,
  PurchasesError,
  PurchasesOffering,
  PurchasesOfferings,
  PurchasesPackage,
} from "react-native-purchases";

export const REVENUECAT_IOS_API_KEY =
  process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY ??
  "appl_hYSxCSccUyOTQeiQsBkuejexDFg";
export const REVENUECAT_ANDROID_API_KEY =
  process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY ??
  "goog_zKImKZmiSzgxyqfDgsgHScntqIs";

export const MONTHLY_PRODUCT_ID = "bionum_monthly";
export const YEARLY_PRODUCT_ID = "bionum_yearly";
export const PREMIUM_ENTITLEMENT_ID =
  process.env.EXPO_PUBLIC_REVENUECAT_PREMIUM_ENTITLEMENT_ID ?? "premium";

const SUPPORTED_PLATFORMS = new Set(["ios", "android"]);
const PREMIUM_PRODUCT_IDS = new Set([MONTHLY_PRODUCT_ID, YEARLY_PRODUCT_ID]);

export type SubscriptionPlan = "monthly" | "yearly" | "free";
export type SubscriptionStatus =
  | "active"
  | "expired"
  | "canceled"
  | "billing_issue"
  | "trial"
  | "inactive";

let configurePromise: Promise<boolean> | null = null;

function isSupportedPlatform() {
  return SUPPORTED_PLATFORMS.has(Platform.OS);
}

function getRevenueCatApiKey() {
  if (Platform.OS === "ios") return REVENUECAT_IOS_API_KEY;
  if (Platform.OS === "android") return REVENUECAT_ANDROID_API_KEY;
  return null;
}

async function isConfigured() {
  if (!isSupportedPlatform()) return false;

  try {
    return await Purchases.isConfigured();
  } catch (error) {
    console.warn("[RevenueCat] Failed to check SDK configuration state", error);
    return false;
  }
}

async function ensureConfigured(appUserID?: string | null) {
  if (await isConfigured()) return true;
  return configureRevenueCat(appUserID);
}

function getAllEntitlements(customerInfo?: CustomerInfo | null) {
  return customerInfo?.entitlements.all ?? {};
}

function getActiveEntitlements(customerInfo?: CustomerInfo | null) {
  return customerInfo?.entitlements.active ?? {};
}

export function getCurrentOffering(
  offerings?: PurchasesOfferings | null,
): PurchasesOffering | null {
  if (!offerings) return null;
  if (offerings.current) return offerings.current;

  const allOfferings = Object.values(offerings.all ?? {});
  return allOfferings[0] ?? null;
}

export function getPackageForProductId(
  offerings: PurchasesOfferings | null,
  productId: string,
): PurchasesPackage | null {
  if (!offerings) return null;

  const currentOffering = getCurrentOffering(offerings);

  if (!currentOffering) {
    console.warn(
      `[RevenueCat] No current offering available while looking up product "${productId}"`,
    );
    return null;
  }

  const matchingPackage =
    currentOffering.availablePackages.find(
      (item) => item.product.identifier === productId,
    ) ??
    currentOffering.availablePackages.find((item) =>
      item.identifier.toLowerCase().includes(productId.toLowerCase()),
    ) ??
    null;

  if (!matchingPackage) {
    console.warn(
      `[RevenueCat] Package for product "${productId}" was not found in offering "${currentOffering.identifier}"`,
    );
  }

  return matchingPackage;
}

export async function configureRevenueCat(appUserID?: string | null) {
  if (!isSupportedPlatform()) {
    console.warn(
      `[RevenueCat] Platform "${Platform.OS}" is not supported for native purchases`,
    );
    return false;
  }

  if (await isConfigured()) return true;
  if (configurePromise) return configurePromise;

  configurePromise = (async () => {
    const apiKey = getRevenueCatApiKey();

    if (!apiKey) {
      console.warn("[RevenueCat] API key is missing for current platform");
      configurePromise = null;
      return false;
    }

    try {
      if (__DEV__) {
        Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
      }

      Purchases.configure({
        apiKey,
        ...(appUserID ? { appUserID } : {}),
      });

      return true;
    } catch (error) {
      console.warn("[RevenueCat] Failed to configure SDK", error);
      configurePromise = null;
      return false;
    }
  })();

  return configurePromise;
}

export async function logInToRevenueCat(appUserID: string) {
  if (!(await ensureConfigured(appUserID))) return null;

  try {
    const result = await Purchases.logIn(appUserID);
    return result.customerInfo;
  } catch (error) {
    console.warn(`[RevenueCat] Failed to log in user "${appUserID}"`, error);
    return null;
  }
}

export async function logOutFromRevenueCat() {
  if (!(await ensureConfigured())) return null;

  try {
    return await Purchases.logOut();
  } catch (error) {
    console.warn("[RevenueCat] Failed to log out current user", error);
    return null;
  }
}

export async function getCustomerInfo() {
  if (!(await ensureConfigured())) return null;

  try {
    return await Purchases.getCustomerInfo();
  } catch (error) {
    console.warn("[RevenueCat] Failed to fetch customer info", error);
    return null;
  }
}

export async function getOfferings() {
  if (!(await ensureConfigured())) return null;

  try {
    return await Purchases.getOfferings();
  } catch (error) {
    console.warn("[RevenueCat] Failed to fetch offerings", error);
    return null;
  }
}

export async function purchasePackage(revenueCatPackage: PurchasesPackage) {
  if (!(await ensureConfigured())) {
    throw new Error("RevenueCat is not configured");
  }

  return Purchases.purchasePackage(revenueCatPackage);
}

export async function restorePurchases() {
  if (!(await ensureConfigured())) {
    throw new Error("RevenueCat is not configured");
  }

  return Purchases.restorePurchases();
}

export function getPremiumEntitlement(
  customerInfo?: CustomerInfo | null,
): PurchasesEntitlementInfo | null {
  const activeEntitlements = getActiveEntitlements(customerInfo);

  if (activeEntitlements[PREMIUM_ENTITLEMENT_ID]?.isActive) {
    return activeEntitlements[PREMIUM_ENTITLEMENT_ID];
  }

  const allEntitlements = getAllEntitlements(customerInfo);
  const preferredEntitlement = allEntitlements[PREMIUM_ENTITLEMENT_ID];

  if (preferredEntitlement?.isActive) {
    return preferredEntitlement;
  }

  const entitlementByProduct =
    Object.values(activeEntitlements).find(
      (item) =>
        item.isActive && PREMIUM_PRODUCT_IDS.has(item.productIdentifier),
    ) ??
    Object.values(allEntitlements).find((item) =>
      PREMIUM_PRODUCT_IDS.has(item.productIdentifier),
    ) ??
    null;

  return entitlementByProduct;
}

export function checkPremiumAccess(customerInfo?: CustomerInfo | null) {
  return Boolean(getPremiumEntitlement(customerInfo)?.isActive);
}

export function getSubscriptionPlanFromCustomerInfo(
  customerInfo?: CustomerInfo | null,
): SubscriptionPlan {
  const productId =
    getPremiumEntitlement(customerInfo)?.productIdentifier ??
    customerInfo?.activeSubscriptions.find((item) =>
      PREMIUM_PRODUCT_IDS.has(item),
    ) ??
    null;

  if (
    productId === YEARLY_PRODUCT_ID ||
    productId?.toLowerCase().includes("year")
  ) {
    return "yearly";
  }

  if (
    productId === MONTHLY_PRODUCT_ID ||
    productId?.toLowerCase().includes("month")
  ) {
    return "monthly";
  }

  return "free";
}

export function getSubscriptionStatusFromCustomerInfo(
  customerInfo?: CustomerInfo | null,
): SubscriptionStatus {
  const entitlement = getPremiumEntitlement(customerInfo);

  if (!entitlement) return "inactive";

  if (entitlement.isActive) {
    if (entitlement.periodType === "TRIAL") return "trial";
    if (entitlement.billingIssueDetectedAt) return "billing_issue";
    return "active";
  }

  if (entitlement.billingIssueDetectedAt) return "billing_issue";
  if (entitlement.unsubscribeDetectedAt) return "canceled";
  if (entitlement.expirationDate) return "expired";

  return "inactive";
}

export function getNextBillingAtFromCustomerInfo(
  customerInfo?: CustomerInfo | null,
) {
  const entitlement = getPremiumEntitlement(customerInfo);

  if (!entitlement?.isActive || !entitlement.willRenew) {
    return null;
  }

  return entitlement.expirationDate ?? null;
}

export function getExpiresAtFromCustomerInfo(
  customerInfo?: CustomerInfo | null,
) {
  return getPremiumEntitlement(customerInfo)?.expirationDate ?? null;
}

export function isPurchaseCancelledError(error: unknown) {
  if (!error || typeof error !== "object") return false;

  const purchaseError = error as Partial<PurchasesError>;

  return Boolean(purchaseError.userCancelled);
}

export function getRevenueCatErrorMessage(
  error: unknown,
  fallbackMessage: string,
) {
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;

    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }
  }

  return fallbackMessage;
}
