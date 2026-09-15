export type CompanionType = 'oak-tree' | 'honeybee-colony' | 'falcon';

export type StageNumber = 0 | 1 | 2;

export interface GrowthStage {
  stage: StageNumber;
  name: string;
  description: string;
  daysRequired: number;
}

export interface CompanionConfig {
  type: CompanionType;
  displayName: string;
  colorClass: string;
  stages: [GrowthStage, GrowthStage, GrowthStage];
}
