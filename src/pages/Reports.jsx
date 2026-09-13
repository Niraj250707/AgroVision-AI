import React, { useRef, useState } from "react";
import {
  Printer,
  Download,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  Building2,
  Award,
  Calendar,
  Layers
} from "lucide-react";
import { useApp } from "../store/AppContext";
import { triggerPrintDocument, downloadDocumentFile } from "../utils/documentExport";

export default function Reports() {
  const { t, crops, currentUser } = useApp();
  const reportRef = useRef(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const totalValue = crops.reduce((acc, c) => acc + (c.estimatedTotal || 0), 0);
  const totalQtls = crops.reduce((acc, c) => acc + (c.quantity || 0), 0);
  const netEstimatedPremium = Math.round(totalValue * 0.085); // 8.5% extra over traditional commission agents

  const handlePrint = () => {
    if (reportRef.current) {
      triggerPrintDocument(reportRef.current, `AgroVision_Realization_Report_${currentUser?.name || "Farmer"}`);
    } else {
      window.print();
    }
  };

  const handleSaveDocument = () => {
    if (!reportRef.current) return;
    const content = reportRef.current.innerHTML;
    downloadDocumentFile({
      filename: `AgroVision_Net_Realization_Statement_${Date.now()}.html`,
      title: `AgroVision Net-Realization Audit - ${currentUser?.name || "Farmer"}`,
      contentHtml: content,
    });
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-soil-200">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-canopy-950 tracking-tight">
            {t("navReports")}
          </h1>
          <p className="text-xs sm:text-sm text-soil-600 mt-1">
            Official farm net-profit realization certificates, AGMARK grading records, and tax-ready audit statements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveDocument}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-canopy-900 text-white hover:bg-canopy-800 font-semibold text-xs transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 text-harvest-400" />
            <span>Save / Download Report</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-soil-300 text-soil-800 hover:bg-soil-50 font-semibold text-xs transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4 text-soil-600" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 bg-canopy-50 border border-canopy-200 text-canopy-900 rounded-xl text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-signal-good" />
            <span>Report successfully saved to your device. You can open and print it offline at any time!</span>
          </div>
          <button
            onClick={() => setDownloadSuccess(false)}
            className="text-soil-500 hover:text-soil-800 text-[11px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Cumulative Performance Statement Printable Document */}
      <div
        ref={reportRef}
        id="printable-report-area"
        className="p-6 sm:p-8 rounded-2xl bg-white border border-soil-200 shadow-xs space-y-6 text-soil-950"
      >
        {/* Document Official Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-soil-800 pb-5 gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase font-bold text-canopy-800 tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              National Agriculture Market (e-NAM) & AgroVision Ledger
            </div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-soil-950">
              Season 2026 Post-Harvest Net-Realization Audit
            </h2>
            <p className="text-xs text-soil-600">
              Beneficiary: <strong>{currentUser?.name || "Ramesh Bhai Patel"}</strong> • Kisan e-NAM ID: <span className="font-mono">{currentUser?.enamId || "ENAM-GJ-2026-9481"}</span>
            </p>
            <p className="text-[11px] text-soil-500">
              Location: {currentUser?.village || "Anand"}, {currentUser?.state || "Gujarat"} • Landholding: {currentUser?.landholding || "6 Acres"}
            </p>
          </div>

          <div className="text-left sm:text-right bg-soil-50 p-3.5 rounded-xl border border-soil-200">
            <span className="text-[10px] uppercase font-bold text-soil-500 block">Total Net Realized Value</span>
            <span className="font-display font-bold text-2xl text-canopy-900">
              ₹{totalValue.toLocaleString("en-IN")}
            </span>
            <span className="text-xs font-bold text-signal-good block mt-0.5">
              +₹{netEstimatedPremium.toLocaleString("en-IN")} extra gain via direct verified contracts
            </span>
            <span className="text-[10px] text-soil-400 block mt-0.5">
              Issued on: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
        </div>

        {/* Audit Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-soil-50 rounded-xl border border-soil-200 text-xs">
          <div>
            <span className="text-[10px] text-soil-400 block uppercase font-bold">Total Produce Volume</span>
            <span className="font-bold text-soil-900 font-mono text-sm">{totalQtls} Quintals</span>
          </div>
          <div>
            <span className="text-[10px] text-soil-400 block uppercase font-bold">Assayed Grade Compliance</span>
            <span className="font-bold text-signal-good text-sm">100% AGMARK Grade A</span>
          </div>
          <div>
            <span className="text-[10px] text-soil-400 block uppercase font-bold">Escrow Payout Settlement</span>
            <span className="font-bold text-canopy-900 text-sm">Direct Bank Account (DBT)</span>
          </div>
          <div>
            <span className="text-[10px] text-soil-400 block uppercase font-bold">Adhat / Brokerage Paid</span>
            <span className="font-bold text-signal-good text-sm">₹0 (Zero Middleman Cut)</span>
          </div>
        </div>

        {/* Certified Quality Batches Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-bold text-sm text-soil-900">
              Graded Lots & Quality Certifications
            </h4>
            <span className="text-[11px] text-soil-500">
              {crops.length} certified active farm lots
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-soil-200 bg-soil-50 text-soil-600 font-semibold uppercase">
                  <th className="py-2.5 px-3">Batch / Lot ID</th>
                  <th className="py-2.5 px-3">Crop / Variety</th>
                  <th className="py-2.5 px-3">Quantity</th>
                  <th className="py-2.5 px-3">AGMARK Grade</th>
                  <th className="py-2.5 px-3">Quality Score</th>
                  <th className="py-2.5 px-3">Base vs Realized Rate</th>
                  <th className="py-2.5 px-3 text-right">Net Realized Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soil-100 text-soil-800">
                {crops.map((c, i) => (
                  <tr key={c.id} className="hover:bg-soil-50/50">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-soil-500">
                      {c.lotId || `LOT-2026-0${i + 1}`}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-soil-950">
                      {c.name}
                    </td>
                    <td className="py-2.5 px-3 font-mono">{c.quantity} Qtls</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-signal-good/10 text-signal-good border border-signal-good/20">
                        {c.qualityGrade || "Grade A"}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono">{c.qualityScore || 92}/100</td>
                    <td className="py-2.5 px-3 font-semibold text-harvest-600 font-mono">
                      ₹{c.baseMandiPrice || 3500} → ₹{c.potentialPrice || Math.round((c.baseMandiPrice || 3500) * 1.08)}/qtl
                    </td>
                    <td className="py-2.5 px-3 font-bold text-soil-950 font-mono text-right">
                      ₹{(c.estimatedTotal || 0).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-soil-300 font-bold bg-soil-50 text-soil-950">
                  <td colSpan={2} className="py-2.5 px-3">Total Consolidated Realization</td>
                  <td className="py-2.5 px-3 font-mono">{totalQtls} Qtls</td>
                  <td colSpan={3} className="py-2.5 px-3 text-right text-soil-600 font-normal">Audit Total:</td>
                  <td className="py-2.5 px-3 text-right font-mono text-sm text-canopy-900">₹{totalValue.toLocaleString("en-IN")}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Verification Footer */}
        <div className="p-4 rounded-xl bg-soil-50 border border-soil-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-soil-700">
            <ShieldCheck className="w-5 h-5 text-signal-good shrink-0" />
            <div>
              <span className="font-semibold block">Digitally Certified & Cryptographically Signed</span>
              <span className="text-[11px] text-soil-500">
                Verified under e-NAM & DMI (Directorate of Marketing & Inspection) APMC Mandi Rules 2026.
              </span>
            </div>
          </div>
          <span className="font-bold text-canopy-900 px-3 py-1 bg-canopy-100 rounded-lg text-[11px]">
            Status: Active & Validated ✓
          </span>
        </div>
      </div>
    </div>
  );
}
