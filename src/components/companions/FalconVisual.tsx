import { motion } from 'framer-motion';
import type { StageNumber } from '../../types';

const sizes = { sm: 80, md: 140, lg: 200 };

function Egg({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 100 100">
      <ellipse cx="50" cy="72" rx="20" ry="6" fill="#cbd5e1" opacity="0.3" />
      <path d="M35 58 Q35 38 50 28 Q65 38 65 58 Q65 72 50 74 Q35 72 35 58Z" fill="#bae6fd" />
      <circle cx="42" cy="50" r="2.5" fill="#7dd3fc" opacity="0.5" />
      <circle cx="55" cy="44" r="2" fill="#7dd3fc" opacity="0.5" />
      <circle cx="48" cy="58" r="1.5" fill="#7dd3fc" opacity="0.5" />
      <circle cx="58" cy="55" r="2" fill="#7dd3fc" opacity="0.5" />
      <motion.g
        animate={{ rotate: [0, 1, -1, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{ transformOrigin: '50px 55px' }}
      >
        <path d="M35 58 Q35 38 50 28 Q65 38 65 58 Q65 72 50 74 Q35 72 35 58Z" fill="none" stroke="#93c5fd" strokeWidth="1" />
      </motion.g>
    </svg>
  );
}

function Chick({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 100 100">
      <motion.g
        animate={{ y: [-1, 1, -1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ellipse cx="50" cy="60" rx="16" ry="18" fill="#bae6fd" />
        <circle cx="50" cy="38" r="14" fill="#e0f2fe" />
        <circle cx="44" cy="35" r="3" fill="#1e293b" />
        <circle cx="56" cy="35" r="3" fill="#1e293b" />
        <circle cx="45" cy="34" r="1" fill="white" />
        <circle cx="57" cy="34" r="1" fill="white" />
        <path d="M48 41 L50 45 L52 41" fill="#f59e0b" />
        <motion.g
          animate={{ rotate: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ transformOrigin: '34px 55px' }}
        >
          <ellipse cx="32" cy="55" rx="6" ry="8" fill="#bae6fd" />
        </motion.g>
        <motion.g
          animate={{ rotate: [0, -8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ transformOrigin: '66px 55px' }}
        >
          <ellipse cx="68" cy="55" rx="6" ry="8" fill="#bae6fd" />
        </motion.g>
        <ellipse cx="50" cy="28" rx="6" ry="4" fill="#7dd3fc" opacity="0.6" />
      </motion.g>
      <ellipse cx="43" cy="78" rx="5" ry="3" fill="#f59e0b" />
      <ellipse cx="57" cy="78" rx="5" ry="3" fill="#f59e0b" />
    </svg>
  );
}

function JuvenileFalcon({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 100 100">
      <motion.g
        animate={{ y: [-1, 1, -1] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <ellipse cx="50" cy="58" rx="14" ry="20" fill="#0ea5e9" />
        <ellipse cx="50" cy="55" rx="10" ry="14" fill="#38bdf8" />
        <circle cx="50" cy="32" r="12" fill="#0ea5e9" />
        <circle cx="50" cy="30" r="10" fill="#e0f2fe" />
        <circle cx="46" cy="28" r="2.5" fill="#1e293b" />
        <circle cx="54" cy="28" r="2.5" fill="#1e293b" />
        <circle cx="47" cy="27" r="0.8" fill="white" />
        <circle cx="55" cy="27" r="0.8" fill="white" />
        <path d="M48 34 L50 37 L52 34Z" fill="#f59e0b" />
        <path d="M50 22 L48 18 L52 18Z" fill="#0ea5e9" />
        <motion.path
          d="M36 50 Q20 42 12 50 Q18 52 36 55Z"
          fill="#0284c7"
          animate={{ d: ['M36 50 Q20 42 12 50 Q18 52 36 55Z', 'M36 50 Q22 38 14 46 Q20 50 36 55Z', 'M36 50 Q20 42 12 50 Q18 52 36 55Z'] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.path
          d="M64 50 Q80 42 88 50 Q82 52 64 55Z"
          fill="#0284c7"
          animate={{ d: ['M64 50 Q80 42 88 50 Q82 52 64 55Z', 'M64 50 Q78 38 86 46 Q80 50 64 55Z', 'M64 50 Q80 42 88 50 Q82 52 64 55Z'] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <path d="M44 68 Q46 76 48 78" stroke="#0ea5e9" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M56 68 Q54 76 52 78" stroke="#0ea5e9" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <ellipse cx="44" cy="80" rx="4" ry="2" fill="#f59e0b" />
        <ellipse cx="56" cy="80" rx="4" ry="2" fill="#f59e0b" />
      </motion.g>
    </svg>
  );
}

interface Props {
  stage: StageNumber;
  size: 'sm' | 'md' | 'lg';
}

export function FalconVisual({ stage, size }: Props) {
  const s = sizes[size];
  return (
    <div className="flex items-center justify-center">
      {stage === 0 && <Egg s={s} />}
      {stage === 1 && <Chick s={s} />}
      {stage === 2 && <JuvenileFalcon s={s} />}
    </div>
  );
}
