import { motion } from 'framer-motion';
import { Trophy, Sparkles, Wind } from 'lucide-react';
import type { Holding } from '../../types';
import { useCompanion } from '../../hooks/useCompanion';
import { CompanionVisual } from '../companions/CompanionVisual';
import { formatCurrency, formatDaysHeld, formatDate } from '../../utils/format';
import {
  getRealizedReturn,
  getExitType,
  getTotalDividends,
  formatPercent,
} from '../../utils/performance';

interface Props {
  holding: Holding;
}

export function HallOfFameCard({ holding }: Props) {
  const companion = useCompanion(holding);
  const realized = getRealizedReturn(holding);
  const exitType = getExitType(holding);
  const dividends = getTotalDividends(holding);
  const isAscension = exitType === 'ascension';
  const isProfit = (realized?.totalReturn ?? 0) >= 0;

  return (
    <motion.div
      className={`rounded-2xl p-4 border-2 bg-gradient-to-b ${
        isAscension
          ? 'from-amber-50 to-white border-amber-300'
          : 'from-slate-50 to-white border-slate-300'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start gap-3">
        <CompanionVisual type={companion.config.type} stage={companion.currentStage} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className={`w-4 h-4 ${isAscension ? 'text-amber-500' : 'text-slate-400'}`} />
            <span className="font-semibold text-slate-800">{holding.ticker}</span>
          </div>
          <p className="text-xs text-slate-500 truncate">{holding.name}</p>

          <div
            className={`mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
              isAscension ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
            }`}
          >
            {isAscension ? <Sparkles className="w-3 h-3" /> : <Wind className="w-3 h-3" />}
            {isAscension ? 'Ascension' : 'Peaceful Relocation'}
          </div>

          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Total Return</span>
              <span className={isProfit ? 'text-emerald-600 font-medium' : 'text-red-600 font-medium'}>
                {isProfit ? '+' : ''}{formatCurrency(realized?.totalReturn ?? 0)}
                {realized && <> ({formatPercent(realized.pct)})</>}
              </span>
            </div>
            {realized?.cagr != null && (
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Annualized (CAGR)</span>
                <span className={realized.cagr >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                  {formatPercent(realized.cagr)}
                </span>
              </div>
            )}
            {dividends > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Dividends Captured</span>
                <span className="text-slate-700">{formatCurrency(dividends)}</span>
              </div>
            )}
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Held</span>
              <span className="text-slate-700">{formatDaysHeld(companion.daysHeld)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Graduated</span>
              <span className="text-slate-700">{holding.soldDate ? formatDate(holding.soldDate) : '-'}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
