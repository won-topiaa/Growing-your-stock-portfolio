import type { CompanionType, StageNumber } from '../../types';
import { OakTreeVisual } from './OakTreeVisual';
import { HoneybeeVisual } from './HoneybeeVisual';
import { FalconVisual } from './FalconVisual';

interface Props {
  type: CompanionType;
  stage: StageNumber;
  size?: 'sm' | 'md' | 'lg';
}

export function CompanionVisual({ type, stage, size = 'md' }: Props) {
  switch (type) {
    case 'oak-tree':
      return <OakTreeVisual stage={stage} size={size} />;
    case 'honeybee-colony':
      return <HoneybeeVisual stage={stage} size={size} />;
    case 'falcon':
      return <FalconVisual stage={stage} size={size} />;
  }
}
