import type { StageNumber } from '../types';
import { STAGE_THRESHOLDS } from '../constants/companions';

export function getDaysHeld(buyDate: string): number {
  const buy = new Date(buyDate + 'T00:00:00');
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.floor((today.getTime() - buy.getTime()) / 86_400_000));
}

export function calculateStage(daysHeld: number): StageNumber {
  if (daysHeld >= STAGE_THRESHOLDS[2]) return 2;
  if (daysHeld >= STAGE_THRESHOLDS[1]) return 1;
  return 0;
}

export function getNextStageDays(currentStage: StageNumber): number | null {
  if (currentStage >= 2) return null;
  return STAGE_THRESHOLDS[currentStage + 1];
}

export function getProgressToNextStage(daysHeld: number, currentStage: StageNumber): number {
  const nextDays = getNextStageDays(currentStage);
  if (nextDays === null) return 100;
  const currentDays = STAGE_THRESHOLDS[currentStage];
  const range = nextDays - currentDays;
  const elapsed = daysHeld - currentDays;
  return Math.min(100, Math.max(0, (elapsed / range) * 100));
}
