import React, { useState } from "react";
import {
  Plus,
  Camera,
  CheckCircle2,
  X
} from "lucide-react";
import { useApp } from "../store/AppContext";

export default function CropOverview() {
  const { t, crops, addCrop, openGradingModal } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New batch form state
  const [formData, setFormData] = useState({
    name: "Red Onion",
    cropType: "Onion",
    variety: "Nashik Red",
    quantity: 50,
    storageLocation: "Farm Store",
    baseMandiPrice: 2400,
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const potential = Math.round(Number(formData.baseMandiPrice) * 1.12);
    const qty = Number(formData.quantity);
    addCrop({
      name: formData.name,
      cropType: formData.cropType,
      variety: formData.variety,
      quantity: qty,
      harvestDate: new Date().toISOString().split("T")[0],
      storageLocation: formData.storageLocation,
      qualityGrade: "Grade A",
      qualityScore: 90,
      moisture: "10.2%",
      status: "Graded & Ready",
      baseMandiPrice: Number(formData.baseMandiPrice),
      potentialPrice: potential,
      estimatedTotal: qty * potential,
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-soil-200">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-canopy-950 tracking-tight">
            {t("myCropsTitle")}
          </h1>
          <p className="text-xs sm:text-sm text-soil-600 mt-1">
            Track harvested inventory, link AGMARK quality grades, and unlock peak net market realization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openGradingModal()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-harvest-500 hover:bg-harvest-400 text-canopy-950 font-bold text-xs shadow-sm transition-all active:scale-95"
          >
            <Camera className="w-4 h-4" />
            <span>{t("gradeProduceButton")}</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-canopy-900 hover:bg-canopy-800 text-white font-bold text-xs shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t("addCrop")}</span>
          </button>
        </div>
      </div>

      {/* Crop Lots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {crops.map((crop) => (
          <div
            key={crop.id}
            className="p-5 rounded-2xl bg-white border border-soil-200 hover:border-canopy-600/50 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg text-canopy-950">
                    {crop.name}
                  </h3>
                  <p className="text-xs text-soil-500">
                    {crop.variety} • Harvested {crop.harvestDate}
                  </p>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    crop.qualityGrade === "Grade A"
                      ? "bg-signal-good/15 text-signal-good border border-signal-good/30"
                      : "bg-harvest-100 text-harvest-600 border border-harvest-400/40"
                  }`}
                >
                  {crop.qualityGrade || "Needs Grading"}
                </span>
              </div>

              {/* Metric stats */}
              <div className="grid grid-cols-2 gap-2 p-3 bg-soil-50 rounded-xl text-xs">
                <div>
                  <span className="text-[10px] text-soil-500 uppercase block">Lot Size</span>
                  <span className="font-bold text-soil-900 text-sm">{crop.quantity} Quintals</span>
                </div>
                <div>
                  <span className="text-[10px] text-soil-500 uppercase block">Moisture Index</span>
                  <span className="font-bold text-soil-900 text-sm">{crop.moisture || "Uninspected"}</span>
                </div>
                <div className="col-span-2 pt-1 border-t border-soil-200/60 flex items-center justify-between">
                  <span className="text-soil-500">Location:</span>
                  <span className="font-semibold text-soil-800">{crop.storageLocation}</span>
                </div>
              </div>

              <div className="p-3 bg-canopy-50/60 rounded-xl border border-canopy-100 text-xs flex items-center justify-between">
                <span className="text-soil-600">Estimated Value:</span>
                <span className="font-display font-bold text-sm text-canopy-900">
                  ₹{crop.estimatedTotal?.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-soil-100 flex items-center justify-between">
              <span className="text-[11px] text-signal-good font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {crop.status}
              </span>

              <button
                onClick={() => openGradingModal(crop.cropType)}
                className="px-3 py-1.5 rounded-lg bg-soil-100 hover:bg-soil-200 text-soil-800 font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Camera className="w-3.5 h-3.5 text-canopy-700" />
                <span>Camera Grade</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Crop Batch Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-soil-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-soil-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-soil-100">
              <h3 className="font-display font-bold text-lg text-canopy-950">
                {t("addCrop")}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-soil-400 hover:text-soil-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-soil-700 block mb-1">Crop Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-soil-300 rounded-lg focus:outline-none focus:border-canopy-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-soil-700 block mb-1">Crop Type</label>
                  <select
                    value={formData.cropType}
                    onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                    className="w-full px-3 py-2 border border-soil-300 rounded-lg focus:outline-none focus:border-canopy-600"
                  >
                    <option value="Cotton">Cotton</option>
                    <option value="Onion">Onion</option>
                    <option value="Wheat">Wheat</option>
                    <option value="Soybean">Soybean</option>
                    <option value="Tomato">Tomato</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-soil-700 block mb-1">Variety</label>
                  <input
                    type="text"
                    required
                    value={formData.variety}
                    onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                    className="w-full px-3 py-2 border border-soil-300 rounded-lg focus:outline-none focus:border-canopy-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-soil-700 block mb-1">Quantity (Quintals)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-soil-300 rounded-lg focus:outline-none focus:border-canopy-600"
                  />
                </div>
                <div>
                  <label className="font-semibold text-soil-700 block mb-1">Base Price (₹/Qtl)</label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={formData.baseMandiPrice}
                    onChange={(e) => setFormData({ ...formData, baseMandiPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-soil-300 rounded-lg focus:outline-none focus:border-canopy-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-soil-700 block mb-1">Storage Location</label>
                <input
                  type="text"
                  required
                  value={formData.storageLocation}
                  onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
                  className="w-full px-3 py-2 border border-soil-300 rounded-lg focus:outline-none focus:border-canopy-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-soil-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-soil-600 hover:bg-soil-100 rounded-lg"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-canopy-900 hover:bg-canopy-800 rounded-lg shadow-xs"
                >
                  {t("save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
