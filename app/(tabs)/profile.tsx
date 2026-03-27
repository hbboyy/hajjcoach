import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { submitFeedback } from '../../constants/firestoreService';
import { useTheme } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

const languages = [
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'ar', label: 'Arabic', native: 'العربية', flag: '🇸🇦' },
  { code: 'ur', label: 'Urdu', native: 'اردو', flag: '🇵🇰' },
  { code: 'ha', label: 'Hausa', native: 'Hausa', flag: '🇳🇬' },
  { code: 'yo', label: 'Yoruba', native: 'Yorùbá', flag: '🇳🇬' },
  { code: 'fr', label: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'id', label: 'Indonesian', native: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'tr', label: 'Turkish', native: 'Türkçe', flag: '🇹🇷' },
  { code: 'ms', label: 'Malay', native: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা', flag: '🇧🇩' },
  { code: 'fa', label: 'Persian', native: 'فارسی', flag: '🇮🇷' },
];

const milestones = [
  { id: '1', iconName: 'tshirt-crew-outline', iconLib: 'mci', label: 'Learned Ihram' },
  { id: '2', iconName: 'mosque', iconLib: 'mci', label: 'Studied Tawaf' },
  { id: '3', iconName: 'walk', iconLib: 'ion', label: "Learned Sa'i" },
  { id: '4', iconName: 'triangle-outline', iconLib: 'ion', label: 'Studied Arafah' },
  { id: '5', iconName: 'cube-outline', iconLib: 'ion', label: 'Learned Rami' },
];

type ModalProps = { COLORS: any; S: any; onClose: () => void };
type LangModalProps = ModalProps & { visible: boolean; selected: string; onSelect: (code: string) => void };
type SimpleModalProps = ModalProps & { visible: boolean };
type FeedbackModalProps = SimpleModalProps & { uid?: string };

// ─── Language Modal ───────────────────────────
const LanguageModal = ({ COLORS, S, visible, selected, onSelect, onClose }: LangModalProps) => (
  <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
    <View style={S.mScreen}>
      <View style={S.mHeader}>
        <Text style={S.mTitle}>Choose Language</Text>
        <TouchableOpacity onPress={onClose} style={S.mCloseBtn}>
          <Ionicons name="close" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
      <Text style={S.mSubtitle}>Select your preferred app language</Text>
      <ScrollView contentContainerStyle={S.mList}>
        {languages.map(lang => (
          <TouchableOpacity
            key={lang.code}
            style={[S.langItem, selected === lang.code && S.langItemActive]}
            onPress={() => {
              if (lang.code !== 'en') {
                Alert.alert(
                  `${lang.flag} ${lang.label}`,
                  `${lang.native} is coming soon to Hajj Coach.\n\nWe are working on full translations with Islamic scholars to ensure accuracy.\n\nJazakAllahu Khayran for your patience! 🌍`,
                  [{ text: 'In sha Allah', style: 'default' }]
                );
              } else {
                onSelect(lang.code);
                onClose();
              }
            }}
            activeOpacity={0.8}
          >
            <Text style={S.langFlag}>{lang.flag}</Text>
            <View style={S.langTexts}>
              <Text style={[S.langLabel, selected === lang.code && { color: COLORS.gold }]}>{lang.label}</Text>
              <Text style={S.langNative}>{lang.native}</Text>
            </View>
            {selected === lang.code
              ? <Ionicons name="checkmark-circle" size={22} color={COLORS.gold} />
              : lang.code !== 'en'
              ? <View style={S.comingSoonBadge}><Text style={S.comingSoonText}>Soon</Text></View>
              : null}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={S.mFooter}>
        <Text style={S.mFooterNote}>🌍 More languages coming soon. Translations are being prepared with Islamic scholarly oversight to ensure accuracy.</Text>
      </View>
    </View>
  </Modal>
);

// ─── About Modal ──────────────────────────────
const AboutModal = ({ COLORS, S, visible, onClose }: SimpleModalProps) => (
  <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
    <View style={S.mScreen}>
      <View style={S.mHeader}>
        <Text style={S.mTitle}>About Hajj Coach</Text>
        <TouchableOpacity onPress={onClose} style={S.mCloseBtn}>
          <Ionicons name="close" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={S.mContent}>
        <View style={S.aboutLogoBox}>
          <Image source={require('../../assets/images/logo.jpg')} style={S.aboutLogo} resizeMode="contain" />
          <Text style={S.aboutVersion}>Version 1.0.0</Text>
        </View>
        {[
          { title: 'Our Mission', body: 'Hajj Coach was built to make the sacred journey of Hajj and Umrah accessible, understandable, and spiritually enriching for every Muslim — regardless of where they are in the world or how much prior knowledge they have.' },
          { title: 'What We Offer', body: '🕋  Step-by-step Hajj & Umrah guides\n🤲  Comprehensive Dua library with Arabic text\n🤖  AI-powered Hajj Coach for your questions\n📖  Detailed ritual explanations & significance\n🌍  Multi-language support for global Muslims' },
          { title: 'Built By', body: 'Hajj Coach is proudly built by Neumosoft — a team passionate about building technology that serves the Muslim community.' },
          { title: 'Disclaimer', body: 'Hajj Coach provides educational guidance based on established Islamic scholarship. For complex fiqh questions, always consult a qualified Islamic scholar. May Allah accept all your acts of worship. 🤲' },
        ].map((s, i) => (
          <View key={i} style={S.policySection}>
            <Text style={S.policySectionTitle}>{s.title}</Text>
            <Text style={S.policyText}>{s.body}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  </Modal>
);

// ─── Privacy Modal ────────────────────────────
const PrivacyModal = ({ COLORS, S, visible, onClose }: SimpleModalProps) => (
  <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
    <View style={S.mScreen}>
      <View style={S.mHeader}>
        <Text style={S.mTitle}>Privacy Policy</Text>
        <TouchableOpacity onPress={onClose} style={S.mCloseBtn}>
          <Ionicons name="close" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={S.mContent}>
        <Text style={S.policyDate}>Last updated: March 2026</Text>
        {[
          { title: '1. Information We Collect', body: 'We collect information you provide when creating an account (name, email address). We also collect usage data such as guides viewed and duas saved to improve your experience.' },
          { title: '2. How We Use Your Information', body: 'Your information is used to personalise your app experience, sync your progress across devices, send optional Hajj reminders, and improve our services. We do not sell or share your personal data.' },
          { title: '3. Data Storage & Security', body: 'Your data is stored securely using industry-standard encryption. You can delete your account and all associated data at any time from the Profile settings.' },
          { title: '4. AI Coach Conversations', body: 'Conversations with the AI Hajj Coach are processed to generate responses. These are not stored permanently and are not linked to your personal profile.' },
          { title: '5. Your Rights', body: 'You have the right to access, update, or delete your personal data at any time. Contact us at privacy@neumosoft.com for any data requests.' },
          { title: '6. Contact Us', body: 'For privacy questions:\nprivacy@neumosoft.com\n\nNeumosoft, Lagos, Nigeria' },
        ].map((s, i) => (
          <View key={i} style={S.policySection}>
            <Text style={S.policySectionTitle}>{s.title}</Text>
            <Text style={S.policyText}>{s.body}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  </Modal>
);

// ─── Terms Modal ──────────────────────────────
const TermsModal = ({ COLORS, S, visible, onClose }: SimpleModalProps) => (
  <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
    <View style={S.mScreen}>
      <View style={S.mHeader}>
        <Text style={S.mTitle}>Terms of Service</Text>
        <TouchableOpacity onPress={onClose} style={S.mCloseBtn}>
          <Ionicons name="close" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={S.mContent}>
        <Text style={S.policyDate}>Effective: March 2026</Text>
        {[
          { title: '1. Acceptance of Terms', body: 'By using Hajj Coach, you agree to these Terms of Service. These terms apply to all users of the app.' },
          { title: '2. Use of the App', body: 'Hajj Coach is provided for personal, non-commercial use only. You agree to use the app only for its intended purpose of learning about Hajj and Umrah.' },
          { title: '3. Religious Content Disclaimer', body: 'Content is provided for educational purposes based on established Islamic scholarship. It is not a substitute for advice from a qualified Islamic scholar.' },
          { title: '4. AI Coach Usage', body: 'The AI Hajj Coach provides guidance based on Islamic knowledge. Responses are generated by AI and may not always be perfectly accurate. Always verify with a qualified scholar.' },
          { title: '5. Intellectual Property', body: 'All content, design, and code in Hajj Coach is the property of Neumosoft. You may not copy or distribute our content without explicit permission.' },
          { title: '6. Contact', body: 'legal@neumosoft.com\n\nNeumosoft © 2026. All rights reserved.' },
        ].map((s, i) => (
          <View key={i} style={S.policySection}>
            <Text style={S.policySectionTitle}>{s.title}</Text>
            <Text style={S.policyText}>{s.body}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  </Modal>
);

// ─── Feedback Modal ───────────────────────────
const FeedbackModal = ({ COLORS, S, visible, onClose, uid }: FeedbackModalProps) => {
  const [type, setType] = useState<'bug' | 'suggestion' | 'general'>('general');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      Alert.alert('Empty Feedback', 'Please enter your feedback before submitting.');
      return;
    }
    setLoading(true);
    try {
      await submitFeedback({ uid, type, message: message.trim() });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setMessage('');
        setType('general');
        onClose();
      }, 2500);
    } catch {
      Alert.alert('Error', 'Could not submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={S.mScreen}>
        <View style={S.mHeader}>
          <Text style={S.mTitle}>Send Feedback</Text>
          <TouchableOpacity onPress={onClose} style={S.mCloseBtn}>
            <Ionicons name="close" size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={S.mContent}>
          {submitted ? (
            <Animated.View entering={FadeIn.duration(300)} style={S.successBox}>
              <Ionicons name="checkmark-circle" size={52} color="#4CAF50" style={{ marginBottom: 12 }} />
              <Text style={S.successTitle}>JazakAllahu Khayran!</Text>
              <Text style={S.successText}>Your feedback has been received. We truly appreciate you helping us improve.</Text>
            </Animated.View>
          ) : (
            <>
              <Text style={S.feedbackLabel}>FEEDBACK TYPE</Text>
              <View style={S.feedbackTypes}>
                {([
                  { key: 'general', icon: 'chatbubble-outline', label: 'General' },
                  { key: 'suggestion', icon: 'bulb-outline', label: 'Suggestion' },
                  { key: 'bug', icon: 'bug-outline', label: 'Bug Report' },
                ] as const).map(t => (
                  <TouchableOpacity
                    key={t.key}
                    style={[S.feedbackTypeBtn, type === t.key && S.feedbackTypeBtnActive]}
                    onPress={() => setType(t.key)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name={t.icon as any} size={16} color={type === t.key ? COLORS.black : COLORS.textMuted} style={{ marginRight: 6 }} />
                    <Text style={[S.feedbackTypeBtnText, type === t.key && { color: COLORS.black }]}>{t.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={S.feedbackLabel}>YOUR MESSAGE</Text>
              <TextInput
                style={S.feedbackInput}
                placeholder="Tell us what you think, what's missing, or what could be better..."
                placeholderTextColor={COLORS.textMuted}
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
              <Text style={S.feedbackNote}>💡 Your feedback directly shapes the next version of Hajj Coach.</Text>
              <TouchableOpacity
                style={[S.submitBtn, loading && { opacity: 0.7 }]}
                onPress={handleSubmit}
                activeOpacity={0.85}
                disabled={loading}
              >
                <Ionicons name="send" size={16} color={COLORS.black} style={{ marginRight: 8 }} />
                <Text style={S.submitBtnText}>{loading ? 'Submitting...' : 'Submit Feedback'}</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

// ─── Main Screen ──────────────────────────────
export default function Profile() {
  const COLORS = useTheme();
  const styles = useMemo(() => makeStyles(COLORS), [COLORS]);
  const { user, profile, signOut } = useAuth();

  const displayName = profile?.name || user?.displayName || 'Pilgrim';

  const [notifications, setNotifications] = useState(true);
  const [dailyDua, setDailyDua] = useState(true);
  const [arabicScript, setArabicScript] = useState(true);
  const [checkedMilestones, setCheckedMilestones] = useState<string[]>([]);
  const [selectedLang, setSelectedLang] = useState('en');
  const [showLang, setShowLang] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const toggleMilestone = (id: string) =>
    setCheckedMilestones(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  const completedCount = checkedMilestones.length;
  const journeyProgress = Math.round((completedCount / milestones.length) * 100);
  const currentLang = languages.find(l => l.code === selectedLang);

  const getToggleValue = (id: string) => id === 'notif' ? notifications : id === 'dua' ? dailyDua : arabicScript;
  const handleToggle = (id: string, val: boolean) => {
    if (id === 'notif') setNotifications(val);
    if (id === 'dua') setDailyDua(val);
    if (id === 'arabic') setArabicScript(val);
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  const handleItemPress = (id: string) => {
    if (id === 'lang') setShowLang(true);
    if (id === 'about') setShowAbout(true);
    if (id === 'privacy') setShowPrivacy(true);
    if (id === 'terms') setShowTerms(true);
    if (id === 'feedback') setShowFeedback(true);
    if (id === 'logout') handleSignOut();
  };

  const settingSections = [
    {
      title: 'Preferences',
      items: [
        { id: 'lang', iconName: 'earth', iconLib: 'ion', label: 'Language', sub: 'App & content language', type: 'value', value: `${currentLang?.flag} ${currentLang?.label}`, danger: false },
        { id: 'arabic', iconName: 'book', iconLib: 'ion', label: 'Arabic Script', sub: 'Show Arabic text in duas & guides', type: 'toggle', danger: false },
        { id: 'notif', iconName: 'notifications', iconLib: 'ion', label: 'Notifications', sub: 'Reminders and updates', type: 'toggle', danger: false },
        { id: 'dua', iconName: 'hands-pray', iconLib: 'mci', label: 'Daily Dua Reminder', sub: 'Get a dua every morning', type: 'toggle', danger: false },
      ],
    },
    {
      title: 'About',
      items: [
        { id: 'about', iconName: 'information-circle', iconLib: 'ion', label: 'About Hajj Coach', sub: 'Version 1.0.0 • Built by Neumosoft', type: 'arrow', danger: false },
        { id: 'privacy', iconName: 'lock-closed', iconLib: 'ion', label: 'Privacy Policy', sub: 'How we handle your data', type: 'arrow', danger: false },
        { id: 'terms', iconName: 'document-text', iconLib: 'ion', label: 'Terms of Service', sub: 'Rules for using Hajj Coach', type: 'arrow', danger: false },
        { id: 'feedback', iconName: 'chatbubble', iconLib: 'ion', label: 'Send Feedback', sub: 'Help us improve', type: 'arrow', danger: false },
      ],
    },
    {
      title: 'Account',
      items: [
        { id: 'logout', iconName: 'log-out', iconLib: 'ion', label: 'Sign Out', sub: '', type: 'arrow', danger: true },
      ],
    },
  ];

  return (
    <View style={styles.screen}>
      <StatusBar style={COLORS.statusBar} backgroundColor={COLORS.background} />

      <LanguageModal COLORS={COLORS} S={styles} visible={showLang} selected={selectedLang} onSelect={setSelectedLang} onClose={() => setShowLang(false)} />
      <AboutModal COLORS={COLORS} S={styles} visible={showAbout} onClose={() => setShowAbout(false)} />
      <PrivacyModal COLORS={COLORS} S={styles} visible={showPrivacy} onClose={() => setShowPrivacy(false)} />
      <TermsModal COLORS={COLORS} S={styles} visible={showTerms} onClose={() => setShowTerms(false)} />
      <FeedbackModal COLORS={COLORS} S={styles} visible={showFeedback} onClose={() => setShowFeedback(false)} uid={user?.uid} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>

        {/* ── Hero ── */}
        <Animated.View entering={FadeInDown.delay(0).duration(400)} style={styles.heroCard}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="mosque" size={40} color={COLORS.gold} />
          </View>
          <Text style={styles.userName}>{displayName}</Text>
          <View style={styles.verifiedBadge}>
            <Ionicons name="shield-checkmark" size={13} color={COLORS.gold} style={{ marginRight: 5 }} />
            <Text style={styles.verifiedText}>Verified Pilgrim</Text>
          </View>
        </Animated.View>

        {/* ── Journey ── */}
        <Animated.View entering={FadeInDown.delay(80).duration(400)} style={styles.journeyCard}>
          <View style={styles.journeyHeader}>
            <View>
              <Text style={styles.journeyTitle}>My Hajj Journey</Text>
              <Text style={styles.journeySubtitle}>{completedCount}/{milestones.length} milestones completed</Text>
            </View>
            <Text style={styles.journeyPercent}>{journeyProgress}%</Text>
          </View>
          <View style={styles.journeyProgressTrack}>
            <View style={[styles.journeyProgressFill, { width: `${journeyProgress}%` as any }]} />
          </View>
          <View style={styles.milestones}>
            {milestones.map(m => {
              const done = checkedMilestones.includes(m.id);
              return (
                <TouchableOpacity key={m.id} style={styles.milestoneItem} onPress={() => toggleMilestone(m.id)} activeOpacity={0.8}>
                  <View style={[styles.milestoneCheck, done && styles.milestoneCheckDone]}>
                    {done && <Ionicons name="checkmark" size={12} color={COLORS.black} />}
                  </View>
                  {m.iconLib === 'mci'
                    ? <MaterialCommunityIcons name={m.iconName as any} size={18} color={done ? COLORS.textMuted : COLORS.gold} />
                    : <Ionicons name={m.iconName as any} size={18} color={done ? COLORS.textMuted : COLORS.gold} />}
                  <Text style={[styles.milestoneLabel, done && styles.milestoneLabelDone]}>{m.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {/* ── Settings ── */}
        {settingSections.map((section, si) => (
          <Animated.View key={section.title} entering={FadeInDown.delay(160 + si * 60).duration(400)} style={styles.settingSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.settingCard}>
              {section.items.map((item, i) => (
                <View key={item.id}>
                  <TouchableOpacity
                    style={styles.settingItem}
                    activeOpacity={item.type === 'toggle' ? 1 : 0.75}
                    onPress={() => item.type !== 'toggle' && handleItemPress(item.id)}
                  >
                    <View style={[styles.settingIconBox, item.danger && { backgroundColor: COLORS.dangerBg }]}>
                      {item.iconLib === 'mci'
                        ? <MaterialCommunityIcons name={item.iconName as any} size={18} color={item.danger ? COLORS.danger : COLORS.textSecondary} />
                        : <Ionicons name={item.iconName as any} size={18} color={item.danger ? COLORS.danger : COLORS.textSecondary} />}
                    </View>
                    <View style={styles.settingText}>
                      <Text style={[styles.settingLabel, item.danger && { color: COLORS.danger }]}>{item.label}</Text>
                      {item.sub ? <Text style={styles.settingSubLabel}>{item.sub}</Text> : null}
                    </View>
                    {item.type === 'toggle' && <Switch value={getToggleValue(item.id)} onValueChange={val => handleToggle(item.id, val)} trackColor={{ false: COLORS.border, true: COLORS.gold }} thumbColor={COLORS.white} />}
                    {item.type === 'arrow' && <Ionicons name="chevron-forward" size={18} color={item.danger ? COLORS.danger : COLORS.textMuted} />}
                    {item.type === 'value' && <View style={styles.valueRow}><Text style={styles.valueText}>{(item as any).value}</Text><Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} /></View>}
                  </TouchableOpacity>
                  {i < section.items.length - 1 && <View style={styles.settingDivider} />}
                </View>
              ))}
            </View>
          </Animated.View>
        ))}

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <MaterialCommunityIcons name="hands-pray" size={20} color={COLORS.textMuted} style={{ marginBottom: 6 }} />
          <Text style={styles.footerDua}>May your Hajj be Accepted</Text>
          <Text style={styles.footerVersion}>Hajj Coach • Version 1.0.0</Text>
          <View style={styles.footerDivider} />
          <Text style={styles.footerPowered}>Powered by</Text>
          <Text style={styles.footerBrand}>Neumosoft</Text>
          <Text style={styles.footerTagline}>© 2026 Neumosoft. All rights reserved.</Text>
        </View>

      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────
function makeStyles(COLORS: any) { return StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  container: { paddingBottom: 40 },

  // Hero
  heroCard: { backgroundColor: COLORS.black, marginHorizontal: 20, marginTop: 56, borderRadius: 28, padding: 28, alignItems: 'center', marginBottom: 16 },
  avatar: { width: 88, height: 88, borderRadius: 44, backgroundColor: COLORS.surfaceAlt, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.gold, marginBottom: 16 },
  userName: { fontSize: 20, fontWeight: '700', color: COLORS.white, marginBottom: 12 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(201,168,76,0.15)', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: COLORS.gold },
  verifiedText: { fontSize: 12, color: COLORS.gold, fontWeight: '600' },

  // Journey
  journeyCard: { backgroundColor: COLORS.surface, marginHorizontal: 20, borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  journeyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  journeyTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  journeySubtitle: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  journeyPercent: { fontSize: 24, fontWeight: '800', color: COLORS.gold },
  journeyProgressTrack: { height: 6, backgroundColor: COLORS.border, borderRadius: 3, marginBottom: 16, overflow: 'hidden' },
  journeyProgressFill: { height: '100%' as any, backgroundColor: COLORS.gold, borderRadius: 3 },
  milestones: { gap: 10 },
  milestoneItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  milestoneCheck: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  milestoneCheckDone: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  milestoneLabel: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '500' },
  milestoneLabelDone: { color: COLORS.textMuted, textDecorationLine: 'line-through' },

  // Settings
  settingSection: { marginHorizontal: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 2, marginBottom: 8, textTransform: 'uppercase' },
  settingCard: { backgroundColor: COLORS.surface, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  settingItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  settingIconBox: { width: 38, height: 38, borderRadius: 10, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
  settingText: { flex: 1 },
  settingLabel: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  settingSubLabel: { fontSize: 12, color: COLORS.textMuted, marginTop: 1 },
  valueRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  valueText: { fontSize: 14, color: COLORS.textMuted },
  settingDivider: { height: 1, backgroundColor: COLORS.border, marginLeft: 68 },

  // Footer
  footer: { alignItems: 'center', paddingVertical: 28, gap: 4 },
  footerDua: { fontSize: 14, color: COLORS.textSecondary, fontStyle: 'italic', marginBottom: 4 },
  footerVersion: { fontSize: 12, color: COLORS.textMuted },
  footerDivider: { width: 40, height: 1, backgroundColor: COLORS.border, marginVertical: 12 },
  footerPowered: { fontSize: 11, color: COLORS.textMuted },
  footerBrand: { fontSize: 16, fontWeight: '800', color: COLORS.gold, letterSpacing: 1 },
  footerTagline: { fontSize: 10, color: COLORS.textMuted, marginTop: 2 },

  // Modal shared
  mScreen: { flex: 1, backgroundColor: COLORS.background },
  mHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  mTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  mCloseBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
  mSubtitle: { fontSize: 13, color: COLORS.textMuted, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 4 },
  mList: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32 },
  mFooter: { paddingHorizontal: 20, paddingVertical: 16, backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border },
  mFooterNote: { fontSize: 12, color: COLORS.textMuted, lineHeight: 18 },
  mContent: { padding: 20, paddingBottom: 40 },

  // Language
  langItem: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, backgroundColor: COLORS.surface, borderRadius: 16, marginBottom: 10, borderWidth: 1.5, borderColor: COLORS.border },
  langItemActive: { borderColor: COLORS.gold, backgroundColor: COLORS.goldMuted },
  langFlag: { fontSize: 28 },
  langTexts: { flex: 1 },
  langLabel: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  langNative: { fontSize: 13, color: COLORS.textMuted, marginTop: 1 },
  comingSoonBadge: { backgroundColor: COLORS.border, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  comingSoonText: { fontSize: 10, fontWeight: '700', color: COLORS.textMuted },

  // About
  aboutLogoBox: { alignItems: 'center', backgroundColor: COLORS.black, borderRadius: 24, marginBottom: 20, overflow: 'hidden' },
  aboutLogo: { width: '100%' as any, height: 200 },
  aboutVersion: { fontSize: 12, color: COLORS.textMuted, paddingVertical: 10 },

  // Policy
  policyDate: { fontSize: 12, color: COLORS.textMuted, marginBottom: 20, fontStyle: 'italic' },
  policySection: { marginBottom: 14, backgroundColor: COLORS.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  policySectionTitle: { fontSize: 14, fontWeight: '800', color: COLORS.gold, marginBottom: 8 },
  policyText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 22 },

  // Feedback
  feedbackLabel: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 2, marginBottom: 10 },
  feedbackTypes: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  feedbackTypeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 12, backgroundColor: COLORS.surface, borderWidth: 1.5, borderColor: COLORS.border },
  feedbackTypeBtnActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  feedbackTypeBtnText: { fontSize: 12, fontWeight: '700', color: COLORS.textMuted },
  feedbackInput: { backgroundColor: COLORS.surface, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 16, padding: 14, fontSize: 14, color: COLORS.textPrimary, minHeight: 140, marginBottom: 14 },
  feedbackNote: { fontSize: 12, color: COLORS.textMuted, lineHeight: 18, marginBottom: 20, backgroundColor: COLORS.goldMuted, padding: 12, borderRadius: 10 },
  submitBtn: { backgroundColor: COLORS.gold, borderRadius: 14, height: 52, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  submitBtnText: { fontSize: 15, fontWeight: '800', color: COLORS.black },
  successBox: { alignItems: 'center', paddingTop: 60 },
  successTitle: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 12 },
  successText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22 },
}); }