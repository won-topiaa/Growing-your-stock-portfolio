import { motion } from 'framer-motion';

interface Props {
  progress: number;
  colorClass: string;
  stageName: string;
  nextStageName: string | null;
  daysUntilNext: number | null;
}

const barColors: Record<string, { bg: string; fill: string }> = {
  oak: { bg: 'bg-oak-100', fill: 'bg-oak-500' },
  bee: { bg: 'bg-bee-100', fill: 'bg-bee-500' },
  falcon: { bg: 'bg-falcon-100', fill: 'bg-falcon-500' },
};

export function GrowthProgressBar({ progress, colorClass, stageName, nextStageName, daysUntilNext }: Props) {
  const colors = barColors[colorClass] ?? barColors.oak;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-slate-600">{stageName}</span>
        {nextStageName ? (
          <span className="text-xs text-slate-400">
            {daysUntilNext}d to {nextStageName}
          </span>
        ) : (
          <span className="text-xs text-emerald-600 font-medium">Max Stage</span>
        )}
      </div>
      <div className={`h-2 rounded-full ${colors.bg} overflow-hidden`}>
        <motion.div
          className={`h-full rounded-full ${colors.fill}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        />
      </div>
    </div>
  );
}
