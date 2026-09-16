import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Workout } from '../lib/types';
import { colors, workoutTypeColor } from '../lib/theme';

interface Props {
  workout: Workout;
  completed?: boolean;
  compact?: boolean;
}

const TYPE_LABEL: Record<string, string> = {
  interval: 'Intervals',
  continuous: 'Continuous',
  easy: 'Easy',
  tempo: 'Tempo',
  long: 'Long Run',
  rest: 'Rest',
  timetrial: 'Time Trial',
};

export default function WorkoutCard({ workout, completed, compact }: Props) {
  const tint = workoutTypeColor[workout.type] ?? colors.primary;
  return (
    <View style={[styles.card, compact && styles.cardCompact, completed && styles.cardDone]}>
      <View style={styles.headerRow}>
        <View style={[styles.badge, { backgroundColor: `${tint}26`, borderColor: tint }]}>
          <Text style={[styles.badgeText, { color: tint }]}>{TYPE_LABEL[workout.type] ?? workout.type}</Text>
        </View>
        <Text style={styles.weekDay}>Week {workout.week} · Day {workout.day}</Text>
      </View>
      <Text style={styles.title}>{workout.title}</Text>
      <Text style={styles.description}>{workout.description}</Text>
      {completed && <Text style={styles.doneLabel}>✓ Completed</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  cardCompact: {
    padding: 12,
    gap: 4,
  },
  cardDone: {
    opacity: 0.6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  weekDay: {
    color: colors.subtext,
    fontSize: 12,
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  description: {
    color: colors.subtext,
    fontSize: 14,
    lineHeight: 20,
  },
  doneLabel: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
  },
});
