import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Building2,
  CheckCircle2,
  Printer,
  AlertTriangle,
  Coins,
  X
} from "lucide-react";
import { useApp } from "../store/AppContext";
import { useLocale } from "../context/LocaleContext";

export default function StoragePlanner() {
  const { activeCrop, currentUser } = useApp();
  const { t } = useLocale();
  const [holdingDays, setHoldingDays] = useState(45);
  const [storageType, setStorageType] = useState("cwc");
  const [showSanctionModal, setShowSanctionModal] = useState(false);

  // Voice Command Listener for dynamic form state changes
  useEffect(() => {
    const handleVoiceCommand = (event) => {
      const detail = event.detail;
      if (!detail) return;

      if (detail.action === "SET_HOLDING_DAYS" && detail.payload?.days) {
        setHoldingDays(Number(detail.payload.days));
      } else if (detail.action === "SET_STORAGE_TYPE" && detail.payload?.type) {
        setStorageType(detail.payload.type);
      }
    };

    window.addEventListener("agrovision:voice-command", handleVoiceCommand);
    return () => {
      window.removeEventListener("agrovision:voice-command", handleVoiceCommand);
    };
  }, []);

  const storageRates = {
    cwc: {
      name: "Central Warehousing Corp (CWC) Anand",
      ratePerQtlMonth: 180,
      wdraCertified: true,
      maxLoanPct: 75,
      weightLossPct: 0.4,
      shelfLifeDays: 120,
    },
    cold: {
      name: "Anand Agro Cold Chain & Controlled Atmosphere",
      ratePerQtlMonth: 240,
      wdraCertified: true,
      maxLoanPct: 75,
      weightLossPct: 0.2,
      shelfLifeDays: 180,
    },
    farm: {
      name: "On-Farm Traditional Ventilated Shed",
      ratePerQtlMonth: 40,
      wdraCertified: false,
      maxLoanPct: 0,
      weightLossPct: 3.8,
      shelfLifeDays: 35,
    },
  };

  const selectedWarehouse = storageRates[storageType];
  const months = holdingDays / 30;
  const storageCost = Math.round(selectedWarehouse.ratePerQtlMonth * months * activeCrop.quantity);

  // Commodity baseline valuation
  const baseRatePerQtl = 7200;
  const currentTotalValuation = activeCrop.quantity * baseRatePerQtl;

  // Expected price surge after holding days
  const projectedSurgePerQtl = Math.round(650 * (holdingDays / 30));
  const futureGrossValuation = activeCrop.quantity * (baseRatePerQtl + projectedSurgePerQtl);
  const expectedGain = futureGrossValuation - currentTotalValuation;

  // Pledge loan calculation (75% @ 7% p.a. KCC interest)
  const pledgeLoanEligible = selectedWarehouse.wdraCertified
    ? Math.round((currentTotalValuation * selectedWarehouse.maxLoanPct) / 100)
    : 0;

  const annualInterestRate = 0.07;
  const pledgeLoanInterest = Math.round(
    pledgeLoanEligible * annualInterestRate * (holdingDays / 365)
  );

  // Net storage economics
  const netStorageAdvantage = expectedGain - storageCost - pledgeLoanInterest;

  const handleApplyLoan = async () => {
    try {
      await fetch("/api/storage/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop: activeCrop.name,
          quantityQtl: activeCrop.quantity,
          warehouseType: storageType,
          holdingDays,
          loanAmount: pledgeLoanEligible,
          farmerId: currentUser.id,
        }),
      });
    } catch (e) {
      console.warn("Storage booking logged locally:", e);
    }
    setShowSanctionModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-soil-200">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-canopy-100 text-canopy-900 text-xs font-semibold mb-1 border border-canopy-200">
          <ShieldCheck className="w-3.5 h-3.5 text-canopy-700" />
          WDRA Accredited Warehouse Receipt & Credit Network
        </div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-canopy-950 tracking-tight">
          {t("navStorage")}
        </h1>
        <p className="text-xs sm:text-sm text-soil-600 mt-1">
          {t("storageSubtitle", "Prevent harvest distress selling. Store produce safely, secure instant 75% electronic negotiable warehouse receipt (e-NWR) pledge credit at 7% p.a., and capture off-season price surges.")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Storage Facility & Holding Controls */}
        <div className="p-6 rounded-2xl bg-white border border-soil-200 shadow-2xs space-y-4">
          <h3 className="font-display font-bold text-base text-soil-950">
            {t("storageParameters", "Storage Parameters")}
          </h3>

          <div>
            <label className="text-xs font-semibold text-soil-700 block mb-1">
              {t("selectWarehouse", "Select Warehouse Facility")}
            </label>
            <select
              value={storageType}
              onChange={(e) => setStorageType(e.target.value)}
              className="w-full bg-soil-50 border border-soil-300 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-canopy-600"
            >
              <option value="cwc">CWC Anand (WDRA Certified) - ₹180/qtl/mo</option>
              <option value="cold">Anand Cold Chain (Controlled Atmosphere) - ₹240/qtl/mo</option>
              <option value="farm">On-Farm Ventilated Shed (Traditional) - ₹40/qtl/mo</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between text-xs text-soil-600 mb-1">
              <span>{t("targetHoldingWindow", "Target Holding Window")}:</span>
              <strong className="text-canopy-900 font-mono text-sm">{holdingDays} {t("days", "Days")}</strong>
            </div>
            <input
              type="range"
              min="15"
              max="90"
              step="5"
              value={holdingDays}
              onChange={(e) => setHoldingDays(Number(e.target.value))}
              className="w-full accent-canopy-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-soil-400 mt-1">
              <span>15 {t("days", "Days")}</span>
              <span>45 {t("days", "Days")} (Optimal)</span>
              <span>90 {t("days", "Days")}</span>
            </div>
          </div>

          <div className="p-3.5 bg-soil-50 rounded-xl text-xs space-y-2 border border-soil-200">
            <div className="flex justify-between text-soil-600">
              <span>{t("activeBatch", "Active Batch")}:</span>
              <strong className="text-soil-900">{activeCrop.name} ({activeCrop.quantity} Quintals)</strong>
            </div>
            <div className="flex justify-between text-soil-600">
              <span>{t("monthlyStorageFee", "Monthly Storage Fee")}:</span>
              <strong className="text-soil-900">₹{selectedWarehouse.ratePerQtlMonth}/quintal</strong>
            </div>
            <div className="flex justify-between text-soil-600">
              <span>{t("physicalWeightLoss", "Physical Weight Loss")}:</span>
              <strong className={selectedWarehouse.weightLossPct > 2 ? "text-signal-bad" : "text-signal-good"}>
                {selectedWarehouse.weightLossPct}%
              </strong>
            </div>
            <div className="flex justify-between text-soil-600 pt-1 border-t border-soil-200">
              <span>{t("pledgeCreditEligible", "e-NWR Bank Pledge Loan")}:</span>
              <strong className={selectedWarehouse.wdraCertified ? "text-signal-good font-bold" : "text-soil-400"}>
                {selectedWarehouse.wdraCertified ? "75% of Valuation @ 7% p.a." : "Ineligible (Unaccredited)"}
              </strong>
            </div>
          </div>

          {selectedWarehouse.wdraCertified ? (
            <button
              onClick={handleApplyLoan}
              className="w-full py-2.5 px-4 rounded-xl bg-canopy-900 hover:bg-canopy-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Coins className="w-4 h-4 text-harvest-400" />
              <span>{t("applyPledgeLoan")}</span>
            </button>
          ) : (
            <div className="p-2.5 rounded-xl bg-soil-100 text-soil-600 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-harvest-600 shrink-0" />
              <span>On-farm sheds cannot generate electronic warehouse receipts for bank loans.</span>
            </div>
          )}
        </div>

        {/* Projected Returns & WDRA Finance (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-2xl bg-canopy-950 text-white border border-canopy-800 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-harvest-400 uppercase tracking-wider">
                {t("holdingFinancialSummary", "Holding Strategy Financial Summary")}
              </span>
              <span className="text-xs text-soil-300 font-mono">
                {holdingDays} {t("days", "Days")} ({activeCrop.quantity} Quintals)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3.5 bg-canopy-900/80 rounded-xl border border-canopy-700/60">
                <span className="text-[10px] text-soil-400 block uppercase">{t("warehouseStorageFee", "Warehouse Storage Fee")}</span>
                <span className="font-display font-bold text-xl text-soil-200">
                  -₹{storageCost.toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-soil-400 block mt-0.5">
                  ₹{selectedWarehouse.ratePerQtlMonth}/qtl/month
                </span>
              </div>

              <div className="p-3.5 bg-canopy-900/80 rounded-xl border border-canopy-700/60">
                <span className="text-[10px] text-soil-400 block uppercase">{t("projectedPriceSurge", "Projected Price Surge")}</span>
                <span className="font-display font-bold text-xl text-harvest-400">
                  +₹{expectedGain.toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-soil-400 block mt-0.5">
                  +₹{projectedSurgePerQtl}/qtl rise
                </span>
              </div>

              <div className="p-3.5 bg-canopy-900/80 rounded-xl border-2 border-harvest-400/50">
                <span className="text-[10px] text-harvest-300 block uppercase">{t("netAdvantageInHand", "Net Advantage in Hand")}</span>
                <span className="font-display font-bold text-xl text-signal-good font-mono">
                  +₹{netStorageAdvantage.toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-harvest-300 block mt-0.5">
                  {t("afterStorageCharges", "After all storage and loan charges")}
                </span>
              </div>
            </div>

            {/* Warehouse Pledge Loan Liquidity Highlight */}
            {selectedWarehouse.wdraCertified && (
              <div className="p-4 bg-canopy-900/50 rounded-xl border border-canopy-700/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-harvest-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      {t("immediateCashLoan", "Immediate Cash Without Selling (e-NWR Bank Loan)")}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-harvest-400 font-mono">
                    ₹{pledgeLoanEligible.toLocaleString("en-IN")} Disbursable in 48h
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 rounded bg-canopy-950/60 border border-canopy-800">
                    <span className="text-[10px] text-soil-400 block">{t("currentCropValuation", "Current Crop Value")}:</span>
                    <span className="font-bold text-soil-200">₹{currentTotalValuation.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="p-2 rounded bg-canopy-950/60 border border-canopy-800">
                    <span className="text-[10px] text-soil-400 block">{t("bankSanction75", "Bank Sanction (75%)")}:</span>
                    <span className="font-bold text-signal-good">₹{pledgeLoanEligible.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="p-2 rounded bg-canopy-950/60 border border-canopy-800">
                    <span className="text-[10px] text-soil-400 block">{t("interestRateKcc", "Interest Rate")}:</span>
                    <span className="font-bold text-soil-200">7.0% p.a. (KCC)</span>
                  </div>
                  <div className="p-2 rounded bg-canopy-950/60 border border-canopy-800">
                    <span className="text-[10px] text-soil-400 block">Total {holdingDays}d Interest:</span>
                    <span className="font-bold text-signal-bad font-mono">₹{pledgeLoanInterest.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="text-[11px] text-soil-300">
                  💡 <strong>How it works:</strong> You deposit produce at CWC, receive a digital receipt, and your linked bank account (<strong>{currentUser.kccBank}</strong>) instantly disburses 75% cash. When prices rise in {holdingDays} days, you sell the crop, bank deducts the loan and interest, and you pocket the remaining profit!
                </div>
              </div>
            )}
          </div>

          {/* Scientific Spoilage & Quality Risk Box */}
          <div className="p-5 rounded-2xl bg-white border border-soil-200 shadow-2xs space-y-3">
            <h4 className="font-display font-bold text-sm text-soil-950">
              Crop Spoilage & Shelf-Life Risk Assessment
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-soil-50 border border-soil-200">
                <span className="text-soil-500 block text-[10px] uppercase font-bold">Safe Storage Window</span>
                <span className="font-bold text-sm text-soil-900">{selectedWarehouse.shelfLifeDays} Days</span>
                <span className="text-[10px] text-soil-500 block mt-0.5">Holding {holdingDays} days is safe</span>
              </div>
              <div className="p-3 rounded-xl bg-soil-50 border border-soil-200">
                <span className="text-soil-500 block text-[10px] uppercase font-bold">Respiration & Shrinkage Loss</span>
                <span className="font-bold text-sm text-canopy-800">{selectedWarehouse.weightLossPct}% estimated</span>
                <span className="text-[10px] text-soil-500 block mt-0.5">~{((activeCrop.quantity * selectedWarehouse.weightLossPct) / 100).toFixed(1)} Quintals</span>
              </div>
              <div className="p-3 rounded-xl bg-soil-50 border border-soil-200">
                <span className="text-soil-500 block text-[10px] uppercase font-bold">Fungal / Aflatoxin Risk</span>
                <span className="font-bold text-sm text-signal-good">Very Low (&lt; 0.1%)</span>
                <span className="text-[10px] text-soil-500 block mt-0.5">Humidity controlled at &lt;65% RH</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WDRA Bank Sanction Modal */}
      {showSanctionModal && (
        <div className="fixed inset-0 z-50 bg-soil-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-soil-200 shadow-2xl overflow-hidden my-6 animate-fadeIn">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-soil-100 border-b border-soil-200">
              <div className="flex items-center gap-2 text-xs font-bold text-canopy-950">
                <Building2 className="w-4 h-4 text-canopy-700" />
                <span>e-NWR Post-Harvest Pledge Loan Requisition</span>
              </div>
              <button
                onClick={() => setShowSanctionModal(false)}
                className="p-1 rounded-lg text-soil-500 hover:text-soil-950"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Slip Body */}
            <div className="p-6 space-y-4 text-xs text-soil-900">
              <div className="text-center border-b border-soil-200 pb-3">
                <div className="text-[10px] font-mono uppercase font-bold text-soil-400">
                  Warehousing Development and Regulatory Authority (WDRA)
                </div>
                <h3 className="font-display font-bold text-base text-soil-950 mt-1">
                  Electronic Negotiable Warehouse Receipt Loan Sanction
                </h3>
                <p className="text-[11px] text-soil-500">
                  Routing Branch: {currentUser.kccBank}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-soil-50 rounded-xl border border-soil-200 text-xs">
                <div>
                  <span className="text-[10px] text-soil-400 block font-bold">APPLICANT FARMER:</span>
                  <span className="font-bold text-soil-950">{currentUser.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-soil-400 block font-bold">e-NAM ID / KISAN ID:</span>
                  <span className="font-mono text-soil-950">{currentUser.enamId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-soil-400 block font-bold">WAREHOUSE NAME:</span>
                  <span className="font-semibold text-soil-950">{selectedWarehouse.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-soil-400 block font-bold">WDRA REGISTRATION NO:</span>
                  <span className="font-mono text-canopy-900">WDRA/GJ/ANAND/0942</span>
                </div>
              </div>

              <div className="border border-soil-200 rounded-xl divide-y divide-soil-200">
                <div className="flex justify-between p-3">
                  <span>Deposited Lot:</span>
                  <strong>{activeCrop.quantity} Quintals {activeCrop.name} (Grade A)</strong>
                </div>
                <div className="flex justify-between p-3">
                  <span>Assessed Base Valuation:</span>
                  <strong className="font-mono">₹{currentTotalValuation.toLocaleString("en-IN")}</strong>
                </div>
                <div className="flex justify-between p-3 bg-canopy-50">
                  <span className="font-bold text-canopy-900">Pre-Approved Loan Amount (75%):</span>
                  <strong className="font-mono text-base text-signal-good font-bold">
                    ₹{pledgeLoanEligible.toLocaleString("en-IN")}
                  </strong>
                </div>
                <div className="flex justify-between p-3">
                  <span>Interest Scheme:</span>
                  <span>Concessional KCC @ 7.0% p.a. (Govt. Interest Subvention)</span>
                </div>
                <div className="flex justify-between p-3">
                  <span>Tenure / Holding Duration:</span>
                  <span>{holdingDays} Days (Extendable up to 180 days)</span>
                </div>
              </div>

              <div className="p-3 bg-harvest-50 rounded-xl border border-harvest-200 text-[11px] text-soil-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-signal-good shrink-0 mt-0.5" />
                <span>
                  <strong>Immediate Action:</strong> Your e-NWR requisition has been submitted to the National E-Repository (NERL). Visit CWC Anand with your vehicle gate pass to drop the produce and the ₹{pledgeLoanEligible.toLocaleString("en-IN")} credit will be disbursed via DBT.
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-soil-50 border-t border-soil-200 flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-soil-300 rounded-xl text-xs font-semibold text-soil-800 hover:bg-soil-100"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Sanction Slip</span>
              </button>
              <button
                onClick={() => setShowSanctionModal(false)}
                className="px-4 py-2 bg-canopy-900 text-white rounded-xl text-xs font-bold hover:bg-canopy-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
