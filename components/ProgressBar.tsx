import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../lib/theme';

export default function ProgressBar({ progress, color }: { progress: number; color?: string }) {
  const pct = Math.max(0, Math.min(1, progress));
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: color ?? colors.primary }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.cardAlt,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});
