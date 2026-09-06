import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { useAsyncData } from '../hooks/useAsyncData';
import { cropService } from '../services/cropService';
import { LoadingState, ErrorState, EmptyState } from '../components/common/States';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import CropCard from '../components/crop/CropCard';
import AddCropForm from '../components/crop/AddCropForm';

export default function CropOverview() {
  const { addCrop, selectedCropId, setSelectedCropId } = useApp();
  const [params, setParams] = useSearchParams();
  const [modalOpen, setModalOpen] = useState(params.get('add') === '1');
  const crops = useAsyncData(() => cropService.getAll(), []);

  function closeModal() {
    setModalOpen(false);
    if (params.get('add')) {
      params.delete('add');
      setParams(params, { replace: true });
    }
  }

  function handleAdd(newCrop) {
    addCrop(newCrop);
    closeModal();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold text-[var(--color-soil-950)]">Your crops</h2>
          <p className="text-sm text-[var(--color-soil-600)]">Track quantity, market price, demand and expected return for each crop.</p>
        </div>
        <Button icon={PlusCircle} onClick={() => setModalOpen(true)}>Add New Crop</Button>
      </div>

      {crops.status === 'loading' && <LoadingState label="Loading your crops…" />}
      {crops.status === 'error' && <ErrorState onRetry={crops.refetch} />}
      {crops.status === 'success' && crops.data.length === 0 && (
        <EmptyState
          title="No crops added yet"
          description="Add your first crop to get market prices and AI-backed selling recommendations."
          action={<Button icon={PlusCircle} onClick={() => setModalOpen(true)}>Add New Crop</Button>}
        />
      )}
      {crops.status === 'success' && crops.data.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {crops.data.map((crop) => (
            <CropCard key={crop.id} crop={crop} selected={crop.id === selectedCropId} onSelect={setSelectedCropId} />
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={closeModal} title="Add New Crop">
        <AddCropForm onSubmit={handleAdd} onCancel={closeModal} />
      </Modal>
    </div>
  );
}
