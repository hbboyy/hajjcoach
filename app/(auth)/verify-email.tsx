

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

export default function VerifyEmail() {
  const COLORS = useTheme();
  const styles = useMemo(() => makeStyles(COLORS), [COLORS]);
  const router = useRouter();
  const { user, checkEmailVerified, resendVerificationEmail, signOut } = useAuth();
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);
  const [notVerifiedMsg, setNotVerifiedMsg] = useState(false);

  const handleCheckVerified = async () => {
    setChecking(true);
    setNotVerifiedMsg(false);
    const verified = await checkEmailVerified();
    if (!verified) setNotVerifiedMsg(true);
    setChecking(false);
  };

  const handleResend = async () => {
    setResending(true);
    await resendVerificationEmail();
    setResending(false);
  };

  const handleUseDifferentAccount = () => {
    Alert.alert(
      'Use a Different Account',
      'This will sign you out and take you back to the login page.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/login' as any);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar style={COLORS.statusBar} backgroundColor={COLORS.background} />

      <Animated.View entering={FadeInDown.delay(60).duration(500)} style={styles.container}>

        <View style={styles.iconCircle}>
          <Ionicons name="mail-unread-outline" size={48} color={COLORS.gold} />
        </View>

        <Text style={styles.title}>Verify your email</Text>
        <Text style={styles.subtitle}>
          We sent a verification link to{'\n'}
          <Text style={styles.email}>{user?.email}</Text>
        </Text>

        <Text style={styles.instruction}>
          Open your email and tap the link to verify your account. Then come back and tap the button below.
        </Text>

        {notVerifiedMsg && (
          <Animated.View entering={FadeInDown.duration(300)} style={styles.warningBox}>
            <Ionicons name="alert-circle-outline" size={16} color="#C62828" style={{ marginRight: 8 }} />
            <Text style={styles.warningText}>
              Email not verified yet. Please check your inbox (and spam folder).
            </Text>
          </Animated.View>
        )}

        <TouchableOpacity
          style={[styles.primaryBtn, checking && { opacity: 0.7 }]}
          onPress={handleCheckVerified}
          activeOpacity={0.85}
          disabled={checking}
        >
          {checking
            ? <ActivityIndicator color={COLORS.black} />
            : <>
                <Ionicons name="checkmark-circle-outline" size={18} color={COLORS.black} style={{ marginRight: 8 }} />
                <Text style={styles.primaryBtnText}>I've verified my email</Text>
              </>
          }
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryBtn, resending && { opacity: 0.6 }]}
          onPress={handleResend}
          activeOpacity={0.8}
          disabled={resending}
        >
          {resending
            ? <ActivityIndicator color={COLORS.gold} size="small" />
            : <Text style={styles.secondaryBtnText}>Resend verification email</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signOutBtn}
          onPress={handleUseDifferentAccount}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={15} color={COLORS.textMuted} style={{ marginRight: 6 }} />
          <Text style={styles.signOutText}>Use a different account</Text>
        </TouchableOpacity>

      </Animated.View>
    </View>
  );
}

function makeStyles(COLORS: any) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center' },
    container: { paddingHorizontal: 28, alignItems: 'center' },
    iconCircle: {
      width: 96, height: 96, borderRadius: 48,
      backgroundColor: COLORS.surface,
      borderWidth: 2, borderColor: COLORS.gold,
      justifyContent: 'center', alignItems: 'center',
      marginBottom: 28,
    },
    title: { fontSize: 28, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 12, textAlign: 'center' },
    subtitle: { fontSize: 15, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 24, marginBottom: 16 },
    email: { color: COLORS.gold, fontWeight: '700' },
    instruction: { fontSize: 13, color: COLORS.textMuted, textAlign: 'center', lineHeight: 20, marginBottom: 28 },
    warningBox: {
      flexDirection: 'row', alignItems: 'flex-start',
      backgroundColor: '#2A1010', borderRadius: 12, padding: 14,
      borderWidth: 1, borderColor: '#C62828', marginBottom: 20, width: '100%',
    },
    warningText: { flex: 1, fontSize: 13, color: '#EF9A9A', lineHeight: 18 },
    primaryBtn: {
      backgroundColor: COLORS.gold, borderRadius: 14,
      height: 54, flexDirection: 'row',
      justifyContent: 'center', alignItems: 'center',
      width: '100%', marginBottom: 14,
    },
    primaryBtnText: { fontSize: 16, fontWeight: '800', color: COLORS.black },
    secondaryBtn: {
      borderWidth: 1.5, borderColor: COLORS.gold, borderRadius: 14,
      height: 50, justifyContent: 'center', alignItems: 'center',
      width: '100%', marginBottom: 24,
    },
    secondaryBtnText: { fontSize: 14, fontWeight: '700', color: COLORS.gold },
    signOutBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
    signOutText: { fontSize: 13, color: COLORS.textMuted },
  });
}