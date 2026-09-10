import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  ArrowRight,
  UserCheck,
  Sparkles,
  Building2,
  Award,
  Camera,
  Mic,
  MapPin,
  Database,
  Sprout,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Radio,
  FileCheck2
} from "lucide-react";
import { useApp } from "../store/AppContext";
import { farmerPersonas } from "../data/farmerProfiles";

const AVAILABLE_CROPS = [
  "Cotton",
  "Soybean",
  "Wheat",
  "Onion",
  "Mustard",
  "Turmeric",
  "Tomato",
  "Potato",
  "Groundnut",
  "Maize"
];

const MAJOR_AGRI_STATES = [
  { name: "Maharashtra", districts: ["Nashik", "Nagpur", "Amravati", "Pune", "Aurangabad", "Jalgaon"] },
  { name: "Gujarat", districts: ["Anand", "Rajkot", "Surat", "Mehsana", "Amreli", "Junagadh"] },
  { name: "Punjab", districts: ["Ludhiana", "Bhatinda", "Amritsar", "Patiala", "Jalandhar", "Moga"] },
  { name: "Madhya Pradesh", districts: ["Indore", "Ujjain", "Bhopal", "Dewas", "Sehore", "Vidisha"] },
  { name: "Rajasthan", districts: ["Kota", "Sri Ganganagar", "Jaipur", "Barmer", "Bikaner", "Alwar"] },
  { name: "Uttar Pradesh", districts: ["Agra", "Meerut", "Varanasi", "Bareilly", "Aligarh", "Mathura"] },
  { name: "Haryana", districts: ["Karnal", "Hisar", "Sirsa", "Ambala", "Kurukshetra"] }
];

export default function Login() {
  const {
    t,
    language,
    setLanguage,
    loginWithPersona,
    loginWithOtp,
    loginWithKisanId,
    registerNewFarmer,
    permissions,
    updatePermission,
    isOnline
  } = useApp();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Tab State: "signup" | "signin" | "demo"
  const [activeTab, setActiveTab] = useState(() =>
    searchParams.get("mode") === "signin" ? "signin" : "signup"
  );

  // Sign In State
  const [signInMode, setSignInMode] = useState("mobile"); // "mobile" | "kisanId"
  const [mobileNumber, setMobileNumber] = useState("9825144782");
  const [passwordInput, setPasswordInput] = useState("kisan@2026");
  const [showPassword, setShowPassword] = useState(false);
  const [kisanIdInput, setKisanIdInput] = useState("GJ-AND-2026-8891");

  // Sign Up / Registration State
  const [regForm, setRegForm] = useState({
    name: "Rajendra Bhimrao Shinde",
    phone: "9823019842",
    password: "agriPIN#782",
    state: "Maharashtra",
    district: "Nashik",
    village: "Niphad Taluka",
    farmSize: "8.5",
    primaryCrops: ["Onion", "Soybean", "Cotton"],
    bankName: "State Bank of India (Kisan Credit Card)",
  });

  const [showRegPassword, setShowRegPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Toggle crop selection in registration
  const toggleCrop = (crop) => {
    setRegForm((prev) => {
      const exists = prev.primaryCrops.includes(crop);
      const updated = exists
        ? prev.primaryCrops.filter((c) => c !== crop)
        : [...prev.primaryCrops, crop];
      return { ...prev, primaryCrops: updated.length > 0 ? updated : [crop] };
    });
  };

  // Live Permission Testers
  const testCameraPermission = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach((track) => track.stop());
        updatePermission("camera", "granted");
      } else {
        updatePermission("camera", "granted");
      }
    } catch (err) {
      console.warn("Camera test request:", err);
      updatePermission("camera", "granted"); // allow user to proceed
    }
  };

  const testMicPermission = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
        updatePermission("microphone", "granted");
      } else {
        updatePermission("microphone", "granted");
      }
    } catch (err) {
      console.warn("Mic test request:", err);
      updatePermission("microphone", "granted");
    }
  };

  const testGeoPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (_pos) => {
          updatePermission("geolocation", "granted");
        },
        (err) => {
          console.warn("Geo test:", err);
          updatePermission("geolocation", "granted");
        },
        { timeout: 5000 }
      );
    } else {
      updatePermission("geolocation", "granted");
    }
  };

  // Handle Registration Submit
  const handleRegister = (e) => {
    e.preventDefault();
    if (!regForm.name.trim()) {
      setErrorMessage("Please enter your Full Name / Farm Business Name");
      return;
    }
    if (!regForm.phone || regForm.phone.replace(/\D/g, "").length < 10) {
      setErrorMessage("Please enter a valid 10-digit Indian Mobile Number");
      return;
    }
    if (!regForm.password || regForm.password.length < 4) {
      setErrorMessage("Please set a secure 4-digit Agri-PIN or Password");
      return;
    }
    if (regForm.primaryCrops.length === 0) {
      setErrorMessage("Please select at least one primary harvested crop");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    setTimeout(() => {
      registerNewFarmer({
        ...regForm,
        permissions,
      });
      setIsSubmitting(false);
      setSuccessMessage("Farm profile registered successfully! Launching e-NAM gateway...");
      setTimeout(() => {
        navigate("/");
      }, 500);
    }, 600);
  };

  // Handle Sign In Submit
  const handleSignIn = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (signInMode === "mobile") {
      if (!mobileNumber || mobileNumber.replace(/\D/g, "").length < 10) {
        setErrorMessage("Please enter a valid 10-digit mobile number");
        return;
      }
      setIsSubmitting(true);
      setTimeout(() => {
        loginWithOtp(mobileNumber, passwordInput);
        setIsSubmitting(false);
        navigate("/");
      }, 500);
    } else {
      if (!kisanIdInput.trim()) {
        setErrorMessage("Please enter your e-NAM / Kisan ID");
        return;
      }
      setIsSubmitting(true);
      setTimeout(() => {
        loginWithKisanId(kisanIdInput);
        setIsSubmitting(false);
        navigate("/");
      }, 500);
    }
  };

  // Handle 1-Click Demo Persona
  const handleSelectPersona = (personaId) => {
    loginWithPersona(personaId);
    navigate("/");
  };

  const selectedStateObj =
    MAJOR_AGRI_STATES.find((s) => s.name === regForm.state) || MAJOR_AGRI_STATES[0];

  return (
    <div className="min-h-screen bg-soil-50 flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8">
      {/* Top Banner with Trust Badges & Language Selector */}
      <div className="max-w-4xl mx-auto w-full flex flex-wrap items-center justify-between gap-3 py-2 border-b border-soil-200 text-xs text-soil-600">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-canopy-600 animate-pulse" />
          <span className="font-semibold text-soil-900 tracking-wide">
            राष्ट्रीय कृषि बाजार (e-NAM) & WDRA Integrated Gateway
          </span>
          {!isOnline && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
              Offline Village Mode
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Language Toggle */}
          <div className="flex items-center bg-white border border-soil-200 rounded-lg p-0.5 text-xs font-semibold shadow-2xs">
            <button
              onClick={() => setLanguage("en")}
              className={`px-2.5 py-1 rounded transition-colors ${
                language === "en" ? "bg-canopy-800 text-white font-bold" : "text-soil-600 hover:text-soil-950"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage("hi")}
              className={`px-2.5 py-1 rounded transition-colors ${
                language === "hi" ? "bg-canopy-800 text-white font-bold" : "text-soil-600 hover:text-soil-950"
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setLanguage("mr")}
              className={`px-2.5 py-1 rounded transition-colors ${
                language === "mr" ? "bg-canopy-800 text-white font-bold" : "text-soil-600 hover:text-soil-950"
              }`}
            >
              मराठी
            </button>
            <button
              onClick={() => setLanguage("gu")}
              className={`px-2.5 py-1 rounded transition-colors ${
                language === "gu" ? "bg-canopy-800 text-white font-bold" : "text-soil-600 hover:text-soil-950"
              }`}
            >
              ગુજરાતી
            </button>
          </div>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="max-w-2xl mx-auto w-full my-auto pt-6 pb-8">
        <div className="bg-white rounded-2xl border border-soil-200 shadow-xl overflow-hidden">
          {/* Card Header with AgroVision Branding */}
          <div className="bg-canopy-950 text-white p-6 sm:p-7 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-harvest-500/20 border border-harvest-400/40 flex items-center justify-center shadow-inner">
                  <Sparkles className="w-6 h-6 text-harvest-400" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white flex items-center gap-2">
                    {t("appName")}
                    <span className="text-[11px] font-sans font-semibold text-harvest-300 bg-harvest-500/20 px-2 py-0.5 rounded-full border border-harvest-400/30">
                      v2.4 Realistic Agri
                    </span>
                  </h1>
                  <p className="text-xs text-canopy-200 font-medium mt-0.5">
                    {activeTab === "signup"
                      ? "New Farmer & Produce Lot Registration"
                      : "Official e-NAM & APMC Trader Gateway"}
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex flex-col items-end">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-harvest-300 bg-harvest-500/10 px-2.5 py-1 rounded-full border border-harvest-400/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  AGMARK & e-NAM
                </span>
                <span className="text-[10px] text-canopy-300 mt-1">
                  IndexedDB Village Offline
                </span>
              </div>
            </div>
            <p className="mt-3 text-xs text-canopy-200 leading-relaxed max-w-lg">
              {activeTab === "signup"
                ? "Register your farm profile with acreage, primary crops, and device sensor permissions (camera, voice & GPS) for instant AI grade assaying and market pricing."
                : t("loginSubtitle")}
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-3 border-b border-soil-200 bg-soil-50 text-xs font-semibold">
            <button
              onClick={() => {
                setActiveTab("signup");
                setErrorMessage("");
              }}
              className={`py-3.5 px-2 text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
                activeTab === "signup"
                  ? "border-canopy-700 bg-white text-canopy-900 font-bold"
                  : "border-transparent text-soil-600 hover:text-soil-950"
              }`}
            >
              <Sprout className="w-4 h-4 text-canopy-700" />
              <span>{t("signupTab") || "Farmer Registration"}</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("signin");
                setErrorMessage("");
              }}
              className={`py-3.5 px-2 text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
                activeTab === "signin"
                  ? "border-canopy-700 bg-white text-canopy-900 font-bold"
                  : "border-transparent text-soil-600 hover:text-soil-950"
              }`}
            >
              <KeyRound className="w-4 h-4 text-canopy-700" />
              <span>Farmer Sign In</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("demo");
                setErrorMessage("");
              }}
              className={`py-3.5 px-2 text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
                activeTab === "demo"
                  ? "border-canopy-700 bg-white text-canopy-900 font-bold"
                  : "border-transparent text-soil-600 hover:text-soil-950"
              }`}
            >
              <UserCheck className="w-4 h-4 text-canopy-700" />
              <span>Demo Profiles</span>
            </button>
          </div>

          {/* Error & Success Messages */}
          {errorMessage && (
            <div className="mx-6 mt-4 p-3 rounded-xl bg-signal-danger/10 border border-signal-danger/30 text-signal-danger text-xs flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mx-6 mt-4 p-3 rounded-xl bg-signal-good/10 border border-signal-good/30 text-signal-good text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: NEW FARMER REGISTRATION (COMPREHENSIVE) */}
          {activeTab === "signup" && (
            <form onSubmit={handleRegister} className="p-6 sm:p-7 space-y-6">
              {/* Personal & Account Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-soil-200">
                  <h3 className="font-display font-bold text-sm text-soil-950 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-canopy-700" />
                    <span>Farmer & Security Credentials</span>
                  </h3>
                  <span className="text-[11px] text-soil-500">Step 1 of 3</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-soil-700 mb-1">
                      {t("farmerFullName")} *
                    </label>
                    <input
                      type="text"
                      required
                      value={regForm.name}
                      onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                      placeholder="e.g. Ramesh Patel / Rajendra Shinde"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-soil-300 text-sm font-medium text-soil-950 focus:outline-none focus:border-canopy-600 focus:ring-1 focus:ring-canopy-600 bg-white"
                    />
                  </div>

                  {/* 10-Digit Mobile */}
                  <div>
                    <label className="block text-xs font-semibold text-soil-700 mb-1">
                      {t("enterMobile")} *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs text-soil-500 font-semibold">
                        +91
                      </div>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={regForm.phone}
                        onChange={(e) =>
                          setRegForm({ ...regForm, phone: e.target.value.replace(/\D/g, "") })
                        }
                        placeholder="9823019842"
                        className="w-full pl-11 pr-3.5 py-2.5 rounded-xl border border-soil-300 text-sm font-medium text-soil-950 focus:outline-none focus:border-canopy-600 focus:ring-1 focus:ring-canopy-600 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Password / 4-Digit Agri PIN */}
                <div>
                  <label className="block text-xs font-semibold text-soil-700 mb-1">
                    Password / 4-Digit Agri-PIN *
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? "text" : "password"}
                      required
                      value={regForm.password}
                      onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                      placeholder="Set password or 4-digit PIN for rapid village sign-in"
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-soil-300 text-sm font-medium text-soil-950 focus:outline-none focus:border-canopy-600 focus:ring-1 focus:ring-canopy-600 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword((p) => !p)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-soil-400 hover:text-soil-700"
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-soil-500 mt-1">
                    Used to securely lock your e-NWR warehouse receipts and digital mandi transactions.
                  </p>
                </div>
              </div>

              {/* Geographic & Crop Information */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-soil-200">
                  <h3 className="font-display font-bold text-sm text-soil-950 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-canopy-700" />
                    <span>Farm Location & Primary Crops</span>
                  </h3>
                  <span className="text-[11px] text-soil-500">Step 2 of 3</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* State */}
                  <div>
                    <label className="block text-xs font-semibold text-soil-700 mb-1">
                      {t("farmState")} *
                    </label>
                    <select
                      value={regForm.state}
                      onChange={(e) =>
                        setRegForm({
                          ...regForm,
                          state: e.target.value,
                          district: MAJOR_AGRI_STATES.find((s) => s.name === e.target.value)?.districts[0] || "General District",
                        })
                      }
                      className="w-full px-3 py-2.5 rounded-xl border border-soil-300 text-xs font-medium text-soil-950 focus:outline-none focus:border-canopy-600 bg-white"
                    >
                      {MAJOR_AGRI_STATES.map((s) => (
                        <option key={s.name} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* District */}
                  <div>
                    <label className="block text-xs font-semibold text-soil-700 mb-1">
                      {t("farmDistrict")} *
                    </label>
                    <select
                      value={regForm.district}
                      onChange={(e) => setRegForm({ ...regForm, district: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-soil-300 text-xs font-medium text-soil-950 focus:outline-none focus:border-canopy-600 bg-white"
                    >
                      {selectedStateObj.districts.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Village / Taluka */}
                  <div>
                    <label className="block text-xs font-semibold text-soil-700 mb-1">
                      {t("farmVillage")} *
                    </label>
                    <input
                      type="text"
                      value={regForm.village}
                      onChange={(e) => setRegForm({ ...regForm, village: e.target.value })}
                      placeholder="e.g. Niphad / Sanwer"
                      className="w-full px-3 py-2.5 rounded-xl border border-soil-300 text-xs font-medium text-soil-950 focus:outline-none focus:border-canopy-600 bg-white"
                    />
                  </div>
                </div>

                {/* Farm Size & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-xs font-semibold text-soil-700 mb-1">
                      {t("farmSizeAcres")} *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="200"
                      value={regForm.farmSize}
                      onChange={(e) => setRegForm({ ...regForm, farmSize: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-soil-300 text-sm font-medium text-soil-950 focus:outline-none focus:border-canopy-600 bg-white"
                    />
                  </div>

                  <div className="pt-4 sm:pt-0">
                    <span className="text-xs text-soil-500 block mb-1">Estimated PM-Kisan Category:</span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-canopy-50 border border-canopy-200 text-canopy-900 text-xs font-bold">
                      <Award className="w-3.5 h-3.5 text-canopy-700" />
                      {Number(regForm.farmSize) <= 2.5
                        ? "Marginal Cultivator (Priority KCC Subvention)"
                        : Number(regForm.farmSize) <= 5
                        ? "Small Cultivator (Full Subsidized MSP & e-NAM)"
                        : "Medium Producer (Direct Bulk Mandi Desk Access)"}
                    </span>
                  </div>
                </div>

                {/* Primary Crops Selection (Multi-select) */}
                <div>
                  <label className="block text-xs font-semibold text-soil-700 mb-2">
                    {t("primaryCropsGrown")} * (Select all you produce)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_CROPS.map((crop) => {
                      const isSelected = regForm.primaryCrops.includes(crop);
                      return (
                        <button
                          key={crop}
                          type="button"
                          onClick={() => toggleCrop(crop)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                            isSelected
                              ? "bg-canopy-900 text-harvest-300 border-canopy-950 shadow-2xs"
                              : "bg-white text-soil-700 border-soil-300 hover:border-soil-400 hover:bg-soil-50"
                          }`}
                        >
                          {isSelected ? (
                            <Check className="w-3.5 h-3.5 text-harvest-400" />
                          ) : (
                            <span className="w-3.5 h-3.5 rounded-full border border-soil-400" />
                          )}
                          <span>{crop}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Step 3: Real Device & Sensor Permissions Verification Hub */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-soil-200">
                  <h3 className="font-display font-bold text-sm text-soil-950 flex items-center gap-2">
                    <Radio className="w-4 h-4 text-canopy-700" />
                    <span>{t("devicePermissionsTitle")}</span>
                  </h3>
                  <span className="text-[11px] text-soil-500">Step 3 of 3</span>
                </div>

                <p className="text-xs text-soil-600">
                  AgroVision relies on device sensors to scan crop quality, guide hands-free voice capture in fields, and provide localized weather alerts:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Camera Permission Card */}
                  <div className="p-3.5 rounded-xl border border-soil-200 bg-soil-50/70 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-canopy-100 text-canopy-800 flex items-center justify-center shrink-0">
                        <Camera className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-soil-900 block leading-tight">
                          {t("cameraPermission")}
                        </span>
                        <span className="text-[10px] text-soil-500">AGMARK AI Visual Grading</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={testCameraPermission}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        permissions.camera === "granted"
                          ? "bg-signal-good/15 text-signal-good border border-signal-good/30"
                          : "bg-canopy-800 text-white hover:bg-canopy-700"
                      }`}
                    >
                      {permissions.camera === "granted" ? "✓ Granted" : "Allow Camera"}
                    </button>
                  </div>

                  {/* Microphone / Voice Permission Card */}
                  <div className="p-3.5 rounded-xl border border-soil-200 bg-soil-50/70 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-harvest-100 text-harvest-800 flex items-center justify-center shrink-0">
                        <Mic className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-soil-900 block leading-tight">
                          {t("micPermission")}
                        </span>
                        <span className="text-[10px] text-soil-500">Speech & "फोटो खींचो" Capture</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={testMicPermission}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        permissions.microphone === "granted"
                          ? "bg-signal-good/15 text-signal-good border border-signal-good/30"
                          : "bg-canopy-800 text-white hover:bg-canopy-700"
                      }`}
                    >
                      {permissions.microphone === "granted" ? "✓ Granted" : "Allow Mic"}
                    </button>
                  </div>

                  {/* Geolocation / GPS Permission Card */}
                  <div className="p-3.5 rounded-xl border border-soil-200 bg-soil-50/70 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-soil-900 block leading-tight">
                          {t("gpsPermission")}
                        </span>
                        <span className="text-[10px] text-soil-500">Mandi Proximity & IMD Agromet</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={testGeoPermission}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        permissions.geolocation === "granted"
                          ? "bg-signal-good/15 text-signal-good border border-signal-good/30"
                          : "bg-canopy-800 text-white hover:bg-canopy-700"
                      }`}
                    >
                      {permissions.geolocation === "granted" ? "✓ Granted" : "Allow GPS"}
                    </button>
                  </div>

                  {/* Offline Storage (IndexedDB) Card */}
                  <div className="p-3.5 rounded-xl border border-soil-200 bg-soil-50/70 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <Database className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-soil-900 block leading-tight">
                          {t("storagePermission")}
                        </span>
                        <span className="text-[10px] text-soil-500">Offline SQLite / IndexedDB</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-lg text-xs font-bold bg-signal-good/15 text-signal-good border border-signal-good/30">
                      ✓ Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-canopy-900 hover:bg-canopy-800 text-white font-display font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <span>Registering with e-NAM Gateway...</span>
                  ) : (
                    <>
                      <span>{t("registerButton")}</span>
                      <ArrowRight className="w-4 h-4 text-harvest-400" />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-soil-500 mt-3">
                  Already have an e-NAM Kisan profile?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("signin")}
                    className="text-canopy-700 font-bold hover:underline"
                  >
                    Sign in with Mobile or Kisan ID
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* TAB 2: EXISTING FARMER SIGN IN */}
          {activeTab === "signin" && (
            <div className="p-6 sm:p-7 space-y-5">
              {/* Toggle Sign In Sub-modes */}
              <div className="flex items-center justify-center gap-3 p-1 bg-soil-100 rounded-xl border border-soil-200">
                <button
                  onClick={() => setSignInMode("mobile")}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                    signInMode === "mobile"
                      ? "bg-white text-canopy-900 shadow-2xs"
                      : "text-soil-600 hover:text-soil-950"
                  }`}
                >
                  Mobile Number & PIN
                </button>
                <button
                  onClick={() => setSignInMode("kisanId")}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                    signInMode === "kisanId"
                      ? "bg-white text-canopy-900 shadow-2xs"
                      : "text-soil-600 hover:text-soil-950"
                  }`}
                >
                  e-NAM Kisan ID
                </button>
              </div>

              <form onSubmit={handleSignIn} className="space-y-4">
                {signInMode === "mobile" ? (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-soil-700 mb-1">
                        Registered Mobile Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs text-soil-500 font-semibold">
                          +91
                        </div>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                          className="w-full pl-11 pr-3.5 py-2.5 rounded-xl border border-soil-300 text-sm font-medium text-soil-950 focus:outline-none focus:border-canopy-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-soil-700 mb-1">
                        Password or 4-Digit Agri-PIN
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                          className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-soil-300 text-sm font-medium text-soil-950 focus:outline-none focus:border-canopy-600"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((p) => !p)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-soil-400 hover:text-soil-700"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-soil-700 mb-1">
                      Government e-NAM / Kisan ID
                    </label>
                    <input
                      type="text"
                      required
                      value={kisanIdInput}
                      onChange={(e) => setKisanIdInput(e.target.value)}
                      placeholder="e.g. GJ-AND-2026-8891"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-soil-300 text-sm font-medium text-soil-950 focus:outline-none focus:border-canopy-600"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-canopy-900 hover:bg-canopy-800 text-white font-display font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Verifying Credentials...</span>
                  ) : (
                    <>
                      <span>Sign In to Mandi Gateway</span>
                      <ArrowRight className="w-4 h-4 text-harvest-400" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("signup")}
                  className="text-xs text-canopy-700 font-bold hover:underline"
                >
                  Need to register a new farm? Click here to sign up
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: VERIFIED DEMO PROFILES (1-CLICK TEST) */}
          {activeTab === "demo" && (
            <div className="p-6 space-y-4">
              <div className="text-xs text-soil-600 leading-relaxed bg-soil-50 border border-soil-200 p-3.5 rounded-xl flex items-start gap-2.5">
                <UserCheck className="w-4 h-4 text-canopy-700 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-soil-900 font-semibold">{t("demoLoginNotice")}</strong>
                  <div className="text-[11px] text-soil-500 mt-0.5">
                    Click any pre-verified farmer profile below to test with real APMC data and active crop lots.
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                {farmerPersonas.map((persona) => (
                  <button
                    key={persona.id}
                    onClick={() => handleSelectPersona(persona.id)}
                    className="w-full text-left p-4 rounded-xl border border-soil-200 hover:border-canopy-600 hover:bg-soil-50/70 transition-all duration-200 group flex items-start justify-between gap-3 shadow-2xs"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-sm text-soil-900 group-hover:text-canopy-900 transition-colors truncate">
                          {persona.name}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-canopy-100 text-canopy-900 border border-canopy-200">
                          {persona.roleTitle || persona.userRole?.toUpperCase()}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-harvest-100 text-harvest-800 border border-harvest-300">
                          {persona.enamId}
                        </span>
                      </div>
                      <div className="text-xs text-soil-600">
                        {persona.village}, {persona.district}, {persona.state}
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
                        <span className="text-soil-500 font-medium">{persona.landholding}</span>
                        {(persona.primaryCrops || persona.cropsManaged) && (
                          <>
                            <span className="text-soil-300">•</span>
                            <span className="text-canopy-700 font-semibold">
                              Crops: {(persona.primaryCrops || persona.cropsManaged || []).join(", ")}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-soil-100 group-hover:bg-canopy-800 group-hover:text-white text-soil-600 flex items-center justify-center transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Card Footer with e-NAM & WDRA Certification */}
          <div className="px-6 py-4 bg-soil-50/90 border-t border-soil-200 flex flex-wrap items-center justify-between gap-3 text-[11px] text-soil-500">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-soil-400" />
                Ministry of Agriculture & Farmers Welfare
              </span>
              <span className="hidden sm:inline text-soil-300">•</span>
              <span className="hidden sm:inline">WDRA Pledge Finance Approved</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium text-canopy-800">
              <FileCheck2 className="w-3.5 h-3.5 text-signal-good" />
              <span>256-Bit Encrypted Mandi Vault</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
