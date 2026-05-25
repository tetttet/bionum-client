import { API_BASE_URL, AuthContext } from "@/context/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import HealthCards from "../cards/HealthCards";
import ProfileCard from "../cards/ProfileCard";
import { useTheme } from "../ThemeContext";
import { fs } from "@/constants/typography";

type SupportedLang = "kz" | "ru" | "tr" | "en";

type SubscriptionPlan = "monthly" | "yearly" | "free";
type SubscriptionStatus =
  | "active"
  | "expired"
  | "canceled"
  | "billing_issue"
  | "trial"
  | "inactive";

type ActiveSubscriptionResponse = {
  success: boolean;
  data?: {
    id: number;
    user_id: number;
    provider: string;
    product_id: string;
    entitlement_id: string;
    status: SubscriptionStatus;
    will_renew: boolean;
    expires_at: string | null;
    latest_purchase_at: string | null;
    original_transaction_id: string | null;
    raw_customer_info_json?: unknown;
    created_at: string;
    updated_at: string;
  };
  message?: string;
};

const translations: Record<
  SupportedLang,
  {
    logoutButton: string;
    logoutTitle: string;
    logoutMessage: string;
    cancel: string;
    confirm: string;
    notAvailable: string;
    loading: string;
  }
> = {
  ru: {
    logoutButton: "Выйти",
    logoutTitle: "Выход из аккаунта",
    logoutMessage: "Вы уверены, что хотите выйти?",
    cancel: "Отмена",
    confirm: "Да, выйти",
    notAvailable: "Недоступно",
    loading: "Загрузка...",
  },
  kz: {
    logoutButton: "Шығу",
    logoutTitle: "Аккаунттан шығу",
    logoutMessage: "Шынымен аккаунттан шыққыңыз келе ме?",
    cancel: "Бас тарту",
    confirm: "Иә, шығу",
    notAvailable: "Қолжетімсіз",
    loading: "Жүктелуде...",
  },
  tr: {
    logoutButton: "Çıkış yap",
    logoutTitle: "Oturumu kapat",
    logoutMessage: "Çıkış yapmak istediğinize emin misiniz?",
    cancel: "İptal",
    confirm: "Evet, çıkış yap",
    notAvailable: "Mevcut değil",
    loading: "Yükleniyor...",
  },
  en: {
    logoutButton: "Log out",
    logoutTitle: "Log out",
    logoutMessage: "Are you sure you want to log out?",
    cancel: "Cancel",
    confirm: "Yes, log out",
    notAvailable: "N/A",
    loading: "Loading...",
  },
};

const isSupportedLang = (value: string): value is SupportedLang => {
  return value === "kz" || value === "ru" || value === "tr" || value === "en";
};

const mapProductIdToPlan = (productId?: string | null): SubscriptionPlan => {
  if (!productId) return "free";

  const normalized = productId.toLowerCase();

  if (normalized.includes("year")) return "yearly";
  if (normalized.includes("annual")) return "yearly";
  if (normalized.includes("month")) return "monthly";

  if (normalized === "premium_yearly") return "yearly";
  if (normalized === "premium_monthly") return "monthly";

  return "free";
};

const ProfileScreenDemo = () => {
  const { theme, useDark } = useTheme();
  const { user, loading, logout } = useContext(AuthContext);
  const {
    customerInfo,
    expiresAt: revenueCatExpiresAt,
    isLoading: isRevenueCatLoading,
    isRevenueCatAvailable,
    nextBillingAt: revenueCatNextBillingAt,
    subscriptionPlan: revenueCatSubscriptionPlan,
    subscriptionStatus: revenueCatSubscriptionStatus,
  } = useSubscription();

  const [lang, setLang] = useState<SupportedLang>("ru");
  const [fallbackSubscriptionStatus, setFallbackSubscriptionStatus] =
    useState<SubscriptionStatus>("inactive");
  const [fallbackSubscriptionPlan, setFallbackSubscriptionPlan] =
    useState<SubscriptionPlan>("free");
  const [nextBillingAt, setNextBillingAt] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [isFallbackSubscriptionLoading, setIsFallbackSubscriptionLoading] =
    useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const storedLang = await AsyncStorage.getItem("user_language");

        if (mounted && storedLang) {
          if (isSupportedLang(storedLang)) {
            setLang(storedLang);
          } else {
            setLang("ru");
          }
        }
      } catch (e) {
        console.warn("Failed to load user_language from AsyncStorage", e);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    if (isRevenueCatAvailable && (customerInfo || isRevenueCatLoading)) {
      return () => {
        mounted = false;
      };
    }

    const fetchActiveSubscription = async () => {
      if (!user?.id) {
        if (mounted) {
          setFallbackSubscriptionStatus("inactive");
          setFallbackSubscriptionPlan("free");
          setNextBillingAt(null);
          setExpiresAt(null);
        }
        return;
      }

      try {
        setIsFallbackSubscriptionLoading(true);

        const response = await fetch(
          `${API_BASE_URL}/api/subscriptions/user/${user.id}/active`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!mounted) return;

        if (!response.ok) {
          setFallbackSubscriptionStatus("inactive");
          setFallbackSubscriptionPlan("free");
          setNextBillingAt(null);
          setExpiresAt(null);
          return;
        }

        const result: ActiveSubscriptionResponse = await response.json();

        if (!result?.success || !result?.data) {
          setFallbackSubscriptionStatus("inactive");
          setFallbackSubscriptionPlan("free");
          setNextBillingAt(null);
          setExpiresAt(null);
          return;
        }

        const sub = result.data;

        setFallbackSubscriptionStatus(sub.status || "inactive");
        setFallbackSubscriptionPlan(mapProductIdToPlan(sub.product_id));
        setNextBillingAt(sub.will_renew ? sub.expires_at : null);
        setExpiresAt(sub.expires_at ?? null);
      } catch (error) {
        console.warn("Failed to fetch active subscription", error);
        if (mounted) {
          setFallbackSubscriptionStatus("inactive");
          setFallbackSubscriptionPlan("free");
          setNextBillingAt(null);
          setExpiresAt(null);
        }
      } finally {
        if (mounted) {
          setIsFallbackSubscriptionLoading(false);
        }
      }
    };

    fetchActiveSubscription();

    return () => {
      mounted = false;
    };
  }, [customerInfo, isRevenueCatAvailable, isRevenueCatLoading, user?.id]);

  const t = useMemo(() => translations[lang] ?? translations.ru, [lang]);
  const subscriptionStatus = isRevenueCatAvailable
    ? customerInfo || isRevenueCatLoading
      ? revenueCatSubscriptionStatus
      : fallbackSubscriptionStatus
    : fallbackSubscriptionStatus;
  const subscriptionPlan = isRevenueCatAvailable
    ? customerInfo || isRevenueCatLoading
      ? revenueCatSubscriptionPlan
      : fallbackSubscriptionPlan
    : fallbackSubscriptionPlan;
  const resolvedNextBillingAt = isRevenueCatAvailable
    ? customerInfo || isRevenueCatLoading
      ? revenueCatNextBillingAt
      : nextBillingAt
    : nextBillingAt;
  const resolvedExpiresAt = isRevenueCatAvailable
    ? customerInfo || isRevenueCatLoading
      ? revenueCatExpiresAt
      : expiresAt
    : expiresAt;
  const isSubscriptionLoading = isRevenueCatAvailable
    ? isRevenueCatLoading
    : isFallbackSubscriptionLoading;

  const handleLogoutPress = () => {
    Alert.alert(t.logoutTitle, t.logoutMessage, [
      {
        text: t.cancel,
        style: "cancel",
      },
      {
        text: t.confirm,
        style: "destructive",
        onPress: logout,
      },
    ]);
  };

  if (loading || !user) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background || "#fff" },
      ]}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <ProfileCard
          firstName={user.first_name}
          middleName={user.middle_name}
          lastName={user.last_name}
          email={user.email}
          dateOfBirth={user.date_of_birth || ""}
          lang={lang}
          subtitle={subscriptionPlan === "free" ? t.notAvailable : undefined}
          subscriptionStatus={subscriptionStatus}
          subscriptionPlan={subscriptionPlan}
          nextBillingAt={resolvedNextBillingAt}
          expiresAt={resolvedExpiresAt}
          memberSince={user.created_at || null}
        />

        {isSubscriptionLoading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color="#378adb" />
            <Text style={styles.loadingText}>{t.loading}</Text>
          </View>
        ) : null}

        <View style={styles.spacer} />

        <HealthCards
          theme={theme.healthCardTheme}
          useDark={useDark}
          lang={lang}
        />

        <View style={styles.logoutWrapper}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogoutPress}
            activeOpacity={0.88}
          >
            <Text style={styles.logoutText}>{t.logoutButton}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 90,
  },
  spacer: {
    height: 8,
  },
  loadingBox: {
    marginHorizontal: 18,
    marginTop: -2,
    marginBottom: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: "rgba(55,138,219,0.08)",
    borderWidth: 1,
    borderColor: "rgba(55,138,219,0.10)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  loadingText: {
    color: "#2E6FAF",
    fontSize: fs(13),
    fontWeight: "700",
  },
  logoutWrapper: {
    marginHorizontal: 18,
    marginTop: -15,
    marginBottom: 10,
  },
  logoutButton: {
    width: "100%",
    minHeight: 56,
    backgroundColor: "#378adb",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: "#378adb",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  logoutText: {
    color: "#fff",
    fontSize: fs(16),
    fontWeight: "800",
    letterSpacing: 0.2,
  },
});

export default ProfileScreenDemo;
