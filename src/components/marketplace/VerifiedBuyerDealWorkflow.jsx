import React, { useState, useRef } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Truck,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  Lock,
  Download,
  Printer,
  ChevronRight,
  Send,
  Sliders,
  Scale,
  Eye,
  AlertTriangle
} from "lucide-react";
import { useApp } from "../../store/AppContext";
import { institutionalBuyers, getCropLifespanRules } from "../../data/buyerData";
import { sampleProducePresets } from "../../data/sampleProduceData";
import { triggerPrintDocument, downloadDocumentFile } from "../../utils/documentExport";

export default function VerifiedBuyerDealWorkflow({ isOpen, onClose, initialCrop, initialBuyerId }) {
  const { currentUser } = useApp();

  // 8-Step Transaction Flow:
  // 1: Recommendation & Small Farmer Fast-Track
  // 2: Matched Verified Buyers (Mandatory Reliability & Payment History)
  // 3: Digital Offer / Counter-Offer
  // 4: Quality Photo + Sample Photo
  // 5: Escrow Payment Hold
  // 6: Logistics Booking + e-Pass
  // 7: Delivery & Return Window (Dispute Simulation & Score Penalties)
  // 8: Payment Release & Score Update
  const [currentStep, setCurrentStep] = useState(1);

  // Crop details & Small Farmer Fast-Track
  const [selectedCropName, setSelectedCropName] = useState(initialCrop?.name || initialCrop?.cropType || "Tomato");
  const [lotQuantity, setLotQuantity] = useState(initialCrop?.quantity || 25);
  const [selectedGrade, setSelectedGrade] = useState(initialCrop?.qualityGrade || "Grade A");
  const [isSmallFarmerFastTrack, setIsSmallFarmerFastTrack] = useState(true);

  // Selected Buyer
  const [selectedBuyer, setSelectedBuyer] = useState(() => {
    if (initialBuyerId) {
      return institutionalBuyers.find((b) => b.id === initialBuyerId) || institutionalBuyers[2] || institutionalBuyers[0];
    }
    return institutionalBuyers.find((b) => b.crop.toLowerCase().includes("tomato")) || institutionalBuyers[0];
  });

  // Offer / Counter-Offer Negotiation State
  const [offerPrice, setOfferPrice] = useState(selectedBuyer?.offeredPricePerQtl || 2450);
  const [counterPrice, setCounterPrice] = useState("");
  const [negotiationMessage, setNegotiationMessage] = useState("");

  // Quality Photos & Parameters
  const actualProducePhoto = sampleProducePresets[1]?.thumbnail || sampleProducePresets[0]?.thumbnail;
  const samplePhoto = sampleProducePresets[1]?.thumbnail || sampleProducePresets[0]?.thumbnail;
  const [paramSize, setParamSize] = useState("45-55 mm / Uniform Sieve");
  const [paramColour, setParamColour] = useState("Firm Breaker Red / Luster");
  const [paramMoisture, setParamMoisture] = useState("8.4%");
  const [paramDefect, setParamDefect] = useState("1.6%");
  const qualityGrade = "Grade A";

  // Lifespan & Return Policy
  const lifespanRules = getCropLifespanRules(selectedCropName);
  const isVegetableOrFruit = selectedCropName === "Tomato" || selectedCropName === "Onion" || selectedCropName === "Potato";

  // Scores (Dynamic Score tracking for verification & penalties)
  const [farmerTrustScore, setFarmerTrustScore] = useState(98);
  const [buyerReliabilityScore, setBuyerReliabilityScore] = useState(selectedBuyer?.reliabilityScore || 99.1);
  const [auditOutcome, setAuditOutcome] = useState("matched"); // 'matched' | 'mismatch_penalty' | 'false_claim_penalty'
  const [auditNotes, setAuditNotes] = useState("");

  // Escrow State
  const escrowTxnId = `ESCROW-ENAM-${Date.now().toString().slice(-6)}`;

  // Logistics State
  const [vehicleType, setVehicleType] = useState("pickup");
  const [transitPassId] = useState(`TP-APMC-${Date.now().toString().slice(-4)}`);

  // Payment Release State
  const [paymentReleased, setPaymentReleased] = useState(false);
  const [releaseTxnId, setReleaseTxnId] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Printable ref
  const summaryRef = useRef(null);
  const gatePassRef = useRef(null);

  // Update buyer when crop changes
  const handleCropChange = (cropName) => {
    setSelectedCropName(cropName);
    const matched = institutionalBuyers.find((b) => b.crop.toLowerCase() === cropName.toLowerCase()) || institutionalBuyers[0];
    setSelectedBuyer(matched);
    setOfferPrice(matched.offeredPricePerQtl);
    setBuyerReliabilityScore(matched.reliabilityScore);
  };

  const handleSelectBuyer = (buyer) => {
    setSelectedBuyer(buyer);
    setOfferPrice(buyer.offeredPricePerQtl);
    setBuyerReliabilityScore(buyer.reliabilityScore);
    setCounterPrice("");
  };

  // Submit counter offer
  const handleCounterSubmit = () => {
    const numericCounter = Number(counterPrice);
    if (!numericCounter || numericCounter <= 0) return;

    const base = selectedBuyer.offeredPricePerQtl;
    if (numericCounter <= base * 1.12) {
      setOfferPrice(numericCounter);
      setNegotiationMessage(`Counter Accepted! ${selectedBuyer.companyName} automated procurement accepted your counter of ₹${numericCounter}/qtl!`);
    } else {
      const midPoint = Math.round((base + numericCounter) / 2);
      setOfferPrice(midPoint);
      setNegotiationMessage(`${selectedBuyer.companyName} countered back at ₹${midPoint}/qtl. Final agreed contract price locked.`);
    }
  };

  // Total deal calculation
  const totalDealValue = lotQuantity * offerPrice;
  const freightCost = vehicleType === "tractor" ? 1800 : vehicleType === "pickup" ? 2800 : 5400;
  const netFarmerProceeds = totalDealValue - freightCost;

  // Simulate Return / Dispute Scenarios
  const handleSimulateInspection = (scenario) => {
    if (scenario === "matched") {
      setAuditOutcome("matched");
      setFarmerTrustScore(99);
      setBuyerReliabilityScore(Math.min(99.9, buyerReliabilityScore + 0.5));
      setAuditNotes("Arrival Inspection Passed: Physical produce matches sample photo 100%. Quality parameters certified by weighbridge assayer.");
    } else if (scenario === "mismatch") {
      setAuditOutcome("mismatch_penalty");
      setFarmerTrustScore((prev) => Math.max(75, prev - 8));
      setAuditNotes("Quality Mismatch Verified: Delivered lot appearance and defect rate (6.2%) deviates significantly from uploaded sample photo. Farmer Trust Score reduced (-8 points penalty).");
    } else if (scenario === "false_claim") {
      setAuditOutcome("false_claim_penalty");
      setBuyerReliabilityScore((prev) => Math.max(70, Number((prev - 6.5).toFixed(1))));
      setAuditNotes("False Buyer Claim Caught: APMC official lab verified produce matches sample photo. Buyer rejected lot without ground. Buyer Reliability Score penalized (-6.5 points) and escrow released to farmer.");
    }
  };

  // Payment Release
  const handleReleasePayment = () => {
    const utr = `SBI-DBT-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    setReleaseTxnId(utr);
    setPaymentReleased(true);
  };

  // Print / Save
  const handlePrintDeal = () => {
    if (summaryRef.current) {
      triggerPrintDocument(summaryRef.current, `AgroVision_Contract_${selectedBuyer.companyName}`);
    } else {
      window.print();
    }
  };

  const handlePrintGatePass = () => {
    if (gatePassRef.current) {
      triggerPrintDocument(gatePassRef.current, `APMC_Transit_GatePass_${transitPassId}`);
    } else {
      window.print();
    }
  };

  const handleSaveDeal = () => {
    if (!summaryRef.current) return;
    downloadDocumentFile({
      filename: `AgroVision_SaleSettlement_${selectedBuyer.companyName.replace(/\s+/g, "_")}.html`,
      title: `e-NAM Verified Sale Settlement Note - ${selectedBuyer.companyName}`,
      contentHtml: summaryRef.current.innerHTML,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-soil-950/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl my-auto bg-white rounded-2xl shadow-2xl border border-soil-200 overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-soil-200 bg-soil-50/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-canopy-900 text-harvest-400 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-lg text-canopy-950">
                  Verified Buyer Guaranteed Sale Desk
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-signal-good/15 text-signal-good border border-signal-good/30">
                  AgriEscrow & e-NAM Protected
                </span>
              </div>
              <p className="text-xs text-soil-600">
                8-Step Certified Trade: Recommendation → Matched Buyers → Digital Offer → Sample Photo → Escrow Hold → Logistics → Same-Day Return → Payment Release.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-soil-400 hover:text-soil-800 hover:bg-soil-100 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 8-Step Breadcrumb Bar */}
        <div className="px-4 py-2.5 bg-soil-100/70 border-b border-soil-200 overflow-x-auto">
          <div className="flex items-center gap-1.5 text-[11px] font-medium min-w-max">
            {[
              { num: 1, label: "1. Recommendation" },
              { num: 2, label: "2. Matched Buyers" },
              { num: 3, label: "3. Digital Offer" },
              { num: 4, label: "4. Quality & Sample" },
              { num: 5, label: "5. Escrow Hold" },
              { num: 6, label: "6. Logistics & e-Pass" },
              { num: 7, label: "7. Delivery & Return" },
              { num: 8, label: "8. Payment & Scores" },
            ].map((step) => (
              <React.Fragment key={step.num}>
                <button
                  onClick={() => setCurrentStep(step.num)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    currentStep === step.num
                      ? "bg-canopy-900 text-white font-bold shadow-2xs"
                      : currentStep > step.num
                      ? "bg-canopy-100 text-canopy-800 font-semibold"
                      : "text-soil-500 hover:text-soil-800"
                  }`}
                >
                  {currentStep > step.num ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-signal-good" />
                  ) : (
                    <span>{step.num}.</span>
                  )}
                  <span>{step.label.replace(/^\d+\.\s*/, "")}</span>
                </button>
                {step.num < 8 && <ChevronRight className="w-3 h-3 text-soil-300 shrink-0" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Scrollable Workflow Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">

          {/* STEP 1: RECOMMENDATION & SMALL FARMER FAST-TRACK */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-display font-bold text-base text-canopy-950">
                    Step 1: AI Trade Recommendation & Small Farmer Fast-Track
                  </h3>
                  <p className="text-xs text-soil-600">
                    Market-driven recommendation optimized for crop lifespan and perishability protection.
                  </p>
                </div>

                {/* Small Farmer Fast-Track Toggle */}
                <label className="flex items-center gap-2 p-2 bg-harvest-50 border border-harvest-200 rounded-xl cursor-pointer self-start sm:self-auto">
                  <input
                    type="checkbox"
                    checked={isSmallFarmerFastTrack}
                    onChange={(e) => setIsSmallFarmerFastTrack(e.target.checked)}
                    className="w-4 h-4 accent-harvest-500 rounded"
                  />
                  <span className="text-xs font-bold text-harvest-900">
                    Smallholder Fast-Track (Same-Day Delivery & Settlement)
                  </span>
                </label>
              </div>

              {/* Perishability Warning Banner for Vegetables and Fruits */}
              {isVegetableOrFruit && (
                <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex items-start gap-3 text-xs">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="block text-sm font-bold">
                      Perishability Warning: Fresh Produce Lifespan Rule Active
                    </strong>
                    <p className="text-amber-900 leading-relaxed">
                      {selectedCropName} has an active shelf life of only <strong>3 to 5 days</strong>. Under the AgroVision Fair Trade Code, <strong>the buyer can raise return/dispute ONLY on the same day of delivery (18 hours max)</strong>. After same-day delivery, the farmer has zero liability for spoilage.
                    </p>
                  </div>
                </div>
              )}

              {/* Produce Configuration Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-soil-700 block mb-1">
                    Harvested Crop:
                  </label>
                  <select
                    value={selectedCropName}
                    onChange={(e) => handleCropChange(e.target.value)}
                    className="w-full bg-soil-50 border border-soil-300 text-soil-900 text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-none focus:border-canopy-600"
                  >
                    <option value="Tomato">Tomato / टमाटर (Perishable - Same Day Rule)</option>
                    <option value="Onion">Red Onion / प्याज (Semi-Perishable)</option>
                    <option value="Potato">Potato / आलू (Semi-Perishable Tuber)</option>
                    <option value="Cotton">Cotton / कपास (Durable Commercial Fiber)</option>
                    <option value="Wheat">Sharbati Wheat / गेहूं (Durable Cereal)</option>
                    <option value="Soybean">Soybean / सोयाबीन (Durable Oilseed)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-soil-700 block mb-1">
                    Lot Volume (Quintals):
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="1000"
                    value={lotQuantity}
                    onChange={(e) => setLotQuantity(Number(e.target.value))}
                    className="w-full bg-soil-50 border border-soil-300 text-soil-900 text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-none focus:border-canopy-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-soil-700 block mb-1">
                    Assayed Quality Grade:
                  </label>
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    className="w-full bg-soil-50 border border-soil-300 text-soil-900 text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-none focus:border-canopy-600"
                  >
                    <option value="Grade A">Grade A (AGMARK Premium)</option>
                    <option value="Grade B">Grade B (Standard Commercial)</option>
                    <option value="Grade C">Grade C (Local Fair Average)</option>
                  </select>
                </div>
              </div>

              {/* Recommendation Summary Card */}
              <div className="p-4 rounded-xl bg-soil-50 border border-soil-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-canopy-700" />
                    <span className="font-bold text-xs text-soil-900 uppercase">
                      Recommended Strategy: Direct Institutional Verified Sale
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-signal-good/15 text-signal-good border border-signal-good/30">
                    +12% vs Local Mandi Auction
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-lg border border-soil-200">
                    <span className="text-[10px] text-soil-400 block uppercase font-bold">Crop Category</span>
                    <strong className="text-soil-900 block mt-0.5">{lifespanRules.category}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-soil-200">
                    <span className="text-[10px] text-soil-400 block uppercase font-bold">Dispute / Return Window</span>
                    <strong className="text-harvest-700 block mt-0.5">
                      {isVegetableOrFruit ? "Same-Day Delivery (18h max)" : "3 to 7 Days Lifespan Window"}
                    </strong>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-soil-200">
                    <span className="text-[10px] text-soil-400 block uppercase font-bold">Safety Guarantee</span>
                    <strong className="text-signal-good block mt-0.5">100% Escrow Funded Before Loading</strong>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-canopy-900 text-white rounded-xl text-xs font-bold hover:bg-canopy-800 transition-colors shadow-xs cursor-pointer"
                >
                  <span>Matched Verified Buyers</span>
                  <ArrowRight className="w-4 h-4 text-harvest-400" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: MATCHED VERIFIED BUYERS (MANDATORY RELIABILITY & PAYMENT HISTORY) */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-display font-bold text-base text-canopy-950">
                    Step 2: Matched Verified Buyers (Mandatory Reliability & Payment Audit)
                  </h3>
                  <p className="text-xs text-soil-600">
                    Rule 4: Buyer Reliability Score + Payment History are <strong>strictly mandatory</strong> before sending any offer.
                  </p>
                </div>
                <span className="text-xs text-signal-good bg-signal-good/10 px-3 py-1 rounded-lg border border-signal-good/20 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Mandatory Audit Passed ✓
                </span>
              </div>

              {/* Buyers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {institutionalBuyers.map((buyer) => {
                  const isSelected = selectedBuyer.id === buyer.id;
                  return (
                    <div
                      key={buyer.id}
                      onClick={() => handleSelectBuyer(buyer)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? "border-2 border-canopy-800 bg-canopy-50/40 shadow-sm"
                          : "border-soil-200 bg-white hover:border-soil-300"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-sm text-soil-950">{buyer.companyName}</h4>
                              <CheckCircle2 className="w-3.5 h-3.5 text-signal-good shrink-0" />
                            </div>
                            <p className="text-xs text-soil-500">{buyer.buyerType}</p>
                            <span className="text-[10px] font-mono text-soil-400 block mt-0.5">
                              Lic #{buyer.licenseNumber}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] text-soil-400 uppercase font-bold block">
                              Reliability Score
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-signal-good/15 text-signal-good border border-signal-good/30">
                              <ShieldCheck className="w-3 h-3" />
                              {buyer.reliabilityScore}%
                            </span>
                          </div>
                        </div>

                        {/* Mandatory Payment History Record Card */}
                        <div className="p-3 rounded-xl bg-soil-50 border border-soil-200 grid grid-cols-3 gap-2 text-center text-xs">
                          <div>
                            <span className="text-[9px] uppercase text-soil-400 block font-bold">Total Settled</span>
                            <strong className="text-soil-900 text-[11px] font-mono">
                              {buyer.paymentHistory?.totalSettledVolume || "₹15+ Cr"}
                            </strong>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase text-soil-400 block font-bold">On-Time DBT</span>
                            <strong className="text-signal-good text-[11px] font-mono">
                              {buyer.paymentHistory?.onTimeSettlementRate || "99.8%"}
                            </strong>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase text-soil-400 block font-bold">Payment Default</span>
                            <strong className="text-canopy-800 text-[11px] font-mono">0.0%</strong>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className="text-soil-600">Offered Rate:</span>
                          <span className="text-harvest-700 font-bold font-mono text-base">
                            ₹{buyer.offeredPricePerQtl}/qtl
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-soil-200 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-soil-500 truncate max-w-[220px]">
                          {buyer.deliveryPoint}
                        </span>
                        <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                          isSelected ? "bg-canopy-900 text-white" : "bg-soil-100 text-soil-700"
                        }`}>
                          {isSelected ? "Selected Buyer ✓" : "Select Buyer"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-soil-700 hover:bg-soil-100 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-canopy-900 text-white rounded-xl text-xs font-bold hover:bg-canopy-800 transition-colors shadow-xs cursor-pointer"
                >
                  <span>Negotiate Digital Offer</span>
                  <ArrowRight className="w-4 h-4 text-harvest-400" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DIGITAL OFFER / COUNTER-OFFER */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h3 className="font-display font-bold text-base text-canopy-950">
                  Step 3: Digital Offer & Counter-Offer Negotiation
                </h3>
                <p className="text-xs text-soil-600">
                  Direct digital contract binding between farmer and {selectedBuyer.companyName} with zero middlemen commissions.
                </p>
              </div>

              {/* Deal Economics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-soil-50 border border-soil-200 space-y-2">
                  <span className="text-[10px] text-soil-400 uppercase font-bold block">Buyer Initial Bid</span>
                  <div className="text-2xl font-bold font-mono text-soil-950">
                    ₹{selectedBuyer.offeredPricePerQtl}
                    <span className="text-xs font-normal text-soil-500"> /qtl</span>
                  </div>
                  <p className="text-[11px] text-soil-500">APMC benchmark + {selectedGrade} premium</p>
                </div>

                <div className="p-4 rounded-xl bg-harvest-50 border border-harvest-200 space-y-2">
                  <span className="text-[10px] text-harvest-800 uppercase font-bold block">Agreed Contract Price</span>
                  <div className="text-2xl font-bold font-mono text-harvest-700">
                    ₹{offerPrice}
                    <span className="text-xs font-normal text-harvest-800"> /qtl</span>
                  </div>
                  <p className="text-[11px] text-harvest-800">
                    Total Gross Value: <strong>₹{totalDealValue.toLocaleString("en-IN")}</strong> ({lotQuantity} Qtls)
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-canopy-50 border border-canopy-200 space-y-2">
                  <span className="text-[10px] text-canopy-800 uppercase font-bold block">Farmer Net Realization</span>
                  <div className="text-2xl font-bold font-mono text-canopy-900">
                    ₹{netFarmerProceeds.toLocaleString("en-IN")}
                  </div>
                  <span className="text-[11px] font-semibold text-signal-good block">
                    Zero Brokerage / Zero Dalal Deduction
                  </span>
                </div>
              </div>

              {/* Counter-Offer Desk */}
              <div className="p-5 rounded-2xl bg-white border border-soil-200 space-y-3">
                <h4 className="font-display font-bold text-sm text-soil-950 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-canopy-700" />
                  <span>Propose Counter-Offer to Buyer</span>
                </h4>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <span className="absolute left-3.5 top-2.5 text-xs text-soil-500 font-bold">₹</span>
                    <input
                      type="number"
                      placeholder={`Counter price e.g. ${selectedBuyer.offeredPricePerQtl + 150}`}
                      value={counterPrice}
                      onChange={(e) => setCounterPrice(e.target.value)}
                      className="w-full pl-8 pr-4 py-2.5 text-xs font-semibold rounded-xl bg-soil-50 border border-soil-300 text-soil-900 focus:outline-none focus:border-canopy-600"
                    />
                  </div>
                  <button
                    onClick={handleCounterSubmit}
                    className="w-full sm:w-auto px-5 py-2.5 bg-harvest-500 text-canopy-950 font-bold rounded-xl text-xs hover:bg-harvest-400 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Counter</span>
                  </button>
                </div>

                {negotiationMessage && (
                  <div className="p-3 rounded-xl bg-signal-good/10 border border-signal-good/20 text-xs font-semibold text-signal-good flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{negotiationMessage}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-soil-700 hover:bg-soil-100 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-canopy-900 text-white rounded-xl text-xs font-bold hover:bg-canopy-800 transition-colors shadow-xs cursor-pointer"
                >
                  <span>Quality Photo & Sample Photo</span>
                  <ArrowRight className="w-4 h-4 text-harvest-400" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: QUALITY PHOTO + SAMPLE PHOTO */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h3 className="font-display font-bold text-base text-canopy-950">
                  Step 4: Quality Photo + Sample Photo & Basic Parameters
                </h3>
                <p className="text-xs text-soil-600">
                  Requirement 2: Farmer uploads bulk produce photo + one sample photo shown to the buyer. Certified Grade (A/B/C) is generated automatically.
                </p>
              </div>

              {/* Dual Photo Card Display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Actual Produce Photo */}
                <div className="p-4 rounded-xl border border-soil-200 bg-soil-50/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-soil-900">
                      1. Bulk Produce Photo (Actual Lot)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-canopy-100 text-canopy-800">
                      Bulk Harvest
                    </span>
                  </div>
                  <div className="relative aspect-16/10 rounded-xl overflow-hidden border border-soil-300 bg-soil-950">
                    <img
                      src={actualProducePhoto}
                      alt="Actual lot"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-canopy-950/80 text-white">
                      AGMARK Lot #AGM-2026-9281
                    </span>
                  </div>
                </div>

                {/* 2. Sample Photo Shown to Buyer */}
                <div className="p-4 rounded-xl border-2 border-harvest-300 bg-harvest-50/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-harvest-900 flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-harvest-600" />
                      2. Sample Photo (Shown to Buyer)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-harvest-500 text-canopy-950">
                      Buyer Reference
                    </span>
                  </div>
                  <div className="relative aspect-16/10 rounded-xl overflow-hidden border border-harvest-300 bg-soil-950">
                    <img
                      src={samplePhoto}
                      alt="Sample for buyer"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-harvest-500 text-canopy-950">
                      Verified Reference for Delivery Matching
                    </span>
                  </div>
                </div>
              </div>

              {/* 4 Basic Parameters & Quality Grade */}
              <div className="p-4 rounded-xl bg-soil-50 border border-soil-200 space-y-3">
                <span className="text-xs font-bold uppercase text-soil-700 block">
                  Basic Assayed Parameters & Calculated Grade:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-soil-200">
                    <span className="text-[10px] text-soil-400 uppercase font-bold block">Size Uniformity</span>
                    <input
                      type="text"
                      value={paramSize}
                      onChange={(e) => setParamSize(e.target.value)}
                      className="w-full mt-1 bg-soil-50 border border-soil-300 rounded px-2 py-1 font-bold text-soil-900 text-xs"
                    />
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-soil-200">
                    <span className="text-[10px] text-soil-400 uppercase font-bold block">Colour & Luster</span>
                    <input
                      type="text"
                      value={paramColour}
                      onChange={(e) => setParamColour(e.target.value)}
                      className="w-full mt-1 bg-soil-50 border border-soil-300 rounded px-2 py-1 font-bold text-soil-900 text-xs"
                    />
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-soil-200">
                    <span className="text-[10px] text-soil-400 uppercase font-bold block">Moisture %</span>
                    <input
                      type="text"
                      value={paramMoisture}
                      onChange={(e) => setParamMoisture(e.target.value)}
                      className="w-full mt-1 bg-soil-50 border border-soil-300 rounded px-2 py-1 font-bold text-soil-900 text-xs"
                    />
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-soil-200">
                    <span className="text-[10px] text-soil-400 uppercase font-bold block">Defect %</span>
                    <input
                      type="text"
                      value={paramDefect}
                      onChange={(e) => setParamDefect(e.target.value)}
                      className="w-full mt-1 bg-soil-50 border border-soil-300 rounded px-2 py-1 font-bold text-soil-900 text-xs"
                    />
                  </div>
                </div>

                {/* Calculated Grade Badge */}
                <div className="p-3 bg-canopy-900 text-white rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-harvest-400" />
                    <div>
                      <strong className="block text-xs text-harvest-300 uppercase font-mono">Assayed Quality Grade</strong>
                      <span className="text-base font-bold font-display">{qualityGrade} (Certified for Buyer Match)</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-signal-good/20 text-signal-good border border-signal-good/40 text-xs font-bold">
                    Sample Photo Locked ✓
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-soil-700 hover:bg-soil-100 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setCurrentStep(5)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-canopy-900 text-white rounded-xl text-xs font-bold hover:bg-canopy-800 transition-colors shadow-xs cursor-pointer"
                >
                  <span>Verify Escrow Payment Hold</span>
                  <ArrowRight className="w-4 h-4 text-harvest-400" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: ESCROW PAYMENT HOLD */}
          {currentStep === 5 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h3 className="font-display font-bold text-base text-canopy-950">
                  Step 5: Escrow-Style Payment Hold (100% Guaranteed Before Loading)
                </h3>
                <p className="text-xs text-soil-600">
                  Before you load your produce or book transport, {selectedBuyer.companyName} deposits the full contract sum into SBI / e-NAM AgriEscrow.
                </p>
              </div>

              {/* Escrow Certificate Card */}
              <div className="p-6 rounded-2xl bg-canopy-950 text-white border border-canopy-800 shadow-md space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-canopy-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-canopy-800 text-harvest-400 flex items-center justify-center">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-harvest-400 uppercase font-bold tracking-wider">
                        AGRIESCROW DIGITAL PAYMENT HOLD
                      </span>
                      <h4 className="font-display font-bold text-xl text-white">
                        ₹{totalDealValue.toLocaleString("en-IN")} Locked in Escrow
                      </h4>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-signal-good/20 text-signal-good border border-signal-good/40 self-start sm:self-auto">
                    Status: 100% Funded & Verified ✓
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-canopy-900/80 rounded-xl border border-canopy-800">
                    <span className="text-[10px] text-soil-400 uppercase block font-bold">Escrow Reference</span>
                    <span className="font-mono font-bold text-harvest-300">{escrowTxnId}</span>
                  </div>
                  <div className="p-3 bg-canopy-900/80 rounded-xl border border-canopy-800">
                    <span className="text-[10px] text-soil-400 uppercase block font-bold">Guarantor Bank</span>
                    <span className="font-bold text-white">State Bank of India (e-NAM)</span>
                  </div>
                  <div className="p-3 bg-canopy-900/80 rounded-xl border border-canopy-800">
                    <span className="text-[10px] text-soil-400 uppercase block font-bold">Beneficiary Farmer</span>
                    <span className="font-bold text-white">{currentUser?.name || "Farmer"}</span>
                  </div>
                  <div className="p-3 bg-canopy-900/80 rounded-xl border border-canopy-800">
                    <span className="text-[10px] text-soil-400 uppercase block font-bold">Release Condition</span>
                    <span className="font-bold text-white">Weighbridge Receipt Check</span>
                  </div>
                </div>

                <p className="text-xs text-soil-300">
                  🛡️ <strong>Safety Guarantee:</strong> Once the escrow hold is generated, the buyer cannot withdraw funds while produce is in transit.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setCurrentStep(4)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-soil-700 hover:bg-soil-100 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setCurrentStep(6)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-canopy-900 text-white rounded-xl text-xs font-bold hover:bg-canopy-800 transition-colors shadow-xs cursor-pointer"
                >
                  <span>Proceed to Logistics & e-Pass</span>
                  <ArrowRight className="w-4 h-4 text-harvest-400" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: LOGISTICS BOOKING + DIGITAL TRANSIT E-PASS */}
          {currentStep === 6 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h3 className="font-display font-bold text-base text-canopy-950">
                  Step 6: Logistics Booking & Electronic Transit Gate Pass
                </h3>
                <p className="text-xs text-soil-600">
                  Book verified transport and generate a toll-free electronic gate pass for green-channel terminal entry.
                </p>
              </div>

              {/* Vehicle selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: "tractor", name: "Tractor Trolley", capacity: "Up to 50 Qtls", price: 1800, driver: "Raju Bhai (GJ-07-TR-4491)" },
                  { id: "pickup", name: "Bolero / Pickup Maxx", capacity: "Up to 80 Qtls", price: 2800, driver: "Mahesh Rabari (GJ-23-PK-8812)" },
                  { id: "truck", name: "10-Wheeler Eicher Truck", capacity: "Up to 220 Qtls", price: 5400, driver: "Suresh Patel (GJ-01-TK-9021)" },
                ].map((v) => (
                  <div
                    key={v.id}
                    onClick={() => setVehicleType(v.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      vehicleType === v.id
                        ? "border-2 border-canopy-800 bg-canopy-50/40 shadow-xs"
                        : "border-soil-200 bg-white hover:border-soil-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Truck className="w-5 h-5 text-canopy-800" />
                      <span className="font-bold text-xs text-canopy-950 font-mono">₹{v.price}</span>
                    </div>
                    <h5 className="font-bold text-xs text-soil-950">{v.name}</h5>
                    <p className="text-[11px] text-soil-500">{v.capacity}</p>
                    <p className="text-[10px] text-canopy-700 font-medium mt-1">Driver: {v.driver}</p>
                  </div>
                ))}
              </div>

              {/* Printable Electronic Transit Gate Pass */}
              <div
                ref={gatePassRef}
                className="p-5 rounded-2xl bg-white border border-soil-300 shadow-xs space-y-3 text-xs text-soil-950"
              >
                <div className="flex items-start justify-between border-b pb-3 border-soil-200">
                  <div>
                    <span className="text-[10px] font-mono text-canopy-800 font-bold uppercase block">
                      APMC Green Channel • Electronic Transit Gate Pass
                    </span>
                    <h4 className="font-display font-bold text-base text-soil-950">
                      Gate Pass #{transitPassId}
                    </h4>
                    <span className="text-[11px] text-soil-500">
                      Destination: {selectedBuyer.deliveryPoint}
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-signal-good/15 text-signal-good font-bold text-xs">
                    Toll & Checkpost Exempt ✓
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-soil-50 rounded-xl">
                  <div>
                    <span className="text-[9px] text-soil-400 font-bold uppercase block">Farmer</span>
                    <strong className="text-soil-900">{currentUser?.name || "Farmer"}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-soil-400 font-bold uppercase block">Commodity</span>
                    <strong className="text-soil-900">{selectedCropName} ({lotQuantity} Qtls)</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-soil-400 font-bold uppercase block">Assayed Grade</span>
                    <strong className="text-signal-good">{qualityGrade}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-soil-400 font-bold uppercase block">Verified Buyer</span>
                    <strong className="text-soil-900">{selectedBuyer.companyName}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={handlePrintGatePass}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-soil-100 hover:bg-soil-200 text-soil-800 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Gate Pass</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setCurrentStep(5)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-soil-700 hover:bg-soil-100 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setCurrentStep(7)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-canopy-900 text-white rounded-xl text-xs font-bold hover:bg-canopy-800 transition-colors shadow-xs cursor-pointer"
                >
                  <span>Delivery & Return Policy Check</span>
                  <ArrowRight className="w-4 h-4 text-harvest-400" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 7: DELIVERY & RETURN WINDOW + DISPUTE PENALTIES */}
          {currentStep === 7 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h3 className="font-display font-bold text-base text-canopy-950">
                  Step 7: Delivery & Lifespan Return Window (Dispute Policy Simulation)
                </h3>
                <p className="text-xs text-soil-600">
                  Requirement 3: Vegetables/Fruits have strict same-day return. If produce mismatches sample photo → Farmer Trust Score reduced. If buyer makes false claim → Buyer Reliability Score reduced.
                </p>
              </div>

              {/* Policy Card */}
              <div className="p-4 rounded-xl bg-soil-50 border border-soil-200 space-y-3">
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-bold uppercase text-soil-900">
                    Binding Lifespan Return Conditions: {lifespanRules.category}
                  </strong>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-harvest-100 text-harvest-800">
                    {isVegetableOrFruit ? "Same-Day Delivery Inspection Only" : "3-7 Days Lifespan Window"}
                  </span>
                </div>
                <p className="text-xs text-soil-700">
                  {isVegetableOrFruit
                    ? "Buyer can raise return/dispute ONLY on the same day of delivery (18h max). After midnight of delivery day, it is NOT the farmer’s responsibility."
                    : "Standard crop shelf-life window applies (3-7 days). Rejection valid only if independent APMC assayer confirms parameter failure."}
                </p>
              </div>

              {/* Interactive Simulation Desk */}
              <div className="p-5 rounded-2xl bg-white border-2 border-soil-300 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-sm text-soil-950 flex items-center gap-2">
                    <Scale className="w-4 h-4 text-canopy-700" />
                    <span>Simulate Terminal Arrival Inspection & Dispute Rules:</span>
                  </h4>
                  <span className="text-[11px] text-soil-500">Test Rule 3 Outcomes</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Scenario A */}
                  <button
                    onClick={() => handleSimulateInspection("matched")}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      auditOutcome === "matched"
                        ? "border-2 border-signal-good bg-signal-good/10 shadow-xs"
                        : "border-soil-200 hover:border-soil-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-xs text-signal-good">A. Matches Sample Photo</strong>
                      <CheckCircle2 className="w-4 h-4 text-signal-good" />
                    </div>
                    <p className="text-[11px] text-soil-600">
                      Delivered lot conforms to sample photo. Both trust scores increase!
                    </p>
                  </button>

                  {/* Scenario B */}
                  <button
                    onClick={() => handleSimulateInspection("mismatch")}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      auditOutcome === "mismatch_penalty"
                        ? "border-2 border-signal-bad bg-signal-bad/10 shadow-xs"
                        : "border-soil-200 hover:border-soil-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-xs text-signal-bad">B. Sample Mismatch Claim</strong>
                      <AlertTriangle className="w-4 h-4 text-signal-bad" />
                    </div>
                    <p className="text-[11px] text-soil-600">
                      Produce deviates from sample photo. <strong>Farmer Trust Score Reduced</strong>.
                    </p>
                  </button>

                  {/* Scenario C */}
                  <button
                    onClick={() => handleSimulateInspection("false_claim")}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      auditOutcome === "false_claim_penalty"
                        ? "border-2 border-amber-500 bg-amber-50 shadow-xs"
                        : "border-soil-200 hover:border-soil-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-xs text-amber-700">C. Buyer False Claim</strong>
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                    </div>
                    <p className="text-[11px] text-soil-600">
                      Buyer claims false defect. <strong>Buyer Reliability Score Reduced</strong>.
                    </p>
                  </button>
                </div>

                {/* Audit Outcome Banner */}
                {auditNotes && (
                  <div className={`p-3.5 rounded-xl text-xs font-medium animate-fadeIn ${
                    auditOutcome === "matched"
                      ? "bg-signal-good/10 text-signal-good border border-signal-good/20"
                      : auditOutcome === "mismatch_penalty"
                      ? "bg-signal-bad/10 text-signal-bad border border-signal-bad/20"
                      : "bg-amber-100 text-amber-900 border border-amber-300"
                  }`}>
                    {auditNotes}
                  </div>
                )}

                {/* Live Scores Panel */}
                <div className="p-3 bg-soil-50 rounded-xl border border-soil-200 grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-soil-200">
                    <div>
                      <span className="text-[10px] text-soil-400 uppercase font-bold block">Farmer Trust Score</span>
                      <strong className="text-sm font-mono text-soil-950">{farmerTrustScore}%</strong>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      farmerTrustScore >= 95 ? "bg-signal-good/15 text-signal-good" : "bg-signal-bad/15 text-signal-bad"
                    }`}>
                      {farmerTrustScore >= 95 ? "Excellent Tier" : "Audit Marked"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-soil-200">
                    <div>
                      <span className="text-[10px] text-soil-400 uppercase font-bold block">Buyer Reliability Score</span>
                      <strong className="text-sm font-mono text-soil-950">{buyerReliabilityScore}%</strong>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      buyerReliabilityScore >= 95 ? "bg-signal-good/15 text-signal-good" : "bg-amber-100 text-amber-900"
                    }`}>
                      {buyerReliabilityScore >= 95 ? "Verified Corporate" : "Penalty Logged"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setCurrentStep(6)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-soil-700 hover:bg-soil-100 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setCurrentStep(8)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-canopy-900 text-white rounded-xl text-xs font-bold hover:bg-canopy-800 transition-colors shadow-xs cursor-pointer"
                >
                  <span>Release Payment & Update Scores</span>
                  <ArrowRight className="w-4 h-4 text-harvest-400" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 8: PAYMENT RELEASE & SCORE UPDATE */}
          {currentStep === 8 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h3 className="font-display font-bold text-base text-canopy-950">
                  Step 8: Escrow Payment Release & Score Update
                </h3>
                <p className="text-xs text-soil-600">
                  Direct DBT transferred immediately to farmer bank account upon delivery confirmation.
                </p>
              </div>

              {saveSuccess && (
                <div className="p-3 bg-canopy-50 border border-canopy-200 text-canopy-900 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-signal-good" />
                  <span>Settlement Note saved and downloaded successfully!</span>
                </div>
              )}

              {/* Final Settlement Statement */}
              <div
                ref={summaryRef}
                className="p-6 rounded-2xl bg-white border border-soil-200 shadow-xs space-y-4 text-xs text-soil-950"
              >
                <div className="flex items-start justify-between border-b-2 border-soil-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-canopy-800 block">
                      National Agriculture Market (e-NAM) • Electronic Settlement Certificate
                    </span>
                    <h4 className="font-display font-bold text-lg text-soil-950">
                      Direct Verified Sale Settlement Note
                    </h4>
                    <p className="text-soil-600 text-[11px]">
                      Contract Ref: #{escrowTxnId} • Date: {new Date().toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-soil-400 block">Net Realized Payout</span>
                    <span className="font-display font-bold text-2xl text-canopy-900">
                      ₹{netFarmerProceeds.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] text-signal-good block font-semibold">100% Direct to Bank</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-soil-50 rounded-xl border border-soil-200">
                  <div>
                    <span className="text-[9px] text-soil-400 block font-bold">FARMER BENEFICIARY</span>
                    <span className="font-bold text-soil-900">{currentUser?.name || "Farmer"}</span>
                    <span className="text-[10px] text-soil-500 block font-mono">Trust Score: {farmerTrustScore}%</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-soil-400 block font-bold">VERIFIED BUYER</span>
                    <span className="font-bold text-soil-900">{selectedBuyer.companyName}</span>
                    <span className="text-[10px] text-soil-500 block font-mono">Reliability: {buyerReliabilityScore}%</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-soil-400 block font-bold">COMMODITY & GRADE</span>
                    <span className="font-bold text-soil-900">{selectedCropName} ({lotQuantity} Qtls)</span>
                    <span className="text-[10px] text-signal-good block font-semibold">{qualityGrade}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-soil-400 block font-bold">LIFESPAN RETURN RULE</span>
                    <span className="font-bold text-harvest-700">
                      {isVegetableOrFruit ? "Same-Day Delivery Only" : "3-7 Days Window"}
                    </span>
                    <span className="text-[10px] text-soil-500 block">{lifespanRules.category}</span>
                  </div>
                </div>

                {/* Payment Release Status */}
                {paymentReleased ? (
                  <div className="p-4 rounded-xl bg-signal-good/10 border border-signal-good/30 text-signal-good space-y-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      <strong className="text-sm">Escrow Funds Successfully Credited via Direct DBT!</strong>
                    </div>
                    <p className="text-xs text-soil-700">
                      Bank Transaction UTR: <span className="font-mono font-bold text-soil-950">{releaseTxnId}</span>. Payout of ₹{netFarmerProceeds.toLocaleString("en-IN")} deposited directly into farmer bank account.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-harvest-50 border border-harvest-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 text-xs text-harvest-900">
                      <Scale className="w-5 h-5 text-harvest-700 shrink-0" />
                      <div>
                        <strong>Delivery & Sample Photo Match Confirmed ✓</strong>
                        <p className="text-[11px] text-soil-600">
                          {selectedBuyer.companyName} signed off on weighbridge receipt. Escrow funds ready for instant release.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleReleasePayment}
                      className="w-full sm:w-auto px-5 py-2.5 bg-signal-good hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer shrink-0"
                    >
                      Release Escrow Payment Now (₹{netFarmerProceeds.toLocaleString("en-IN")})
                    </button>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveDeal}
                    className="flex items-center gap-1.5 px-4 py-2 bg-canopy-900 text-white rounded-xl text-xs font-semibold hover:bg-canopy-800 transition-colors shadow-2xs cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-harvest-400" />
                    <span>Save / Download Settlement Note</span>
                  </button>
                  <button
                    onClick={handlePrintDeal}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white border border-soil-300 text-soil-800 rounded-xl text-xs font-semibold hover:bg-soil-100 transition-colors shadow-2xs cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-soil-600" />
                    <span>Print Settlement</span>
                  </button>
                </div>

                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-soil-200 text-soil-800 rounded-xl text-xs font-bold hover:bg-soil-300 cursor-pointer"
                >
                  Close & Return to Dashboard
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
