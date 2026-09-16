import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, Switch, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProfile } from '../context/ProfileContext';
import { getWorkout } from '../lib/programme';
import { colors } from '../lib/theme';

export default function LogRun() {
  const { workoutId } = useLocalSearchParams<{ workoutId?: string }>();
  const workout = workoutId ? getWorkout(workoutId) : undefined;
  const { logRun } = useProfile();
  const router = useRouter();

  const [distance, setDistance] = useState(workout?.targetDistanceKm ? String(workout.targetDistanceKm) : '');
  const [minutes, setMinutes] = useState(workout?.targetDurationMin ? String(workout.targetDurationMin) : '');
  const [seconds, setSeconds] = useState('0');
  const [notes, setNotes] = useState('');
  const [noWalking, setNoWalking] = useState(workout ? workout.type === 'continuous' || workout.type === 'timetrial' : false);
  const [saving, setSaving] = useState(false);

  const distanceKm = parseFloat(distance.replace(',', '.'));
  const durationSec = (parseInt(minutes || '0', 10) || 0) * 60 + (parseInt(seconds || '0', 10) || 0);
  const isValid = distanceKm > 0 && durationSec > 0;

  const submit = async () => {
    if (!isValid) return;
    setSaving(true);
    await logRun({
      dateISO: new Date().toISOString(),
      distanceKm,
      durationSec,
      workoutId: workout?.id,
      phaseId: workout?.phaseId,
      noWalking,
      notes: notes.trim() || undefined,
    });
    setSaving(false);
    router.back();
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content}>
        {workout && (
          <View style={styles.workoutBanner}>
            <Text style={styles.workoutBannerLabel}>Logging for</Text>
            <Text style={styles.workoutBannerTitle}>{workout.title} · Week {workout.week}, Day {workout.day}</Text>
          </View>
        )}

        <Text style={styles.label}>Distance (km)</Text>
        <TextInput
          style={styles.input}
          value={distance}
          onChangeText={setDistance}
          placeholder="5.0"
          placeholderTextColor={colors.subtext}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Duration</Text>
        <View style={styles.durationRow}>
          <TextInput
            style={[styles.input, styles.durationInput]}
            value={minutes}
            onChangeText={setMinutes}
            placeholder="30"
            placeholderTextColor={colors.subtext}
            keyboardType="number-pad"
          />
          <Text style={styles.durationSep}>min</Text>
          <TextInput
            style={[styles.input, styles.durationInput]}
            value={seconds}
            onChangeText={setSeconds}
            placeholder="00"
            placeholderTextColor={colors.subtext}
            keyboardType="number-pad"
          />
          <Text style={styles.durationSep}>sec</Text>
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.label}>Ran the whole way, no walking</Text>
          <Switch value={noWalking} onValueChange={setNoWalking} />
        </View>

        <Text style={styles.label}>Notes (optional)</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          value={notes}
          onChangeText={setNotes}
          placeholder="How did it feel?"
          placeholderTextColor={colors.subtext}
          multiline
        />

        <Pressable style={[styles.submit, !isValid && styles.submitDisabled]} onPress={submit} disabled={!isValid || saving}>
          <Text style={styles.submitText}>{saving ? 'Saving...' : 'Save Run'}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, gap: 8, paddingBottom: 60 },
  workoutBanner: {
    backgroundColor: colors.cardAlt,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  workoutBannerLabel: { color: colors.subtext, fontSize: 11, fontWeight: '700' },
  workoutBannerTitle: { color: colors.text, fontSize: 14, fontWeight: '700', marginTop: 2 },
  label: { color: colors.text, fontSize: 14, fontWeight: '600', marginTop: 10, marginBottom: 6 },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    padding: 14,
    fontSize: 16,
  },
  durationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  durationInput: { flex: 1, textAlign: 'center', padding: 12, minWidth: 0 },
  durationSep: { color: colors.subtext, fontSize: 12, width: 28 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  notesInput: { minHeight: 80, textAlignVertical: 'top' },
  submit: { backgroundColor: colors.primary, borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 24 },
  submitDisabled: { opacity: 0.4 },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
