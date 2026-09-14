import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, Plus } from 'lucide-react';
import { useHoldingStore } from '../store/holdingStore';
import { CompanionCard } from '../components/cards/CompanionCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Dashboard() {
  const allHoldings = useHoldingStore((s) => s.holdings);
  const sorted = allHoldings.filter((h) => !h.soldDate).sort(
    (a, b) => new Date(a.buyDate).getTime() - new Date(b.buyDate).getTime(),
  );

  if (sorted.length === 0) {
    return (
      <EmptyState
        icon={<Sprout className="w-16 h-16" />}
        title="Your portfolio garden is empty"
        description="Add your first stock holding and watch your companion grow!"
        action={
          <Link to="/add">
            <Button>Add Your First Holding</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800 md:hidden flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-600" />
            Companion Portfolio
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {sorted.length} companion{sorted.length !== 1 ? 's' : ''} growing
          </p>
        </div>
        <Link to="/add" className="md:hidden">
          <Button className="!px-3 !py-2">
            <Plus className="w-4 h-4" />
          </Button>
        </Link>
      </div>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {sorted.map((holding) => (
          <motion.div key={holding.id} variants={item}>
            <CompanionCard holding={holding} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
