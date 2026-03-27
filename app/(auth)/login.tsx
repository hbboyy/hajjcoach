import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';


const GoogleLogo = () => (
  <Svg width={22} height={22} viewBox="0 0 48 48">
    <Path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <Path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <Path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <Path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </Svg>
);

const EmailLogo = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M22 6l-10 7L2 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const benefits = [
  { id: '1', icon: '🕋', label: 'Ritual Guides' },
  { id: '2', icon: '📖', label: 'Dua Library' },
  { id: '3', icon: '🤖', label: 'AI Coach' },
  { id: '4', icon: '🌍', label: 'Multilingual' },
  { id: '5', icon: '📡', label: 'Sync Progress' },
  { id: '6', icon: '🧭', label: 'Step-by-Step' },
];

export default function Login() {
  const COLORS = useTheme();
  const styles = useMemo(() => makeStyles(COLORS), [COLORS]);
  const router = useRouter();
  const { continueAsGuest } = useAuth();

  const handleGoogle = () => {
    Alert.alert(
      'Coming Soon 🚀',
      'Google Sign-In will be available in the next update. Please use email sign-in for now.',
      [{ text: 'OK' }]
    );
  };

  const handleEmail = () => {
    router.push('/(auth)/email-auth' as any);
  };

  const handleGuest = () => {
    continueAsGuest();
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >

        <View style={styles.topSection}>
          <Image
            source={require('../../assets/images/logo.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>HAJJ COACH</Text>
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerSymbol}>✦</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.headlineSection}>
          <Text style={styles.headline}>Your Pilgrimage,</Text>
          <Text style={styles.headlineGold}>Guided.</Text>
          <Text style={styles.subheadline}>
            Everything you need for a spiritually complete Hajj & Umrah — in your pocket.
          </Text>
        </View>

        <View style={styles.benefitsSection}>
          <Text style={styles.benefitsLabel}>What you get</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsContainer}
          >
            {benefits.map((item) => (
              <View key={item.id} style={styles.chip}>
                <Text style={styles.chipIcon}>{item.icon}</Text>
                <Text style={styles.chipText}>{item.label}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.authSection}>

          <TouchableOpacity style={[styles.authCard, styles.authCardDisabled]} onPress={handleGoogle} activeOpacity={0.75}>
            <View style={styles.authCardLeft}>
              <View style={[styles.authIconBox, { backgroundColor: '#1A1A1A' }]}>
                <GoogleLogo />
              </View>
              <View>
                <View style={styles.googleTitleRow}>
                  <Text style={[styles.authCardTitle, styles.authCardTitleDisabled]}>Continue with Google</Text>
                  <View style={styles.comingSoonBadge}>
                    <Text style={styles.comingSoonText}>Soon</Text>
                  </View>
                </View>
                <Text style={styles.authCardSub}>Available in next update</Text>
              </View>
            </View>
            <Text style={[styles.authArrow, { opacity: 0.3 }]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.authCard} onPress={handleEmail} activeOpacity={0.75}>
            <View style={styles.authCardLeft}>
              <View style={[styles.authIconBox, { backgroundColor: COLORS.goldMuted }]}>
                <EmailLogo color={COLORS.gold} />
              </View>
              <View>
                <Text style={styles.authCardTitle}>Continue with Email</Text>
                <Text style={styles.authCardSub}>Sign in or create account</Text>
              </View>
            </View>
            <Text style={styles.authArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.guestRow} onPress={handleGuest} activeOpacity={0.7}>
            <View style={styles.guestDividerLine} />
            <Text style={styles.guestText}>Explore as Guest</Text>
            <View style={styles.guestDividerLine} />
          </TouchableOpacity>

        </View>

        <Text style={styles.terms}>
          By continuing, you agree to our{' '}
          <Text style={styles.termsLink}>Terms of Service</Text>
          {' & '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>

      </ScrollView>
    </View>
  );
}

function makeStyles(COLORS: any) { return StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  container: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 36 },

  topSection: { alignItems: 'center', marginBottom: 20 },
  logo: { width: 56, height: 56, borderRadius: 12, marginBottom: 8 },
  appName: { fontSize: 13, fontWeight: '700', color: COLORS.gold, letterSpacing: 4 },

  dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 28 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerSymbol: { color: COLORS.gold, fontSize: 12, marginHorizontal: 10 },

  headlineSection: { marginBottom: 32 },
  headline: { fontSize: 36, fontWeight: '700', color: COLORS.textPrimary, lineHeight: 44 },
  headlineGold: { fontSize: 36, fontWeight: '700', color: COLORS.gold, lineHeight: 44, marginBottom: 12 },
  subheadline: { fontSize: 14, color: COLORS.textMuted, lineHeight: 22 },

  benefitsSection: { marginBottom: 32 },
  benefitsLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textMuted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 },
  chipsContainer: { flexDirection: 'row', gap: 10, paddingRight: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 50, paddingVertical: 8, paddingHorizontal: 14, gap: 6 },
  chipIcon: { fontSize: 15 },
  chipText: { fontSize: 13, color: COLORS.goldLight, fontWeight: '500' },

  authSection: { gap: 12, marginBottom: 24 },
  authCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 16, padding: 16 },
  authCardDisabled: { opacity: 0.55 },
  authCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  authIconBox: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  googleTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  authCardTitle: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  authCardTitleDisabled: { color: COLORS.textMuted },
  authCardSub: { fontSize: 12, color: COLORS.textMuted },
  authArrow: { fontSize: 22, color: COLORS.gold, fontWeight: '300' },

  comingSoonBadge: {
    backgroundColor: 'rgba(201,168,76,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.4)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  comingSoonText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.gold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  guestRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  guestDividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  guestText: { fontSize: 13, color: COLORS.textMuted, fontWeight: '500' },

  terms: { fontSize: 11, color: COLORS.textMuted, textAlign: 'center', lineHeight: 18 },
  termsLink: { color: COLORS.gold, fontWeight: '600' },
}); }