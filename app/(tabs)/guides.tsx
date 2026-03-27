import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../constants/theme';

type Difficulty = 'Beginner' | 'Important' | 'Advanced';
type Category = 'All' | 'Hajj' | 'Umrah' | 'Dua' | 'Pillar';

type Guide = {
  id: string; iconName: string; iconLib: 'ion' | 'mci';
  title: string; description: string; steps: number;
  difficulty: Difficulty; category: Category;
};

const guides: Guide[] = [
  { id: '1', iconName: 'refresh-circle', iconLib: 'ion', title: 'How to Perform Tawaf', description: 'Circle the Kaabah 7 times with proper duas and etiquette', steps: 7, difficulty: 'Beginner', category: 'Hajj' },
  { id: '2', iconName: 'walk', iconLib: 'ion', title: "Sa'i Between Safa & Marwa", description: "Walk 7 times between the two hills following Hajar's footsteps", steps: 5, difficulty: 'Beginner', category: 'Hajj' },
  { id: '3', iconName: 'tshirt-crew-outline', iconLib: 'mci', title: 'Ihram Rules & Restrictions', description: 'Everything you must know before entering the state of Ihram', steps: 8, difficulty: 'Important', category: 'Pillar' },
  { id: '4', iconName: 'moon', iconLib: 'ion', title: 'Days of Mina Guide', description: 'Complete guide to spending the days of Tashreeq in Mina', steps: 6, difficulty: 'Important', category: 'Hajj' },
  { id: '5', iconName: 'cube-outline', iconLib: 'ion', title: 'Rami — Stoning the Jamarat', description: 'Step-by-step guide to performing the stoning ritual correctly', steps: 5, difficulty: 'Important', category: 'Hajj' },
  { id: '6', iconName: 'cut', iconLib: 'ion', title: 'Halq & Taqsir', description: 'Shaving or trimming hair to exit the state of Ihram', steps: 3, difficulty: 'Beginner', category: 'Hajj' },
  { id: '7', iconName: 'heart-outline', iconLib: 'ion', title: 'Umrah Step by Step', description: 'Complete guide to performing Umrah from Ihram to completion', steps: 10, difficulty: 'Beginner', category: 'Umrah' },
  { id: '8', iconName: 'mosque', iconLib: 'mci', title: 'Visiting Madinah', description: "Etiquettes and duas for visiting the Prophet's Mosque", steps: 6, difficulty: 'Beginner', category: 'Umrah' },
  { id: '9', iconName: 'hands-pray', iconLib: 'mci', title: 'Duas of Hajj & Umrah', description: 'Essential duas for every stage of your pilgrimage journey', steps: 12, difficulty: 'Beginner', category: 'Dua' },
  { id: '10', iconName: 'triangle-outline', iconLib: 'ion', title: 'Standing at Arafah', description: 'The most important pillar of Hajj — how to maximise your day', steps: 4, difficulty: 'Advanced', category: 'Pillar' },
];

const categories: Category[] = ['All', 'Hajj', 'Umrah', 'Dua', 'Pillar'];

const difficultyStyle = (d: Difficulty) => {
  if (d === 'Beginner') return { bg: '#E8F5E9', text: '#2E7D32' };
  if (d === 'Important') return { bg: '#FFF8E1', text: '#F57F17' };
  return { bg: '#FCE4EC', text: '#C62828' };
};

const GuideIcon = ({ guide, size, color }: { guide: Guide; size: number; color: string }) => {
  if (guide.iconLib === 'mci') return <MaterialCommunityIcons name={guide.iconName as any} size={size} color={color} />;
  return <Ionicons name={guide.iconName as any} size={size} color={color} />;
};

const GuideCard = ({ guide, onPress, index, COLORS, styles }: { guide: Guide; onPress: () => void; index: number; COLORS: any; styles: any }) => {
  const diff = difficultyStyle(guide.difficulty);
  return (
    <Animated.View entering={FadeInDown.delay(index * 60).duration(400)} style={{ flex: 1 }}>
      <TouchableOpacity style={styles.gridCard} activeOpacity={0.82} onPress={onPress}>
        {/* Icon */}
        <View style={styles.gridCardIcon}>
          <GuideIcon guide={guide} size={24} color={COLORS.gold} />
        </View>

        <View style={[styles.diffBadge, { backgroundColor: diff.bg }]}>
          <Text style={[styles.diffBadgeText, { color: diff.text }]}>{guide.difficulty}</Text>
        </View>

        <Text style={styles.gridCardTitle} numberOfLines={2}>{guide.title}</Text>

        <View style={styles.gridCardFooter}>
          <Text style={styles.gridCardSteps}>{guide.steps} steps</Text>
          <Ionicons name="chevron-forward" size={14} color={COLORS.textMuted} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function Guides() {
  const COLORS = useTheme();
  const styles = useMemo(() => makeStyles(COLORS), [COLORS]);
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const filteredGuides = activeCategory === 'All' ? guides : guides.filter(g => g.category === activeCategory);
  const pairs: Guide[][] = [];
  for (let i = 0; i < filteredGuides.length; i += 2) pairs.push(filteredGuides.slice(i, i + 2));

  const handleGuidePress = (guide: Guide) => {
    router.push({ pathname: '/(tabs)/guide-detail', params: { id: guide.id, from: 'guides' } } as any);
  };

  return (
    <View style={styles.screen}>
      <StatusBar style={COLORS.statusBar} backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Guides</Text>
          <Text style={styles.headerSubtitle}>Your Hajj Ritual Library</Text>
        </View>
        <TouchableOpacity style={styles.searchButton} activeOpacity={0.8}>
          <Ionicons name="search" size={18} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>

        <Animated.View entering={FadeInDown.delay(0).duration(400)}>
          <TouchableOpacity
            style={styles.featuredCard}
            activeOpacity={0.85}
            onPress={() => router.push({ pathname: '/(tabs)/guide-detail', params: { id: 'featured', from: 'guides' } } as any)}
          >
            <View style={styles.featuredContent}>
              <Text style={styles.featuredTag}>✦ FEATURED</Text>
              <Text style={styles.featuredTitle}>Complete Hajj Guide</Text>
              <Text style={styles.featuredDesc}>Your full pilgrimage journey from Ihram to completion</Text>
              <View style={styles.featuredMeta}>
                <Text style={styles.featuredMetaText}>12 rituals</Text>
                <View style={styles.featuredMetaDot} />
                <Text style={styles.featuredMetaText}>All levels</Text>
              </View>
              <View style={styles.featuredButton}>
                <Text style={styles.featuredButtonText}>Begin Journey</Text>
                <Ionicons name="arrow-forward" size={14} color={COLORS.black} style={{ marginLeft: 6 }} />
              </View>
            </View>
            <MaterialCommunityIcons name="mosque" size={52} color={COLORS.gold} />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow} style={styles.categoryScroll}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryPill, activeCategory === cat && styles.categoryPillActive]}
                onPress={() => setActiveCategory(cat)}
                activeOpacity={0.8}
              >
                <Text style={[styles.categoryPillText, activeCategory === cat && styles.categoryPillTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        <Text style={styles.countText}>{filteredGuides.length} guide{filteredGuides.length !== 1 ? 's' : ''}</Text>

        {pairs.map((pair, index) => (
          <View key={index} style={styles.gridRow}>
            {pair.map((guide, i) => (
              <GuideCard
                key={guide.id}
                guide={guide}
                index={index * 2 + i}
                onPress={() => handleGuidePress(guide)}
                COLORS={COLORS}
                styles={styles}
              />
            ))}
            {pair.length === 1 && <View style={styles.gridCardEmpty} />}
          </View>
        ))}

      </ScrollView>
    </View>
  );
}

function makeStyles(COLORS: any) { return StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16, backgroundColor: COLORS.background },
  headerTitle: { fontSize: 28, fontWeight: '800', color: COLORS.textPrimary },
  headerSubtitle: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
  searchButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  container: { paddingBottom: 32 },

  featuredCard: { marginHorizontal: 20, backgroundColor: COLORS.black, borderRadius: 24, padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 8 },
  featuredContent: { flex: 1, marginRight: 12 },
  featuredTag: { fontSize: 10, fontWeight: '700', color: COLORS.gold, letterSpacing: 2, marginBottom: 8 },
  featuredTitle: { fontSize: 20, fontWeight: '800', color: COLORS.white, marginBottom: 6 },
  featuredDesc: { fontSize: 13, color: COLORS.textMuted, lineHeight: 20, marginBottom: 12 },
  featuredMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 6 },
  featuredMetaText: { fontSize: 12, color: COLORS.textSecondary },
  featuredMetaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: COLORS.textMuted },
  featuredButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.gold, paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10, alignSelf: 'flex-start' },
  featuredButtonText: { fontSize: 13, fontWeight: '700', color: COLORS.black },

  categoryScroll: { marginBottom: 8 },
  categoryRow: { paddingHorizontal: 20, gap: 8, paddingBottom: 4 },
  categoryPill: { paddingHorizontal: 18, paddingVertical: 9, borderRadius: 50, backgroundColor: COLORS.surface, borderWidth: 1.5, borderColor: COLORS.border },
  categoryPillActive: { backgroundColor: COLORS.black, borderColor: COLORS.black },
  categoryPillText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  categoryPillTextActive: { color: COLORS.gold },

  countText: { fontSize: 12, color: COLORS.textMuted, paddingHorizontal: 20, marginBottom: 12, marginTop: 4 },

  gridRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 12 },
  gridCard: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: 20, padding: 16,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  gridCardEmpty: { flex: 1 },
  gridCardIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: COLORS.goldMuted, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  diffBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 8 },
  diffBadgeText: { fontSize: 10, fontWeight: '700' },
  gridCardTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 10, lineHeight: 20, flex: 1 },
  gridCardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' as any },
  gridCardSteps: { fontSize: 11, color: COLORS.textMuted, fontWeight: '500' },
}); }