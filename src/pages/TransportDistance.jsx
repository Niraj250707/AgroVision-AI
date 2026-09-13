import React, { useState, useEffect, useRef } from "react";
import {
  Truck,
  ShieldCheck,
  FileText,
  Printer,
  QrCode,
  X,
  Download,
  CheckCircle2
} from "lucide-react";
import { useApp } from "../store/AppContext";
import { useLocale } from "../context/LocaleContext";
import { triggerPrintDocument, downloadDocumentFile } from "../utils/documentExport";

export default function TransportDistance() {
  const { marketPrices, activeCrop, currentUser } = useApp();
  const { t } = useLocale();
  const [vehicleType, setVehicleType] = useState("tractor"); // tractor | pickup | truck
  const [selectedMandi, setSelectedMandi] = useState(null);
  const [showGatePassModal, setShowGatePassModal] = useState(false);
  const [savePassSuccess, setSavePassSuccess] = useState(false);
  const gatePassRef = useRef(null);

  // Dynamic voice command listener for vehicle type selection
  useEffect(() => {
    const handleVoiceCommand = (event) => {
      const detail = event.detail;
      if (!detail) return;

      if (detail.action === "SET_VEHICLE_TYPE" && detail.payload?.type) {
        setVehicleType(detail.payload.type);
      }
    };

    window.addEventListener("agrovision:voice-command", handleVoiceCommand);
    return () => {
      window.removeEventListener("agrovision:voice-command", handleVoiceCommand);
    };
  }, []);

  const vehicleRates = {
    tractor: {
      name: "Tractor Trolley (40-60 Qtls)",
      baseRatePerKm: 28,
      maxCapacity: 60,
      platePrefix: "GJ-23-T-4912",
      driverName: "Dinesh Bhai Parmar",
      driverPhone: "+91 98251 40192"
    },
    pickup: {
      name: "Bolero Maxi Truck (25-35 Qtls)",
      baseRatePerKm: 22,
      maxCapacity: 35,
      platePrefix: "GJ-07-BB-8291",
      driverName: "Raju Solanki",
      driverPhone: "+91 94280 18273"
    },
    truck: {
      name: "10-Wheel Heavy Truck (150-200 Qtls)",
      baseRatePerKm: 55,
      maxCapacity: 200,
      platePrefix: "GJ-06-TX-1094",
      driverName: "Harpreet Singh",
      driverPhone: "+91 97123 99281"
    },
  };

  const selectedVehicle = vehicleRates[vehicleType];

  // Mandi fee parameters
  const hamaliRatePerQtl = 15; // loading & unloading
  const weighbridgeFee = 80; // per trolley weigh fee

  const handleGenerateGatePass = async (mandi) => {
    setSelectedMandi(mandi);
    try {
      await fetch("/api/transport/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mandiId: mandi.id,
          mandiName: mandi.mandiName,
          crop: activeCrop.name,
          quantityQtl: activeCrop.quantity,
          vehicleType,
          farmerId: currentUser.id,
        }),
      });
    } catch (e) {
      console.warn("Transport booking saved locally:", e);
    }
    setShowGatePassModal(true);
  };

  const handlePrintPass = () => {
    if (gatePassRef.current) {
      triggerPrintDocument(gatePassRef.current, `APMC_GatePass_${selectedMandi?.mandiName || "Mandi"}_${selectedVehicle.platePrefix}`);
    } else {
      window.print();
    }
  };

  const handleSavePass = () => {
    if (!gatePassRef.current || !selectedMandi) return;
    downloadDocumentFile({
      filename: `APMC_EPass_${selectedMandi.mandiName.replace(/\s+/g, "_")}_${selectedVehicle.platePrefix}.html`,
      title: `APMC Mandi Inward Electronic Gate Pass - ${selectedMandi.mandiName}`,
      contentHtml: gatePassRef.current.innerHTML,
    });
    setSavePassSuccess(true);
    setTimeout(() => setSavePassSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="pb-2 border-b border-soil-200">
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-canopy-950 tracking-tight">
          {t("navTransport")}
        </h1>
        <p className="text-xs sm:text-sm text-soil-600 mt-1">
          Freight logistics optimization, toll routes, APMC hamali handling charges, and instant digital mandi entry gate passes.
        </p>
      </div>

      {/* Vehicle Selector & Freight Calculator Bar */}
      <div className="p-4 rounded-xl bg-white border border-soil-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-canopy-700" />
          <span className="text-xs font-bold uppercase tracking-wider text-soil-700">
            Transport Fleet Options:
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(vehicleRates).map(([key, v]) => (
            <button
              key={key}
              onClick={() => setVehicleType(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                vehicleType === key
                  ? "bg-canopy-900 text-white shadow-xs"
                  : "bg-soil-100 text-soil-700 hover:bg-soil-200"
              }`}
            >
              {v.name}
            </button>
          ))}
        </div>
      </div>

      {/* Mandi Logistics Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {marketPrices.map((mandi) => {
          const roundTripKm = mandi.distanceKm * 2;
          const estimatedFreight = roundTripKm * selectedVehicle.baseRatePerKm;
          const effectiveLotQtls = Math.min(activeCrop.quantity, selectedVehicle.maxCapacity);
          const totalHamali = effectiveLotQtls * hamaliRatePerQtl;
          const mandiCess = Math.round(mandi.modalPrice * effectiveLotQtls * 0.01); // 1% APMC cess
          const totalLogisticsCost = estimatedFreight + totalHamali + mandiCess + weighbridgeFee;

          return (
            <div
              key={mandi.id}
              className="p-5 rounded-2xl bg-white border border-soil-200 shadow-2xs space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-bold text-base text-soil-950">
                      {mandi.mandiName}
                    </h3>
                    <p className="text-xs text-soil-500 mt-0.5">
                      {mandi.state} • Route Via Highway NH-48
                    </p>
                  </div>
                  <span className="text-xs font-bold text-canopy-800 bg-canopy-50 border border-canopy-200 px-2 py-0.5 rounded-full">
                    {mandi.distanceKm} km (1-way)
                  </span>
                </div>

                <div className="mt-3 p-3 bg-soil-50 rounded-xl space-y-1.5 text-xs border border-soil-200">
                  <div className="flex justify-between text-soil-600">
                    <span>Vehicle Freight ({roundTripKm} km):</span>
                    <strong className="text-soil-900">₹{estimatedFreight.toLocaleString("en-IN")}</strong>
                  </div>
                  <div className="flex justify-between text-soil-600">
                    <span>Hamali (Loading & Unloading):</span>
                    <strong className="text-soil-900">₹{totalHamali.toLocaleString("en-IN")}</strong>
                  </div>
                  <div className="flex justify-between text-soil-600">
                    <span>APMC Cess (1%) & Weighbridge:</span>
                    <strong className="text-soil-900">₹{(mandiCess + weighbridgeFee).toLocaleString("en-IN")}</strong>
                  </div>
                  <div className="flex justify-between text-soil-600 border-t border-soil-200 pt-1">
                    <span className="font-bold text-soil-900">Total Logistics Expense:</span>
                    <strong className="text-signal-bad font-mono text-sm">
                      ₹{totalLogisticsCost.toLocaleString("en-IN")}
                    </strong>
                  </div>
                  <div className="flex justify-between text-[11px] text-soil-500">
                    <span>Net Deducted Freight Rate:</span>
                    <span className="font-semibold text-canopy-800 font-mono">
                      ₹{Math.round(totalLogisticsCost / effectiveLotQtls)}/quintal
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-soil-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-signal-good font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    APMC Electronic Scale Pass
                  </span>
                  <span className="text-soil-500 text-[11px]">
                    ~{Math.round((mandi.distanceKm / 35) * 10) / 10} hrs transit
                  </span>
                </div>

                <button
                  onClick={() => handleGenerateGatePass(mandi)}
                  className="w-full py-2 px-3 bg-canopy-900 hover:bg-canopy-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-harvest-400" />
                  <span>{t("generateGatePass")}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* APMC Mandi Gate Pass Modal */}
      {showGatePassModal && selectedMandi && (
        <div className="fixed inset-0 z-50 bg-soil-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-soil-200 shadow-2xl overflow-hidden my-6 animate-fadeIn">
            <div className="flex items-center justify-between px-5 py-3.5 bg-soil-100 border-b border-soil-200">
              <div className="flex items-center gap-2 text-xs font-bold text-canopy-950">
                <FileText className="w-4 h-4 text-canopy-700" />
                <span>e-NAM APMC Produce Inward Gate Pass</span>
              </div>
              <button
                onClick={() => setShowGatePassModal(false)}
                className="p-1 rounded-lg text-soil-500 hover:text-soil-950"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div ref={gatePassRef} className="p-6 space-y-4 text-xs text-soil-950 bg-white">
              {/* Pass Header */}
              <div className="text-center border-b-2 border-soil-800 pb-3">
                <div className="text-[10px] font-mono uppercase font-bold text-soil-500 tracking-wider">
                  Agricultural Produce Market Committee (APMC)
                </div>
                <h2 className="font-display font-bold text-lg text-soil-950 mt-0.5">
                  {selectedMandi.mandiName} Terminal Market Yard
                </h2>
                <p className="text-[11px] text-soil-600">
                  Electronic Transit Declaration & Weighbridge Pass #GP-2026-98102
                </p>
              </div>

              {/* Grid Meta */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-soil-50 rounded-xl border border-soil-200 text-xs">
                <div>
                  <span className="text-[10px] text-soil-400 block font-bold">FARMER NAME:</span>
                  <span className="font-bold text-soil-950">{currentUser.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-soil-400 block font-bold">KISAN / e-NAM ID:</span>
                  <span className="font-mono text-soil-950">{currentUser.enamId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-soil-400 block font-bold">VEHICLE REG NO:</span>
                  <span className="font-mono font-bold text-canopy-900">{selectedVehicle.platePrefix}</span>
                </div>
                <div>
                  <span className="text-[10px] text-soil-400 block font-bold">DRIVER / CONTACT:</span>
                  <span className="font-medium text-soil-950">{selectedVehicle.driverName} ({selectedVehicle.driverPhone})</span>
                </div>
              </div>

              {/* Lot Table */}
              <div className="border border-soil-200 rounded-xl divide-y divide-soil-200 text-xs">
                <div className="flex justify-between p-2.5">
                  <span className="text-soil-600">Declared Commodity:</span>
                  <strong className="text-soil-900">{activeCrop.name}</strong>
                </div>
                <div className="flex justify-between p-2.5">
                  <span className="text-soil-600">Estimated Lot Weight:</span>
                  <strong className="text-soil-900">{activeCrop.quantity} Quintals (approx {activeCrop.quantity * 2} bags)</strong>
                </div>
                <div className="flex justify-between p-2.5">
                  <span className="text-soil-600">Assayed Grade:</span>
                  <span className="font-bold text-signal-good">{activeCrop.qualityGrade || "Grade A (Certified)"}</span>
                </div>
                <div className="flex justify-between p-2.5 bg-canopy-50">
                  <span className="font-bold text-canopy-900">APMC Checkpost Priority:</span>
                  <span className="font-bold text-canopy-900">Green Channel (Pre-inspected Digital Pass)</span>
                </div>
              </div>

              {/* Barcode / QR Section */}
              <div className="flex items-center justify-between p-3 bg-soil-100 rounded-xl border border-soil-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-soil-900 text-white rounded-lg flex items-center justify-center p-1">
                    <QrCode className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="font-mono font-bold text-xs text-soil-900">
                      SCAN-GATE-2918
                    </div>
                    <div className="text-[10px] text-soil-500">
                      Scan at Mandi Entry Weighbridge for zero-delay entry
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[9px] font-bold text-signal-good uppercase tracking-wider block">
                    STATUS: APPROVED
                  </span>
                  <span className="text-[10px] text-soil-400">Valid for 24 hours</span>
                </div>
              </div>

              {savePassSuccess && (
                <div className="p-2.5 bg-canopy-50 border border-canopy-200 text-canopy-900 rounded-lg text-xs font-semibold flex items-center gap-1.5 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-signal-good" />
                  <span>Gate Pass saved to device! You can show or print it at the APMC gate.</span>
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="px-5 py-3.5 bg-soil-50 border-t border-soil-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSavePass}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-canopy-900 text-white rounded-xl text-xs font-semibold hover:bg-canopy-800 transition-colors shadow-2xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-harvest-400" />
                  <span>Save / Download Pass</span>
                </button>
                <button
                  onClick={handlePrintPass}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-soil-300 rounded-xl text-xs font-semibold text-soil-800 hover:bg-soil-100 transition-colors shadow-2xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-soil-600" />
                  <span>Print Gate Pass</span>
                </button>
              </div>
              <button
                onClick={() => setShowGatePassModal(false)}
                className="px-4 py-1.5 bg-soil-200 text-soil-800 rounded-xl text-xs font-bold hover:bg-soil-300 cursor-pointer"
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
