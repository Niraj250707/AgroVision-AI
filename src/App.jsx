import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LocaleProvider } from "./context/LocaleContext";
import { AppProvider, useApp } from "./store/AppContext";
import { VoiceCommandProvider } from "./context/VoiceCommandContext";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import QualityGrading from "./pages/QualityGrading";
import AIRecommendations from "./pages/AIRecommendations";
import CropOverview from "./pages/CropOverview";
import MarketPrices from "./pages/MarketPrices";
import StoragePlanner from "./pages/StoragePlanner";
import TransportDistance from "./pages/TransportDistance";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

function AppRoutes() {
  const { isAuthenticated } = useApp();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <AppLayout />
          ) : (
            <Home />
          )
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="grading" element={<QualityGrading />} />
        <Route path="recommendations" element={<AIRecommendations />} />
        <Route path="crops" element={<CropOverview />} />
        <Route path="markets" element={<MarketPrices />} />
        <Route path="storage" element={<StoragePlanner />} />
        <Route path="transport" element={<TransportDistance />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="reports" element={<Reports />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <LocaleProvider>
      <AppProvider>
        <BrowserRouter>
          <ScrollToTop />
          <VoiceCommandProvider>
            <AppRoutes />
          </VoiceCommandProvider>
        </BrowserRouter>
      </AppProvider>
    </LocaleProvider>
  );
}

