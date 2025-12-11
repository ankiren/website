export interface SM2Result {
  easeFactor: number;
  interval: number;
  repetitions: number;
  dueDate: Date;
}

export type Quality = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * SM-2 Algorithm Implementation
 * Quality ratings:
 * 0 - Complete blackout
 * 1 - Incorrect, but remembered upon seeing answer
 * 2 - Incorrect, but easy to recall
 * 3 - Correct with serious difficulty
 * 4 - Correct with some hesitation
 * 5 - Perfect response
 */
export function sm2(
  quality: Quality,
  repetitions: number,
  easeFactor: number,
  interval: number
): SM2Result {
  let newEaseFactor = easeFactor;
  let newInterval = interval;
  let newRepetitions = repetitions;

  if (quality < 3) {
    // Failed recall - reset
    newRepetitions = 0;
    newInterval = 1;
  } else {
    // Successful recall
    if (newRepetitions === 0) {
      newInterval = 1;
    } else if (newRepetitions === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * easeFactor);
    }
    newRepetitions += 1;
  }

  // Update ease factor
  newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  newEaseFactor = Math.max(1.3, newEaseFactor);

  // Calculate due date
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + newInterval);

  return {
    easeFactor: newEaseFactor,
    interval: newInterval,
    repetitions: newRepetitions,
    dueDate,
  };
}

// Map button labels to quality ratings
export const qualityMap = {
  again: 0 as Quality,  // Complete fail
  hard: 2 as Quality,   // Incorrect but remembered
  good: 4 as Quality,   // Correct with hesitation
  easy: 5 as Quality,   // Perfect
};
