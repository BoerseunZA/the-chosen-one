import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useProfile } from '../../context/ProfileContext';
import StatTile from '../../components/StatTile';
import RunListItem from '../../components/RunListItem';
import { colors } from '../../lib/theme';
import { formatDuration } from '../../lib/format';
import { RunLog } from '../../lib/types';

function bestTimeNear(runs: RunLog[], targetKm: number, toleranceKm: number): RunLog | null {
  const candidates = runs.filter((r) => Math.abs(r.distanceKm - targetKm) <= toleranceKm);
  if (candidates.length === 0) return null;
  return candidates.reduce((best, r) => (r.durationSec < best.durationSec ? r : best));
}

export default function Progress() {
  const { activeRunner, runs, removeRun, refresh } = useProfile();

  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  const totals = useMemo(() => {
    const totalDistance = runs.reduce((sum, r) => sum + r.distanceKm, 0);
    const totalDuration = runs.reduce((sum, r) => sum + r.durationSec, 0);
    const best5k = bestTimeNear(runs, 5, 0.3);
    const best10k = bestTimeNear(runs, 10, 0.5);
    return { totalDistance, totalDuration, best5k, best10k, count: runs.length };
  }, [runs]);

  if (!activeRunner) return null;

  const confirmDelete = (run: RunLog) => {
    Alert.alert('Delete run?', `Remove the run logged on ${new Date(run.dateISO).toLocaleDateString()}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeRun(run.id) },
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.content}
        data={runs}
        keyExtractor={(r) => r.id}
        ListHeaderComponent={
          <View style={{ gap: 16, marginBottom: 8 }}>
            <Text style={styles.title}>{activeRunner.name}&apos;s Progress</Text>
            <View style={styles.statsGrid}>
              <StatTile label="Total Runs" value={String(totals.count)} />
              <StatTile label="Total Distance" value={`${totals.totalDistance.toFixed(1)} km`} />
              <StatTile label="Total Time" value={formatDuration(totals.totalDuration)} />
            </View>
            <View style={styles.statsGrid}>
              <StatTile
                label="Best 5K"
                value={totals.best5k ? formatDuration(totals.best5k.durationSec) : '--:--'}
                sub={totals.best5k ? new Date(totals.best5k.dateISO).toLocaleDateString() : undefined}
              />
              <StatTile
                label="Best 10K"
                value={totals.best10k ? formatDuration(totals.best10k.durationSec) : '--:--'}
                sub={totals.best10k ? new Date(totals.best10k.dateISO).toLocaleDateString() : undefined}
              />
            </View>
            <Text style={styles.sectionTitle}>History</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10 }}>
            <RunListItem run={item} onLongPress={() => confirmDelete(item)} />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No runs logged yet. Head to the Today tab to log your first one!</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 40 },
  title: { color: colors.text, fontSize: 24, fontWeight: '800' },
  statsGrid: { flexDirection: 'row', gap: 10 },
  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: '700', marginTop: 8 },
  empty: { color: colors.subtext, textAlign: 'center', marginTop: 40, fontSize: 14, lineHeight: 20 },
});
