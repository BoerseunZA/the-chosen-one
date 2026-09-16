import { Phase, PhaseId, Workout, WorkoutType } from './types';

interface DayConfig {
  title: string;
  description: string;
  type: WorkoutType;
  targetDurationMin?: number;
  targetDistanceKm?: number;
}

interface WeekConfig {
  week: number;
  days: DayConfig[];
}

function buildWorkouts(phaseId: PhaseId, weeks: WeekConfig[]): Workout[] {
  const workouts: Workout[] = [];
  for (const w of weeks) {
    w.days.forEach((d, i) => {
      workouts.push({
        id: `${phaseId}-w${w.week}-d${i + 1}`,
        phaseId,
        week: w.week,
        day: i + 1,
        ...d,
      });
    });
  }
  return workouts;
}

// ---------------------------------------------------------------------------
// Phase 1: Run a 5K Without Walking (classic run/walk-interval build-up)
// ---------------------------------------------------------------------------

const phase1Weeks: WeekConfig[] = [
  {
    week: 1,
    days: repeat(3, {
      title: 'Run/Walk Intervals',
      description: '5-min brisk warm-up walk. Then repeat 8x: run 60 sec, walk 90 sec. Finish with a 5-min cool-down walk.',
      type: 'interval',
      targetDurationMin: 30,
    }),
  },
  {
    week: 2,
    days: repeat(3, {
      title: 'Run/Walk Intervals',
      description: '5-min warm-up walk. Then repeat 6x: run 90 sec, walk 2 min. Cool-down with a 5-min walk.',
      type: 'interval',
      targetDurationMin: 31,
    }),
  },
  {
    week: 3,
    days: repeat(3, {
      title: 'Run/Walk Intervals',
      description: 'Warm-up walk. Then twice through: run 90 sec, walk 90 sec, run 3 min, walk 3 min. Cool-down walk.',
      type: 'interval',
      targetDurationMin: 24,
    }),
  },
  {
    week: 4,
    days: repeat(3, {
      title: 'Run/Walk Intervals',
      description: 'Warm-up walk. Run 3 min, walk 90 sec, run 5 min, walk 2:30, run 3 min, walk 90 sec, run 5 min. Cool-down walk.',
      type: 'interval',
      targetDurationMin: 28,
    }),
  },
  {
    week: 5,
    days: [
      {
        title: 'Run/Walk Intervals',
        description: 'Warm-up walk. Run 5 min, walk 3 min, run 5 min, walk 3 min, run 5 min. Cool-down walk.',
        type: 'interval',
        targetDurationMin: 26,
      },
      {
        title: 'Run/Walk Intervals',
        description: 'Warm-up walk. Run 8 min, walk 5 min, run 8 min. Cool-down walk.',
        type: 'interval',
        targetDurationMin: 26,
      },
      {
        title: 'First Non-Stop 20',
        description: 'Warm-up walk, then run continuously for 20 minutes — no walking. Cool-down walk.',
        type: 'continuous',
        targetDurationMin: 20,
      },
    ],
  },
  {
    week: 6,
    days: [
      {
        title: 'Run/Walk Intervals',
        description: 'Warm-up walk. Run 5 min, walk 3 min, run 8 min, walk 3 min, run 5 min. Cool-down walk.',
        type: 'interval',
        targetDurationMin: 29,
      },
      {
        title: 'Run/Walk Intervals',
        description: 'Warm-up walk. Run 10 min, walk 3 min, run 10 min. Cool-down walk.',
        type: 'interval',
        targetDurationMin: 28,
      },
      {
        title: 'Non-Stop 25',
        description: 'Warm-up walk, then run continuously for 25 minutes — no walking. Cool-down walk.',
        type: 'continuous',
        targetDurationMin: 25,
      },
    ],
  },
  {
    week: 7,
    days: repeat(3, {
      title: 'Non-Stop 25',
      description: 'Warm-up walk, then run continuously for 25 minutes. Cool-down walk.',
      type: 'continuous',
      targetDurationMin: 25,
    }),
  },
  {
    week: 8,
    days: repeat(3, {
      title: 'Non-Stop 28',
      description: 'Warm-up walk, then run continuously for 28 minutes. Cool-down walk.',
      type: 'continuous',
      targetDurationMin: 28,
    }),
  },
  {
    week: 9,
    days: [
      {
        title: 'Non-Stop 30',
        description: 'Warm-up walk, then run continuously for 30 minutes. Cool-down walk.',
        type: 'continuous',
        targetDurationMin: 30,
      },
      {
        title: 'Non-Stop 30',
        description: 'Warm-up walk, then run continuously for 30 minutes. Cool-down walk.',
        type: 'continuous',
        targetDurationMin: 30,
      },
      {
        title: '5K Graduation Run',
        description: 'This is it! Warm-up walk, then run continuously for 5K (about 30-35 min) with no walking at all. Take it at a comfortable, sustainable pace — the goal is finishing non-stop, not speed.',
        type: 'timetrial',
        targetDistanceKm: 5,
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Phase 2: Improve Your 5K Time
// ---------------------------------------------------------------------------

const phase2Weeks: WeekConfig[] = [
  week5kSpeed(1, 25, '5x400m @ 5K effort, 400m easy jog recovery', 10, 35),
  week5kSpeed(2, 25, '6x400m @ 5K effort, 400m easy jog recovery', 12, 35),
  week5kSpeed(3, 30, '6x600m @ 5K effort, 200m easy jog recovery', 14, 40),
  week5kSpeed(4, 30, '8x400m @ 5K effort, 200m easy jog recovery', 16, 40),
  week5kSpeed(5, 30, '5x800m @ 5K effort, 400m easy jog recovery', 18, 45),
  week5kSpeed(6, 30, '6x800m @ 5K effort, 300m easy jog recovery', 20, 45),
  week5kSpeed(7, 25, '4x1000m @ 5K effort, 400m easy jog recovery', 15, 40),
  {
    week: 8,
    days: [
      { title: 'Easy Run', description: '20-min easy, conversational-pace run to stay loose.', type: 'easy', targetDurationMin: 20 },
      { title: 'Sharpening Intervals', description: '4x400m at 5K race pace with full recovery jogs between each.', type: 'interval', targetDurationMin: 25 },
      { title: 'Rest or Easy Jog', description: 'Rest day, or a very easy 15-min jog if you feel like moving.', type: 'rest', targetDurationMin: 15 },
      {
        title: '5K Time Trial',
        description: 'Race day! Warm up, then run 5K at your best sustainable race pace. Log this time as your new 5K result and compare it to where you started.',
        type: 'timetrial',
        targetDistanceKm: 5,
      },
    ],
  },
];

function week5kSpeed(week: number, easyMin: number, intervalDesc: string, tempoMin: number, longMin: number): WeekConfig {
  return {
    week,
    days: [
      { title: 'Easy Run', description: `${easyMin}-min easy, conversational-pace run.`, type: 'easy', targetDurationMin: easyMin },
      { title: 'Interval Workout', description: `Warm up 10 min. ${intervalDesc}. Cool down 10 min.`, type: 'interval' },
      { title: 'Tempo Run', description: `Warm up 10 min, then ${tempoMin} min at a comfortably-hard "tempo" pace, then cool down 10 min.`, type: 'tempo', targetDurationMin: tempoMin },
      { title: 'Long Run', description: `${longMin}-min easy-paced long run to build endurance.`, type: 'long', targetDurationMin: longMin },
    ],
  };
}

// ---------------------------------------------------------------------------
// Phase 3: Run a 10K Without Walking (extend the long run out to 10K)
// ---------------------------------------------------------------------------

const phase3Weeks: WeekConfig[] = [
  week10kBase(1, 20, 25, 6),
  week10kBase(2, 20, 25, 6.5),
  week10kBase(3, 20, 30, 7),
  week10kBase(4, 25, 30, 7.5),
  week10kBase(5, 25, 30, 8),
  week10kBase(6, 25, 35, 8.5),
  week10kBase(7, 25, 30, 9),
  {
    week: 8,
    days: [
      { title: 'Easy Run', description: '20-min easy run, nice and relaxed.', type: 'easy', targetDurationMin: 20 },
      { title: 'Easy Run', description: '20-min easy run to keep the legs fresh.', type: 'easy', targetDurationMin: 20 },
      { title: 'Rest or Cross-Train', description: 'Rest day, or light cross-training (swim, bike, walk).', type: 'rest' },
      {
        title: '10K Graduation Run',
        description: 'Run continuously for the full 10K — no walking. Go out easy and settle into a comfortable, sustainable pace; finishing non-stop is the whole goal today.',
        type: 'timetrial',
        targetDistanceKm: 10,
      },
    ],
  },
];

function week10kBase(week: number, easyMin: number, steadyMin: number, longKm: number): WeekConfig {
  return {
    week,
    days: [
      { title: 'Easy Run', description: `${easyMin}-min easy, relaxed-pace run.`, type: 'easy', targetDurationMin: easyMin },
      { title: 'Steady Run', description: `${steadyMin}-min steady run, a little firmer than easy pace but still controlled.`, type: 'easy', targetDurationMin: steadyMin },
      { title: 'Rest or Cross-Train', description: 'Rest day, or light cross-training (swim, bike, walk) to aid recovery.', type: 'rest' },
      {
        title: 'Long Run',
        description: `Run continuously for ${longKm}K, no walking. Keep the pace easy and conversational — this run is about distance, not speed.`,
        type: 'long',
        targetDistanceKm: longKm,
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Phase 4: Improve Your 10K Time
// ---------------------------------------------------------------------------

const phase4Weeks: WeekConfig[] = [
  week10kSpeed(1, 30, '6x400m @ 10K effort, 200m easy jog recovery', 15, 8),
  week10kSpeed(2, 30, '5x600m @ 10K effort, 200m easy jog recovery', 18, 9),
  week10kSpeed(3, 35, '6x600m @ 10K effort, 200m easy jog recovery', 20, 9),
  week10kSpeed(4, 35, '4x1000m @ 10K effort, 400m easy jog recovery', 22, 10),
  week10kSpeed(5, 35, '5x1000m @ 10K effort, 400m easy jog recovery', 25, 10),
  week10kSpeed(6, 40, '3x1600m @ 10K effort, 400m easy jog recovery', 25, 11),
  {
    week: 7,
    days: [
      { title: 'Easy Run', description: '30-min easy, relaxed-pace run (taper begins).', type: 'easy', targetDurationMin: 30 },
      { title: 'Sharpening Intervals', description: '4x800m at 10K effort with generous recovery — keep it snappy, not exhausting.', type: 'interval', targetDurationMin: 25 },
      { title: 'Easy Tempo', description: 'Warm up 10 min, 15 min at an easy-moderate tempo, cool down 10 min.', type: 'tempo', targetDurationMin: 15 },
      { title: 'Long Run', description: '8K easy-paced long run — keep it comfortable ahead of race week.', type: 'long', targetDistanceKm: 8 },
    ],
  },
  {
    week: 8,
    days: [
      { title: 'Easy Run', description: '20-min easy run to stay loose.', type: 'easy', targetDurationMin: 20 },
      { title: 'Strides', description: '3x400m at 5K pace with full recovery — short, sharp, not tiring.', type: 'interval', targetDurationMin: 15 },
      { title: 'Rest', description: 'Full rest day before your time trial.', type: 'rest' },
      {
        title: '10K Time Trial',
        description: 'Race day! Warm up, then run 10K at your best sustainable race pace. Log this time as your new 10K result and see how far you\'ve come.',
        type: 'timetrial',
        targetDistanceKm: 10,
      },
    ],
  },
];

function week10kSpeed(week: number, easyMin: number, intervalDesc: string, tempoMin: number, longKm: number): WeekConfig {
  return {
    week,
    days: [
      { title: 'Easy Run', description: `${easyMin}-min easy, conversational-pace run.`, type: 'easy', targetDurationMin: easyMin },
      { title: 'Interval Workout', description: `Warm up 10 min. ${intervalDesc}. Cool down 10 min.`, type: 'interval' },
      { title: 'Tempo Run', description: `Warm up 10 min, then ${tempoMin} min at a comfortably-hard "tempo" pace, then cool down 10 min.`, type: 'tempo', targetDurationMin: tempoMin },
      { title: 'Long Run', description: `Run ${longKm}K at an easy, sustainable pace to build endurance for 10K race pace.`, type: 'long', targetDistanceKm: longKm },
    ],
  };
}

function repeat<T>(n: number, item: T): T[] {
  return Array.from({ length: n }, () => ({ ...item }));
}

export const PHASES: Phase[] = [
  {
    id: '5k-nonstop',
    title: 'Run a 5K Without Walking',
    shortTitle: '5K: No Walking',
    goal: 'Build from run/walk intervals to running a full 5K non-stop.',
    totalWeeks: 9,
    daysPerWeek: 3,
    workouts: buildWorkouts('5k-nonstop', phase1Weeks),
  },
  {
    id: '5k-speed',
    title: 'Improve Your 5K Time',
    shortTitle: '5K: Get Faster',
    goal: 'Add intervals, tempo runs and a long run to bring your 5K time down.',
    totalWeeks: 8,
    daysPerWeek: 4,
    workouts: buildWorkouts('5k-speed', phase2Weeks),
  },
  {
    id: '10k-nonstop',
    title: 'Run a 10K Without Walking',
    shortTitle: '10K: No Walking',
    goal: 'Extend your long run from 5K up to a full 10K, no walking.',
    totalWeeks: 8,
    daysPerWeek: 4,
    workouts: buildWorkouts('10k-nonstop', phase3Weeks),
  },
  {
    id: '10k-speed',
    title: 'Improve Your 10K Time',
    shortTitle: '10K: Get Faster',
    goal: 'Intervals, tempo runs and longer long runs to bring your 10K time down.',
    totalWeeks: 8,
    daysPerWeek: 4,
    workouts: buildWorkouts('10k-speed', phase4Weeks),
  },
];

export function getPhase(id: PhaseId): Phase {
  const phase = PHASES.find((p) => p.id === id);
  if (!phase) throw new Error(`Unknown phase: ${id}`);
  return phase;
}

export function getNextPhaseId(id: PhaseId): PhaseId | null {
  const idx = PHASES.findIndex((p) => p.id === id);
  return idx >= 0 && idx < PHASES.length - 1 ? PHASES[idx + 1].id : null;
}

export function getWorkout(id: string) {
  for (const phase of PHASES) {
    const w = phase.workouts.find((w) => w.id === id);
    if (w) return w;
  }
  return undefined;
}
