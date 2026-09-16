import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Runner, RunLog, RunnerProgress, PhaseId } from '../lib/types';
import * as storage from '../lib/storage';

const RUNNER_COLORS = ['#2563eb', '#db2777'];

interface ProfileContextValue {
  loading: boolean;
  runners: Runner[];
  activeRunner: Runner | null;
  runs: RunLog[];
  progress: RunnerProgress | null;
  addRunner: (name: string) => Promise<Runner>;
  setActiveRunner: (id: string) => Promise<void>;
  logRun: (run: Omit<RunLog, 'id' | 'runnerId'>) => Promise<void>;
  removeRun: (runId: string) => Promise<void>;
  completeWorkout: (workoutId: string) => Promise<void>;
  advancePhase: (phaseId: PhaseId) => Promise<void>;
  refresh: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [runners, setRunners] = useState<Runner[]>([]);
  const [activeRunnerId, setActiveRunnerIdState] = useState<string | null>(null);
  const [runs, setRuns] = useState<RunLog[]>([]);
  const [progress, setProgress] = useState<RunnerProgress | null>(null);

  useEffect(() => {
    (async () => {
      const loadedRunners = await storage.getRunners();
      const activeId = await storage.getActiveRunnerId();
      setRunners(loadedRunners);
      const resolvedActive = activeId && loadedRunners.some((r) => r.id === activeId)
        ? activeId
        : loadedRunners[0]?.id ?? null;
      setActiveRunnerIdState(resolvedActive);
      if (resolvedActive) {
        const [loadedRuns, loadedProgress] = await Promise.all([
          storage.getRuns(resolvedActive),
          storage.getProgress(resolvedActive),
        ]);
        setRuns(loadedRuns);
        setProgress(loadedProgress);
      }
      setLoading(false);
    })();
  }, []);

  const setActiveRunner = useCallback(async (id: string) => {
    await storage.setActiveRunnerId(id);
    setActiveRunnerIdState(id);
    const [loadedRuns, loadedProgress] = await Promise.all([
      storage.getRuns(id),
      storage.getProgress(id),
    ]);
    setRuns(loadedRuns);
    setProgress(loadedProgress);
  }, []);

  const addRunner = useCallback(async (name: string) => {
    const runner: Runner = {
      id: makeId(),
      name,
      color: RUNNER_COLORS[runners.length % RUNNER_COLORS.length],
    };
    const updated = [...runners, runner];
    setRunners(updated);
    await storage.saveRunners(updated);
    await setActiveRunner(runner.id);
    return runner;
  }, [runners, setActiveRunner]);

  const logRun = useCallback(async (run: Omit<RunLog, 'id' | 'runnerId'>) => {
    if (!activeRunnerId) return;
    const fullRun: RunLog = { ...run, id: makeId(), runnerId: activeRunnerId };
    const updated = await storage.addRun(activeRunnerId, fullRun);
    setRuns(updated);
    if (run.workoutId) {
      const updatedProgress = await storage.markWorkoutComplete(activeRunnerId, run.workoutId);
      setProgress(updatedProgress);
    }
  }, [activeRunnerId]);

  const removeRun = useCallback(async (runId: string) => {
    if (!activeRunnerId) return;
    const updated = await storage.deleteRun(activeRunnerId, runId);
    setRuns(updated);
  }, [activeRunnerId]);

  const completeWorkout = useCallback(async (workoutId: string) => {
    if (!activeRunnerId) return;
    const updated = await storage.markWorkoutComplete(activeRunnerId, workoutId);
    setProgress(updated);
  }, [activeRunnerId]);

  const advancePhase = useCallback(async (phaseId: PhaseId) => {
    if (!activeRunnerId) return;
    const updated = await storage.setCurrentPhase(activeRunnerId, phaseId);
    setProgress(updated);
  }, [activeRunnerId]);

  const refresh = useCallback(async () => {
    if (!activeRunnerId) return;
    const [loadedRuns, loadedProgress] = await Promise.all([
      storage.getRuns(activeRunnerId),
      storage.getProgress(activeRunnerId),
    ]);
    setRuns(loadedRuns);
    setProgress(loadedProgress);
  }, [activeRunnerId]);

  const activeRunner = useMemo(
    () => runners.find((r) => r.id === activeRunnerId) ?? null,
    [runners, activeRunnerId],
  );

  const value: ProfileContextValue = {
    loading,
    runners,
    activeRunner,
    runs,
    progress,
    addRunner,
    setActiveRunner,
    logRun,
    removeRun,
    completeWorkout,
    advancePhase,
    refresh,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within a ProfileProvider');
  return ctx;
}
