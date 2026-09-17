import { useState, type FormEvent } from 'react';
import type { Holding } from '../../types';
import { useHoldingStore } from '../../store/holdingStore';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const today = () => new Date().toISOString().split('T')[0];

interface Props {
  holding: Holding;
  isOpen: boolean;
  onClose: () => void;
}

export function AddBuyModal({ holding, isOpen, onClose }: Props) {
  const addBuy = useHoldingStore((s) => s.addBuy);
  const [date, setDate] = useState(today());
  const [quantity, setQuantity] = useState('');
  const [cost, setCost] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function reset() {
    setDate(today());
    setQuantity('');
    setCost('');
    setErrors({});
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!date) errs.date = 'Date is required';
    else if (date < holding.buyDate) errs.date = 'Must be on or after the first buy';
    else if (date > today()) errs.date = 'Cannot be in the future';
    if (!quantity || Number(quantity) <= 0) errs.quantity = 'Quantity must be positive';
    if (!cost || Number(cost) <= 0) errs.cost = 'Cost must be positive';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    addBuy(holding.id, { date, quantity: Number(quantity), cost: Number(cost) });
    reset();
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Feed Your Companion (Add Shares)">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-slate-500">
          Dollar-cost averaging is nutritional feed — logging an additional purchase of{' '}
          <strong>{holding.ticker}</strong> nourishes its growth.
        </p>
        <Input
          label="Purchase Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={holding.buyDate}
          max={today()}
          error={errors.date}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Quantity (Shares)"
            type="number"
            placeholder="5"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="0.001"
            step="any"
            error={errors.quantity}
          />
          <Input
            label="Amount Invested ($)"
            type="number"
            placeholder="750.00"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            min="0.01"
            step="0.01"
            error={errors.cost}
          />
        </div>
        <div className="flex gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            Add Shares
          </Button>
        </div>
      </form>
    </Modal>
  );
}
