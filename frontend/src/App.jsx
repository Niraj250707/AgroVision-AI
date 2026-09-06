import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import AppLayout from './components/layout/AppLayout';

import Dashboard from './pages/Dashboard';
import CropOverview from './pages/CropOverview';
import MarketPrices from './pages/MarketPrices';
import AIRecommendations from './pages/AIRecommendations';
import StoragePlanner from './pages/StoragePlanner';
import TransportDistance from './pages/TransportDistance';
import Reports from './pages/Reports';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';
import HelpSupport from './pages/HelpSupport';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/crop-overview" element={<CropOverview />} />
            <Route path="/market-prices" element={<MarketPrices />} />
            <Route path="/ai-recommendations" element={<AIRecommendations />} />
            <Route path="/storage-planner" element={<StoragePlanner />} />
            <Route path="/transport" element={<TransportDistance />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<HelpSupport />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
