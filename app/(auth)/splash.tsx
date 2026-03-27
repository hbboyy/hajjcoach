import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const COLORS = {
  background: '#0A0A0A',
  gold: '#C9A84C',
  goldLight: '#E8C97A',
  white: '#FFFFFF',
  textMuted: '#A0A0A0',
};


export default function Splash() {
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const taglineFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.timing(taglineFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    });

    const timer = setTimeout(async () => {
      try {
        const onboarded = await AsyncStorage.getItem('hasOnboarded');
        if (onboarded === 'true') {
          router.replace('/(auth)/login' as any);
        } else {
          router.replace('/(auth)/Onboarding' as any);
        }
      } catch {
        router.replace('/(auth)/Onboarding' as any);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" backgroundColor="#0A0A0A" />

      <Animated.View
        style={[
          styles.centerContent,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={require('../../assets/images/splash-icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />


        <Text style={styles.appName}>HAJJ COACH</Text>


        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerSymbol}>✦</Text>
          <View style={styles.dividerLine} />
        </View>

        <Animated.Text style={[styles.tagline, { opacity: taglineFade }]}>
          Your Pilgrimage, Guided.
        </Animated.Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logo: {
    width: 110,
    height: 110,
    borderRadius: 24,
    marginBottom: 20,
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.gold,
    letterSpacing: 6,
    marginBottom: 20,
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '70%',
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#2E2E2E',
  },
  dividerSymbol: {
    color: COLORS.gold,
    fontSize: 12,
    marginHorizontal: 10,
  },

  tagline: {
    fontSize: 16,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});