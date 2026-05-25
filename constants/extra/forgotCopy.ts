type Locale = "tr" | "en" | "ru" | "kz";
export const COPY: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    codeLabel: string;
    codeHint: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    passwordConfirmLabel: string;
    passwordConfirmPlaceholder: string;
    sendCode: string;
    resendCode: string;
    verifyCode: string;
    changePassword: string;
    codeSent: string;
    emailRequired: string;
    invalidEmail: string;
    codeRequired: string;
    codeInvalid: string;
    passwordRequired: string;
    passwordShort: string;
    passwordsMismatch: string;
    back: string;
    loading: string;
    resendIn: string;
    successReset: string;
    autoLoginFailed: string;
    stepEmail: string;
    stepCode: string;
    stepPassword: string;
  }
> = {
  tr: {
    title: "Şifreni yenile",
    subtitle:
      "E-posta adresine 6 haneli doğrulama kodu gönderelim, sonra yeni şifre oluştur.",
    emailLabel: "E-posta",
    emailPlaceholder: "ornek@mail.com",
    codeLabel: "6 haneli kod",
    codeHint: "E-postana gelen 6 haneli kodu gir.",
    passwordLabel: "Yeni şifre",
    passwordPlaceholder: "Yeni şifreni gir",
    passwordConfirmLabel: "Şifreyi tekrar gir",
    passwordConfirmPlaceholder: "Yeni şifreyi tekrar gir",
    sendCode: "Kodu gönder",
    resendCode: "Tekrar gönder",
    verifyCode: "Kodu doğrula",
    changePassword: "Şifreyi değiştir",
    codeSent: "Kod e-posta adresine gönderildi.",
    emailRequired: "E-posta gerekli.",
    invalidEmail: "Geçerli bir e-posta gir.",
    codeRequired: "Kod gerekli.",
    codeInvalid: "Kod 6 haneli olmalı.",
    passwordRequired: "Şifre gerekli.",
    passwordShort: "Şifre en az 6 karakter olmalı.",
    passwordsMismatch: "Şifreler eşleşmiyor.",
    back: "Geri",
    loading: "Yükleniyor...",
    resendIn: "Tekrar gönderme süresi",
    successReset: "Şifre başarıyla değiştirildi.",
    autoLoginFailed:
      "Şifre değişti fakat otomatik giriş başarısız oldu. Lütfen giriş yap.",
    stepEmail: "E-posta",
    stepCode: "Kod",
    stepPassword: "Yeni Şifre",
  },
  en: {
    title: "Reset your password",
    subtitle:
      "We’ll send a 6-digit verification code to your email, then you can set a new password.",
    emailLabel: "Email",
    emailPlaceholder: "example@mail.com",
    codeLabel: "6-digit code",
    codeHint: "Enter the 6-digit code sent to your email.",
    passwordLabel: "New password",
    passwordPlaceholder: "Enter your new password",
    passwordConfirmLabel: "Confirm password",
    passwordConfirmPlaceholder: "Enter your new password again",
    sendCode: "Send code",
    resendCode: "Resend",
    verifyCode: "Verify code",
    changePassword: "Change password",
    codeSent: "The code has been sent to your email.",
    emailRequired: "Email is required.",
    invalidEmail: "Enter a valid email.",
    codeRequired: "Code is required.",
    codeInvalid: "Code must be 6 digits.",
    passwordRequired: "Password is required.",
    passwordShort: "Password must be at least 6 characters.",
    passwordsMismatch: "Passwords do not match.",
    back: "Back",
    loading: "Loading...",
    resendIn: "Resend available in",
    successReset: "Password changed successfully.",
    autoLoginFailed:
      "Password was changed, but auto-login failed. Please log in manually.",
    stepEmail: "Email",
    stepCode: "Code",
    stepPassword: "New Password",
  },
  ru: {
    title: "Сброс пароля",
    subtitle:
      "Мы отправим 6-значный код на email, после этого ты сможешь задать новый пароль.",
    emailLabel: "Email",
    emailPlaceholder: "example@mail.com",
    codeLabel: "6-значный код",
    codeHint: "Введи 6-значный код, который пришёл на почту.",
    passwordLabel: "Новый пароль",
    passwordPlaceholder: "Введи новый пароль",
    passwordConfirmLabel: "Повтори пароль",
    passwordConfirmPlaceholder: "Введи новый пароль ещё раз",
    sendCode: "Отправить код",
    resendCode: "Отправить снова",
    verifyCode: "Подтвердить код",
    changePassword: "Сменить пароль",
    codeSent: "Код отправлен на email.",
    emailRequired: "Email обязателен.",
    invalidEmail: "Введи корректный email.",
    codeRequired: "Код обязателен.",
    codeInvalid: "Код должен состоять из 6 цифр.",
    passwordRequired: "Пароль обязателен.",
    passwordShort: "Пароль должен быть минимум 6 символов.",
    passwordsMismatch: "Пароли не совпадают.",
    back: "Назад",
    loading: "Загрузка...",
    resendIn: "Повторная отправка через",
    successReset: "Пароль успешно изменён.",
    autoLoginFailed:
      "Пароль изменён, но автоматический вход не выполнен. Войди вручную.",
    stepEmail: "Email",
    stepCode: "Код",
    stepPassword: "Новый пароль",
  },
  kz: {
    title: "Құпиясөзді қалпына келтіру",
    subtitle:
      "Email-ға 6 таңбалы код жібереміз, содан кейін жаңа құпиясөз орната аласың.",
    emailLabel: "Email",
    emailPlaceholder: "example@mail.com",
    codeLabel: "6 таңбалы код",
    codeHint: "Email-ға келген 6 таңбалы кодты енгіз.",
    passwordLabel: "Жаңа құпиясөз",
    passwordPlaceholder: "Жаңа құпиясөзді енгіз",
    passwordConfirmLabel: "Құпиясөзді қайтала",
    passwordConfirmPlaceholder: "Жаңа құпиясөзді қайта енгіз",
    sendCode: "Код жіберу",
    resendCode: "Қайта жіберу",
    verifyCode: "Кодты тексеру",
    changePassword: "Құпиясөзді өзгерту",
    codeSent: "Код email-ға жіберілді.",
    emailRequired: "Email міндетті.",
    invalidEmail: "Дұрыс email енгіз.",
    codeRequired: "Код міндетті.",
    codeInvalid: "Код 6 саннан тұруы керек.",
    passwordRequired: "Құпиясөз міндетті.",
    passwordShort: "Құпиясөз кемінде 6 таңба болуы керек.",
    passwordsMismatch: "Құпиясөздер сәйкес емес.",
    back: "Артқа",
    loading: "Жүктелуде...",
    resendIn: "Қайта жіберу уақыты",
    successReset: "Құпиясөз сәтті өзгертілді.",
    autoLoginFailed:
      "Құпиясөз өзгертілді, бірақ автоматты кіру орындалмады. Қолмен кір.",
    stepEmail: "Email",
    stepCode: "Код",
    stepPassword: "Жаңа құпиясөз",
  },
};