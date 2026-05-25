import { fs, lh } from "@/constants/typography";
import { useSubscription } from "@/hooks/useSubscription";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { IconSymbol } from "../ui/icon-symbol";

type PortraitLang = "ru" | "en" | "kz" | "tr";
type Billing = "monthly" | "yearly";
type PlanId = "free" | "premium";

type Plan = {
  id: PlanId;
  badge?: string;
  title: string;
  price: string;
  originalPrice?: string;
  period: string;
  note?: string;
  features: string[];
  highlight?: boolean;
};

const FeatureRow = ({
  icon,
  text,
  muted,
}: {
  icon: string;
  text: string;
  muted?: boolean;
}) => {
  return (
    <View style={styles.featureRow}>
      <View
        style={[
          styles.featureIconWrap,
          muted ? styles.featureIconWrapMuted : null,
        ]}
      >
        <IconSymbol
          name={icon as any}
          size={16}
          color={muted ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.8)"}
        />
      </View>
      <Text
        style={[styles.featureText, muted ? styles.featureTextMuted : null]}
      >
        {text}
      </Text>
    </View>
  );
};

const BillingButtons = ({
  value,
  onSelect,
  lang,
  disabled,
  monthlyPrice,
  monthlyOriginalPrice,
  yearlyPrice,
  yearlyOriginalPrice,
  purchasingBilling,
}: {
  value: Billing;
  onSelect: (v: Billing) => void;
  lang: PortraitLang;
  disabled?: boolean;
  monthlyPrice: string;
  monthlyOriginalPrice: string;
  yearlyPrice: string;
  yearlyOriginalPrice: string;
  purchasingBilling: Billing | null;
}) => {
  const t = i18n(lang);
  const options = [
    {
      id: "monthly" as Billing,
      title: t.buyMonthly,
      price: monthlyPrice,
      originalPrice: monthlyOriginalPrice,
    },
    {
      id: "yearly" as Billing,
      title: t.buyYearly,
      price: yearlyPrice,
      originalPrice: yearlyOriginalPrice,
    },
  ];

  return (
    <View style={styles.billingButtonsWrap}>
      {options.map((option) => {
        const active = value === option.id;

        return (
          <TouchableOpacity
            key={option.id}
            activeOpacity={0.9}
            disabled={disabled}
            onPress={() => onSelect(option.id)}
            style={[
              styles.billingBuyBtn,
              active ? styles.billingBuyBtnActive : null,
              disabled ? styles.billingBuyBtnDisabled : null,
            ]}
          >
            <View style={styles.billingBuyInfo}>
              <View style={styles.billingBuyTitleRow}>
                <Text
                  style={[
                    styles.billingBuyTitle,
                    active ? styles.billingBuyTitleActive : null,
                  ]}
                >
                  {option.title}
                </Text>
                {option.id === "monthly" ? (
                  <View
                    style={[
                      styles.billingBadge,
                      active ? styles.billingBadgeActive : null,
                    ]}
                  >
                    <Text
                      style={[
                        styles.billingBadgeText,
                        active ? styles.billingBadgeTextActive : null,
                      ]}
                    >
                      {t.badgeMostPopular}
                    </Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.billingBuyPriceRow}>
                <Text
                  style={[
                    styles.billingBuyPrice,
                    active ? styles.billingBuyPriceActive : null,
                  ]}
                >
                  {option.price}
                </Text>
                <Text
                  style={[
                    styles.billingBuyOriginal,
                    active ? styles.billingBuyOriginalActive : null,
                  ]}
                >
                  {option.originalPrice}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.billingBuyArrow,
                active ? styles.billingBuyArrowActive : null,
              ]}
            >
              {purchasingBilling === option.id ? (
                <ActivityIndicator
                  size="small"
                  color={active ? "#3097f2" : "#FFFFFF"}
                />
              ) : (
                <IconSymbol
                  name="chevron.right"
                  size={20}
                  color={active ? "#3097f2" : "#FFFFFF"}
                />
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const PlanCard = ({
  plan,
  lang,
  children,
}: {
  plan: Plan;
  lang: PortraitLang;
  children?: React.ReactNode;
}) => {
  const t = i18n(lang);
  const showPrice = plan.id !== "premium";

  let free = "free";
  let mostPop = "most popular";
  if (lang === "ru") {
    free = "бесплатно";
    mostPop = "самый популярный";
  } else if (lang === "kz") {
    free = "тегін";
    mostPop = "ең танымал";
  } else if (lang === "tr") {
    free = "ücretsiz";
    mostPop = "en popüler";
  }

  let badge = plan.badge;
  if (badge === "Free") badge = free;
  if (badge === "Most Popular") badge = mostPop;

  return (
    <View
      style={[
        styles.planCard,
        plan.highlight ? styles.planCardHighlight : null,
      ]}
    >
      <View style={styles.planTopRow}>
        <View style={{ flex: 1 }}>
          <View style={styles.planTitleRow}>
            <Text style={styles.planTitle}>{plan.title}</Text>
            {!!plan.badge && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            )}
          </View>

          {showPrice ? (
            <View style={styles.priceRow}>
              {!!plan.originalPrice && (
                <Text style={styles.planPriceOriginal}>
                  {plan.originalPrice}
                </Text>
              )}
              <Text style={styles.planPrice}>{plan.price}</Text>
              <Text style={styles.planPeriod}>
                {" "}
                / {plan.period === "month" ? t.periodMonth : t.periodYear}
              </Text>
            </View>
          ) : null}

          {children ? (
            <View style={styles.planInnerControls}>{children}</View>
          ) : null}
          {!!plan.note && <Text style={styles.planNote}>{plan.note}</Text>}
        </View>
      </View>

      <View style={styles.planDivider} />

      <View style={{ gap: 10 }}>
        {plan.features.map((f, idx) => (
          <FeatureRow
            key={`${plan.id}-${idx}`}
            icon="checkmark"
            text={f}
            muted={false}
          />
        ))}
      </View>

      {/* Small hint for Free plan */}
      {plan.id === "free" ? (
        <Text style={styles.freeHint}>{t.freeHint}</Text>
      ) : null}
    </View>
  );
};
const PremiumScreen = () => {
  const [lang, setLang] = useState<PortraitLang>("ru");
  const [billing, setBilling] = useState<Billing>("monthly");
  const [purchasingBilling, setPurchasingBilling] = useState<Billing | null>(
    null,
  );
  const {
    isLoading: isSubscriptionLoading,
    isPremium,
    isPurchasing,
    monthlyPackage,
    restore,
    yearlyPackage,
    purchaseMonthly,
    purchaseYearly,
  } = useSubscription();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const storedLang = await AsyncStorage.getItem("user_language");
        if (storedLang && mounted) {
          const v = storedLang as PortraitLang;
          if (v === "ru" || v === "en" || v === "kz" || v === "tr") {
            setLang(v);
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
  const t = i18n(lang);
  const paymentSections = [
    {
      title: t.paymentSectionPersonality,
      items: [
        t.paymentBirthNumber,
        t.paymentNameNumber,
        t.paymentPsychomatrixOwn,
        t.paymentPsychomatrixFriend,
      ],
    },
    {
      title: t.paymentSectionLifeCodes,
      items: [
        t.paymentLifePathCode,
        t.paymentKarmicCode,
        t.paymentPurpose,
        t.paymentPurposeProblem,
      ],
    },
    {
      title: t.paymentSectionForecasts,
      items: [
        t.paymentLifeCode,
        t.paymentFutureNumber,
        t.paymentPairCompatibility,
      ],
    },
    {
      title: t.paymentSectionCompatibility,
      items: [t.paymentFateCompatibility, t.paymentNameCompatibility],
    },
  ];

  const freeFeatures = [
    t.freeSteps, // шагомер
    t.freeDayForecast, // прогноз дня
    t.freeAffirmation, // аффирмация
    t.freePersonalityBirth, // код личности -> число рождения
  ];

  const premiumFeatures = paymentSections.flatMap((section) => section.items);

  const monthlyPrice = monthlyPackage?.product.priceString ?? "5,99$";
  const yearlyPrice = yearlyPackage?.product.priceString ?? "39,99$";
  const premiumOriginalPrice = billing === "monthly" ? "6,9$" : "49,9$";
  const premiumPrice = billing === "monthly" ? monthlyPrice : yearlyPrice;
  const premiumPeriod = billing === "monthly" ? "month" : "year";

  const handlePurchase = async (selectedBilling: Billing) => {
    setBilling(selectedBilling);
    setPurchasingBilling(selectedBilling);

    const result =
      selectedBilling === "monthly"
        ? await purchaseMonthly()
        : await purchaseYearly();

    setPurchasingBilling(null);

    if (result.cancelled) {
      return;
    }

    if (result.success) {
      return;
    }

    Alert.alert(t.purchaseErrorTitle, result.message ?? t.purchaseErrorMessage);
  };

  const handleRestore = async () => {
    const result = await restore();

    if (result.success) {
      Alert.alert(t.restoreSuccessTitle, t.restoreSuccessMessage);
      return;
    }

    Alert.alert(t.restoreTitle, result.message ?? t.restoreEmptyMessage);
  };

  const plans: Plan[] = [
    {
      id: "free",
      badge: t.badgeFree,
      title: t.planFreeTitle,
      price: "0$",
      period: premiumPeriod, // период в UI нужен для формата, но цена 0
      note: t.planFreeNote,
      features: freeFeatures,
    },
    {
      id: "premium",
      title: t.planPremiumTitle,
      price: premiumPrice,
      originalPrice: premiumOriginalPrice,
      period: premiumPeriod,
      note:
        billing === "yearly"
          ? t.planPremiumNoteYearly
          : t.planPremiumNoteMonthly,
      features: premiumFeatures,
      highlight: true,
    },
  ];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        {/* HERO */}
        <View style={styles.heroWrap}>
          <LinearGradient
            colors={["#2982da", "#2982da", "#2982da"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroGlowTop} />
            <View style={styles.heroGlowBottom} />
            <View style={styles.heroOverlay} />

            <View style={styles.heroContent}>
              <Text style={styles.title}>{t.heroTitle}</Text>
              <Text style={styles.subtitle}>{t.heroSubtitle}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* CONTENT */}
        <View style={styles.content}>
          {/* Small value strip (как было) */}
          <View style={styles.valueStrip}>
            <View style={styles.valueItem}>
              <IconSymbol
                name="shield.checkerboard"
                size={16}
                color="rgba(0,0,0,0.7)"
              />
              <Text style={styles.valueText}>{t.securePayments}</Text>
            </View>
            <View style={styles.dot} />
            <View style={styles.valueItem}>
              <IconSymbol name="clock" size={16} color="rgba(0,0,0,0.7)" />
              <Text style={styles.valueText}>{t.instantAccess}</Text>
            </View>
            <View style={styles.dot} />
            <View style={styles.valueItem}>
              <IconSymbol
                name="xmark.circle"
                size={16}
                color="rgba(0,0,0,0.7)"
              />
              <Text style={styles.valueText}>{t.cancelAnytime}</Text>
            </View>
          </View>

          {/* Plan cards */}
          <View style={{ gap: 12, marginTop: 14 }}>
            {plans.map((p) => (
              <PlanCard key={p.id} plan={p} lang={lang}>
                {p.id === "premium" ? (
                  <BillingButtons
                    value={billing}
                    onSelect={handlePurchase}
                    lang={lang}
                    disabled={isPurchasing || isSubscriptionLoading}
                    monthlyPrice={monthlyPrice}
                    monthlyOriginalPrice="6,9$"
                    yearlyPrice={yearlyPrice}
                    yearlyOriginalPrice="49,9$"
                    purchasingBilling={purchasingBilling}
                  />
                ) : null}
              </PlanCard>
            ))}
          </View>

          {/* Payment details */}
          <View style={[styles.moneyCard, { marginBottom: 120 }]}>
            <Text style={styles.disclaimer}>{t.disclaimer}</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              disabled={isPurchasing || isSubscriptionLoading}
              onPress={handleRestore}
              style={styles.restoreButton}
            >
              <Text style={styles.restoreButtonText}>
                {isPremium ? t.restoreButtonActive : t.restoreButton}
              </Text>
            </TouchableOpacity>
          </View>

          {/* CTA */}
          {/* <View style={styles.ctaWrap}>
            <Text style={styles.finePrint}>
              {t.finePrint}
              {"\n\n"}
              {t.pricingFootnote}
            </Text>
          </View> */}
        </View>
      </ScrollView>
    </View>
  );
};

function i18n(lang: PortraitLang) {
  // RU default
  let heroTitle = "Выберите\nплан для разблокировки Премиум-функций";
  let heroSubtitle =
    "Прозрачные цены. Обновляйте в любое время. Отменяйте в любое время.";
  let paymentIntro =
    "Все расширенные расчёты и полный доступ к аналитике личности и жизненных кодов.";

  let billingMonthly = "Месяц";
  let billingYearly = "Год";
  let savePill = "Экономия";
  let buyMonthly = "За месяц";
  let buyYearly = "За год";

  let securePayments = "Безопасные платежи";
  let instantAccess = "Мгновенный доступ";
  let cancelAnytime = "Отмена в любое время";

  let badgeFree = "Бесплатно";
  let badgeMostPopular = "Самый популярный";
  let badgeBestValue = "Лучшее предложение";

  let planFreeTitle = "Бесплатно";
  let planFreeNote = "Базовые функции для ежедневного использования.";

  let planPremiumTitle = "Премиум";
  let planPremiumNoteMonthly = paymentIntro;
  let planPremiumNoteYearly = paymentIntro;

  // FREE features
  let freeSteps = "Шагомер + ккал";
  let freeAffirmation = "Аффирмация дня";
  let freeDayForecast = "Прогноз дня";
  let freePersonalityBirth = "Код личности — число\nрождения";

  // PREMIUM features
  let pPsychomatrix = "Психоматрица (ваша)";
  let pFriendView = "Психоматрица другого человека";

  let pLifePath = "Код жизненного пути";
  let pKarmicCode = "Кармический код";
  let pDestinyAndProblems = "Предназначение и точки роста";
  let pDharma = "Число дхармы";

  let pLifeCodeForecast = "Прогноз по жизненному коду";
  let pFutureNumber = "Прогноз по числу будущего";
  let pFuturePairCompatibility = "Совместимость будущей пары";

  let pFateCompatibility = "По числу судьбы";
  let pNameCompatibility = "По числу имени";
  let pKarmicBond = "Совместимость — кармическая связь";
  let paymentSectionPersonality = "Код личности по числу рождения";
  let paymentSectionLifeCodes = "Матрица жизненных кодов";
  let paymentSectionForecasts = "Прогноз";
  let paymentSectionCompatibility = "Совместимость";
  let paymentBirthNumber = "Число рождения";
  let paymentNameNumber = "Число имени";
  let paymentPsychomatrixOwn = "Психоматрица (ваша)";
  let paymentPsychomatrixFriend = "Психоматрица вашего друга";
  let paymentLifePathCode = "Код жизненного пути";
  let paymentKarmicCode = "Кармический код";
  let paymentPurpose = "Предназначение";
  let paymentPurposeProblem = "Проблема на пути к предназначению";
  let paymentLifeCode = "Жизненный код";
  let paymentFutureNumber = "Число будущего";
  let paymentPairCompatibility = "Совместимость пары";
  let paymentFateCompatibility = "Совместимость по числу судьбы";
  let paymentNameCompatibility = "Совместимость по числу имени";

  let freeHint = "Вы можете перейти на Премиум в любое время.";

  let disclaimer =
    "Все нумерологические интерпретации предназначены для самоанализа и личного развития и не являются научно подтверждёнными или гарантированными результатами.";
  let restoreButton = "Восстановить покупки";
  let restoreButtonActive = "Восстановить покупки";
  let restoreTitle = "Восстановление покупок";
  let restoreSuccessTitle = "Покупки восстановлены";
  let restoreSuccessMessage = "Премиум-доступ снова активен.";
  let restoreEmptyMessage = "Активные покупки для восстановления не найдены.";
  let purchaseErrorTitle = "Ошибка покупки";
  let purchaseErrorMessage =
    "Не удалось завершить покупку. Попробуйте ещё раз позже.";

  let ctaContinue = "Продолжить с";
  let finePrint =
    "Продолжая, вы соглашаетесь с условиями подписки и политикой конфиденциальности. Вы можете отменить в любое время через настройки вашего аккаунта.";
  let pricingFootnote =
    "Локальная цена может отличаться по стране: App Store и Google Play автоматически конвертируют стоимость в вашу валюту.";
  let planFallback = "Plan";

  let periodMonth = "месяц";
  let periodYear = "год";

  // EN
  if (lang === "en") {
    heroTitle = "Choose\na plan to unlock Premium features";
    heroSubtitle = "Transparent pricing. Upgrade anytime. Cancel anytime.";
    paymentIntro =
      "All advanced calculations and full access to personality insights and life-code analytics.";

    billingMonthly = "Monthly";
    billingYearly = "Yearly";
    savePill = "Save";
    buyMonthly = "For month";
    buyYearly = "For year";

    securePayments = "Secure payments";
    instantAccess = "Instant access";
    cancelAnytime = "Cancel anytime";

    badgeFree = "Free";
    badgeMostPopular = "Most popular";
    badgeBestValue = "Best value";

    planFreeTitle = "Free";
    planFreeNote = "Core features for everyday use.";

    planPremiumTitle = "Premium";
    planPremiumNoteMonthly = paymentIntro;
    planPremiumNoteYearly = paymentIntro;

    freeSteps = "Step counter + kcal";
    freeAffirmation = "Daily affirmation";
    freeDayForecast = "Daily forecast";
    freePersonalityBirth = "Personality code — birth number";

    pPsychomatrix = "Psychomatrix (yours)";
    pFriendView = "Another person's psychomatrix";

    pLifePath = "Life path code";
    pKarmicCode = "Karmic code";
    pDestinyAndProblems = "Purpose and growth points";
    pDharma = "Dharma number";

    pLifeCodeForecast = "Forecast by life code";
    pFutureNumber = "Forecast by future number";
    pFuturePairCompatibility = "Future couple compatibility";

    pFateCompatibility = "By destiny number";
    pNameCompatibility = "By name number";
    pKarmicBond = "Compatibility — karmic bond";
    paymentSectionPersonality = "Personality code by birth number";
    paymentSectionLifeCodes = "Life code matrix";
    paymentSectionForecasts = "Forecast";
    paymentSectionCompatibility = "Compatibility";
    paymentBirthNumber = "Birth number";
    paymentNameNumber = "Name number";
    paymentPsychomatrixOwn = "Psychomatrix (yours)";
    paymentPsychomatrixFriend = "Your friend's psychomatrix";
    paymentLifePathCode = "Life path code";
    paymentKarmicCode = "Karmic code";
    paymentPurpose = "Purpose";
    paymentPurposeProblem = "Problem on the path to purpose";
    paymentLifeCode = "Life code";
    paymentFutureNumber = "Future number";
    paymentPairCompatibility = "Couple compatibility";
    paymentFateCompatibility = "Compatibility by destiny number";
    paymentNameCompatibility = "Compatibility by name number";

    freeHint = "You can upgrade to Premium anytime.";

    disclaimer =
      "All numerology interpretations are intended for self-reflection and personal growth and are not scientifically validated or guaranteed results.";
    restoreButton = "Restore purchases";
    restoreButtonActive = "Restore purchases";
    restoreTitle = "Restore purchases";
    restoreSuccessTitle = "Purchases restored";
    restoreSuccessMessage = "Premium access is active again.";
    restoreEmptyMessage = "No active purchases were found to restore.";
    purchaseErrorTitle = "Purchase failed";
    purchaseErrorMessage =
      "We could not complete the purchase. Please try again later.";

    ctaContinue = "Continue with";
    finePrint =
      "By continuing, you agree to the subscription terms and privacy policy. You can cancel anytime in your account settings.";
    pricingFootnote =
      "Local pricing may vary by country: the App Store and Google Play automatically convert prices into your currency.";
    planFallback = "Plan";

    periodMonth = "month";
    periodYear = "year";
  }

  // KZ
  else if (lang === "kz") {
    heroTitle = "Премиум мүмкіндіктерін ашу үшін\nжоспар таңдаңыз";
    heroSubtitle =
      "Бағалар ашық. Кез келген уақытта жаңартыңыз. Кез келген уақытта тоқтатыңыз.";
    paymentIntro =
      "Барлық кеңейтілген есептеулер және тұлға мен өмір кодтарының аналитикасына толық қолжетімділік.";

    billingMonthly = "Айлық";
    billingYearly = "Жылдық";
    savePill = "Үнем";
    buyMonthly = "Айына";
    buyYearly = "Жылына";

    securePayments = "Қауіпсіз төлемдер";
    instantAccess = "Лезде қолжетімділік";
    cancelAnytime = "Кез келген уақытта тоқтату";

    badgeFree = "Тегін";
    badgeMostPopular = "Ең танымал";
    badgeBestValue = "Ең тиімді";

    planFreeTitle = "Тегін";
    planFreeNote = "Күнделікті қолдануға арналған негізгі мүмкіндіктер.";

    planPremiumTitle = "Премиум";
    planPremiumNoteMonthly = paymentIntro;
    planPremiumNoteYearly = paymentIntro;

    freeSteps = "Қадам санауыш + ккал";
    freeAffirmation = "Күннің аффирмациясы";
    freeDayForecast = "Күн болжамы";
    freePersonalityBirth = "Тұлға коды — туған күн саны";

    pPsychomatrix = "Психоматрица (сіздікі)";
    pFriendView = "Басқа адамның психоматрицасы";

    pLifePath = "Өмір жолы коды";
    pKarmicCode = "Кармалық код";
    pDestinyAndProblems = "Мақсат және өсу нүктелері";
    pDharma = "Дхарма саны";

    pLifeCodeForecast = "Өмір коды бойынша болжам";
    pFutureNumber = "Болашақ саны бойынша болжам";
    pFuturePairCompatibility = "Болашақ жұптың үйлесімі";

    pFateCompatibility = "Тағдыр саны бойынша";
    pNameCompatibility = "Есім саны бойынша";
    pKarmicBond = "Үйлесім — кармалық байланыс";
    paymentSectionPersonality = "Туған күн саны бойынша тұлға коды";
    paymentSectionLifeCodes = "Өмір кодтарының матрицасы";
    paymentSectionForecasts = "Болжам";
    paymentSectionCompatibility = "Үйлесім";
    paymentBirthNumber = "Туған күн саны";
    paymentNameNumber = "Есім саны";
    paymentPsychomatrixOwn = "Психоматрица (сіздікі)";
    paymentPsychomatrixFriend = "Досыңыздың психоматрицасы";
    paymentLifePathCode = "Өмір жолы коды";
    paymentKarmicCode = "Кармалық код";
    paymentPurpose = "Мақсат";
    paymentPurposeProblem = "Мақсатқа барар жолдағы мәселе";
    paymentLifeCode = "Өмір коды";
    paymentFutureNumber = "Болашақ саны";
    paymentPairCompatibility = "Жұп үйлесімі";
    paymentFateCompatibility = "Тағдыр саны бойынша үйлесім";
    paymentNameCompatibility = "Есім саны бойынша үйлесім";

    freeHint = "Кез келген уақытта Премиумға өте аласыз.";

    disclaimer =
      "Барлық нумерологиялық интерпретациялар өзін-өзі талдау мен жеке дамуға арналған және ғылыми түрде расталған немесе кепілдендірілген нәтиже болып саналмайды.";
    restoreButton = "Сатып алуларды қалпына келтіру";
    restoreButtonActive = "Сатып алуларды қалпына келтіру";
    restoreTitle = "Сатып алуларды қалпына келтіру";
    restoreSuccessTitle = "Сатып алулар қалпына келтірілді";
    restoreSuccessMessage = "Премиум қолжетімділігі қайта белсендірілді.";
    restoreEmptyMessage =
      "Қалпына келтірілетін белсенді сатып алулар табылмады.";
    purchaseErrorTitle = "Сатып алу қатесі";
    purchaseErrorMessage =
      "Сатып алуды аяқтау мүмкін болмады. Кейінірек қайта көріңіз.";

    ctaContinue = "Жалғастыру:";
    finePrint =
      "Жалғастыру арқылы сіз жазылым шарттары мен құпиялылық саясатына келісесіз. Кез келген уақытта аккаунт баптауларында тоқтата аласыз.";
    pricingFootnote =
      "Жергілікті баға елге байланысты өзгеруі мүмкін: App Store мен Google Play құнды сіздің валютаңызға автоматты түрде түрлендіреді.";
    planFallback = "Жоспар";

    periodMonth = "ай";
    periodYear = "жыл";
  }

  // TR
  else if (lang === "tr") {
    heroTitle = "Premium özellikleri açmak için\nbir plan seçin";
    heroSubtitle =
      "Şeffaf fiyatlar. İstediğiniz zaman yükseltin. İstediğiniz zaman iptal edin.";
    paymentIntro =
      "Tüm gelişmiş hesaplamalar ve kişilik ile yaşam kodu analizlerine tam erişim.";

    billingMonthly = "Aylık";
    billingYearly = "Yıllık";
    savePill = "Tasarruf";
    buyMonthly = "Aylık";
    buyYearly = "Yıllık";

    securePayments = "Güvenli ödeme";
    instantAccess = "Anında erişim";
    cancelAnytime = "İstediğin zaman iptal";

    badgeFree = "Ücretsiz";
    badgeMostPopular = "En popüler";
    badgeBestValue = "En iyi değer";

    planFreeTitle = "Ücretsiz";
    planFreeNote = "Günlük kullanım için temel özellikler.";

    planPremiumTitle = "Premium";
    planPremiumNoteMonthly = paymentIntro;
    planPremiumNoteYearly = paymentIntro;

    freeSteps = "Adım sayacı + kcal";
    freeAffirmation = "Günün olumlaması";
    freeDayForecast = "Günlük tahmin";
    freePersonalityBirth = "Kişilik kodu — doğum sayısı";

    pPsychomatrix = "Psikomatrisiniz";
    pFriendView = "Başka bir kişinin psikomatrisi";

    pLifePath = "Yaşam yolu kodu";
    pKarmicCode = "Karmik kod";
    pDestinyAndProblems = "Amaç ve büyüme noktaları";
    pDharma = "Dharma sayısı";

    pLifeCodeForecast = "Yaşam koduna göre tahmin";
    pFutureNumber = "Gelecek sayısına göre tahmin";
    pFuturePairCompatibility = "Gelecekteki çift uyumluluğu";

    pFateCompatibility = "Kader sayısına göre";
    pNameCompatibility = "İsim sayısına göre";
    pKarmicBond = "Uyum — karmik bağ";
    paymentSectionPersonality = "Doğum sayısına göre kişilik kodu";
    paymentSectionLifeCodes = "Yaşam kodları matrisi";
    paymentSectionForecasts = "Tahmin";
    paymentSectionCompatibility = "Uyumluluk";
    paymentBirthNumber = "Doğum sayısı";
    paymentNameNumber = "İsim sayısı";
    paymentPsychomatrixOwn = "Psikomatrisiniz";
    paymentPsychomatrixFriend = "Arkadaşınızın psikomatrisi";
    paymentLifePathCode = "Yaşam yolu kodu";
    paymentKarmicCode = "Karmik kod";
    paymentPurpose = "Amaç";
    paymentPurposeProblem = "Amaca giden yoldaki sorun";
    paymentLifeCode = "Yaşam kodu";
    paymentFutureNumber = "Gelecek sayısı";
    paymentPairCompatibility = "Çift uyumluluğu";
    paymentFateCompatibility = "Kader sayısına göre uyumluluk";
    paymentNameCompatibility = "İsim sayısına göre uyumluluk";

    freeHint = "İstediğiniz zaman Premium’a geçebilirsiniz.";

    disclaimer =
      "Tüm numeroloji yorumları öz değerlendirme ve kişisel gelişim içindir; bilimsel olarak doğrulanmış veya garanti edilen sonuçlar değildir.";
    restoreButton = "Satın alımları geri yükle";
    restoreButtonActive = "Satın alımları geri yükle";
    restoreTitle = "Satın alımları geri yükle";
    restoreSuccessTitle = "Satın alımlar geri yüklendi";
    restoreSuccessMessage = "Premium erişimi yeniden etkin.";
    restoreEmptyMessage = "Geri yüklenecek etkin bir satın alım bulunamadı.";
    purchaseErrorTitle = "Satın alma hatası";
    purchaseErrorMessage =
      "Satın alma tamamlanamadı. Lütfen daha sonra tekrar deneyin.";

    ctaContinue = "Şununla devam et:";
    finePrint =
      "Devam ederek abonelik şartlarını ve gizlilik politikasını kabul edersiniz. Hesap ayarlarından istediğiniz zaman iptal edebilirsiniz.";
    pricingFootnote =
      "Yerel fiyat ülkeye göre değişebilir: App Store ve Google Play fiyatları para biriminize otomatik olarak dönüştürür.";
    planFallback = "Plan";

    periodMonth = "ay";
    periodYear = "yıl";
  }

  return {
    heroTitle,
    heroSubtitle,
    paymentIntro,

    billingMonthly,
    billingYearly,
    savePill,
    buyMonthly,
    buyYearly,

    securePayments,
    instantAccess,
    cancelAnytime,

    badgeFree,
    badgeMostPopular,
    badgeBestValue,

    planFreeTitle,
    planFreeNote,

    planPremiumTitle,
    planPremiumNoteMonthly,
    planPremiumNoteYearly,

    freeSteps,
    freeAffirmation,
    freeDayForecast,
    freePersonalityBirth,

    pPsychomatrix,
    pFriendView,

    pLifePath,
    pKarmicCode,
    pDestinyAndProblems,
    pDharma,

    pLifeCodeForecast,
    pFutureNumber,
    pFuturePairCompatibility,

    pFateCompatibility,
    pNameCompatibility,
    pKarmicBond,
    paymentSectionPersonality,
    paymentSectionLifeCodes,
    paymentSectionForecasts,
    paymentSectionCompatibility,
    paymentBirthNumber,
    paymentNameNumber,
    paymentPsychomatrixOwn,
    paymentPsychomatrixFriend,
    paymentLifePathCode,
    paymentKarmicCode,
    paymentPurpose,
    paymentPurposeProblem,
    paymentLifeCode,
    paymentFutureNumber,
    paymentPairCompatibility,
    paymentFateCompatibility,
    paymentNameCompatibility,

    freeHint,
    disclaimer,
    restoreButton,
    restoreButtonActive,
    restoreTitle,
    restoreSuccessTitle,
    restoreSuccessMessage,
    restoreEmptyMessage,
    purchaseErrorTitle,
    purchaseErrorMessage,

    ctaContinue,
    finePrint,
    pricingFootnote,
    planFallback,

    periodMonth,
    periodYear,
  };
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 78,
  },

  heroWrap: {
    paddingHorizontal: 0,
    paddingTop: 0,
    backgroundColor: "#FFFFFF",
  },
  heroCard: {
    minHeight: 288,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 18,
    paddingVertical: 18,
    justifyContent: "flex-end",

    ...Platform.select({
      ios: {
        shadowColor: "#0B1220",
        shadowOpacity: 0.16,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
      },
      android: {
        elevation: 6,
      },
    }),
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(7, 16, 32, 0.04)",
  },
  heroGlowTop: {
    position: "absolute",
    top: -30,
    right: -10,
    width: 140,
    height: 140,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.16)",
  },
  heroGlowBottom: {
    position: "absolute",
    bottom: -50,
    left: -20,
    width: 120,
    height: 120,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  heroContent: {
    zIndex: 2,
    gap: 10,
    paddingRight: 12,
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 16,
  },

  title: {
    color: "#FFFFFF",
    fontSize: fs(28),
    fontWeight: "800",
    lineHeight: lh(34),
  },
  subtitle: {
    color: "rgba(255,255,255,0.88)",
    fontSize: fs(14),
    lineHeight: lh(20),
    fontWeight: "500",
  },

  billingButtonsWrap: {
    gap: 10,
    marginTop: 0,
    marginBottom: 2,
  },
  billingBuyBtn: {
    minHeight: 82,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(48,151,242,0.22)",
    backgroundColor: "#FFFFFF",
    gap: 14,
  },
  billingBuyBtnDisabled: {
    opacity: 0.72,
  },
  billingBuyBtnActive: {
    borderColor: "#3097f2",
    backgroundColor: "#3097f2",
  },
  billingBuyInfo: {
    flex: 1,
  },
  billingBuyTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  billingBuyTitle: {
    color: "rgba(0,0,0,0.78)",
    fontWeight: "900",
    fontSize: fs(16),
    lineHeight: lh(20),
  },
  billingBuyTitleActive: {
    color: "#FFFFFF",
  },
  billingBadge: {
    borderRadius: 999,
    backgroundColor: "rgba(48,151,242,0.12)",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  billingBadgeActive: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  billingBadgeText: {
    color: "#3097f2",
    fontSize: fs(10.5),
    fontWeight: "900",
    lineHeight: lh(13),
    textTransform: "capitalize",
  },
  billingBadgeTextActive: {
    color: "#FFFFFF",
  },
  billingBuyPriceRow: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  billingBuyPrice: {
    color: "#3097f2",
    fontSize: fs(22),
    fontWeight: "900",
    lineHeight: lh(25),
  },
  billingBuyPriceActive: {
    color: "#FFFFFF",
  },
  billingBuyOriginal: {
    color: "rgba(0,0,0,0.38)",
    fontSize: fs(12),
    fontWeight: "800",
    lineHeight: lh(15),
    textDecorationLine: "line-through",
    marginBottom: 3,
  },
  billingBuyOriginalActive: {
    color: "rgba(255,255,255,0.7)",
  },
  billingBuyArrow: {
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3097f2",
  },
  billingBuyArrowActive: {
    backgroundColor: "#FFFFFF",
  },

  valueStrip: {
    marginTop: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    flexDirection: "column",
  },
  valueItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  valueText: {
    color: "rgba(0,0,0,0.68)",
    fontSize: fs(12),
    fontWeight: "600",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.18)",
  },

  planCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  planCardHighlight: {},
  planTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  planTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  planTitle: {
    color: "rgba(0,0,0,0.92)",
    fontSize: fs(18),
    fontWeight: "800",
  },
  badge: {
    backgroundColor: "rgba(0,0,0,0.06)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    color: "rgba(0,0,0,0.82)",
    fontSize: fs(12),
    fontWeight: "800",
    textTransform: "capitalize",
  },
  priceRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  planPrice: {
    color: "#3097f2",
    fontSize: fs(26),
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  planPriceOriginal: {
    color: "rgba(0,0,0,0.38)",
    fontSize: fs(16),
    fontWeight: "700",
    textDecorationLine: "line-through",
    marginRight: 8,
    marginBottom: 4,
  },
  planPeriod: {
    color: "rgba(0,0,0,0.55)",
    fontSize: fs(13),
    fontWeight: "700",
    marginLeft: 6,
    marginBottom: 4,
  },
  planNote: {
    marginTop: 6,
    color: "rgba(0,0,0,0.55)",
    fontSize: fs(13),
    lineHeight: lh(18),
  },
  planInnerControls: {
    marginTop: 14,
  },
  planDivider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.06)",
    marginVertical: 14,
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  featureIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  featureIconWrapMuted: {
    backgroundColor: "rgba(0,0,0,0.03)",
  },
  featureText: {
    flex: 1,
    color: "rgba(0,0,0,0.78)",
    fontSize: fs(13.5),
    fontWeight: "600",
    lineHeight: lh(18),
  },
  featureTextMuted: {
    color: "rgba(0,0,0,0.45)",
  },

  moneyCard: {
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  restoreButton: {
    marginTop: 14,
    alignSelf: "flex-start",
  },
  restoreButtonText: {
    color: "#3097f2",
    fontSize: fs(14),
    fontWeight: "800",
    lineHeight: lh(18),
  },
  paymentIntro: {
    color: "rgba(0,0,0,0.92)",
    fontSize: fs(14),
    fontWeight: "800",
    lineHeight: lh(20),
  },
  paymentSection: {
    gap: 10,
  },
  paymentSectionTitle: {
    color: "rgba(0,0,0,0.9)",
    fontSize: fs(14),
    fontWeight: "800",
  },
  paymentBulletList: {
    gap: 10,
  },
  paymentBulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  paymentBulletDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: "#3097f2",
    marginTop: 6,
  },
  paymentBulletText: {
    flex: 1,
    color: "rgba(0,0,0,0.78)",
    fontSize: fs(13.5),
    fontWeight: "600",
    lineHeight: lh(18),
  },
  moneyDivider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.06)",
    marginVertical: 14,
  },
  disclaimer: {
    color: "rgba(0,0,0,0.55)",
    fontSize: fs(12.5),
    lineHeight: lh(18),
  },

  ctaWrap: {
    marginTop: 14,
    paddingBottom: 28,
  },
  ctaBtn: {
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#3097f2",
    alignItems: "center",
    justifyContent: "center",
  },
  ctaBtnText: {
    color: "#FFFFFF",
    fontSize: fs(15),
    fontWeight: "900",
    letterSpacing: 0.2,
  },
  ctaSubText: {
    marginTop: 6,
    color: "rgba(255,255,255,0.78)",
    fontSize: fs(12.5),
    fontWeight: "700",
  },
  finePrint: {
    marginTop: 12,
    color: "rgba(0,0,0,0.45)",
    fontSize: fs(11.5),
    lineHeight: lh(16),
    textAlign: "center",
    paddingHorizontal: 10,
  },

  freeHint: {
    marginTop: 12,
    color: "rgba(0,0,0,0.45)",
    fontSize: fs(11.5),
    lineHeight: lh(16),
  },
});

export default PremiumScreen;
