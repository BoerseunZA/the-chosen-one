import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { RunLog } from '../lib/types';
import { colors } from '../lib/theme';
import { formatDate, formatDuration, formatKm, formatPace } from '../lib/format';

export default function RunListItem({ run, onPress, onLongPress }: { run: RunLog; onPress?: () => void; onLongPress?: () => void }) {
  return (
    <Pressable style={styles.row} onPress={onPress} onLongPress={onLongPress}>
      <View style={styles.left}>
        <Text style={styles.date}>{formatDate(run.dateISO)}</Text>
        {run.notes ? <Text style={styles.notes} numberOfLines={1}>{run.notes}</Text> : null}
      </View>
      <View style={styles.right}>
        <Text style={styles.distance}>{formatKm(run.distanceKm)}</Text>
        <Text style={styles.meta}>{formatDuration(run.durationSec)} · {formatPace(run.distanceKm, run.durationSec)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  left: { flex: 1, gap: 2 },
  date: { color: colors.text, fontWeight: '700', fontSize: 15 },
  notes: { color: colors.subtext, fontSize: 12 },
  right: { alignItems: 'flex-end', gap: 2 },
  distance: { color: colors.text, fontWeight: '800', fontSize: 15 },
  meta: { color: colors.subtext, fontSize: 12 },
});
