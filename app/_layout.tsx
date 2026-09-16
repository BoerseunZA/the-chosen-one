import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ProfileProvider } from '../context/ProfileContext';
import { colors } from '../lib/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ProfileProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.bg },
            headerTintColor: colors.text,
            contentStyle: { backgroundColor: colors.bg },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
          <Stack.Screen name="log-run" options={{ title: 'Log a Run', presentation: 'modal' }} />
        </Stack>
      </ProfileProvider>
    </SafeAreaProvider>
  );
}
