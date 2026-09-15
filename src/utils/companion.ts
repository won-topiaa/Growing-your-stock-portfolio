import type { AssetClass, CompanionConfig, StageNumber } from '../types';
import { COMPANION_CONFIG } from '../constants/companions';

export function getCompanionConfig(assetClass: AssetClass): CompanionConfig {
  return COMPANION_CONFIG[assetClass];
}

export function getStageName(assetClass: AssetClass, stage: StageNumber): string {
  return COMPANION_CONFIG[assetClass].stages[stage].name;
}

export function getStageDescription(assetClass: AssetClass, stage: StageNumber): string {
  return COMPANION_CONFIG[assetClass].stages[stage].description;
}
