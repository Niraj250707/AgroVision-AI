import { useState } from 'react';
import Input from '../common/Input';
import Dropdown from '../common/Dropdown';
import Button from '../common/Button';
import { marketsList } from '../../data/marketData';

const initialForm = {
  name: '',
  quantityKg: '',
  harvestDate: '',
  location: '',
  preferredMarket: '',
  storageAvailable: 'Yes',
};

export default function AddCropForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Crop name is required.';
    if (!form.quantityKg || Number(form.quantityKg) <= 0) next.quantityKg = 'Enter a valid quantity in kg.';
    if (!form.harvestDate) next.harvestDate = 'Select a harvest date.';
    if (!form.location.trim()) next.location = 'Location is required.';
    if (!form.preferredMarket) next.preferredMarket = 'Select a preferred market.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      id: `crop-${Date.now()}`,
      name: form.name.trim(),
      variety: '—',
      quantityKg: Number(form.quantityKg),
      unit: 'Quintal',
      harvestDate: form.harvestDate,
      location: form.location.trim(),
      currentPriceQuintal: 0,
      demand: 'Medium',
      expectedReturn: 0,
      recommendation: 'Awaiting AI analysis',
      status: 'Pending review',
      imageColor: '#3a8259',
      preferredMarket: form.preferredMarket,
      storageAvailable: form.storageAvailable,
    });
    setForm(initialForm);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <Input label="Crop Name" placeholder="e.g. Cotton" value={form.name} onChange={(e) => update('name', e.target.value)} error={errors.name} />
      <Input label="Quantity (kg)" type="number" min="1" placeholder="e.g. 1000" value={form.quantityKg} onChange={(e) => update('quantityKg', e.target.value)} error={errors.quantityKg} />
      <Input label="Harvest Date" type="date" value={form.harvestDate} onChange={(e) => update('harvestDate', e.target.value)} error={errors.harvestDate} />
      <Input label="Location" placeholder="e.g. Anand, Gujarat" value={form.location} onChange={(e) => update('location', e.target.value)} error={errors.location} />
      <Dropdown
        label="Preferred Market"
        placeholder="Select a market"
        options={marketsList}
        value={form.preferredMarket}
        onChange={(v) => update('preferredMarket', v)}
      />
      {errors.preferredMarket && <p className="-mt-3 text-xs text-[var(--color-signal-bad)]">{errors.preferredMarket}</p>}
      <Dropdown
        label="Storage Availability"
        options={['Yes', 'No']}
        value={form.storageAvailable}
        onChange={(v) => update('storageAvailable', v)}
      />
      <div className="mt-2 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Add Crop</Button>
      </div>
    </form>
  );
}
