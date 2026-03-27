import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { getMilestones, toggleMilestone } from '../../constants/firestoreService';
import { useTheme } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

const dailyDuas = [
  { arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', translation: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.', source: 'Quran 2:201' },
  { arabic: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ', translation: 'Here I am O Allah, here I am. Here I am, You have no partner, here I am.', source: 'Talbiyah' },
  { arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ', translation: 'O Allah, I ask You for pardon and well-being in this world and the Hereafter.', source: 'Ibn Majah' },
  { arabic: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ، سُبْحَانَ اللهِ الْعَظِيمِ', translation: 'Glory be to Allah and His is the praise, Glory be to Allah the Magnificent.', source: 'Bukhari & Muslim' },
  { arabic: 'اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي وَعَافِنِي وَارْزُقْنِي', translation: 'O Allah, forgive me, have mercy on me, guide me, grant me well-being and provide for me.', source: 'Muslim' },
  { arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي', translation: 'My Lord, expand my breast and ease my task for me.', source: 'Quran 20:25-26' },
  { arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي', translation: 'O Allah, You are the Pardoning One, You love to pardon, so pardon me.', source: 'Tirmidhi' },
];

type JourneyMode = 'Hajj' | 'Umrah';

const hajjSteps = [
  { id: 'hajj_1', nameEn: 'Ihram', nameAr: 'الإحرام', timing: 'Before 8th Dhul Hijjah', desc: 'Enter the sacred state of Ihram at the Miqat. Put on the white garments and recite the Talbiyah with a sincere intention for Hajj.', significance: 'All pilgrims stand equal before Allah — no wealth, no status. Just a pure soul seeking forgiveness.' },
  { id: 'hajj_2', nameEn: 'Tawaf Al-Qudum', nameAr: 'طواف القدوم', timing: 'Upon Arrival in Makkah', desc: 'Circle the Kaabah seven times anti-clockwise upon arriving in Makkah. Pray two Rakaahs behind Maqam Ibrahim.', significance: 'A Sunnah welcoming to the House of Allah — connecting you to every pilgrim throughout history.' },
  { id: 'hajj_3', nameEn: "Sa'i", nameAr: 'السعي', timing: 'After Tawaf', desc: "Walk seven times between the hills of Safa and Marwa. Begin at Safa and end at Marwa. Men jog between the green markers.", significance: "Commemorates Hajar's (AS) trust in Allah. Her perseverance gave us the blessed Zamzam water." },
  { id: 'hajj_4', nameEn: 'Day of Tarwiyah', nameAr: 'يوم التروية', timing: '8th Dhul Hijjah', desc: 'Travel to Mina and spend the day and night there in worship, dhikr and preparation for the great day of Arafah.', significance: 'Mina — the city of tents — prepares your heart and soul for the most important moment of Hajj.' },
  { id: 'hajj_5', nameEn: 'Wuquf at Arafah', nameAr: 'وقوف عرفة', timing: '9th Dhul Hijjah', desc: 'Stand at the plain of Arafah from after Dhuhr until sunset. Engage in sincere dua, dhikr, and repentance. This is the heart of Hajj.', significance: '"Hajj is Arafah." — The Prophet ﷺ. Allah descends and forgives more sins on this day than any other.' },
  { id: 'hajj_6', nameEn: 'Muzdalifah', nameAr: 'المزدلفة', timing: 'Night of 9th-10th', desc: 'Travel to Muzdalifah after sunset. Combine Maghrib and Isha prayers. Sleep under the open sky and collect pebbles for Rami.', significance: 'A night of humility under the stars — no roof, no comfort. Just you and your Lord.' },
  { id: 'hajj_7', nameEn: 'Rami Al-Jamarat', nameAr: 'رمي الجمرات', timing: '10th-13th Dhul Hijjah', desc: 'Stone the Jamarat pillars — 7 stones at the large pillar on Eid day, then all three on the following days. Say Allahu Akbar with each throw.', significance: 'Reject Shaytan as Ibrahim (AS) did. Every stone is a declaration that you choose Allah over temptation.' },
  { id: 'hajj_8', nameEn: 'Halq & Farewell Tawaf', nameAr: 'الحلق وطواف الوداع', timing: '10th Dhul Hijjah Onwards', desc: 'Shave or trim your hair to exit Ihram. Complete your Hajj with the Farewell Tawaf before leaving Makkah.', significance: 'Emerging renewed — your sins forgiven, your slate wiped clean. This is the promise of a Hajj Mabroor.' },
];

const umrahSteps = [
  { id: 'umrah_1', nameEn: 'Ihram', nameAr: 'الإحرام', timing: 'At the Miqat', desc: 'Make intention for Umrah, put on Ihram garments and recite: Labbayk Allaahumma Umrah. Enter the sacred state with a pure heart.', significance: 'Leaving the world behind — wealth, status, and identity — standing before Allah as His humble servant.' },
  { id: 'umrah_2', nameEn: 'Tawaf', nameAr: 'الطواف', timing: 'Upon Arrival', desc: 'Circle the Kaabah seven times anti-clockwise beginning from the Black Stone. Recite duas and engage your heart in worship.', significance: 'The angels circle the Throne of Allah above. Your Tawaf below mirrors the worship of the heavens.' },
  { id: 'umrah_3', nameEn: "Sa'i", nameAr: 'السعي', timing: 'After Tawaf', desc: "Walk seven times between Safa and Marwa. Begin at Safa reciting 'Inna as-Safa wal-Marwata...'. End at Marwa.", significance: "Every step is a step of faith — following the footsteps of a mother whose trust in Allah never wavered." },
  { id: 'umrah_4', nameEn: 'Halq or Taqsir', nameAr: 'الحلق أو التقصير', timing: "After Sa'i", desc: 'Men shave their heads or shorten their hair. Women cut a fingertip-length of hair. Umrah is now complete.', significance: 'A symbol of renewal and rebirth. You exit Ihram as if starting fresh — spiritually cleansed and forgiven.' },
];

const getHajjCountdown = () => {
  const hajjDate = new Date('2026-05-26T00:00:00');  // 9th Dhul Hijjah 1447 AH ✅
  const countdownStart = new Date('2025-11-01T00:00:00');
  const today = new Date();

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysRemaining = Math.ceil((hajjDate.getTime() - today.getTime()) / msPerDay);
  const totalSpan = Math.ceil((hajjDate.getTime() - countdownStart.getTime()) / msPerDay);
  const elapsed = Math.ceil((today.getTime() - countdownStart.getTime()) / msPerDay);
  const progress = Math.max(0, Math.min(1, elapsed / totalSpan));

  return {
    days: Math.max(0, daysRemaining),
    progress,
    isAfterHajj: daysRemaining < 0,
  };
};

const getGreeting = (iconColor: string) => {
  const hour = new Date().getHours();
  if (hour < 5)  return { text: 'Good Night',      icon: <Ionicons name="moon"         size={14} color={iconColor} /> };
  if (hour < 12) return { text: 'Good Morning',    icon: <Ionicons name="sunny"        size={14} color={iconColor} /> };
  if (hour < 17) return { text: 'Good Afternoon',  icon: <Ionicons name="partly-sunny" size={14} color={iconColor} /> };
  if (hour < 21) return { text: 'Good Evening',    icon: <Ionicons name="cloudy-night" size={14} color={iconColor} /> };
  return           { text: 'Good Night',            icon: <Ionicons name="moon"         size={14} color={iconColor} /> };
};

export default function Home() {
  const COLORS = useTheme();
  const { profile, user } = useAuth();
  const displayName = profile?.name?.split(' ')[0] || 'Pilgrim';
  const styles = useMemo(() => makeStyles(COLORS), [COLORS]);
  const router = useRouter();
  const greeting = getGreeting(COLORS.textSecondary);

  const quickLinks = [
    { id: '1', icon: <MaterialCommunityIcons name="mosque"            size={26} color={COLORS.gold} />, label: 'Tawaf Guide',  guideId: '1',  route: null },
    { id: '2', icon: <Ionicons name="walk"                            size={26} color={COLORS.gold} />, label: "Sa'i Guide",   guideId: '2',  route: null },
    { id: '3', icon: <MaterialCommunityIcons name="hands-pray"        size={26} color={COLORS.gold} />, label: 'Dua List',     guideId: null, route: '/(tabs)/duas' },
    { id: '4', icon: <MaterialCommunityIcons name="tshirt-crew-outline" size={26} color={COLORS.gold} />, label: 'Ihram Rules', guideId: '3', route: null },
    { id: '5', icon: <Ionicons name="sparkles"                        size={26} color={COLORS.gold} />, label: 'Ask Coach',    guideId: null, route: '/(tabs)/coach' },
    { id: '6', icon: <Ionicons name="moon"                            size={26} color={COLORS.gold} />, label: 'Mina Guide',   guideId: '4',  route: null },
  ];

  const [dua] = useState(() => {
    const dayOfYear = Math.floor(
      (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );
    return dailyDuas[dayOfYear % dailyDuas.length];
  });

  const [countdown] = useState(getHajjCountdown);
  const [duaExpanded, setDuaExpanded] = useState(false);
  const [journeyMode, setJourneyMode] = useState<JourneyMode>('Hajj');
  const [currentStep, setCurrentStep] = useState(0);
  const [stepExpanded, setStepExpanded] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  const [stepKey, setStepKey] = useState(0);
  const [completedMilestones, setCompletedMilestones] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;
    getMilestones(user.uid).then(ids => setCompletedMilestones(new Set(ids)));
  }, [user]);

  const handleMarkDone = async () => {
    if (!user) return;
    const stepId = steps[currentStep].id;
    const isCompleted = completedMilestones.has(stepId);
    setCompletedMilestones(prev => {
      const next = new Set(prev);
      if (isCompleted) next.delete(stepId); else next.add(stepId);
      return next;
    });
    try {
      await toggleMilestone(user.uid, stepId, !isCompleted);
    } catch {
      setCompletedMilestones(prev => {
        const next = new Set(prev);
        if (isCompleted) next.add(stepId); else next.delete(stepId);
        return next;
      });
    }
  };

  const steps = journeyMode === 'Hajj' ? hajjSteps : umrahSteps;
  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;
  const currentStepDone = completedMilestones.has(step.id);
  const completedCount = steps.filter(s => completedMilestones.has(s.id)).length;

  const progressWidth = useSharedValue(0);
  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%` as any,
  }));

  useEffect(() => {
    progressWidth.value = withTiming(countdown.progress, {
      duration: 1400,
      easing: Easing.out(Easing.cubic),
    });
  }, []);

  const handleModeChange = (mode: JourneyMode) => {
    setJourneyMode(mode);
    setCurrentStep(0);
    setStepExpanded(false);
    setStepKey(k => k + 1);
  };

  const handleNext = () => {
    if (!isLast) {
      setSlideDirection('left');
      setStepKey(k => k + 1);
      setCurrentStep(currentStep + 1);
      setStepExpanded(false);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setSlideDirection('right');
      setStepKey(k => k + 1);
      setCurrentStep(currentStep - 1);
      setStepExpanded(false);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar style={COLORS.statusBar} backgroundColor={COLORS.background} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        <Animated.View entering={FadeInDown.delay(0).duration(500)} style={styles.header}>
          <View>
            <View style={styles.greetingRow}>
              <Text style={styles.greeting}>{greeting.text} </Text>
              {greeting.icon}
            </View>
            <Text style={styles.headerTitle}>{displayName} 👋</Text>
          </View>
          <TouchableOpacity style={styles.notifButton}>
            <Ionicons name="notifications-outline" size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </Animated.View>

  
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroLabel}>HAJJ 1447 AH</Text>
              {countdown.isAfterHajj ? (
                <Text style={styles.heroDays}>🕋</Text>
              ) : (
                <>
                  <Text style={styles.heroDays}>{countdown.days}</Text>
                  <Text style={styles.heroDaysLabel}>days remaining</Text>
                </>
              )}
            </View>
            <MaterialCommunityIcons name="mosque" size={52} color={COLORS.gold} />
          </View>

          {!countdown.isAfterHajj && (
            <>
              <View style={styles.progressTrack}>
                <Animated.View style={[styles.progressFill, progressStyle]} />
              </View>
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabelText}>Today</Text>
                <Text style={styles.progressLabelText}>Hajj Day</Text>
              </View>
              <View style={styles.countdownHints}>
                <Text style={styles.countdownHintText}>
                   Eid al-Adha is {Math.max(0, countdown.days + 1)} days away
                </Text>
              </View>
            </>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.section}>
          <Text style={styles.sectionLabel}>TODAY'S DUA</Text>
          <TouchableOpacity style={styles.duaCard} onPress={() => setDuaExpanded(!duaExpanded)} activeOpacity={0.85}>
            <View style={styles.duaHeader}>
              <MaterialCommunityIcons name="hands-pray" size={18} color={COLORS.gold} style={{ marginRight: 8 }} />
              <Text style={styles.duaSource}>{dua.source}</Text>
              <Ionicons name={duaExpanded ? 'chevron-up' : 'chevron-down'} size={14} color={COLORS.textMuted} />
            </View>
            <Text style={styles.duaArabic}>{dua.arabic}</Text>
            {duaExpanded
              ? <Animated.Text entering={FadeIn.duration(300)} style={styles.duaTranslation}>{dua.translation}</Animated.Text>
              : <Text style={styles.duaTapHint}>Tap to see translation</Text>
            }
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.section}>
          <Text style={styles.sectionLabel}>QUICK ACCESS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickLinksRow}>
            {quickLinks.map((item, index) => (
              <Animated.View key={item.id} entering={FadeInDown.delay(300 + index * 60).duration(400)}>
                <TouchableOpacity
                  style={styles.quickCard}
                  onPress={() => {
                    if (item.guideId) {
                      router.push({ pathname: '/(tabs)/guide-detail', params: { id: item.guideId, from: 'home' } } as any);
                    } else if (item.route) {
                      router.push(item.route as any);
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <View style={styles.quickIconBox}>{item.icon}</View>
                  <Text style={styles.quickLabel}>{item.label}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.section}>
          <Text style={styles.sectionLabel}>YOUR JOURNEY</Text>
          <View style={styles.journeyCard}>

            <View style={styles.modeToggleRow}>
              {(['Hajj', 'Umrah'] as JourneyMode[]).map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.modeBtn, journeyMode === m && styles.modeBtnActive]}
                  onPress={() => handleModeChange(m)}
                  activeOpacity={0.8}
                >
                  {journeyMode === m && (
                    m === 'Hajj'
                      ? <MaterialCommunityIcons name="mosque" size={13} color={COLORS.black} style={{ marginRight: 5 }} />
                      : <Ionicons name="heart" size={13} color={COLORS.black} style={{ marginRight: 5 }} />
                  )}
                  <Text style={[styles.modeBtnText, journeyMode === m && styles.modeBtnTextActive]}>{m}</Text>
                </TouchableOpacity>
              ))}
              <Text style={styles.modeStepCount}>{completedCount}/{steps.length} done</Text>
            </View>

            <View style={styles.dotsRow}>
              {steps.map((s, i) => (
                <TouchableOpacity key={i} onPress={() => {
                  setSlideDirection(i > currentStep ? 'left' : 'right');
                  setStepKey(k => k + 1);
                  setCurrentStep(i);
                  setStepExpanded(false);
                }} activeOpacity={0.7}>
                  <View style={[
                    styles.dot,
                    i === currentStep && styles.dotActive,
                    completedMilestones.has(s.id) && styles.dotDone,
                  ]}>
                    {completedMilestones.has(s.id) && <Ionicons name="checkmark" size={8} color={COLORS.white} />}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.stepNumRow}>
              <Text style={styles.stepNumLabel}>Step {currentStep + 1} of {steps.length}</Text>
              <Text style={styles.stepTiming}>{step.timing}</Text>
            </View>

            <Animated.View
              key={stepKey}
              entering={slideDirection === 'left' ? SlideInRight.duration(300) : SlideInLeft.duration(300)}
              exiting={slideDirection === 'left' ? SlideOutLeft.duration(300) : SlideOutRight.duration(300)}
            >
              <View style={styles.stepBody}>
                <View style={[styles.stepIconCircle, currentStepDone && styles.stepIconCircleDone]}>
                  {currentStepDone
                    ? <Ionicons name="checkmark-circle" size={28} color={COLORS.gold} />
                    : <MaterialCommunityIcons name="mosque" size={28} color={COLORS.gold} />
                  }
                </View>
                <View style={styles.stepNames}>
                  <Text style={styles.stepNameEn}>{step.nameEn}</Text>
                  <Text style={styles.stepNameAr}>{step.nameAr}</Text>
                </View>
              </View>

              <Text style={styles.stepDesc}>{step.desc}</Text>

              <TouchableOpacity style={styles.significanceToggle} onPress={() => setStepExpanded(!stepExpanded)} activeOpacity={0.8}>
                <Ionicons name="star" size={12} color={COLORS.gold} style={{ marginRight: 6 }} />
                <Text style={styles.significanceToggleText}>
                  {stepExpanded ? 'Hide spiritual significance' : 'Show spiritual significance'}
                </Text>
                <Ionicons name={stepExpanded ? 'chevron-up' : 'chevron-down'} size={12} color={COLORS.gold} />
              </TouchableOpacity>

              {stepExpanded && (
                <Animated.View entering={FadeIn.duration(250)} style={styles.significanceBox}>
                  <Text style={styles.significanceText}>{step.significance}</Text>
                </Animated.View>
              )}

              <TouchableOpacity
                style={[styles.markDoneBtn, currentStepDone && styles.markDoneBtnDone]}
                onPress={handleMarkDone}
                activeOpacity={0.85}
              >
                <Ionicons
                  name={currentStepDone ? 'checkmark-circle' : 'checkmark-circle-outline'}
                  size={16}
                  color={currentStepDone ? COLORS.black : COLORS.gold}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.markDoneBtnText, currentStepDone && styles.markDoneBtnTextDone]}>
                  {currentStepDone ? 'Completed ✓' : 'Mark as Complete'}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.navRow}>
              <TouchableOpacity
                style={[styles.navBtn, isFirst && styles.navBtnDisabled]}
                onPress={handlePrev} activeOpacity={0.8} disabled={isFirst}
              >
                <Ionicons name="arrow-back" size={16} color={isFirst ? COLORS.textMuted : COLORS.textPrimary} />
                <Text style={[styles.navBtnText, isFirst && { color: COLORS.textMuted }]}>Previous</Text>
              </TouchableOpacity>
              <Text style={styles.navStepIndicator}>{currentStep + 1} / {steps.length}</Text>
              <TouchableOpacity
                style={[styles.navBtnNext, isLast && styles.navBtnNextDone]}
                onPress={handleNext} activeOpacity={0.8}
              >
                <Text style={styles.navBtnNextText}>{isLast ? 'All Done ✓' : 'Next'}</Text>
                {!isLast && <Ionicons name="arrow-forward" size={16} color={COLORS.black} style={{ marginLeft: 6 }} />}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.fullGuideBtn}
              onPress={() => router.push({ pathname: '/(tabs)/guide-detail', params: { id: 'featured', from: 'home' } } as any)}
              activeOpacity={0.8}
            >
              <Ionicons name="book-outline" size={14} color={COLORS.textSecondary} style={{ marginRight: 6 }} />
              <Text style={styles.fullGuideBtnText}>View Full {journeyMode} Guide</Text>
              <Ionicons name="arrow-forward" size={14} color={COLORS.gold} style={{ marginLeft: 'auto' as any }} />
            </TouchableOpacity>

          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(500)}>
          <TouchableOpacity
            style={styles.coachBanner}
            onPress={() => router.push('/(tabs)/coach' as any)}
            activeOpacity={0.85}
          >
            <View>
              <Text style={styles.coachBannerTitle}>Have a question?</Text>
              <Text style={styles.coachBannerSub}>Ask your AI Hajj Coach</Text>
            </View>
            <View style={styles.coachBannerIconBox}>
              <Ionicons name="sparkles" size={22} color={COLORS.black} />
            </View>
          </TouchableOpacity>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

function makeStyles(COLORS: any) { return StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  container: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 32 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greetingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  greeting: { fontSize: 13, color: COLORS.textSecondary },
  headerTitle: { fontSize: 24, fontWeight: '700', color: COLORS.textPrimary },
  notifButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', elevation: 3 },

  heroCard: { backgroundColor: COLORS.black, borderRadius: 24, padding: 24, marginBottom: 28, elevation: 8 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  heroLabel: { fontSize: 11, fontWeight: '600', color: COLORS.gold, letterSpacing: 2, marginBottom: 6 },
  heroDays: { fontSize: 52, fontWeight: '800', color: COLORS.white, lineHeight: 56 },
  heroDaysLabel: { fontSize: 14, color: COLORS.textMuted, marginTop: 2 },
  progressTrack: { height: 6, backgroundColor: COLORS.surfaceAlt, borderRadius: 3, marginBottom: 8, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.gold, borderRadius: 3 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  progressLabelText: { fontSize: 11, color: COLORS.textSecondary },
  countdownHints: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)', paddingTop: 10 },
  countdownHintText: { fontSize: 11, color: COLORS.textMuted },

  section: { marginBottom: 28 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 2, marginBottom: 12 },

  duaCard: { backgroundColor: COLORS.surface, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: COLORS.border, elevation: 2 },
  duaHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  duaSource: { flex: 1, fontSize: 12, fontWeight: '600', color: COLORS.gold },
  duaArabic: { fontSize: 20, color: COLORS.textPrimary, textAlign: 'right', lineHeight: 36, fontWeight: '500', marginBottom: 10 },
  duaTranslation: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22, fontStyle: 'italic', borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 12, marginTop: 4 },
  duaTapHint: { fontSize: 12, color: COLORS.textMuted, textAlign: 'center', marginTop: 4 },

  quickLinksRow: { flexDirection: 'row', gap: 12, paddingRight: 4 },
  quickCard: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 16, alignItems: 'center', width: 90, elevation: 2, borderWidth: 1, borderColor: COLORS.border },
  quickIconBox: { marginBottom: 8 },
  quickLabel: { fontSize: 11, fontWeight: '600', color: COLORS.textPrimary, textAlign: 'center' },


  journeyCard: { backgroundColor: COLORS.surface, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: COLORS.border, elevation: 4 },
  modeToggleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 8 },
  modeBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 50, backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border },
  modeBtnActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  modeBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.textMuted },
  modeBtnTextActive: { color: COLORS.black },
  modeStepCount: { fontSize: 11, color: COLORS.textMuted, marginLeft: 'auto' as any },
  dotsRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16, flexWrap: 'wrap' },
  dot: { width: 14, height: 14, borderRadius: 7, backgroundColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  dotActive: { width: 18, height: 18, borderRadius: 9, backgroundColor: COLORS.gold },
  dotDone: { backgroundColor: COLORS.black },
  stepNumRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  stepNumLabel: { fontSize: 11, fontWeight: '700', color: COLORS.gold, letterSpacing: 1 },
  stepTiming: { fontSize: 11, color: COLORS.textMuted, backgroundColor: COLORS.background, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  stepBody: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  stepIconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.black, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.gold },
  stepIconCircleDone: { borderColor: COLORS.gold, backgroundColor: COLORS.black },
  stepNames: { flex: 1 },
  stepNameEn: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 4 },
  stepNameAr: { fontSize: 15, color: COLORS.gold, fontWeight: '600' },
  stepDesc: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 22, marginBottom: 14 },
  significanceToggle: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  significanceToggleText: { flex: 1, fontSize: 12, color: COLORS.gold, fontWeight: '600' },
  significanceBox: { backgroundColor: COLORS.goldMuted, borderRadius: 12, padding: 14, marginBottom: 16, borderLeftWidth: 3, borderLeftColor: COLORS.gold },
  significanceText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20, fontStyle: 'italic' },
  markDoneBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: COLORS.gold, borderRadius: 12, paddingVertical: 10, marginBottom: 16 },
  markDoneBtnDone: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  markDoneBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.gold },
  markDoneBtnTextDone: { color: COLORS.black },
  navRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  navBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border },
  navBtnDisabled: { opacity: 0.4 },
  navBtnText: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary },
  navStepIndicator: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600' },
  navBtnNext: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 18, borderRadius: 12, backgroundColor: COLORS.gold },
  navBtnNextDone: { backgroundColor: COLORS.black },
  navBtnNextText: { fontSize: 13, fontWeight: '700', color: COLORS.black },
  fullGuideBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: COLORS.border },
  fullGuideBtnText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },

  coachBanner: { backgroundColor: COLORS.gold, borderRadius: 20, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  coachBannerTitle: { fontSize: 16, fontWeight: '700', color: COLORS.black, marginBottom: 4 },
  coachBannerSub: { fontSize: 13, color: COLORS.black },
  coachBannerIconBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.15)', justifyContent: 'center', alignItems: 'center' },
}); }