

import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';

function AuthGate() {
  const { user, loading, emailVerified, isGuest } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const segs = segments as string[];
    const inAuthGroup = segs[0] === '(auth)';
    const currentScreen = segs[1] ?? '';

    // ── Never interfere with these screens ──
    // Let index.tsx, splash, and Onboarding manage themselves
    const isPreAuthScreen =
      currentScreen === 'splash' ||
      currentScreen === 'Onboarding' ||
      segs[0] === 'index' ||
      segs.length < 2;

    if (isPreAuthScreen) return;

    const onVerifyScreen = currentScreen === 'verify-email';

    if (isGuest) {
      if (inAuthGroup) router.replace('/(tabs)');
      return;
    }

    if (!user) {
      if (!inAuthGroup) router.replace('/(auth)/login');
    } else if (!emailVerified) {
      if (!onVerifyScreen) router.replace('/(auth)/verify-email' as any);
    } else {
      if (inAuthGroup) router.replace('/(tabs)');
    }
  }, [user, loading, emailVerified, isGuest, segments]);

  return null;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGate />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}