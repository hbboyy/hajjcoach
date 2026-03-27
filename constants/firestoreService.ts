

import {
  addDoc,
  collection,
  deleteDoc,
  doc, getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';


export const getUserProfile = async (uid: string) => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
};

export const updateUserSettings = async (
  uid: string,
  settings: {
    language?: string;
    notifications?: boolean;
    dailyDua?: boolean;
    arabicScript?: boolean;
  }
) => {
  await updateDoc(doc(db, 'users', uid), settings as any);
};


export const getMilestones = async (uid: string): Promise<string[]> => {
  try {
    const snap = await getDocs(collection(db, 'users', uid, 'milestones'));
    return snap.docs.map(d => d.id);
  } catch { return []; }
};

export const toggleMilestone = async (uid: string, milestoneId: string, completed: boolean) => {
  const ref = doc(db, 'users', uid, 'milestones', milestoneId);
  if (completed) {
    await setDoc(ref, { completedAt: Date.now() });
  } else {
    await deleteDoc(ref);
  }
};


export const getFavouriteDuas = async (uid: string): Promise<string[]> => {
  try {
    const snap = await getDocs(collection(db, 'users', uid, 'favourites'));
    return snap.docs.map(d => d.id);
  } catch { return []; }
};

export const toggleFavouriteDua = async (uid: string, duaId: string, isFav: boolean) => {
  const ref = doc(db, 'users', uid, 'favourites', duaId);
  if (isFav) {
    await setDoc(ref, { savedAt: Date.now() });
  } else {
    await deleteDoc(ref);
  }
};


export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
};

export const getChatHistory = async (uid: string): Promise<ChatMessage[]> => {
  try {
    const q = query(
      collection(db, 'users', uid, 'chatHistory'),
      orderBy('timestamp', 'asc'),
      limit(100)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ChatMessage));
  } catch { return []; }
};

export const saveChatMessage = async (uid: string, message: Omit<ChatMessage, 'id'>) => {
  try {
    await addDoc(collection(db, 'users', uid, 'chatHistory'), message);
  } catch (e) {
    console.error('saveChatMessage error:', e);
  }
};

export const clearChatHistory = async (uid: string) => {
  try {
    const snap = await getDocs(collection(db, 'users', uid, 'chatHistory'));
    const batch = writeBatch(db);
    snap.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
  } catch (e) {
    console.error('clearChatHistory error:', e);
  }
};


export const submitFeedback = async (data: {
  uid?: string;
  type: 'general' | 'suggestion' | 'bug';
  message: string;
}) => {
  await addDoc(collection(db, 'feedback'), {
    ...data,
    timestamp: Date.now(),
    status: 'new',
  });
};