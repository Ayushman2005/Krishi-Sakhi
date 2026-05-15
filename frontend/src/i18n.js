import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "app_name": "Krishi Sakhi",
      "tagline": "AI-Powered Farming Assistant",
      "dashboard": "Dashboard",
      "ai_models": "AI Models",
      "market_rates": "Market Rates",
      "schemes": "Schemes",
      "welcome": "Namaste",
      "log_activity": "Log Activity",
      "health_index": "Health Index",
      "soil_health": "Soil Health",
      "daily_water": "Daily Water",
      "pest_risk": "Pest Risk",
      "personalized_guidance": "Personalized Guidance",
      "farm_timeline": "Farm Activity Timeline",
      "upcoming_tasks": "Upcoming Tasks",
      "regional_climate": "Regional Climate",
      "humidity": "Humidity",
      "wind": "Wind",
      "preferences": "Preferences",
      "logout": "Log out",
      "reset_profile": "Factory Reset",
      "language": "Language",
      "select_language": "Select Language"
    }
  },
  hi: {
    translation: {
      "app_name": "कृषि सखी",
      "tagline": "एआई-संचालित खेती सहायक",
      "dashboard": "डैशबोर्ड",
      "ai_models": "एआई मॉडल",
      "market_rates": "बाज़ार दरें",
      "schemes": "योजनाएं",
      "welcome": "नमस्ते",
      "log_activity": "गतिविधि दर्ज करें",
      "health_index": "स्वास्थ्य सूचकांक",
      "soil_health": "मिट्टी का स्वास्थ्य",
      "daily_water": "दैनिक पानी",
      "pest_risk": "कीट जोखिम",
      "personalized_guidance": "व्यक्तिगत मार्गदर्शन",
      "farm_timeline": "कृषि गतिविधि समयरेखा",
      "upcoming_tasks": "आगामी कार्य",
      "regional_climate": "क्षेत्रीय जलवायु",
      "humidity": "नमी",
      "wind": "हवा",
      "preferences": "प्राथमिकताएँ",
      "logout": "लॉग आउट",
      "reset_profile": "फ़ैक्टरी रीसेट",
      "language": "भाषा",
      "select_language": "भाषा चुनें"
    }
  },
  ml: {
    translation: {
      "app_name": "കൃഷി സഖി",
      "tagline": "AI അധിഷ്ഠിത കൃഷി സഹായി",
      "dashboard": "ഡാഷ്‌ബോർഡ്",
      "ai_models": "AI മോഡലുകൾ",
      "market_rates": "വിപണി നിരക്കുകൾ",
      "schemes": "പദ്ധതികൾ",
      "welcome": "നമസ്തേ",
      "log_activity": "പ്രവർത്തനങ്ങൾ രേഖപ്പെടുത്തുക",
      "health_index": "ആരോഗ്യ സൂചിക",
      "soil_health": "മണ്ണിന്റെ ആരോഗ്യം",
      "daily_water": "ദൈനംദിന ജലം",
      "pest_risk": "കീടബാധ സാധ്യത",
      "personalized_guidance": "വ്യക്തിഗത നിർദ്ദേശങ്ങൾ",
      "farm_timeline": "കാർഷിക പ്രവർത്തനങ്ങൾ",
      "upcoming_tasks": "വരാനിരിക്കുന്ന ജോലികൾ",
      "regional_climate": "പ്രാദേശിക കാലാവസ്ഥ",
      "humidity": "അന്തരീക്ഷ ഈർപ്പം",
      "wind": "കാറ്റ്",
      "preferences": "ക്രമീകരണങ്ങൾ",
      "logout": "ലോഗ് ഔട്ട്",
      "reset_profile": "ഫാക്ടറി റീസെറ്റ്",
      "language": "ഭാഷ",
      "select_language": "ഭാഷ തിരഞ്ഞെടുക്കുക"
    }
  },
  ta: {
    translation: {
      "app_name": "கிருஷ்ண சகி",
      "tagline": "AI-இயங்கும் விவசாய உதவியாளர்",
      "dashboard": "டாஷ்போர்டு",
      "ai_models": "AI மாதிரிகள்",
      "market_rates": "சந்தை விலைகள்",
      "schemes": "திட்டங்கள்",
      "welcome": "வணக்கம்",
      "log_activity": "செயல்பாட்டைப் பதிவுசெய்க",
      "health_index": "ஆரோக்கிய குறியீடு",
      "soil_health": "மண் ஆரோக்கியம்",
      "daily_water": "தினசரி தண்ணீர்",
      "pest_risk": "பூச்சி ஆபத்து",
      "personalized_guidance": "தனிப்பயனாக்கப்பட்ட வழிகாட்டுதல்",
      "farm_timeline": "பண்ணை செயல்பாடு காலவரிசை",
      "upcoming_tasks": "வரவிருக்கும் பணிகள்",
      "regional_climate": "பிராந்திய காலநிலை",
      "humidity": "ஈரப்பதம்",
      "wind": "காற்று",
      "preferences": "விருப்பத்தேர்வுகள்",
      "logout": "வெளியேறு",
      "reset_profile": "தொழிற்சாலை மீட்டமைப்பு",
      "language": "மொழி",
      "select_language": "மொழியைத் தேர்ந்தெடுக்கவும்"
    }
  },
  te: {
    translation: {
      "app_name": "కృషి సఖి",
      "tagline": "AI-ఆధారిత వ్యవసాయ సహాయకుడు",
      "dashboard": "డ్యాష్‌బోర్డ్",
      "ai_models": "AI నమూనాలు",
      "market_rates": "మార్కెట్ ధరలు",
      "schemes": "పథకాలు",
      "welcome": "నమస్తే",
      "log_activity": "కార్యకలాపాన్ని నమోదు చేయండి",
      "health_index": "ఆరోగ్య సూచిక",
      "soil_health": "నేల ఆరోగ్యం",
      "daily_water": "రోజువారీ నీరు",
      "pest_risk": "తెగుళ్ళ ప్రమాదం",
      "personalized_guidance": "వ్యక్తిగత మార్గదర్శకత్వం",
      "farm_timeline": "ఫామ్ కార్యాచరణ కాలక్రమం",
      "upcoming_tasks": "రాబోయే పనులు",
      "regional_climate": "ప్రాంతీయ వాతావరణం",
      "humidity": "తేమ",
      "wind": "గాలి",
      "preferences": "ప్రాధాన్యతలు",
      "logout": "లాగ్ అవుట్",
      "reset_profile": "ఫ్యాక్టరీ రీసెట్",
      "language": "భాష",
      "select_language": "భాషను ఎంచుకోండి"
    }
  },
  kn: {
    translation: {
      "app_name": "ಕೃಷಿ ಸಖಿ",
      "tagline": "AI-ಚಾಲಿತ ಕೃಷಿ ಸಹಾಯಕ",
      "dashboard": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      "ai_models": "AI ಮಾದರಿಗಳು",
      "market_rates": "ಮಾರುಕಟ್ಟೆ ದರಗಳು",
      "schemes": "ಯೋಜನೆಗಳು",
      "welcome": "ನಮಸ್ತೆ",
      "log_activity": "ಚಟುವಟಿಕೆಯನ್ನು ದಾಖಲಿಸಿ",
      "health_index": "ಆರೋಗ್ಯ ಸೂಚ್ಯಂಕ",
      "soil_health": "ಮಣ್ಣಿನ ಆರೋಗ್ಯ",
      "daily_water": "ದೈನಂದಿನ ನೀರು",
      "pest_risk": "ಕೀಟಗಳ ಅಪಾಯ",
      "personalized_guidance": "ವೈಯಕ್ತಿಕ ಮಾರ್ಗದರ್ಶನ",
      "farm_timeline": "ಕೃಷಿ ಚಟುವಟಿಕೆಯ ಸಮಯಸೂಚಿ",
      "upcoming_tasks": "ಮುಂಬರುವ ಕೆಲಸಗಳು",
      "regional_climate": "ಪ್ರಾದೇಶಿಕ ಹವಾಮಾನ",
      "humidity": "ಆರ್ದ್ರತೆ",
      "wind": "ಗಾಳಿ",
      "preferences": "ಆದ್ಯತೆಗಳು",
      "logout": "ಲಾಗ್ ಔಟ್",
      "reset_profile": "ಫ್ಯಾಕ್ಟರಿ ಮರುಹೊಂದಿಸಿ",
      "language": "ಭಾಷೆ",
      "select_language": "ಭಾಷೆಯನ್ನು ಆರಿಸಿ"
    }
  },
  mr: {
    translation: {
      "app_name": "कृषी सखी",
      "tagline": "AI-आधारित शेती सहाय्यक",
      "dashboard": "डॅशबोर्ड",
      "ai_models": "AI मॉडेल्स",
      "market_rates": "बाजार भाव",
      "schemes": "योजना",
      "welcome": "नमस्ते",
      "log_activity": "नोंद करा",
      "health_index": "आरोग्य निर्देशांक",
      "soil_health": "मातीचे आरोग्य",
      "daily_water": "दैनिक पाणी",
      "pest_risk": "कीड जोखीम",
      "personalized_guidance": "वैयक्तिक मार्गदर्शन",
      "farm_timeline": "शेती उपक्रम टाइमलाइन",
      "upcoming_tasks": "पुढील कामे",
      "regional_climate": "प्रादेशिक हवामान",
      "humidity": "आद्रता",
      "wind": "वारा",
      "preferences": "पसंती",
      "logout": "लॉग आउट",
      "reset_profile": "फॅक्टरी रिसेट",
      "language": "भाषा",
      "select_language": "भाषा निवडा"
    }
  },
  bn: { translation: { "app_name": "কৃষি সখী", "welcome": "নমস্কার", "dashboard": "ড্যাশবোর্ড", "language": "ভাষা" } },
  pa: { translation: { "app_name": "ਕ੍ਰਿਸ਼ੀ ਸਖੀ", "welcome": "ਸਤਿ ਸ੍ਰੀ ਅಕਾਲ", "dashboard": "ਡੈਸ਼ਬੋਰਡ", "language": "ਭਾਸ਼ਾ" } },
  gu: { translation: { "app_name": "કૃષિ સખી", "welcome": "નમસ્તે", "dashboard": "ડેશબોર્ડ", "language": "ભાષા" } },
  or: { translation: { "app_name": "କୃଷି ସଖୀ", "welcome": "ନମସ୍କାର", "dashboard": "ଡ୍ୟାସବୋର୍ଡ", "language": "ଭାଷା" } },
  as: { translation: { "app_name": "কৃষি সখী", "welcome": "নমস্কাৰ", "dashboard": "ড্যাশবোর্ড", "language": "ভাষা" } },
  ur: { translation: { "app_name": "کرشی سکھی", "welcome": "آداب", "dashboard": "ڈیش بورڈ", "language": "زبان" } },
  ks: { translation: { "app_name": "کرشی سکھی", "welcome": "اسلام علیکم", "dashboard": "ڈیش بورڈ", "language": "زبان" } },
  ne: { translation: { "app_name": "कृषि सखी", "welcome": "नमस्ते", "dashboard": "ड्यासबೋರ್ড", "language": "भाषा" } },
  sa: { translation: { "app_name": "कृषि सखी", "welcome": "नमो नमः", "dashboard": "फलकम्", "language": "भाषा" } },
  kok: { translation: { "app_name": "कृषि सखी", "welcome": "नमस्कार", "dashboard": "डॅशबोर्ड", "language": "भास" } },
  doi: { translation: { "app_name": "कृषि सखी", "welcome": "नमस्ते", "dashboard": "डॅशबोर्ड", "language": "भाषा" } },
  mai: { translation: { "app_name": "कृषि सखी", "welcome": "प्रणाम", "dashboard": "डॅशबोर्ड", "language": "भाषा" } },
  sat: { translation: { "app_name": "ᱠᱨᱤᱥᱤ ᱥᱟᱠᱷᱤ", "welcome": "ᱡᱚᱦᱟᱨ", "dashboard": "ᱰᱮᱥᱵᱚᱨᱰ", "language": "ᱯᱟᱹᱨᱥᱤ" } },
  mni: { translation: { "app_name": "ᱠᱨᱤᱥᱤ ᱥᱟᱠᱷᱤ", "welcome": "ᱠᱷᱩᱨᱩᱢᱡަރᱤ", "dashboard": "ᱰᱮᱥᱵᱚᱨᱰ", "language": "ᱞᱳᱱ" } },
  brx: { translation: { "app_name": "कृषि सखी", "welcome": "खुलुमबाय", "dashboard": "डॅशबोर्ड", "language": "राव" } },
  sd: { translation: { "app_name": "ڪرشي سکي", "welcome": "नमस्ते", "dashboard": "ڊيش بورڊ", "language": "ٻولي" } }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
