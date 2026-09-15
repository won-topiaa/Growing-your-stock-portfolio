import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, ArrowLeft } from 'lucide-react';
import { useHoldingStore } from '../store/holdingStore';
import { HallOfFameCard } from '../components/cards/HallOfFameCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';

export function HallOfFame() {
  const allHoldings = useHoldingStore((s) => s.holdings);
  const sorted = allHoldings.filter((h) => h.soldDate).sort(
    (a, b) => new Date(b.soldDate!).getTime() - new Date(a.soldDate!).getTime(),
  );

  return (
    <div>
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4 md:hidden">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>
      <h1 className="text-xl font-bold text-slate-800 mb-1 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-amber-500" />
        Hall of Fame
      </h1>
      <p className="text-sm text-slate-500 mb-6">
        Companions that have graduated from your portfolio
      </p>

      {sorted.length === 0 ? (
        <EmptyState
          icon={<Trophy className="w-16 h-16" />}
          title="No graduated companions yet"
          description="When you sell a holding, your companion will be honored here."
          action={
            <Link to="/">
              <Button variant="secondary">Back to Dashboard</Button>
            </Link>
          }
        />
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        >
          {sorted.map((holding) => (
            <motion.div
              key={holding.id}
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            >
              <HallOfFameCard holding={holding} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
