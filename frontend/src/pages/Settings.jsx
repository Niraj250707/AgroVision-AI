import { useState } from 'react';
import { User, Home, Sprout, MapPin, Languages, Bell, Ruler, ShieldCheck } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { Card } from '../components/common/States';
import Input from '../components/common/Input';
import Dropdown from '../components/common/Dropdown';
import Button from '../components/common/Button';
import { farmInfo } from '../data/farmerData';

function Section({ icon: Icon, title, description, children }) {
  return (
    <Card>
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-canopy-700)]/10 text-[var(--color-canopy-700)]">
          <Icon size={18} />
        </span>
        <div>
          <h3 className="font-display text-base font-semibold text-[var(--color-soil-950)]">{title}</h3>
          {description && <p className="text-sm text-[var(--color-soil-600)]">{description}</p>}
        </div>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </Card>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-4 text-sm">
      <span className="text-[var(--color-soil-800)]">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-[var(--color-canopy-700)]' : 'bg-[var(--color-soil-200)]'}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </label>
  );
}

export default function Settings() {
  const { farmer } = useApp();
  const [name, setName] = useState(farmer.name);
  const [phone, setPhone] = useState(farmer.phone);
  const [language, setLanguage] = useState(farmer.language);
  const [units, setUnits] = useState(farmer.preferredUnits);
  const [notif, setNotif] = useState({ price: true, demand: true, weather: false, storage: true });
  const [saved, setSaved] = useState(false);

  function handleSave(e) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6">
      <Section icon={User} title="Profile" description="Your personal details as shown across Agrovision AI.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </Section>

      <Section icon={Home} title="Farm Information" description="Used to tailor recommendations to your land.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Total Land (acres)" defaultValue={farmInfo.totalLandAcres} type="number" />
          <Input label="Irrigated Land (acres)" defaultValue={farmInfo.irrigatedAcres} type="number" />
          <Input label="Soil Type" defaultValue={farmInfo.soilType} />
        </div>
      </Section>

      <Section icon={Sprout} title="Crop Preferences" description="Crops you grow most often.">
        <div className="flex flex-wrap gap-2">
          {farmInfo.primaryCrops.map((c) => (
            <span key={c} className="rounded-full bg-[var(--color-canopy-700)]/10 px-3 py-1.5 text-sm font-medium text-[var(--color-canopy-700)]">
              {c}
            </span>
          ))}
        </div>
      </Section>

      <Section icon={MapPin} title="Location" description="Used for market distance and weather.">
        <Input label="Village / District / State" defaultValue={farmer.location} />
      </Section>

      <Section icon={Languages} title="Language" description="Choose your preferred app language.">
        <Dropdown label="Language" options={['Gujarati', 'Hindi', 'English', 'Marathi']} value={language} onChange={setLanguage} />
      </Section>

      <Section icon={Bell} title="Notifications" description="Choose which alerts you want to receive.">
        <Toggle label="Price alerts" checked={notif.price} onChange={(v) => setNotif((n) => ({ ...n, price: v }))} />
        <Toggle label="Demand alerts" checked={notif.demand} onChange={(v) => setNotif((n) => ({ ...n, demand: v }))} />
        <Toggle label="Weather alerts" checked={notif.weather} onChange={(v) => setNotif((n) => ({ ...n, weather: v }))} />
        <Toggle label="Storage alerts" checked={notif.storage} onChange={(v) => setNotif((n) => ({ ...n, storage: v }))} />
      </Section>

      <Section icon={Ruler} title="Units" description="How quantities and prices are displayed.">
        <Dropdown label="Preferred Units" options={['Quintal (kg)', 'Kilogram', 'Metric Tonne']} value={units} onChange={setUnits} />
      </Section>

      <Section icon={ShieldCheck} title="Account" description="Manage your account settings.">
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" type="button">Change Password</Button>
          <Button variant="secondary" type="button">Download My Data</Button>
          <Button variant="ghost" type="button" className="text-[var(--color-signal-bad)] hover:bg-[var(--color-signal-bad)]/5">Delete Account</Button>
        </div>
      </Section>

      <div className="flex items-center gap-3">
        <Button type="submit">Save Changes</Button>
        {saved && <span className="text-sm font-medium text-[var(--color-signal-good)]">Settings saved.</span>}
      </div>
    </form>
  );
}
