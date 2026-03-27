import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../constants/theme';


type GuideStep = { step: string; nameEn: string; nameAr: string; timing: string; description: string; significance: string; };
type TipSet = { health: string[]; expect: string[]; avoid: string[]; };
type GuideContent = {
  id: string; title: string; titleAr: string; tag: string; description: string;
  steps: GuideStep[];
  tips: TipSet;
  prayers: { nameEn: string; nameAr: string; arabic: string; translation: string; }[];
};


const allGuides: Record<string, GuideContent> = {

  'featured': {
    id: 'featured', title: 'Complete Hajj Guide', titleAr: 'دليل الحج الكامل',
    tag: '✦ OFFICIAL HAJJ RITUALS',
    description: 'Hajj, the fifth pillar of Islam, is sacred and obligatory for every able adult Muslim. Follow these steps for a complete and correct pilgrimage.',
    steps: [
      { step: '01', nameEn: 'Ihram', nameAr: 'الإحرام', timing: 'Before 8th Dhul Hijjah', description: 'Enter the sacred state of Ihram at the Miqat. Put on the white garments and recite the Talbiyah with a sincere intention for Hajj.', significance: 'All pilgrims stand equal before Allah — no wealth, no status. Just a pure soul seeking forgiveness.' },
      { step: '02', nameEn: 'Tawaf Al-Qudum', nameAr: 'طواف القدوم', timing: 'Upon Arrival in Makkah', description: 'Circle the Kaabah seven times anti-clockwise upon arriving in Makkah. Pray two Rakaahs behind Maqam Ibrahim.', significance: 'A Sunnah welcoming to the House of Allah — connecting you to every pilgrim throughout history.' },
      { step: '03', nameEn: "Sa'i", nameAr: 'السعي', timing: 'After Tawaf', description: "Walk seven times between the hills of Safa and Marwa. Begin at Safa and end at Marwa. Men jog between the green markers.", significance: "Commemorates Hajar's (AS) trust in Allah. Her perseverance gave us the blessed Zamzam water." },
      { step: '04', nameEn: 'Day of Tarwiyah', nameAr: 'يوم التروية', timing: '8th Dhul Hijjah', description: 'Travel to Mina and spend the day and night there in worship, dhikr and preparation for the great day of Arafah.', significance: 'Mina — the city of tents — prepares your heart and soul for the most important moment of Hajj.' },
      { step: '05', nameEn: 'Wuquf at Arafah', nameAr: 'وقوف عرفة', timing: '9th Dhul Hijjah', description: 'Stand at the plain of Arafah from after Dhuhr until sunset. Engage in sincere dua, dhikr, and repentance.', significance: '"Hajj is Arafah." — The Prophet ﷺ. Allah descends and forgives more sins on this day than any other.' },
      { step: '06', nameEn: 'Muzdalifah', nameAr: 'المزدلفة', timing: 'Night of 9th-10th', description: 'Travel to Muzdalifah after sunset. Combine Maghrib and Isha prayers. Sleep under the open sky and collect pebbles for Rami.', significance: 'A night of humility under the stars — no roof, no comfort. Just you and your Lord.' },
      { step: '07', nameEn: 'Rami Al-Jamarat', nameAr: 'رمي الجمرات', timing: '10th-13th Dhul Hijjah', description: 'Stone the Jamarat pillars — 7 stones at the large pillar on Eid day, then all three on the following days.', significance: 'Reject Shaytan as Ibrahim (AS) did. Every stone is a declaration that you choose Allah over temptation.' },
      { step: '08', nameEn: 'Halq & Farewell Tawaf', nameAr: 'الحلق وطواف الوداع', timing: '10th Dhul Hijjah Onwards', description: 'Shave or trim your hair to exit Ihram. Complete your Hajj with the Farewell Tawaf before leaving Makkah.', significance: 'Emerging renewed — your sins forgiven, your slate wiped clean. This is the promise of a Hajj Mabroor.' },
    ],
    tips: {
      health: ['Drink 3+ litres of water daily', 'Wear SPF 50+ sunscreen especially when shaved', 'Bring blister-proof walking sandals'],
      expect: ['Millions of pilgrims across all locations', 'Intense heat especially at Arafah and Mina', 'Long walks between 10-15km daily'],
      avoid: ['Losing your group — always have a meeting point', 'Missing Arafah — it invalidates Hajj', 'Wasting time on phones during Arafah'],
    },
    prayers: [
      { nameEn: 'Talbiyah', nameAr: 'التلبية', arabic: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ', translation: 'Here I am O Allah, here I am. You have no partner, here I am.' },
      { nameEn: 'Dua at Arafah', nameAr: 'دعاء عرفة', arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ', translation: 'There is no god but Allah alone, with no partner. The best dua on the day of Arafah.' },
    ],
  },

  '1': {
    id: '1', title: 'How to Perform Tawaf', titleAr: 'كيفية أداء الطواف',
    tag: '✦ TAWAF GUIDE',
    description: 'Tawaf is the act of circling the Kaabah seven times in an anti-clockwise direction. It is one of the most sacred acts of worship in Islam.',
    steps: [
      { step: '01', nameEn: 'Make Wudu', nameAr: 'الطهارة', timing: 'Before Starting', description: 'Ensure you are in a state of ritual purity (Wudu) before beginning Tawaf. Tawaf is invalid without Wudu.', significance: 'Entering the presence of Allah\'s House requires spiritual and physical purity.' },
      { step: '02', nameEn: 'Intention (Niyyah)', nameAr: 'النية', timing: 'At the Black Stone', description: 'Make your intention for Tawaf. Begin at the Black Stone (Hajar Al-Aswad). Face it, say Bismillah, Allahu Akbar, and begin.', significance: 'Every act of worship begins with intention. Your heart must be present for Allah.' },
      { step: '03', nameEn: 'First Three Circuits', nameAr: 'الأشواط الثلاثة الأولى', timing: 'Circuits 1-3', description: 'Men perform Raml (brisk walking) in the first three circuits. Keep the Kaabah on your left shoulder throughout.', significance: 'Raml was performed by the Prophet ﷺ to show the strength and vitality of the Muslim community.' },
      { step: '04', nameEn: 'Remaining Four Circuits', nameAr: 'الأشواط الأربعة الأخيرة', timing: 'Circuits 4-7', description: 'Walk normally in the remaining four circuits. Engage in dhikr, dua and Quranic recitation throughout.', significance: 'Each circuit connects you spiritually to millions of Muslims who have performed this act across centuries.' },
      { step: '05', nameEn: 'Complete at Black Stone', nameAr: 'الانتهاء عند الحجر الأسود', timing: 'End of 7th Circuit', description: 'Complete your 7th circuit at the Black Stone. Touch or gesture towards it if possible.', significance: 'The Black Stone is from Jannah. Touching it is like shaking the hand of Allah.' },
      { step: '06', nameEn: 'Pray Two Rakaahs', nameAr: 'ركعتا الطواف', timing: 'After Tawaf', description: 'Pray two Rakaahs behind Maqam Ibrahim if possible. Recite Surah Al-Kafirun in the first and Surah Al-Ikhlas in the second.', significance: 'Following in the footsteps of the Prophet ﷺ who prayed here after his own Tawaf.' },
      { step: '07', nameEn: 'Drink Zamzam', nameAr: 'شرب ماء زمزم', timing: 'After Prayer', description: 'Drink Zamzam water while facing the Kaabah and make dua. Zamzam is blessed water that quenches both physical and spiritual thirst.', significance: 'Zamzam water is shifa (healing) for whatever it is drunk with intention for.' },
    ],
    tips: {
      health: ['Wear comfortable non-slip sandals', 'Stay hydrated — the marble floor is hot', 'Use the outer rings if crowds are heavy'],
      expect: ['Huge crowds near the Black Stone', 'Marble floor can be very hot — consider socks', '45-60 minutes for a complete Tawaf'],
      avoid: ['Pushing others — it is haram in the Haram', 'Losing count of circuits — use a counter', 'Talking unnecessarily — focus on dhikr'],
    },
    prayers: [
      { nameEn: 'Starting Tawaf', nameAr: 'بداية الطواف', arabic: 'بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ', translation: 'In the name of Allah, Allah is the Greatest. Said at the Black Stone to begin each circuit.' },
      { nameEn: 'Between Yemeni Corner & Black Stone', nameAr: 'الركن اليماني والحجر الأسود', arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', translation: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.' },
    ],
  },

  '2': {
    id: '2', title: "Sa'i Between Safa & Marwa", titleAr: 'السعي بين الصفا والمروة',
    tag: "✦ SA'I GUIDE",
    description: "Sa'i commemorates Hajar's (AS) search for water for her son Ismail (AS). It consists of walking seven times between the hills of Safa and Marwa.",
    steps: [
      { step: '01', nameEn: 'Begin at Safa', nameAr: 'البداية من الصفا', timing: 'Start', description: "Climb the hill of Safa and face the Kaabah. Recite 'Inna as-Safa wal-Marwata min Sha'airillah' and make dua with raised hands.", significance: "Following the Quranic command: 'Indeed Safa and Marwa are among the symbols of Allah.'" },
      { step: '02', nameEn: 'Walk to Marwa', nameAr: 'المشي إلى المروة', timing: 'Circuit 1', description: 'Walk towards Marwa. Men should jog between the green fluorescent markers. Engage in dhikr and dua throughout.', significance: "Every step mirrors Hajar's desperate yet faithful search. She never gave up trust in Allah." },
      { step: '03', nameEn: 'At Marwa', nameAr: 'عند المروة', timing: 'End of Circuit 1', description: 'Upon reaching Marwa, face the Kaabah, raise your hands and make dua. This completes your first circuit.', significance: 'At Marwa, Hajar saw the angel Jibreel (AS) who struck the ground and Zamzam gushed forth.' },
      { step: '04', nameEn: 'Continue Back and Forth', nameAr: 'الاستمرار في السعي', timing: 'Circuits 2-6', description: 'Continue walking back and forth between Safa and Marwa. Each one-way trip counts as one circuit. Men jog between the green markers each time.', significance: 'Seven is a number of completion in Islam — seven Tawaf circuits, seven Sa\'i circuits, seven stones.' },
      { step: '05', nameEn: 'Complete at Marwa', nameAr: 'الانتهاء عند المروة', timing: 'End of Circuit 7', description: "Your 7th and final circuit ends at Marwa. Sa'i is now complete. Make final dua and proceed for Halq or Taqsir.", significance: "Sa'i ends at Marwa — where Hajar's faith was rewarded with Zamzam. End your Sa'i with gratitude." },
    ],
    tips: {
      health: ['Wear comfortable walking shoes', 'The Sa\'i corridor is air-conditioned', 'Wheelchair accessible for elderly'],
      expect: ['Long air-conditioned corridor', 'Green marker lights indicate jogging zone', 'Takes 30-45 minutes to complete'],
      avoid: ['Starting at Marwa — must start at Safa', 'Missing the jogging zone (men)', 'Rushing past other pilgrims'],
    },
    prayers: [
      { nameEn: 'At Safa and Marwa', nameAr: 'عند الصفا والمروة', arabic: 'إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ', translation: 'Indeed Safa and Marwa are among the symbols of Allah. Recited upon reaching each hill.' },
      { nameEn: 'Dua During Sa\'i', nameAr: 'دعاء السعي', arabic: 'رَبِّ اغْفِرْ وَارْحَمْ وَأَنْتَ الْأَعَزُّ الْأَكْرَمُ', translation: 'My Lord, forgive and have mercy, for You are the Mightiest and Most Generous.' },
    ],
  },

  '3': {
    id: '3', title: 'Ihram Rules & Restrictions', titleAr: 'أحكام الإحرام',
    tag: '✦ IHRAM GUIDE',
    description: 'Ihram is the sacred state entered before Hajj or Umrah. It involves wearing specific garments and observing strict rules until the rituals are completed.',
    steps: [
      { step: '01', nameEn: 'Prepare Your Body', nameAr: 'تهيئة الجسد', timing: 'Before Miqat', description: 'Trim nails, remove unwanted hair, take a full bath (ghusl), and apply perfume to your body before wearing Ihram. No perfume after wearing.', significance: 'Entering a state of purity before meeting Allah at His House.' },
      { step: '02', nameEn: 'Wear the Garments', nameAr: 'ارتداء ملابس الإحرام', timing: 'At Miqat', description: 'Men wear two white seamless sheets — one wrapped around the waist, one over the left shoulder. Women wear their normal modest clothing.', significance: 'White garments symbolize equality, purity, and a foreshadowing of the burial shroud.' },
      { step: '03', nameEn: 'Make the Intention', nameAr: 'النية', timing: 'At Miqat', description: 'Make the intention for Hajj or Umrah: "Labbayk Allaahumma Hajjan" or "Labbayk Allaahumma Umratan". Begin reciting the Talbiyah.', significance: 'The intention marks the official beginning of your pilgrimage. Your journey has now started.' },
      { step: '04', nameEn: 'Prohibited Acts', nameAr: 'المحظورات', timing: 'During Ihram', description: 'Avoid: cutting hair/nails, using perfume, covering head (men), wearing sewn clothes (men), sexual relations, hunting, and marriage contracts.', significance: 'These restrictions train the soul in patience and self-control — core virtues of a pilgrim.' },
      { step: '05', nameEn: 'Permitted Acts', nameAr: 'المباحات', timing: 'During Ihram', description: 'You may: bathe (without soap/shampoo), change Ihram garments, wear sandals, use unscented toothpaste, and wear a money belt under the waist cloth.', significance: 'Islam is a religion of ease — basic necessities are always permitted.' },
      { step: '06', nameEn: 'Violations & Fidyah', nameAr: 'المخالفات والفدية', timing: 'If Violated', description: 'If you accidentally violate Ihram (e.g., use perfume), you must pay fidyah: fast 3 days, feed 6 poor people, or sacrifice a sheep.', significance: 'Allah is Most Forgiving. There is always a way to make right what was done wrong.' },
      { step: '07', nameEn: 'Exiting Ihram', nameAr: 'الإحلال', timing: 'After Rituals', description: 'Exit Ihram by shaving (Halq) or cutting (Taqsir) your hair. For Hajj, this happens after stoning the Jamarat on Eid day.', significance: 'Emerging from Ihram is a spiritual rebirth — clean, forgiven, and renewed.' },
      { step: '08', nameEn: 'Women\'s Ihram', nameAr: 'إحرام المرأة', timing: 'Special Notes', description: 'Women wear their normal modest clothing. No face veil (niqab) and no gloves during Ihram. However, they may cover if men pass by.', significance: 'Women\'s Ihram demonstrates that Islamic modesty is the garment — not a specific uniform.' },
    ],
    tips: {
      health: ['Apply Vaseline to prevent chafing on inner thighs', 'Use SPF 50+ unscented sunscreen on shaved head', 'Pack extra Ihram sheets in case one gets soiled'],
      expect: ['You will feel very vulnerable and exposed', 'All pilgrims look identical — deeply humbling', 'Heat is intense — drink constantly'],
      avoid: ['Even "unscented" products may contain fragrance', 'Covering the head even accidentally (men)', 'Tying the top sheet — it must drape freely'],
    },
    prayers: [
      { nameEn: 'Talbiyah', nameAr: 'التلبية', arabic: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ', translation: 'Here I am O Allah, here I am. You have no partner, here I am. Verily all praise, blessings and dominion belong to You. You have no partner.' },
    ],
  },

  '4': {
    id: '4', title: 'Days of Mina Guide', titleAr: 'دليل أيام منى',
    tag: '✦ MINA GUIDE',
    description: 'Mina is the largest tent city in the world. Pilgrims spend multiple nights here during Hajj — on the 8th, and then the days of Tashreeq (11th-13th Dhul Hijjah).',
    steps: [
      { step: '01', nameEn: 'Arrive on 8th Dhul Hijjah', nameAr: 'الوصول يوم التروية', timing: '8th Dhul Hijjah', description: 'Travel to Mina after Fajr on the 8th. Spend the day in worship, rest and preparation. Pray Dhuhr, Asr, Maghrib, Isha and Fajr in Mina (shortening 4-unit prayers to 2).', significance: 'Mina prepares your body and soul for the physically and spiritually demanding day of Arafah.' },
      { step: '02', nameEn: 'Return After Arafah', nameAr: 'العودة بعد عرفة', timing: 'Night of 10th', description: 'After collecting pebbles at Muzdalifah, return to Mina before sunrise. Stone the large Jamarat (7 stones), sacrifice, shave/cut hair, then perform Tawaf Al-Ifadah.', significance: 'The peak of Hajj has passed. You return to Mina purified and with sins forgiven.' },
      { step: '03', nameEn: '11th Dhul Hijjah', nameAr: 'يوم الحادي عشر', timing: '11th Dhul Hijjah', description: 'After midday, stone all three Jamarats (small, medium, large) — 7 pebbles each = 21 stones. Say Allahu Akbar with each throw. Make dua after the small and medium pillars.', significance: 'Each stone thrown is a rejection of Shaytan and his whispers. Stand firm in your faith.' },
      { step: '04', nameEn: '12th Dhul Hijjah', nameAr: 'يوم الثاني عشر', timing: '12th Dhul Hijjah', description: 'Stone all three Jamarats again after midday (21 stones). You may leave Mina before sunset if you wish (this is the early departure — "Nafar Al-Awwal").', significance: 'Those who leave on the 12th are not sinful — both 2 or 3 days in Mina are valid.' },
      { step: '05', nameEn: '13th Dhul Hijjah (Optional)', nameAr: 'يوم الثالث عشر', timing: '13th Dhul Hijjah', description: 'If you stay, stone all three Jamarats once more (21 stones). This is the Sunnah and earns greater reward. Depart Mina before sunset.', significance: 'Staying the extra day earns more reward and reflects complete devotion to the rites of Hajj.' },
      { step: '06', nameEn: 'Leave Before Sunset', nameAr: 'المغادرة قبل الغروب', timing: 'Before Sunset on 12th/13th', description: 'Ensure you leave Mina before sunset on whichever day you choose to depart. If caught by sunset, you must stay the additional night.', significance: 'This ruling teaches time-consciousness and discipline — key values of a Muslim\'s life.' },
    ],
    tips: {
      health: ['Rest as much as possible in your tent', 'Eat nutritious food to maintain energy for stoning', 'Keep pebbles in a small bag for easy access'],
      expect: ['Tent accommodation — basic but functional', 'Jamarat bridge has multiple levels to manage crowds', 'Best stoning times are early morning or after midnight'],
      avoid: ['Using large stones — pebble size only', 'Throwing shoes or other objects at Jamarat', 'Leaving Mina without valid reason on Tashreeq days'],
    },
    prayers: [
      { nameEn: 'Stoning the Jamarat', nameAr: 'رمي الجمرات', arabic: 'اللَّهُ أَكْبَرُ', translation: 'Allah is the Greatest. Said with each of the 7 pebbles thrown at each pillar.' },
      { nameEn: 'Dua After Small Jamarat', nameAr: 'دعاء بعد الجمرة الصغرى', arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', translation: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.' },
    ],
  },

  '5': {
    id: '5', title: 'Rami — Stoning the Jamarat', titleAr: 'رمي الجمرات',
    tag: '✦ RAMI GUIDE',
    description: 'Rami is the ritual stoning of the three Jamarat pillars in Mina. It commemorates Ibrahim (AS) stoning Shaytan when he tried to dissuade him from obeying Allah.',
    steps: [
      { step: '01', nameEn: 'Collect Your Pebbles', nameAr: 'جمع الحصى', timing: 'At Muzdalifah', description: 'Collect 49 pebbles minimum (70 if staying all 3 days of Tashreeq) from Muzdalifah. Each should be the size of a chickpea — not too large, not too small.', significance: 'Picking the right-sized stones is an act of Sunnah. Moderation is the way of the Prophet ﷺ.' },
      { step: '02', nameEn: 'Eid Day — Large Jamarat Only', nameAr: 'يوم العيد — الجمرة الكبرى', timing: '10th Dhul Hijjah (Eid)', description: 'On Eid day, stone ONLY the large Jamarat (Jamrat Al-Aqabah) with 7 pebbles. Say Allahu Akbar with each throw. This is done before Dhuhr if possible.', significance: 'Ibrahim (AS) stoned this spot when Shaytan appeared for the third time. Follow his example.' },
      { step: '03', nameEn: '11th & 12th — All Three', nameAr: 'الحادي عشر والثاني عشر', timing: 'After Midday on 11th & 12th', description: 'Stone all three pillars (small → medium → large) with 7 stones each = 21 stones per day. Must be done after midday (Zawal).', significance: 'Each pillar represents one of Shaytan\'s three attempts to divert Ibrahim (AS) from Allah\'s command.' },
      { step: '04', nameEn: 'Make Dua at Small & Medium', nameAr: 'الدعاء عند الصغرى والوسطى', timing: 'After Stoning Each', description: 'After stoning the small pillar, face Qiblah and make a long dua with raised hands. Do the same at the medium pillar. Do NOT stop at the large pillar.', significance: 'These moments of dua are among the most accepted in all of Hajj — do not waste them.' },
      { step: '05', nameEn: 'Timing & Safety', nameAr: 'التوقيت والسلامة', timing: 'Important Note', description: 'The safest times to stone are early morning (after Fajr) or after midnight. Avoid peak hours (after Dhuhr) when crowds are most intense. Follow crowd flow on the bridge.', significance: 'Protecting your life is obligatory in Islam — choosing safe times is not weakness, it is wisdom.' },
    ],
    tips: {
      health: ['Go early morning or late night to avoid crushing crowds', 'Keep children and elderly away from peak stoning hours', 'Wear shoes with good grip on the Jamarat bridge'],
      expect: ['Multi-level Jamarat bridge designed for crowd safety', 'Intense crowds even on upper levels', 'Takes 20-30 minutes if you choose off-peak times'],
      avoid: ['Using large rocks — pebble-sized only (Sunnah)', 'Throwing shoes, sandals or bags at Jamarat', 'Going during peak hours unnecessarily'],
    },
    prayers: [
      { nameEn: 'With Each Stone', nameAr: 'مع كل حصاة', arabic: 'اللَّهُ أَكْبَرُ', translation: 'Allah is the Greatest. Said clearly with each of the 7 stones thrown.' },
    ],
  },

  '6': {
    id: '6', title: 'Halq & Taqsir', titleAr: 'الحلق والتقصير',
    tag: '✦ HALQ GUIDE',
    description: 'Halq (shaving) or Taqsir (cutting) the hair is a Wajib act of Hajj and Umrah that exits the state of Ihram. It is performed after stoning the Jamarat on Eid day.',
    steps: [
      { step: '01', nameEn: 'Understand the Ruling', nameAr: 'حكم الحلق', timing: 'Overview', description: 'Halq (shaving the entire head) is better for men and earns more reward. Taqsir (shortening hair by at least a fingertip length) is also valid. Women only do Taqsir — they cut a fingertip length from their hair.', significance: 'The Prophet ﷺ made dua three times for those who shave and once for those who cut — shaving is more rewarded.' },
      { step: '02', nameEn: 'Timing', nameAr: 'توقيت الحلق', timing: 'After Rami on Eid', description: 'Perform Halq or Taqsir after stoning the large Jamarat on Eid day (10th Dhul Hijjah), after the sacrifice (if applicable), and before Tawaf Al-Ifadah.', significance: 'The order of Eid acts: Stone → Sacrifice → Shave → Tawaf. Switching the order requires fidyah.' },
      { step: '03', nameEn: 'Find a Barber', nameAr: 'إيجاد حلاق', timing: 'In Mina or Makkah', description: 'Many barbers are available near the Jamarat and throughout Mina. Ensure the barber shaves the entire head for Halq. Cover your head with your Ihram cloth while walking to the barber.', significance: 'This act of shaving is an act of humility — removing the crown of hair before Allah.' },
      { step: '04', nameEn: 'Exit Partial Ihram', nameAr: 'التحلل الأول', timing: 'After Halq', description: 'After shaving, you exit partial Ihram (Al-Tahallul Al-Awwal). You may now wear regular clothes and do most things except sexual relations.', significance: 'The gradual lifting of Ihram restrictions mirrors the gradual spiritual elevation of the pilgrim.' },
      { step: '05', nameEn: 'Full Exit After Tawaf', nameAr: 'التحلل الكامل', timing: 'After Tawaf Al-Ifadah', description: 'After performing Tawaf Al-Ifadah and Sa\'i, full Ihram is lifted. All restrictions are now removed including the prohibition of sexual relations.', significance: 'Full return to the halal — you emerge completely new, spiritually reborn with sins forgiven.' },
    ],
    tips: {
      health: ['Apply sunscreen immediately after shaving — scalp is exposed', 'Many barbers use disposable razors — you can also ask them to confirm', 'Women can cut their own hair with scissors'],
      expect: ['Long queues at barbers near Jamarat — arrive early', 'Many barbers charge a fixed fee', 'Takes only a few minutes once at the barber'],
      avoid: ['Cutting only part of the head for Halq — must be entire head', 'Women shaving their heads — Taqsir only for women', 'Performing Tawaf before Halq if following the correct order'],
    },
    prayers: [
      { nameEn: 'Dua After Shaving', nameAr: 'دعاء بعد الحلق', arabic: 'اللَّهُمَّ اغْفِرْ لِلْمُحَلِّقِينَ', translation: 'O Allah, forgive those who shave their heads. (The Prophet ﷺ made this dua 3 times for those who shave).' },
    ],
  },

  '7': {
    id: '7', title: 'Umrah Step by Step', titleAr: 'العمرة خطوة بخطوة',
    tag: '✦ UMRAH GUIDE',
    description: "Umrah is the lesser pilgrimage that can be performed at any time of the year. It consists of four essential acts and takes approximately 2-3 hours to complete.",
    steps: [
      { step: '01', nameEn: 'Prepare & Wear Ihram', nameAr: 'الإحرام', timing: 'At Miqat', description: 'Perform ghusl, trim nails, apply perfume to body (not Ihram garments). Wear Ihram and make intention: "Labbayk Allaahumma Umratan". Begin Talbiyah.', significance: 'Crossing the Miqat in Ihram is the spiritual boundary between the ordinary world and the sacred.' },
      { step: '02', nameEn: 'Tawaf', nameAr: 'الطواف', timing: 'Upon Arrival', description: 'Circle the Kaabah seven times anti-clockwise beginning from the Black Stone. Make Wudu first. Engage in dhikr, dua and Quranic recitation throughout.', significance: 'The angels circle the Throne of Allah above. Your Tawaf below mirrors the worship of the heavens.' },
      { step: '03', nameEn: 'Pray Two Rakaahs', nameAr: 'ركعتا الطواف', timing: 'After Tawaf', description: 'Pray two Rakaahs behind Maqam Ibrahim. Recite Al-Kafirun in first, Al-Ikhlas in second. Then drink Zamzam facing the Kaabah.', significance: 'These two Rakaahs are among the most special prayers in Islam — performed in the holiest spot on earth.' },
      { step: '04', nameEn: "Sa'i", nameAr: 'السعي', timing: 'After Prayer', description: "Walk seven times between Safa and Marwa. Start at Safa, recite the dua, and walk to Marwa. Men jog between the green markers. End at Marwa.", significance: "Every step follows the footsteps of Hajar (AS) — a woman whose faith moved mountains and created Zamzam." },
      { step: '05', nameEn: 'Halq or Taqsir', nameAr: 'الحلق أو التقصير', timing: "After Sa'i", description: 'Men shave their heads (preferred) or shorten their hair. Women cut a fingertip length of hair. Umrah is now complete and Ihram is lifted.', significance: 'Umrah ends with a symbolic rebirth — emerging renewed, forgiven, and spiritually refreshed.' },
    ],
    tips: {
      health: ['Best times for Umrah are late night or early morning', 'Avoid peak Hajj season if possible for a calmer experience', 'Keep a small bag with essentials — phone, water, snack'],
      expect: ['Entire Umrah takes 2-3 hours if planned well', 'Masjid Al-Haram is air-conditioned throughout', 'Crowds vary greatly by time of day and season'],
      avoid: ['Starting Sa\'i before completing all 7 Tawaf circuits', 'Leaving the Masjid between Tawaf and Sa\'i unnecessarily', 'Forgetting to make intention before crossing the Miqat'],
    },
    prayers: [
      { nameEn: 'Talbiyah for Umrah', nameAr: 'تلبية العمرة', arabic: 'لَبَّيْكَ اللَّهُمَّ عُمْرَةً', translation: 'Here I am O Allah, for Umrah. Said upon making intention at the Miqat.' },
      { nameEn: 'At Safa', nameAr: 'عند الصفا', arabic: 'إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ', translation: 'Indeed Safa and Marwa are among the symbols of Allah.' },
    ],
  },

  '8': {
    id: '8', title: "Visiting Madinah", titleAr: 'زيارة المدينة المنورة',
    tag: '✦ MADINAH GUIDE',
    description: "Visiting Madinah and the Prophet's Mosque (Masjid An-Nabawi) is a beloved Sunnah. While not part of Hajj or Umrah, it is one of the most spiritually rewarding acts a Muslim can do.",
    steps: [
      { step: '01', nameEn: 'Enter Madinah with Respect', nameAr: 'دخول المدينة', timing: 'Upon Arrival', description: 'Enter Madinah with humility and reverence. Recite the dua for entering Madinah. Remember that this is the city of the Prophet ﷺ — every step here is blessed.', significance: 'The Prophet ﷺ said: "Madinah is a sanctuary." Its sanctity demands respect and presence of heart.' },
      { step: '02', nameEn: 'Enter Masjid An-Nabawi', nameAr: 'دخول المسجد النبوي', timing: 'At the Mosque', description: 'Enter with your right foot, recite the mosque entrance dua, and pray Tahiyatul Masjid. The mosque has been greatly expanded but the original area (Rawdah) is near the front.', significance: 'The Prophet ﷺ said: "A prayer in my mosque is better than 1,000 prayers elsewhere" (except Masjid Al-Haram).' },
      { step: '03', nameEn: "Visit the Rawdah", nameAr: 'الروضة الشريفة', timing: 'In the Mosque', description: "The Rawdah is the area between the Prophet's ﷺ grave and his pulpit (mimbar). It is described as a garden from the gardens of Paradise. Pray nafl salah here if possible.", significance: '"Between my house and my pulpit is a garden from the gardens of Paradise." — The Prophet ﷺ.' },
      { step: '04', nameEn: 'Send Salawat on the Prophet ﷺ', nameAr: 'الصلاة على النبي ﷺ', timing: 'At the Grave', description: "Stand before the grave of the Prophet ﷺ with humility, lower your voice, and send Salawat (blessings) upon him. Then greet Abu Bakr (RA) and Umar (RA) who are buried beside him.", significance: '"Whoever sends blessings upon me once, Allah sends blessings upon him ten times." — The Prophet ﷺ.' },
      { step: '05', nameEn: 'Visit Masjid Quba', nameAr: 'مسجد قباء', timing: 'Day Trip', description: "Visit Masjid Quba — the first mosque built in Islam. Pray two Rakaahs here. The Prophet ﷺ said its reward is like performing Umrah.", significance: '"Whoever purifies himself at home and comes to Masjid Quba and prays, he will have the reward of Umrah." — Prophet ﷺ.' },
      { step: '06', nameEn: 'Visit Baqi Cemetery', nameAr: 'البقيع', timing: 'Optional', description: "Visit Jannat Al-Baqi — the cemetery where many of the Prophet's ﷺ companions, wives, and family members are buried. Send Salams and make dua for the deceased.", significance: 'Visiting graves reminds us of our own mortality and strengthens our connection to those who carried Islam to us.' },
    ],
    tips: {
      health: ['Madinah is cooler than Makkah but still hot', 'The Rawdah can be very crowded — be patient and respectful', 'Wear clean, modest clothing in the Prophet\'s city'],
      expect: ['Long queues to enter the Rawdah — especially for women', 'Separate male/female entrance times for the Rawdah', 'Peaceful, spiritual atmosphere throughout the city'],
      avoid: ['Raising your voice near the grave — it is disrespectful', 'Pushing in the Rawdah — take your time with patience', 'Missing Fajr prayer in Masjid An-Nabawi — it is extremely virtuous'],
    },
    prayers: [
      { nameEn: 'Entering Madinah', nameAr: 'دعاء دخول المدينة', arabic: 'اللَّهُمَّ هَذَا حَرَمُ نَبِيِّكَ فَاجْعَلْهُ وِقَايَةً لِي مِنَ النَّارِ', translation: 'O Allah, this is the sanctuary of Your Prophet, so make it a protection for me from the Fire.' },
      { nameEn: 'Salawat at the Grave', nameAr: 'الصلاة والسلام على النبي', arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ', translation: 'O Allah, send blessings upon Muhammad and upon the family of Muhammad.' },
    ],
  },

  '9': {
    id: '9', title: 'Duas of Hajj & Umrah', titleAr: 'أدعية الحج والعمرة',
    tag: '✦ DUA GUIDE',
    description: 'Every stage of Hajj and Umrah has specific duas from the Sunnah of the Prophet ﷺ. Learning these duas transforms your pilgrimage from physical acts into a deeply spiritual conversation with Allah.',
    steps: [
      { step: '01', nameEn: 'Dua When Wearing Ihram', nameAr: 'دعاء الإحرام', timing: 'At Miqat', description: 'After wearing Ihram and making intention, recite the Talbiyah continuously until you begin Tawaf (for Umrah) or until you stone the Jamarat on Eid (for Hajj).', significance: 'The Talbiyah is your constant response to Allah\'s invitation. "And proclaim Hajj to the people." (Quran 22:27)' },
      { step: '02', nameEn: 'Dua Upon Seeing the Kaabah', nameAr: 'دعاء رؤية الكعبة', timing: 'First Sight', description: 'Upon first seeing the Kaabah, raise your hands and make dua. This is one of the most accepted moments for dua in all of Islam.', significance: '"When you see the Kaabah, raise your hands and make dua — for that is one of the times dua is answered." — Narrated by Al-Azraqi.' },
      { step: '03', nameEn: 'Duas During Tawaf', nameAr: 'أدعية الطواف', timing: 'During Tawaf', description: 'Between the Yemeni Corner and the Black Stone, recite Rabbana Atina. For the rest of the Tawaf, recite any dhikr or dua you know from the heart.', significance: 'The Prophet ﷺ did not restrict dua during Tawaf — this is your private conversation with Allah.' },
      { step: '04', nameEn: "Duas During Sa'i", nameAr: 'أدعية السعي', timing: "During Sa'i", description: 'At Safa and Marwa, face the Kaabah, raise hands and make dua. Between the two hills, make any dua you desire. This time is precious and unrestricted.', significance: 'Sa\'i is physically demanding — your effort combined with sincere dua creates a powerful act of worship.' },
      { step: '05', nameEn: 'Dua at Arafah', nameAr: 'دعاء عرفة', timing: '9th Dhul Hijjah', description: 'The best dua on the day of Arafah is "La ilaha illallah wahdahu la sharika lah...". Make long, sincere duas for yourself, family, the Ummah, and all of humanity.', significance: '"The best dua is the dua of Arafah, and the best thing I and the Prophets before me have said is: La ilaha illallah wahdah." — Prophet ﷺ.' },
      { step: '06', nameEn: 'Dua at Muzdalifah', nameAr: 'دعاء مزدلفة', timing: 'Night of 9th-10th', description: 'After the combined prayer at Muzdalifah, engage in dhikr and dua until Fajr. This night is one of great spiritual significance.', significance: 'Ibrahim (AS) spent this night in worship before the great test of sacrifice. Follow his example.' },
      { step: '07', nameEn: 'Dua After Jamarat', nameAr: 'دعاء بعد الجمرات', timing: 'At Mina', description: 'After stoning the small and medium Jamarat, face Qiblah with raised hands and make long duas. Do not stop to make dua at the large Jamarat.', significance: 'These moments of dua at the Jamarat are among the most virtuous times to supplicate in all of Hajj.' },
      { step: '08', nameEn: 'Dua at Farewell Tawaf', nameAr: 'دعاء طواف الوداع', timing: 'Before Leaving', description: 'During your Farewell Tawaf, pour your heart out to Allah. Ask for Hajj Mabroor, for return, and for acceptance. Leave with tears if possible.', significance: '"The last act with the House should be Tawaf." — The Prophet ﷺ. Leave as if you may never return.' },
      { step: '09', nameEn: 'General Hajj Dua', nameAr: 'الدعاء العام', timing: 'Throughout', description: 'The most comprehensive dua throughout Hajj is: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina azaaban-nar." It encompasses all good in this life and the next.', significance: 'The Prophet ﷺ recited this dua more than any other at Hajj. It is the dua of completeness and contentment.' },
      { step: '10', nameEn: 'Dua for Others', nameAr: 'الدعاء للآخرين', timing: 'Throughout Hajj', description: 'Do not forget to make dua for your parents, family, the sick, the oppressed, and the entire Muslim Ummah. Your dua in these sacred places carries extraordinary weight.', significance: '"The dua of a person for his brother in his absence is answered." — Prophet ﷺ. How much more at the sacred sites.' },
      { step: '11', nameEn: 'Dua for Acceptance', nameAr: 'دعاء القبول', timing: 'After All Rituals', description: 'After completing Hajj or Umrah, make dua for acceptance (Qabool). The sign of an accepted Hajj is that you return better than you came.', significance: '"Hajj Mabroor has no reward except Paradise." — Prophet ﷺ. Pray with certainty that Allah has accepted your effort.' },
      { step: '12', nameEn: 'Maintain the Spirit', nameAr: 'الاستمرار بعد العودة', timing: 'After Return', description: 'The Hajj journey does not end at the airport. Maintain the spiritual elevation, the discipline, and the connection to Allah you felt at the sacred sites.', significance: 'The true Hajj Mabroor shows in the years after — in improved character, increased worship, and closeness to Allah.' },
    ],
    tips: {
      health: ['Write down key duas before leaving home', 'Carry a small dua booklet or save duas on your phone', 'Memorise the Talbiyah and Arafah dua before traveling'],
      expect: ['Many pilgrims cry deeply during dua — this is normal and beautiful', 'Arabic duas are more rewarding but Allah understands all languages', 'Your sincerity matters more than perfection of pronunciation'],
      avoid: ['Rushing through duas without presence of heart', 'Only making dua for yourself — include the Ummah', 'Forgetting to thank Allah before asking — gratitude comes first'],
    },
    prayers: [
      { nameEn: 'The Best Dua at Arafah', nameAr: 'أفضل دعاء يوم عرفة', arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', translation: 'There is no god but Allah alone, with no partner. To Him belongs all dominion and all praise, and He has power over all things.' },
    ],
  },

  '10': {
    id: '10', title: 'Standing at Arafah', titleAr: 'الوقوف بعرفة',
    tag: '✦ ARAFAH GUIDE',
    description: '"Hajj is Arafah." — The Prophet ﷺ. Wuquf (standing) at Arafah is the most important pillar of Hajj. Missing it means Hajj is invalid. This is the day Allah forgives the most sins.',
    steps: [
      { step: '01', nameEn: 'Arrive Before Dhuhr', nameAr: 'الوصول قبل الظهر', timing: '9th Dhul Hijjah Morning', description: 'Travel from Mina to Arafah. Arrive before Dhuhr if possible. The time of Wuquf begins after Dhuhr and ends at sunset. Some scholars allow arrival after Fajr.', significance: 'Arriving early gives you more time in this blessed plain. Every extra minute at Arafah is an opportunity for forgiveness.' },
      { step: '02', nameEn: 'Combine Dhuhr & Asr', nameAr: 'الجمع بين الظهر والعصر', timing: 'At Dhuhr Time', description: 'Pray Dhuhr and Asr combined and shortened (2+2 Rakaahs) at Dhuhr time with one Adhan and two Iqamahs. This is the Sunnah of the Prophet ﷺ at Arafah.', significance: 'Combining prayers here preserves your precious time for dua and worship. Prayer is complete — now worship freely.' },
      { step: '03', nameEn: 'The Wuquf', nameAr: 'الوقوف', timing: 'Dhuhr to Sunset', description: 'Spend every moment in dua, dhikr, Quran recitation, and repentance. Face the Qiblah when making dua. You do not need to stand physically — sitting, lying, or being in your tent all count.', significance: '"On no day does Allah free more people from the Fire than on the day of Arafah." — Prophet ﷺ. This is your day.' },
      { step: '04', nameEn: 'Do Not Leave Before Sunset', nameAr: 'البقاء حتى الغروب', timing: 'Until Sunset', description: 'Remain at Arafah until after sunset. Leaving before sunset without valid excuse makes Hajj invalid according to most scholars. This is the most critical rule of Arafah.', significance: 'The Prophet ﷺ specifically waited until after sunset. Following his example is following perfection.' },
    ],
    tips: {
      health: ['Drink water constantly — temperatures can reach 45°C', 'Use an umbrella for shade throughout the day', 'Eat a light meal before — heavy food makes worship harder'],
      expect: ['Millions of pilgrims in one vast plain — an overwhelming and beautiful sight', 'Intense heat but equally intense spiritual atmosphere', 'Many pilgrims weep openly — it is a day of raw sincerity'],
      avoid: ['Leaving before sunset — this can invalidate your Hajj', 'Wasting time on phones and social media', 'Sleeping through the afternoon — this is the greatest day of Hajj'],
    },
    prayers: [
      { nameEn: 'Best Dua at Arafah', nameAr: 'أفضل دعاء عرفة', arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', translation: 'There is no god but Allah alone, with no partner. To Him belongs dominion and all praise, and He has power over all things. The best dua on the day of Arafah.' },
      { nameEn: 'Dua for Forgiveness', nameAr: 'دعاء المغفرة', arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي', translation: 'O Allah, You are the Pardoning One, You love to pardon, so pardon me.' },
    ],
  },
};

export default function GuideDetail() {
  const COLORS = useTheme();
  const styles = useMemo(() => makeStyles(COLORS), [COLORS]);
  const router = useRouter();
  const params = useLocalSearchParams();
  const guideId = (params.id as string) || 'featured';
  const from = (params.from as string) || 'guides';

  const guide = allGuides[guideId] || allGuides['featured'];

  const [expandedPrayer, setExpandedPrayer] = useState<string | null>(null);

  return (
    <View style={styles.screen}>
      <StatusBar style={COLORS.statusBar} backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push((from === 'home' ? '/(tabs)' : '/(tabs)/guides') as any)} activeOpacity={0.75}>
          <Ionicons name="chevron-back" size={20} color={COLORS.textPrimary} />
          <Text style={styles.backText}>Back to Guides</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>

        <Animated.View entering={FadeInDown.delay(0).duration(500)} style={styles.hero}>
          <Text style={styles.heroTag}>{guide.tag}</Text>
          <Text style={styles.heroTitle}>{guide.title}</Text>
          <Text style={styles.heroTitleAr}>{guide.titleAr}</Text>
          <Text style={styles.heroDesc}>{guide.description}</Text>
          <View style={styles.heroMeta}>
            <Ionicons name="list" size={14} color={COLORS.gold} style={{ marginRight: 4 }} />
            <Text style={styles.heroMetaText}>{guide.steps.length} steps</Text>
          </View>
        </Animated.View>

        <View style={styles.section}>
          {guide.steps.map((step, index) => (
            <Animated.View key={step.step} entering={FadeInDown.delay(index * 60).duration(400)} style={styles.stepCard}>
              {/* Timing badge */}
              <View style={styles.timingBadge}>
                <Text style={styles.timingText}>{step.timing}</Text>
              </View>

              <View style={styles.stepRow}>
                {index % 2 === 0 ? (
                  <>
                    <View style={styles.stepIconBox}>
                      <Text style={styles.stepNumber}>Step {step.step}</Text>
                      <View style={styles.stepIconCircle}>
                        <MaterialCommunityIcons name="mosque" size={26} color={COLORS.gold} />
                      </View>
                    </View>
                    <View style={styles.stepContent}>
                      <Text style={styles.stepNameEn}>{step.nameEn}</Text>
                      <Text style={styles.stepNameAr}>{step.nameAr}</Text>
                      <Text style={styles.stepDesc}>{step.description}</Text>
                      <View style={styles.significanceBox}>
                        <Text style={styles.significanceLabel}>✦ Significance</Text>
                        <Text style={styles.significanceText}>{step.significance}</Text>
                      </View>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.stepContent}>
                      <Text style={styles.stepNameEn}>{step.nameEn}</Text>
                      <Text style={styles.stepNameAr}>{step.nameAr}</Text>
                      <Text style={styles.stepDesc}>{step.description}</Text>
                      <View style={styles.significanceBox}>
                        <Text style={styles.significanceLabel}>✦ Significance</Text>
                        <Text style={styles.significanceText}>{step.significance}</Text>
                      </View>
                    </View>
                    <View style={styles.stepIconBox}>
                      <Text style={styles.stepNumber}>Step {step.step}</Text>
                      <View style={styles.stepIconCircle}>
                        <MaterialCommunityIcons name="mosque" size={26} color={COLORS.gold} />
                      </View>
                    </View>
                  </>
                )}
              </View>

              {index < guide.steps.length - 1 && (
                <View style={styles.connector}>
                  <View style={styles.connectorLine} />
                  <Ionicons name="chevron-down" size={14} color={COLORS.gold} />
                </View>
              )}
            </Animated.View>
          ))}
        </View>

        {guide.prayers.length > 0 && (
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTag}>SACRED WORDS</Text>
            <Text style={styles.sectionTitle}>Key Prayers</Text>
            {guide.prayers.map((prayer, i) => (
              <TouchableOpacity
                key={i}
                style={styles.prayerCard}
                onPress={() => setExpandedPrayer(expandedPrayer === prayer.nameEn ? null : prayer.nameEn)}
                activeOpacity={0.85}
              >
                <View style={styles.prayerHeader}>
                  <View style={styles.prayerIconBox}>
                    <Ionicons name="book" size={16} color={COLORS.gold} />
                  </View>
                  <View style={styles.prayerTitles}>
                    <Text style={styles.prayerNameEn}>{prayer.nameEn}</Text>
                    <Text style={styles.prayerNameAr}>{prayer.nameAr}</Text>
                  </View>
                  <Ionicons name={expandedPrayer === prayer.nameEn ? 'chevron-up' : 'chevron-down'} size={16} color={COLORS.textMuted} />
                </View>
                {expandedPrayer === prayer.nameEn && (
                  <Animated.View entering={FadeIn.duration(200)} style={styles.prayerBody}>
                    <Text style={styles.prayerArabic}>{prayer.arabic}</Text>
                    <View style={styles.prayerDivider} />
                    <Text style={styles.prayerTranslation}>{prayer.translation}</Text>
                  </Animated.View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTag}>BE PREPARED</Text>
          <Text style={styles.sectionTitle}>Tips for this Ritual</Text>
          <View style={styles.tipsGrid}>
            <View style={[styles.tipsColumn, { borderColor: COLORS.green }]}>
              <View style={styles.tipsColumnHeader}>
                <Ionicons name="heart" size={14} color={COLORS.green} />
                <Text style={[styles.tipsColumnTitle, { color: COLORS.green }]}>Health Tips</Text>
              </View>
              {guide.tips.health.map((tip, i) => (
                <View key={i} style={styles.tipItemRow}>
                  <View style={[styles.tipItemDot, { backgroundColor: COLORS.green }]} />
                  <Text style={styles.tipItemText}>{tip}</Text>
                </View>
              ))}
            </View>
            <View style={[styles.tipsColumn, { borderColor: COLORS.blue }]}>
              <View style={styles.tipsColumnHeader}>
                <Ionicons name="bulb" size={14} color={COLORS.blue} />
                <Text style={[styles.tipsColumnTitle, { color: COLORS.blue }]}>What to Expect</Text>
              </View>
              {guide.tips.expect.map((tip, i) => (
                <View key={i} style={styles.tipItemRow}>
                  <View style={[styles.tipItemDot, { backgroundColor: COLORS.blue }]} />
                  <Text style={styles.tipItemText}>{tip}</Text>
                </View>
              ))}
            </View>
            <View style={[styles.tipsColumn, { borderColor: COLORS.red }]}>
              <View style={styles.tipsColumnHeader}>
                <Ionicons name="warning" size={14} color={COLORS.red} />
                <Text style={[styles.tipsColumnTitle, { color: COLORS.red }]}>Mistakes to Avoid</Text>
              </View>
              {guide.tips.avoid.map((tip, i) => (
                <View key={i} style={styles.tipItemRow}>
                  <View style={[styles.tipItemDot, { backgroundColor: COLORS.red }]} />
                  <Text style={styles.tipItemText}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}


function makeStyles(COLORS: any) { return StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 52, paddingBottom: 12, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backText: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '500' },
  container: { paddingBottom: 40 },

  hero: { backgroundColor: COLORS.surface, padding: 24, borderBottomWidth: 1, borderBottomColor: COLORS.border, marginBottom: 24 },
  heroTag: { fontSize: 10, fontWeight: '700', color: COLORS.gold, letterSpacing: 2, marginBottom: 10 },
  heroTitle: { fontSize: 26, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 4, lineHeight: 34 },
  heroTitleAr: { fontSize: 16, color: COLORS.gold, marginBottom: 10, fontWeight: '500' },
  heroDesc: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22, marginBottom: 12 },
  heroMeta: { flexDirection: 'row', alignItems: 'center' },
  heroMetaText: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600' },

  section: { paddingHorizontal: 20, marginBottom: 8 },
  stepCard: { marginBottom: 4 },
  timingBadge: { backgroundColor: COLORS.goldMuted, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginBottom: 12 },
  timingText: { fontSize: 11, fontWeight: '600', color: COLORS.gold },
  stepRow: { flexDirection: 'row', gap: 16, marginBottom: 8 },
  stepIconBox: { alignItems: 'center', width: 72 },
  stepNumber: { fontSize: 10, fontWeight: '700', color: COLORS.gold, letterSpacing: 1, marginBottom: 8 },
  stepIconCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.black, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.gold },
  stepContent: { flex: 1 },
  stepNameEn: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 4 },
  stepNameAr: { fontSize: 13, color: COLORS.gold, marginBottom: 10, fontWeight: '500' },
  stepDesc: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20, marginBottom: 12 },
  significanceBox: { backgroundColor: COLORS.goldMuted, borderRadius: 10, padding: 12, borderLeftWidth: 3, borderLeftColor: COLORS.gold },
  significanceLabel: { fontSize: 10, fontWeight: '700', color: COLORS.gold, marginBottom: 4, letterSpacing: 1 },
  significanceText: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18 },
  connector: { alignItems: 'center', paddingVertical: 8 },
  connectorLine: { width: 1, height: 20, backgroundColor: COLORS.border },

  sectionBlock: { marginHorizontal: 20, marginBottom: 20, backgroundColor: COLORS.surface, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: COLORS.border },
  sectionTag: { fontSize: 10, fontWeight: '700', color: COLORS.gold, letterSpacing: 2, marginBottom: 6 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 16 },

  prayerCard: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 14, marginBottom: 10, overflow: 'hidden' },
  prayerHeader: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  prayerIconBox: { width: 34, height: 34, borderRadius: 10, backgroundColor: COLORS.goldMuted, justifyContent: 'center', alignItems: 'center' },
  prayerTitles: { flex: 1 },
  prayerNameEn: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  prayerNameAr: { fontSize: 12, color: COLORS.gold, marginTop: 1 },
  prayerBody: { paddingHorizontal: 14, paddingBottom: 14 },
  prayerArabic: { fontSize: 18, color: COLORS.textPrimary, textAlign: 'right', lineHeight: 30, marginBottom: 10 },
  prayerDivider: { height: 1, backgroundColor: COLORS.border, marginBottom: 10 },
  prayerTranslation: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20, fontStyle: 'italic' },

  tipsGrid: { gap: 12 },
  tipsColumn: { backgroundColor: COLORS.background, borderRadius: 14, padding: 14, borderLeftWidth: 3 },
  tipsColumnHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  tipsColumnTitle: { fontSize: 12, fontWeight: '700' },
  tipItemRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  tipItemDot: { width: 5, height: 5, borderRadius: 3, marginTop: 6 },
  tipItemText: { flex: 1, fontSize: 12, color: COLORS.textSecondary, lineHeight: 18 },
}); }