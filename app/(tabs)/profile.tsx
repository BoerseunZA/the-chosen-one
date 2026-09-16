import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useProfile } from '../../context/ProfileContext';
import { colors } from '../../lib/theme';
import { getPhase } from '../../lib/programme';

export default function Profile() {
  const { runners, activeRunner, setActiveRunner, addRunner, progress, refresh } = useProfile();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');

  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  const submitNewRunner = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    await addRunner(trimmed);
    setName('');
    setAdding(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Runners</Text>

      {runners.map((runner) => (
        <Pressable
          key={runner.id}
          style={[styles.runnerRow, runner.id === activeRunner?.id && styles.runnerRowActive]}
          onPress={() => setActiveRunner(runner.id)}
        >
          <View style={[styles.avatar, { backgroundColor: runner.color }]}>
            <Text style={styles.avatarText}>{runner.name.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.runnerName}>{runner.name}</Text>
            {runner.id === activeRunner?.id && progress && (
              <Text style={styles.runnerPhase}>{getPhase(progress.currentPhaseId).shortTitle}</Text>
            )}
          </View>
          {runner.id === activeRunner?.id && <Text style={styles.activeLabel}>Active</Text>}
        </Pressable>
      ))}

      {adding ? (
        <View style={styles.addForm}>
          <TextInput
            style={styles.input}
            placeholder="Runner's name"
            placeholderTextColor={colors.subtext}
            value={name}
            onChangeText={setName}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={submitNewRunner}
          />
          <View style={styles.addFormRow}>
            <Pressable style={styles.secondaryButton} onPress={() => setAdding(false)}>
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.primaryButtonSmall} onPress={submitNewRunner}>
              <Text style={styles.primaryButtonText}>Add</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable style={styles.addButton} onPress={() => setAdding(true)}>
          <Text style={styles.addButtonText}>+ Add another runner (shared device)</Text>
        </Pressable>
      )}

      <Text style={styles.hint}>
        Each runner keeps their own training progress, runs and personal bests. Switch above to see the other
        person&apos;s data.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 12, paddingBottom: 40 },
  title: { color: colors.text, fontSize: 24, fontWeight: '800', marginBottom: 4 },
  runnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  runnerRowActive: { borderColor: colors.primary },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  runnerName: { color: colors.text, fontSize: 16, fontWeight: '700' },
  runnerPhase: { color: colors.subtext, fontSize: 12, marginTop: 2 },
  activeLabel: { color: colors.primary, fontSize: 12, fontWeight: '700' },
  addButton: { padding: 14, alignItems: 'center', borderRadius: 14, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed' },
  addButtonText: { color: colors.subtext, fontWeight: '600' },
  addForm: { backgroundColor: colors.card, borderRadius: 14, padding: 14, gap: 10, borderWidth: 1, borderColor: colors.border },
  input: { backgroundColor: colors.cardAlt, borderRadius: 10, padding: 12, color: colors.text, fontSize: 15 },
  addFormRow: { flexDirection: 'row', gap: 10, justifyContent: 'flex-end' },
  secondaryButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  secondaryButtonText: { color: colors.subtext, fontWeight: '600' },
  primaryButtonSmall: { backgroundColor: colors.primary, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 },
  primaryButtonText: { color: '#fff', fontWeight: '700' },
  hint: { color: colors.subtext, fontSize: 12, lineHeight: 18, marginTop: 8 },
});
