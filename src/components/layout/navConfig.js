import {
  LayoutDashboard,
  Upload,
  Sparkles,
  Package,
  TrendingUp,
  Warehouse,
  Truck,
  Bell,
  FileText
} from "lucide-react";

export const navItems = [
  {
    to: "/",
    key: "navDashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/grading",
    key: "navGradeProduce",
    icon: Upload,
    badge: "AI Vision",
  },
  {
    to: "/recommendations",
    key: "navRecommendations",
    icon: Sparkles,
  },
  {
    to: "/crops",
    key: "navCrops",
    icon: Package,
  },
  {
    to: "/markets",
    key: "navMarkets",
    icon: TrendingUp,
  },
  {
    to: "/storage",
    key: "navStorage",
    icon: Warehouse,
  },
  {
    to: "/transport",
    key: "navTransport",
    icon: Truck,
  },
  {
    to: "/alerts",
    key: "navAlerts",
    icon: Bell,
  },
  {
    to: "/reports",
    key: "navReports",
    icon: FileText,
  },
];
