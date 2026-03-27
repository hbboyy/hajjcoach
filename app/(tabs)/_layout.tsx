import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import { useTheme } from '../../constants/theme';


const KaabahIcon = ({ color }: { color: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="7" width="13" height="15" stroke={color} strokeWidth={2} fill="none" />
    <Path d="M17 7L21 4.5V19.5L17 22" stroke={color} strokeWidth={2} strokeLinejoin="round" fill="none" />
    <Path d="M4 7L8 4.5L21 4.5" stroke={color} strokeWidth={2} strokeLinejoin="round" fill="none" />
    <Line x1="4" y1="13" x2="17" y2="13" stroke={color} strokeWidth={2} />
    <Path d="M9.5 22V17.5C9.5 16.7 10.2 16 11 16H11C11.8 16 12.5 16.7 12.5 17.5V22" stroke={color} strokeWidth={1.8} strokeLinecap="round" fill="none" />
  </Svg>
);

const TasbihIcon = ({ color }: { color: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M12 3.5C8.5 3.5 5.5 6 5.5 9.5C5.5 13 8.5 15.5 12 15.5C15.5 15.5 18.5 13 18.5 9.5C18.5 6 15.5 3.5 12 3.5Z" stroke={color} strokeWidth={1.6} fill="none" />
    <Circle cx="12" cy="3.5" r="1.6" fill={color} />
    <Circle cx="5.8" cy="7" r="1.6" fill={color} />
    <Circle cx="5.8" cy="12" r="1.6" fill={color} />
    <Circle cx="18.2" cy="7" r="1.6" fill={color} />
    <Circle cx="18.2" cy="12" r="1.6" fill={color} />
    <Path d="M12 15.5V20" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    <Circle cx="12" cy="21.5" r="1.6" fill={color} />
  </Svg>
);

const TabIcon = ({ icon, label, focused, COLORS }: { icon: React.ReactNode; label: string; focused: boolean; COLORS: any }) => (
  <View style={styles.iconContainer}>
    {icon}
    <Text style={[styles.label, { color: focused ? COLORS.gold : COLORS.textMuted }]}>{label}</Text>
    {focused && <View style={[styles.activeDot, { backgroundColor: COLORS.gold }]} />}
  </View>
);

const CoachTabIcon = ({ focused, COLORS }: { focused: boolean; COLORS: any }) => (
  <View style={styles.coachWrapper}>
    <View style={[styles.coachButton, { borderColor: COLORS.gold, backgroundColor: focused ? COLORS.gold : COLORS.black }]}>
      <Ionicons name="sparkles" size={26} color={focused ? COLORS.black : COLORS.gold} />
    </View>
    <Text style={[styles.label, { color: focused ? COLORS.gold : COLORS.textMuted }]}>Coach</Text>
  </View>
);


export default function TabLayout() {
  const COLORS = useTheme();

  return (
    <>
      <StatusBar style={COLORS.statusBar} backgroundColor={COLORS.background} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: COLORS.black,
            borderTopColor: COLORS.border,
            borderTopWidth: 1,
            height: 72,
            paddingBottom: 10,
            paddingTop: 4,
          },
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon COLORS={COLORS}
                icon={<Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={focused ? COLORS.gold : COLORS.textMuted} />}
                label="Home" focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="guides"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon COLORS={COLORS}
                icon={<KaabahIcon color={focused ? COLORS.gold : COLORS.textMuted} />}
                label="Guides" focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="coach"
          options={{
            tabBarIcon: ({ focused }) => <CoachTabIcon focused={focused} COLORS={COLORS} />,
          }}
        />
        <Tabs.Screen
          name="duas"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon COLORS={COLORS}
                icon={<TasbihIcon color={focused ? COLORS.gold : COLORS.textMuted} />}
                label="Duas" focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon COLORS={COLORS}
                icon={<Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={focused ? COLORS.gold : COLORS.textMuted} />}
                label="Profile" focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen name="guide-detail" options={{ href: null }} />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  iconContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 6, width: 64 },
  label: { fontSize: 10, fontWeight: '600', letterSpacing: 0.3, marginTop: 3 },
  activeDot: { width: 4, height: 4, borderRadius: 2, marginTop: 3 },
  coachWrapper: { alignItems: 'center', justifyContent: 'center', marginTop: -28 },
  coachButton: { width: 62, height: 62, borderRadius: 31, justifyContent: 'center', alignItems: 'center', borderWidth: 2, shadowColor: '#C9A84C', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.45, shadowRadius: 14, elevation: 12, marginBottom: 4 },
});