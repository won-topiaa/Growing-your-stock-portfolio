import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Trash2, TrendingUp, TrendingDown, Calendar, Hash, DollarSign, Check,
  Gem, AlertTriangle, Plus, Coins, Sparkles, Wind, Pencil,
} from 'lucide-react';
import { useHoldingStore } from '../store/holdingStore';
import { useCompanion } from '../hooks/useCompanion';
import { CompanionVisual } from '../components/companions/CompanionVisual';
import { GrowthProgressBar } from '../components/companions/GrowthProgressBar';
import { SellHoldingModal } from '../components/forms/SellHoldingModal';
import { AddBuyModal } from '../components/forms/AddBuyModal';
import { AddDividendModal } from '../components/forms/AddDividendModal';
import { Button } from '../components/ui/Button';
import { formatCurrency, formatDate, formatDaysHeld } from '../utils/format';
import {
  getTotalCost, getTotalQuantity, getTotalDividends, getBuyCount,
  getUnrealizedReturn, getRealizedReturn, getDrawdown, getHealthState, getExitType,
  formatPercent,
} from '../utils/performance';
import { STAGE_THRESHOLDS } from '../constants/companions';
import type { Holding } from '../types';

const stageLabels = ['Stage 0: Inception', 'Stage 1: Hatchling', 'Stage 2: Juvenile'];

const defaultHolding: Holding = {
  id: '', ticker: '', name: '', buyDate: '2024-01-01',
  quantity: 0, costBasis: 0, assetClass: 'broad-market-etf',
};

export function HoldingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const allHoldings = useHoldingStore((s) => s.holdings);
  const holding = useMemo(() => allHoldings.find((h) => h.id === id), [allHoldings, id]);
  const deleteHolding = useHoldingStore((s) => s.deleteHolding);
  const updateCurrentValue = useHoldingStore((s) => s.updateCurrentValue);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showDividendModal, setShowDividendModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingValue, setEditingValue] = useState(false);
  const [valueInput, setValueInput] = useState('');

  const companion = useCompanion(holding ?? defaultHolding);

  if (!holding) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500 mb-4">Holding not found</p>
        <Link to="/">
          <Button variant="secondary">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const isSold = Boolean(holding.soldDate);
  const totalCost = getTotalCost(holding);
  const totalQty = getTotalQuantity(holding);
  const totalDividends = getTotalDividends(holding);
  const buyCount = getBuyCount(holding);
  const costPerShare = totalQty > 0 ? totalCost / totalQty : 0;
  const unrealized = getUnrealizedReturn(holding);
  const realized = getRealizedReturn(holding);
  const drawdown = getDrawdown(holding);
  const health = getHealthState(holding);
  const exitType = getExitType(holding);

  function handleDelete() {
    deleteHolding(holding!.id);
    navigate('/');
  }

  function openValueEditor() {
    setValueInput(holding!.currentValue != null ? String(holding!.currentValue) : '');
    setEditingValue(true);
  }

  function saveValue() {
    const val = Number(valueInput);
    if (val > 0) updateCurrentValue(holding!.id, val);
    setEditingValue(false);
  }

  const bgClass = companion.config.colorClass === 'oak'
    ? 'bg-gradient-to-b from-oak-50 to-white'
    : companion.config.colorClass === 'bee'
    ? 'bg-gradient-to-b from-bee-50 to-white'
    : 'bg-gradient-to-b from-falcon-50 to-white';

  return (
    <div className="max-w-lg mx-auto">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <motion.div
        className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={`py-8 flex flex-col items-center ${bgClass}`}>
          <CompanionVisual type={companion.config.type} stage={companion.currentStage} size="lg" />
          <h1 className="text-xl font-bold text-slate-800 mt-4">{holding.ticker}</h1>
          <p className="text-sm text-slate-500">{holding.name}</p>
          <p className="text-sm font-medium text-slate-600 mt-1">
            {companion.stageName} — {companion.stageDescription}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
            {health === 'resilient' && (
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700">
                <Gem className="w-3.5 h-3.5" /> Diamond Hands
              </span>
            )}
            {isSold && (
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                  exitType === 'ascension' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {exitType === 'ascension' ? <Sparkles className="w-3.5 h-3.5" /> : <Wind className="w-3.5 h-3.5" />}
                {exitType === 'ascension' ? 'Ascended' : 'Relocated'}
              </span>
            )}
          </div>
        </div>

        {health === 'warning' && (
          <div className="px-6 py-3 bg-red-50 border-t border-red-100 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
            <p className="text-xs text-red-700">
              This position is down sharply. Growth alone isn't a reason to hold — reassess the
              fundamentals rather than clinging on out of attachment.
            </p>
          </div>
        )}

        {!isSold && (
          <div className="px-6 py-4">
            <GrowthProgressBar
              progress={companion.progressToNext}
              colorClass={companion.config.colorClass}
              stageName={companion.stageName}
              nextStageName={companion.nextStageName}
              daysUntilNext={companion.daysUntilNextStage}
            />
          </div>
        )}

        {/* Performance */}
        <div className="px-6 py-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-700">Performance</h2>
            {!isSold && !editingValue && (
              <button
                onClick={openValueEditor}
                className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700"
              >
                <Pencil className="w-3.5 h-3.5" />
                {holding.currentValue != null ? 'Update value' : 'Add current value'}
              </button>
            )}
          </div>

          {editingValue && (
            <div className="mb-3 flex items-end gap-2">
              <div className="flex-1">
                <label className="text-xs text-slate-500">Current market value ($)</label>
                <input
                  type="number"
                  autoFocus
                  aria-label="Current market value ($)"
                  value={valueInput}
                  onChange={(e) => setValueInput(e.target.value)}
                  placeholder={formatCurrency(totalCost)}
                  min="0.01"
                  step="0.01"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                />
              </div>
              <Button onClick={saveValue} className="!py-2">Save</Button>
              <Button variant="secondary" onClick={() => setEditingValue(false)} className="!py-2">Cancel</Button>
            </div>
          )}

          {isSold && realized ? (
            <div className="grid grid-cols-2 gap-3">
              <Stat
                label="Total Return"
                value={`${realized.totalReturn >= 0 ? '+' : ''}${formatCurrency(realized.totalReturn)}`}
                sub={formatPercent(realized.pct)}
                positive={realized.totalReturn >= 0}
              />
              {realized.cagr != null && (
                <Stat label="Annualized (CAGR)" value={formatPercent(realized.cagr)} positive={realized.cagr >= 0} />
              )}
            </div>
          ) : unrealized ? (
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Current Value" value={formatCurrency(holding.currentValue!)} />
              <Stat
                label="Unrealized Return"
                value={`${unrealized.totalReturn >= 0 ? '+' : ''}${formatCurrency(unrealized.totalReturn)}`}
                sub={formatPercent(unrealized.pct)}
                positive={unrealized.totalReturn >= 0}
              />
              {unrealized.cagr != null && (
                <Stat label="Annualized (CAGR)" value={formatPercent(unrealized.cagr)} positive={unrealized.cagr >= 0} />
              )}
              {drawdown != null && drawdown < 0 && (
                <Stat label="Drawdown" value={formatPercent(drawdown)} positive={false} />
              )}
            </div>
          ) : (
            !editingValue && (
              <p className="text-xs text-slate-400">
                Add the position's current value to track unrealized return, CAGR, and drawdown.
              </p>
            )
          )}
        </div>

        {/* Holding details */}
        <div className="px-6 py-4 border-t border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Holding Details</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Calendar, label: 'First Buy', value: formatDate(holding.buyDate) },
              { icon: TrendingUp, label: 'Days Held', value: formatDaysHeld(companion.daysHeld) },
              { icon: Hash, label: 'Total Shares', value: totalQty.toString() },
              { icon: DollarSign, label: 'Total Invested', value: formatCurrency(totalCost) },
              { icon: DollarSign, label: 'Avg Cost/Share', value: formatCurrency(costPerShare) },
              { icon: Coins, label: 'Purchases', value: `${buyCount}${buyCount > 1 ? ' (incl. DCA)' : ''}` },
            ].map((stat) => (
              <div key={stat.label} className="flex items-start gap-2">
                <stat.icon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                  <p className="text-sm font-medium text-slate-800">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Catalysts */}
        <div className="px-6 py-4 border-t border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Growth Catalysts</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5">
              <div>
                <p className="text-sm font-medium text-slate-700">Nutritional Feed (DCA)</p>
                <p className="text-xs text-slate-500">
                  {(holding.additionalBuys?.length ?? 0) === 0
                    ? 'No additional buys yet'
                    : `${holding.additionalBuys!.length} added · ${formatCurrency(totalCost - holding.costBasis)} invested`}
                </p>
              </div>
              {!isSold && (
                <Button variant="secondary" onClick={() => setShowBuyModal(true)} className="!px-2.5 !py-1.5 text-xs">
                  <Plus className="w-3.5 h-3.5" /> Feed
                </Button>
              )}
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5">
              <div>
                <p className="text-sm font-medium text-slate-700">Dividends (Golden Berries)</p>
                <p className="text-xs text-slate-500">
                  {(holding.dividends?.length ?? 0) === 0
                    ? 'No dividends logged yet'
                    : `${holding.dividends!.length} payments · ${formatCurrency(totalDividends)} captured`}
                </p>
              </div>
              {!isSold && (
                <Button variant="secondary" onClick={() => setShowDividendModal(true)} className="!px-2.5 !py-1.5 text-xs">
                  <Plus className="w-3.5 h-3.5" /> Log
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Growth timeline */}
        <div className="px-6 py-4 border-t border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Growth Timeline</h2>
          <div className="space-y-3">
            {companion.config.stages.map((stage, i) => {
              const reached = companion.daysHeld >= STAGE_THRESHOLDS[i];
              const isCurrent = companion.currentStage === i;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      reached ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                    } ${isCurrent ? 'ring-2 ring-emerald-400 ring-offset-1' : ''}`}
                  >
                    {reached ? <Check className="w-3.5 h-3.5" /> : <span className="text-xs">{i}</span>}
                  </div>
                  <div>
                    <p className={`text-sm ${reached ? 'text-slate-800 font-medium' : 'text-slate-400'}`}>
                      {stageLabels[i]}: {stage.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {STAGE_THRESHOLDS[i] === 0 ? 'Day 0' : `Day ${STAGE_THRESHOLDS[i]}+`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {!isSold && (
          <div className="px-6 py-4 border-t border-slate-100 flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => setShowSellModal(true)}>
              Graduate (Sell)
            </Button>
            {showDeleteConfirm ? (
              <div className="flex gap-2">
                <Button variant="danger" onClick={handleDelete}>Confirm</Button>
                <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
              </div>
            ) : (
              <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}

        {isSold && (
          <div className={`px-6 py-4 border-t border-slate-100 ${exitType === 'ascension' ? 'bg-emerald-50' : 'bg-slate-50'}`}>
            <div className={`flex items-center gap-2 ${exitType === 'ascension' ? 'text-emerald-700' : 'text-slate-600'}`}>
              {realized && (realized.totalReturn >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />)}
              <span className="text-sm font-medium">
                Graduated on {formatDate(holding.soldDate!)} — {formatCurrency(holding.soldPrice ?? 0)}
              </span>
            </div>
          </div>
        )}
      </motion.div>

      <SellHoldingModal
        holding={holding}
        isOpen={showSellModal}
        onClose={() => setShowSellModal(false)}
        onSold={() => {
          setShowSellModal(false);
          navigate('/hall-of-fame');
        }}
      />
      <AddBuyModal holding={holding} isOpen={showBuyModal} onClose={() => setShowBuyModal(false)} />
      <AddDividendModal holding={holding} isOpen={showDividendModal} onClose={() => setShowDividendModal(false)} />
    </div>
  );
}

interface StatProps {
  label: string;
  value: string;
  sub?: string;
  positive?: boolean;
}

function Stat({ label, value, sub, positive }: StatProps) {
  const color = positive === undefined ? 'text-slate-800' : positive ? 'text-emerald-600' : 'text-red-600';
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`text-sm font-semibold ${color}`}>
        {value}
        {sub && <span className="ml-1 text-xs font-normal text-slate-400">{sub}</span>}
      </p>
    </div>
  );
}
