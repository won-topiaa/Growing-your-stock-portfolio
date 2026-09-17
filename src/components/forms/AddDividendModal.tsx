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

export function AddDividendModal({ holding, isOpen, onClose }: Props) {
  const addDividend = useHoldingStore((s) => s.addDividend);
  const [date, setDate] = useState(today());
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function reset() {
    setDate(today());
    setAmount('');
    setErrors({});
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!date) errs.date = 'Date is required';
    else if (date < holding.buyDate) errs.date = 'Must be on or after the first buy';
    else if (date > today()) errs.date = 'Cannot be in the future';
    if (!amount || Number(amount) <= 0) errs.amount = 'Amount must be positive';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    addDividend(holding.id, { date, amount: Number(amount) });
    reset();
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log a Dividend">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-slate-500">
          Dividends are golden berries your <strong>{holding.ticker}</strong> companion produces.
          They count toward your total return.
        </p>
        <Input
          label="Payment Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={holding.buyDate}
          max={today()}
          error={errors.date}
        />
        <Input
          label="Dividend Amount ($)"
          type="number"
          placeholder="12.50"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0.01"
          step="0.01"
          error={errors.amount}
        />
        <div className="flex gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            Log Dividend
          </Button>
        </div>
      </form>
    </Modal>
  );
}
