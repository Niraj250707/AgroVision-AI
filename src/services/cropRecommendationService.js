/**
 * AI-Powered Crop Recommendation & Planting Schedule Engine
 * Evaluates Soil Quality Data (Type, pH, N-P-K, Organic Carbon) and
 * Historical Climate Patterns (Agro-Climatic Zone, Season, Rainfall History)
 * to suggest optimal planting schedules, expected yields, and fertilizer management.
 */

export const SOIL_PRESETS = [
  {
    id: "anand-alluvial",
    name: "Anand & Kheda Alluvial Loam (ગુજરાત કાંપવાળી જમીન)",
    soilType: "Alluvial Loam",
    ph: 7.2,
    nitrogen: 240, // kg/ha (Medium)
    phosphorus: 28, // kg/ha (Medium)
    potassium: 310, // kg/ha (High)
    organicCarbon: 0.65, // %
    drainage: "Good",
    zone: "Gujarat Semi-Arid Plains",
  },
  {
    id: "saurashtra-black",
    name: "Saurashtra Deep Black Soil (સૌરાષ્ટ્ર કાળી જમીન)",
    soilType: "Deep Black Cotton Soil",
    ph: 7.8,
    nitrogen: 190, // kg/ha (Low-Medium)
    phosphorus: 22,
    potassium: 380,
    organicCarbon: 0.52,
    drainage: "Moderate",
    zone: "Gujarat Semi-Arid Plains",
  },
  {
    id: "nashik-red-loam",
    name: "Nashik & Niphad Medium Black Loam (नाशिक मध्यम काळी जमीन)",
    soilType: "Clay Loam",
    ph: 6.8,
    nitrogen: 260,
    phosphorus: 32,
    potassium: 290,
    organicCarbon: 0.72,
    drainage: "Good",
    zone: "Maharashtra Western Ghats & Deccan",
  },
  {
    id: "indore-malwa",
    name: "Malwa Fertile Black Soil (मालवा काली मिट्टी)",
    soilType: "Deep Black Cotton Soil",
    ph: 7.4,
    nitrogen: 220,
    phosphorus: 26,
    potassium: 340,
    organicCarbon: 0.60,
    drainage: "Moderate",
    zone: "Central Malwa Plateau",
  },
];

export const CROP_KNOWLEDGE_BASE = [
  {
    id: "cotton",
    name: "Cotton (कपास / કપાસ)",
    cropType: "Cotton",
    variety: "Bt Shankar-6 / G.Cot.Hy-12",
    season: "Kharif",
    suitableSoils: ["Deep Black Cotton Soil", "Clay Loam", "Alluvial Loam"],
    minPh: 6.5,
    maxPh: 8.2,
    waterRequirement: "Medium (550-700mm)",
    growthDays: "160-170 Days",
    plantingWindowEn: "June 25 - July 10 (Onset of southwest monsoon)",
    plantingWindowGu: "૨૫ જૂન - ૧૦ જુલાઈ (ચોમાસાના પ્રથમ વરસાદ સાથે)",
    plantingWindowHi: "25 जून - 10 जुलाई (मानसून की पहली बारिश पर)",
    plantingWindowMr: "२५ जून - १० जुलै (मान्सूनच्या सुरुवातीस)",
    harvestWindowEn: "November 20 - January 15 (Multi-pickings)",
    harvestWindowGu: "૨૦ નવેમ્બર - ૧૫ જાન્યુઆરી (૩-૪ વીણીઓમાં)",
    harvestWindowHi: "20 नवंबर - 15 जनवरी (3-4 चुनाई)",
    harvestWindowMr: "२० नोव्हेंबर - १५ जानेवारी (वेचणी)",
    yieldRange: "12 - 16 Quintals / Acre",
    projectedReturn: "₹72,000 - ₹88,000 / Acre",
    fertilizerDoseEn: "Basal: 50kg DAP + 25kg MOP. Top dress: 45kg Urea in 2 splits (30 & 60 days). Micronutrients: Zinc Sulphate 10kg/acre.",
    fertilizerDoseGu: "પાયાનું ખાતર: ૫૦ કિગ્રા DAP + ૨૫ કિગ્રા MOP. પૂર્તિ ખાતર: ૪૫ કિગ્રા યુરિયા (બે હપ્તામાં ૩૦ અને ૬૦ દિવસે). ઝિંક સલ્ફેટ ૧૦ કિગ્રા/એકર.",
    fertilizerDoseHi: "आधार खाद: 50 किलो DAP + 25 किलो MOP। टॉप ड्रेसिंग: 45 किलो यूरिया (30 और 60 दिन पर)। जिंक सल्फेट 10 किग्रा/एकड़।",
    fertilizerDoseMr: "पायाभूत खत: ५० किलो DAP + २५ किलो MOP. युरिया ४५ किलो (३० व ६० दिवसांनी दोन हप्त्यात).",
    whyRecommendedGu: "કાળી અને કાંપવાળી જમીનમાં કપાસ મૂળ ઊંડા નાખી ઉત્તમ ઉપજ આપે છે. વર્તમાન APMC બજારમાં શંકર-૬ ના ભાવ ₹૭,૮૫૦/ક્વિન્ટલ મળી રહ્યા છે.",
    whyRecommendedHi: "काली मिट्टी में कपास की जड़ें गहरी जाती हैं। वर्तमान APMC में शंकर-6 का भाव ₹7,850/क्विंटल तक मिल रहा है।",
    whyRecommendedEn: "Deep black soil retains ideal moisture for long-staple Shankar-6 lint. Vadodara terminal mandis currently offer ₹7,850/qtl premium.",
  },
  {
    id: "wheat",
    name: "Sharbati Wheat (गेहूं / શરબતી ઘઉં)",
    cropType: "Wheat",
    variety: "GW-496 / Lok-1 / C-306 Sharbati",
    season: "Rabi",
    suitableSoils: ["Alluvial Loam", "Clay Loam", "Deep Black Cotton Soil"],
    minPh: 6.2,
    maxPh: 7.9,
    waterRequirement: "Medium (4-5 irrigations)",
    growthDays: "115-125 Days",
    plantingWindowEn: "November 5 - November 25 (Ideal soil temp 20-22°C)",
    plantingWindowGu: "૫ નવેમ્બર - ૨૫ નવેમ્બર (શિયાળુ તાપમાન ૨૦-૨૨°C)",
    plantingWindowHi: "5 नवंबर - 25 नवंबर (आदर्श तापमान 20-22°C)",
    plantingWindowMr: "५ नोव्हेंबर - २५ नोव्हेंबर (अनुकूल तापमान)",
    harvestWindowEn: "March 15 - April 5",
    harvestWindowGu: "૧૫ માર્ચ - ૫ એપ્રિલ",
    harvestWindowHi: "15 मार्च - 5 अप्रैल",
    harvestWindowMr: "१५ मार्च - ५ एप्रिल",
    yieldRange: "18 - 24 Quintals / Acre",
    projectedReturn: "₹52,000 - ₹66,000 / Acre",
    fertilizerDoseEn: "Basal: 50kg DAP + 20kg MOP. Top dress: 40kg Urea at first irrigation (CRI stage) & 35kg Urea at tillering.",
    fertilizerDoseGu: "પાયાનું ખાતર: ૫૦ કિગ્રા DAP + ૨૦ કિગ્રા MOP. પૂર્તિ ખાતર: પ્રથમ પિયત (CRI સ્ટેજ) પર ૪૦ કિગ્રા યુરિયા અને ફૂટ સમયે ૩૫ કિગ્રા યુરિયા.",
    fertilizerDoseHi: "आधार खाद: 50 किलो DAP + 20 किलो MOP। पहली सिंचाई पर 40 किलो यूरिया और कल्ले फूटते समय 35 किलो यूरिया।",
    fertilizerDoseMr: "पायाभूत खत: ५० किलो DAP + २० किलो MOP. पहिल्या पाण्यावेळी ४० किलो युरिया.",
    whyRecommendedGu: "કાંપવાળી જમીનમાં શરબતી ઘઉં ચમકદાર દાણા અને ઊંચી ઉપજ આપે છે. સરકારી MSP ₹૨,૨૭૫ છે પરંતુ વેપારીઓ ₹૨,૬૫૦ થી ₹૨,૮૫૦ ચૂકવે છે.",
    whyRecommendedHi: "दोमट मिट्टी में शरबती गेहूं चमकदार दाना और अधिक उपज देता है। खुले बाजार में भाव ₹2,650/क्विंटल से अधिक मिलता है।",
    whyRecommendedEn: "Alluvial loam ensures uniform grain filling and premium luster. Millers pay up to ₹2,850/qtl for GW-496/Sharbati grain.",
  },
  {
    id: "onion",
    name: "Red Onion (कांदा / લાલ ડુંગળી)",
    cropType: "Onion",
    variety: "Nashik Red Super / Agri-Found Dark Red",
    season: "Rabi",
    suitableSoils: ["Clay Loam", "Alluvial Loam", "Deep Black Cotton Soil"],
    minPh: 6.5,
    maxPh: 7.8,
    waterRequirement: "High (Frequent light irrigations)",
    growthDays: "120-135 Days",
    plantingWindowEn: "October 15 - November 10 (Transplanting nursery)",
    plantingWindowGu: "૧૫ ઓક્ટોબર - ૧૦ નવેમ્બર (ધરૂની ફેરરોપણી)",
    plantingWindowHi: "15 अक्टूबर - 10 नवंबर (पौध रोपाई)",
    plantingWindowMr: "१५ ऑक्टोबर - १० नोव्हेंबर (पुनर्लागवड)",
    harvestWindowEn: "February 20 - March 25",
    harvestWindowGu: "૨૦ ફેબ્રુઆરી - ૨૫ માર્ચ",
    harvestWindowHi: "20 फरवरी - 25 मार्च",
    harvestWindowMr: "२० फेब्रुवारी - २५ मार्च",
    yieldRange: "100 - 130 Quintals / Acre",
    projectedReturn: "₹1,10,000 - ₹1,45,000 / Acre",
    fertilizerDoseEn: "Basal: 50kg Single Super Phosphate (SSP) + 25kg MOP + 10kg Sulphur. Top dress: 30kg Urea at 30 days & 20kg at 45 days.",
    fertilizerDoseGu: "પાયાનું ખાતર: ૫૦ કિગ્રા SSP + ૨૫ કિગ્રા MOP + ૧૦ કિગ્રા સલ્ફર. પૂર્તિ ખાતર: ૩૦ દિવસે ૩૦ કિગ્રા યુરિયા અને ૪૫ દિવસે ૨૦ કિગ્રા યુરિયા.",
    fertilizerDoseHi: "आधार खाद: 50 किलो SSP + 25 किलो MOP + 10 किलो सल्फर। रोपाई के 30 दिन बाद 30 किलो यूरिया।",
    fertilizerDoseMr: "पायाभूत खत: ५० किलो SSP + २५ किलो MOP + १० किलो सल्फर.",
    whyRecommendedGu: "સલ્ફર યુક્ત ગોરાડુ-કાળી જમીનમાં ડુંગળીનો રંગ ઘાટો લાલ અને સંગ્રહ ક્ષમતા ૬૦ દિવસ સુધી સારી રહે છે. નફો સૌથી વધુ મળી શકે છે.",
    whyRecommendedHi: "मध्यम काली मिट्टी में प्याज का रंग गहरा लाल और भंडारण क्षमता 60 दिनों तक उत्तम रहती है।",
    whyRecommendedEn: "Rich sulfur and well-drained loam produce compact bulbs with high pungency and exportable storage life.",
  },
  {
    id: "soybean",
    name: "Soybean (सोयाबीन)",
    cropType: "Soybean",
    variety: "JS-335 / NRC-37 / JS-9560",
    season: "Kharif",
    suitableSoils: ["Deep Black Cotton Soil", "Clay Loam"],
    minPh: 6.5,
    maxPh: 7.6,
    waterRequirement: "Medium (450-600mm)",
    growthDays: "95-105 Days",
    plantingWindowEn: "June 20 - July 5 (Within 72h of 75-100mm rain)",
    plantingWindowGu: "૨૦ જૂન - ૫ જુલાઈ (૭૫-૧૦૦ મીમી વરસાદ પછી)",
    plantingWindowHi: "20 जून - 5 जुलाई (75-100 मिमी बारिश के बाद)",
    plantingWindowMr: "२० जून - ५ जुलै (७५-१०० मिमी पाऊस पडल्यानंतर)",
    harvestWindowEn: "September 25 - October 15",
    harvestWindowGu: "૨૫ સપ્ટેમ્બર - ૧૫ ઓક્ટોબર",
    harvestWindowHi: "25 सितंबर - 15 अक्टूबर",
    harvestWindowMr: "२५ सप्टेंबर - १५ ऑक्टोबर",
    yieldRange: "10 - 13 Quintals / Acre",
    projectedReturn: "₹46,000 - ₹58,000 / Acre",
    fertilizerDoseEn: "Basal: 40kg DAP + 20kg MOP + 10kg Zinc. Inoculate seeds with Rhizobium & PSB culture.",
    fertilizerDoseGu: "પાયાનું ખાતર: ૪૦ કિગ્રા DAP + ૨૦ કિગ્રા MOP. રાઇઝોબિયમ અને PSB કલ્ચરથી બીજ માવજત કરવી.",
    fertilizerDoseHi: "आधार खाद: 40 किलो DAP + 20 किलो MOP। राइजोबियम और पीएसबी कल्चर से बीज उपचार अनिवार्य।",
    fertilizerDoseMr: "पायाभूत खत: ४० किलो DAP + २० किलो MOP. रायझोबियम जिवाणू संवर्धन बीजप्रक्रिया करा.",
    whyRecommendedGu: "ઓછા દિવસો (૧૦૦ દિવસ) માં પાકી જાય છે અને જમીનમાં નાઇટ્રોજન વધારે છે, જેથી પછી રવિ સિઝનમાં ઘઉંનું વાવેતર સરળ બને છે.",
    whyRecommendedHi: "100 दिनों में पककर तैयार हो जाती है और अगली रबी फसल (गेहूं) के लिए जमीन में नाइट्रोजन छोड़ती है।",
    whyRecommendedEn: "Short 100-day duration fixes atmospheric nitrogen, perfectly priming soil for a high-yield Rabi wheat crop.",
  },
  {
    id: "mustard",
    name: "Mustard (सरसों / રાયડો)",
    cropType: "Mustard",
    variety: "Pusa Bold / GDM-4 (Gujarat Mustard)",
    season: "Rabi",
    suitableSoils: ["Alluvial Loam", "Clay Loam", "Deep Black Cotton Soil"],
    minPh: 6.0,
    maxPh: 8.0,
    waterRequirement: "Low (2-3 light irrigations)",
    growthDays: "105-115 Days",
    plantingWindowEn: "October 10 - October 31 (Moderate autumn temperatures)",
    plantingWindowGu: "૧૦ ઓક્ટોબર - ૩૧ ઓક્ટોબર (વાવણી માટે આદર્શ સમય)",
    plantingWindowHi: "10 अक्टूबर - 31 अक्टूबर (हल्की ठंड की शुरुआत)",
    plantingWindowMr: "१० ऑक्टोबर - ३१ ऑक्टोबर (पेरणीसाठी अनुकूल काळ)",
    harvestWindowEn: "February 10 - February 28",
    harvestWindowGu: "૧૦ ફેબ્રુઆરી - ૨૮ ફેબ્રુઆરી",
    harvestWindowHi: "10 फरवरी - 28 फरवरी",
    harvestWindowMr: "१० फेब्रुवारी - २८ फेब्रुवारी",
    yieldRange: "9 - 12 Quintals / Acre",
    projectedReturn: "₹48,000 - ₹62,000 / Acre",
    fertilizerDoseEn: "Basal: 35kg DAP + 15kg MOP + 15kg Elemental Sulphur. Top dress: 30kg Urea at 25-30 days.",
    fertilizerDoseGu: "પાયાનું ખાતર: ૩૫ કિગ્રા DAP + ૧૫ કિગ્રા MOP + ૧૫ કિગ્રા સલ્ફર. પૂર્તિ ખાતર: ૨૫-૩૦ દિવસે ૩૦ કિગ્રા યુરિયા.",
    fertilizerDoseHi: "आधार खाद: 35 किलो DAP + 15 किलो MOP + 15 किलो सल्फर। 25-30 दिन बाद 30 किलो यूरिया।",
    fertilizerDoseMr: "पायाभूत खत: ३५ किलो DAP + १५ किलो MOP + १५ किलो गंधक.",
    whyRecommendedGu: "ઓછા પાણીમાં અને સામાન્ય જમીનમાં પણ ૪૦% તેલ ટકાવારી સાથે ઉત્તમ નફો આપે છે. રાજસ્થાન અને ઉત્તર ગુજરાતની મંડીઓમાં સતત માગ રહે છે.",
    whyRecommendedHi: "कम पानी में तैयार होती है। तेल की मात्रा 40% से अधिक होने पर मंडी में बोनस भाव मिलता है।",
    whyRecommendedEn: "Drought-hardy crop with low water requirement. High 40% oil content commands direct miller premium.",
  },
  {
    id: "potato",
    name: "Potato (आलू / બટાકા)",
    cropType: "Potato",
    variety: "Kufri Pukhraj / Kufri Badshah / Lady Rosetta (Chips)",
    season: "Rabi",
    suitableSoils: ["Alluvial Loam", "Clay Loam"],
    minPh: 5.5,
    maxPh: 7.2,
    waterRequirement: "High (Tubewell / Drip recommended)",
    growthDays: "85-100 Days",
    plantingWindowEn: "October 20 - November 15",
    plantingWindowGu: "૨૦ ઓક્ટોબર - ૧૫ નવેમ્બર",
    plantingWindowHi: "20 अक्टूबर - 15 नवंबर",
    plantingWindowMr: "२० ऑक्टोबर - १५ नोव्हेंबर",
    harvestWindowEn: "January 20 - February 25",
    harvestWindowGu: "૨૦ જાન્યુઆરી - ૨૫ ફેબ્રુઆરી",
    harvestWindowHi: "20 जनवरी - 25 फरवरी",
    harvestWindowMr: "२० जानेवारी - २५ फेब्रुवारी",
    yieldRange: "120 - 160 Quintals / Acre",
    projectedReturn: "₹1,20,000 - ₹1,65,000 / Acre",
    fertilizerDoseEn: "Basal: 75kg DAP + 50kg MOP + 15kg Zinc. Top dress: 50kg Urea at earthing-up (30 days).",
    fertilizerDoseGu: "પાયાનું ખાતર: ૭૫ કિગ્રા DAP + ૫૦ કિગ્રા MOP. પૂર્તિ ખાતર: પાળા ચડાવતી વખતે ૫૦ કિગ્રા યુરિયા.",
    fertilizerDoseHi: "आधार खाद: 75 किलो DAP + 50 किलो MOP। मिट्टी चढ़ाते समय 50 किलो यूरिया।",
    fertilizerDoseMr: "पायाभूत खत: ७५ किलो DAP + ५० किलो MOP.",
    whyRecommendedGu: "ડીસા અને આણંદની ગોરાડુ જમીન બટાકા માટે આદર્શ છે. વેફર્સ કંપનીઓ (લેડી રોઝેટા) સીધા ખેતરેથી ખરીદી માટે એગ્રીમેન્ટ કરે છે.",
    whyRecommendedHi: "दोमट मिट्टी में कंद का आकार एकसमान बनता है। चिप्स कंपनियां सीधे खेत से अनुबंध पर खरीद करती हैं।",
    whyRecommendedEn: "Light alluvial soils promote uniform tuber expansion with minimal scab, ideal for direct contract buyback.",
  },
];

/**
 * AI Crop Suitability Recommendation Engine
 */
export function generateCropRecommendations({
  soilType = "Alluvial Loam",
  ph = 7.2,
  nitrogen = 240,
  phosphorus = 28,
  potassium = 310,
  season = "Kharif",
  rainfallPattern = "Normal",
}) {
  const numericPh = Number(ph) || 7.0;

  const scoredCrops = CROP_KNOWLEDGE_BASE.map((crop) => {
    let score = 70;

    // 1. Season match (Major weighting)
    if (crop.season.toLowerCase() === season.toLowerCase()) {
      score += 18;
    } else {
      score -= 20;
    }

    // 2. Soil type match
    if (crop.suitableSoils.some((s) => s.toLowerCase() === soilType.toLowerCase())) {
      score += 10;
    } else {
      score -= 8;
    }

    // 3. pH compatibility
    if (numericPh >= crop.minPh && numericPh <= crop.maxPh) {
      score += 8;
    } else {
      const phDiff = Math.min(Math.abs(numericPh - crop.minPh), Math.abs(numericPh - crop.maxPh));
      score -= Math.round(phDiff * 8);
    }

    // 4. Nutrient suitability bonus
    if (crop.id === "cotton" && potassium >= 300) score += 4;
    if (crop.id === "wheat" && nitrogen >= 220) score += 4;
    if (crop.id === "onion" && phosphorus >= 25) score += 4;

    // 5. Rainfall sensitivity adjustment
    if (rainfallPattern === "Deficit" && (crop.id === "mustard" || crop.id === "cotton")) {
      score += 5;
    }

    const clampedScore = Math.max(50, Math.min(98, score));

    return {
      ...crop,
      suitabilityScore: clampedScore,
    };
  });

  // Sort descending by suitability
  scoredCrops.sort((a, b) => b.suitabilityScore - a.suitabilityScore);

  return {
    success: true,
    soilParameters: { soilType, ph: numericPh, nitrogen, phosphorus, potassium, season, rainfallPattern },
    recommendedCrops: scoredCrops,
    topRecommendation: scoredCrops[0],
    generatedAt: new Date().toISOString(),
  };
}
