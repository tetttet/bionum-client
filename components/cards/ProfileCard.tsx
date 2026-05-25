import { PortraitLang } from "@/data/dummy/portrait";
import { formatDate as formatBirthDate } from "@/utils/_func";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import { Platform, StatusBar, StyleSheet, Text, View } from "react-native";
import { fs } from "@/constants/typography";

type SubscriptionPlan = "monthly" | "yearly" | "free";
type SubscriptionStatus =
  | "active"
  | "expired"
  | "canceled"
  | "billing_issue"
  | "trial"
  | "inactive";

type ProfileCardProps = {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  lang: PortraitLang;
  subtitle?: string;

  subscriptionStatus?: SubscriptionStatus;
  subscriptionPlan?: SubscriptionPlan;
  nextBillingAt?: string | null;
  expiresAt?: string | null;
  memberSince?: string | null;
};

type SupportedLang = "en" | "ru" | "tr" | "kz";

const normalizeLang = (lang?: PortraitLang): SupportedLang => {
  if (lang === "en" || lang === "ru" || lang === "tr" || lang === "kz") {
    return lang;
  }
  return "en";
};

const translations: Record<
  SupportedLang,
  {
    profile: string;
    premium: string;
    member: string;
    free: string;
    dateOfBirth: string;
    status: string;
    plan: string;
    nextBilling: string;
    expiresOn: string;
    memberSince: string;
    localTime: string;
    active: string;
    expired: string;
    canceled: string;
    billingIssue: string;
    trial: string;
    inactive: string;
    monthly: string;
    yearly: string;
    locale: string;
  }
> = {
  en: {
    profile: "Profile",
    premium: "Premium",
    member: "Member",
    free: "Free",
    dateOfBirth: "Date of birth",
    status: "Status",
    plan: "Plan",
    nextBilling: "Next billing",
    expiresOn: "Access until",
    memberSince: "Member since",
    localTime: "Local time",
    active: "Active",
    expired: "Expired",
    canceled: "Canceled",
    billingIssue: "Billing issue",
    trial: "Trial",
    inactive: "Inactive",
    monthly: "Monthly",
    yearly: "Yearly",
    locale: "en-GB",
  },
  ru: {
    profile: "Профиль",
    premium: "Премиум",
    member: "Участник",
    free: "Бесплатно",
    dateOfBirth: "Дата рождения",
    status: "Статус",
    plan: "План",
    nextBilling: "Следующее списание",
    expiresOn: "Доступ до",
    memberSince: "С нами с",
    localTime: "Местное время",
    active: "Активен",
    expired: "Истёк",
    canceled: "Отменён",
    billingIssue: "Проблема с оплатой",
    trial: "Пробный период",
    inactive: "Неактивен",
    monthly: "Месячный",
    yearly: "Годовой",
    locale: "ru-RU",
  },
  tr: {
    profile: "Profil",
    premium: "Premium",
    member: "Üye",
    free: "Ücretsiz",
    dateOfBirth: "Doğum tarihi",
    status: "Durum",
    plan: "Plan",
    nextBilling: "Sonraki ödeme",
    expiresOn: "Erişim bitişi",
    memberSince: "Üyelik başlangıcı",
    localTime: "Yerel saat",
    active: "Aktif",
    expired: "Süresi doldu",
    canceled: "İptal edildi",
    billingIssue: "Ödeme sorunu",
    trial: "Deneme",
    inactive: "Pasif",
    monthly: "Aylık",
    yearly: "Yıllık",
    locale: "tr-TR",
  },
  kz: {
    profile: "Профиль",
    premium: "Премиум",
    member: "Мүше",
    free: "Тегін",
    dateOfBirth: "Туған күні",
    status: "Мәртебе",
    plan: "Жоспар",
    nextBilling: "Келесі төлем",
    expiresOn: "Қолжетімділік соңы",
    memberSince: "Қосылған күні",
    localTime: "Жергілікті уақыт",
    active: "Белсенді",
    expired: "Мерзімі бітті",
    canceled: "Бас тартылды",
    billingIssue: "Төлем мәселесі",
    trial: "Сынақ",
    inactive: "Белсенді емес",
    monthly: "Айлық",
    yearly: "Жылдық",
    locale: "kk-KZ",
  },
};

const getInitial = (value?: string) =>
  value?.trim()?.charAt(0).toUpperCase() ?? "";

const formatTimestampDate = (value?: string | null, locale?: string) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";

  return d.toLocaleDateString(locale || "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTimestampDateTime = (value?: string | null, locale?: string) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";

  return `${d.toLocaleDateString(locale || "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })} • ${d.toLocaleTimeString(locale || "en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

const GREEN = "#1FA971";
const ORANGE = "#E38B2C";
const RED = "#D9534F";
const GRAY = "#7B8A9A";

const hexToRgb = (hex: string) => {
  const v = hex.replace("#", "");
  const full =
    v.length === 3
      ? v
          .split("")
          .map((c) => c + c)
          .join("")
      : v;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
};

const rgba = (hex: string, a: number) => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
};

const getStatusMeta = (
  status: SubscriptionStatus,
  t: (typeof translations)["en"],
) => {
  switch (status) {
    case "active":
      return {
        label: t.active,
        color: GREEN,
        soft: rgba(GREEN, 0.12),
      };
    case "trial":
      return {
        label: t.trial,
        color: ORANGE,
        soft: rgba(ORANGE, 0.12),
      };
    case "billing_issue":
      return {
        label: t.billingIssue,
        color: ORANGE,
        soft: rgba(ORANGE, 0.12),
      };
    case "expired":
      return {
        label: t.expired,
        color: RED,
        soft: rgba(RED, 0.12),
      };
    case "canceled":
      return {
        label: t.canceled,
        color: RED,
        soft: rgba(RED, 0.12),
      };
    default:
      return {
        label: t.inactive,
        color: GRAY,
        soft: rgba(GRAY, 0.12),
      };
  }
};

const getPlanLabel = (
  plan: SubscriptionPlan,
  t: (typeof translations)["en"],
) => {
  switch (plan) {
    case "monthly":
      return t.monthly;
    case "yearly":
      return t.yearly;
    default:
      return t.free;
  }
};

const ProfileCard: React.FC<ProfileCardProps> = ({
  firstName,
  middleName,
  lastName,
  email,
  dateOfBirth,
  subtitle,
  lang,
  subscriptionStatus = "inactive",
  subscriptionPlan = "free",
  nextBillingAt = null,
  expiresAt = null,
  memberSince = null,
}) => {
  const currentLang = normalizeLang(lang);
  const t = translations[currentLang];

  const fullName = useMemo(
    () => [firstName, middleName, lastName].filter(Boolean).join(" "),
    [firstName, middleName, lastName],
  );

  const initials = useMemo(
    () => `${getInitial(firstName)}${getInitial(lastName)}`,
    [firstName, lastName],
  );

  const resolvedSubtitle = subtitle ?? t.profile;

  const dob = useMemo(
    () => formatBirthDate(dateOfBirth) || "—",
    [dateOfBirth],
  );

  const nowString = useMemo(
    () => formatTimestampDateTime(new Date().toISOString(), t.locale),
    [t.locale],
  );

  const memberSinceString = useMemo(
    () => formatTimestampDate(memberSince, t.locale),
    [memberSince, t.locale],
  );

  const nextBillingString = useMemo(
    () => formatTimestampDate(nextBillingAt, t.locale),
    [nextBillingAt, t.locale],
  );

  const expiresString = useMemo(
    () => formatTimestampDate(expiresAt, t.locale),
    [expiresAt, t.locale],
  );

  const statusMeta = useMemo(
    () => getStatusMeta(subscriptionStatus, t),
    [subscriptionStatus, t],
  );

  const planLabel = useMemo(
    () => getPlanLabel(subscriptionPlan, t),
    [subscriptionPlan, t],
  );

  const isPremium =
    subscriptionPlan === "monthly" || subscriptionPlan === "yearly";

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={["#2982DA", "#2982DA", "#438cd5"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <LinearGradient
          colors={["rgba(255,255,255,0.16)", "rgba(255,255,255,0)"]}
          start={{ x: 0.1, y: 0.2 }}
          end={{ x: 0.9, y: 0.9 }}
          style={styles.blobRight}
        />
        <LinearGradient
          colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0)"]}
          start={{ x: 0.2, y: 0.1 }}
          end={{ x: 1, y: 1 }}
          style={styles.blobLeft}
        />

        <View style={styles.topRow}>
          <View style={styles.pill}>
            <View style={styles.pillDot} />
            <Text style={styles.pillText}>{resolvedSubtitle}</Text>
          </View>

          <View
            style={[
              styles.tierBadge,
              isPremium ? styles.tierBadgePremium : styles.tierBadgeFree,
            ]}
          >
            <Text
              style={[
                styles.tierBadgeText,
                isPremium
                  ? styles.tierBadgeTextPremium
                  : styles.tierBadgeTextFree,
              ]}
            >
              {isPremium ? t.premium : t.free}
            </Text>
          </View>
        </View>

        <View style={styles.center}>
          <LinearGradient
            colors={["rgba(255,255,255,0.18)", "rgba(255,255,255,0.1)"]}
            start={{ x: 0.05, y: 0.05 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatar}
          >
            <View style={styles.avatarHighlight} />
            <Text style={styles.initials}>{initials}</Text>
          </LinearGradient>

          <Text numberOfLines={1} style={styles.name}>
            {fullName}
          </Text>

          <Text numberOfLines={1} style={styles.email}>
            {email}
          </Text>

          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusChip,
                {
                  backgroundColor: statusMeta.soft,
                  borderColor: rgba(statusMeta.color, 0.18),
                },
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: statusMeta.color },
                ]}
              />
              <Text style={[styles.statusText, { color: statusMeta.color }]}>
                {statusMeta.label}
              </Text>
            </View>

            <View style={styles.planChip}>
              <Text style={styles.planChipText}>{planLabel}</Text>
            </View>
          </View>
        </View>

        <View style={styles.grid}>
          <View style={styles.infoCardMini}>
            <Text style={styles.infoLabel}>{t.dateOfBirth}</Text>
            <Text style={styles.infoValue}>{dob}</Text>
          </View>

          <View style={styles.infoCardMini}>
            <Text style={styles.infoLabel}>{t.memberSince}</Text>
            <Text style={styles.infoValue}>{memberSinceString}</Text>
          </View>

          <View style={styles.infoCardWide}>
            <Text style={styles.infoLabel}>{t.plan}</Text>
            <Text style={styles.infoValue}>{planLabel}</Text>
          </View>

          <View style={styles.infoCardWide}>
            <Text style={styles.infoLabel}>{t.nextBilling}</Text>
            <Text style={styles.infoValue}>{nextBillingString}</Text>
          </View>

          <View style={styles.infoCardWide}>
            <Text style={styles.infoLabel}>{t.expiresOn}</Text>
            <Text style={styles.infoValue}>{expiresString}</Text>
          </View>
        </View>

        <LinearGradient
          colors={[
            "rgba(255,255,255,0)",
            "rgba(255,255,255,0.32)",
            "rgba(255,255,255,0)",
          ]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.bottomLine}
        />

        <View style={styles.footerRow}>
          <Text style={styles.footerLeft}>
            {isPremium ? t.premium : t.member}
          </Text>
          <Text style={styles.footerRight}>{nowString}</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingBottom: 16,
  },

  card: {
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) + 18 : 78,
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "#2982DA",
    position: "relative",
    overflow: "hidden",
    shadowColor: "#0B1220",
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },

  blobRight: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 999,
    top: -140,
    right: -150,
    transform: [{ rotate: "18deg" }],
  },

  blobLeft: {
    position: "absolute",
    width: 210,
    height: 210,
    borderRadius: 999,
    bottom: -110,
    left: -120,
    transform: [{ rotate: "-12deg" }],
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    gap: 10,
  },

  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 6,
    paddingBottom: 14,
  },

  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    alignSelf: "flex-start",
  },

  pillDot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },

  pillText: {
    fontSize: fs(12),
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },

  tierBadge: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
  },

  tierBadgePremium: {
    backgroundColor: "rgba(255,255,255,0.16)",
    borderColor: "rgba(255,255,255,0.22)",
  },

  tierBadgeFree: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderColor: "rgba(255,255,255,0.18)",
  },

  tierBadgeText: {
    fontSize: fs(12),
    fontWeight: "900",
    letterSpacing: 0.2,
  },

  tierBadgeTextPremium: {
    color: "#FFFFFF",
  },

  tierBadgeTextFree: {
    color: "rgba(255,255,255,0.88)",
  },

  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    position: "relative",
    overflow: "hidden",
    shadowColor: "#0B1220",
    shadowOpacity: Platform.OS === "ios" ? 0.22 : 0,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
  },

  avatarHighlight: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    top: -8,
    left: -6,
    backgroundColor: "rgba(255,255,255,0.22)",
    transform: [{ rotate: "-10deg" }],
  },

  initials: {
    color: "#fff",
    fontSize: fs(25),
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  name: {
    fontSize: fs(20),
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 0.2,
    marginBottom: 4,
    maxWidth: "95%",
  },

  email: {
    fontSize: fs(14),
    fontWeight: "700",
    color: "rgba(255,255,255,0.88)",
    marginBottom: 14,
    maxWidth: "95%",
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "center",
  },

  statusChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 8,
  },

  statusText: {
    fontSize: fs(12),
    fontWeight: "900",
    letterSpacing: 0.2,
  },

  planChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.20)",
  },

  planChipText: {
    fontSize: fs(12),
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  infoCardMini: {
    width: "48.5%",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },

  infoCardWide: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },

  infoLabel: {
    fontSize: fs(11),
    fontWeight: "800",
    color: "rgba(255,255,255,0.72)",
    marginBottom: 6,
    letterSpacing: 0.2,
  },

  infoValue: {
    fontSize: fs(13),
    fontWeight: "900",
    color: "#FFFFFF",
  },

  bottomLine: {
    marginTop: 14,
    marginBottom: 10,
    height: 2,
    borderRadius: 2,
  },

  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  footerLeft: {
    fontSize: fs(12),
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },

  footerRight: {
    fontSize: fs(11),
    fontWeight: "700",
    color: "rgba(255,255,255,0.72)",
  },
});

export default ProfileCard;
