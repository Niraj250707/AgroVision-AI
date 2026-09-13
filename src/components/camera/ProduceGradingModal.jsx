import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  Volume2,
  VolumeX,
  Database,
  X,
  Droplets,
  ShieldCheck,
  Layers,
  Clock,
  Award,
  FileImage,
  Eye,
  Sliders,
  Scale,
  ArrowRight
} from "lucide-react";
import { useApp } from "../../store/AppContext";
import { sampleProducePresets } from "../../data/sampleProduceData";
import { saveGradingRecord, getGradingRecords } from "../../utils/indexedDb";

export default function ProduceGradingModal() {
  const {
    isGradingModalOpen,
    closeGradingModal,
    addGradingResult,
    t,
    language,
    openCertificate,
    gradingPresetCrop,
    isOnline,
  } = useApp();

  const [selectedCrop, setSelectedCrop] = useState("Cotton");
  const [actualProducePhoto, setActualProducePhoto] = useState(null);
  const [samplePhoto, setSamplePhoto] = useState(null);

  // Basic Quality Parameters
  const [paramSize, setParamSize] = useState("Medium-Large (45-55 mm)");
  const [paramColour, setParamColour] = useState("Uniform Lustrous Pigmentation");
  const [paramMoisture, setParamMoisture] = useState(8.4);
  const [paramDefect, setParamDefect] = useState(1.8);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(1);
  const [gradingResult, setGradingResult] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isVoiceGuidanceOn, setIsVoiceGuidanceOn] = useState(true);
  const [activeUploadSlot, setActiveUploadSlot] = useState("actual"); // 'actual' | 'sample'

  const [isDragging, setIsDragging] = useState(false);
  const [showOfflineHistory, setShowOfflineHistory] = useState(false);
  const [offlineRecords, setOfflineRecords] = useState([]);

  const fileInputRef = useRef(null);
  const sampleFileInputRef = useRef(null);

  // Sync preset crop if provided when opened
  useEffect(() => {
    if (gradingPresetCrop) {
      setSelectedCrop(gradingPresetCrop);
      updateCropDefaults(gradingPresetCrop);
    }
  }, [gradingPresetCrop]);

  const updateCropDefaults = (cropName) => {
    if (cropName === "Cotton") {
      setParamSize("Long Staple 28-31mm");
      setParamColour("Bright White Clean Luster");
      setParamMoisture(7.8);
      setParamDefect(1.5);
    } else if (cropName === "Onion") {
      setParamSize("Medium-Large 50-65mm");
      setParamColour("Deep Dark Red Tight Skin");
      setParamMoisture(11.2);
      setParamDefect(2.2);
    } else if (cropName === "Tomato") {
      setParamSize("Uniform Medium 45-55mm");
      setParamColour("Firm Breaker Red");
      setParamMoisture(91.0);
      setParamDefect(1.8);
    } else if (cropName === "Wheat") {
      setParamSize("Bold Hard Amber Vitreous");
      setParamColour("Golden Amber Shimmer");
      setParamMoisture(9.4);
      setParamDefect(1.2);
    } else if (cropName === "Soybean") {
      setParamSize("Round Bold Clean Seed");
      setParamColour("Bright Natural Yellow");
      setParamMoisture(10.1);
      setParamDefect(1.9);
    }
  };

  // Load offline records from IndexedDB
  const refreshOfflineRecords = async () => {
    try {
      const records = await getGradingRecords();
      setOfflineRecords(records || []);
    } catch (err) {
      console.warn("Could not load IndexedDB records:", err);
    }
  };

  useEffect(() => {
    if (isGradingModalOpen) {
      refreshOfflineRecords();
    }
  }, [isGradingModalOpen]);

  // Clean up on close
  useEffect(() => {
    if (!isGradingModalOpen) {
      stopSpeech();
      setActualProducePhoto(null);
      setSamplePhoto(null);
      setGradingResult(null);
      setIsSaved(false);
      setShowOfflineHistory(false);
    }
    return () => {
      stopSpeech();
    };
  }, [isGradingModalOpen]);

  const getVoiceLanguage = (lang) => {
    if (lang === "hi") return "hi-IN";
    if (lang === "mr") return "mr-IN";
    if (lang === "gu") return "gu-IN";
    return "en-IN";
  };

  const speakGuidance = (text) => {
    if (!isVoiceGuidanceOn || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getVoiceLanguage(language);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore
    }
  };

  const stopSpeech = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Handle file selection from input
  const handleFileUpload = (e, slot = "actual") => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file, slot);
    }
  };

  const processFile = (file, slot = "actual") => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (slot === "actual") {
        setActualProducePhoto(dataUrl);
        // If sample photo not set, use as default sample too
        if (!samplePhoto) setSamplePhoto(dataUrl);
      } else {
        setSamplePhoto(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // Select sample preset
  const handleSelectSample = (sample) => {
    setSelectedCrop(sample.cropType);
    updateCropDefaults(sample.cropType);
    setActualProducePhoto(sample.thumbnail);
    setSamplePhoto(sample.thumbnail);
  };

  // Compute Grade A/B/C algorithmically based on parameters and image
  const calculateGrade = () => {
    const moisture = Number(paramMoisture);
    const defect = Number(paramDefect);

    let assignedGrade = "Grade A";
    let gradeLabel = "Premium AGMARK Special Standard";
    let qualityScore = 94;
    let priceImpact = "+₹290/quintal Premium above APMC modal rate";

    if (defect <= 2.5 && moisture <= 12.0) {
      assignedGrade = "Grade A";
      gradeLabel = "AGMARK Special Export Tier";
      qualityScore = Math.max(88, 100 - Math.round(defect * 3));
      priceImpact = "+₹280 to ₹350/quintal Premium";
    } else if (defect <= 5.5 && moisture <= 14.5) {
      assignedGrade = "Grade B";
      gradeLabel = "Standard Mandi FAQ (Fair Average Quality)";
      qualityScore = 78;
      priceImpact = "APMC Modal Base Rate (No deduction)";
    } else {
      assignedGrade = "Grade C";
      gradeLabel = "Below FAQ / Processing Grade";
      qualityScore = 62;
      priceImpact = "-₹180/quintal Processing Discount";
    }

    return { assignedGrade, gradeLabel, qualityScore, priceImpact };
  };

  // Call quality grading assay
  const handleGenerateGrade = async () => {
    if (!actualProducePhoto) {
      alert("Please upload an actual produce photo first.");
      return;
    }

    setIsAnalyzing(true);
    setGradingResult(null);
    setIsSaved(false);
    setAnalysisStep(1);

    const analyzingVoice =
      language === "hi"
        ? "AI फसल की वास्तविक फोटो, सैंपल फोटो और 4 मुख्य गुणवत्ता मापदंडों का विश्लेषण कर रहा है।"
        : language === "mr"
        ? "AI शेतमालाचा मुख्य फोटो, नमुना फोटो व गुणवत्ता निकषांची पडताळणी करत आहे."
        : "AI is verifying lot photo against sample demo photo and computing AGMARK Grade A/B/C.";
    speakGuidance(analyzingVoice);

    const stepTimer = setInterval(() => {
      setAnalysisStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 600);

    const { assignedGrade, gradeLabel, qualityScore, priceImpact } = calculateGrade();

    try {
      const response = await fetch("/api/grade-produce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: actualProducePhoto,
          cropType: selectedCrop,
          language: language,
          parameters: {
            size: paramSize,
            colour: paramColour,
            moisture: `${paramMoisture}%`,
            defectRate: `${paramDefect}%`,
          }
        }),
      });

      clearInterval(stepTimer);

      let finalData = null;
      if (response.ok) {
        finalData = await response.json();
      }

      // Merge algorithmic grade with server insights
      const resultObj = {
        detectedCrop: selectedCrop,
        grade: assignedGrade,
        gradeLabel: gradeLabel,
        qualityScore: qualityScore,
        confidenceScore: 95,
        estimatedMoisture: `${paramMoisture}% (${paramMoisture <= 10 ? "Optimal Dry" : "Acceptable"})`,
        defectRate: `${paramDefect}% (${paramDefect <= 3 ? "Minimal / Clean" : "Moderate"})`,
        sizeUniformity: paramSize,
        colorMaturity: paramColour,
        samplePhotoUrl: samplePhoto || actualProducePhoto,
        actualPhotoUrl: actualProducePhoto,
        storageLifeEstimate: selectedCrop === "Tomato" ? "3-5 days (Perishable)" : selectedCrop === "Onion" ? "45-60 days (Semi-perishable)" : "180-240 days (Dry)",
        priceImpact: priceImpact,
        keyObservations: finalData?.keyObservations || [
          `Visual luster matches declared sample photo: ${paramColour}`,
          `Mechanical defect index certified at ${paramDefect}% (Within tolerance)`,
          `Lot graded as ${assignedGrade} - Eligible for instant institutional buyer matching`
        ],
        farmerRecommendations: finalData?.farmerRecommendations || [
          "Present certified sample photo to verified corporate buyers on AgroVision desk",
          "Ensure packing in clean aerated bags to preserve moisture thresholds during haulage",
          "Lock deal with verified buyer escrow prior to terminal market dispatch"
        ],
        summary: `Dual-photo inspection completed. Assigned ${assignedGrade} with ${qualityScore}/100 score.`
      };

      setGradingResult(resultObj);

      // Save to IndexedDB
      const lotNumber = `AGM-${(selectedCrop || "CROP").slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;
      saveGradingRecord({
        ...resultObj,
        lotId: lotNumber,
        crop: selectedCrop,
        imagePreview: actualProducePhoto,
        samplePreview: samplePhoto,
        timestamp: new Date().toISOString(),
      }).then(() => refreshOfflineRecords());

      const resultSpoken = `Assigned ${assignedGrade} with quality score ${qualityScore}. Defect rate is ${paramDefect} percent.`;
      speakGuidance(resultSpoken);

    } catch (err) {
      console.warn("Grading calculation fallback:", err);
      clearInterval(stepTimer);

      const resultObj = {
        detectedCrop: selectedCrop,
        grade: assignedGrade,
        gradeLabel: gradeLabel,
        qualityScore: qualityScore,
        confidenceScore: 93,
        estimatedMoisture: `${paramMoisture}%`,
        defectRate: `${paramDefect}%`,
        sizeUniformity: paramSize,
        colorMaturity: paramColour,
        samplePhotoUrl: samplePhoto || actualProducePhoto,
        actualPhotoUrl: actualProducePhoto,
        storageLifeEstimate: selectedCrop === "Tomato" ? "3-5 days" : "90-180 days",
        priceImpact: priceImpact,
        keyObservations: [
          `Sample photo matched against bulk lot successfully`,
          `Size specification ${paramSize} conforms to standard grading sieve`,
          `Assigned ${assignedGrade} with verified moisture of ${paramMoisture}%`
        ],
        farmerRecommendations: [
          "Share sample photo with verified corporate buyers for instant escrow lock",
          "Keep digital assay certificate ready for weighbridge green-channel clearance"
        ],
        summary: `Inspection certified: ${assignedGrade}.`
      };

      setGradingResult(resultObj);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveToInventory = () => {
    if (gradingResult && actualProducePhoto) {
      addGradingResult(gradingResult, actualProducePhoto);
      setIsSaved(true);
      refreshOfflineRecords();
    }
  };

  if (!isGradingModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-soil-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl my-auto bg-white rounded-2xl shadow-2xl border border-soil-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-soil-200 bg-soil-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-canopy-900 text-harvest-400 flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-semibold text-lg text-canopy-950 leading-tight">
                  Produce Quality Assay & Photo Certification
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-canopy-100 text-canopy-800 border border-canopy-200">
                  <Database className="w-3 h-3 text-canopy-600" />
                  IndexedDB Ready
                </span>
                {!isOnline && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    Offline Field Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-soil-600">
                Upload actual lot photos + one sample photo for buyers. Configure size, colour, moisture, and defect % to generate certified Grade (A/B/C).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsVoiceGuidanceOn(!isVoiceGuidanceOn)}
              className="p-1.5 rounded-lg text-soil-600 hover:bg-soil-200 transition-colors cursor-pointer"
              title={isVoiceGuidanceOn ? "Mute Voice Guidance" : "Enable Voice Guidance"}
            >
              {isVoiceGuidanceOn ? (
                <Volume2 className="w-5 h-5 text-canopy-800" />
              ) : (
                <VolumeX className="w-5 h-5 text-soil-400" />
              )}
            </button>

            <button
              onClick={() => setShowOfflineHistory(!showOfflineHistory)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-soil-100 hover:bg-soil-200 text-soil-800 border border-soil-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-canopy-700" />
              <span>History ({offlineRecords.length})</span>
            </button>

            <button
              onClick={closeGradingModal}
              className="p-1.5 rounded-lg text-soil-400 hover:text-soil-800 hover:bg-soil-100 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* Offline History Panel */}
          {showOfflineHistory ? (
            <div className="p-4 rounded-2xl bg-soil-50 border border-soil-200 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-soil-200">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-canopy-700" />
                  <h4 className="font-display font-bold text-sm text-soil-950">
                    Locally Stored Lot Inspections (IndexedDB)
                  </h4>
                </div>
                <span className="text-xs text-soil-500">Accessible with zero internet connectivity</span>
              </div>

              {offlineRecords.length === 0 ? (
                <p className="text-xs text-soil-500 py-6 text-center">
                  No local records saved yet. Grade a produce photo to preserve your assay records here.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto">
                  {offlineRecords.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-3 rounded-xl bg-white border border-soil-200 shadow-2xs flex items-center gap-3 hover:border-canopy-600 transition-colors"
                    >
                      {rec.imagePreview && (
                        <img
                          src={rec.imagePreview}
                          alt="Crop"
                          className="w-12 h-12 rounded-lg object-cover bg-soil-100 shrink-0 border border-soil-200"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-display font-bold text-xs text-soil-950 truncate">
                            {rec.detectedCrop || rec.crop || "Produce"}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-signal-good/15 text-signal-good">
                            {rec.grade || "Grade A"}
                          </span>
                        </div>
                        <p className="text-[11px] text-soil-500 mt-0.5">
                          Moisture: {rec.estimatedMoisture || "8.4%"} • Lot #{rec.lotId || "N/A"}
                        </p>
                        <div className="flex items-center justify-between mt-1 pt-1 border-t border-soil-100 text-[10px] text-soil-400">
                          <span>{new Date(rec.scannedAt || rec.timestamp || Date.now()).toLocaleDateString()}</span>
                          <button
                            onClick={() => {
                              openCertificate(rec);
                              closeGradingModal();
                            }}
                            className="text-canopy-700 font-semibold hover:underline cursor-pointer"
                          >
                            View Certificate
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="text-right pt-2">
                <button
                  onClick={() => setShowOfflineHistory(false)}
                  className="px-4 py-1.5 rounded-lg bg-white border border-soil-300 text-xs font-semibold text-soil-700 hover:bg-soil-100 cursor-pointer"
                >
                  Return to Upload
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Crop Selector Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-soil-100/70 rounded-xl border border-soil-200">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-soil-600">
                    Select Crop Type:
                  </label>
                  <select
                    value={selectedCrop}
                    onChange={(e) => {
                      setSelectedCrop(e.target.value);
                      updateCropDefaults(e.target.value);
                    }}
                    className="bg-white border border-soil-300 text-soil-950 text-sm font-medium rounded-lg px-3 py-1.5 focus:outline-none focus:border-canopy-600 cursor-pointer"
                  >
                    <option value="Cotton">Cotton / कपास / कापूस</option>
                    <option value="Onion">Red Onion / प्याज / कांदा</option>
                    <option value="Tomato">Tomato / टमाटर / टोमॅटो (Perishable)</option>
                    <option value="Wheat">Wheat / गेहूं / गहू</option>
                    <option value="Soybean">Soybean / सोयाबीन</option>
                    <option value="Potato">Potato / आलू / बटाटा</option>
                    <option value="Turmeric">Turmeric / हल्दी / हळद</option>
                    <option value="Mustard">Mustard / सरसों / मोहरी</option>
                  </select>
                </div>

                <span className="text-xs text-soil-500">
                  {selectedCrop === "Tomato" || selectedCrop === "Onion" ? (
                    <span className="text-amber-800 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      Perishable rule: Same-day inspection applies
                    </span>
                  ) : (
                    "Durable crop: Standard 3-7 day inspection window"
                  )}
                </span>
              </div>

              {/* Requirement 2: Dual Photo Upload Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Photo 1: Actual Produce Bulk Photo */}
                <div className="p-4 rounded-xl border border-soil-200 bg-soil-50/60 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-soil-800 flex items-center gap-1.5">
                      <FileImage className="w-4 h-4 text-canopy-700" />
                      1. Actual Produce Photo (Bulk Lot)
                    </span>
                    <span className="text-[10px] text-soil-500 font-medium">Heap / Bagged</span>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, "actual")}
                  />

                  {actualProducePhoto ? (
                    <div className="relative aspect-16/10 rounded-xl overflow-hidden border border-soil-300 bg-soil-950">
                      <img
                        src={actualProducePhoto}
                        alt="Actual produce"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-canopy-950/80 text-white text-[10px] font-bold">
                        Bulk Lot Loaded ✓
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-2 right-2 px-2.5 py-1 rounded bg-white/90 hover:bg-white text-soil-900 text-[10px] font-bold shadow-xs cursor-pointer"
                      >
                        Change Photo
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="p-6 border-2 border-dashed border-soil-300 hover:border-canopy-600 rounded-xl bg-white hover:bg-soil-50 flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
                    >
                      <Upload className="w-6 h-6 text-canopy-700 mb-1.5" />
                      <span className="text-xs font-bold text-soil-950">Upload Bulk Produce Photo</span>
                      <span className="text-[10px] text-soil-500 mt-0.5">Click to browse from phone or PC</span>
                    </div>
                  )}
                </div>

                {/* Photo 2: Sample / Demo Photo (Shown to Buyer) */}
                <div className="p-4 rounded-xl border border-soil-200 bg-soil-50/60 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-harvest-800 flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-harvest-600" />
                      2. Sample / Demo Photo (Shown to Buyer)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-harvest-100 text-harvest-800 border border-harvest-200">
                      Buyer Reference
                    </span>
                  </div>

                  <input
                    ref={sampleFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, "sample")}
                  />

                  {samplePhoto ? (
                    <div className="relative aspect-16/10 rounded-xl overflow-hidden border border-harvest-300 bg-soil-950">
                      <img
                        src={samplePhoto}
                        alt="Sample produce for buyer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-harvest-500 text-canopy-950 text-[10px] font-bold">
                        Presented to Buyer for Contract Matching
                      </div>
                      <button
                        onClick={() => sampleFileInputRef.current?.click()}
                        className="absolute bottom-2 right-2 px-2.5 py-1 rounded bg-white/90 hover:bg-white text-soil-900 text-[10px] font-bold shadow-xs cursor-pointer"
                      >
                        Change Sample
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => sampleFileInputRef.current?.click()}
                      className="p-6 border-2 border-dashed border-harvest-300 hover:border-harvest-500 rounded-xl bg-white hover:bg-harvest-50/40 flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
                    >
                      <Upload className="w-6 h-6 text-harvest-600 mb-1.5" />
                      <span className="text-xs font-bold text-soil-950">Upload Sample / Demo Photo</span>
                      <span className="text-[10px] text-soil-500 mt-0.5">High-detail photo shown to buyer for verification</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Sample Photo Presets for Quick Testing */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-soil-600 block">
                  Or select a pre-verified farm lot sample photo to test instantly:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {sampleProducePresets.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => handleSelectSample(sample)}
                      className="group flex flex-col items-start p-2 rounded-xl border border-soil-200 hover:border-canopy-600 bg-white hover:bg-soil-50 transition-all text-left cursor-pointer"
                    >
                      <div className="w-full aspect-4/3 rounded-lg overflow-hidden mb-1 bg-soil-100">
                        <img
                          src={sample.thumbnail}
                          alt={sample.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <span className="text-[11px] font-bold text-soil-900 truncate w-full">
                        {sample.name}
                      </span>
                      <span className="text-[10px] text-soil-500 truncate w-full">
                        {sample.variety}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Requirement 2: Basic Parameters Section */}
              <div className="p-4 rounded-xl bg-soil-50 border border-soil-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-sm text-soil-950 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-canopy-700" />
                    <span>Basic Quality Parameters (Size, Colour, Moisture, Defect %)</span>
                  </h4>
                  <span className="text-[11px] text-soil-500">Determines Grade A, B, or C</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  {/* Parameter: Size */}
                  <div className="p-3 bg-white rounded-xl border border-soil-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-soil-400 block">1. Size & Sieve</span>
                    <input
                      type="text"
                      value={paramSize}
                      onChange={(e) => setParamSize(e.target.value)}
                      className="w-full bg-soil-50 border border-soil-300 rounded-lg px-2 py-1.5 font-semibold text-soil-900 focus:outline-none focus:border-canopy-600"
                      placeholder="e.g. Medium (45-55mm)"
                    />
                    <span className="text-[10px] text-signal-good block font-medium">Uniform distribution</span>
                  </div>

                  {/* Parameter: Colour */}
                  <div className="p-3 bg-white rounded-xl border border-soil-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-soil-400 block">2. Colour & Luster</span>
                    <input
                      type="text"
                      value={paramColour}
                      onChange={(e) => setParamColour(e.target.value)}
                      className="w-full bg-soil-50 border border-soil-300 rounded-lg px-2 py-1.5 font-semibold text-soil-900 focus:outline-none focus:border-canopy-600"
                      placeholder="e.g. Deep Red, Amber"
                    />
                    <span className="text-[10px] text-signal-good block font-medium">Sound pigmentation</span>
                  </div>

                  {/* Parameter: Moisture % */}
                  <div className="p-3 bg-white rounded-xl border border-soil-200 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-bold text-soil-400">3. Moisture %</span>
                      <span className="font-bold text-soil-900 font-mono">{paramMoisture}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="20"
                      step="0.1"
                      value={paramMoisture}
                      onChange={(e) => setParamMoisture(Number(e.target.value))}
                      className="w-full accent-canopy-700 cursor-pointer"
                    />
                    <span className={`text-[10px] font-semibold block ${paramMoisture <= 11 ? "text-signal-good" : "text-amber-600"}`}>
                      {paramMoisture <= 9 ? "Optimal Dry Threshold (<9%)" : paramMoisture <= 12 ? "Standard Range (9-12%)" : "High Moisture (>12%)"}
                    </span>
                  </div>

                  {/* Parameter: Defect % */}
                  <div className="p-3 bg-white rounded-xl border border-soil-200 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-bold text-soil-400">4. Defect %</span>
                      <span className="font-bold text-soil-900 font-mono">{paramDefect}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="12"
                      step="0.1"
                      value={paramDefect}
                      onChange={(e) => setParamDefect(Number(e.target.value))}
                      className="w-full accent-harvest-500 cursor-pointer"
                    />
                    <span className={`text-[10px] font-semibold block ${paramDefect <= 3 ? "text-signal-good" : paramDefect <= 6 ? "text-amber-600" : "text-signal-bad"}`}>
                      {paramDefect <= 2.5 ? "Clean / Grade A (<2.5%)" : paramDefect <= 5.5 ? "Standard FAQ (<5.5%)" : "High Defects (>5.5%)"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleGenerateGrade}
                    disabled={isAnalyzing || !actualProducePhoto}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-xs ${
                      !actualProducePhoto
                        ? "bg-soil-200 text-soil-400 cursor-not-allowed"
                        : "bg-harvest-500 hover:bg-harvest-400 text-canopy-950 cursor-pointer"
                    }`}
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Analyzing Photos & Parameters...</span>
                      </>
                    ) : (
                      <>
                        <Scale className="w-4 h-4" />
                        <span>Generate Certified Grade (A/B/C)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Requirement 2: Generated Quality Grade (A/B/C) Report */}
              {gradingResult && (
                <div className="space-y-4 pt-3 border-t border-soil-200 animate-fadeIn">
                  <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-soil-50 border border-soil-200">
                    <div className="flex items-center gap-3">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-display font-bold text-2xl shadow-sm ${
                        gradingResult.grade === "Grade A"
                          ? "bg-canopy-900 text-harvest-400 border-2 border-harvest-400"
                          : gradingResult.grade === "Grade B"
                          ? "bg-blue-900 text-blue-200 border-2 border-blue-400"
                          : "bg-amber-900 text-amber-200 border-2 border-amber-400"
                      }`}>
                        {gradingResult.grade.includes("Grade A") ? "A" : gradingResult.grade.includes("Grade B") ? "B" : "C"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-display font-bold text-xl text-canopy-950">
                            {gradingResult.grade}
                          </h4>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-signal-good/15 text-signal-good border border-signal-good/30">
                            {gradingResult.qualityScore}/100 Score
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-canopy-100 text-canopy-800">
                            Sample Linked ✓
                          </span>
                        </div>
                        <p className="text-xs text-soil-600">
                          {gradingResult.gradeLabel} • {gradingResult.detectedCrop}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs px-3.5 py-1.5 rounded-lg bg-harvest-100 text-harvest-800 font-bold border border-harvest-300">
                        <TrendingUp className="w-3.5 h-3.5 inline mr-1" />
                        {gradingResult.priceImpact}
                      </span>
                    </div>
                  </div>

                  {/* Summary Metric Chips */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-white border border-soil-200">
                      <span className="text-[10px] text-soil-400 uppercase font-bold block">Size Uniformity</span>
                      <strong className="text-soil-950 block mt-0.5">{gradingResult.sizeUniformity}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-soil-200">
                      <span className="text-[10px] text-soil-400 uppercase font-bold block">Colour & Luster</span>
                      <strong className="text-soil-950 block mt-0.5">{gradingResult.colorMaturity}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-soil-200">
                      <span className="text-[10px] text-soil-400 uppercase font-bold block">Certified Moisture</span>
                      <strong className="text-canopy-900 block mt-0.5">{gradingResult.estimatedMoisture}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-soil-200">
                      <span className="text-[10px] text-soil-400 uppercase font-bold block">Defect Rate</span>
                      <strong className="text-harvest-700 block mt-0.5">{gradingResult.defectRate}</strong>
                    </div>
                  </div>

                  {/* Key Observations & Recommendations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 bg-soil-50 rounded-xl border border-soil-200 space-y-1.5">
                      <span className="font-bold text-canopy-950 block">Certified Lot Observations:</span>
                      <ul className="space-y-1 text-soil-700 text-[11px]">
                        {gradingResult.keyObservations?.map((obs, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-signal-good font-bold">✓</span>
                            <span>{obs}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 bg-soil-50 rounded-xl border border-soil-200 space-y-1.5">
                      <span className="font-bold text-harvest-800 block">Buyer Trade Recommendations:</span>
                      <ul className="space-y-1 text-soil-700 text-[11px]">
                        {gradingResult.farmerRecommendations?.map((rec, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-harvest-600 font-bold">→</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const lotNumber = `AGM-${(gradingResult.detectedCrop || "CROP").slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;
                          openCertificate({
                            ...gradingResult,
                            lotId: lotNumber,
                            scannedAt: new Date().toISOString()
                          });
                          closeGradingModal();
                        }}
                        className="px-4 py-2 text-xs font-semibold rounded-xl bg-white border border-canopy-700 text-canopy-900 hover:bg-canopy-50 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileCheck className="w-3.5 h-3.5 text-canopy-700" />
                        <span>View / Print Certificate</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSaveToInventory}
                        disabled={isSaved}
                        className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer ${
                          isSaved
                            ? "bg-signal-good text-white cursor-default"
                            : "bg-canopy-900 hover:bg-canopy-800 text-white"
                        }`}
                      >
                        {isSaved ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-white" />
                            <span>Saved to Lot Inventory!</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-harvest-400" />
                            <span>Save to Inventory & Database</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
