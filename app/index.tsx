import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const hasOnboarded = await AsyncStorage.getItem('hasOnboarded');
        console.log('=== BOOTSTRAP ===');
        console.log('hasOnboarded value:', JSON.stringify(hasOnboarded));

        if (hasOnboarded === 'true') {
          console.log('→ Going to SPLASH');
          router.replace('/(auth)/splash' as any);
        } else {
          console.log('→ Going to ONBOARDING');
          router.replace('/(auth)/Onboarding' as any);
        }
      } catch (e) {
        console.log('Bootstrap error:', e);
        router.replace('/(auth)/Onboarding' as any);
      }
    };

    bootstrap();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#C9A84C" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    justifyContent: 'center',
    alignItems: 'center',
  },
});