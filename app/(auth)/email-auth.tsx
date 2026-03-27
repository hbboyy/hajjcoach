
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

const getPasswordStrength = (password: string) => {
  if (password.length === 0) return { score: 0, label: '', color: 'transparent' };
  if (password.length < 6) return { score: 1, label: 'Weak', color: '#C62828' };
  if (password.length < 10 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) return { score: 2, label: 'Fair', color: '#C9A84C' };
  if (/[!@#$%^&*]/.test(password)) return { score: 4, label: 'Strong', color: '#4CAF50' };
  return { score: 3, label: 'Good', color: '#4CAF50' };
};

const PasswordStrength = ({ password, COLORS }: { password: string; COLORS: any }) => {
  const { score, label, color } = getPasswordStrength(password);
  if (!password) return null;
  return (
    <Animated.View entering={FadeIn.duration(200)} style={sStyles.container}>
      <View style={sStyles.bars}>
        {[1, 2, 3, 4].map(i => <View key={i} style={[sStyles.bar, { backgroundColor: i <= score ? color : COLORS.border }]} />)}
      </View>
      <Text style={[sStyles.label, { color }]}>{label}</Text>
    </Animated.View>
  );
};
const sStyles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8, marginBottom: 4 },
  bars: { flexDirection: 'row', gap: 4, flex: 1 },
  bar: { flex: 1, height: 3, borderRadius: 2 },
  label: { fontSize: 11, fontWeight: '700', width: 44, textAlign: 'right' },
});

type AuthMode = 'signin' | 'signup';

export default function EmailAuth() {
  const COLORS = useTheme();
  const styles = useMemo(() => makeStyles(COLORS), [COLORS]);
  const router = useRouter();
  const { signInWithEmail, signUpWithEmail, resetPassword } = useAuth();

  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [modeKey, setModeKey] = useState(0);

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const switchMode = (m: AuthMode) => {
    setMode(m);
    setErrors({});
    setModeKey(k => k + 1);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (mode === 'signup' && !name.trim()) e.name = 'Please enter your name';
    if (!email.trim()) e.email = 'Please enter your email';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Invalid email address';
    if (!password) e.password = 'Please enter your password';
    else if (password.length < 6) e.password = 'At least 6 characters required';
    if (mode === 'signup' && password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, name);
      }
    } catch (e: any) {
      console.log('Auth error:', e?.code, e?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    const trimmedEmail = email.trim();
    if (trimmedEmail && /\S+@\S+\.\S+/.test(trimmedEmail)) {
      // Email field is already filled and valid — send directly
      resetPassword(trimmedEmail);
    } else {
      // Ask them to enter their email first
      Alert.alert(
        'Reset Password',
        'Enter the email address linked to your account and we\'ll send you a reset link.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Send Link',
            onPress: () => {
              if (!email.trim()) {
                emailRef.current?.focus();
                setErrors(e => ({ ...e, email: 'Enter your email to reset your password' }));
              } else {
                resetPassword(email.trim());
              }
            },
          },
        ]
      );
    }
  };

  const box = (field: string, err?: boolean) => [
    styles.inputBox,
    focused === field && styles.inputBoxFocused,
    err && styles.inputBoxError,
  ];

  return (
    <View style={styles.screen}>
      <StatusBar style={COLORS.statusBar} backgroundColor={COLORS.background} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
          >

            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.75}>
              <Ionicons name="chevron-back" size={20} color={COLORS.textMuted} />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <Animated.View entering={FadeInDown.delay(60).duration(400)} style={styles.header}>
              <Text style={styles.headerTitle}>{mode === 'signin' ? 'Welcome Back' : 'Create Account'}</Text>
              <Text style={styles.headerSub}>{mode === 'signin' ? 'Sign in to continue your pilgrimage journey' : 'Join thousands of pilgrims preparing for Hajj'}</Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(120).duration(400)} style={styles.toggle}>
              {(['signin', 'signup'] as AuthMode[]).map(m => (
                <TouchableOpacity key={m} style={[styles.toggleBtn, mode === m && styles.toggleBtnActive]} onPress={() => switchMode(m)} activeOpacity={0.8}>
                  <Text style={[styles.toggleText, mode === m && styles.toggleTextActive]}>{m === 'signin' ? 'Sign In' : 'Create Account'}</Text>
                </TouchableOpacity>
              ))}
            </Animated.View>

            <Animated.View key={modeKey} entering={FadeInDown.delay(180).duration(400)}>

              {mode === 'signup' && (
                <View style={styles.field}>
                  <Text style={styles.label}>FULL NAME</Text>
                  <View style={box('name', !!errors.name)}>
                    <Ionicons name="person-outline" size={18} color={focused === 'name' ? COLORS.gold : COLORS.textMuted} style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      value={name}
                      onChangeText={setName}
                      placeholder="Your name"
                      placeholderTextColor={COLORS.textMuted}
                      autoCapitalize="words"
                      returnKeyType="next"
                      onSubmitEditing={() => emailRef.current?.focus()}
                      onFocus={() => setFocused('name')}
                      onBlur={() => setFocused(null)}
                    />
                  </View>
                  {!!errors.name && <Text style={styles.error}>{errors.name}</Text>}
                </View>
              )}

              <View style={styles.field}>
                <Text style={styles.label}>EMAIL ADDRESS</Text>
                <View style={box('email', !!errors.email)}>
                  <Ionicons name="mail-outline" size={18} color={focused === 'email' ? COLORS.gold : COLORS.textMuted} style={styles.icon} />
                  <TextInput
                    ref={emailRef}
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="you@example.com"
                    placeholderTextColor={COLORS.textMuted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                    onSubmitEditing={() => passwordRef.current?.focus()}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                  />
                </View>
                {!!errors.email && <Text style={styles.error}>{errors.email}</Text>}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>PASSWORD</Text>
                <View style={box('password', !!errors.password)}>
                  <Ionicons name="lock-closed-outline" size={18} color={focused === 'password' ? COLORS.gold : COLORS.textMuted} style={styles.icon} />
                  <TextInput
                    ref={passwordRef}
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder={mode === 'signup' ? 'Create a strong password' : 'Enter your password'}
                    placeholderTextColor={COLORS.textMuted}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="password"
                    returnKeyType={mode === 'signup' ? 'next' : 'done'}
                    onSubmitEditing={() => mode === 'signup' ? confirmRef.current?.focus() : handleSubmit()}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(p => !p)}
                    activeOpacity={0.7}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={18} color={COLORS.textMuted} />
                  </TouchableOpacity>
                </View>
                {!!errors.password && <Text style={styles.error}>{errors.password}</Text>}
                {mode === 'signup' && <PasswordStrength password={password} COLORS={COLORS} />}
              </View>

              {mode === 'signup' && (
                <View style={styles.field}>
                  <Text style={styles.label}>CONFIRM PASSWORD</Text>
                  <View style={box('confirm', !!errors.confirmPassword)}>
                    <Ionicons name="shield-checkmark-outline" size={18} color={focused === 'confirm' ? COLORS.gold : COLORS.textMuted} style={styles.icon} />
                    <TextInput
                      ref={confirmRef}
                      style={styles.input}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholder="Repeat your password"
                      placeholderTextColor={COLORS.textMuted}
                      secureTextEntry={!showConfirm}
                      autoCapitalize="none"
                      autoCorrect={false}
                      textContentType="password"
                      returnKeyType="done"
                      onSubmitEditing={handleSubmit}
                      onFocus={() => setFocused('confirm')}
                      onBlur={() => setFocused(null)}
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirm(p => !p)}
                      activeOpacity={0.7}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons name={showConfirm ? 'eye-off' : 'eye'} size={18} color={COLORS.textMuted} />
                    </TouchableOpacity>
                  </View>
                  {!!errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}
                </View>
              )}

              {mode === 'signin' && (
                <TouchableOpacity style={styles.forgotBtn} onPress={handleForgotPassword} activeOpacity={0.7}>
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.submitBtn, loading && { opacity: 0.7 }]}
                onPress={handleSubmit}
                activeOpacity={0.85}
                disabled={loading}
              >
                <Text style={styles.submitText}>
                  {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
                </Text>
                {!loading && <Ionicons name="arrow-forward" size={18} color={COLORS.black} style={{ marginLeft: 8 }} />}
              </TouchableOpacity>

            </Animated.View>

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>{mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}</Text>
              <TouchableOpacity onPress={() => switchMode(mode === 'signin' ? 'signup' : 'signin')} activeOpacity={0.7}>
                <Text style={styles.switchLink}>{mode === 'signin' ? 'Create one' : 'Sign in'}</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.terms}>
              By continuing, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text>{' & '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

function makeStyles(COLORS: any) { return StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  container: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 56, paddingBottom: 40 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 32, alignSelf: 'flex-start' },
  backText: { fontSize: 14, color: COLORS.textMuted, fontWeight: '500' },
  header: { marginBottom: 28 },
  headerTitle: { fontSize: 32, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 6 },
  headerSub: { fontSize: 14, color: COLORS.textMuted, lineHeight: 22 },
  toggle: { flexDirection: 'row', backgroundColor: COLORS.surfaceAlt, borderRadius: 14, padding: 4, marginBottom: 28, borderWidth: 1, borderColor: COLORS.border },
  toggleBtn: { flex: 1, paddingVertical: 11, borderRadius: 10, alignItems: 'center' },
  toggleBtnActive: { backgroundColor: COLORS.gold },
  toggleText: { fontSize: 14, fontWeight: '700', color: COLORS.textMuted },
  toggleTextActive: { color: COLORS.black },
  field: { marginBottom: 16 },
  label: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 1.5, marginBottom: 8 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 14, paddingHorizontal: 14, height: 54 },
  inputBoxFocused: { borderColor: COLORS.gold },
  inputBoxError: { borderColor: '#C62828' },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: COLORS.textPrimary, paddingVertical: 0 },
  error: { fontSize: 12, color: '#C62828', marginTop: 5 },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 20, marginTop: -4 },
  forgotText: { fontSize: 13, color: COLORS.gold, fontWeight: '600' },
  submitBtn: { backgroundColor: COLORS.gold, borderRadius: 14, height: 54, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20, marginTop: 4 },
  submitText: { fontSize: 16, fontWeight: '800', color: COLORS.black },
  switchRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  switchText: { fontSize: 14, color: COLORS.textMuted },
  switchLink: { fontSize: 14, color: COLORS.gold, fontWeight: '700' },
  terms: { fontSize: 11, color: COLORS.textMuted, textAlign: 'center', lineHeight: 18 },
  termsLink: { color: COLORS.gold, fontWeight: '600' },
}); }