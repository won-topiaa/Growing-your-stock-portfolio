import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gem, AlertTriangle, Coins } from 'lucide-react';
import type { Holding } from '../../types';
import { useCompanion } from '../../hooks/useCompanion';
import { CompanionVisual } from '../companions/CompanionVisual';
import { GrowthProgressBar } from '../companions/GrowthProgressBar';
import { formatDaysHeld } from '../../utils/format';
import { getHealthState, getUnrealizedReturn, formatPercent } from '../../utils/performance';

const bgColors: Record<string, string> = {
  oak: 'from-oak-50 to-white border-oak-200',
  bee: 'from-bee-50 to-white border-bee-200',
  falcon: 'from-falcon-50 to-white border-falcon-200',
};

const badgeColors: Record<string, string> = {
  oak: 'bg-oak-100 text-oak-700',
  bee: 'bg-bee-100 text-bee-700',
  falcon: 'bg-falcon-100 text-falcon-700',
};

interface Props {
  holding: Holding;
}

export function CompanionCard({ holding }: Props) {
  const companion = useCompanion(holding);
  const color = companion.config.colorClass;
  const health = getHealthState(holding);
  const unrealized = getUnrealizedReturn(holding);
  const hasDCA = (holding.additionalBuys?.length ?? 0) > 0;

  return (
    <Link to={`/holding/${holding.id}`}>
      <motion.div
        className={`bg-gradient-to-b ${bgColors[color]} border rounded-2xl p-4 cursor-pointer`}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="flex flex-col items-center gap-3">
          <CompanionVisual type={companion.config.type} stage={companion.currentStage} size="sm" />
          <div className="text-center">
            <p className="font-semibold text-slate-800">{holding.ticker}</p>
            <p className="text-xs text-slate-500 truncate max-w-[140px]">{holding.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeColors[color]}`}>
              {companion.stageName}
            </span>
            <span className="text-xs text-slate-400">{formatDaysHeld(companion.daysHeld)}</span>
          </div>

          {(unrealized || health !== 'healthy' || hasDCA) && (
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              {unrealized && (
                <span
                  className={`text-[11px] font-semibold ${
                    unrealized.totalReturn >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {formatPercent(unrealized.pct)}
                </span>
              )}
              {health === 'resilient' && (
                <span className="inline-flex items-center text-indigo-500" title="Diamond Hands">
                  <Gem className="w-3.5 h-3.5" />
                </span>
              )}
              {health === 'warning' && (
                <span className="inline-flex items-center text-red-500" title="Needs a checkup">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </span>
              )}
              {hasDCA && (
                <span className="inline-flex items-center text-amber-500" title="Fed with DCA">
                  <Coins className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
          )}

          <GrowthProgressBar
            progress={companion.progressToNext}
            colorClass={color}
            stageName={companion.stageName}
            nextStageName={companion.nextStageName}
            daysUntilNext={companion.daysUntilNextStage}
          />
        </div>
      </motion.div>
    </Link>
  );
}
