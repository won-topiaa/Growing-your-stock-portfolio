import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import type { Holding } from '../../types';
import { useCompanion } from '../../hooks/useCompanion';
import { CompanionVisual } from '../companions/CompanionVisual';
import { formatCurrency, formatDaysHeld, formatDate } from '../../utils/format';

interface Props {
  holding: Holding;
}

export function HallOfFameCard({ holding }: Props) {
  const companion = useCompanion(holding);
  const gain = (holding.soldPrice ?? 0) - holding.costBasis;
  const isProfit = gain >= 0;

  return (
    <motion.div
      className="bg-gradient-to-b from-amber-50 to-white border-2 border-amber-300 rounded-2xl p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start gap-3">
        <CompanionVisual
          type={companion.config.type}
          stage={companion.currentStage}
          size="sm"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-slate-800">{holding.ticker}</span>
          </div>
          <p className="text-xs text-slate-500 truncate">{holding.name}</p>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Return</span>
              <span className={isProfit ? 'text-emerald-600 font-medium' : 'text-red-600 font-medium'}>
                {isProfit ? '+' : ''}{formatCurrency(gain)}
              </span>
            </div>
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
