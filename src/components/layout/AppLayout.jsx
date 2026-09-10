import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";
import OfflineStatusBanner from "../common/OfflineStatusBanner";
import ProduceGradingModal from "../camera/ProduceGradingModal";
import QualityCertificateModal from "../certificate/QualityCertificateModal";
import KrishiMitraFloatingButton from "../chat/KrishiMitraFloatingButton";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.14),transparent_28%),linear-gradient(180deg,#f0fdf4_0%,#f8faf7_100%)] text-soil-950 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <TopHeader onMenuClick={() => setSidebarOpen(true)} />
        <OfflineStatusBanner />

        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
          <Outlet />
        </main>
      </div>

      <ProduceGradingModal />
      <QualityCertificateModal />
      <KrishiMitraFloatingButton />
    </div>
  );
}

