import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { clearChatHistory, ChatMessage as FirestoreChatMessage, getChatHistory, saveChatMessage } from '../../constants/firestoreService';
import { useTheme } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

type Message = { id: string; text: string; sender: 'user' | 'ai'; timestamp: Date; };

const quickQuestions = ['How do I perform Tawaf?', 'What invalidates Ihram?', "Steps of Sa'i?", 'Dua for entering Makkah?', 'What is the Talbiyah?', 'How to perform Rami?'];

const getMockResponse = (question: string): string => {
  const q = question.toLowerCase();
  if (q.includes('tawaf')) return 'Tawaf involves circling the Kaabah 7 times in an anti-clockwise direction, beginning and ending at the Black Stone.\n\nEach circuit starts with "Bismillah, Allahu Akbar." Men should perform Idtiba during the first 3 circuits.\n\nWould you like more details on the duas for each circuit?';
  if (q.includes('ihram')) return 'The following actions invalidate Ihram:\n\n• Sexual intercourse\n• Cutting hair or nails\n• Using perfume or scented products\n• Covering the head (for men)\n• Wearing sewn garments (for men)\n• Hunting or harming animals';
  if (q.includes("sa'i") || q.includes('sai')) return "Sa'i involves walking 7 times between the hills of Safa and Marwa.\n\n1. Begin at Safa\n2. Walk to Marwa (1st circuit)\n3. Return to Safa (2nd circuit)\n4. Continue until completing 7 circuits ending at Marwa\n\nMen should jog between the green markers.";
  if (q.includes('talbiyah')) return 'The Talbiyah is:\n\nلَبَّيْكَ اللَّهُمَّ لَبَّيْكَ\nلَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ\n\n"Here I am O Allah, here I am. You have no partner, here I am."\n\nRecite from Ihram until stoning at Jamarat.';
  if (q.includes('rami')) return 'Rami (stoning of the Jamarat):\n\n• 10th Dhul Hijjah: Stone only Jamrat al-Aqabah (7 stones)\n• 11th–13th: Stone all 3 Jamarats (7 stones each)\n\nSay "Allahu Akbar" with each stone.';
  if (q.includes('makkah')) return 'Dua for entering Makkah:\n\nاللَّهُمَّ هَذَا حَرَمُكَ وَأَمْنُكَ\n\n"O Allah, this is Your sanctuary and Your place of safety. Make me forbidden to the Hellfire."\n\nEnter with your right foot first.';
  return "JazakAllahu Khayran for your question!\n\nI'm currently in demo mode — my full knowledge base will be available soon.\n\nExplore the Guides section for detailed step-by-step rituals in the meantime.";
};

const toMessage = (m: FirestoreChatMessage): Message => ({
  id: m.id,
  text: m.content,
  sender: m.role === 'user' ? 'user' : 'ai',
  timestamp: new Date(m.timestamp),
});

const MessageBubble = ({ COLORS, styles, message }: any) => {
  const isUser = message.sender === 'user';
  return (
    <View style={[styles.bubbleRow, isUser ? styles.bubbleRowUser : styles.bubbleRowAI]}>
      {!isUser && <View style={styles.aiAvatar}><MaterialCommunityIcons name="mosque" size={16} color={COLORS.gold} /></View>}
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        <Text style={[styles.bubbleText, isUser ? styles.userBubbleText : styles.aiBubbleText]}>{message.text}</Text>
        <Text style={[styles.timestamp, isUser ? styles.timestampUser : styles.timestampAI]}>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </View>
    </View>
  );
};

const TypingIndicator = ({ COLORS, styles }: any) => (
  <View style={styles.bubbleRow}>
    <View style={styles.aiAvatar}><MaterialCommunityIcons name="mosque" size={16} color={COLORS.gold} /></View>
    <View style={[styles.bubble, styles.aiBubble, styles.typingBubble]}><Text style={styles.typingDots}>● ● ●</Text></View>
  </View>
);

const WELCOME: Message = {
  id: '0',
  text: "Assalamu Alaikum! 🌙\n\nI'm your Hajj Coach, trained on authentic Islamic manuals and scholarly sources.\n\nAsk me anything about Hajj, Umrah, rituals, duas, or Islamic rulings. How can I help you today?",
  sender: 'ai',
  timestamp: new Date(),
};

export default function Coach() {
  const COLORS = useTheme();
  const styles = useMemo(() => makeStyles(COLORS), [COLORS]);
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!user) return;
    getChatHistory(user.uid).then(history => {
      if (history.length > 0) {
        setMessages([WELCOME, ...history.map(toMessage)]);
      }
      setHistoryLoaded(true);
    });
  }, [user]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    if (user) {
      await saveChatMessage(user.uid, {
        role: 'user',
        content: text.trim(),
        timestamp: userMsg.timestamp.getTime(),
      });
    }

    setTimeout(async () => {
      const responseText = getMockResponse(text);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);

      if (user) {
        await saveChatMessage(user.uid, {
          role: 'assistant',
          content: responseText,
          timestamp: aiMsg.timestamp.getTime(),
        });
      }
    }, 1500);
  };

  const handleClearHistory = async () => {
    if (!user) return;
    setMessages([WELCOME]);
    await clearChatHistory(user.uid);
  };

  useEffect(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages, isTyping]);

  return (
    <View style={styles.screen}>
      <StatusBar style={COLORS.statusBar} backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerAvatar}><MaterialCommunityIcons name="mosque" size={22} color={COLORS.gold} /></View>
          <View>
            <Text style={styles.headerTitle}>Hajj Coach</Text>
            <Text style={styles.headerSubtitle}>AI • Islamic Manuals Only</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.onlineDot} />
          {/* Clear history button */}
          {messages.length > 1 && (
            <TouchableOpacity onPress={handleClearHistory} style={styles.clearBtn} activeOpacity={0.7}>
              <Ionicons name="trash-outline" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.disclaimer}>
        <Ionicons name="shield-checkmark" size={12} color="#8B6914" style={{ marginRight: 6 }} />
        <Text style={styles.disclaimerText}>Answers based on authentic Islamic scholarly sources</Text>
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <MessageBubble COLORS={COLORS} styles={styles} message={item} />}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={isTyping ? <TypingIndicator COLORS={COLORS} styles={styles} /> : null}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={styles.quickSection}>
          <FlatList
            data={quickQuestions}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item}
            contentContainerStyle={styles.quickList}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.quickChip} onPress={() => sendMessage(item)} activeOpacity={0.75}>
                <Text style={styles.quickChipText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask about Hajj or Umrah..."
            placeholderTextColor={COLORS.textMuted}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: inputText.trim() ? COLORS.black : COLORS.border }]}
            onPress={() => sendMessage(inputText)}
            disabled={!inputText.trim()}
            activeOpacity={0.85}
          >
            <Ionicons name="arrow-up" size={20} color={inputText.trim() ? COLORS.gold : COLORS.textMuted} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function makeStyles(COLORS: any) { return StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 14, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerAvatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: COLORS.black, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  headerSubtitle: { fontSize: 12, color: COLORS.textMuted },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  onlineDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#4CAF50' },
  clearBtn: { padding: 4 },
  disclaimer: { backgroundColor: COLORS.goldMuted, paddingVertical: 8, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#EDE0C0', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  disclaimerText: { fontSize: 11, color: COLORS.gold, fontWeight: '500' },
  messagesList: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 12, gap: 8 },
  bubbleRowUser: { flexDirection: 'row-reverse' },
  bubbleRowAI: { flexDirection: 'row' },
  aiAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.black, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  bubble: { maxWidth: '75%', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  userBubble: { backgroundColor: COLORS.black, borderBottomRightRadius: 4 },
  aiBubble: { backgroundColor: COLORS.surface, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: COLORS.border, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  bubbleText: { fontSize: 14, lineHeight: 22 },
  userBubbleText: { color: COLORS.goldLight },
  aiBubbleText: { color: COLORS.textPrimary },
  timestamp: { fontSize: 10, marginTop: 4 },
  timestampUser: { color: COLORS.textMuted, textAlign: 'right' },
  timestampAI: { color: COLORS.textMuted },
  typingBubble: { paddingVertical: 12, paddingHorizontal: 16 },
  typingDots: { color: COLORS.textMuted, fontSize: 10, letterSpacing: 4 },
  quickSection: { paddingVertical: 10, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: COLORS.surface },
  quickList: { paddingHorizontal: 16, gap: 8 },
  quickChip: { backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border, borderRadius: 50, paddingVertical: 7, paddingHorizontal: 14 },
  quickChipText: { fontSize: 12, color: COLORS.textPrimary, fontWeight: '500' },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border, gap: 10 },
  input: { flex: 1, backgroundColor: COLORS.background, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: COLORS.textPrimary, maxHeight: 100, borderWidth: 1, borderColor: COLORS.border },
  sendButton: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
}); }