import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useProfile } from '../context/ProfileContext';
import { colors } from '../lib/theme';

export default function Onboarding() {
  const { addRunner } = useProfile();
  const router = useRouter();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setSaving(true);
    await addRunner(trimmed);
    setSaving(false);
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🏃</Text>
        <Text style={styles.title}>RunTogether</Text>
        <Text style={styles.subtitle}>
          A shared 5K → 10K programme, built for two. Track every run, follow the plan, and watch your times drop
          together.
        </Text>
        <Text style={styles.label}>What&apos;s your name?</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Andre"
          placeholderTextColor={colors.subtext}
          autoFocus
          returnKeyType="done"
          onSubmitEditing={submit}
        />
        <Pressable
          style={[styles.button, !name.trim() && styles.buttonDisabled]}
          onPress={submit}
          disabled={!name.trim() || saving}
        >
          <Text style={styles.buttonText}>{saving ? 'Setting up...' : 'Start Training'}</Text>
        </Pressable>
        <Text style={styles.hint}>
          Sharing one phone? You can add a second runner profile later from the Profile tab.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center' },
  content: { paddingHorizontal: 28, gap: 12 },
  emoji: { fontSize: 48, textAlign: 'center', marginBottom: 8 },
  title: { color: colors.text, fontSize: 28, fontWeight: '800', textAlign: 'center' },
  subtitle: { color: colors.subtext, fontSize: 15, textAlign: 'center', lineHeight: 21, marginBottom: 16 },
  label: { color: colors.text, fontSize: 14, fontWeight: '600', marginTop: 8 },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    padding: 14,
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  hint: { color: colors.subtext, fontSize: 12, textAlign: 'center', marginTop: 16 },
});
