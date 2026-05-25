export type Locale = "ru" | "en" | "tr" | "kz";

type PairText = Record<number, { title: string; body: string }>;

type Strings = {
  title: string;
  subtitle: string;

  partner1LabelDefault: string;
  partner2LabelDefault: string;

  cardResultTitle: string;
  note: string;

  p1: {
    cardTitle: string;
    firstNameLabel: string;
    lastNameLabel: string;
    middleNameLabel: string;
    firstNamePlaceholder: string;
    lastNamePlaceholder: string;
    middleNamePlaceholder: string;
    fioLabel: string;
    fioNumberLabel: string;
    unknownCharsHintPrefix: string; // "Не учтены символы: "
    unknownCharsHintSuffix: string; // "(используйте кириллицу)"
  };

  p2: {
    cardTitle: string;
    firstNameLabel: string;
    lastNameLabel: string;
    middleNameLabel: string;
    firstNamePlaceholder: string;
    lastNamePlaceholder: string;
    middleNamePlaceholder: string;
    fioLabel: string;
    fioNumberLabel: string;
    unknownCharsHintPrefix: string;
    unknownCharsHintSuffix: string;
  };

  result: {
    partner1Number: string;
    partner2Number: string;
    pairNumber: string;
    fillBothHint: string;
  };

  pairText: PairText;
};

export const STRINGS: Record<Locale, Strings> = {
  ru: {
    title: "Расчёт числа пары по ФИО",
    subtitle:
      "Введите ФИО двух партнёров. Мы считаем число каждого ФИО и затем число пары.",

    partner1LabelDefault: "Имя первого партнёра",
    partner2LabelDefault: "Имя второго партнёра",

    cardResultTitle: "Результат расчёта числа пары",
    note: "* Расчёт носит ознакомительный характер и не является научным.",

    p1: {
      cardTitle: "Партнёр 1",
      firstNameLabel: "Имя",
      lastNameLabel: "Фамилия",
      middleNameLabel: "Отчество",
      firstNamePlaceholder: "Введите имя",
      lastNamePlaceholder: "Введите фамилию",
      middleNamePlaceholder: "Введите отчество",
      fioLabel: "ФИО",
      fioNumberLabel: "Число ФИО",
      unknownCharsHintPrefix: " Не учтены символы: ",
      unknownCharsHintSuffix: " (используйте кириллицу)",
    },

    p2: {
      cardTitle: "Партнёр 2",
      firstNameLabel: "Имя",
      lastNameLabel: "Фамилия",
      middleNameLabel: "Отчество",
      firstNamePlaceholder: "Введите имя",
      lastNamePlaceholder: "Введите фамилию",
      middleNamePlaceholder: "Введите отчество",
      fioLabel: "ФИО",
      fioNumberLabel: "Число ФИО",
      unknownCharsHintPrefix: " Не учтены символы: ",
      unknownCharsHintSuffix: " (используйте кириллицу)",
    },

    result: {
      partner1Number: "Число первого партнёра",
      partner2Number: "Число второго партнёра",
      pairNumber: "Число пары",
      fillBothHint: "Заполните оба поля",
    },

    pairText: {
      1: {
        title: "Число пары 1",
        body: `Вместе вы представляете собой мощную силу и способны сосредоточить в своих руках значительное влияние. Главное — распоряжаться этим потенциалом разумно и осознанно. У вас есть все шансы построить семью, основанную на здравом смысле, где во всём будут царить порядок, структура и гармония. В деловой сфере вы образуете почти идеальный союз лидеров — руководителей, первых лиц компании или любой другой структуры.

В паре вы умеете рождать сильные, нестандартные идеи и становитесь своеобразным интеллектуальным центром, который задаёт направление и обеспечивает успех общему делу. При этом вы способны проявлять себя не только в стратегическом мышлении, но и в практических задачах, особенно если действуете сообща и согласованно.

Возможна и совместная творческая деятельность — например, соавторство в искусстве или литературе. Вы легко понимаете друг друга без лишних слов и умеете поддерживать вдохновение и творческий импульс партнёра. Ключевая задача для вас — найти общие идеи и сформировать единое мировоззрение, избегая давления и навязывания своей позиции.

`,
      },
      2: {
        title: "Число пары 2",
        body: `Это союз, основанный на гармонии, спокойствии и умении слышать друг друга. В таких отношениях партнёры склонны к взаимопониманию, эмпатии и готовности идти навстречу, когда этого требует ситуация. При таком подходе вы способны создать крепкий и счастливый брак, в котором любые трудности решаются без конфликтов, а атмосфера дома остаётся тёплой и уютной.

Если рассматривать вас как деловых партнёров, наилучшие результаты вы покажете при равноправном сотрудничестве — без жёсткой иерархии «начальник–подчинённый». Каждый из вас готов одинаково вкладываться в общее дело, работать с полной отдачей и честно делить ответственность, успехи и вознаграждение. Особенно успешно такой союз проявляет себя в сферах, связанных с помощью людям, сервисом, заботой и поддержкой.

Ключ к вашему успеху — это командная работа и взаимная поддержка. Важно действовать ради общей цели, не стремясь доминировать или превосходить партнёра, а равномерно разделяя и труд, и заботы, и результаты. Умение слушать, уважать и учитывать мнение друг друга поможет вам найти множество точек соприкосновения и создать по-настоящему прочный и гармоничный союз.`,
      },
      3: {
        title: "Число пары 3",
        body: `Это союз ярких, эмоциональных и харизматичных людей — по-настоящему «звёздная» пара, которая легко оказывается в центре внимания. Вместе вы способны обрести признание и популярность, потому что несёте с собой атмосферу праздника, лёгкости и веселья. Между вами возможна глубокая, страстная связь, наполненная сильными переживаниями и бурей чувств.

В деловой сфере ваш союз особенно удачен там, где важна публичность и самовыражение. Вы можете успешно реализоваться в творчестве и искусстве: выступать на сцене, петь, танцевать, работать на телевидении или радио. Совместное ведение шоу, преподавание, организация мероприятий или любая деятельность, требующая быть на виду, будет усиливать ваши способности — рядом друг с другом ваши таланты раскрываются многократно.

Ключевая задача для вас — избегать внутреннего соперничества и объединять усилия ради общей цели, а не личной славы каждого. Важно также направлять мощную энергию вашей пары в созидание: вместо конфликтов по мелочам выбирать творчество, любовь и вдохновение, делясь радостью с собой и окружающими.

`,
      },
      4: {
        title: "Число пары 4",
        body: `Этот союз способен стать очень крепким и устойчивым с практической точки зрения. Вы можете создать надёжное партнёрство, ориентированное на результат и достижение общих задач, где ценятся дисциплина, ответственность и трудолюбие. Однако в таких отношениях обычно не хватает эмоциональной глубины, душевного тепла и искреннего общения, поэтому для романтического или семейного союза они подходят слабо. Исключением может быть брак, основанный на расчёте и выгоде, но тогда эмоциональную сторону жизни придётся восполнять вне этих отношений.

В деловой сфере вы проявляете себя максимально эффективно. В вашей работе царит порядок, чёткость и контроль: задачи выполняются точно, грамотно и в установленные сроки, без лишних рисков и ошибок. Наиболее благоприятные направления для вас — практичные и структурированные области, где важны расчёт, стабильность и материальный результат: бизнес, финансы, строительство, управление.

Для успешного взаимодействия вам необходимы общие цели и совпадающие интересы. В этом случае вы действуете слаженно, уверенно и последовательно, способны долго и упорно работать, не отвлекаясь и не сомневаясь в выбранном пути.

`,
      },
      5: {
        title: "Число пары 5",
        body: `С таким союзом скука вам точно не грозит, однако о стабильности говорить не приходится. Ваша пара живёт в ритме спонтанности и постоянных перемен: неожиданности, импульсивные решения и непрерывные приключения становятся естественной частью отношений. Классический формат брака здесь маловероятен, зато возможны яркие, насыщенные эмоциями и свободные романтические отношения.

В деловой сфере вы особенно сильны там, где требуется гибкость, скорость реакции и умение мгновенно подстраиваться под меняющиеся обстоятельства. Вы отлично сработаетесь в проектах, связанных с динамикой, риском, поездками и сменой обстановки, поскольку оба легко относитесь к переменам и способны вдохновлять друг друга на движение вперёд.

Ключевое условие для вашего союза — найти общее занятие, которое по-настоящему захватывает вас обоих. Стоит выбирать только то, что приносит удовольствие и дарит сильные эмоции. Рутинная и однообразная деятельность для вас губительна: именно разнообразие, новизна и поток впечатлений помогают сохранять интерес друг к другу и удерживают вас вместе.`,
      },
      6: {
        title: "Число пары 6",
        body: `Этот союз особенно гармоничен для семейной жизни. Между вами легко создаётся атмосфера уюта, покоя и внутреннего равновесия. Вы умеете проявлять внимание и заботу друг о друге, а ваши дети и близкие будут чувствовать себя любимыми, защищёнными и окружёнными теплом.

В профессиональной сфере вы также способны успешно взаимодействовать, особенно в направлениях, связанных с поддержкой людей, уходом, воспитанием, обучением, а также с организацией пространства и созданием порядка. Важно лишь, чтобы работа не требовала постоянной спешки, частых перемещений и не была наполнена стрессом и хаосом.

Для вашего союза значимо найти общее дело, которое вы готовы делать от сердца, не ожидая немедленной выгоды. Совместная благотворительная деятельность или помощь другим может стать тем, что ещё больше сблизит вас и укрепит внутреннюю связь.

`,
      },
      7: {
        title: "Число пары 7",
        body: `В основе этого союза лежит прежде всего интеллектуальная связь. Если вам интересно общаться, вы можете часами обсуждать одни и те же темы и разделяете схожие взгляды и ценности, между вами способна сложиться глубокая, содержательная дружба. Для ярких романтических отношений и брака здесь может не хватать страсти и эмоциональной выразительности, однако для вас взаимопонимание и духовная близость могут оказаться важнее чувств, и именно на этом фундаменте возможна семья.

В профессиональной сфере вас объединят занятия, требующие сосредоточенности, анализа и вдумчивого подхода. Вы хорошо проявите себя в науке, искусстве, философии, писательской деятельности, проведении семинаров по психологии и личностному развитию, а также в работе, связанной с природой и уединением.

Для гармонии в союзе важно научиться относиться к жизни легче, поддерживать друг друга в периоды сомнений и упадка настроения и находить общие занятия, приносящие радость. В противном случае есть риск замкнуться в себе и погрузиться в состояние меланхолии.`,
      },
      8: {
        title: "Число пары 8",
        body: `В этом союзе вы способны добиться значительно большего, чем каждый из вас по отдельности. Объединяя свои силы, таланты и внутреннюю энергию, вы открываете путь к успеху, изобилию и реализации масштабных замыслов. Вам под силу рождать сильные идеи, запускать крупные проекты, доводить их до высокого уровня и достигать устойчивого материального благополучия.

Романтические и семейные отношения в такой паре возможны, но их прочность напрямую связана с совместной деятельностью, общими целями и единым вектором развития. Именно общее дело становится фундаментом вашего союза.

Наибольший успех вам приносит любая честная и социально значимая деятельность. Это может быть бизнес, предпринимательство, а также сферы, связанные с культурой, искусством, психологией, юриспруденцией, гуманитарными и социальными проектами. Вместе вы способны помогать людям, защищать их интересы, восстанавливать справедливость и поддерживать тех, кто в этом нуждается.

Ключевой момент для вашей пары — не превращать деньги в главную цель и не стремиться к прибыли любой ценой. Финансовый достаток придёт сам и в значительных объёмах, если вы будете работать ради идеи, смысла и высоких моральных принципов.`,
      },
      9: {
        title: "Число пары 9",
        body: `Этот союз не создан для спокойной, оседлой жизни. Вам сложно довольствоваться уже достигнутым — вы пара искателей, новаторов и первооткрывателей. Классическое представление о доме и семье может оказаться для вас тесным, зато возможен яркий, насыщенный союз людей, которые постоянно получают новый опыт, проживают сильные впечатления и открывают для себя неизведанное.

Наибольшего успеха вы добиваетесь в сферах, связанных с путешествиями, изучением культур и образа жизни разных стран и народов, а также в научных и исследовательских направлениях, где остаётся много вопросов и пространства для открытий. Вас притягивает деятельность, требующая анализа, расследований, погружения в тайны и поиска ответов на сложные загадки.

Как бы сильно вас ни увлекали поиски знаний и истины, важно сохранять внимание и заботу друг о друге. Поддержка, совместное преодоление трудностей и умение быть командой помогут сохранить гармонию в таком динамичном и нестандартном союзе.`,
      },
    },
  },

  en: {
    title: "Calculation of the number of a couple by name",
    subtitle:
      "Enter the full names of two partners. We count the number of each name and then the number of the couple.",
    partner1LabelDefault: "First partner name",
    partner2LabelDefault: "Second partner's name",
    cardResultTitle: "The result of calculating the number of a pair",
    note: "* The calculation is for informational purposes only and is not scientific.",
    p1: {
      cardTitle: "Partner 1",
      firstNameLabel: "Name",
      lastNameLabel: "Surname",
      middleNameLabel: "Surname",
      firstNamePlaceholder: "Enter name",
      lastNamePlaceholder: "Enter last name",
      middleNamePlaceholder: "Enter middle name",
      fioLabel: "Full name",
      fioNumberLabel: "Number of full names",
      unknownCharsHintPrefix: "Characters not included:",
      unknownCharsHintSuffix: "(use Cyrillic alphabet)",
    },
    p2: {
      cardTitle: "Partner 2",
      firstNameLabel: "Name",
      lastNameLabel: "Surname",
      middleNameLabel: "Surname",
      firstNamePlaceholder: "Enter name",
      lastNamePlaceholder: "Enter last name",
      middleNamePlaceholder: "Enter middle name",
      fioLabel: "Full name",
      fioNumberLabel: "Number of full names",
      unknownCharsHintPrefix: "Characters not included:",
      unknownCharsHintSuffix: "(use Cyrillic alphabet)",
    },
    result: {
      partner1Number: "Number of the first partner",
      partner2Number: "Number of the second partner",
      pairNumber: "Pair number",
      fillBothHint: "Fill in both fields",
    },
    pairText: {
      1: {
        title: "Pair number 1",
        body: `Together you are a powerful force and are capable of amassing significant influence in your hands. The main thing is to manage this potential wisely and consciously. You have every chance to build a family based on common sense, where order, structure and harmony will reign in everything. In the business sphere, you form an almost ideal union of leaders - managers, top officials of a company or any other structure.

As a couple, you know how to generate strong, non-standard ideas and become a kind of intellectual center that sets the direction and ensures the success of the common cause. At the same time, you are able to prove yourself not only in strategic thinking, but also in practical tasks, especially if you act together and in concert.

Joint creative activity is also possible - for example, co-authorship in art or literature. You easily understand each other without unnecessary words and know how to support your partner’s inspiration and creative impulse. The key task for you is to find common ideas and form a unified worldview, avoiding pressure and imposing your position.`,
      },
      2: {
        title: "Pair number 2",
        body: `This is an alliance based on harmony, calmness and the ability to hear each other. In such relationships, partners are prone to mutual understanding, empathy and willingness to meet halfway when the situation requires it. With this approach, you are able to create a strong and happy marriage, in which any difficulties are resolved without conflict, and the atmosphere at home remains warm and cozy.

If we consider you as business partners, you will show the best results with equal cooperation - without a rigid “superior-subordinate” hierarchy. Each of you is ready to equally invest in the common cause, work with full dedication and honestly share responsibility, success and rewards. Such an alliance is especially successful in areas related to helping people, service, care and support.

The key to your success is teamwork and mutual support. It is important to act for the sake of a common goal, not trying to dominate or surpass a partner, but evenly dividing the work, concerns, and results. The ability to listen, respect and take into account each other’s opinions will help you find many common points and create a truly strong and harmonious union.`,
      },
      3: {
        title: "Pair number 3",
        body: `This is a union of bright, emotional and charismatic people - a truly “star” couple that easily finds itself in the center of attention. Together you are able to gain recognition and popularity, because you bring with you an atmosphere of celebration, lightness and fun. A deep, passionate connection, filled with strong experiences and a storm of feelings, is possible between you.

In the business sphere, your union is especially successful where publicity and self-expression are important. You can successfully realize your potential in creativity and art: performing on stage, singing, dancing, working on television or radio. Co-hosting a show, teaching, organizing events, or any activity that requires you to be visible will enhance your abilities - next to each other, your talents are revealed many times over.

The key task for you is to avoid internal rivalry and join forces for a common goal, and not for everyone’s personal glory. It is also important to direct the powerful energy of your couple into creation: instead of conflicts over trifles, choose creativity, love and inspiration, sharing joy with yourself and others.`,
      },
      4: {
        title: "Pair number 4",
        body: `This union can become very strong and stable from a practical point of view. You can create a reliable partnership, focused on results and achieving common goals, where discipline, responsibility and hard work are valued. However, such relationships usually lack emotional depth, warmth and sincere communication, so they are poorly suited for a romantic or family union. An exception may be a marriage based on calculation and benefit, but then the emotional side of life will have to be filled outside of this relationship.

In the business sphere, you show yourself as efficiently as possible. Order, clarity and control reign in your work: tasks are completed accurately, competently and on time, without unnecessary risks and errors. The most favorable directions for you are practical and structured areas where calculation, stability and material results are important: business, finance, construction, management.

For successful interaction, you need common goals and coinciding interests. In this case, you act coherently, confidently and consistently, and are able to work long and hard without distractions or doubts about the chosen path.`,
      },
      5: {
        title: "Pair number 5",
        body: `With such a union, boredom will definitely not threaten you, but there is no need to talk about stability. Your couple lives in a rhythm of spontaneity and constant change: surprises, impulsive decisions and continuous adventures become a natural part of the relationship. The classic format of marriage is unlikely here, but bright, emotional and free romantic relationships are possible.

In the business sphere, you are especially strong where flexibility, speed of reaction and the ability to instantly adapt to changing circumstances are required. You will work well together on projects that involve dynamics, risk, travel and change of scenery, as you are both comfortable with change and able to inspire each other to move forward.

The key condition for your union is to find a common activity that truly excites both of you. You should choose only what brings pleasure and gives strong emotions. Routine and monotonous activities are destructive for you: it is variety, novelty and the flow of impressions that help maintain interest in each other and keep you together.`,
      },
      6: {
        title: "Pair number 6",
        body: `This union is especially harmonious for family life. An atmosphere of comfort, peace and inner balance is easily created between you. You know how to show attention and care for each other, and your children and loved ones will feel loved, protected and surrounded by warmth.

In the professional sphere, you are also able to interact successfully, especially in areas related to supporting people, care, education, training, as well as organizing space and creating order. It is only important that the work does not require constant rushing, frequent moving and is not filled with stress and chaos.

It is important for your union to find a common cause that you are ready to do from the heart, without expecting immediate benefits. Joint charity work or helping others can be something that brings you even closer together and strengthens your inner connection.`,
      },
      7: {
        title: "Pair number 7",
        body: `The basis of this union is primarily an intellectual connection. If you enjoy communication, can spend hours discussing the same topics, and share similar views and values, you can form a deep, meaningful friendship. For a vibrant romantic relationship and marriage, passion and emotional expressiveness may be lacking here, but for you, mutual understanding and spiritual intimacy may be more important than feelings, and it is on this foundation that a family is possible.

In the professional sphere, you will be united by activities that require concentration, analysis and a thoughtful approach. You will excel in science, art, philosophy, writing, conducting seminars on psychology and personal development, as well as in work related to nature and solitude.

For harmony in a union, it is important to learn to take life more lightly, support each other in times of doubt and low mood, and find common activities that bring joy. Otherwise, there is a risk of withdrawing into oneself and plunging into a state of melancholy.`,
      },
      8: {
        title: "Pair number 8",
        body: `In this union, you are able to achieve much more than each of you individually. By combining your strengths, talents and inner energy, you open the path to success, abundance and the implementation of large-scale plans. You have the power to generate strong ideas, launch large projects, bring them to a high level and achieve sustainable material well-being.

Romantic and family relationships in such a couple are possible, but their strength is directly related to joint activities, common goals and a single vector of development. It is the common cause that becomes the foundation of your union.

Any honest and socially significant activity brings you the greatest success. This could be business, entrepreneurship, as well as areas related to culture, art, psychology, law, humanitarian and social projects. Together you are able to help people, protect their interests, restore justice and support those who need it.

The key point for your couple is not to make money the main goal and not to strive for profit at any cost. Financial wealth will come on its own and in significant quantities if you work for the sake of an idea, meaning and high moral principles.`,
      },
      9: {
        title: "Pair number 9",
        body: `This union is not created for a calm, settled life. It is difficult for you to be satisfied with what has already been achieved - you are a couple of seekers, innovators and discoverers. The classic idea of ​​home and family may be cramped for you, but a bright, rich union of people who constantly gain new experiences, live strong impressions and discover the unknown is possible.

You achieve the greatest success in areas related to travel, studying the cultures and lifestyles of different countries and peoples, as well as in scientific and research areas, where there are many questions and room for discovery. You are attracted to activities that require analysis, investigation, delving into mysteries and finding answers to complex riddles.

No matter how much you are passionate about the search for knowledge and truth, it is important to remain attentive and caring for each other. Support, overcoming difficulties together and the ability to be a team will help maintain harmony in such a dynamic and non-standard union.`,
      },
    },
  },

  tr: {
    title: "Bir çiftin sayısının isme göre hesaplanması",
    subtitle:
      "İki ortağın tam adlarını girin. Her ismin numarasını ve ardından çiftin numarasını sayıyoruz.",
    partner1LabelDefault: "İlk ortağın adı",
    partner2LabelDefault: "İkinci ortağın adı",
    cardResultTitle: "Bir çiftin sayısını hesaplamanın sonucu",
    note: "*Hesaplama yalnızca bilgilendirme amaçlıdır ve bilimsel değildir.",
    p1: {
      cardTitle: "Ortak 1",
      firstNameLabel: "İsim",
      lastNameLabel: "Soyadı",
      middleNameLabel: "Soyadı",
      firstNamePlaceholder: "Ad girin",
      lastNamePlaceholder: "Soyadını girin",
      middleNamePlaceholder: "İkinci adı girin",
      fioLabel: "Ad Soyad",
      fioNumberLabel: "Tam adların sayısı",
      unknownCharsHintPrefix: "Dahil olmayan karakterler:",
      unknownCharsHintSuffix: "(Kiril alfabesini kullanın)",
    },
    p2: {
      cardTitle: "İş Ortağı 2",
      firstNameLabel: "İsim",
      lastNameLabel: "Soyadı",
      middleNameLabel: "Soyadı",
      firstNamePlaceholder: "Ad girin",
      lastNamePlaceholder: "Soyadını girin",
      middleNamePlaceholder: "İkinci adı girin",
      fioLabel: "Ad Soyad",
      fioNumberLabel: "Tam adların sayısı",
      unknownCharsHintPrefix: "Dahil olmayan karakterler:",
      unknownCharsHintSuffix: "(Kiril alfabesini kullanın)",
    },
    result: {
      partner1Number: "İlk ortağın numarası",
      partner2Number: "İkinci ortağın numarası",
      pairNumber: "Çift numarası",
      fillBothHint: "Her iki alanı da doldurun",
    },
    pairText: {
      1: {
        title: "1 numaralı çift",
        body: `Birlikte güçlü bir güçsünüz ve önemli bir etkiyi ellerinizde toplama kapasitesine sahipsiniz. Önemli olan bu potansiyeli akıllıca ve bilinçli yönetmektir. Her şeyde düzen, yapı ve uyumun hüküm süreceği, sağduyuya dayalı bir aile kurma şansınız var. İş alanında, neredeyse ideal bir liderler birliği oluşturursunuz - yöneticiler, bir şirketin üst düzey yetkilileri veya başka herhangi bir yapı.

Bir çift olarak, güçlü, standart dışı fikirler üretmeyi ve ortak davanın yönünü belirleyen ve başarısını sağlayan bir tür entelektüel merkez haline gelmeyi biliyorsunuz. Aynı zamanda, özellikle birlikte ve uyum içinde hareket ederseniz, yalnızca stratejik düşünmede değil, aynı zamanda pratik görevlerde de kendinizi kanıtlayabilirsiniz.

Ortak yaratıcı faaliyetler de mümkündür; örneğin sanat veya edebiyatta ortak yazarlık. Gereksiz kelimeler olmadan birbirinizi kolayca anlarsınız ve partnerinizin ilhamını ve yaratıcı dürtüsünü nasıl destekleyeceğinizi bilirsiniz. Sizin için temel görev, ortak fikirler bulmak ve birleşik bir dünya görüşü oluşturmak, baskıdan kaçınmak ve konumunuzu dayatmaktır.`,
      },
      2: {
        title: "2 numaralı çift",
        body: `Bu uyum, sakinlik ve birbirini duyabilme yeteneğine dayalı bir ittifaktır. Bu tür ilişkilerde partnerler karşılıklı anlayışa, empatiye ve durum gerektirdiğinde yarı yolda buluşmaya istekli olmaya eğilimlidirler. Bu yaklaşımla, her türlü zorluğun çatışma olmadan çözüldüğü, evdeki atmosferin sıcak ve rahat kaldığı güçlü ve mutlu bir evlilik yaratabilirsiniz.

Sizi iş ortağı olarak düşünürsek, katı bir “üst-ast” hiyerarşisi olmadan, eşit işbirliğiyle en iyi sonuçları gösterirsiniz. Her biriniz ortak amaca eşit şekilde yatırım yapmaya, tam bir özveriyle çalışmaya ve sorumluluğu, başarıyı ve ödülleri dürüstçe paylaşmaya hazırsınız. Böyle bir ittifak özellikle insanlara yardım, hizmet, bakım ve destekle ilgili alanlarda başarılıdır.

Başarınızın anahtarı ekip çalışması ve karşılıklı destektir. Ortak bir hedef uğruna hareket etmek, bir ortağa hükmetmeye veya onu aşmaya çalışmak değil, işi, kaygıları ve sonuçları eşit bir şekilde bölmek önemlidir. Dinleme, saygı duyma ve birbirinizin fikirlerini dikkate alma yeteneği, birçok ortak nokta bulmanıza ve gerçekten güçlü ve uyumlu bir birlik oluşturmanıza yardımcı olacaktır.`,
      },
      3: {
        title: "3 numaralı çift",
        body: `Bu, parlak, duygusal ve karizmatik insanlardan oluşan bir birliktir - kendisini kolaylıkla ilgi odağı haline getiren gerçek bir "yıldız" çift. Birlikte tanınma ve popülerlik kazanabilirsiniz çünkü yanınızda bir kutlama, hafiflik ve eğlence atmosferi getirirsiniz. Aranızda güçlü deneyimler ve duygu fırtınalarıyla dolu derin, tutkulu bir bağlantı mümkün.

İş alanında, sendikanız özellikle tanıtım ve kendini ifade etmenin önemli olduğu yerlerde başarılıdır. Yaratıcılık ve sanattaki potansiyelinizi başarıyla gerçekleştirebilirsiniz: sahnede performans sergilemek, şarkı söylemek, dans etmek, televizyon veya radyoda çalışmak. Bir gösteriye ortak ev sahipliği yapmak, ders vermek, etkinlikler düzenlemek veya görünür olmanızı gerektiren herhangi bir aktivite, yeteneklerinizi geliştirecektir; yan yanayken, yetenekleriniz defalarca ortaya çıkar.

Sizin için temel görev, iç rekabetten kaçınmak ve herkesin kişisel zaferi için değil, ortak bir amaç için güçlerinizi birleştirmektir. Çiftinizin güçlü enerjisini yaratıma yönlendirmek de önemlidir: önemsiz şeyler yüzünden çatışmak yerine yaratıcılığı, sevgiyi ve ilhamı seçin, neşeyi kendinizle ve başkalarıyla paylaşın.`,
      },
      4: {
        title: "4 numaralı çift",
        body: `Bu birlik pratik açıdan çok güçlü ve istikrarlı hale gelebilir. Disiplin, sorumluluk ve sıkı çalışmaya değer verilen, sonuçlara ve ortak hedeflere ulaşmaya odaklanan güvenilir bir ortaklık yaratabilirsiniz. Bununla birlikte, bu tür ilişkiler genellikle duygusal derinlik, sıcaklık ve samimi iletişimden yoksundur, bu nedenle romantik bir ilişki veya aile birliği için pek uygun değildir. Hesaplama ve menfaate dayalı bir evlilik bir istisna olabilir, ancak o zaman hayatın duygusal tarafının bu ilişkinin dışında doldurulması gerekecektir.

İş alanında kendinizi mümkün olduğunca verimli bir şekilde gösterirsiniz. İşinizde düzen, netlik ve kontrol hakimdir: Görevler gereksiz riskler ve hatalar olmadan doğru, yetkin ve zamanında tamamlanır. Sizin için en uygun yönler hesaplamanın, istikrarın ve maddi sonuçların önemli olduğu pratik ve yapılandırılmış alanlardır: işletme, finans, inşaat, yönetim.

Başarılı bir etkileşim için ortak hedeflere ve örtüşen ilgi alanlarına ihtiyacınız vardır. Bu durumda tutarlı, kendinden emin ve tutarlı davranırsınız ve seçilen yol hakkında dikkatiniz dağılmadan veya şüphe duymadan uzun süre ve sıkı çalışabilirsiniz.`,
      },
      5: {
        title: "5 numaralı çift",
        body: `Böyle bir birliktelik ile can sıkıntısı kesinlikle sizi tehdit etmeyecektir ancak istikrardan bahsetmeye gerek yok. Çiftiniz kendiliğindenliğin ve sürekli değişimin ritminde yaşıyor: Sürprizler, dürtüsel kararlar ve sürekli maceralar ilişkinin doğal bir parçası haline geliyor. Burada klasik evlilik biçimi pek mümkün değil, ancak parlak, duygusal ve özgür romantik ilişkiler mümkün.

İş alanında özellikle esnekliğin, reaksiyon hızının ve değişen koşullara anında uyum sağlama yeteneğinin gerekli olduğu yerlerde güçlüsünüz. Hem değişim konusunda rahat olduğunuz hem de ilerlemek için birbirinize ilham verebildiğiniz için dinamikler, risk, seyahat ve manzara değişikliği içeren projelerde birlikte iyi çalışacaksınız.

Birlikteliğinizin temel koşulu, ikinizi de gerçekten heyecanlandıran ortak bir aktivite bulmaktır. Yalnızca zevk veren ve güçlü duygular veren şeyleri seçmelisiniz. Rutin ve monoton aktiviteler sizin için yıkıcıdır: Birbirinize olan ilginizi korumaya ve sizi bir arada tutmaya yardımcı olan şey çeşitlilik, yenilik ve izlenim akışıdır.`,
      },
      6: {
        title: "6 numaralı çift",
        body: `Bu birlik özellikle aile hayatı için uyumludur. Aranızda rahatlıkla bir rahatlık, huzur ve iç denge atmosferi yaratılır. Birbirinize nasıl dikkat ve özen göstereceğinizi biliyorsunuz; çocuklarınız ve sevdikleriniz sevildiğini, korunduğunu ve sıcaklıkla çevrelendiğini hissedecek.

Profesyonel alanda, özellikle insanları destekleme, bakım, eğitim, öğretimin yanı sıra alanı organize etme ve düzen yaratma ile ilgili alanlarda da başarılı bir şekilde etkileşim kurabilirsiniz. Önemli olan işin sürekli acele etmeyi, sık hareket etmeyi gerektirmemesi, stres ve kaosla dolu olmamasıdır.

Anında fayda beklemeden, yürekten yapmaya hazır olduğunuz ortak bir amaç bulmanız sendikanız için önemlidir. Ortak hayır işleri veya başkalarına yardım etmek, sizi birbirinize daha da yakınlaştıracak ve iç bağınızı güçlendirecek bir şey olabilir.`,
      },
      7: {
        title: "7 numaralı çift",
        body: `Bu birliğin temeli öncelikle entelektüel bir bağdır. İletişimden hoşlanıyorsanız, aynı konuları tartışarak saatler geçirebiliyorsanız, benzer görüş ve değerleri paylaşıyorsanız derin, anlamlı bir dostluk kurabilirsiniz. Canlı bir romantik ilişki ve evlilik için burada tutku ve duygusal ifade eksik olabilir, ancak sizin için karşılıklı anlayış ve manevi yakınlık duygulardan daha önemli olabilir ve bir aile bu temelde mümkündür.

Profesyonel alanda konsantrasyon, analiz ve düşünceli bir yaklaşım gerektiren faaliyetlerle birleşeceksiniz. Bilimde, sanatta, felsefede, yazarlıkta, psikoloji ve kişisel gelişim üzerine seminerler düzenlemenin yanı sıra doğa ve yalnızlıkla ilgili çalışmalarda başarılı olacaksınız.

Birlikte uyum için hayatı daha hafife almayı, şüphe ve moral bozukluğu zamanlarında birbirinizi desteklemeyi ve neşe getiren ortak aktiviteler bulmayı öğrenmek önemlidir. Aksi takdirde kişinin kendi içine kapanma ve melankoli durumuna düşme riski vardır.`,
      },
      8: {
        title: "8 numaralı çift",
        body: `Bu birliktelikte bireysel olarak her birinizden çok daha fazlasını başarabilirsiniz. Güçlü yönlerinizi, yeteneklerinizi ve iç enerjinizi birleştirerek başarıya, bolluğa ve büyük ölçekli planların uygulanmasına giden yolu açarsınız. Güçlü fikirler üretme, büyük projeler başlatma, bunları üst düzeye çıkarma ve sürdürülebilir maddi refahı sağlama gücüne sahipsiniz.

Böyle bir çiftte romantik ve aile ilişkileri mümkündür, ancak bunların gücü doğrudan ortak faaliyetlerle, ortak hedeflerle ve tek bir gelişim vektörüyle ilgilidir. Birliğinizin temelini oluşturan ortak davadır.

Dürüst ve sosyal açıdan önemli herhangi bir faaliyet size en büyük başarıyı getirir. Bu iş, girişimcilik olabileceği gibi kültür, sanat, psikoloji, hukuk, insani ve sosyal projelerle ilgili alanlar da olabilir. Birlikte insanlara yardım edebilir, onların çıkarlarını koruyabilir, adaleti yeniden tesis edebilir ve ihtiyacı olanlara destek olabilirsiniz.

Çiftiniz için önemli olan nokta parayı ana hedef haline getirmemek ve ne pahasına olursa olsun kâr peşinde koşmamaktır. Bir fikir, anlam ve yüksek ahlaki ilkeler uğruna çalışırsanız, maddi zenginlik kendiliğinden ve önemli miktarlarda gelecektir.`,
      },
      9: {
        title: "9 numaralı çift",
        body: `Bu birliktelik sakin, yerleşik bir yaşam için yaratılmamıştır. Halihazırda başarılmış olanlardan memnun olmanız sizin için zordur - siz bir kaç arayışçı, yenilikçi ve kaşifsiniz. Klasik ev ve aile fikri size sıkışık gelebilir, ancak sürekli yeni deneyimler kazanan, güçlü izlenimler yaşayan ve bilinmeyeni keşfeden insanlardan oluşan parlak, zengin bir birliktelik mümkündür.

En büyük başarıyı seyahatle ilgili alanlarda, farklı ülke ve halkların kültürlerini ve yaşam tarzlarını inceleyerek, ayrıca pek çok sorunun ve keşfedilecek yerin olduğu bilim ve araştırma alanlarında elde edersiniz. Analiz, araştırma, gizemlere dalma ve karmaşık bilmecelere yanıt bulmayı gerektiren faaliyetler ilginizi çekiyor.

Bilgi ve hakikat arayışı konusunda ne kadar tutkulu olursanız olun, birbirinize karşı dikkatli ve şefkatli olmanız önemlidir. Destek olmak, zorlukların birlikte üstesinden gelmek ve takım olabilme yeteneği, böylesine dinamik ve standart dışı bir birlik içinde uyumun korunmasına yardımcı olacaktır.`,
      },
    },
  },

  kz: {
    title: "Calculation of the number of a couple by name",
    subtitle:
      "Enter the full names of two partners. We count the number of each name and then the number of the couple.",
    partner1LabelDefault: "First partner name",
    partner2LabelDefault: "Second partner's name",
    cardResultTitle: "The result of calculating the number of a pair",
    note: "* The calculation is for informational purposes only and is not scientific.",
    p1: {
      cardTitle: "Partner 1",
      firstNameLabel: "Name",
      lastNameLabel: "Surname",
      middleNameLabel: "Surname",
      firstNamePlaceholder: "Enter name",
      lastNamePlaceholder: "Enter last name",
      middleNamePlaceholder: "Enter middle name",
      fioLabel: "Full name",
      fioNumberLabel: "Number of full names",
      unknownCharsHintPrefix: "Characters not included:",
      unknownCharsHintSuffix: "(use Cyrillic alphabet)",
    },
    p2: {
      cardTitle: "Partner 2",
      firstNameLabel: "Name",
      lastNameLabel: "Surname",
      middleNameLabel: "Surname",
      firstNamePlaceholder: "Enter name",
      lastNamePlaceholder: "Enter last name",
      middleNamePlaceholder: "Enter middle name",
      fioLabel: "Full name",
      fioNumberLabel: "Number of full names",
      unknownCharsHintPrefix: "Characters not included:",
      unknownCharsHintSuffix: "(use Cyrillic alphabet)",
    },
    result: {
      partner1Number: "Number of the first partner",
      partner2Number: "Number of the second partner",
      pairNumber: "Pair number",
      fillBothHint: "Fill in both fields",
    },
    pairText: {
      1: {
        title: "Pair number 1",
        body: `Together you are a powerful force and are capable of amassing significant influence in your hands. The main thing is to manage this potential wisely and consciously. You have every chance to build a family based on common sense, where order, structure and harmony will reign in everything. In the business sphere, you form an almost ideal union of leaders - managers, top officials of a company or any other structure.

As a couple, you know how to generate strong, non-standard ideas and become a kind of intellectual center that sets the direction and ensures the success of the common cause. At the same time, you are able to prove yourself not only in strategic thinking, but also in practical tasks, especially if you act together and in concert.

Joint creative activity is also possible - for example, co-authorship in art or literature. You easily understand each other without unnecessary words and know how to support your partner’s inspiration and creative impulse. The key task for you is to find common ideas and form a unified worldview, avoiding pressure and imposing your position.`,
      },
      2: {
        title: "Pair number 2",
        body: `This is an alliance based on harmony, calmness and the ability to hear each other. In such relationships, partners are prone to mutual understanding, empathy and willingness to meet halfway when the situation requires it. With this approach, you are able to create a strong and happy marriage, in which any difficulties are resolved without conflict, and the atmosphere at home remains warm and cozy.

If we consider you as business partners, you will show the best results with equal cooperation - without a rigid “superior-subordinate” hierarchy. Each of you is ready to equally invest in the common cause, work with full dedication and honestly share responsibility, success and rewards. Such an alliance is especially successful in areas related to helping people, service, care and support.

The key to your success is teamwork and mutual support. It is important to act for the sake of a common goal, not trying to dominate or surpass a partner, but evenly dividing the work, concerns, and results. The ability to listen, respect and take into account each other’s opinions will help you find many common points and create a truly strong and harmonious union.`,
      },
      3: {
        title: "Pair number 3",
        body: `This is a union of bright, emotional and charismatic people - a truly “star” couple that easily finds itself in the center of attention. Together you are able to gain recognition and popularity, because you bring with you an atmosphere of celebration, lightness and fun. A deep, passionate connection, filled with strong experiences and a storm of feelings, is possible between you.

In the business sphere, your union is especially successful where publicity and self-expression are important. You can successfully realize your potential in creativity and art: performing on stage, singing, dancing, working on television or radio. Co-hosting a show, teaching, organizing events, or any activity that requires you to be visible will enhance your abilities - next to each other, your talents are revealed many times over.

The key task for you is to avoid internal rivalry and join forces for a common goal, and not for everyone’s personal glory. It is also important to direct the powerful energy of your couple into creation: instead of conflicts over trifles, choose creativity, love and inspiration, sharing joy with yourself and others.`,
      },
      4: {
        title: "Pair number 4",
        body: `This union can become very strong and stable from a practical point of view. You can create a reliable partnership, focused on results and achieving common goals, where discipline, responsibility and hard work are valued. However, such relationships usually lack emotional depth, warmth and sincere communication, so they are poorly suited for a romantic or family union. An exception may be a marriage based on calculation and benefit, but then the emotional side of life will have to be filled outside of this relationship.

In the business sphere, you show yourself as efficiently as possible. Order, clarity and control reign in your work: tasks are completed accurately, competently and on time, without unnecessary risks and errors. The most favorable directions for you are practical and structured areas where calculation, stability and material results are important: business, finance, construction, management.

For successful interaction, you need common goals and coinciding interests. In this case, you act coherently, confidently and consistently, and are able to work long and hard without distractions or doubts about the chosen path.`,
      },
      5: {
        title: "Pair number 5",
        body: `With such a union, boredom will definitely not threaten you, but there is no need to talk about stability. Your couple lives in a rhythm of spontaneity and constant change: surprises, impulsive decisions and continuous adventures become a natural part of the relationship. The classic format of marriage is unlikely here, but bright, emotional and free romantic relationships are possible.

In the business sphere, you are especially strong where flexibility, speed of reaction and the ability to instantly adapt to changing circumstances are required. You will work well together on projects that involve dynamics, risk, travel and change of scenery, as you are both comfortable with change and able to inspire each other to move forward.

The key condition for your union is to find a common activity that truly excites both of you. You should choose only what brings pleasure and gives strong emotions. Routine and monotonous activities are destructive for you: it is variety, novelty and the flow of impressions that help maintain interest in each other and keep you together.`,
      },
      6: {
        title: "Pair number 6",
        body: `This union is especially harmonious for family life. An atmosphere of comfort, peace and inner balance is easily created between you. You know how to show attention and care for each other, and your children and loved ones will feel loved, protected and surrounded by warmth.

In the professional sphere, you are also able to interact successfully, especially in areas related to supporting people, care, education, training, as well as organizing space and creating order. It is only important that the work does not require constant rushing, frequent moving and is not filled with stress and chaos.

It is important for your union to find a common cause that you are ready to do from the heart, without expecting immediate benefits. Joint charity work or helping others can be something that brings you even closer together and strengthens your inner connection.`,
      },
      7: {
        title: "Pair number 7",
        body: `The basis of this union is primarily an intellectual connection. If you enjoy communication, can spend hours discussing the same topics, and share similar views and values, you can form a deep, meaningful friendship. For a vibrant romantic relationship and marriage, passion and emotional expressiveness may be lacking here, but for you, mutual understanding and spiritual intimacy may be more important than feelings, and it is on this foundation that a family is possible.

In the professional sphere, you will be united by activities that require concentration, analysis and a thoughtful approach. You will excel in science, art, philosophy, writing, conducting seminars on psychology and personal development, as well as in work related to nature and solitude.

For harmony in a union, it is important to learn to take life more lightly, support each other in times of doubt and low mood, and find common activities that bring joy. Otherwise, there is a risk of withdrawing into oneself and plunging into a state of melancholy.`,
      },
      8: {
        title: "Pair number 8",
        body: `In this union, you are able to achieve much more than each of you individually. By combining your strengths, talents and inner energy, you open the path to success, abundance and the implementation of large-scale plans. You have the power to generate strong ideas, launch large projects, bring them to a high level and achieve sustainable material well-being.

Romantic and family relationships in such a couple are possible, but their strength is directly related to joint activities, common goals and a single vector of development. It is the common cause that becomes the foundation of your union.

Any honest and socially significant activity brings you the greatest success. This could be business, entrepreneurship, as well as areas related to culture, art, psychology, law, humanitarian and social projects. Together you are able to help people, protect their interests, restore justice and support those who need it.

The key point for your couple is not to make money the main goal and not to strive for profit at any cost. Financial wealth will come on its own and in significant quantities if you work for the sake of an idea, meaning and high moral principles.`,
      },
      9: {
        title: "Pair number 9",
        body: `This union is not created for a calm, settled life. It is difficult for you to be satisfied with what has already been achieved - you are a couple of seekers, innovators and discoverers. The classic idea of ​​home and family may be cramped for you, but a bright, rich union of people who constantly gain new experiences, live strong impressions and discover the unknown is possible.

You achieve the greatest success in areas related to travel, studying the cultures and lifestyles of different countries and peoples, as well as in scientific and research areas, where there are many questions and room for discovery. You are attracted to activities that require analysis, investigation, delving into mysteries and finding answers to complex riddles.

No matter how much you are passionate about the search for knowledge and truth, it is important to remain attentive and caring for each other. Support, overcoming difficulties together and the ability to be a team will help maintain harmony in such a dynamic and non-standard union.`,
      },
    },
  },
};

// helper: достаёт строку по path, если пусто — возвращает keyPath
export function t(locale: Locale, keyPath: string): string {
  const root: any = STRINGS[locale];
  const parts = keyPath.split(".");
  let cur: any = root;

  for (const p of parts) {
    if (cur && typeof cur === "object" && p in cur) cur = cur[p];
    else return keyPath;
  }

  if (typeof cur === "string") return cur.trim().length ? cur : keyPath;
  return keyPath;
}

export function getPairText(
  locale: Locale,
  n: number,
): { title: string; body: string } | null {
  const pt = STRINGS[locale]?.pairText?.[n];
  if (!pt) return null;

  return {
    title: pt.title.trim().length ? pt.title : `pairText.${n}.title`,
    body: pt.body.trim().length ? pt.body : `pairText.${n}.body`,
  };
}
