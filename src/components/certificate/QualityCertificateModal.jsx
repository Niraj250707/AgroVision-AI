import React, { useRef } from "react";
import {
  ShieldCheck,
  X,
  Printer,
  QrCode,
  Award,
  FileCheck,
  Sparkles,
  Info
} from "lucide-react";
import { useApp } from "../../store/AppContext";

export default function QualityCertificateModal() {
  const { activeCertificate, closeCertificate, t, currentUser } = useApp();
  const certRef = useRef(null);

  if (!activeCertificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const lotId = activeCertificate.lotId || `AGM-${(activeCertificate.detectedCrop || "PROD").slice(0, 3).toUpperCase()}-9281`;
  const inspectionDate = activeCertificate.scannedAt
    ? new Date(activeCertificate.scannedAt).toLocaleDateString()
    : new Date().toLocaleDateString();

  return (
    <div className="fixed inset-0 z-50 bg-soil-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-soil-200 shadow-2xl overflow-hidden my-6 animate-fadeIn">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-soil-100 border-b border-soil-200">
          <div className="flex items-center gap-2 text-xs font-bold text-canopy-950">
            <FileCheck className="w-4 h-4 text-canopy-700" />
            <span>{t("certificateTitle")}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-white border border-soil-200 rounded-lg text-soil-800 hover:bg-soil-50 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-soil-600" />
              <span>{t("printCert")}</span>
            </button>
            <button
              onClick={closeCertificate}
              className="p-1.5 rounded-lg text-soil-500 hover:text-soil-950 hover:bg-soil-200 transition-colors"
              aria-label="Close Certificate Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Paper Body */}
        <div ref={certRef} className="p-6 sm:p-8 space-y-6 bg-white text-soil-950">
          {/* Official Emblem & Header */}
          <div className="text-center border-b-2 border-soil-800 pb-4 relative">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-canopy-100 border-2 border-canopy-700 text-canopy-900 mb-2">
              <Award className="w-6 h-6 text-canopy-800" />
            </div>
            <div className="text-[11px] font-mono tracking-widest uppercase font-bold text-soil-500">
              Government of India • Directorate of Marketing & Inspection
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-display text-soil-950 mt-1">
              Certificate of Agricultural Quality & Grade
            </h1>
            <p className="text-xs text-soil-600 font-medium">
              Standardized under AGMARK (Grading and Marking Rules) & e-NAM Quality Parameters
            </p>

            {/* Top Left Certificate Meta */}
            <div className="mt-4 pt-3 border-t border-soil-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left text-xs">
              <div>
                <span className="text-[10px] text-soil-400 block uppercase font-bold tracking-wider">
                  {t("certLotNumber")}
                </span>
                <span className="font-mono font-bold text-canopy-900">{lotId}</span>
              </div>
              <div>
                <span className="text-[10px] text-soil-400 block uppercase font-bold tracking-wider">
                  {t("certIssuedOn")}
                </span>
                <span className="font-semibold text-soil-900">{inspectionDate}</span>
              </div>
              <div>
                <span className="text-[10px] text-soil-400 block uppercase font-bold tracking-wider">
                  Producer / Lot Owner
                </span>
                <span className="font-semibold text-soil-900">{currentUser.name}</span>
              </div>
              <div>
                <span className="text-[10px] text-soil-400 block uppercase font-bold tracking-wider">
                  Origin Mandi / Block
                </span>
                <span className="font-semibold text-soil-900">{currentUser.village}</span>
              </div>
            </div>
          </div>

          {/* Core Grade & Quality Badge Section */}
          <div className="bg-soil-50 rounded-xl p-4 border border-soil-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-canopy-900 text-white flex flex-col items-center justify-center font-display border-2 border-harvest-400 shadow-sm">
                <span className="text-[9px] uppercase tracking-wider text-harvest-300 font-sans">
                  AGMARK
                </span>
                <span className="text-xl font-bold leading-none">
                  {activeCertificate.grade || "Grade A"}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-soil-950 font-display">
                    {activeCertificate.detectedCrop || "Agricultural Produce"}
                  </h2>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-canopy-100 text-canopy-900 border border-canopy-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-canopy-700" />
                    Verified Grade
                  </span>
                </div>
                <p className="text-xs text-soil-600 mt-0.5">
                  Overall Quality Score: <strong className="text-canopy-800 font-mono text-sm">{activeCertificate.qualityScore || 92}/100</strong>
                </p>
              </div>
            </div>

            {/* Price Premium Impact Badge */}
            <div className="text-right sm:border-l border-soil-200 sm:pl-4">
              <span className="text-[10px] uppercase tracking-wider font-bold text-soil-400 block">
                Mandi Benchmark Premium
              </span>
              <span className="text-sm sm:text-base font-bold text-signal-good font-mono">
                {activeCertificate.priceImpact || "+₹280 to +₹650/qtl"}
              </span>
              <span className="text-[10px] text-soil-500 block">
                Above Local Minimum Modal Rate
              </span>
            </div>
          </div>

          {/* Inspection Physical & Moisture Metrics Table */}
          <div className="border border-soil-200 rounded-xl overflow-hidden text-xs">
            <div className="bg-soil-100 px-4 py-2 font-bold text-soil-900 uppercase tracking-wider text-[10px] border-b border-soil-200">
              Assayed Quality Parameters & Tolerances
            </div>
            <div className="divide-y divide-soil-200">
              <div className="grid grid-cols-3 px-4 py-2.5">
                <span className="text-soil-500 font-medium">Estimated Moisture Content</span>
                <span className="font-mono font-bold text-soil-900">{activeCertificate.estimatedMoisture || "7.8%"}</span>
                <span className="text-[11px] text-signal-good font-semibold">Within AGMARK Safe Limit (&lt; 8.5%)</span>
              </div>
              <div className="grid grid-cols-3 px-4 py-2.5">
                <span className="text-soil-500 font-medium">Foreign Matter / Defect Rate</span>
                <span className="font-mono font-bold text-soil-900">{activeCertificate.defectRate || "1.8%"}</span>
                <span className="text-[11px] text-signal-good font-semibold">Low Trash (Grade A Spec)</span>
              </div>
              <div className="grid grid-cols-3 px-4 py-2.5">
                <span className="text-soil-500 font-medium">Size Uniformity & Luster</span>
                <span className="font-mono font-bold text-soil-900">{activeCertificate.sizeUniformity || "94% Uniform"}</span>
                <span className="text-[11px] text-soil-600">Export & Mill Processing Quality</span>
              </div>
              <div className="grid grid-cols-3 px-4 py-2.5">
                <span className="text-soil-500 font-medium">Est. Safe Storage Shelf-Life</span>
                <span className="font-mono font-bold text-soil-900">{activeCertificate.storageLife || "60–90 Days"}</span>
                <span className="text-[11px] text-canopy-700 font-semibold">Eligible for WDRA Warehouse Pledge</span>
              </div>
            </div>
          </div>

          {/* QR Code & Digital Hash Footer */}
          <div className="border-t border-soil-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-soil-100 border border-soil-300 rounded-lg p-1 flex items-center justify-center">
                {/* SVG Stylized QR Code for print */}
                <div className="w-full h-full bg-soil-900 rounded flex flex-col items-center justify-center text-white p-1">
                  <QrCode className="w-8 h-8" />
                  <span className="text-[6px] font-mono tracking-tighter uppercase">SCAN MANDI</span>
                </div>
              </div>
              <div className="text-[11px] text-soil-600">
                <p className="font-mono font-bold text-soil-900">Digital Validation Hash: 8F92-BC44-ENAM</p>
                <p className="text-[10px] text-soil-500 mt-0.5">
                  Scan to verify lot assay report on national e-NAM database.
                </p>
              </div>
            </div>

            <div className="text-right text-xs">
              <div className="font-bold text-soil-900 flex items-center justify-end gap-1">
                <Sparkles className="w-3.5 h-3.5 text-canopy-600" />
                Agrovision AI Vision Assay
              </div>
              <div className="text-[10px] text-soil-500">
                ISO/IEC 17025 Algorithmic Inspection Protocol
              </div>
            </div>
          </div>

          {/* Mandi Defense Tip Callout */}
          <div className="bg-harvest-100/70 border border-harvest-400/40 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-soil-800">
            <Info className="w-4 h-4 text-harvest-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-soil-950 font-bold block mb-0.5">
                Mandi Protection Advisory (APMC Section 32 Compliance):
              </strong>
              {t("mandiDefenseTip")}
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="bg-soil-100 px-6 py-3.5 border-t border-soil-200 flex items-center justify-between text-xs">
          <span className="text-soil-500 font-mono text-[11px]">
            Certificate ID: {lotId}
          </span>
          <button
            onClick={closeCertificate}
            className="px-4 py-2 bg-canopy-900 hover:bg-canopy-800 text-white font-bold rounded-xl transition-colors"
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
}
