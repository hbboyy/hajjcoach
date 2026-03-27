
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Path,
  Polygon,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

const { width: W, height: H } = Dimensions.get('window');

const C = {
  bg: '#0A0A0A',
  gold: '#C9A84C',
  goldLight: '#E8C97A',
  goldDark: '#8B6914',
  goldMuted: 'rgba(201,168,76,0.12)',
  goldBorder: 'rgba(201,168,76,0.25)',
  white: '#FFFFFF',
  muted: '#555555',
  mutedLight: '#888888',
};

const KaabaArt = () => {
  const starRotate = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(starRotate, { toValue: 1, duration: 40000, easing: Easing.linear, useNativeDriver: true })
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, { toValue: 1, duration: 2500, useNativeDriver: true }),
        Animated.timing(glowPulse, { toValue: 0.5, duration: 2500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const rotate = starRotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={artS.wrap}>
      <Animated.View style={[artS.abs, artS.glow, { opacity: glowPulse }]} />

      <Animated.View style={[artS.abs, { transform: [{ rotate }] }]}>
        <Svg width={300} height={300} viewBox="0 0 300 300">
          {Array.from({ length: 32 }).map((_, i) => {
            const a = (i * 11.25 * Math.PI) / 180;
            const long = i % 4 === 0;
            return (
              <Line key={i}
                x1={150 + 130 * Math.cos(a)} y1={150 + 130 * Math.sin(a)}
                x2={150 + (long ? 118 : 123) * Math.cos(a)}
                y2={150 + (long ? 118 : 123) * Math.sin(a)}
                stroke={C.gold} strokeWidth={long ? 1.5 : 0.8} opacity={long ? 0.5 : 0.2}
              />
            );
          })}
          <Circle cx={150} cy={150} r={128} stroke={C.gold} strokeWidth={0.4} fill="none" opacity={0.15} />
        </Svg>
      </Animated.View>

      <Svg width={220} height={230} viewBox="0 0 220 230">
        <Defs>
          <LinearGradient id="frontFace" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#1E1E1E" />
            <Stop offset="1" stopColor="#080808" />
          </LinearGradient>
          <LinearGradient id="topFace" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#2A2A2A" />
            <Stop offset="1" stopColor="#141414" />
          </LinearGradient>
          <LinearGradient id="rightFace" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#121212" />
            <Stop offset="1" stopColor="#060606" />
          </LinearGradient>
          <LinearGradient id="kiswaGold" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={C.goldLight} />
            <Stop offset="0.5" stopColor={C.gold} />
            <Stop offset="1" stopColor={C.goldDark} />
          </LinearGradient>
          <RadialGradient id="stoneGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#3D1A00" />
            <Stop offset="1" stopColor="#0A0500" />
          </RadialGradient>
        </Defs>

        <Ellipse cx={110} cy={218} rx={72} ry={8} fill={C.gold} opacity={0.08} />

        <Path d="M55 75 L110 48 L178 72 L122 99 Z" fill="url(#topFace)" stroke={C.gold} strokeWidth={1.2} opacity={0.9} />
        {/* Top face subtle lines */}
        <Path d="M82 61 L140 60" stroke={C.gold} strokeWidth={0.4} opacity={0.2} />
        <Path d="M70 68 L150 67" stroke={C.gold} strokeWidth={0.3} opacity={0.15} />

        <Path d="M178 72 L178 195 L122 210 L122 99 Z" fill="url(#rightFace)" stroke={C.gold} strokeWidth={0.8} opacity={0.7} />

        {[135, 148, 161].map((x, i) => (
          <Line key={i} x1={x} y1={105 + i * 3} x2={x - 4} y2={205 + i * 2}
            stroke={C.gold} strokeWidth={0.3} opacity={0.12} />
        ))}

        <Path d="M55 75 L55 198 L122 210 L122 99 Z" fill="url(#frontFace)" stroke={C.gold} strokeWidth={1.2} />

        <Path d="M55 105 L122 120 L178 105 L178 122 L122 137 L55 122 Z" fill="url(#kiswaGold)" opacity={0.92} />

        {[65, 75, 85, 95, 107].map((x, i) => (
          <Rect key={i} x={x} y={110} width={6} height={2} rx={1} fill="#0A0A0A" opacity={0.4} />
        ))}
        {[128, 138, 148, 158, 168].map((x, i) => (
          <Rect key={i} x={x} y={110} width={5} height={2} rx={1} fill="#0A0A0A" opacity={0.3} />
        ))}

        <Path d="M76 130 L76 198 L106 207 L106 136 Z" fill="#0D0D0D" stroke={C.gold} strokeWidth={1.4} />

        <Path d="M76 136 Q91 128 106 136" fill={C.goldMuted} stroke={C.gold} strokeWidth={1} />
 
        <Path d="M80 140 L80 196 L102 204 L102 144 Z" fill="#080808" stroke={C.goldLight} strokeWidth={0.6} opacity={0.7} />
 
        <Circle cx={99} cy={172} r={3} fill={C.gold} opacity={0.9} />
        <Circle cx={99} cy={172} r={1.5} fill={C.goldDark} />

        <Line x1={83} y1={155} x2={99} y2={159} stroke={C.gold} strokeWidth={0.4} opacity={0.3} />
        <Line x1={83} y1={162} x2={99} y2={166} stroke={C.gold} strokeWidth={0.4} opacity={0.3} />
        <Line x1={83} y1={169} x2={99} y2={173} stroke={C.gold} strokeWidth={0.4} opacity={0.3} />

        <Rect x={55} y={140} width={18} height={24} rx={3} fill="url(#stoneGlow)" stroke={C.gold} strokeWidth={1.2} />
        <Ellipse cx={64} cy={152} rx={5} ry={6} fill="#050200" stroke={C.goldLight} strokeWidth={0.8} opacity={0.9} />
        <Ellipse cx={64} cy={152} rx={2.5} ry={3} fill="#0A0500" opacity={0.7} />

        <Circle cx={55} cy={75} r={4} fill={C.gold} opacity={0.9} />
        <Circle cx={178} cy={72} r={4} fill={C.gold} opacity={0.9} />
        <Circle cx={110} cy={48} r={4} fill={C.gold} opacity={0.95} />
        <Circle cx={55} cy={198} r={3.5} fill={C.gold} opacity={0.7} />
        <Circle cx={178} cy={195} r={3.5} fill={C.gold} opacity={0.7} />
        <Circle cx={122} cy={210} r={3} fill={C.gold} opacity={0.6} />

        <Line x1={55} y1={75} x2={55} y2={198} stroke={C.goldLight} strokeWidth={0.6} opacity={0.3} />
        <Line x1={55} y1={75} x2={110} y2={48} stroke={C.goldLight} strokeWidth={0.6} opacity={0.3} />
        <Line x1={110} y1={48} x2={178} y2={72} stroke={C.goldLight} strokeWidth={0.6} opacity={0.25} />
      </Svg>

      <Svg width={300} height={300} viewBox="0 0 300 300" style={artS.abs}>
        {[[28,38],[272,32],[22,240],[278,220],[64,12],[236,14],[150,8],[12,140],[288,135],[48,200],[252,195]].map(([x, y], i) => (
          <Circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2 : 1.2} fill={C.gold} opacity={0.3 + (i % 4) * 0.12} />
        ))}
      </Svg>
    </View>
  );
};

const DuaArt = () => {
  const float = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: -10, duration: 2400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 2400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, { toValue: 0.9, duration: 2000, useNativeDriver: true }),
        Animated.timing(glowPulse, { toValue: 0.4, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={artS.wrap}>
      <Animated.View style={[artS.abs, artS.glowSm, { opacity: glowPulse }]} />

      <Svg width={300} height={300} viewBox="0 0 300 300" style={artS.abs}>
        <Circle cx={150} cy={150} r={120} stroke={C.gold} strokeWidth={0.6} fill="none"
          strokeDasharray="3 7" opacity={0.2} />
        <Circle cx={150} cy={150} r={100} stroke={C.gold} strokeWidth={0.4} fill="none" opacity={0.1} />
      </Svg>

      <Animated.View style={{ transform: [{ translateY: float }] }}>
        <Svg width={260} height={200} viewBox="0 0 260 200">
          <Defs>
            <LinearGradient id="palmGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#D4A843" />
              <Stop offset="0.4" stopColor={C.gold} />
              <Stop offset="1" stopColor={C.goldDark} />
            </LinearGradient>
            <LinearGradient id="palmShadow" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor={C.goldDark} />
              <Stop offset="1" stopColor={C.gold} />
            </LinearGradient>
            <LinearGradient id="fingerGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#DDB84E" />
              <Stop offset="1" stopColor={C.gold} />
            </LinearGradient>
          </Defs>

          <Path d="M18 145 Q15 120 20 100 Q22 92 30 94 Q32 94 34 96 Q36 80 44 82 Q50 82 52 90 Q54 76 62 78 Q68 78 70 86 Q72 72 80 74 Q88 76 88 90 L90 145 Q90 160 80 168 Q60 178 38 175 Q22 170 18 145 Z"
            fill="url(#palmGrad)" />

          <Path d="M28 130 Q40 125 88 128" stroke={C.goldDark} strokeWidth={1} fill="none" opacity={0.3} />

          <Path d="M32 150 Q45 138 70 142" stroke={C.goldDark} strokeWidth={0.8} fill="none" opacity={0.25} />

          <Path d="M36 97 Q38 94 42 96" stroke={C.goldDark} strokeWidth={0.8} fill="none" opacity={0.3} />
          <Path d="M52 92 Q54 89 58 91" stroke={C.goldDark} strokeWidth={0.8} fill="none" opacity={0.3} />
          <Path d="M68 88 Q70 85 74 87" stroke={C.goldDark} strokeWidth={0.8} fill="none" opacity={0.3} />
          <Path d="M82 90 Q84 87 87 90" stroke={C.goldDark} strokeWidth={0.8} fill="none" opacity={0.3} />
          <Path d="M22 165 Q54 180 90 165 L90 185 Q54 198 22 185 Z" fill="url(#palmGrad)" opacity={0.9} />


          <Path d="M242 145 Q245 120 240 100 Q238 92 230 94 Q228 94 226 96 Q224 80 216 82 Q210 82 208 90 Q206 76 198 78 Q192 78 190 86 Q188 72 180 74 Q172 76 172 90 L170 145 Q170 160 180 168 Q200 178 222 175 Q238 170 242 145 Z"
            fill="url(#palmShadow)" />

          <Path d="M232 130 Q220 125 172 128" stroke={C.goldDark} strokeWidth={1} fill="none" opacity={0.3} />
          <Path d="M228 150 Q215 138 190 142" stroke={C.goldDark} strokeWidth={0.8} fill="none" opacity={0.25} />
          <Path d="M238 165 Q206 180 170 165 L170 185 Q206 198 238 185 Z" fill="url(#palmShadow)" opacity={0.9} />

          {[-40,-25,-10,0,10,25,40].map((offset, i) => (
            <Line key={i}
              x1={130 + offset} y1={100}
              x2={130 + offset * 0.3} y2={50}
              stroke={C.goldLight} strokeWidth={0.6} opacity={0.08 + i * 0.01}
            />
          ))}

          <Circle cx={100} cy={55} r={5} fill={C.gold} opacity={0.55} />
          <Circle cx={118} cy={35} r={3.5} fill={C.goldLight} opacity={0.45} />
          <Circle cx={130} cy={22} r={2.5} fill={C.gold} opacity={0.35} />
          <Circle cx={142} cy={35} r={3} fill={C.goldLight} opacity={0.4} />
          <Circle cx={160} cy={52} r={4.5} fill={C.gold} opacity={0.5} />
          <Circle cx={82} cy={42} r={2} fill={C.goldLight} opacity={0.3} />
          <Circle cx={178} cy={40} r={2} fill={C.gold} opacity={0.3} />
        </Svg>
      </Animated.View>

      {/* Quranic ayah — rendered as plain Text, not SVG (avoids font issues) */}
      <View style={artS.ayahBox}>
        <Text style={artS.ayahText}>ادْعُونِي أَسْتَجِبْ لَكُمْ</Text>
        <Text style={artS.ayahRef}>Surah Ghafir 40:60</Text>
      </View>
    </View>
  );
};

const AIArt = () => {
  const spin = useRef(new Animated.Value(0)).current;
  const innerSpin = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(Animated.timing(spin, { toValue: 1, duration: 20000, easing: Easing.linear, useNativeDriver: true })).start();
    Animated.loop(Animated.timing(innerSpin, { toValue: -1, duration: 12000, easing: Easing.linear, useNativeDriver: true })).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.1, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const rotateInner = innerSpin.interpolate({ inputRange: [-1, 0], outputRange: ['-360deg', '0deg'] });

  const starPoints = (cx: number, cy: number, r1: number, r2: number, pts: number) => {
    const arr = [];
    for (let i = 0; i < pts * 2; i++) {
      const a = (i * Math.PI) / pts - Math.PI / 2;
      const r = i % 2 === 0 ? r1 : r2;
      arr.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
    }
    return arr.join(' ');
  };

  return (
    <View style={artS.wrap}>
      <Animated.View style={[artS.abs, { transform: [{ rotate }] }]}>
        <Svg width={280} height={280} viewBox="0 0 280 280">
          <G opacity={0.25}>
            <Polygon points={starPoints(140, 140, 130, 110, 8)} stroke={C.gold} strokeWidth={0.8} fill="none" />
            <Polygon points={starPoints(140, 140, 120, 100, 6)} stroke={C.goldLight} strokeWidth={0.5} fill="none" />
          </G>
          {Array.from({ length: 16 }).map((_, i) => {
            const a = (i * 22.5 * Math.PI) / 180;
            return <Line key={i} x1={140 + 100 * Math.cos(a)} y1={140 + 100 * Math.sin(a)} x2={140 + 130 * Math.cos(a)} y2={140 + 130 * Math.sin(a)} stroke={C.gold} strokeWidth={0.6} opacity={0.3} />;
          })}
        </Svg>
      </Animated.View>
      <Animated.View style={[artS.abs, { transform: [{ rotate: rotateInner }] }]}>
        <Svg width={280} height={280} viewBox="0 0 280 280">
          <G opacity={0.3}>
            <Polygon points={starPoints(140, 140, 80, 60, 8)} stroke={C.gold} strokeWidth={1} fill={C.goldMuted} />
          </G>
        </Svg>
      </Animated.View>
      <Animated.View style={[artS.abs, { transform: [{ scale: pulse }] }]}>
        <Svg width={280} height={280} viewBox="0 0 280 280">
          <Defs>
            <LinearGradient id="orbGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={C.goldLight} stopOpacity={0.9} />
              <Stop offset="1" stopColor={C.gold} stopOpacity={0.6} />
            </LinearGradient>
          </Defs>
          <Circle cx={140} cy={140} r={38} fill="url(#orbGrad)" opacity={0.85} />
          <Circle cx={140} cy={140} r={28} fill={C.bg} />
        </Svg>
      </Animated.View>
      <View style={artS.abs}>
        <Svg width={280} height={280} viewBox="0 0 280 280">
          <G transform="translate(118, 118)">
            <Circle cx={22} cy={22} r={14} fill="none" stroke={C.gold} strokeWidth={1.5} />
            <Line x1={22} y1={8} x2={22} y2={0} stroke={C.gold} strokeWidth={1.5} />
            <Line x1={22} y1={36} x2={22} y2={44} stroke={C.gold} strokeWidth={1.5} />
            <Line x1={8} y1={22} x2={0} y2={22} stroke={C.gold} strokeWidth={1.5} />
            <Line x1={36} y1={22} x2={44} y2={22} stroke={C.gold} strokeWidth={1.5} />
            <Circle cx={22} cy={22} r={5} fill={C.gold} />
            <Circle cx={22} cy={0} r={2.5} fill={C.gold} />
            <Circle cx={22} cy={44} r={2.5} fill={C.gold} />
            <Circle cx={0} cy={22} r={2.5} fill={C.gold} />
            <Circle cx={44} cy={22} r={2.5} fill={C.gold} />
          </G>
        </Svg>
      </View>
    </View>
  );
};

const artS = StyleSheet.create({
  wrap: { width: 300, height: 300, justifyContent: 'center', alignItems: 'center' },
  abs: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  glow: { width: 180, height: 180, borderRadius: 90, backgroundColor: C.gold },
  glowSm: { width: 140, height: 140, borderRadius: 70, backgroundColor: C.gold },
  ayahBox: { alignItems: 'center', marginTop: 8 },
  ayahText: { fontSize: 20, color: C.gold, fontWeight: '700', letterSpacing: 1, textAlign: 'center' },
  ayahRef: { fontSize: 10, color: C.mutedLight, letterSpacing: 1.5, marginTop: 4, textTransform: 'uppercase' },
});

const SLIDES = [
  {
    id: '1',
    arabic: 'بِسْمِ ٱللَّهِ',
    subtitle: 'In the Name of Allah',
    title: 'Your Pilgrimage,\nGuided.',
    description: 'A complete companion for Hajj & Umrah — step-by-step rituals, duas, and Islamic guidance at your fingertips.',
    art: KaabaArt,
    tag: 'WELCOME',
  },
  {
    id: '2',
    arabic: 'ادْعُ رَبَّكَ',
    subtitle: 'Call Upon Your Lord',
    title: 'Duas for Every\nMoment.',
    description: 'A rich library of authenticated duas with Arabic text, transliteration and translation — for every stage of your journey.',
    art: DuaArt,
    tag: 'DUA LIBRARY',
  },
  {
    id: '3',
    arabic: 'عِلْمٌ نَافِعٌ',
    subtitle: 'Beneficial Knowledge',
    title: 'Ask. Learn.\nGrow.',
    description: 'An AI Coach trained on Islamic scholarship to answer your Hajj & Umrah questions with references from trusted scholars.',
    art: AIArt,
    tag: 'AI COACH',
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [index, setIndex] = useState(0);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideUp = useRef(new Animated.Value(0)).current;
  const artFade = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(1 / SLIDES.length)).current;

  const animateProgress = (toIndex: number) => {
    Animated.timing(progressAnim, {
      toValue: (toIndex + 1) / SLIDES.length,
      duration: 400,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  };

  const goTo = (nextIndex: number) => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(artFade, { toValue: 0, duration: 140, useNativeDriver: true }),
      Animated.timing(slideUp, { toValue: 24, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      setIndex(nextIndex);
      slideUp.setValue(-24);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 320, useNativeDriver: true }),
        Animated.timing(artFade, { toValue: 1, duration: 320, useNativeDriver: true }),
        Animated.timing(slideUp, { toValue: 0, duration: 320, easing: Easing.out(Easing.exp), useNativeDriver: true }),
      ]).start();
      animateProgress(nextIndex);
    });
  };

  const handleNext = async () => {
    if (index < SLIDES.length - 1) {
      goTo(index + 1);
    } else {
      await AsyncStorage.setItem('hasOnboarded', 'true');
      router.replace('/(auth)/login' as any);
    }
  };

  const handleBack = () => { if (index > 0) goTo(index - 1); };

  const handleSkip = async () => {
    await AsyncStorage.setItem('hasOnboarded', 'true');
    router.replace('/(auth)/login' as any);
  };

  const slide = SLIDES[index];
  const ArtComponent = slide.art;
  const isLast = index === SLIDES.length - 1;
  const isFirst = index === 0;

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={S.screen}>
      <StatusBar style="light" backgroundColor={C.bg} />

      {/* Top bar */}
      <View style={S.topBar}>
        <View style={S.tagPill}>
          <Text style={S.tagText}>{slide.tag}</Text>
        </View>
        {!isLast && (
          <TouchableOpacity onPress={handleSkip} activeOpacity={0.7} style={S.skipBtn}>
            <Text style={S.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={S.progressTrack}>
        <Animated.View style={[S.progressFill, { width: progressWidth }]} />
      </View>

      <Animated.View style={[S.artWrap, { opacity: artFade }]}>
        <ArtComponent />
      </Animated.View>

      <Animated.View style={[S.content, { opacity: fadeAnim, transform: [{ translateY: slideUp }] }]}>
        <View style={S.arabicRow}>
          <Text style={S.arabicText}>{slide.arabic}</Text>
          <Text style={S.arabicSub}>{slide.subtitle}</Text>
        </View>
        <View style={S.divider}>
          <View style={S.divLine} />
          <Text style={S.divDot}>✦</Text>
          <View style={S.divLine} />
        </View>
        <Text style={S.title}>{slide.title}</Text>
        <Text style={S.desc}>{slide.description}</Text>
      </Animated.View>

      <View style={S.dots}>
        {SLIDES.map((_, i) => (
          <TouchableOpacity key={i} onPress={() => i !== index && goTo(i)} activeOpacity={0.7}>
            <View style={[S.dot, i === index && S.dotActive]} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={[S.btnRow, isFirst && S.btnRowCentre]}>
        {!isFirst && (
          <TouchableOpacity style={S.backBtn} onPress={handleBack} activeOpacity={0.75}>
            <Text style={S.backBtnText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[S.nextBtn, isFirst && S.nextBtnFull, isLast && S.nextBtnLast]}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={[S.nextBtnText, isLast && S.nextBtnTextDark]}>
            {isLast ? "Let's Begin  🕋" : 'Next  →'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 20 }} />
    </View>
  );
}

const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg, alignItems: 'center' },

  topBar: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 56, paddingBottom: 12 },
  tagPill: { backgroundColor: C.goldMuted, borderWidth: 1, borderColor: C.goldBorder, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  tagText: { fontSize: 10, fontWeight: '700', color: C.gold, letterSpacing: 2 },
  skipBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: C.goldBorder },
  skipText: { fontSize: 13, color: C.mutedLight, fontWeight: '500' },

  progressTrack: { width: W - 48, height: 2, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 1, marginBottom: 4 },
  progressFill: { height: '100%', backgroundColor: C.gold, borderRadius: 1 },

  artWrap: { marginVertical: H * 0.015 },

  content: { width: '100%', paddingHorizontal: 28, alignItems: 'center' },
  arabicRow: { alignItems: 'center', marginBottom: 8 },
  arabicText: { fontSize: 24, color: C.gold, fontWeight: '700', letterSpacing: 1, marginBottom: 2 },
  arabicSub: { fontSize: 10, color: C.muted, letterSpacing: 2.5, textTransform: 'uppercase' },
  divider: { flexDirection: 'row', alignItems: 'center', width: '55%', marginBottom: 12 },
  divLine: { flex: 1, height: 1, backgroundColor: 'rgba(201,168,76,0.2)' },
  divDot: { color: C.gold, fontSize: 10, marginHorizontal: 8, opacity: 0.5 },
  title: { fontSize: 28, fontWeight: '800', color: C.white, textAlign: 'center', lineHeight: 36, marginBottom: 10, letterSpacing: -0.5 },
  desc: { fontSize: 13, color: C.mutedLight, textAlign: 'center', lineHeight: 21, paddingHorizontal: 8 },

  dots: { flexDirection: 'row', gap: 8, marginTop: 16, marginBottom: 14 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(201,168,76,0.25)' },
  dotActive: { width: 22, height: 6, borderRadius: 3, backgroundColor: C.gold },

  btnRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 24, width: '100%' },
  btnRowCentre: { justifyContent: 'center' },
  backBtn: { flex: 1, height: 52, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  backBtnText: { color: C.mutedLight, fontSize: 15, fontWeight: '600' },
  nextBtn: { flex: 2, height: 52, borderRadius: 14, backgroundColor: C.goldMuted, borderWidth: 1.5, borderColor: C.gold, justifyContent: 'center', alignItems: 'center' },
  nextBtnFull: { flex: 0, width: W - 48, alignSelf: 'center' },
  nextBtnLast: { backgroundColor: C.gold, borderColor: C.gold },
  nextBtnText: { color: C.gold, fontSize: 15, fontWeight: '700', letterSpacing: 0.5 },
  nextBtnTextDark: { color: C.bg },
});