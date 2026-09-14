import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AssetClass } from '../../types';
import { useHoldingStore } from '../../store/holdingStore';
import { TICKER_SUGGESTIONS } from '../../constants/tickers';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

const ASSET_OPTIONS = [
  { value: 'broad-market-etf', label: 'Broad Market ETF (Oak Tree)' },
  { value: 'dividend', label: 'Dividend Stock (Honeybee Colony)' },
  { value: 'high-growth-tech', label: 'High-Growth Tech (Falcon)' },
];

const today = () => new Date().toISOString().split('T')[0];

export function AddHoldingForm() {
  const navigate = useNavigate();
  const addHolding = useHoldingStore((s) => s.addHolding);

  const [ticker, setTicker] = useState('');
  const [name, setName] = useState('');
  const [buyDate, setBuyDate] = useState(today());
  const [quantity, setQuantity] = useState('');
  const [costBasis, setCostBasis] = useState('');
  const [assetClass, setAssetClass] = useState<AssetClass>('broad-market-etf');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleTickerChange(value: string) {
    const upper = value.toUpperCase();
    setTicker(upper);
    const suggestion = TICKER_SUGGESTIONS[upper];
    if (suggestion) {
      if (!name) setName(suggestion.name);
      setAssetClass(suggestion.assetClass);
    }
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!ticker.trim()) errs.ticker = 'Ticker is required';
    if (!name.trim()) errs.name = 'Name is required';
    if (!buyDate) errs.buyDate = 'Buy date is required';
    if (buyDate > today()) errs.buyDate = 'Buy date cannot be in the future';
    if (!quantity || Number(quantity) <= 0) errs.quantity = 'Quantity must be positive';
    if (!costBasis || Number(costBasis) <= 0) errs.costBasis = 'Cost must be positive';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    addHolding({
      ticker: ticker.trim(),
      name: name.trim(),
      buyDate,
      quantity: Number(quantity),
      costBasis: Number(costBasis),
      assetClass,
    });
    navigate('/');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Ticker Symbol"
        placeholder="e.g. SPY, AAPL, KO"
        value={ticker}
        onChange={(e) => handleTickerChange(e.target.value)}
        error={errors.ticker}
        maxLength={10}
      />
      <Input
        label="Display Name"
        placeholder="e.g. Apple Inc."
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
      />
      <Input
        label="Buy Date"
        type="date"
        value={buyDate}
        onChange={(e) => setBuyDate(e.target.value)}
        max={today()}
        error={errors.buyDate}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Quantity (Shares)"
          type="number"
          placeholder="10"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="0.001"
          step="any"
          error={errors.quantity}
        />
        <Input
          label="Total Cost ($)"
          type="number"
          placeholder="1500.00"
          value={costBasis}
          onChange={(e) => setCostBasis(e.target.value)}
          min="0.01"
          step="0.01"
          error={errors.costBasis}
        />
      </div>
      <Select
        label="Asset Class"
        options={ASSET_OPTIONS}
        value={assetClass}
        onChange={(e) => setAssetClass(e.target.value as AssetClass)}
      />
      <div className="pt-2">
        <Button type="submit" className="w-full">
          Add Holding
        </Button>
      </div>
    </form>
  );
}
