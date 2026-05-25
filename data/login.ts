import { I18n } from "i18n-js";

export const i18n = new I18n({
  en: {
    welcomeBack: "Welcome back!",
    loginSubtitle: "Sign in to your account",
    email: "Email",
    password: "Password",
    forgotPassword: "Forgot password?",
    login: "Login",
    noAccount: "Don't have an account?",
    register: "Register",
    privacyPolicy:
      "By continuing, you agree to our Terms of Service and Privacy Policy.",
  },
  ru: {
    welcomeBack: "Добро пожаловать обратно!",
    loginSubtitle: "Войдите в свой аккаунт",
    email: "Email",
    password: "Пароль",
    forgotPassword: "Забыли пароль?",
    login: "Войти",
    noAccount: "Нет аккаунта?",
    register: "Зарегистрироваться",
    privacyPolicy:
      "Продолжая, вы соглашаетесь с нашими Условиями обслуживания и Политикой конфиденциальности.",
  },
  kz: {
    welcomeBack: "Қайта қош келдіңіз!",
    loginSubtitle: "Есептік жазбаға кіріңіз",
    email: "Email",
    password: "Құпия сөз",
    forgotPassword: "Құпия сөзді ұмыттыңыз ба?",
    login: "Кіру",
    noAccount: "Аккаунт жоқ па?",
    register: "Тіркелу",
    privacyPolicy:
      "Жалғастыру арқылы сіз біздің Қызмет көрсету шарттарымызбен және Құпиялылық саясатымызбен келісесіз.",
  },
  tr: {
    welcomeBack: "Tekrar hoş geldiniz!",
    loginSubtitle: "Hesabınıza giriş yapın",
    email: "Email",
    password: "Şifre",
    forgotPassword: "Şifrenizi mi unuttunuz?",
    login: "Giriş yap",
    noAccount: "Hesabınız yok mu?",
    register: "Kayıt ol",
    privacyPolicy:
      "Devam ederek Hizmet Şartlarımızı ve Gizlilik Politikamızı kabul etmiş olursunuz.",
  },
});


i18n.enableFallback = true;
i18n.defaultLocale = "en";