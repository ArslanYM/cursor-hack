/* KisanVoice i18n + defaults — shared by page and onboarding */

export type AppLanguage = "kashmiri" | "hindi" | "english";

export const LANGUAGES: {
  id: AppLanguage;
  name: string;
  nativeName: string;
  script: string;
  emoji: string;
  greeting: string;
  dir: "ltr" | "rtl";
}[] = [
  {
    id: "kashmiri",
    name: "Kashmiri",
    nativeName: "کٲشُر",
    script: "Nastaliq",
    emoji: "🏔️",
    greeting: "اسلام علیکم",
    dir: "rtl",
  },
  {
    id: "hindi",
    name: "Hindi",
    nativeName: "हिन्दी",
    script: "Devanagari",
    emoji: "🇮🇳",
    greeting: "नमस्ते",
    dir: "ltr",
  },
  {
    id: "english",
    name: "English",
    nativeName: "English",
    script: "Latin",
    emoji: "🌐",
    greeting: "Hello",
    dir: "ltr",
  },
];

export type UiStrings = {
  welcomeTitle: string;
  welcomeSubtitle: string;
  chooseLanguage: string;
  next: string;
  getStarted: string;
  featureGuideTitle: string;
  featureGuideSubtitle: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  feature4Title: string;
  feature4Desc: string;
  tabAsk: string;
  tabIntel: string;
  mainWelcomeTitle: string;
  mainWelcomeSubtitle: string;
  intelHintTitle: string;
  intelHintSubtitle: string;
  quickQueriesTitle: string;
  quickApple: string;
  quickWalnut: string;
  quickSaffron: string;
  quickRice: string;
  quickTomato: string;
  quickPotato: string;
  tapToSpeak: string;
  listening: string;
  understanding: string;
  searchingPrices: string;
  intelLoadingTitle: string;
  intelLoadingSubtitle: string;
  intelSourceWeather: string;
  intelSourceHighway: string;
  intelSourceSubsidy: string;
  intelSourcePest: string;
  intelSourceMarket: string;
  intelEmptyTitle: string;
  intelEmptyBody: string;
  intelEmptyHint: string;
  getBriefing: string;
  morningBriefingLabel: string;
  moreDetail: string;
  lessDetail: string;
  activeAlerts: string;
  dismiss: string;
  statusLabel: string;
  deadlineLabel: string;
  nh44Title: string;
  nh44TitleKas: string;
  subsidiesTitle: string;
  subsidiesTitleKas: string;
  pestTitle: string;
  pestTitleKas: string;
  marketSentimentTitle: string;
  marketSentimentTitleKas: string;
  recordingTooShort: string;
  microphonePermission: string;
  processingFailed: string;
  genericQueryError: string;
  ariaMorningBriefing: string;
  ariaRefreshBriefing: string;
  tapToStop: string;
  tapToSpeakAria: string;
  confidenceHigh: string;
  confidenceMedium: string;
  confidenceLow: string;
  unitPerQuintal: string;
  nh44StatusPrefix: string;
};

export const UI_STRINGS: Record<AppLanguage, UiStrings> = {
  kashmiri: {
    welcomeTitle: "کِسان وائس مٕنٛز خوش آمدید",
    welcomeSubtitle: "پہلٕ زبان مُنتخب کرِو",
    chooseLanguage: "زبان چُنِو",
    next: "اگاد",
    getStarted: "شروع کرِو",
    featureGuideTitle: "تُہٕنٛد رہنُمایی",
    featureGuideSubtitle: "یِم چیزٕ کَرٕ سَکِو تُہٕ",
    feature1Title: "🎤 آواز سٕتھ پُچھِو",
    feature1Desc: "بٹن دبایِو تہٕ بولِو — اپنہٕ زبانٕ مَنٛز منڈی نرخ پُچھِو",
    feature2Title: "📊 صُبٲح کی بریفنگ",
    feature2Desc: "موسم، سڑک، سبسڈی تہٕ بازار — ہَر صبٲح تازہ خبریٖں",
    feature3Title: "🛣️ این ایچ ۴۴ سٹیٹس",
    feature3Desc: "ہائیوے بند ہویٕ تٕ فصل نٕ کٹِو — ایپ خبردار کٔرٕ",
    feature4Title: "🌾 ذہین مشورٕ",
    feature4Desc: "کیڑے مکوڑے، سبسڈی ڈیڈلاین — سٮ۪ب خبریٖں اکٹھٕ",
    tabAsk: "بولِو · Ask",
    tabIntel: "خبریٖں · Intel",
    mainWelcomeTitle: "اسلام علیکم {name}! 👋",
    mainWelcomeSubtitle: "بٹن دبایِو تہٕ بولِو — منڈی نرخ پُچھِو",
    intelHintTitle: "خبریٖں ٹیب دبایِو صُبٲح کی بریفنگ کٲتھ",
    intelHintSubtitle: "صُبٲح بریفنگَس خٲطرٕ خبریٖں ٹیب دبایِو",
    quickQueriesTitle: "یِتھ پُچھِو",
    quickApple: "سیب",
    quickWalnut: "اخروٹ",
    quickSaffron: "کونگ",
    quickRice: "تامُل",
    quickTomato: "روٲنٛگَن",
    quickPotato: "ٲلُو",
    tapToSpeak: "بٹن دَبٲوِتھ بولِو",
    listening: "بۄزان چھِو...",
    understanding: "سمجان چھِو...",
    searchingPrices: "نرخ لبان چھِو...",
    intelLoadingTitle: "معلومات جمع کران چھِو...",
    intelLoadingSubtitle: "پٲنٛژٕ ذٲژٕ کٲنٛش",
    intelSourceWeather: "موسم",
    intelSourceHighway: "سڑک",
    intelSourceSubsidy: "سبسڈی",
    intelSourcePest: "کیڑٕ",
    intelSourceMarket: "بازار",
    intelEmptyTitle: "صبٲح کی بریفنگ",
    intelEmptyBody: "بٹن دَبٲوِتھ ہَر صُبح خبریٖں حاصل کرِو",
    intelEmptyHint: "موسم، سڑک، سبسڈی، کیڑٕ تٕ بازار",
    getBriefing: "بریفنگ حاصل کرِو",
    morningBriefingLabel: "صُبٲح کی بریفنگ · Morning",
    moreDetail: "مزید",
    lessDetail: "کم",
    activeAlerts: "اَنٛدارٕ الرٕٹ",
    dismiss: "بَنٛد",
    statusLabel: "حالت",
    deadlineLabel: "آخری تٲریٖخ",
    nh44Title: "NH44 Highway",
    nh44TitleKas: "این ایچ ۴۴ ہائیوے",
    subsidiesTitle: "Subsidies & Schemes",
    subsidiesTitleKas: "سبسڈی تہٕ سکیمز",
    pestTitle: "Pest & Disease Alerts",
    pestTitleKas: "کیڑے مکوڑے",
    marketSentimentTitle: "Market Sentiment",
    marketSentimentTitleKas: "بازار",
    recordingTooShort:
      "ریکارڈنگ مُختَسَر — رٲچھٕ مٲدٕ بولِو",
    microphonePermission: "مایکروفون چالو کرِو",
    processingFailed: "پروسیس ناکام",
    genericQueryError: "کچھ غلط ہوٗو",
    ariaMorningBriefing: "صُبٲح کی بریفنگ",
    ariaRefreshBriefing: "بریفنگ نوٗ",
    tapToStop: "بَنٛد کَرٕ",
    tapToSpeakAria: "بولٕنٛس شروع",
    confidenceHigh: "بھروسہٕ مَند",
    confidenceMedium: "اندازَن",
    confidenceLow: "کَم بھروسٕ",
    unitPerQuintal: "پٲنٛژٕ کٲنٛش",
    nh44StatusPrefix: "NH44:",
  },
  hindi: {
    welcomeTitle: "KisanVoice में आपका स्वागत है",
    welcomeSubtitle: "पहले अपनी भाषा चुनें",
    chooseLanguage: "भाषा चुनें",
    next: "आगे",
    getStarted: "शुरू करें",
    featureGuideTitle: "आपकी गाइड",
    featureGuideSubtitle: "आप ये सब कर सकते हैं",
    feature1Title: "🎤 आवाज़ से पूछें",
    feature1Desc: "बटन दबाएं और बोलें — अपनी भाषा में मंडी भाव पूछें",
    feature2Title: "📊 सुबह की ब्रीफिंग",
    feature2Desc: "मौसम, सड़क, सब्सिडी और बाजार — हर सुबह ताज़ा जानकारी",
    feature3Title: "🛣️ NH44 स्टेटस",
    feature3Desc: "हाईवे बंद हो तो फसल न काटें — ऐप आपको बताएगा",
    feature4Title: "🌾 स्मार्ट सलाह",
    feature4Desc: "कीड़े-मकोड़े, सब्सिडी डेडलाइन — सब जानकारी एक जगह",
    tabAsk: "पूछें · Ask",
    tabIntel: "ख़बरें · Intel",
    mainWelcomeTitle: "नमस्ते, {name}! 👋",
    mainWelcomeSubtitle: "बटन दबाएं और बोलें — मंडी भाव पूछें",
    intelHintTitle: "Intel टैब पर सुबह की ब्रीफिंग देखें",
    intelHintSubtitle: "मौसम, सड़क और बाज़ार की जानकारी",
    quickQueriesTitle: "जल्दी पूछें · Quick queries",
    quickApple: "सेब",
    quickWalnut: "अखरोट",
    quickSaffron: "केसर",
    quickRice: "चावल",
    quickTomato: "टमाटर",
    quickPotato: "आलू",
    tapToSpeak: "बोलने के लिए टैप करें",
    listening: "सुन रहे हैं...",
    understanding: "समझ रहे हैं...",
    searchingPrices: "कीमतें खोज रहे हैं...",
    intelLoadingTitle: "जानकारी जुटा रहे हैं...",
    intelLoadingSubtitle: "5 स्रोतों से",
    intelSourceWeather: "मौसम",
    intelSourceHighway: "हाईवे",
    intelSourceSubsidy: "सब्सिडी",
    intelSourcePest: "कीट",
    intelSourceMarket: "बाज़ार",
    intelEmptyTitle: "सुबह की ब्रीफिंग",
    intelEmptyBody: "बटन दबाकर मौसम, सड़क और सब्सिडी की जानकारी पाएं",
    intelEmptyHint: "हर सुबह ताज़ा अपडेट",
    getBriefing: "ब्रीफिंग लें",
    morningBriefingLabel: "सुबह की ब्रीफिंग",
    moreDetail: "और विवरण",
    lessDetail: "कम विवरण",
    activeAlerts: "सक्रिय अलर्ट",
    dismiss: "बंद करें",
    statusLabel: "स्थिति",
    deadlineLabel: "अंतिम तिथि",
    nh44Title: "NH44 हाईवे",
    nh44TitleKas: "एनएच44",
    subsidiesTitle: "सब्सिडी और योजनाएँ",
    subsidiesTitleKas: "सब्सिडी",
    pestTitle: "कीट और रोग चेतावनी",
    pestTitleKas: "कीट",
    marketSentimentTitle: "बाज़ार का माहौल",
    marketSentimentTitleKas: "बाज़ार",
    recordingTooShort: "रिकॉर्डिंग बहुत छोटी थी — फिर से बोलें",
    microphonePermission: "माइक्रोफ़ोन की अनुमति दें",
    processingFailed: "प्रोसेसिंग विफल",
    genericQueryError: "कुछ गलत हुआ",
    ariaMorningBriefing: "सुबह की ब्रीफिंग",
    ariaRefreshBriefing: "ब्रीफिंग रिफ़्रेश",
    tapToStop: "रोकें",
    tapToSpeakAria: "बोलना शुरू करें",
    confidenceHigh: "विश्वसनीय",
    confidenceMedium: "अनुमानित",
    confidenceLow: "कम भरोसा",
    unitPerQuintal: "प्रति क्विंटल",
    nh44StatusPrefix: "NH44:",
  },
  english: {
    welcomeTitle: "Welcome to KisanVoice",
    welcomeSubtitle: "First, choose your language",
    chooseLanguage: "Choose Language",
    next: "Next",
    getStarted: "Get Started",
    featureGuideTitle: "Your Quick Guide",
    featureGuideSubtitle: "Here's what you can do",
    feature1Title: "🎤 Ask with Voice",
    feature1Desc:
      "Tap the mic and speak — ask mandi prices in your own language",
    feature2Title: "📊 Morning Briefing",
    feature2Desc:
      "Weather, highway, subsidies, and market — fresh intel every morning",
    feature3Title: "🛣️ NH44 Status",
    feature3Desc:
      "Highway closed? The app warns you not to harvest perishables",
    feature4Title: "🌾 Smart Advice",
    feature4Desc:
      "Pest alerts, subsidy deadlines — all intelligence in one place",
    tabAsk: "Ask · Voice",
    tabIntel: "Intel",
    mainWelcomeTitle: "Hello, {name}! 👋",
    mainWelcomeSubtitle: "Tap the mic and speak — ask mandi prices",
    intelHintTitle: "Tap the Intel tab for your morning briefing",
    intelHintSubtitle: "Weather, highway, subsidies & market at a glance",
    quickQueriesTitle: "Quick queries",
    quickApple: "Apple",
    quickWalnut: "Walnut",
    quickSaffron: "Saffron",
    quickRice: "Rice",
    quickTomato: "Tomato",
    quickPotato: "Potato",
    tapToSpeak: "Tap to speak",
    listening: "Listening...",
    understanding: "Understanding...",
    searchingPrices: "Searching prices...",
    intelLoadingTitle: "Gathering intelligence...",
    intelLoadingSubtitle: "From 5 parallel sources",
    intelSourceWeather: "Weather",
    intelSourceHighway: "Highway",
    intelSourceSubsidy: "Subsidies",
    intelSourcePest: "Pests",
    intelSourceMarket: "Market",
    intelEmptyTitle: "Morning briefing",
    intelEmptyBody: "Tap below for weather, highway, subsidies & pest alerts",
    intelEmptyHint: "Fresh intel every morning",
    getBriefing: "Get briefing",
    morningBriefingLabel: "Morning briefing",
    moreDetail: "More detail",
    lessDetail: "Less detail",
    activeAlerts: "Active alerts",
    dismiss: "Dismiss",
    statusLabel: "Status",
    deadlineLabel: "Deadline",
    nh44Title: "NH44 Highway",
    nh44TitleKas: "NH44",
    subsidiesTitle: "Subsidies & Schemes",
    subsidiesTitleKas: "Subsidies",
    pestTitle: "Pest & Disease Alerts",
    pestTitleKas: "Pests",
    marketSentimentTitle: "Market sentiment",
    marketSentimentTitleKas: "Market",
    recordingTooShort: "Recording too short — please speak again",
    microphonePermission: "Allow microphone access",
    processingFailed: "Processing failed",
    genericQueryError: "Something went wrong",
    ariaMorningBriefing: "Get morning briefing",
    ariaRefreshBriefing: "Refresh briefing",
    tapToStop: "Tap to stop",
    tapToSpeakAria: "Tap to speak",
    confidenceHigh: "High confidence",
    confidenceMedium: "Estimate",
    confidenceLow: "Low confidence",
    unitPerQuintal: "per quintal",
    nh44StatusPrefix: "NH44:",
  },
};

export const DEFAULT_BRIEFING_LOCATION = "Srinagar";
export const DEFAULT_BRIEFING_CROPS = [
  "Apple",
  "Walnut",
  "Saffron",
  "Rice",
  "Tomato",
  "Potato",
] as const;

export function quickQueryChips(t: UiStrings): { key: string; emoji: string; label: string }[] {
  return [
    { key: "apple", emoji: "🍎", label: t.quickApple },
    { key: "walnut", emoji: "🥜", label: t.quickWalnut },
    { key: "saffron", emoji: "🌸", label: t.quickSaffron },
    { key: "rice", emoji: "🍚", label: t.quickRice },
    { key: "tomato", emoji: "🍅", label: t.quickTomato },
    { key: "potato", emoji: "🥔", label: t.quickPotato },
  ];
}
