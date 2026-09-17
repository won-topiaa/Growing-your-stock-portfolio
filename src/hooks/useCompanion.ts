import { useMemo } from 'react';
import type { Holding } from '../types';
import { getCompanionConfig } from '../utils/companion';
import { calculateStage, getProgressToNextStage, getNextStageDays } from '../utils/growth';
import { daysBetween } from '../utils/performance';

export function useCompanion(holding: Holding) {
  return useMemo(() => {
    const config = getCompanionConfig(holding.assetClass);
    const daysHeld = daysBetween(holding.buyDate, holding.soldDate);
    const currentStage = calculateStage(daysHeld);
    const stageInfo = config.stages[currentStage];
    const nextStageDays = getNextStageDays(currentStage);
    const nextStage = currentStage < 2 ? config.stages[currentStage + 1] : null;

    return {
      config,
      daysHeld,
      currentStage,
      stageName: stageInfo.name,
      stageDescription: stageInfo.description,
      progressToNext: getProgressToNextStage(daysHeld, currentStage),
      nextStageName: nextStage?.name ?? null,
      daysUntilNextStage: nextStageDays !== null ? Math.max(0, nextStageDays - daysHeld) : null,
    };
  }, [holding.assetClass, holding.buyDate, holding.soldDate]);
}
