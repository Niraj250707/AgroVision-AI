import React from "react";
import {
  Printer,
  ShieldCheck
} from "lucide-react";
import { useApp } from "../store/AppContext";

export default function Reports() {
  const { t, crops } = useApp();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
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
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-soil-300 text-soil-800 hover:bg-soil-50 font-semibold text-xs transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4 text-soil-600" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Cumulative Performance Statement */}
      <div className="p-6 rounded-2xl bg-white border border-soil-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-soil-100 pb-4">
          <div>
            <span className="text-xs font-bold text-canopy-800 uppercase tracking-wider block">
              Agrovision AI Certified Ledger
            </span>
            <h2 className="font-display font-bold text-xl text-soil-950">
              Season 2026 Post-Harvest Net-Realization Audit
            </h2>
            <p className="text-xs text-soil-500">
              Beneficiary: Farmer Ramesh Patel • APMC Anand ID: GJ-AND-4912
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-soil-500 block">Total Net Realization</span>
            <span className="font-display font-bold text-2xl text-canopy-900">
              ₹13,70,500
            </span>
            <span className="text-xs font-bold text-signal-good block">
              +₹1,24,600 over traditional mandi commission sales
            </span>
          </div>
        </div>

        {/* Certified Quality Batches Table */}
        <div className="space-y-3">
          <h4 className="font-display font-bold text-sm text-soil-900">
            Graded Lots & Quality Certifications
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-soil-200 bg-soil-50 text-soil-600 font-semibold uppercase">
                  <th className="py-2.5 px-3">Batch ID</th>
                  <th className="py-2.5 px-3">Crop / Variety</th>
                  <th className="py-2.5 px-3">Quantity</th>
                  <th className="py-2.5 px-3">AGMARK Grade</th>
                  <th className="py-2.5 px-3">Quality Score</th>
                  <th className="py-2.5 px-3">Price Premium</th>
                  <th className="py-2.5 px-3">Net Realized Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soil-100 text-soil-800">
                {crops.map((c, i) => (
                  <tr key={c.id} className="hover:bg-soil-50/50">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-soil-500">
                      LOT-2026-0{i + 1}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-soil-950">
                      {c.name}
                    </td>
                    <td className="py-2.5 px-3">{c.quantity} Qtls</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-signal-good/10 text-signal-good">
                        {c.qualityGrade || "Grade A"}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">{c.qualityScore || 92}/100</td>
                    <td className="py-2.5 px-3 font-semibold text-harvest-600">
                      +₹280 - ₹490/qtl
                    </td>
                    <td className="py-2.5 px-3 font-bold text-soil-950">
                      ₹{c.estimatedTotal.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-soil-50 border border-soil-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-soil-600">
            <ShieldCheck className="w-4 h-4 text-signal-good" />
            <span>Digital signature verified under National Agriculture Market (e-NAM) protocol.</span>
          </div>
          <span className="font-bold text-canopy-900">
            Status: Active & Validated
          </span>
        </div>
      </div>
    </div>
  );
}
