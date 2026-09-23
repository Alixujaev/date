export type Locale = "ru" | "uz" | "en";

export const LOCALES: readonly Locale[] = ["ru", "uz", "en"] as const;

export const LOCALE_LABELS: Record<Locale, string> = {
  ru: "Рус",
  uz: "Oʻzb",
  en: "Eng",
};

export interface Translations {
  pageTitle: string;
  desktopOnlyMessage: string;
  common: {
    back: string;
    continue: string;
    startOver: string;
    changeSelection: string;
    stepIndicator: (current: number, total: number) => string;
    prevMonth: string;
    nextMonth: string;
  };
  welcome: {
    badge: string;
    titleQuestion: string;
    titleHighlight: string;
    titleRest: string;
    description: string;
    yes: string;
    no: string;
    noAriaLabel: string;
    noHint: string;
    durationHint: string;
    taunts: readonly string[];
  };
  dateTime: {
    badge: string;
    titlePrefix: string;
    titleHighlight: string;
    subtitle: string;
    timeHeading: string;
    pickDateFirst: string;
    pickTimeNext: string;
    timeSlots: Record<string, string>;
    months: readonly string[];
    weekdaysShort: readonly string[];
    weekdaysLong: readonly string[];
    yearSuffix: string;
  };
  food: {
    badge: string;
    titlePrefix: string;
    titleHighlight: string;
    subtitle: string;
    selectedText: string;
    promptText: string;
    options: Record<string, { label: string; hint: string }>;
  };
  finale: {
    badge: string;
    title: string;
    nameLabel: string;
    nameError: string;
    namePlaceholder: string;
    phoneLabel: string;
    phoneError: string;
    messageLabel: string;
    messageError: string;
    optional: string;
    messagePlaceholder: string;
    reviewTitle: string;
    dateLabel: string;
    timeLabel: string;
    foodLabel: string;
    submit: string;
    submitting: string;
    submitError: string;
    retry: string;
    sentTitle: string;
    sentText: string;
  };
}

export const translations: Record<Locale, Translations> = {
  ru: {
    pageTitle: "Продолжим общение?",
    desktopOnlyMessage: "Эта страница открывается только на компьютере 🖥",
    common: {
      back: "Назад",
      continue: "Далее",
      startOver: "Сначала",
      changeSelection: "Изменить",
      stepIndicator: (current, total) => `Шаг ${current} из ${total}`,
      prevMonth: "Предыдущий месяц",
      nextMonth: "Следующий месяц",
    },
    welcome: {
      badge: "Есть вопрос",
      titleQuestion: "Продолжим общение",
      titleHighlight: "в Telegram?",
      titleRest: "",
      description:
        "Не торопись. Кнопок всего две, и одна из них с характером.",
      yes: "Да",
      no: "Нет",
      noAriaLabel: "Кнопка «Нет»",
      noHint: "Попробуй нажать",
      durationHint: "2 шага · около 30 секунд",
      taunts: [
        "Попробуй поймать",
        "Убегаю",
        "Даже не пытайся",
        "Не поймаешь",
        "Есть другая кнопка",
        "Устала?",
        "Мимо",
      ],
    },
    dateTime: {
      badge: "2-й шаг",
      titlePrefix: "Когда",
      titleHighlight: "увидимся?",
      subtitle: "Выбери день и время.",
      timeHeading: "Время",
      pickDateFirst: "Сначала выбери день",
      pickTimeNext: "Теперь выбери время",
      timeSlots: {
        "13:00": "Обед",
        "17:00": "Вечер",
        "19:00": "Ужин",
        "21:00": "Ночь",
      },
      months: [
        "января", "февраля", "марта", "апреля", "мая", "июня",
        "июля", "августа", "сентября", "октября", "ноября", "декабря",
      ],
      weekdaysShort: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
      weekdaysLong: [
        "понедельник", "вторник", "среда", "четверг",
        "пятница", "суббота", "воскресенье",
      ],
      yearSuffix: " г.",
    },
    food: {
      badge: "3-й шаг",
      titlePrefix: "Что будем",
      titleHighlight: "есть?",
      subtitle: "Выбери одно.",
      selectedText: "выбрано",
      promptText: "Выбери вариант, чтобы продолжить",
      options: {
        pizza: { label: "Пицца", hint: "Классика, без промаха" },
        sushi: { label: "Суши", hint: "Изысканный вкус" },
        burger: { label: "Бургеры", hint: "Быстро и вкусно" },
        coffee: { label: "Кофе / Кафе", hint: "Для уютных разговоров" },
        national: { label: "Восточная кухня", hint: "Плов, самса, лагман" },
        dessert: { label: "Десерты", hint: "Сразу к сладкому" },
      },
    },
    finale: {
      badge: "2-й шаг",
      title: "Оставьте свои данные",
      nameLabel: "Имя",
      nameError: "Введите имя",
      namePlaceholder: "Как вас зовут?",
      phoneLabel: "Номер телефона",
      phoneError: "Введите корректный номер",
      messageLabel: "Сообщение",
      messageError: "Напишите сообщение",
      optional: "необязательно",
      messagePlaceholder: "Напишите что-нибудь...",
      reviewTitle: "Всё верно?",
      dateLabel: "Дата",
      timeLabel: "Время",
      foodLabel: "Еда",
      submit: "Отправить",
      submitting: "Отправляю…",
      submitError: "Что-то пошло не так",
      retry: "Попробовать снова",
      sentTitle: "Сообщение отправлено",
      sentText: "Увидимся в Telegram.",
    },
  },
  uz: {
    pageTitle: "Telegramda yozishishda davom etamizmi?",
    desktopOnlyMessage: "Bu sahifa faqat kompyuterda ochiladi 🖥",
    common: {
      back: "Orqaga",
      continue: "Davom etish",
      startOver: "Boshidan",
      changeSelection: "Oʻzgartirish",
      stepIndicator: (current, total) => `Bosqich ${current} / ${total}`,
      prevMonth: "Oldingi oy",
      nextMonth: "Keyingi oy",
    },
    welcome: {
      badge: "Bitta savol",
      titleQuestion: "Telegramda yozishishda",
      titleHighlight: "davom etamizmi?",
      titleRest: "",
      description:
        "Javobni shoshilmasdan bersang ham boʻladi. Faqat ikkita tugma bor.",
      yes: "Ha",
      no: "Yoʻq",
      noAriaLabel: "«Yoʻq» tugmasi",
      noHint: "Bosib koʻr",
      durationHint: "2 bosqich · taxminan 30 soniya",
      taunts: [
        "Urinib koʻr",
        "Qochyapman",
        "Yaqin kelma",
        "Ushlay olmaysan",
        "Boshqa tugma bor",
        "Charchadingmi?",
        "Tegolmading",
      ],
    },
    dateTime: {
      badge: "2-bosqich",
      titlePrefix: "Qachon",
      titleHighlight: "uchrashamiz?",
      subtitle: "Kunni tanla.",
      timeHeading: "Vaqt",
      pickDateFirst: "Avval kunni tanla",
      pickTimeNext: "Endi vaqtni tanla",
      timeSlots: {
        "13:00": "Tushlik",
        "17:00": "Kechki payt",
        "19:00": "Kechqurun",
        "21:00": "Tun",
      },
      months: [
        "yanvar", "fevral", "mart", "aprel", "may", "iyun",
        "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr",
      ],
      weekdaysShort: ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"],
      weekdaysLong: [
        "dushanba", "seshanba", "chorshanba", "payshanba",
        "juma", "shanba", "yakshanba",
      ],
      yearSuffix: "-yil",
    },
    food: {
      badge: "3-bosqich",
      titlePrefix: "Nima",
      titleHighlight: "yeymiz?",
      subtitle: "Bittasini tanla.",
      selectedText: "tanlandi",
      promptText: "Bittasini tanlasang, davom etamiz",
      options: {
        pizza: { label: "Pitsa", hint: "Klassika, xato yoʻq" },
        sushi: { label: "Sushi", hint: "Nozik taʼm" },
        burger: { label: "Burger", hint: "Tez va mazali" },
        coffee: { label: "Kafe", hint: "Suhbatlashish uchun" },
        national: { label: "Milliy taom", hint: "Osh, somsa, lagʻmon" },
        dessert: { label: "Shirinlik", hint: "Toʻgʻri desertga" },
      },
    },
    finale: {
      badge: "2-bosqich",
      title: "Ma'lumotlaringizni qoldiring",
      nameLabel: "Ism",
      nameError: "Ismingizni kiriting",
      namePlaceholder: "Ismingiz nima?",
      phoneLabel: "Telefon raqami",
      phoneError: "Toʻgʻri raqam kiriting",
      messageLabel: "Xabar",
      messageError: "Xabaringizni yozing",
      optional: "ixtiyoriy",
      messagePlaceholder: "Nimanidir yozing...",
      reviewTitle: "Hammasi toʻgʻrimi?",
      dateLabel: "Sana",
      timeLabel: "Vaqt",
      foodLabel: "Ovqat",
      submit: "Yuborish",
      submitting: "Yuborilmoqda…",
      submitError: "Xatolik yuz berdi",
      retry: "Qayta urinish",
      sentTitle: "Xabar yuborildi",
      sentText: "Telegramda koʻrishamiz.",
    },
  },
  en: {
    pageTitle: "Continue chatting?",
    desktopOnlyMessage: "This page is only available on desktop 🖥",
    common: {
      back: "Back",
      continue: "Continue",
      startOver: "Start over",
      changeSelection: "Change",
      stepIndicator: (current, total) => `Step ${current} of ${total}`,
      prevMonth: "Previous month",
      nextMonth: "Next month",
    },
    welcome: {
      badge: "One question",
      titleQuestion: "Shall we continue chatting",
      titleHighlight: "on Telegram?",
      titleRest: "",
      description:
        "Take your time. There are only two buttons — one is straightforward, the other is not.",
      yes: "Yes",
      no: "No",
      noAriaLabel: "No button",
      noHint: "Try pressing it",
      durationHint: "2 steps · about 30 seconds",
      taunts: [
        "Try to catch me",
        "Running away",
        "Don't even try",
        "Too slow",
        "There is another button",
        "Tired yet?",
        "Missed me",
      ],
    },
    dateTime: {
      badge: "Step 2",
      titlePrefix: "When are we",
      titleHighlight: "meeting?",
      subtitle: "Pick a day.",
      timeHeading: "Time",
      pickDateFirst: "Pick a date first",
      pickTimeNext: "Now select a time",
      timeSlots: {
        "13:00": "Lunch",
        "17:00": "Evening",
        "19:00": "Dinner",
        "21:00": "Night",
      },
      months: [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
      ],
      weekdaysShort: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      weekdaysLong: [
        "Monday", "Tuesday", "Wednesday", "Thursday",
        "Friday", "Saturday", "Sunday",
      ],
      yearSuffix: "",
    },
    food: {
      badge: "Step 3",
      titlePrefix: "What are we",
      titleHighlight: "eating?",
      subtitle: "Pick one.",
      selectedText: "selected",
      promptText: "Pick one to continue",
      options: {
        pizza: { label: "Pizza", hint: "Classic, cannot go wrong" },
        sushi: { label: "Sushi", hint: "Exquisite taste" },
        burger: { label: "Burgers", hint: "Juicy & delicious" },
        coffee: { label: "Coffee / Cafe", hint: "Cozy conversations" },
        national: { label: "Traditional cuisine", hint: "Rich & authentic" },
        dessert: { label: "Desserts", hint: "Straight to the sweet stuff" },
      },
    },
    finale: {
      badge: "Step 2",
      title: "Leave your details",
      nameLabel: "Name",
      nameError: "Enter your name",
      namePlaceholder: "What is your name?",
      phoneLabel: "Phone number",
      phoneError: "Enter a valid number",
      messageLabel: "Message",
      messageError: "Write a message",
      optional: "optional",
      messagePlaceholder: "Write something...",
      reviewTitle: "Looks good?",
      dateLabel: "Date",
      timeLabel: "Time",
      foodLabel: "Food",
      submit: "Send",
      submitting: "Sending…",
      submitError: "Something went wrong",
      retry: "Try again",
      sentTitle: "Message sent",
      sentText: "See you on Telegram.",
    },
  },
};
