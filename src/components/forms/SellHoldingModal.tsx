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
  onSold: () => void;
}

export function SellHoldingModal({ holding, isOpen, onClose, onSold }: Props) {
  const sellHolding = useHoldingStore((s) => s.sellHolding);
  const [soldDate, setSoldDate] = useState(today());
  const [soldPrice, setSoldPrice] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!soldDate) errs.soldDate = 'Sell date is required';
    if (soldDate < holding.buyDate) errs.soldDate = 'Sell date must be after buy date';
    if (!soldPrice || Number(soldPrice) <= 0) errs.soldPrice = 'Sale amount must be positive';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    sellHolding(holding.id, soldDate, Number(soldPrice));
    onSold();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sell Holding">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-slate-500">
          Your <strong>{holding.ticker}</strong> companion will graduate to the Hall of Fame.
        </p>
        <Input
          label="Sell Date"
          type="date"
          value={soldDate}
          onChange={(e) => setSoldDate(e.target.value)}
          min={holding.buyDate}
          max={today()}
          error={errors.soldDate}
        />
        <Input
          label="Total Sale Proceeds ($)"
          type="number"
          placeholder="2000.00"
          value={soldPrice}
          onChange={(e) => setSoldPrice(e.target.value)}
          min="0.01"
          step="0.01"
          error={errors.soldPrice}
        />
        <div className="flex gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            Graduate
          </Button>
        </div>
      </form>
    </Modal>
  );
}
