import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, initializeAuth } from 'firebase/auth';
import { collection, doc, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBaup61zsCy686ygz6gk4OSMc0Uj-W5CIo",
  authDomain: "hajjcoach-bea0d.firebaseapp.com",
  projectId: "hajjcoach-bea0d",
  storageBucket: "hajjcoach-bea0d.firebasestorage.app",
  messagingSenderId: "555499531128",
  appId: "1:555499531128:android:81b134c5d20e52b4a1368d",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// @ts-ignore
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';

const auth: Auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { app, auth, db };
export const userDoc = (uid: string) => doc(db, 'users', uid);
export const milestonesCol = (uid: string) => collection(db, 'users', uid, 'milestones');
export const favouritesCol = (uid: string) => collection(db, 'users', uid, 'favourites');
export const chatCol = (uid: string) => collection(db, 'users', uid, 'chatHistory');
export const feedbackCol = () => collection(db, 'feedback');