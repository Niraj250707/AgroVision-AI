import React, { useState } from "react";
import {
  Users,
  Briefcase,
  ShieldAlert,
  Award,
  DollarSign,
  Layers
} from "lucide-react";
import { useApp } from "../../store/AppContext";

export default function RoleDashboardOverlay() {
  const { currentRole, currentUser, openGradingModal, openCertificate } = useApp();

  // Escrow simulation state for buyer
  const [escrowStatus, setEscrowStatus] = useState("Escrow Active (₹12,25,000 locked)");
  const [hasReleasedPayment, setHasReleasedPayment] = useState(false);

  if (currentRole === "farmer") {
    // Normal farmer view is already handled in Dashboard.jsx
    return null;
  }

  /* -------------------------------------------------------------
     FPO (Farmer Producer Organisation) View
     ------------------------------------------------------------- */
  if (currentRole === "fpo") {
    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Role Header Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 to-canopy-950 text-white shadow-md border border-blue-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-blue-500/20 text-blue-200 border border-blue-400/30">
                  SIH26132 • FPO COLLECTIVE AGGREGATION
                </span>
                <span className="text-xs text-blue-200">
                  e-NAM FPO License: {currentUser.enamId}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
                {currentUser.roleTitle}
              </h2>
              <p className="text-xs sm:text-sm text-blue-200/90 mt-1">
                Aggregating produce from 142 member farmers across Niphad & Dindori clusters.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => openGradingModal()}
                className="px-4 py-2 rounded-xl bg-harvest-500 hover:bg-harvest-400 text-canopy-950 font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
              >
                <Award className="w-4 h-4" />
                <span>Bulk Lot Quality Certification</span>
              </button>
            </div>
          </div>
        </div>

        {/* FPO High-Level Aggregation Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-soil-200 shadow-2xs">
            <div className="flex items-center justify-between text-soil-500 mb-2">
              <span className="text-xs font-semibold uppercase">Total Pooled Produce</span>
              <Layers className="w-4 h-4 text-blue-600" />
            </div>
            <div className="font-display font-bold text-2xl text-soil-950">
              4,850 Quintals
            </div>
            <div className="text-[11px] text-signal-good font-medium mt-1">
              +620 Qtl added this week (Onion & Soybean)
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-soil-200 shadow-2xs">
            <div className="flex items-center justify-between text-soil-500 mb-2">
              <span className="text-xs font-semibold uppercase">Active Member Farmers</span>
              <Users className="w-4 h-4 text-canopy-700" />
            </div>
            <div className="font-display font-bold text-2xl text-soil-950">
              142 Smallholders
            </div>
            <div className="text-[11px] text-soil-500 font-medium mt-1">
              Average holding: 2.8 Acres / farmer
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-soil-200 shadow-2xs">
            <div className="flex items-center justify-between text-soil-500 mb-2">
              <span className="text-xs font-semibold uppercase">WDRA Warehouse Credit</span>
              <DollarSign className="w-4 h-4 text-harvest-600" />
            </div>
            <div className="font-display font-bold text-2xl text-soil-950">
              ₹28,50,000
            </div>
            <div className="text-[11px] text-signal-good font-medium mt-1">
              70% e-NWR pledge loan @ 7% p.a.
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-soil-200 shadow-2xs">
            <div className="flex items-center justify-between text-soil-500 mb-2">
              <span className="text-xs font-semibold uppercase">Institutional Bulk Demand</span>
              <Briefcase className="w-4 h-4 text-purple-600" />
            </div>
            <div className="font-display font-bold text-2xl text-soil-950">
              3 Direct Tenders
            </div>
            <div className="text-[11px] text-canopy-800 font-semibold mt-1">
              Avg premium: +14% over APMC spot
            </div>
          </div>
        </div>

        {/* Aggregated Lots Table */}
        <div className="bg-white rounded-2xl border border-soil-200 shadow-2xs overflow-hidden">
          <div className="p-4 bg-soil-50 border-b border-soil-200 flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-sm text-soil-950">
                Member Farmer Pooled Lots for e-NAM Auction
              </h3>
              <p className="text-xs text-soil-500">
                Quality homogenized lots ready for bulk processor bidding
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              4 Lots Active
            </span>
          </div>

          <div className="divide-y divide-soil-100 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-soil-50/50 text-[10px] uppercase font-mono text-soil-500 tracking-wider">
                <tr>
                  <th className="p-3">Lot ID & Commodity</th>
                  <th className="p-3">Contributing Farmers</th>
                  <th className="p-3">Total Quantity</th>
                  <th className="p-3">AGMARK Score</th>
                  <th className="p-3">Storage Location</th>
                  <th className="p-3">Highest Bid</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soil-100">
                <tr className="hover:bg-soil-50/50">
                  <td className="p-3 font-semibold text-soil-900">
                    <div>#FPO-LOT-ON-01</div>
                    <div className="text-[10px] text-soil-500 font-normal">Nashik Red Onion (Cured)</div>
                  </td>
                  <td className="p-3 text-soil-600">38 Smallholders</td>
                  <td className="p-3 font-bold text-soil-900">1,200 Quintals</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-signal-good/15 text-signal-good">
                      94/100 (Grade A)
                    </span>
                  </td>
                  <td className="p-3 text-soil-600">Pimpalgaon WDRA Silo #4</td>
                  <td className="p-3 font-bold text-canopy-900">₹2,480 / Qtl</td>
                  <td className="p-3">
                    <button
                      onClick={() =>
                        openCertificate({
                          lotId: "FPO-LOT-ON-01",
                          crop: "Nashik Red Onion",
                          grade: "A",
                          qualityScore: 94,
                          farmerName: currentUser.roleTitle,
                          state: currentUser.state,
                          moisture: "10.4%",
                          defectRate: "1.8%",
                        })
                      }
                      className="px-2.5 py-1 rounded-lg bg-canopy-100 hover:bg-canopy-200 text-canopy-900 font-bold text-[11px] transition-colors"
                    >
                      View Certificate
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-soil-50/50">
                  <td className="p-3 font-semibold text-soil-900">
                    <div>#FPO-LOT-SOY-04</div>
                    <div className="text-[10px] text-soil-500 font-normal">Yellow Soybean (Bold)</div>
                  </td>
                  <td className="p-3 text-soil-600">54 Smallholders</td>
                  <td className="p-3 font-bold text-soil-900">2,400 Quintals</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-signal-good/15 text-signal-good">
                      91/100 (Grade A)
                    </span>
                  </td>
                  <td className="p-3 text-soil-600">Niphad Central Godown</td>
                  <td className="p-3 font-bold text-canopy-900">₹5,180 / Qtl</td>
                  <td className="p-3">
                    <button
                      onClick={() =>
                        openCertificate({
                          lotId: "FPO-LOT-SOY-04",
                          crop: "Yellow Soybean",
                          grade: "A",
                          qualityScore: 91,
                          farmerName: currentUser.roleTitle,
                          state: currentUser.state,
                          moisture: "9.2%",
                          defectRate: "2.1%",
                        })
                      }
                      className="px-2.5 py-1 rounded-lg bg-canopy-100 hover:bg-canopy-200 text-canopy-900 font-bold text-[11px] transition-colors"
                    >
                      View Certificate
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     BUYER (Processors, Millers & Exporters) View
     ------------------------------------------------------------- */
  if (currentRole === "buyer") {
    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Role Header Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950 via-soil-900 to-canopy-950 text-white shadow-md border border-amber-900/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  SIH26132 • DIRECT BUYER PROCUREMENT PORTAL
                </span>
                <span className="text-xs text-amber-200">
                  Buyer Reg: {currentUser.enamId}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
                {currentUser.roleTitle}
              </h2>
              <p className="text-xs sm:text-sm text-soil-300 mt-1">
                Verified farm-gate and FPO lot discovery with instant AGMARK quality verification and digital escrow.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 text-xs">
              <div className="text-[10px] text-amber-300 font-mono">DIGITAL ESCROW FACILITY</div>
              <div className="font-bold text-white text-sm mt-0.5">₹2,50,00,000 Active Line</div>
            </div>
          </div>
        </div>

        {/* Buyer Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-soil-200 shadow-2xs">
            <div className="text-xs text-soil-500 font-medium">Ready Grade A Lots Nearby</div>
            <div className="font-display font-bold text-2xl text-soil-950 mt-1">18 Verified Lots</div>
            <div className="text-[11px] text-signal-good font-semibold mt-1">Within 150 km radius</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-soil-200 shadow-2xs">
            <div className="text-xs text-soil-500 font-medium">Monthly Procurement Fulfilled</div>
            <div className="font-display font-bold text-2xl text-soil-950 mt-1">1,450 / 2,000 MT</div>
            <div className="text-[11px] text-canopy-800 font-semibold mt-1">72.5% Target achieved</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-soil-200 shadow-2xs">
            <div className="text-xs text-soil-500 font-medium">Escrow Settlement Status</div>
            <div className="font-display font-bold text-lg text-soil-950 mt-1 truncate">{escrowStatus}</div>
            <div className="text-[11px] text-soil-500 mt-1">Auto-release upon weighbridge verification</div>
          </div>
        </div>

        {/* Verified Farmer & FPO Lots for Immediate Purchase */}
        <div className="bg-white rounded-2xl border border-soil-200 shadow-2xs overflow-hidden">
          <div className="p-4 bg-soil-50 border-b border-soil-200 flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-sm text-soil-950">
                Direct Farmer & FPO Supply Catalogue (Verified Lots)
              </h3>
              <p className="text-xs text-soil-500">
                100% Computer-vision certified lots with tamper-proof certificates
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-soil-500">Filter: Grade A Only</span>
            </div>
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Lot 1 */}
            <div className="p-4 rounded-xl border border-soil-200 bg-white hover:border-canopy-600 transition-colors space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-signal-good/15 text-signal-good">
                    AGMARK GRADE A
                  </span>
                  <h4 className="font-display font-bold text-base text-soil-950 mt-1">
                    Cotton Shankar-6 (Gin Cleaned)
                  </h4>
                  <p className="text-xs text-soil-500">Producer: Ramesh Patel • Petlad, Anand</p>
                </div>
                <div className="text-right">
                  <div className="font-display font-bold text-lg text-canopy-900">₹7,850/Qtl</div>
                  <div className="text-[10px] text-soil-400">Asking Price</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-lg bg-soil-50 text-xs">
                <div>
                  <span className="text-[10px] text-soil-400 block">Available</span>
                  <span className="font-bold text-soil-900">120 Qtl</span>
                </div>
                <div>
                  <span className="text-[10px] text-soil-400 block">Moisture</span>
                  <span className="font-bold text-soil-900">7.2%</span>
                </div>
                <div>
                  <span className="text-[10px] text-soil-400 block">Distance</span>
                  <span className="font-bold text-soil-900">38 km</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() =>
                    openCertificate({
                      lotId: "AGM-COT-9921",
                      crop: "Cotton Shankar-6",
                      grade: "A",
                      qualityScore: 94,
                      farmerName: "Ramesh Patel",
                      state: "Gujarat",
                      moisture: "7.2%",
                      defectRate: "1.4%",
                    })
                  }
                  className="flex-1 py-2 px-3 rounded-xl border border-soil-200 hover:bg-soil-50 text-soil-800 text-xs font-bold text-center transition-colors"
                >
                  Verify Certificate
                </button>
                <button
                  onClick={() => {
                    setHasReleasedPayment(true);
                    setEscrowStatus("Escrow Released to Ramesh Patel (₹9,42,000)");
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-canopy-900 hover:bg-canopy-800 text-white text-xs font-bold text-center transition-colors shadow-2xs"
                >
                  {hasReleasedPayment ? "Escrow Funded ✓" : "Lock Lot & Issue Escrow"}
                </button>
              </div>
            </div>

            {/* Lot 2 */}
            <div className="p-4 rounded-xl border border-soil-200 bg-white hover:border-canopy-600 transition-colors space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-signal-good/15 text-signal-good">
                    AGMARK GRADE A
                  </span>
                  <h4 className="font-display font-bold text-base text-soil-950 mt-1">
                    Red Onion (Cured & Graded)
                  </h4>
                  <p className="text-xs text-soil-500">Producer: Sahyadri Kisan Producer Co. (FPO)</p>
                </div>
                <div className="text-right">
                  <div className="font-display font-bold text-lg text-canopy-900">₹2,450/Qtl</div>
                  <div className="text-[10px] text-soil-400">Asking Price</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-lg bg-soil-50 text-xs">
                <div>
                  <span className="text-[10px] text-soil-400 block">Available</span>
                  <span className="font-bold text-soil-900">1,200 Qtl</span>
                </div>
                <div>
                  <span className="text-[10px] text-soil-400 block">Moisture</span>
                  <span className="font-bold text-soil-900">10.4%</span>
                </div>
                <div>
                  <span className="text-[10px] text-soil-400 block">Distance</span>
                  <span className="font-bold text-soil-900">220 km (Rail)</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() =>
                    openCertificate({
                      lotId: "FPO-LOT-ON-01",
                      crop: "Nashik Red Onion",
                      grade: "A",
                      qualityScore: 94,
                      farmerName: "Sahyadri FPO",
                      state: "Maharashtra",
                      moisture: "10.4%",
                      defectRate: "1.8%",
                    })
                  }
                  className="flex-1 py-2 px-3 rounded-xl border border-soil-200 hover:bg-soil-50 text-soil-800 text-xs font-bold text-center transition-colors"
                >
                  Verify Certificate
                </button>
                <button
                  onClick={() => {
                    alert("Contract Purchase Order #PO-2026-891 sent to FPO with Gate-Pickup terms.");
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-canopy-900 hover:bg-canopy-800 text-white text-xs font-bold text-center transition-colors shadow-2xs"
                >
                  Send Purchase Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     ADMIN / GOVT OFFICIAL VIEW
     ------------------------------------------------------------- */
  if (currentRole === "admin") {
    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Role Header Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950 via-soil-950 to-canopy-950 text-white shadow-md border border-purple-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-purple-500/20 text-purple-200 border border-purple-400/30">
                  SIH26132 • APMC & STATE MARKETING BOARD MONITORING
                </span>
                <span className="text-xs text-purple-200">
                  Nodal Authority: Directorate of Agricultural Marketing
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
                {currentUser.roleTitle}
              </h2>
              <p className="text-xs sm:text-sm text-purple-200/90 mt-1">
                Real-time price discovery oversight, Minimum Support Price (MSP) enforcement, and farmer grievance redressal.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal-good opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-signal-good" />
              </span>
              <span className="text-xs font-mono text-purple-200 font-semibold">
                184 Mandis Reporting Live
              </span>
            </div>
          </div>
        </div>

        {/* Admin Monitoring Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-soil-200 shadow-2xs">
            <div className="text-xs text-soil-500 font-medium">Daily State Mandi Arrival</div>
            <div className="font-display font-bold text-2xl text-soil-950 mt-1">48,290 MT</div>
            <div className="text-[11px] text-signal-good font-semibold mt-1">Across 184 regulated yards</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-soil-200 shadow-2xs">
            <div className="text-xs text-soil-500 font-medium">MSP Floor Compliance</div>
            <div className="font-display font-bold text-2xl text-soil-950 mt-1">98.8%</div>
            <div className="text-[11px] text-signal-good font-semibold mt-1">2 Mandis flagged for audit</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-soil-200 shadow-2xs">
            <div className="text-xs text-soil-500 font-medium">Active e-NAM Lots</div>
            <div className="font-display font-bold text-2xl text-soil-950 mt-1">3,410 Lots</div>
            <div className="text-[11px] text-canopy-800 font-semibold mt-1">₹84.6 Cr trade volume</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-soil-200 shadow-2xs">
            <div className="text-xs text-soil-500 font-medium">Freight Subsidy Claims</div>
            <div className="font-display font-bold text-2xl text-soil-950 mt-1">₹4.2 Cr Disbursed</div>
            <div className="text-[11px] text-purple-700 font-semibold mt-1">Operation Greens 50% freight</div>
          </div>
        </div>

        {/* MSP Floor Vigilance & Flagged Violations */}
        <div className="bg-white rounded-2xl border border-soil-200 shadow-2xs overflow-hidden">
          <div className="p-4 bg-soil-50 border-b border-soil-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-signal-bad" />
              <div>
                <h3 className="font-display font-bold text-sm text-soil-950">
                  Automated MSP Violation & Grievance Alert Console
                </h3>
                <p className="text-xs text-soil-500">
                  Immediate alerts when bids fall below statutory Minimum Support Price
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-signal-bad/15 text-signal-bad">
              1 Active Alert Under Review
            </span>
          </div>

          <div className="p-4 space-y-3">
            <div className="p-3.5 rounded-xl border border-signal-bad/30 bg-signal-bad/5 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-signal-bad text-white">
                    MSP DEFICIT DETECTED
                  </span>
                  <span className="text-xs font-bold text-soil-900">
                    Borsad Sub-yard (Cotton Auction)
                  </span>
                </div>
                <p className="text-xs text-soil-700">
                  Trader syndicate attempted bid at ₹6,850/Qtl (MSP is ₹7,521/Qtl). Automated trade pause triggered. APMC Secretary notified for physical inspection.
                </p>
              </div>
              <button
                onClick={() => alert("Statutory warning and formal show-cause notice dispatched to Borsad APMC Commission Agents.")}
                className="px-3 py-1.5 rounded-lg bg-soil-900 hover:bg-soil-800 text-white font-bold text-xs whitespace-nowrap"
              >
                Issue Show-Cause Notice
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
