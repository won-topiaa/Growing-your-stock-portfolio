import type { AssetClass, CompanionConfig } from '../types';

export const COMPANION_CONFIG: Record<AssetClass, CompanionConfig> = {
  'broad-market-etf': {
    type: 'oak-tree',
    displayName: 'Oak Tree',
    colorClass: 'oak',
    stages: [
      { stage: 0, name: 'Seed', description: 'A small acorn, full of potential', daysRequired: 0 },
      { stage: 1, name: 'Sprout', description: 'First green leaves have appeared!', daysRequired: 30 },
      { stage: 2, name: 'Sapling', description: 'Growing strong with branching limbs', daysRequired: 90 },
    ],
  },
  dividend: {
    type: 'honeybee-colony',
    displayName: 'Honeybee Colony',
    colorClass: 'bee',
    stages: [
      { stage: 0, name: 'Honeycomb Cell', description: 'A single golden cell, waiting to hatch', daysRequired: 0 },
      { stage: 1, name: 'Worker Bee', description: 'A busy bee has emerged!', daysRequired: 30 },
      { stage: 2, name: 'Buzzing Colony', description: 'The colony is thriving and producing honey', daysRequired: 90 },
    ],
  },
  'high-growth-tech': {
    type: 'falcon',
    displayName: 'Falcon',
    colorClass: 'falcon',
    stages: [
      { stage: 0, name: 'Egg', description: 'A speckled egg resting in a warm nest', daysRequired: 0 },
      { stage: 1, name: 'Chick', description: 'A fluffy chick with bright eyes', daysRequired: 30 },
      { stage: 2, name: 'Juvenile Falcon', description: 'Wings spread wide, ready to soar', daysRequired: 90 },
    ],
  },
};

export const STAGE_THRESHOLDS = [0, 30, 90] as const;
