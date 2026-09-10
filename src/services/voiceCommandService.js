/**
 * Voice Command Recognition Service for Agrovision AI.
 * Uses the Web Speech API (SpeechRecognition / webkitSpeechRecognition)
 * and an intelligent multi-lingual command mapping engine.
 */

export const COMMAND_CATEGORIES = {
  NAVIGATION: "navigation",
  FORM_INPUT: "form_input",
  UI_STATE: "ui_state",
  ADVISORY: "advisory",
};

// Multi-lingual command definitions with pattern matchers and handlers
export const COMMAND_REGISTRY = [
  // ==================== NAVIGATION COMMANDS ====================
  {
    id: "nav-dashboard",
    category: COMMAND_CATEGORIES.NAVIGATION,
    action: "NAVIGATE",
    target: "/",
    label: "Dashboard",
    patterns: [
      /dashboard/i,
      /home/i,
      /डैशबोर्ड/i,
      /मुख्य पृष्ठ/i,
      /होम/i,
      /घर/i,
      /મુખ્ય પૃષ્ઠ/i,
    ],
    feedback: {
      en: "Navigating to Kisan Dashboard.",
      hi: "किसान डैशबोर्ड पर ले जाया जा रहा है।",
      mr: "शेतकरी डॅशबोर्ड उघडत आहे.",
      gu: "મુખ્ય ડેશબોર્ડ ખોલી રહ્યો છું.",
    },
  },
  {
    id: "nav-markets",
    category: COMMAND_CATEGORIES.NAVIGATION,
    action: "NAVIGATE",
    target: "/markets",
    label: "Market Prices",
    patterns: [
      /mandi/i,
      /market\s*prices?/i,
      /bajar\s*bhav/i,
      /mandi\s*rates?/i,
      /rates?/i,
      /मंडी/i,
      /बाजार भाव/i,
      /भाव/i,
      /દર/i,
      /બજાર ભાવ/i,
      /મંડી/i,
    ],
    feedback: {
      en: "Opening live Mandi Prices and net realizations.",
      hi: "लाइव मंडी भाव और शुद्ध मुनाफा तुलना खोली जा रही है।",
      mr: "थेट बाजार भाव आणि नफा उघडत आहे.",
      gu: "લાઈવ મંડી અને બજાર ભાવ ખોલી રહ્યો છું.",
    },
  },
  {
    id: "nav-grading",
    category: COMMAND_CATEGORIES.NAVIGATION,
    action: "NAVIGATE",
    target: "/grading",
    label: "Quality Grading",
    patterns: [
      /grading/i,
      /quality/i,
      /camera\s*test/i,
      /inspect/i,
      /गुणवत्ता/i,
      /जांच/i,
      /ग्रेडिंग/i,
      /प्रतवारी/i,
      /તપાસ/i,
      /ગુણવત્તા/i,
    ],
    feedback: {
      en: "Opening AI Quality Grading suite.",
      hi: "AI गुणवत्ता ग्रेडिंग और जांच कक्ष खोला जा रहा है।",
      mr: "AI गुणवत्ता प्रतवारी उघडत आहे.",
      gu: "AI ગુણવત્તા ગ્રેડિંગ ખોલી રહ્યો છું.",
    },
  },
  {
    id: "nav-storage",
    category: COMMAND_CATEGORIES.NAVIGATION,
    action: "NAVIGATE",
    target: "/storage",
    label: "Storage Planner",
    patterns: [
      /storage/i,
      /warehouse/i,
      /cold\s*storage/i,
      /pledge\s*loan/i,
      /e-?nwr/i,
      /गोदाम/i,
      /भंडारण/i,
      /वखार/i,
      /સંગ્રહ/i,
      /વેરહાઉસ/i,
    ],
    feedback: {
      en: "Opening Storage Planner and e-NWR loan calculator.",
      hi: "भंडारण योजनाकार और वेयरहाउस लोन कैलकुलेटर खोला जा रहा है।",
      mr: "गोदाम नियोजन आणि कर्ज गणक उघडत आहे.",
      gu: "વેરહાઉસ સંગ્રહ અને e-NWR લોન આયોજક ખોલી રહ્યો છું.",
    },
  },
  {
    id: "nav-transport",
    category: COMMAND_CATEGORIES.NAVIGATION,
    action: "NAVIGATE",
    target: "/transport",
    label: "Transport & Logistics",
    patterns: [
      /transport/i,
      /logistics/i,
      /freight/i,
      /truck/i,
      /tempo/i,
      /परिवहन/i,
      /भाड़ा/i,
      /ट्रक/i,
      /गाड़ी/i,
      /વાહન/i,
      /ભાડું/i,
    ],
    feedback: {
      en: "Opening Transport & Freight Logistics.",
      hi: "परिवहन और भाड़ा बुकिंग पृष्ठ खोला जा रहा है।",
      mr: "वाहतूक आणि भाडे नियोजन उघडत आहे.",
      gu: "પરિવહન અને વાહન ભાડું કેલ્ક્યુલેટર ખોલી રહ્યો છું.",
    },
  },
  {
    id: "nav-recommendations",
    category: COMMAND_CATEGORIES.NAVIGATION,
    action: "NAVIGATE",
    target: "/recommendations",
    label: "AI Recommendations",
    patterns: [
      /recommendations?/i,
      /advice/i,
      /strategy/i,
      /सलाह/i,
      /सिफारिश/i,
      /सल्ला/i,
      /સલાહ/i,
    ],
    feedback: {
      en: "Opening AI post-harvest strategic recommendations.",
      hi: "AI बिक्री रणनीतियाँ और सिफारिशें दिखाई जा रही हैं।",
      mr: "AI विक्री सल्ले उघडत आहे.",
      gu: "AI વેચાણ વ્યૂહરચના અને સલાહ ખોલી રહ્યો છું.",
    },
  },
  {
    id: "nav-crops",
    category: COMMAND_CATEGORIES.NAVIGATION,
    action: "NAVIGATE",
    target: "/crops",
    label: "My Crops",
    patterns: [
      /my\s*crops?/i,
      /harvest/i,
      /lots?/i,
      /फसल/i,
      /उपज/i,
      /पिके/i,
      /મારા પાક/i,
    ],
    feedback: {
      en: "Viewing your harvested crops and storage lots.",
      hi: "आपकी कटी हुई फसलें और भंडारण लॉट दिखाए जा रहे हैं।",
      mr: "आपली शेती पिके आणि साठा दाखवत आहे.",
      gu: "તમારા લણેલા પાક અને સક્રિય લોટ બતાવી રહ્યો છું.",
    },
  },
  {
    id: "nav-alerts",
    category: COMMAND_CATEGORIES.NAVIGATION,
    action: "NAVIGATE",
    target: "/alerts",
    label: "Alerts & Weather",
    patterns: [
      /alerts?/i,
      /weather/i,
      /rain/i,
      /warnings?/i,
      /अलर्ट/i,
      /मौसम/i,
      /बारिश/i,
      /हवामान/i,
      /ચેતવણી/i,
    ],
    feedback: {
      en: "Checking local weather forecast and market warnings.",
      hi: "स्थानीय मौसम पूर्वानुमान और बाजार अलर्ट खोले जा रहे हैं।",
      mr: "स्थानिक हवामान अंदाज आणि चेतावण्या उघडत आहे.",
      gu: "સ્થાનિક હવામાન આગાહી અને બજાર ચેતવણીઓ બતાવી રહ્યો છું.",
    },
  },
  {
    id: "nav-reports",
    category: COMMAND_CATEGORIES.NAVIGATION,
    action: "NAVIGATE",
    target: "/reports",
    label: "Profit Reports",
    patterns: [/reports?/i, /analytics/i, /history/i, /रिपोर्ट/i, /अહેવાલ/i],
    feedback: {
      en: "Opening Profit and Net Realization Reports.",
      hi: "शुद्ध मुनाफा और आय रिपोर्ट खोली जा रही है।",
      mr: "नफा आणि उत्पन्न अहवाल उघडत आहे.",
      gu: "નફા અને આવકનો અહેવાલ ખોલી રહ્યો છું.",
    },
  },

  // ==================== FORM INPUTS & FILTERING ====================
  {
    id: "filter-crop-cotton",
    category: COMMAND_CATEGORIES.FORM_INPUT,
    action: "SET_CROP_FILTER",
    payload: { crop: "Cotton" },
    label: "Filter: Cotton",
    patterns: [
      /(filter|select|show|choose)\s*(cotton|kapas)/i,
      /cotton/i,
      /कपास/i,
      /कापूस/i,
      /કપાસ/i,
    ],
    feedback: {
      en: "Filter updated to Cotton.",
      hi: "कपास फसल चुनी गई है।",
      mr: "कापूस पीक निवडले आहे.",
      gu: "કપાસ પાક ફિલ્ટર પસંદ કરાયો છે.",
    },
  },
  {
    id: "filter-crop-onion",
    category: COMMAND_CATEGORIES.FORM_INPUT,
    action: "SET_CROP_FILTER",
    payload: { crop: "Onion" },
    label: "Filter: Onion",
    patterns: [
      /(filter|select|show|choose)\s*(onion|pyaj|kanda)/i,
      /onion/i,
      /प्याज/i,
      /कांदा/i,
      /ડુંગળી/i,
    ],
    feedback: {
      en: "Filter updated to Onion.",
      hi: "प्याज फसल चुनी गई है।",
      mr: "कांदा पीक निवडले आहे.",
      gu: "ડુંગળી પાક ફિલ્ટર પસંદ કરાયો છે.",
    },
  },
  {
    id: "filter-crop-soybean",
    category: COMMAND_CATEGORIES.FORM_INPUT,
    action: "SET_CROP_FILTER",
    payload: { crop: "Soybean" },
    label: "Filter: Soybean",
    patterns: [
      /(filter|select|show|choose)\s*(soybean|soya)/i,
      /soybean/i,
      /सोयाबीन/i,
      /સોયાબીન/i,
    ],
    feedback: {
      en: "Filter updated to Soybean.",
      hi: "सोयाबीन फसल चुनी गई है।",
      mr: "सोयाबीन पीक निवडले आहे.",
      gu: "સોયાબીન પાક ફિલ્ટર પસંદ કરાયો છે.",
    },
  },
  {
    id: "filter-crop-all",
    category: COMMAND_CATEGORIES.FORM_INPUT,
    action: "SET_CROP_FILTER",
    payload: { crop: "All" },
    label: "Filter: All Crops",
    patterns: [
      /all\s*crops?/i,
      /reset\s*filter/i,
      /सभी फसलें/i,
      /सर्व पिके/i,
      /બધા પાક/i,
    ],
    feedback: {
      en: "Showing all harvested crops.",
      hi: "सभी फसलें दिखाई जा रही हैं।",
      mr: "सर्व पिके दाखवत आहे.",
      gu: "બધા પાક દર્શાવી રહ્યો છું.",
    },
  },
  {
    id: "set-holding-days",
    category: COMMAND_CATEGORIES.FORM_INPUT,
    action: "SET_HOLDING_DAYS",
    label: "Set Holding Days",
    patterns: [
      /(hold|holding|store|keep)\s*(\d+)\s*days?/i,
      /(\d+)\s*(days?|दिन|दिवस)/i,
    ],
    extractPayload: (text) => {
      const match = text.match(/(\d+)/);
      const days = match ? parseInt(match[1], 10) : 45;
      return { days: Math.min(120, Math.max(10, days)) };
    },
    feedback: {
      en: "Storage holding period set to {days} days.",
      hi: "भंडारण अवधि {days} दिन सेट की गई।",
      mr: "गोदाम साठवणूक कालावधी {days} दिवस सेट केला.",
      gu: "સંગ્રહ સમયગાળો {days} દિવસ સેટ કર્યો છે.",
    },
  },
  {
    id: "set-vehicle-tractor",
    category: COMMAND_CATEGORIES.FORM_INPUT,
    action: "SET_VEHICLE_TYPE",
    payload: { vehicleType: "Tractor Trolley" },
    label: "Vehicle: Tractor",
    patterns: [/tractor/i, /ट्रैक्टर/i, /ट्रॅक्टर/i, /ટ્રેક્ટર/i],
    feedback: {
      en: "Transport vehicle set to Tractor Trolley.",
      hi: "परिवहन वाहन ट्रैक्टर ट्रॉली चुना गया।",
      mr: "वाहन ट्रॅक्टर ट्रॉली निवडले.",
      gu: "વાહન ટ્રેક્ટર ટ્રોલી પસંદ કરાયું.",
    },
  },
  {
    id: "set-vehicle-truck",
    category: COMMAND_CATEGORIES.FORM_INPUT,
    action: "SET_VEHICLE_TYPE",
    payload: { vehicleType: "10-Wheeler Truck" },
    label: "Vehicle: 10-Wheeler Truck",
    patterns: [/truck/i, /10\s*wheeler/i, /ट्रक/i, /ટ્રક/i],
    feedback: {
      en: "Transport vehicle set to 10-Wheeler Truck.",
      hi: "परिवहन वाहन 10-चक्का ट्रक चुना गया।",
      mr: "वाहन १०-चाकी ट्रक निवडले.",
      gu: "વાહન ૧૦-વ્હીલર ટ્રક પસંદ કરાયું.",
    },
  },
  {
    id: "search-query",
    category: COMMAND_CATEGORIES.FORM_INPUT,
    action: "SEARCH_QUERY",
    label: "Search Input",
    patterns: [
      /(?:search|find|lookup|खोजो|શોધો)\s+(.+)/i,
      /(?:anand|rajkot|lasalgaon|indore|vadodara|gondal)/i,
    ],
    extractPayload: (text) => {
      const match = text.match(/(?:search|find|lookup|खोजो|શોધો)\s+(.+)/i);
      const query = match ? match[1].trim() : text.trim();
      return { query };
    },
    feedback: {
      en: "Searching for {query}.",
      hi: "{query} खोजा जा रहा है।",
      mr: "{query} शोधत आहे.",
      gu: "{query} શોધી રહ્યો છું.",
    },
  },

  // ==================== UI STATE CHANGES ====================
  {
    id: "lang-hindi",
    category: COMMAND_CATEGORIES.UI_STATE,
    action: "SET_LANGUAGE",
    payload: { locale: "hi" },
    label: "Language: Hindi",
    patterns: [/hindi/i, /हिन्दी/i, /हिंदी\s*करो/i],
    feedback: {
      en: "Language changed to Hindi.",
      hi: "भाषा सफलतापूर्वक हिन्दी में बदल दी गई है।",
      mr: "भाषा बदलून हिन्दी केली आहे.",
      gu: "ભાષા હિન્દીમાં બદલાઈ ગઈ છે.",
    },
  },
  {
    id: "lang-marathi",
    category: COMMAND_CATEGORIES.UI_STATE,
    action: "SET_LANGUAGE",
    payload: { locale: "mr" },
    label: "Language: Marathi",
    patterns: [/marathi/i, /मराठी/i, /मराठी\s*करा/i],
    feedback: {
      en: "Language changed to Marathi.",
      hi: "भाषा मराठी में बदल दी गई है।",
      mr: "भाषा यशस्वीरित्या मराठीमध्ये बदलली आहे.",
      gu: "ભાષા મરાઠીમાં બદલાઈ ગઈ છે.",
    },
  },
  {
    id: "lang-gujarati",
    category: COMMAND_CATEGORIES.UI_STATE,
    action: "SET_LANGUAGE",
    payload: { locale: "gu" },
    label: "Language: Gujarati",
    patterns: [/gujarati/i, /ગુજરાતી/i, /ગુજરાતી\s*કરો/i],
    feedback: {
      en: "Language changed to Gujarati.",
      hi: "भाषा गुजराती में बदल दी गई है।",
      mr: "भाषा गुजरातीमध्ये बदलली आहे.",
      gu: "નમસ્તે! ભાષા સફળતાપૂર્વક ગુજરાતીમાં બદલાઈ ગઈ છે.",
    },
  },
  {
    id: "lang-english",
    category: COMMAND_CATEGORIES.UI_STATE,
    action: "SET_LANGUAGE",
    payload: { locale: "en" },
    label: "Language: English",
    patterns: [/english/i, /अंग्रेजी/i, /ઇંગ્લિશ/i],
    feedback: {
      en: "Language switched to English.",
      hi: "भाषा बदलकर अंग्रेजी कर दी गई है।",
      mr: "भाषा बदलून इंग्रजी केली आहे.",
      gu: "ભાષા અંગ્રેજીમાં બદલાઈ ગઈ છે.",
    },
  },
  {
    id: "ui-open-camera",
    category: COMMAND_CATEGORIES.UI_STATE,
    action: "TRIGGER_CAMERA_MODAL",
    label: "Open Camera",
    patterns: [
      /take\s*photo/i,
      /open\s*camera/i,
      /capture\s*crop/i,
      /scan\s*produce/i,
      /फोटो खींचो/i,
      /कैमरा खोलो/i,
      /कॅमेरा उघडा/i,
      /કૅમેરા ખોલો/i,
      /ફોટો પાડો/i,
    ],
    feedback: {
      en: "Launching AI Produce Quality Camera.",
      hi: "AI फसल गुणवत्ता कैमरा शुरू कर रहा हूँ, फोटो लें।",
      mr: "AI शेतीमाल कॅमेरा सुरू करत आहे.",
      gu: "AI પાક ગુણવત્તા કેમેરા શરૂ કરી રહ્યો છું.",
    },
  },
  {
    id: "ui-refresh-prices",
    category: COMMAND_CATEGORIES.UI_STATE,
    action: "REFRESH_PRICES",
    label: "Sync Live Prices",
    patterns: [
      /refresh\s*prices?/i,
      /sync\s*rates?/i,
      /update\s*prices?/i,
      /ताजा भाव/i,
      /भाव अपडेट/i,
      /ભાવ અપડેટ/i,
    ],
    feedback: {
      en: "Syncing realtime Mandi prices from data.gov.in.",
      hi: "data.gov.in से लाइव मंडी भाव अपडेट किए जा रहे हैं।",
      mr: "data.gov.in वरून थेट बाजार भाव अपडेट करत आहे.",
      gu: "data.gov.in પોર્ટલ પરથી તાજા મંડી ભાવ લાવી રહ્યો છું.",
    },
  },
  {
    id: "ui-close-modal",
    category: COMMAND_CATEGORIES.UI_STATE,
    action: "CLOSE_MODAL",
    label: "Close Modal",
    patterns: [
      /close\s*(modal|window|dialog)?/i,
      /dismiss/i,
      /बंद करो/i,
      /बंद करा/i,
      /બંધ કરો/i,
    ],
    feedback: {
      en: "Window closed.",
      hi: "विंडो बंद कर दी गई।",
      mr: "विंडो बंद केली.",
      gu: "વિન્ડો બંધ કરી દીધી છે.",
    },
  },
  {
    id: "ui-toggle-audio",
    category: COMMAND_CATEGORIES.UI_STATE,
    action: "TOGGLE_AUDIO",
    label: "Toggle Audio",
    patterns: [
      /stop\s*talking/i,
      /mute/i,
      /unmute/i,
      /बोलना बंद करो/i,
      /अवाज बंद/i,
      /શાંત થાઓ/i,
    ],
    feedback: {
      en: "Audio state updated.",
      hi: "ऑडियो बंद किया गया।",
      mr: "ऑडिओ बंद केला.",
      gu: "અવાજ બંધ કર્યો છે.",
    },
  },
];

/**
 * Parses spoken text against the command registry.
 * Returns matched command specification and payload.
 */
export function matchVoiceCommand(spokenText, currentLocale = "en") {
  if (!spokenText || typeof spokenText !== "string") return null;
  const clean = spokenText.trim().toLowerCase();

  for (const cmd of COMMAND_REGISTRY) {
    for (const pattern of cmd.patterns) {
      if (pattern.test(clean)) {
        let payload = cmd.payload || {};
        if (typeof cmd.extractPayload === "function") {
          payload = { ...payload, ...cmd.extractPayload(clean) };
        }

        let feedbackText =
          cmd.feedback?.[currentLocale] || cmd.feedback?.en || "Command executed.";

        // Interpolate payload into feedback text
        Object.entries(payload).forEach(([k, v]) => {
          feedbackText = feedbackText.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
        });

        return {
          id: cmd.id,
          action: cmd.action,
          category: cmd.category,
          target: cmd.target,
          label: cmd.label,
          payload,
          feedbackText,
          rawText: clean,
          timestamp: Date.now(),
        };
      }
    }
  }

  return null;
}

/**
 * Web Speech Synthesis (Speech Output) helper with regional voice fallback
 */
export function speakFeedback(text, locale = "en") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(text);
    const langMap = {
      en: "en-IN",
      hi: "hi-IN",
      mr: "mr-IN",
      gu: "gu-IN",
    };
    utterance.lang = langMap[locale] || "en-IN";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices() || [];
    const targetLang = utterance.lang.toLowerCase();
    const voice =
      voices.find((v) => v.lang && v.lang.toLowerCase().startsWith(targetLang.split("-")[0])) ||
      voices[0];

    if (voice) utterance.voice = voice;

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn("Speech synthesis error:", err);
  }
}

/**
 * Initializes a SpeechRecognition instance with safe feature detection
 */
export function createSpeechRecognizer({
  locale = "en",
  onResult,
  onError,
  onStart,
  onEnd,
}) {
  if (typeof window === "undefined") return null;

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return null;
  }

  const recognition = new SpeechRecognition();
  const langMap = {
    en: "en-IN",
    hi: "hi-IN",
    mr: "mr-IN",
    gu: "gu-IN",
  };

  recognition.lang = langMap[locale] || "en-IN";
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    if (onStart) onStart();
  };

  recognition.onresult = (event) => {
    let interim = "";
    let final = "";

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        final += transcript;
      } else {
        interim += transcript;
      }
    }

    if (onResult) {
      onResult({
        finalText: final.trim(),
        interimText: interim.trim(),
        isFinal: !!final,
      });
    }
  };

  recognition.onerror = (event) => {
    if (onError) onError(event);
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  return recognition;
}
