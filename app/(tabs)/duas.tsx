import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { Clipboard, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getFavouriteDuas, toggleFavouriteDua } from '../../constants/firestoreService';
import { useTheme } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

type SourceType = 'Quran' | 'Hadith' | 'Scholarly';
type DuaCategory = 'All' | 'Ihram' | 'Tawaf' | "Sa'i" | 'Arafah' | 'Muzdalifah' | 'Mina' | 'Travel' | 'Morning' | 'Evening' | 'General';

type Dua = {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  source: string;
  sourceType: SourceType;
  category: DuaCategory;
  milestone?: string; 
};

const duas: Dua[] = [
  {
    id: '1', title: 'Talbiyah', category: 'Ihram', sourceType: 'Hadith', source: 'Bukhari & Muslim', milestone: 'Ihram',
    arabic: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ',
    transliteration: "Labbayk Allaahumma labbayk, labbayk laa shareeka laka labbayk, innal-hamda wan-ni'mata laka wal-mulk, laa shareeka lak",
    translation: 'Here I am O Allah, here I am. Here I am, You have no partner, here I am. Verily all praise, grace and sovereignty belong to You. You have no partner.',
  },
  {
    id: '2', title: 'Intention for Ihram (Hajj)', category: 'Ihram', sourceType: 'Scholarly', source: 'Ibn Qudamah', milestone: 'Ihram',
    arabic: 'اللَّهُمَّ إِنِّي أُرِيدُ الْحَجَّ فَيَسِّرْهُ لِي وَتَقَبَّلْهُ مِنِّي',
    transliteration: "Allaahumma innee ureedul-hajja fayassirhu lee wa taqabbalhu minnee",
    translation: 'O Allah, I intend to perform Hajj, so make it easy for me and accept it from me.',
  },
  {
    id: '3', title: 'Intention for Ihram (Umrah)', category: 'Ihram', sourceType: 'Scholarly', source: 'Ibn Qudamah', milestone: 'Ihram',
    arabic: 'اللَّهُمَّ إِنِّي أُرِيدُ الْعُمْرَةَ فَيَسِّرْهَا لِي وَتَقَبَّلْهَا مِنِّي',
    transliteration: "Allaahumma innee ureedul-'umrata fayassirha lee wa taqabbalhaa minnee",
    translation: 'O Allah, I intend to perform Umrah, so make it easy for me and accept it from me.',
  },

  {
    id: '4', title: 'Dua for Entering Makkah', category: 'Travel', sourceType: 'Scholarly', source: 'Bayhaqi', milestone: 'Arrival in Makkah',
    arabic: 'اللَّهُمَّ هَذَا حَرَمُكَ وَأَمْنُكَ فَحَرِّمْنِي عَلَى النَّارِ',
    transliteration: "Allaahumma haadha haramuka wa amnuka faharrimnee 'alan-naar",
    translation: 'O Allah, this is Your sanctuary and Your place of safety. Make me forbidden to the Hellfire.',
  },
  {
    id: '5', title: 'Dua When Seeing the Kaaba', category: 'Travel', sourceType: 'Scholarly', source: 'Ibn Abbas (ra)',
    arabic: 'اللَّهُمَّ زِدْ هَذَا الْبَيْتَ تَشْرِيفاً وَتَعْظِيماً وَتَكْرِيماً وَمَهَابَةً',
    transliteration: "Allaahumma zid haadhal-bayta tashreefan wa ta'dheeman wa takreeman wa mahaabah",
    translation: 'O Allah, increase this House in honour, reverence, nobility and awe.',
  },
  {
    id: '6', title: 'Travelling Dua', category: 'Travel', sourceType: 'Hadith', source: 'Muslim',
    arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
    transliteration: "Subhaanal-ladhee sakhkhara lanaa haadha wa maa kunnaa lahu muqrineen, wa innaa ilaa rabbinaa lamunqaliboon",
    translation: 'Glory be to Him Who has subjected this to us, and we could not have done it ourselves. Surely to our Lord we are returning.',
  },

  {
    id: '7', title: 'Dua at the Start of Tawaf', category: 'Tawaf', sourceType: 'Scholarly', source: 'Scholarly', milestone: 'Tawaf',
    arabic: 'بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ، اللَّهُمَّ إِيمَاناً بِكَ وَتَصْدِيقاً بِكِتَابِكَ',
    transliteration: "Bismillaahi wallaahu akbar, Allaahumma eemaanan bika wa tasdeeqan bikitaabik",
    translation: 'In the name of Allah, Allah is the Greatest. O Allah, out of faith in You and belief in Your Book.',
  },
  {
    id: '8', title: 'Between Yemeni Corner & Black Stone', category: 'Tawaf', sourceType: 'Quran', source: 'Quran 2:201', milestone: 'Tawaf',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    transliteration: "Rabbanaa aatinaa fid-dunyaa hasanatan wa fil-aakhirati hasanatan wa qinaa 'adhaaban-naar",
    translation: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.',
  },
  {
    id: '9', title: 'Dua at Maqam Ibrahim', category: 'Tawaf', sourceType: 'Quran', source: 'Quran 2:125', milestone: 'Tawaf',
    arabic: 'وَاتَّخِذُوا مِنْ مَقَامِ إِبْرَاهِيمَ مُصَلًّى',
    transliteration: "Wattakhidhoo min maqaami Ibraaheema musallaa",
    translation: 'Take the station of Ibrahim as a place of prayer.',
  },

  {
    id: '10', title: 'Dua at Safa', category: "Sa'i", sourceType: 'Hadith', source: 'Muslim', milestone: "Sa'i",
    arabic: 'اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: "Allaahu akbar (x3), laa ilaaha illallaahu wahdahu laa shareeka lah, lahul-mulku walahul-hamdu wahuwa 'alaa kulli shay'in qadeer",
    translation: 'Allah is Greatest (x3). There is no god but Allah alone, with no partner. His is the dominion, His is all praise, and He is able to do all things.',
  },
  {
    id: '11', title: 'Beginning of Sa\'i', category: "Sa'i", sourceType: 'Quran', source: 'Quran 2:158', milestone: "Sa'i",
    arabic: 'إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ',
    transliteration: "Innas-safaa wal-marwata min sha'aa'irillaah",
    translation: 'Indeed Safa and Marwa are among the symbols of Allah.',
  },

  {
    id: '12', title: 'Best Dua of Arafah', category: 'Arafah', sourceType: 'Hadith', source: 'Tirmidhi', milestone: 'Day of Arafah',
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: "Laa ilaaha illallaahu wahdahu laa shareeka lah, lahul-mulku walahul-hamdu wahuwa 'alaa kulli shay'in qadeer",
    translation: 'There is no god but Allah alone, with no partner. His is the dominion, His is all praise, and He is able to do all things.',
  },
  {
    id: '13', title: 'Dua for Forgiveness at Arafah', category: 'Arafah', sourceType: 'Hadith', source: 'Ahmad', milestone: 'Day of Arafah',
    arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ كَرِيمٌ تُحِبُّ الْعَفْوَ فَاعْفُ عَنَّا',
    transliteration: "Allaahumma innaka 'afuwwun kareemun tuhibbul-'afwa fa'fu 'annaa",
    translation: 'O Allah, You are Pardoning, Generous, You love to pardon, so pardon us.',
  },

  {
    id: '14', title: 'Dua at Muzdalifah', category: 'Muzdalifah', sourceType: 'Scholarly', source: 'Ibn Qudamah', milestone: 'Muzdalifah',
    arabic: 'اللَّهُمَّ إِنَّ هَذِهِ مُزْدَلِفَةُ جُمِعَتْ فِيهَا أَلْسِنَةٌ مُخْتَلِفَةٌ تَسْأَلُكَ حَوَائِجَ مُتَفَاوِتَةً فَاجْعَلْنِي مِمَّنْ دَعَاكَ فَاسْتَجَبْتَ لَهُ',
    transliteration: "Allaahumma inna hadhihi Muzdalifatu jumi'at feehaa alsinatum mukhtalifatun tas'aluka hawaa'ija mutafaawitan faj'alnee mimman da'aaka fastajabta lah",
    translation: 'O Allah, this is Muzdalifah where tongues of different languages gather to ask You for their different needs. Make me among those who called upon You and You responded.',
  },

  {
    id: '15', title: 'Dua When Stoning Jamarat', category: 'Mina', sourceType: 'Hadith', source: 'Bukhari', milestone: 'Rami (Stoning)',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allaahu Akbar',
    translation: 'Allah is the Greatest. (Said with each stone thrown at all three Jamarat)',
  },
  {
    id: '16', title: 'After Stoning Small & Middle Jamarat', category: 'Mina', sourceType: 'Hadith', source: 'Bukhari', milestone: 'Rami (Stoning)',
    arabic: 'اللَّهُمَّ اجْعَلْهُ حَجًّا مَبْرُوراً وَذَنْباً مَغْفُوراً',
    transliteration: "Allaahumma-j'alhu hajjan mabroooran wa dhanban maghfooraa",
    translation: 'O Allah, make it an accepted Hajj and a forgiven sin.',
  },

  {
    id: '17', title: 'Morning Remembrance', category: 'Morning', sourceType: 'Hadith', source: 'Muslim',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    transliteration: "Asbahna wa asbahal-mulku lillaah, walhamdu lillaah, laa ilaaha illallaahu wahdahu laa shareeka lah",
    translation: 'We have entered the morning and all sovereignty belongs to Allah. Praise be to Allah. There is no god but Allah alone with no partner.',
  },
  {
    id: '18', title: 'Morning Protection Dua', category: 'Morning', sourceType: 'Hadith', source: 'Abu Dawud',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration: "Bismillaahil-ladhee laa yadurru ma'asmihi shay'un fil-ardi wa laa fis-samaa'i wa huwas-samee'ul-'aleem",
    translation: 'In the name of Allah, with Whose name nothing can cause harm on earth or in heaven, and He is the All-Hearing, All-Knowing.',
  },

  {
    id: '19', title: 'Evening Remembrance', category: 'Evening', sourceType: 'Hadith', source: 'Muslim',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    transliteration: "Amsaynaa wa amsal-mulku lillaah, walhamdu lillaah, laa ilaaha illallaahu wahdahu laa shareeka lah",
    translation: 'We have entered the evening and all sovereignty belongs to Allah. Praise be to Allah. There is no god but Allah alone with no partner.',
  },
  {
    id: '20', title: 'Evening Protection Dua', category: 'Evening', sourceType: 'Hadith', source: 'Abu Dawud',
    arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ',
    transliteration: "Allaahumma bika amsaynaa wa bika asbahna wa bika nahyaa wa bika namootu wa ilaykal-maseer",
    translation: 'O Allah, by You we enter the evening and by You we enter the morning, by You we live and by You we die, and to You is the final return.',
  },

  {
    id: '21', title: 'Dua for Forgiveness', category: 'General', sourceType: 'Hadith', source: 'Tirmidhi',
    arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
    transliteration: "Allaahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni",
    translation: 'O Allah, You are the Pardoning One, You love to pardon, so pardon me.',
  },
  {
    id: '22', title: 'Dua for Acceptance of Hajj', category: 'General', sourceType: 'Scholarly', source: 'Ibn Qudamah',
    arabic: 'اللَّهُمَّ تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ',
    transliteration: "Allaahumma taqabbal minnaa innaka antas-samee'ul-'aleem",
    translation: 'O Allah, accept from us — indeed You are the All-Hearing, the All-Knowing.',
  },
  {
    id: '23', title: 'Dua for Ease in Hardship', category: 'General', sourceType: 'Quran', source: 'Quran 2:286',
    arabic: 'رَبَّنَا لَا تُؤَاخِذْنَا إِنْ نَسِينَا أَوْ أَخْطَأْنَا',
    transliteration: "Rabbanaa laa tu'aakhidhnaa in naseenaa aw akhta'naa",
    translation: 'Our Lord, do not take us to task if we forget or make mistakes.',
  },
  {
    id: '24', title: 'Dua for Parents', category: 'General', sourceType: 'Quran', source: 'Quran 17:24',
    arabic: 'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيراً',
    transliteration: "Rabbir-hamhumaa kamaa rabbayaanee sagheeraa",
    translation: 'My Lord, have mercy on them both as they raised me when I was small.',
  },
  {
    id: '25', title: 'Dua for Steadfastness', category: 'General', sourceType: 'Hadith', source: 'Tirmidhi',
    arabic: 'يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ',
    transliteration: "Yaa muqallibal-quloob thabbit qalbee 'alaa deenik",
    translation: 'O Turner of hearts, keep my heart firm upon Your religion.',
  },
  {
    id: '26', title: 'Farewell Tawaf Dua', category: 'Tawaf', sourceType: 'Scholarly', source: 'Ibn Qudamah', milestone: 'Farewell Tawaf',
    arabic: 'اللَّهُمَّ إِنَّ الْبَيْتَ بَيْتُكَ وَالْعَبْدَ عَبْدُكَ وَابْنُ عَبْدِكَ وَابْنُ أَمَتِكَ حَمَلْتَنِي عَلَى مَا سَخَّرْتَ لِي',
    transliteration: "Allaahumma innal-bayta baytuka wal-'abdu 'abduka wabnu 'abdika wabnu amatika hamaltanee 'alaa maa sakhkharta lee",
    translation: 'O Allah, this House is Your House, and the servant is Your servant, son of Your servant, son of Your maidservant. You carried me on what You subjected for me.',
  },
];


const categories: { label: DuaCategory; iconName: string; iconLib: 'ion' | 'mci' }[] = [
  { label: 'All', iconName: 'hands-pray', iconLib: 'mci' },
  { label: 'Ihram', iconName: 'shirt-outline', iconLib: 'ion' },
  { label: 'Tawaf', iconName: 'refresh-circle-outline', iconLib: 'ion' },
  { label: "Sa'i", iconName: 'walk', iconLib: 'ion' },
  { label: 'Arafah', iconName: 'triangle-outline', iconLib: 'ion' },
  { label: 'Muzdalifah', iconName: 'bed-outline', iconLib: 'ion' },
  { label: 'Mina', iconName: 'flame-outline', iconLib: 'ion' },
  { label: 'Travel', iconName: 'airplane-outline', iconLib: 'ion' },
  { label: 'Morning', iconName: 'sunny-outline', iconLib: 'ion' },
  { label: 'Evening', iconName: 'moon-outline', iconLib: 'ion' },
  { label: 'General', iconName: 'diamond-outline', iconLib: 'ion' },
];

const sourceBadgeStyle = (type: SourceType) => {
  if (type === 'Quran') return { bg: 'rgba(201,168,76,0.15)', text: '#C9A84C', label: 'Quran' };
  if (type === 'Hadith') return { bg: 'rgba(46,125,50,0.15)', text: '#66BB6A', label: 'Hadith' };
  return { bg: 'rgba(21,101,192,0.15)', text: '#64B5F6', label: 'Scholarly' };
};

const getDuaOfMoment = (): { dua: Dua; label: string; icon: string } => {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 7) {
    const dua = duas.find(d => d.id === '17')!;
    return { dua, label: 'Fajr Time — Morning Adhkar', icon: '🌅' };
  } else if (hour >= 7 && hour < 12) {
    const dua = duas.find(d => d.id === '18')!;
    return { dua, label: 'Morning — Stay Protected', icon: '☀️' };
  } else if (hour >= 12 && hour < 15) {
    const dua = duas.find(d => d.id === '22')!;
    return { dua, label: 'Dhuhr Time — Seek Acceptance', icon: '🕛' };
  } else if (hour >= 15 && hour < 18) {
    const dua = duas.find(d => d.id === '19')!;
    return { dua, label: 'Asr Time — Evening Adhkar', icon: '🌤️' };
  } else if (hour >= 18 && hour < 20) {
    const dua = duas.find(d => d.id === '20')!;
    return { dua, label: 'Maghrib — Evening Protection', icon: '🌆' };
  } else {
    const dua = duas.find(d => d.id === '21')!;
    return { dua, label: 'Night — Seek Forgiveness', icon: '🌙' };
  }
};

const DuaCard = ({ COLORS, styles, dua, memMode, isFavourited, onToggleFav, featured = false }: any) => {
  const [expanded, setExpanded] = useState(featured);
  const [showTranslit, setShowTranslit] = useState(false);
  const [copied, setCopied] = useState(false);
  const badge = sourceBadgeStyle(dua.sourceType);

  const handleCopy = () => {
    Clipboard.setString(dua.arabic);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <TouchableOpacity
      style={[styles.duaCard, featured && styles.duaCardFeatured]}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.9}
    >
      <View style={styles.duaCardTop}>
        <View style={styles.duaCardTopLeft}>
          <Text style={[styles.duaTitle, featured && styles.duaTitleFeatured]}>{dua.title}</Text>
          <View style={[styles.sourceBadge, { backgroundColor: badge.bg }]}>
            <Ionicons
              name={dua.sourceType === 'Quran' ? 'book' : dua.sourceType === 'Hadith' ? 'document-text' : 'school'}
              size={10} color={badge.text} style={{ marginRight: 4 }}
            />
            <Text style={[styles.sourceBadgeText, { color: badge.text }]}>{badge.label} • {dua.source}</Text>
          </View>
        </View>
        <View style={styles.duaCardActions}>
          <TouchableOpacity onPress={() => onToggleFav(dua.id)} style={styles.actionBtn}>
            <Ionicons
              name={isFavourited ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavourited ? '#E53935' : COLORS.textMuted}
            />
          </TouchableOpacity>
          <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={14} color={COLORS.textMuted} />
        </View>
      </View>

      <Text style={[styles.duaArabic, featured && styles.duaArabicFeatured]}>{dua.arabic}</Text>

      {expanded && (
        <View style={styles.expandedContent}>
          <TouchableOpacity style={styles.translitToggle} onPress={() => setShowTranslit(!showTranslit)}>
            <Ionicons name={showTranslit ? 'chevron-down' : 'chevron-forward'} size={12} color={COLORS.gold} style={{ marginRight: 4 }} />
            <Text style={styles.translitToggleText}>{showTranslit ? 'Hide transliteration' : 'Show transliteration'}</Text>
          </TouchableOpacity>
          {showTranslit && <Text style={styles.transliteration}>{dua.transliteration}</Text>}
          <View style={styles.expandDivider} />
          {memMode ? (
            <View style={styles.memHidden}>
              <Ionicons name="eye-off-outline" size={16} color={COLORS.goldLight} style={{ marginRight: 8 }} />
              <Text style={styles.memHiddenText}>Memorisation Mode — Translation Hidden</Text>
            </View>
          ) : (
            <Text style={styles.translation}>{dua.translation}</Text>
          )}
          <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
            <Ionicons name={copied ? 'checkmark-circle' : 'copy-outline'} size={14}
              color={copied ? '#66BB6A' : COLORS.textSecondary} style={{ marginRight: 6 }} />
            <Text style={[styles.copyButtonText, { color: copied ? '#66BB6A' : COLORS.textSecondary }]}>
              {copied ? 'Copied!' : 'Copy Arabic'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function Duas() {
  const COLORS = useTheme();
  const styles = useMemo(() => makeStyles(COLORS), [COLORS]);
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<DuaCategory>('All');
  const [memMode, setMemMode] = useState(false);
  const [favourites, setFavourites] = useState<Set<string>>(new Set());
  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);

  const duaOfMoment = useMemo(() => getDuaOfMoment(), []);

  const filteredDuas = useMemo(() => {
    let list = activeCategory === 'All' ? duas : duas.filter(d => d.category === activeCategory);
    if (showFavouritesOnly) list = list.filter(d => favourites.has(d.id));
    return list;
  }, [activeCategory, showFavouritesOnly, favourites]);

  useEffect(() => {
    if (!user) return;
    getFavouriteDuas(user.uid).then(ids => setFavourites(new Set(ids)));
  }, [user]);

  const handleToggleFav = async (duaId: string) => {
    if (!user) return;
    const isFav = favourites.has(duaId);
    setFavourites(prev => {
      const next = new Set(prev);
      if (isFav) next.delete(duaId); else next.add(duaId);
      return next;
    });
    try {
      await toggleFavouriteDua(user.uid, duaId, !isFav);
    } catch {
      setFavourites(prev => {
        const next = new Set(prev);
        if (isFav) next.add(duaId); else next.delete(duaId);
        return next;
      });
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar style={COLORS.statusBar} backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Duas</Text>
          <Text style={styles.headerSubtitle}>Sacred Supplications</Text>
        </View>
        <TouchableOpacity
          style={[styles.memButton, memMode && styles.memButtonActive]}
          onPress={() => setMemMode(!memMode)}
        >
          <Ionicons name="eye-off-outline" size={14}
            color={memMode ? COLORS.gold : COLORS.textSecondary} style={{ marginRight: 6 }} />
          <Text style={[styles.memButtonText, memMode && styles.memButtonTextActive]}>
            {memMode ? 'Mem ON' : 'Memorise'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{duas.length}</Text>
          <Text style={styles.statLabel}>Duas</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{categories.length - 1}</Text>
          <Text style={styles.statLabel}>Categories</Text>
        </View>
        <View style={styles.statDivider} />
        <TouchableOpacity style={styles.statItem} onPress={() => setShowFavouritesOnly(!showFavouritesOnly)}>
          <Text style={[styles.statNumber, showFavouritesOnly && { color: '#E53935' }]}>{favourites.size}</Text>
          <Text style={[styles.statLabel, showFavouritesOnly && { color: '#E53935' }]}>
            {showFavouritesOnly ? 'Favs ✓' : 'Favourites'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>

        {memMode && (
          <View style={styles.memBanner}>
            <Ionicons name="eye-off-outline" size={16} color={COLORS.goldLight} style={{ marginRight: 8 }} />
            <Text style={styles.memBannerText}>Memorisation Mode ON — translations hidden. Tap a dua to test yourself!</Text>
          </View>
        )}

        {activeCategory === 'All' && !showFavouritesOnly && (
          <View style={styles.momentSection}>
            <View style={styles.momentHeader}>
              <Text style={styles.momentEmoji}>{duaOfMoment.icon}</Text>
              <View>
                <Text style={styles.momentLabel}>Dua of the Moment</Text>
                <Text style={styles.momentTime}>{duaOfMoment.label}</Text>
              </View>
            </View>
            <DuaCard
              COLORS={COLORS} styles={styles}
              dua={duaOfMoment.dua}
              memMode={memMode}
              isFavourited={favourites.has(duaOfMoment.dua.id)}
              onToggleFav={handleToggleFav}
              featured={true}
            />
          </View>
        )}

        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow} style={styles.categoryScroll}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.label}
              style={[styles.categoryPill, activeCategory === cat.label && styles.categoryPillActive]}
              onPress={() => setActiveCategory(cat.label)}
              activeOpacity={0.8}
            >
              {cat.iconLib === 'mci'
                ? <MaterialCommunityIcons name={cat.iconName as any} size={14}
                    color={activeCategory === cat.label ? COLORS.gold : COLORS.textSecondary} style={{ marginRight: 4 }} />
                : <Ionicons name={cat.iconName as any} size={14}
                    color={activeCategory === cat.label ? COLORS.gold : COLORS.textSecondary} style={{ marginRight: 4 }} />
              }
              <Text style={[styles.categoryPillText, activeCategory === cat.label && styles.categoryPillTextActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.countText}>
          {filteredDuas.length} dua{filteredDuas.length !== 1 ? 's' : ''}
          {showFavouritesOnly ? ' · Favourites' : ''}
        </Text>

        {filteredDuas.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="heart-outline" size={40} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>No favourites yet.</Text>
            <Text style={styles.emptySubText}>Tap ♡ on any dua to save it here.</Text>
          </View>
        )}

        {filteredDuas.map(dua => (
          <DuaCard
            COLORS={COLORS} styles={styles}
            key={dua.id}
            dua={dua}
            memMode={memMode}
            isFavourited={favourites.has(dua.id)}
            onToggleFav={handleToggleFav}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function makeStyles(COLORS: any) { return StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 12, backgroundColor: COLORS.background },
  headerTitle: { fontSize: 28, fontWeight: '800', color: COLORS.textPrimary },
  headerSubtitle: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
  memButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  memButtonActive: { backgroundColor: COLORS.black, borderColor: COLORS.gold },
  memButtonText: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  memButtonTextActive: { color: COLORS.gold },

  statsBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.surface, marginHorizontal: 20, borderRadius: 16, paddingVertical: 14, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 20, fontWeight: '800', color: COLORS.gold },
  statLabel: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: COLORS.border },

  container: { paddingHorizontal: 20, paddingBottom: 32 },

  memBanner: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 14, marginBottom: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.gold },
  memBannerText: { fontSize: 13, color: COLORS.goldLight, lineHeight: 20, flex: 1 },

  momentSection: { marginBottom: 20, marginTop: 8 },
  momentHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  momentEmoji: { fontSize: 28 },
  momentLabel: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  momentTime: { fontSize: 11, color: COLORS.gold, marginTop: 1 },

  categoryScroll: { marginBottom: 8 },
  categoryRow: { gap: 8, paddingBottom: 4, paddingRight: 8 },
  categoryPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 50, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  categoryPillActive: { backgroundColor: COLORS.black, borderColor: COLORS.gold },
  categoryPillText: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  categoryPillTextActive: { color: COLORS.gold },

  countText: { fontSize: 12, color: COLORS.textMuted, marginBottom: 12, marginTop: 4 },

  emptyState: { alignItems: 'center', paddingVertical: 48 },
  emptyText: { fontSize: 16, fontWeight: '700', color: COLORS.textMuted, marginTop: 12 },
  emptySubText: { fontSize: 13, color: COLORS.textMuted, marginTop: 6 },

  duaCard: { backgroundColor: COLORS.surface, borderRadius: 20, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border, elevation: 2 },
  duaCardFeatured: { borderColor: COLORS.gold, borderWidth: 1.5, backgroundColor: 'rgba(201,168,76,0.05)' },
  duaCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  duaCardTopLeft: { flex: 1, marginRight: 12 },
  duaTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 6 },
  duaTitleFeatured: { color: COLORS.gold },
  sourceBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, alignSelf: 'flex-start' },
  sourceBadgeText: { fontSize: 10, fontWeight: '600' },
  duaCardActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  actionBtn: { padding: 2 },
  duaArabic: { fontSize: 18, color: COLORS.textPrimary, textAlign: 'right', lineHeight: 34, fontWeight: '500' },
  duaArabicFeatured: { fontSize: 20, color: COLORS.gold },
  expandedContent: { marginTop: 14 },
  translitToggle: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  translitToggleText: { fontSize: 12, color: COLORS.gold, fontWeight: '600' },
  transliteration: { fontSize: 13, color: COLORS.textSecondary, fontStyle: 'italic', lineHeight: 22, marginBottom: 12 },
  expandDivider: { height: 1, backgroundColor: COLORS.border, marginVertical: 12 },
  translation: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },
  memHidden: { backgroundColor: COLORS.black, borderRadius: 10, padding: 12, flexDirection: 'row', alignItems: 'center' },
  memHiddenText: { fontSize: 13, color: COLORS.goldLight, fontWeight: '500' },
  copyButton: { flexDirection: 'row', alignItems: 'center', marginTop: 12, alignSelf: 'flex-start', backgroundColor: COLORS.background, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: COLORS.border },
  copyButtonText: { fontSize: 12, fontWeight: '500' },
}); }