export interface Runner {
  id: string;
  name: string;
  color: string;
}

export type PhaseId = '5k-nonstop' | '5k-speed' | '10k-nonstop' | '10k-speed';

export type WorkoutType =
  | 'interval'
  | 'continuous'
  | 'easy'
  | 'tempo'
  | 'long'
  | 'rest'
  | 'timetrial';

export interface Workout {
  id: string;
  phaseId: PhaseId;
  week: number;
  day: number;
  title: string;
  description: string;
  type: WorkoutType;
  targetDurationMin?: number;
  targetDistanceKm?: number;
}

export interface Phase {
  id: PhaseId;
  title: string;
  shortTitle: string;
  goal: string;
  totalWeeks: number;
  daysPerWeek: number;
  workouts: Workout[];
}

export interface RunLog {
  id: string;
  runnerId: string;
  dateISO: string;
  distanceKm: number;
  durationSec: number;
  workoutId?: string;
  phaseId?: PhaseId;
  noWalking?: boolean;
  notes?: string;
}

export interface RunnerProgress {
  completedWorkoutIds: string[];
  currentPhaseId: PhaseId;
}
