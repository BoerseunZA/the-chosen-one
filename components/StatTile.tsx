import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../lib/theme';

export default function StatTile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <View style={styles.tile}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {sub ? <Text style={styles.sub}>{sub}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 2,
  },
  value: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  label: {
    color: colors.subtext,
    fontSize: 12,
    textAlign: 'center',
  },
  sub: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '600',
  },
});
