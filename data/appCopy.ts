export type AppLanguage = "en" | "kz" | "ru" | "tr";

export const PRIVACY_POLICY_VERSION = "2026-04-15";

type HomeCardCopy = {
  title: string;
  subtitle: string;
};

type PrivacyPolicyCopy = {
  title: string;
  subtitle: string;
  label: string;
  lastUpdatedLabel: string;
  lastUpdatedValue: string;
  registrationConsentPrefix: string;
  registrationConsentLinkLabel: string;
  registrationConsentSuffix?: string;
  loginConsentPrefix: string;
  loginConsentLinkLabel: string;
  loginConsentSuffix?: string;
  consentRequiredHint: string;
  consentRequiredAlert: string;
  markdown: string;
};

type AppCopy = {
  disclaimer: string;
  privacyPolicy: PrivacyPolicyCopy;
  homeCards: {
    matrix: HomeCardCopy;
    prediction: HomeCardCopy;
    compatibility: HomeCardCopy;
  };
};

const SUPPORT_EMAIL = "Bionumknyaz@gmail.com";

const APP_COPY: Record<AppLanguage, AppCopy> = {
  en: {
    disclaimer:
      "This numerology analysis is provided for entertainment and informational purposes only. It is based on interpretations of numbers and does not constitute a scientific method, an exact prediction, or professional advice. Any decisions are made by the user independently.",
    privacyPolicy: {
      title: "Privacy Policy",
      subtitle:
        "How BioNum uses account details, profile data, technical data, and numerology-related activity inside the app.",
      label: "Privacy Policy",
      lastUpdatedLabel: "Last updated",
      lastUpdatedValue: "April 15, 2026",
      registrationConsentPrefix: "I have read and agree to the",
      registrationConsentLinkLabel: "Privacy Policy",
      loginConsentPrefix: "By continuing, you agree to our",
      loginConsentLinkLabel: "Privacy Policy",
      consentRequiredHint:
        "Privacy Policy acceptance is required to finish registration.",
      consentRequiredAlert:
        "Please confirm that you have read and accepted the Privacy Policy before creating your account.",
      markdown: `## Privacy Policy of BioNum

Last updated: April 15, 2026

BioNum (“App”, “we”, “us”) respects your privacy and processes personal data in accordance with applicable data protection laws, including GDPR and KVKK where applicable.

By using BioNum, you confirm that you have read this Privacy Policy and agree to its terms.

## 1. Nature of the Service

BioNum provides numerology content for informational and entertainment purposes only.

The content:

- is not scientifically proven;
- is not an exact prediction;
- is not professional advice.

The user makes any decisions independently based on the information received.

## 2. What Data We Collect

We may process the following personal data.

Data provided by the user:

- first name;
- last name;
- patronymic or middle name, if provided;
- date of birth;
- email address;
- selected language;
- subscription status;
- in-app numerology selections and activity.

This data is used only to operate the app functions and personalize the content.

Technical data:

- IP address;
- device type and operating system;
- language and region;
- app usage data;
- diagnostics, crash, and stability data where applicable.

## 3. Purposes of Data Processing

We use data to:

- provide the app functionality;
- perform numerology calculations;
- create personalized numerology content;
- authenticate your account;
- restore access to your account;
- support purchases and subscriptions;
- personalize the user experience;
- improve and develop the app;
- analyze usage and test new features;
- improve app stability;
- ensure security and prevent misuse;
- respond to support requests.

We may also use data in anonymized or aggregated form for analytics and product improvement.

## 4. Legal Bases for Processing

Data processing may be carried out based on:

- the user’s consent;
- necessity to provide the app services;
- legitimate interests, such as security, analytics, fraud prevention, and app improvement;
- compliance with legal obligations where applicable.

## 5. Third-Party Services and Data Sharing

BioNum may rely on third-party service providers for:

- hosting;
- authentication;
- subscriptions;
- notifications;
- analytics;
- payment-related operations;
- technical infrastructure and support.

These providers may process data only as needed to operate the app and related services.

We may share data:

- with analytics service providers;
- with hosting providers and technical contractors;
- where required by applicable law.

All such parties are expected to maintain confidentiality and protect personal data.

We do not sell personal data.

## 6. International Data Transfers

Data may be processed on servers located outside the user’s country.

In such cases, we take reasonable measures to protect data in accordance with applicable data protection laws.

## 7. Data Retention

We retain personal data only for as long as necessary for:

- operating the app;
- providing app functionality;
- maintaining user accounts;
- supporting purchases and subscriptions;
- complying with legal obligations;
- ensuring security;
- resolving disputes.

After this period, data is deleted or anonymized where appropriate.

## 8. User Rights

The user may have the right to:

- request access to personal data, such as first name, last name, patronymic or middle name, date of birth, email address, and related profile data;
- request correction of personal data;
- request deletion of personal data;
- withdraw consent to processing;
- contact support regarding privacy-related questions.

Requests are processed through support within a reasonable time in accordance with applicable law.

## 9. Data Deletion

The user may request deletion of personal data by contacting support at the email address listed below.

We process such requests within a reasonable time in accordance with applicable law.

Some data may be retained where required for legal, security, payment, or dispute-resolution purposes.

## 10. Data Security

We apply reasonable technical and organizational measures to protect data.

However, no method of data transmission or storage can guarantee absolute security.

## 11. Numerology Content Notice and Limitation of Liability

Numerology content in BioNum is intended for entertainment and informational purposes only.

It should not be treated as:

- scientific fact;
- an exact prediction;
- medical, financial, legal, psychological, or other professional advice.

To the maximum extent permitted by law:

- we do not guarantee the accuracy or completeness of the content;
- we are not responsible for decisions made by the user;
- we are not responsible for indirect or consequential losses that may arise from the use of the app.

## 12. Changes to This Policy

We may update this Privacy Policy from time to time.

The updated version will be published inside the app with the date of the latest update.

## 13. Contact Information

For privacy-related questions, please contact us:

Email: ${SUPPORT_EMAIL}`,
    },
    homeCards: {
      matrix: {
        title: "Life Codes Matrix",
        subtitle:
          "A map of destiny that reveals the energies of birth, life path, karmic tasks, and future potential.",
      },
      prediction: {
        title: "Forecast",
        subtitle:
          "Reveals time energies, future opportunities, lessons, and growth points based on your life codes.",
      },
      compatibility: {
        title: "Compatibility",
        subtitle:
          "Explore relationship dynamics and compatibility scenarios based on your data.",
      },
    },
  },

  ru: {
    disclaimer:
      "Данный нумерологический анализ носит исключительно развлекательный и информационный характер. Он основан на интерпретации чисел и не является научным методом, точным прогнозом или профессиональной рекомендацией. Любые решения принимаются пользователем самостоятельно.",
    privacyPolicy: {
      title: "Политика конфиденциальности",
      subtitle:
        "Как BioNum использует данные аккаунта, профиля, технические данные и действия, связанные с нумерологическим контентом внутри приложения.",
      label: "Политика конфиденциальности",
      lastUpdatedLabel: "Последнее обновление",
      lastUpdatedValue: "15 апреля 2026",
      registrationConsentPrefix: "Я прочитал(а) и принимаю",
      registrationConsentLinkLabel: "Политику конфиденциальности",
      loginConsentPrefix: "Продолжая, вы соглашаетесь с",
      loginConsentLinkLabel: "Политикой конфиденциальности",
      consentRequiredHint:
        "Для завершения регистрации нужно принять Политику конфиденциальности.",
      consentRequiredAlert:
        "Пожалуйста, подтвердите, что вы прочитали и приняли Политику конфиденциальности перед созданием аккаунта.",
      markdown: `## Политика конфиденциальности BioNum

Дата последнего обновления: 15 апреля 2026

BioNum («Приложение», «мы», «нас») уважает вашу конфиденциальность и обрабатывает персональные данные в соответствии с применимым законодательством, включая GDPR и KVKK, если они применимы.

Используя приложение BioNum, вы подтверждаете, что ознакомились с данной Политикой конфиденциальности и согласны с её условиями.

## 1. Характер сервиса

BioNum предоставляет нумерологический контент исключительно в информационных и развлекательных целях.

Контент:

- не является научно доказанным;
- не является точным прогнозом;
- не является профессиональной рекомендацией.

Пользователь самостоятельно принимает решения на основе полученной информации.

## 2. Какие данные мы собираем

Мы можем обрабатывать следующие персональные данные.

Данные, предоставляемые пользователем:

- имя;
- фамилия;
- отчество, при наличии;
- дата рождения;
- адрес электронной почты;
- выбранный язык;
- статус подписки;
- действия и выборы внутри нумерологических разделов приложения.

Эти данные используются исключительно для работы функций приложения и персонализации контента.

Технические данные:

- IP-адрес;
- тип устройства и операционной системы;
- язык и регион;
- данные об использовании приложения;
- диагностические данные, данные о сбоях и стабильности, если применимо.

## 3. Цели обработки данных

Мы используем данные для:

- предоставления функционала приложения;
- выполнения нумерологических расчётов;
- создания персонализированного нумерологического контента;
- авторизации аккаунта;
- восстановления доступа к аккаунту;
- поддержки покупок и подписок;
- персонализации пользовательского опыта;
- улучшения и развития приложения;
- анализа использования и тестирования новых функций;
- улучшения стабильности приложения;
- обеспечения безопасности и предотвращения злоупотреблений;
- ответа на запросы в службу поддержки.

Мы также можем использовать данные в обезличенном или агрегированном виде для аналитики и улучшения продукта.

## 4. Правовые основания обработки

Обработка данных может осуществляться на основании:

- согласия пользователя;
- необходимости для предоставления услуг приложения;
- законных интересов, например безопасности, аналитики, предотвращения злоупотреблений и улучшения приложения;
- выполнения юридических обязательств, если применимо.

## 5. Передача данных третьим лицам

BioNum может использовать сторонние сервисы для:

- хостинга;
- авторизации;
- подписок;
- уведомлений;
- аналитики;
- операций, связанных с оплатой;
- технической инфраструктуры и поддержки.

Такие поставщики могут обрабатывать данные только в объёме, необходимом для работы приложения и связанных сервисов.

Мы можем передавать данные:

- поставщикам аналитических сервисов;
- хостинг-провайдерам и техническим подрядчикам;
- в случаях, предусмотренных законодательством.

Все такие стороны обязаны соблюдать конфиденциальность и обеспечивать защиту персональных данных.

Мы не продаём персональные данные.

## 6. Международная передача данных

Данные могут обрабатываться на серверах за пределами страны пользователя.

В таких случаях мы принимаем разумные меры для защиты данных в соответствии с применимым законодательством о защите персональных данных.

## 7. Срок хранения данных

Мы храним персональные данные только в течение срока, необходимого для:

- функционирования приложения;
- предоставления функций приложения;
- обслуживания аккаунта пользователя;
- поддержки покупок и подписок;
- выполнения юридических обязательств;
- обеспечения безопасности;
- разрешения споров.

После этого данные удаляются или обезличиваются, если это применимо.

## 8. Права пользователя

Пользователь может иметь право:

- запросить доступ к своим персональным данным, таким как имя, фамилия, отчество, дата рождения, email и другие данные профиля;
- запросить исправление персональных данных;
- запросить удаление персональных данных;
- отозвать согласие на обработку;
- обратиться в службу поддержки по вопросам конфиденциальности.

Запросы обрабатываются через службу поддержки в разумные сроки в соответствии с применимым законодательством.

## 9. Удаление данных

Пользователь может запросить удаление своих персональных данных, обратившись в службу поддержки по указанному ниже контактному адресу.

Мы обрабатываем такие запросы в разумные сроки в соответствии с применимым законодательством.

Некоторые данные могут сохраняться, если это необходимо для выполнения юридических обязательств, обеспечения безопасности, обработки платежей или разрешения споров.

## 10. Безопасность данных

Мы применяем разумные технические и организационные меры для защиты данных.

Однако ни один способ передачи или хранения данных не может гарантировать абсолютную безопасность.

## 11. Уведомление о нумерологическом контенте и ограничение ответственности

Нумерологический контент в BioNum предназначен только для развлекательных и информационных целей.

Его не следует воспринимать как:

- научный факт;
- точный прогноз;
- медицинскую, финансовую, юридическую, психологическую или иную профессиональную рекомендацию.

В максимально допустимой законом степени:

- мы не гарантируем точность или полноту контента;
- мы не несём ответственности за решения, принятые пользователем;
- мы не несём ответственности за возможные косвенные или последующие убытки, связанные с использованием приложения.

## 12. Изменения политики

Мы можем время от времени обновлять данную Политику конфиденциальности.

Обновлённая версия публикуется в приложении с указанием даты последнего обновления.

## 13. Контактная информация

По вопросам конфиденциальности свяжитесь с нами:

Email: ${SUPPORT_EMAIL}`,
    },
    homeCards: {
      matrix: {
        title: "Матрица жизненных кодов",
        subtitle:
          "Это карта судьбы, раскрывающая энергии рождения, жизненный путь, кармические задачи и потенциал будущего.",
      },
      prediction: {
        title: "Прогноз",
        subtitle:
          "Раскрывает энергии времени, будущие возможности, уроки и точки роста на основе ваших жизненных кодов.",
      },
      compatibility: {
        title: "Совместимость",
        subtitle:
          "Помогает увидеть динамику отношений, общие задачи пары и потенциал союза на основе ваших данных.",
      },
    },
  },

  kz: {
    disclaimer:
      "Бұл нумерологиялық талдау тек ойын-сауық және ақпараттық мақсаттарға арналған. Ол сандарды интерпретациялауға негізделген және ғылыми әдіс, нақты болжам немесе кәсіби кеңес болып табылмайды. Кез келген шешімді пайдаланушы өз бетінше қабылдайды.",
    privacyPolicy: {
      title: "Құпиялылық саясаты",
      subtitle:
        "BioNum қолданба ішіндегі аккаунт, профиль, техникалық деректер және нумерологияға қатысты әрекеттер деректерін қалай қолданатыны туралы.",
      label: "Құпиялылық саясаты",
      lastUpdatedLabel: "Соңғы жаңарту",
      lastUpdatedValue: "2026 жылғы 15 сәуір",
      registrationConsentPrefix: "Мен",
      registrationConsentLinkLabel: "Құпиялылық саясатын",
      registrationConsentSuffix: "оқып, қабылдаймын",
      loginConsentPrefix: "Жалғастыру арқылы сіз",
      loginConsentLinkLabel: "Құпиялылық саясатымен",
      loginConsentSuffix: "келісесіз",
      consentRequiredHint:
        "Тіркеуді аяқтау үшін Құпиялылық саясатын қабылдау қажет.",
      consentRequiredAlert:
        "Аккаунт жасамас бұрын Құпиялылық саясатын оқып, қабылдағаныңызды растаңыз.",
      markdown: `## BioNum құпиялылық саясаты

Соңғы жаңарту күні: 2026 жылғы 15 сәуір

BioNum («Қолданба», «біз») сіздің құпиялылығыңызды құрметтейді және жеке деректерді қолданылатын заңнамаға, соның ішінде қажет болған жағдайда GDPR және KVKK талаптарына сәйкес өңдейді.

BioNum қолданбасын пайдалану арқылы сіз осы Құпиялылық саясатымен танысқаныңызды және оның шарттарымен келісетініңізді растайсыз.

## 1. Қызметтің сипаты

BioNum нумерологиялық контентті тек ақпараттық және ойын-сауық мақсаттарында ұсынады.

Контент:

- ғылыми түрде дәлелденген ақпарат емес;
- нақты болжам емес;
- кәсіби кеңес емес.

Пайдаланушы алынған ақпарат негізінде кез келген шешімді өз бетінше қабылдайды.

## 2. Біз қандай деректерді жинаймыз

Біз келесі жеке деректерді өңдеуіміз мүмкін.

Пайдаланушы ұсынатын деректер:

- аты;
- тегі;
- әкесінің аты немесе орта аты, егер берілсе;
- туған күні;
- электрондық пошта мекенжайы;
- таңдалған тіл;
- жазылым күйі;
- қолданба ішіндегі нумерология бөлімдеріндегі әрекеттер мен таңдаулар.

Бұл деректер қолданба функцияларын іске қосу және контентті жекелендіру үшін ғана пайдаланылады.

Техникалық деректер:

- IP мекенжайы;
- құрылғы түрі және операциялық жүйе;
- тіл және аймақ;
- қолданбаны пайдалану деректері;
- қажет болған жағдайда диагностика, қателер және тұрақтылық деректері.

## 3. Деректерді өңдеу мақсаттары

Біз деректерді келесі мақсаттарда пайдаланамыз:

- қолданба функционалын ұсыну;
- нумерологиялық есептеулерді орындау;
- жекелендірілген нумерологиялық контент жасау;
- аккаунтқа кіруді ұйымдастыру;
- аккаунтқа қолжетімділікті қалпына келтіру;
- сатып алулар мен жазылымдарды қолдау;
- пайдаланушы тәжірибесін жекелендіру;
- қолданбаны жақсарту және дамыту;
- пайдалануды талдау және жаңа функцияларды тестілеу;
- қолданбаның тұрақтылығын жақсарту;
- қауіпсіздікті қамтамасыз ету және теріс пайдаланудың алдын алу;
- қолдау сұрауларына жауап беру.

Біз деректерді өнімді жақсарту және аналитика мақсатында иесіздендірілген немесе жинақталған түрде де пайдалануымыз мүмкін.

## 4. Деректерді өңдеудің құқықтық негіздері

Деректерді өңдеу келесі негіздерге сүйенуі мүмкін:

- пайдаланушының келісімі;
- қолданба қызметтерін ұсыну қажеттілігі;
- заңды мүдделер, мысалы қауіпсіздік, аналитика, теріс пайдаланудың алдын алу және қолданбаны жақсарту;
- қажет болған жағдайда заңды міндеттемелерді орындау.

## 5. Үшінші тарап сервистері және деректерді беру

BioNum келесі мақсаттар үшін үшінші тарап қызметтерін қолдануы мүмкін:

- хостинг;
- авторизация;
- жазылымдар;
- хабарландырулар;
- аналитика;
- төлемге қатысты операциялар;
- техникалық инфрақұрылым және қолдау.

Мұндай провайдерлер деректерді тек қолданбаның және байланысты сервистердің жұмысын қамтамасыз ету үшін қажетті көлемде өңдей алады.

Біз деректерді келесі тараптарға беруіміз мүмкін:

- аналитикалық сервис провайдерлеріне;
- хостинг-провайдерлерге және техникалық мердігерлерге;
- заңнама талап еткен жағдайларда.

Мұндай тараптар құпиялылықты сақтауы және жеке деректерді қорғауы тиіс.

Біз жеке деректерді сатпаймыз.

## 6. Халықаралық деректер беру

Деректер пайдаланушы елінен тыс орналасқан серверлерде өңделуі мүмкін.

Мұндай жағдайларда біз деректерді қолданылатын деректерді қорғау заңнамасына сәйкес қорғау үшін ақылға қонымды шаралар қабылдаймыз.

## 7. Деректерді сақтау мерзімі

Біз жеке деректерді тек келесі мақсаттарға қажет мерзім ішінде сақтаймыз:

- қолданбаның жұмыс істеуі;
- қолданба функцияларын ұсыну;
- пайдаланушы аккаунтын жүргізу;
- сатып алулар мен жазылымдарды қолдау;
- заңды міндеттемелерді орындау;
- қауіпсіздікті қамтамасыз ету;
- дауларды шешу.

Осы мерзім аяқталғаннан кейін деректер жойылады немесе қажет болған жағдайда иесіздендіріледі.

## 8. Пайдаланушы құқықтары

Пайдаланушының келесі құқықтары болуы мүмкін:

- аты, тегі, әкесінің аты немесе орта аты, туған күні, email және басқа профиль деректері сияқты жеке деректерге қол жеткізуді сұрау;
- жеке деректерді түзетуді сұрау;
- жеке деректерді жоюды сұрау;
- деректерді өңдеуге берілген келісімді қайтарып алу;
- құпиялылыққа қатысты сұрақтар бойынша қолдау қызметіне хабарласу.

Сұраулар қолданылатын заңнамаға сәйкес ақылға қонымды мерзім ішінде қолдау қызметі арқылы өңделеді.

## 9. Деректерді жою

Пайдаланушы төменде көрсетілген байланыс мекенжайы арқылы қолдау қызметіне хабарласып, жеке деректерін жоюды сұрай алады.

Біз мұндай сұрауларды қолданылатын заңнамаға сәйкес ақылға қонымды мерзім ішінде өңдейміз.

Кейбір деректер заңды міндеттемелерді орындау, қауіпсіздікті қамтамасыз ету, төлемдерді өңдеу немесе дауларды шешу үшін қажет болған жағдайда сақталуы мүмкін.

## 10. Деректер қауіпсіздігі

Біз деректерді қорғау үшін ақылға қонымды техникалық және ұйымдастырушылық шараларды қолданамыз.

Алайда деректерді беру немесе сақтау тәсілдерінің ешқайсысы абсолютті қауіпсіздікке кепілдік бере алмайды.

## 11. Нумерологиялық контент туралы ескерту және жауапкершілікті шектеу

BioNum ішіндегі нумерологиялық контент тек ойын-сауық және ақпараттық мақсаттарға арналған.

Оны келесілер ретінде қабылдауға болмайды:

- ғылыми факт;
- нақты болжам;
- медициналық, қаржылық, заңгерлік, психологиялық немесе басқа кәсіби кеңес.

Заңмен рұқсат етілген ең жоғары дәрежеде:

- біз контенттің дәлдігіне немесе толықтығына кепілдік бермейміз;
- пайдаланушы қабылдаған шешімдер үшін жауап бермейміз;
- қолданбаны пайдаланудан туындауы мүмкін жанама немесе кейінгі шығындар үшін жауап бермейміз.

## 12. Осы саясаттағы өзгерістер

Біз осы Құпиялылық саясатын уақыт өте келе жаңарта аламыз.

Жаңартылған нұсқа қолданба ішінде соңғы жаңарту күнімен бірге жарияланады.

## 13. Байланыс ақпараты

Құпиялылыққа қатысты сұрақтар бойынша бізге хабарласыңыз:

Email: ${SUPPORT_EMAIL}`,
    },
    homeCards: {
      matrix: {
        title: "Өмір кодтарының матрицасы",
        subtitle:
          "Бұл туған энергияны, өмір жолын, кармалық міндеттерді және болашақ әлеуетті ашатын тағдыр картасы.",
      },
      prediction: {
        title: "Болжам",
        subtitle:
          "Өмір кодтарыңызға сүйеніп, уақыт энергиясын, болашақ мүмкіндіктерді, сабақтарды және өсу нүктелерін ашады.",
      },
      compatibility: {
        title: "Үйлесімділік",
        subtitle:
          "Деректеріңіз негізінде қарым-қатынас динамикасын, жұптың ортақ міндеттерін және одақ әлеуетін көруге көмектеседі.",
      },
    },
  },

  tr: {
    disclaimer:
      "Bu numeroloji analizi yalnızca eğlence ve bilgilendirme amaçlıdır. Sayıların yorumlanmasına dayanır ve bilimsel bir yöntem, kesin bir tahmin veya profesyonel bir tavsiye değildir. Her türlü karar kullanıcı tarafından bağımsız olarak verilir.",
    privacyPolicy: {
      title: "Gizlilik Politikası",
      subtitle:
        "BioNum'un uygulama içindeki hesap, profil, teknik veriler ve numerolojiyle ilgili etkinlik verilerini nasıl kullandığı.",
      label: "Gizlilik Politikası",
      lastUpdatedLabel: "Son güncelleme",
      lastUpdatedValue: "15 Nisan 2026",
      registrationConsentPrefix: "Şunu okudum ve kabul ediyorum:",
      registrationConsentLinkLabel: "Gizlilik Politikası",
      loginConsentPrefix: "Devam ederek",
      loginConsentLinkLabel: "Gizlilik Politikamızı",
      loginConsentSuffix: "kabul etmiş olursunuz",
      consentRequiredHint:
        "Kaydı tamamlamak için Gizlilik Politikası kabul edilmelidir.",
      consentRequiredAlert:
        "Lütfen hesabınızı oluşturmadan önce Gizlilik Politikası'nı okuyup kabul ettiğinizi onaylayın.",
      markdown: `## BioNum Gizlilik Politikası

Son güncelleme tarihi: 15 Nisan 2026

BioNum (“Uygulama”, “biz”) gizliliğinize saygı duyar ve kişisel verileri, uygulanabilir olduğu durumlarda GDPR ve KVKK dahil olmak üzere geçerli veri koruma mevzuatına uygun olarak işler.

BioNum uygulamasını kullanarak bu Gizlilik Politikası'nı okuduğunuzu ve şartlarını kabul ettiğinizi onaylarsınız.

## 1. Hizmetin Niteliği

BioNum numeroloji içeriklerini yalnızca bilgilendirme ve eğlence amaçlı sunar.

İçerik:

- bilimsel olarak kanıtlanmış değildir;
- kesin bir tahmin değildir;
- profesyonel bir tavsiye değildir.

Kullanıcı, aldığı bilgilere dayanarak tüm kararları bağımsız olarak verir.

## 2. Hangi Verileri Topluyoruz

Aşağıdaki kişisel verileri işleyebiliriz.

Kullanıcı tarafından sağlanan veriler:

- ad;
- soyad;
- varsa ikinci ad veya patronimik bilgi;
- doğum tarihi;
- e-posta adresi;
- seçilen dil;
- abonelik durumu;
- uygulama içindeki numeroloji bölümlerindeki seçimler ve etkinlikler.

Bu veriler yalnızca uygulama işlevlerinin çalışması ve içeriğin kişiselleştirilmesi için kullanılır.

Teknik veriler:

- IP adresi;
- cihaz türü ve işletim sistemi;
- dil ve bölge;
- uygulama kullanım verileri;
- uygulanabilir olduğu durumlarda tanılama, çökme ve kararlılık verileri.

## 3. Verileri İşleme Amaçlarımız

Verileri şu amaçlarla kullanırız:

- uygulama işlevlerini sağlamak;
- numerolojik hesaplamalar yapmak;
- kişiselleştirilmiş numeroloji içeriği oluşturmak;
- hesabınızı doğrulamak;
- hesaba erişimi geri yüklemek;
- satın alma ve abonelikleri desteklemek;
- kullanıcı deneyimini kişiselleştirmek;
- uygulamayı geliştirmek ve iyileştirmek;
- kullanım analizleri yapmak ve yeni özellikleri test etmek;
- uygulama kararlılığını iyileştirmek;
- güvenliği sağlamak ve kötüye kullanımı önlemek;
- destek taleplerini yanıtlamak.

Verileri ayrıca analiz ve ürün iyileştirme amacıyla anonimleştirilmiş veya toplulaştırılmış şekilde kullanabiliriz.

## 4. Veri İşlemenin Hukuki Dayanakları

Veri işleme aşağıdaki dayanaklara bağlı olarak gerçekleştirilebilir:

- kullanıcının rızası;
- uygulama hizmetlerini sağlamak için gereklilik;
- güvenlik, analiz, kötüye kullanımı önleme ve uygulama iyileştirme gibi meşru menfaatler;
- uygulanabilir olduğu durumlarda yasal yükümlülüklere uyum.

## 5. Üçüncü Taraf Hizmetler ve Veri Paylaşımı

BioNum aşağıdaki amaçlarla üçüncü taraf hizmet sağlayıcılarından yararlanabilir:

- barındırma;
- kimlik doğrulama;
- abonelikler;
- bildirimler;
- analiz;
- ödeme ile ilgili işlemler;
- teknik altyapı ve destek.

Bu sağlayıcılar verileri yalnızca uygulamanın ve ilgili hizmetlerin çalışması için gerekli olduğu ölçüde işleyebilir.

Verileri şu taraflarla paylaşabiliriz:

- analiz hizmeti sağlayıcıları;
- barındırma sağlayıcıları ve teknik yükleniciler;
- kanunen gerekli olan durumlarda yetkili taraflar.

Bu tarafların gizliliğe uyması ve kişisel verileri koruması beklenir.

Kişisel verileri satmayız.

## 6. Uluslararası Veri Aktarımı

Veriler, kullanıcının ülkesinin dışında bulunan sunucularda işlenebilir.

Bu durumlarda verileri geçerli veri koruma mevzuatına uygun şekilde korumak için makul önlemler alırız.

## 7. Veri Saklama Süresi

Kişisel verileri yalnızca aşağıdaki amaçlar için gerekli olduğu süre boyunca saklarız:

- uygulamanın çalışması;
- uygulama işlevlerinin sağlanması;
- kullanıcı hesabının yönetimi;
- satın alma ve abonelik desteği;
- yasal yükümlülüklere uyum;
- güvenliğin sağlanması;
- uyuşmazlıkların çözülmesi.

Bu sürenin sonunda veriler silinir veya uygun olduğu durumlarda anonimleştirilir.

## 8. Kullanıcı Hakları

Kullanıcı aşağıdaki haklara sahip olabilir:

- ad, soyad, varsa ikinci ad veya patronimik bilgi, doğum tarihi, email ve diğer profil verileri gibi kişisel verilere erişim talep etme;
- kişisel verilerin düzeltilmesini talep etme;
- kişisel verilerin silinmesini talep etme;
- veri işlemeye verilen rızayı geri çekme;
- gizlilikle ilgili sorular için destek birimiyle iletişime geçme.

Talepler, geçerli mevzuata uygun olarak makul süre içinde destek birimi aracılığıyla işlenir.

## 9. Veri Silme

Kullanıcı, aşağıda belirtilen iletişim adresinden destek birimine ulaşarak kişisel verilerinin silinmesini talep edebilir.

Bu talepleri geçerli mevzuata uygun şekilde makul süre içinde işleriz.

Bazı veriler, yasal yükümlülükler, güvenlik, ödeme işlemleri veya uyuşmazlık çözümü için gerekli olması halinde saklanabilir.

## 10. Veri Güvenliği

Verileri korumak için makul teknik ve organizasyonel önlemler uygularız.

Ancak hiçbir veri aktarımı veya saklama yöntemi mutlak güvenlik garanti edemez.

## 11. Numeroloji İçeriği Uyarısı ve Sorumluluğun Sınırlandırılması

BioNum içindeki numeroloji içerikleri yalnızca eğlence ve bilgilendirme amaçlıdır.

Bu içerikler şu şekilde değerlendirilmemelidir:

- bilimsel gerçek;
- kesin tahmin;
- tıbbi, finansal, hukuki, psikolojik veya başka bir profesyonel tavsiye.

Kanunen izin verilen azami ölçüde:

- içeriğin doğruluğunu veya eksiksizliğini garanti etmeyiz;
- kullanıcı tarafından alınan kararlardan sorumlu değiliz;
- uygulamanın kullanımından kaynaklanabilecek dolaylı veya sonuçsal zararlardan sorumlu değiliz.

## 12. Bu Politikadaki Değişiklikler

Bu Gizlilik Politikası'nı zaman zaman güncelleyebiliriz.

Güncellenmiş sürüm, son güncelleme tarihiyle birlikte uygulama içinde yayınlanır.

## 13. İletişim Bilgileri

Gizlilikle ilgili sorular için bizimle iletişime geçin:

Email: ${SUPPORT_EMAIL}`,
    },
    homeCards: {
      matrix: {
        title: "Yaşam Kodları Matrisi",
        subtitle:
          "Doğum enerjilerini, yaşam yolunu, karmik görevleri ve geleceğin potansiyelini ortaya çıkaran bir kader haritası.",
      },
      prediction: {
        title: "Tahmin",
        subtitle:
          "Yaşam kodlarınıza dayanarak zamanın enerjilerini, gelecekteki fırsatları, dersleri ve büyüme alanlarını ortaya çıkarır.",
      },
      compatibility: {
        title: "Uyumluluk",
        subtitle:
          "Verilerinize göre ilişki dinamiklerini, ortak dersleri ve birlik potansiyelini keşfetmenize yardımcı olur.",
      },
    },
  },
};

export const isAppLanguage = (value?: string): value is AppLanguage => {
  return value === "en" || value === "kz" || value === "ru" || value === "tr";
};

export const normalizeAppLanguage = (value?: string): AppLanguage => {
  if (!value) return "en";

  const normalized = value.toLowerCase();

  if (normalized === "kk") return "kz";
  if (isAppLanguage(normalized)) return normalized;

  return "en";
};

export const getAppCopy = (value?: string) => {
  return APP_COPY[normalizeAppLanguage(value)];
};
