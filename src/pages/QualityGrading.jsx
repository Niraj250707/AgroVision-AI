import React, { useState } from "react";
import {
  Camera,
  Sparkles,
  ArrowRight,
  BookOpen,
  Calculator
} from "lucide-react";
import { useApp } from "../store/AppContext";
import { sampleProducePresets } from "../data/sampleProduceData";

export default function QualityGrading() {
  const { t, openGradingModal, gradingHistory, language, openCertificate } = useApp();

  // Interactive Profit Simulator state
  const [calcCrop, setCalcCrop] = useState("Cotton");
  const [calcQty, setCalcQty] = useState(60);
  const [calcBasePrice, setCalcBasePrice] = useState(7200);

  const gradeAPremium = Math.round(calcBasePrice * 0.09); // +9%
  const totalGradeA = (calcBasePrice + gradeAPremium) * calcQty;
  const totalGradeB = calcBasePrice * calcQty;
  const extraGainFromGrading = totalGradeA - totalGradeB;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-soil-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-canopy-100 text-canopy-900 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-canopy-700" />
            AGMARK & e-NAM Computer Vision Engine
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-canopy-950 tracking-tight">
            {t("qualityGradingTitle")}
          </h1>
          <p className="text-xs sm:text-sm text-soil-600 mt-1 max-w-3xl">
            {t("qualityGradingSubtitle")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openGradingModal()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-harvest-500 hover:bg-harvest-400 text-canopy-950 font-bold text-xs shadow-sm transition-all active:scale-95"
          >
            <Camera className="w-4 h-4" />
            <span>{t("openCamera")}</span>
          </button>
        </div>
      </div>

      {/* Main Inspection Banner & Presets */}
      <div className="p-6 rounded-2xl bg-white border border-soil-200 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-display font-bold text-lg text-soil-950">
              {language === "hi"
                ? "तुरंत फसल की तस्वीर लें या नमूना चुनें"
                : language === "mr"
                ? "शेतमालाचा फोटो काढा किंवा नमुना निवडा"
                : "Live Camera Inspection & Batch Analysis"}
            </h2>
            <p className="text-xs text-soil-600">
              {language === "hi"
                ? "अपने स्मार्टफोन या वेबकैम से फसल की स्पष्ट फोटो खींचें। AI मॉडल तुरंत रंग, आकार, नमी और दोषों का विश्लेषण करता है।"
                : language === "mr"
                ? "स्मार्टफोन किंवा वेबकॅमने शेतमालाचा स्पष्ट फोटो काढा. AI रंग, आकार, ओलावा व डागांचे तात्काळ विश्लेषण करते."
                : "Point camera at produce under natural light. The multimodal Gemini model grades the lot according to APMC parameters."}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => openGradingModal()}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-canopy-900 hover:bg-canopy-800 text-white flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Camera className="w-3.5 h-3.5 text-harvest-400" />
              <span>{t("openCamera")}</span>
            </button>
          </div>
        </div>

        {/* Preset Farm Produce Cards */}
        <div>
          <span className="text-xs font-semibold text-soil-600 block mb-2">
            {t("samplePhotos")}
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {sampleProducePresets.map((sample) => (
              <div
                key={sample.id}
                onClick={() => openGradingModal(sample.cropType)}
                className="cursor-pointer group p-3 rounded-xl bg-soil-50 hover:bg-soil-100/80 border border-soil-200 hover:border-canopy-600 transition-all flex flex-col"
              >
                <div className="w-full aspect-4/3 rounded-lg overflow-hidden bg-soil-200 mb-2">
                  <img
                    src={sample.thumbnail}
                    alt={sample.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-xs font-bold text-soil-950 truncate">
                  {sample.name}
                </span>
                <span className="text-[11px] text-canopy-700 font-medium">
                  {sample.variety}
                </span>
                <span className="text-[10px] text-soil-500 mt-1 line-clamp-2">
                  {sample.description}
                </span>
                <div className="mt-2 pt-2 border-t border-soil-200/80 flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-signal-good">
                    {sample.expectedGrade}
                  </span>
                  <span className="text-harvest-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    Grade <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Quality Profit Realization Simulator */}
      <div className="p-6 rounded-2xl bg-canopy-950 text-white border border-canopy-800 shadow-md space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-canopy-800 text-harvest-400 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                {language === "hi"
                  ? "गुणवत्ता ग्रेडिंग मुनाफा कैलकुलेटर"
                  : language === "mr"
                  ? "प्रतवारी नफा कॅल्क्युलेटर"
                  : "Quality Grade Profit Realization Calculator"}
              </h3>
              <p className="text-xs text-soil-300">
                {language === "hi"
                  ? "देखें कि ग्रेड ए प्रमाणीकरण से आपको कितने रुपये का शुद्ध अतिरिक्त मुनाफा होता है"
                  : language === "mr"
                  ? "ग्रेड ए प्रमाणपत्राने मिळणारा निव्वळ अतिरिक्त नफा तपासा"
                  : "Simulate how verified Grade A sorting increases net revenue over unsorted mandi lots."}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Controls */}
          <div className="space-y-4 bg-canopy-900/60 p-4 rounded-xl border border-canopy-700/50">
            <div>
              <label className="text-xs font-semibold text-soil-300 block mb-1">
                {t("selectCropType")}
              </label>
              <select
                value={calcCrop}
                onChange={(e) => {
                  setCalcCrop(e.target.value);
                  if (e.target.value === "Cotton") setCalcBasePrice(7200);
                  if (e.target.value === "Onion") setCalcBasePrice(2400);
                  if (e.target.value === "Wheat") setCalcBasePrice(2850);
                  if (e.target.value === "Soybean") setCalcBasePrice(4600);
                }}
                className="w-full bg-canopy-950 border border-canopy-700 text-white rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-harvest-400"
              >
                <option value="Cotton">Cotton (कपास / कापूस)</option>
                <option value="Onion">Red Onion (प्याज / कांदा)</option>
                <option value="Wheat">Wheat (गेहूं / गहू)</option>
                <option value="Soybean">Soybean (सोयाबीन)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs text-soil-300 mb-1">
                <span>Lot Quantity (Quintals)</span>
                <span className="font-bold text-harvest-400">{calcQty} Qtls</span>
              </div>
              <input
                type="range"
                min="10"
                max="250"
                step="5"
                value={calcQty}
                onChange={(e) => setCalcQty(Number(e.target.value))}
                className="w-full accent-harvest-400 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-soil-300 block mb-1">
                Local Base Mandi Rate (₹/Quintal)
              </label>
              <input
                type="number"
                value={calcBasePrice}
                onChange={(e) => setCalcBasePrice(Number(e.target.value))}
                className="w-full bg-canopy-950 border border-canopy-700 text-white rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-harvest-400"
              />
            </div>
          </div>

          {/* Realization Comparison Cards (2 columns) */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Grade B (Unsorted FAQ) */}
            <div className="p-4 rounded-xl bg-canopy-900/40 border border-canopy-800 space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-soil-800 text-soil-300 uppercase">
                  Grade B (Unsorted Mandi FAQ)
                </span>
                <div className="mt-2 font-display font-bold text-2xl text-soil-200">
                  ₹{totalGradeB.toLocaleString("en-IN")}
                </div>
                <div className="text-xs text-soil-400">
                  At base ₹{calcBasePrice}/quintal
                </div>
              </div>
              <p className="text-[11px] text-soil-400 leading-snug">
                Standard commission agent bidding with mixed sizes and moisture uncertainty.
              </p>
            </div>

            {/* Grade A (AI Inspected & Certified) */}
            <div className="p-4 rounded-xl bg-canopy-900/90 border-2 border-harvest-400/60 space-y-2 flex flex-col justify-between relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 bg-harvest-500 text-canopy-950 text-[10px] font-bold px-2.5 py-0.5 rounded-bl-lg">
                +9% PREMIUM
              </div>
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-harvest-400/20 text-harvest-300 uppercase">
                  Grade A (AI Graded & Cleaned)
                </span>
                <div className="mt-2 font-display font-bold text-2xl text-harvest-400">
                  ₹{totalGradeA.toLocaleString("en-IN")}
                </div>
                <div className="text-xs text-harvest-200 font-semibold">
                  At ₹{(calcBasePrice + gradeAPremium).toLocaleString("en-IN")}/quintal
                </div>
              </div>
              <div className="pt-2 border-t border-canopy-700/80">
                <span className="text-xs text-soil-300 block">Total Extra Net Profit:</span>
                <span className="font-display font-bold text-base text-signal-good">
                  +₹{extraGainFromGrading.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AGMARK Quality Standards Guide Reference Table */}
      <div className="p-6 rounded-2xl bg-white border border-soil-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-canopy-700" />
          <h3 className="font-display font-bold text-lg text-canopy-950">
            AGMARK & e-NAM Standard Grading Thresholds
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-soil-200 bg-soil-50 text-soil-700 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">Crop</th>
                <th className="py-2.5 px-3">Grade A (Special)</th>
                <th className="py-2.5 px-3">Grade B (Standard FAQ)</th>
                <th className="py-2.5 px-3">Moisture Limit</th>
                <th className="py-2.5 px-3">Max Defect Rate</th>
                <th className="py-2.5 px-3">Primary Buyer Market</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soil-100 text-soil-800">
              <tr className="hover:bg-soil-50/50">
                <td className="py-2.5 px-3 font-bold text-soil-950">Cotton</td>
                <td className="py-2.5 px-3 text-signal-good font-semibold">Shankar-6 Clean Lint (&gt;28mm)</td>
                <td className="py-2.5 px-3">Medium Staple (24-27mm)</td>
                <td className="py-2.5 px-3">&lt; 8.0%</td>
                <td className="py-2.5 px-3">&lt; 2.5% Trash</td>
                <td className="py-2.5 px-3">Spinning Mills & Exporters</td>
              </tr>
              <tr className="hover:bg-soil-50/50">
                <td className="py-2.5 px-3 font-bold text-soil-950">Red Onion</td>
                <td className="py-2.5 px-3 text-signal-good font-semibold">Tight papery skin (&gt;55mm)</td>
                <td className="py-2.5 px-3">Medium Bulb (40-55mm)</td>
                <td className="py-2.5 px-3">Cured (&lt;12%)</td>
                <td className="py-2.5 px-3">&lt; 3.0% Rot</td>
                <td className="py-2.5 px-3">Gulf Exporters & Modern Retail</td>
              </tr>
              <tr className="hover:bg-soil-50/50">
                <td className="py-2.5 px-3 font-bold text-soil-950">Wheat</td>
                <td className="py-2.5 px-3 text-signal-good font-semibold">Amber hard vitreous grain</td>
                <td className="py-2.5 px-3">Semi-hard mill quality</td>
                <td className="py-2.5 px-3">&lt; 10.5%</td>
                <td className="py-2.5 px-3">&lt; 1.5% Foreign</td>
                <td className="py-2.5 px-3">Roller Flour Mills & CWC</td>
              </tr>
              <tr className="hover:bg-soil-50/50">
                <td className="py-2.5 px-3 font-bold text-soil-950">Soybean</td>
                <td className="py-2.5 px-3 text-signal-good font-semibold">Clean yellow bold seed</td>
                <td className="py-2.5 px-3">Standard commercial</td>
                <td className="py-2.5 px-3">&lt; 11.0%</td>
                <td className="py-2.5 px-3">&lt; 2.0% Dirt</td>
                <td className="py-2.5 px-3">Solvent Extraction Plants</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Graded Lots History */}
      {gradingHistory.length > 0 && (
        <div className="p-6 rounded-2xl bg-white border border-soil-200 shadow-xs space-y-4">
          <h3 className="font-display font-bold text-lg text-canopy-950">
            Recent Scanned Lots & Grade Inspections
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gradingHistory.map((scan) => (
              <div
                key={scan.id}
                className="p-4 rounded-xl bg-soil-50/60 border border-soil-200 flex gap-4 items-start"
              >
                {scan.imagePreview && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-soil-200">
                    <img
                      src={scan.imagePreview}
                      alt={scan.detectedCrop}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-sm text-soil-950">
                      {scan.detectedCrop}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-signal-good/15 text-signal-good">
                      {scan.grade} ({scan.qualityScore}/100)
                    </span>
                  </div>
                  <p className="text-xs text-soil-600">{scan.gradeLabel}</p>
                  <div className="flex flex-wrap gap-2 text-[10px] text-soil-500 pt-1">
                    <span>Moisture: <strong>{scan.estimatedMoisture}</strong></span>
                    <span>Defects: <strong>{scan.defectRate}</strong></span>
                    <span className="text-harvest-600 font-bold">{scan.priceImpact}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-soil-200/60">
                    <span className="text-[10px] text-soil-500 font-mono">
                      Lot #{scan.lotId || "AGM-LOT"}
                    </span>
                    <button
                      onClick={() => openCertificate(scan)}
                      className="text-xs text-canopy-800 font-bold hover:text-canopy-950 hover:underline inline-flex items-center gap-1"
                    >
                      <span>Digital Certificate</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
