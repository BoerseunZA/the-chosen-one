import AsyncStorage from '@react-native-async-storage/async-storage';
import { Runner, RunLog, RunnerProgress, PhaseId } from './types';

const RUNNERS_KEY = 'runtogether:runners';
const ACTIVE_RUNNER_KEY = 'runtogether:activeRunnerId';
const runsKey = (runnerId: string) => `runtogether:runs:${runnerId}`;
const progressKey = (runnerId: string) => `runtogether:progress:${runnerId}`;

async function getJSON<T>(key: string, fallback: T): Promise<T> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setJSON(key: string, value: unknown): Promise<void> {
  return AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function getRunners(): Promise<Runner[]> {
  return getJSON<Runner[]>(RUNNERS_KEY, []);
}

export function saveRunners(runners: Runner[]): Promise<void> {
  return setJSON(RUNNERS_KEY, runners);
}

export async function getActiveRunnerId(): Promise<string | null> {
  return AsyncStorage.getItem(ACTIVE_RUNNER_KEY);
}

export function setActiveRunnerId(id: string): Promise<void> {
  return AsyncStorage.setItem(ACTIVE_RUNNER_KEY, id);
}

export async function getRuns(runnerId: string): Promise<RunLog[]> {
  return getJSON<RunLog[]>(runsKey(runnerId), []);
}

export function saveRuns(runnerId: string, runs: RunLog[]): Promise<void> {
  return setJSON(runsKey(runnerId), runs);
}

export async function addRun(runnerId: string, run: RunLog): Promise<RunLog[]> {
  const runs = await getRuns(runnerId);
  const updated = [run, ...runs].sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1));
  await saveRuns(runnerId, updated);
  return updated;
}

export async function deleteRun(runnerId: string, runId: string): Promise<RunLog[]> {
  const runs = await getRuns(runnerId);
  const updated = runs.filter((r) => r.id !== runId);
  await saveRuns(runnerId, updated);
  return updated;
}

const defaultProgress: RunnerProgress = {
  completedWorkoutIds: [],
  currentPhaseId: '5k-nonstop',
};

export async function getProgress(runnerId: string): Promise<RunnerProgress> {
  return getJSON<RunnerProgress>(progressKey(runnerId), defaultProgress);
}

export function saveProgress(runnerId: string, progress: RunnerProgress): Promise<void> {
  return setJSON(progressKey(runnerId), progress);
}

export async function markWorkoutComplete(runnerId: string, workoutId: string): Promise<RunnerProgress> {
  const progress = await getProgress(runnerId);
  if (!progress.completedWorkoutIds.includes(workoutId)) {
    progress.completedWorkoutIds.push(workoutId);
  }
  await saveProgress(runnerId, progress);
  return progress;
}

export async function setCurrentPhase(runnerId: string, phaseId: PhaseId): Promise<RunnerProgress> {
  const progress = await getProgress(runnerId);
  progress.currentPhaseId = phaseId;
  await saveProgress(runnerId, progress);
  return progress;
}

export async function deleteRunnerData(runnerId: string): Promise<void> {
  await AsyncStorage.multiRemove([runsKey(runnerId), progressKey(runnerId)]);
}
