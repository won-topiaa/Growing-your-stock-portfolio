import { useState, type FormEvent } from 'react';
import { Sparkles, Wind } from 'lucide-react';
import type { Holding, SellReason } from '../../types';
import { useHoldingStore } from '../../store/holdingStore';
import { getTotalCost, getTotalDividends } from '../../utils/performance';
import { formatCurrency } from '../../utils/format';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

const today = () => new Date().toISOString().split('T')[0];

const REASON_OPTIONS = [
  { value: 'profit-target', label: 'Hit my profit target' },
  { value: 'rebalance', label: 'Rebalancing my portfolio' },
  { value: 'stop-loss', label: 'Cutting losses (stop-loss)' },
];

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
  const [sellReason, setSellReason] = useState<SellReason>('profit-target');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalCost = getTotalCost(holding);
  const dividends = getTotalDividends(holding);
  const proceeds = Number(soldPrice) || 0;
  const totalReturn = proceeds + dividends - totalCost;
  const willAscend = sellReason !== 'stop-loss' && totalReturn >= 0;

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
    sellHolding(holding.id, soldDate, Number(soldPrice), sellReason);
    onSold();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Graduate Holding">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-slate-500">
          Recording a sale graduates your <strong>{holding.ticker}</strong> companion to the
          Hall of Fame — it is never lost.
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
        <Select
          label="Reason for Selling"
          options={REASON_OPTIONS}
          value={sellReason}
          onChange={(e) => setSellReason(e.target.value as SellReason)}
        />

        {soldPrice && Number(soldPrice) > 0 && (
          <div
            className={`rounded-lg p-3 text-sm ${
              willAscend
                ? 'bg-emerald-50 border border-emerald-200'
                : 'bg-amber-50 border border-amber-200'
            }`}
          >
            <div className="flex items-center gap-2 font-medium">
              {willAscend ? (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-800">Ascension Ceremony</span>
                </>
              ) : (
                <>
                  <Wind className="w-4 h-4 text-amber-600" />
                  <span className="text-amber-800">Peaceful Relocation</span>
                </>
              )}
            </div>
            <p className={`mt-1 ${willAscend ? 'text-emerald-700' : 'text-amber-700'}`}>
              Total return {totalReturn >= 0 ? '+' : ''}{formatCurrency(totalReturn)}
              {dividends > 0 && ` (incl. ${formatCurrency(dividends)} dividends)`}
            </p>
          </div>
        )}

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
