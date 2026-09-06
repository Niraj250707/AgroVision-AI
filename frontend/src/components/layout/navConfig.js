import {
  LayoutDashboard, Sprout, LineChart, Sparkles, Warehouse,
  Truck, FileBarChart, Bell, Settings, HelpCircle,
} from 'lucide-react';

export const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/crop-overview', label: 'Crop Overview', icon: Sprout },
  { to: '/market-prices', label: 'Market Prices', icon: LineChart },
  { to: '/ai-recommendations', label: 'AI Recommendations', icon: Sparkles },
  { to: '/storage-planner', label: 'Storage Planner', icon: Warehouse },
  { to: '/transport', label: 'Transport & Distance', icon: Truck },
  { to: '/reports', label: 'My Reports', icon: FileBarChart },
  { to: '/alerts', label: 'Alerts & Notifications', icon: Bell },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/help', label: 'Help & Support', icon: HelpCircle },
];
