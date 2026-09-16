import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useProfile } from '../../context/ProfileContext';
import { getPhase, getNextPhaseId } from '../../lib/programme';
import WorkoutCard from '../../components/WorkoutCard';
import ProgressBar from '../../components/ProgressBar';
import { colors } from '../../lib/theme';

export default function Today() {
  const { activeRunner, progress, advancePhase, refresh } = useProfile();
  const router = useRouter();

  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  if (!activeRunner || !progress) return null;

  const phase = getPhase(progress.currentPhaseId);
  const completedInPhase = phase.workouts.filter((w) => progress.completedWorkoutIds.includes(w.id));
  const nextWorkout = phase.workouts.find((w) => !progress.completedWorkoutIds.includes(w.id));
  const phaseDone = !nextWorkout;
  const nextPhaseId = getNextPhaseId(phase.id);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>Hey {activeRunner.name} 👋</Text>

      <View style={styles.phaseCard}>
        <Text style={styles.phaseLabel}>CURRENT PHASE</Text>
        <Text style={styles.phaseTitle}>{phase.title}</Text>
        <Text style={styles.phaseGoal}>{phase.goal}</Text>
        <View style={{ marginTop: 10, gap: 6 }}>
          <ProgressBar progress={completedInPhase.length / phase.workouts.length} color={colors.accent} />
          <Text style={styles.phaseProgressText}>
            {completedInPhase.length} / {phase.workouts.length} workouts complete
          </Text>
        </View>
      </View>

      {!phaseDone && nextWorkout && (
        <View style={{ gap: 10 }}>
          <Text style={styles.sectionTitle}>Up Next</Text>
          <WorkoutCard workout={nextWorkout} />
          <Pressable
            style={styles.primaryButton}
            onPress={() => router.push({ pathname: '/log-run', params: { workoutId: nextWorkout.id } })}
          >
            <Text style={styles.primaryButtonText}>Log This Run</Text>
          </Pressable>
        </View>
      )}

      {phaseDone && nextPhaseId && (
        <View style={styles.doneCard}>
          <Text style={styles.doneTitle}>🎉 Phase complete!</Text>
          <Text style={styles.doneText}>
            You&apos;ve finished every workout in &quot;{phase.title}&quot;. Ready to move on to the next phase?
          </Text>
          <Pressable style={styles.primaryButton} onPress={() => advancePhase(nextPhaseId)}>
            <Text style={styles.primaryButtonText}>Start {getPhase(nextPhaseId).shortTitle}</Text>
          </Pressable>
        </View>
      )}

      {phaseDone && !nextPhaseId && (
        <View style={styles.doneCard}>
          <Text style={styles.doneTitle}>🏆 Programme complete!</Text>
          <Text style={styles.doneText}>
            You&apos;ve finished the whole 5K → 10K programme. Keep logging runs to track how your times keep
            improving.
          </Text>
        </View>
      )}

      <Pressable style={styles.secondaryButton} onPress={() => router.push('/log-run')}>
        <Text style={styles.secondaryButtonText}>Log a Free Run</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 18, paddingBottom: 40 },
  greeting: { color: colors.text, fontSize: 24, fontWeight: '800' },
  phaseCard: {
    backgroundColor: colors.cardAlt,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  phaseLabel: { color: colors.primary, fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  phaseTitle: { color: colors.text, fontSize: 20, fontWeight: '800', marginTop: 4 },
  phaseGoal: { color: colors.subtext, fontSize: 14, marginTop: 4, lineHeight: 20 },
  phaseProgressText: { color: colors.subtext, fontSize: 12 },
  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: '700' },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  secondaryButton: {
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: { color: colors.text, fontWeight: '600', fontSize: 15 },
  doneCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  doneTitle: { color: colors.text, fontSize: 18, fontWeight: '800' },
  doneText: { color: colors.subtext, fontSize: 14, lineHeight: 20 },
});
