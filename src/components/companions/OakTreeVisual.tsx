import { motion } from 'framer-motion';
import type { StageNumber } from '../../types';

const sizes = { sm: 80, md: 140, lg: 200 };

function Seed({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 100 100">
      <motion.ellipse
        cx="50" cy="60" rx="12" ry="16"
        fill="#92400e"
        animate={{ rotate: [0, 2, -2, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.ellipse
        cx="50" cy="56" rx="8" ry="6"
        fill="#a16207"
      />
      <motion.path
        d="M50 44 Q52 36 48 28"
        stroke="#059669"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        animate={{ pathLength: [0.8, 1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <rect x="42" y="76" width="16" height="4" rx="2" fill="#d4a373" opacity="0.5" />
    </svg>
  );
}

function Sprout({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 100 100">
      <rect x="44" y="80" width="12" height="4" rx="2" fill="#a16207" opacity="0.4" />
      <motion.line
        x1="50" y1="82" x2="50" y2="45"
        stroke="#059669" strokeWidth="3" strokeLinecap="round"
        animate={{ x2: [50, 51, 49, 50] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.ellipse
        cx="38" cy="42" rx="10" ry="7"
        fill="#34d399"
        animate={{ rotate: [-5, 5, -5], originX: '48px', originY: '45px' }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.ellipse
        cx="62" cy="38" rx="10" ry="7"
        fill="#10b981"
        animate={{ rotate: [5, -5, 5], originX: '52px', originY: '42px' }}
        transition={{ duration: 3.5, repeat: Infinity }}
      />
      <motion.ellipse
        cx="50" cy="32" rx="8" ry="6"
        fill="#6ee7b7"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />
    </svg>
  );
}

function Sapling({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 100 100">
      <rect x="30" y="86" width="40" height="4" rx="2" fill="#a16207" opacity="0.3" />
      <line x1="50" y1="88" x2="50" y2="40" stroke="#92400e" strokeWidth="4" strokeLinecap="round" />
      <line x1="50" y1="60" x2="36" y2="50" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="55" x2="66" y2="44" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" />
      <motion.g
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{ transformOrigin: '50px 40px' }}
      >
        <ellipse cx="50" cy="28" rx="20" ry="14" fill="#10b981" />
        <ellipse cx="36" cy="36" rx="14" ry="10" fill="#34d399" />
        <ellipse cx="64" cy="34" rx="14" ry="10" fill="#059669" />
        <ellipse cx="50" cy="22" rx="14" ry="10" fill="#6ee7b7" opacity="0.7" />
      </motion.g>
      <motion.circle
        cx="30" cy="44" r="2" fill="#fbbf24" opacity="0.6"
        animate={{ y: [0, -4, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </svg>
  );
}

interface Props {
  stage: StageNumber;
  size: 'sm' | 'md' | 'lg';
}

export function OakTreeVisual({ stage, size }: Props) {
  const s = sizes[size];
  return (
    <div className="flex items-center justify-center">
      {stage === 0 && <Seed s={s} />}
      {stage === 1 && <Sprout s={s} />}
      {stage === 2 && <Sapling s={s} />}
    </div>
  );
}
