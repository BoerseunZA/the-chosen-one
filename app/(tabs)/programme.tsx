import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, SectionList, Pressable } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { PHASES } from '../../lib/programme';
import { useProfile } from '../../context/ProfileContext';
import WorkoutCard from '../../components/WorkoutCard';
import ProgressBar from '../../components/ProgressBar';
import { colors } from '../../lib/theme';
import { PhaseId, Workout } from '../../lib/types';

export default function Programme() {
  const { progress, advancePhase, refresh } = useProfile();
  const [expanded, setExpanded] = useState<PhaseId | null>(progress?.currentPhaseId ?? null);

  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  if (!progress) return null;

  return (
    <View style={styles.container}>
      <SectionList
        contentContainerStyle={styles.content}
        sections={PHASES.map((phase) => ({
          key: phase.id,
          title: phase.title,
          data: expanded === phase.id ? phase.workouts : ([] as Workout[]),
        }))}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section }) => {
          const phase = PHASES.find((p) => p.id === section.key)!;
          const completedCount = phase.workouts.filter((w) => progress.completedWorkoutIds.includes(w.id)).length;
          const isActive = progress.currentPhaseId === phase.id;
          const isOpen = expanded === phase.id;
          return (
            <Pressable
              style={[styles.header, isActive && styles.headerActive]}
              onPress={() => setExpanded(isOpen ? null : phase.id)}
            >
              <View style={{ flex: 1, gap: 6 }}>
                <View style={styles.headerTop}>
                  <Text style={styles.headerTitle}>{phase.title}</Text>
                  {isActive && <Text style={styles.activePill}>CURRENT</Text>}
                </View>
                <Text style={styles.headerGoal}>{phase.goal}</Text>
                <ProgressBar progress={completedCount / phase.workouts.length} />
                <Text style={styles.headerProgress}>
                  {completedCount} / {phase.workouts.length} workouts · {phase.totalWeeks} weeks
                </Text>
                {!isActive && (
                  <Pressable onPress={() => advancePhase(phase.id)} style={styles.jumpButton}>
                    <Text style={styles.jumpButtonText}>Make this the current phase</Text>
                  </Pressable>
                )}
              </View>
            </Pressable>
          );
        }}
        renderItem={({ item }) => (
          <View style={styles.workoutWrap}>
            <WorkoutCard workout={item} completed={progress.completedWorkoutIds.includes(item.id)} compact />
          </View>
        )}
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 40, gap: 12 },
  header: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    marginTop: 4,
  },
  headerActive: {
    borderColor: colors.primary,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { color: colors.text, fontSize: 17, fontWeight: '800', flexShrink: 1 },
  activePill: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  headerGoal: { color: colors.subtext, fontSize: 13, lineHeight: 18 },
  headerProgress: { color: colors.subtext, fontSize: 12 },
  jumpButton: { marginTop: 4 },
  jumpButtonText: { color: colors.primary, fontSize: 13, fontWeight: '700' },
  workoutWrap: { marginBottom: 8 },
});
