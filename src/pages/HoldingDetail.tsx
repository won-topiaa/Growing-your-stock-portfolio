import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, TrendingUp, Calendar, Hash, DollarSign, Check } from 'lucide-react';
import { useHoldingStore } from '../store/holdingStore';
import { useCompanion } from '../hooks/useCompanion';
import { CompanionVisual } from '../components/companions/CompanionVisual';
import { GrowthProgressBar } from '../components/companions/GrowthProgressBar';
import { SellHoldingModal } from '../components/forms/SellHoldingModal';
import { Button } from '../components/ui/Button';
import { formatCurrency, formatDate, formatDaysHeld } from '../utils/format';
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
  const [showSellModal, setShowSellModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const companion = useCompanion(holding ?? defaultHolding);
  const costPerShare = holding && holding.quantity > 0 ? holding.costBasis / holding.quantity : 0;

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

  function handleDelete() {
    deleteHolding(holding!.id);
    navigate('/');
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
          <CompanionVisual
            type={companion.config.type}
            stage={companion.currentStage}
            size="lg"
          />
          <h1 className="text-xl font-bold text-slate-800 mt-4">{holding.ticker}</h1>
          <p className="text-sm text-slate-500">{holding.name}</p>
          <p className="text-sm font-medium text-slate-600 mt-1">
            {companion.stageName} — {companion.stageDescription}
          </p>
        </div>

        <div className="px-6 py-4">
          <GrowthProgressBar
            progress={companion.progressToNext}
            colorClass={companion.config.colorClass}
            stageName={companion.stageName}
            nextStageName={companion.nextStageName}
            daysUntilNext={companion.daysUntilNextStage}
          />
        </div>

        <div className="px-6 py-4 border-t border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Holding Details</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Calendar, label: 'Buy Date', value: formatDate(holding.buyDate) },
              { icon: TrendingUp, label: 'Days Held', value: formatDaysHeld(companion.daysHeld) },
              { icon: Hash, label: 'Shares', value: holding.quantity.toString() },
              { icon: DollarSign, label: 'Total Cost', value: formatCurrency(holding.costBasis) },
              { icon: DollarSign, label: 'Cost/Share', value: formatCurrency(costPerShare) },
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
                      reached
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-slate-100 text-slate-400'
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

        {!holding.soldDate && (
          <div className="px-6 py-4 border-t border-slate-100 flex gap-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setShowSellModal(true)}
            >
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

        {holding.soldDate && (
          <div className="px-6 py-4 border-t border-slate-100 bg-amber-50">
            <div className="flex items-center gap-2 text-amber-700">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">
                Graduated on {formatDate(holding.soldDate)} — {formatCurrency(holding.soldPrice ?? 0)}
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
    </div>
  );
}
