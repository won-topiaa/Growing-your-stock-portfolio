import { motion } from 'framer-motion';
import type { StageNumber } from '../../types';

const sizes = { sm: 80, md: 140, lg: 200 };

function HoneycombCell({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 100 100">
      <motion.polygon
        points="50,20 72,35 72,65 50,80 28,65 28,35"
        fill="#fde68a" stroke="#f59e0b" strokeWidth="2"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ transformOrigin: '50px 50px' }}
      />
      <motion.ellipse
        cx="50" cy="52" rx="10" ry="12"
        fill="#fef3c7" opacity="0.8"
        animate={{ scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />
      <circle cx="50" cy="50" r="6" fill="#fbbf24" opacity="0.6" />
    </svg>
  );
}

function WorkerBee({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 100 100">
      <polygon points="50,60 65,70 65,85 50,95 35,85 35,70" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.5" opacity="0.4" />
      <motion.g
        animate={{ y: [-2, 2, -2], x: [-1, 1, -1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ellipse cx="50" cy="40" rx="12" ry="14" fill="#fbbf24" />
        <rect x="42" y="34" width="16" height="3" rx="1" fill="#92400e" />
        <rect x="42" y="40" width="16" height="3" rx="1" fill="#92400e" />
        <rect x="42" y="46" width="16" height="3" rx="1" fill="#92400e" />
        <circle cx="50" cy="26" rx="8" ry="8" fill="#fbbf24" />
        <circle cx="46" cy="24" r="2" fill="#1e293b" />
        <circle cx="54" cy="24" r="2" fill="#1e293b" />
        <motion.ellipse
          cx="36" cy="32" rx="10" ry="5"
          fill="#e0f2fe" opacity="0.6"
          transform="rotate(-30 36 32)"
          animate={{ rotate: [-30, -20, -30] }}
          transition={{ duration: 0.3, repeat: Infinity }}
          style={{ transformOrigin: '42px 35px' }}
        />
        <motion.ellipse
          cx="64" cy="32" rx="10" ry="5"
          fill="#e0f2fe" opacity="0.6"
          transform="rotate(30 64 32)"
          animate={{ rotate: [30, 20, 30] }}
          transition={{ duration: 0.3, repeat: Infinity }}
          style={{ transformOrigin: '58px 35px' }}
        />
      </motion.g>
    </svg>
  );
}

function BuzzingColony({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 100 100">
      <g opacity="0.4">
        <polygon points="35,55 45,50 45,60 35,65 25,60 25,50" fill="#fde68a" stroke="#f59e0b" strokeWidth="1" />
        <polygon points="55,55 65,50 65,60 55,65 45,60 45,50" fill="#fde68a" stroke="#f59e0b" strokeWidth="1" />
        <polygon points="45,68 55,63 55,73 45,78 35,73 35,63" fill="#fde68a" stroke="#f59e0b" strokeWidth="1" />
        <polygon points="55,42 65,37 65,47 55,52 45,47 45,37" fill="#fde68a" stroke="#f59e0b" strokeWidth="1" />
        <polygon points="35,42 45,37 45,47 35,52 25,47 25,37" fill="#fde68a" stroke="#f59e0b" strokeWidth="1" />
      </g>
      {[
        { cx: 30, cy: 28, delay: 0 },
        { cx: 65, cy: 22, delay: 0.5 },
        { cx: 72, cy: 42, delay: 1 },
      ].map((bee, i) => (
        <motion.g
          key={i}
          animate={{
            x: [0, 4, -3, 2, 0],
            y: [-2, 1, -3, 2, -2],
          }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: bee.delay }}
        >
          <ellipse cx={bee.cx} cy={bee.cy} rx="6" ry="7" fill="#fbbf24" />
          <rect x={bee.cx - 4} y={bee.cy - 2} width="8" height="2" rx="1" fill="#92400e" />
          <rect x={bee.cx - 4} y={bee.cy + 2} width="8" height="2" rx="1" fill="#92400e" />
          <circle cx={bee.cx} cy={bee.cy - 8} r="4" fill="#fbbf24" />
          <circle cx={bee.cx - 2} cy={bee.cy - 9} r="1" fill="#1e293b" />
          <circle cx={bee.cx + 2} cy={bee.cy - 9} r="1" fill="#1e293b" />
          <ellipse cx={bee.cx - 5} cy={bee.cy - 6} rx="5" ry="3" fill="#e0f2fe" opacity="0.5" />
          <ellipse cx={bee.cx + 5} cy={bee.cy - 6} rx="5" ry="3" fill="#e0f2fe" opacity="0.5" />
        </motion.g>
      ))}
      <motion.circle
        cx="50" cy="55" r="4" fill="#f59e0b" opacity="0.4"
        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </svg>
  );
}

interface Props {
  stage: StageNumber;
  size: 'sm' | 'md' | 'lg';
}

export function HoneybeeVisual({ stage, size }: Props) {
  const s = sizes[size];
  return (
    <div className="flex items-center justify-center">
      {stage === 0 && <HoneycombCell s={s} />}
      {stage === 1 && <WorkerBee s={s} />}
      {stage === 2 && <BuzzingColony s={s} />}
    </div>
  );
}
