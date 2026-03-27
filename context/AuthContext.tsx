

import {
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile as firebaseUpdateProfile,
  onAuthStateChanged,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { auth, db } from '../constants/firebase';

// ── Types ─────────────────────────────────────
export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  language: string;
  createdAt: number;
};

type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  emailVerified: boolean;
  isGuest: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  checkEmailVerified: () => Promise<boolean>;
  continueAsGuest: () => void;
  signOut: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
};

// ── Context ───────────────────────────────────
const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  emailVerified: false,
  isGuest: false,
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  resetPassword: async () => {},
  resendVerificationEmail: async () => {},
  checkEmailVerified: async () => false,
  continueAsGuest: () => {},
  signOut: async () => {},
  updateUserProfile: async () => {},
});

// ── Safe hook — never throws ──────────────────
export const useAuth = () => useContext(AuthContext);

// ── Provider ──────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  // ── Listen to auth state ──────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setEmailVerified(firebaseUser?.emailVerified ?? false);
      if (firebaseUser && firebaseUser.emailVerified) {
        await loadProfile(firebaseUser.uid);
        setIsGuest(false); // real user signed in — clear guest flag
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // ── Load profile from Firestore ───────────
  const loadProfile = async (uid: string) => {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) setProfile(snap.data() as UserProfile);
    } catch (e) {
      console.error('loadProfile error:', e);
    }
  };

  // ── Create profile doc ────────────────────
  const createUserProfile = async (firebaseUser: User, name: string) => {
    const profileData: UserProfile = {
      uid: firebaseUser.uid,
      name: name || firebaseUser.displayName || 'Pilgrim',
      email: firebaseUser.email || '',
      photoURL: firebaseUser.photoURL || '',
      language: 'en',
      createdAt: Date.now(),
    };
    await setDoc(doc(db, 'users', firebaseUser.uid), profileData, { merge: true });
    setProfile(profileData);
  };

  // ── Email Sign In ─────────────────────────
  const signInWithEmail = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (!result.user.emailVerified) {
        setEmailVerified(false);
      }
    } catch (e: any) {
      Alert.alert('Sign In Failed', firebaseErrorMessage(e.code));
      throw e;
    }
  };

  // ── Email Sign Up ─────────────────────────
  const signUpWithEmail = async (email: string, password: string, name: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await firebaseUpdateProfile(result.user, { displayName: name });
      await sendEmailVerification(result.user);
      setUser(result.user);
      setEmailVerified(false);
    } catch (e: any) {
      Alert.alert('Sign Up Failed', firebaseErrorMessage(e.code));
      throw e;
    }
  };

  // ── Reset Password ────────────────────────
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        'Password Reset Email Sent 📧',
        `A reset link has been sent to:\n${email}\n\nPlease check your inbox and spam folder, then follow the instructions in the email.`,
        [{ text: 'OK' }]
      );
    } catch (e: any) {
      Alert.alert('Reset Failed', firebaseErrorMessage(e.code));
    }
  };

  // ── Continue as Guest ─────────────────────
  const continueAsGuest = () => {
    setIsGuest(true);
  };

  // ── Resend Verification Email ─────────────
  const resendVerificationEmail = async () => {
    try {
      if (user && !user.emailVerified) {
        await sendEmailVerification(user);
        Alert.alert('Email Sent', 'A new verification email has been sent.');
      }
    } catch {
      Alert.alert('Error', 'Could not resend email. Please try again.');
    }
  };

  // ── Check if email is now verified ───────
  const checkEmailVerified = async (): Promise<boolean> => {
    try {
      if (user) {
        await reload(user);
        const verified = user.emailVerified;
        setEmailVerified(verified);
        if (verified) {
          await createUserProfile(user, user.displayName || '');
        }
        return verified;
      }
    } catch (e) {
      console.error('checkEmailVerified error:', e);
    }
    return false;
  };

  // ── Sign Out ──────────────────────────────
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setProfile(null);
      setEmailVerified(false);
      setIsGuest(false);
    } catch {
      Alert.alert('Error', 'Could not sign out. Please try again.');
    }
  };

  // ── Update Profile ────────────────────────
  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), data as any);
      setProfile(prev => prev ? { ...prev, ...data } : null);
    } catch {
      Alert.alert('Error', 'Could not update profile.');
    }
  };

  return (
    <AuthContext.Provider value={{
      user, profile, loading, emailVerified, isGuest,
      signInWithEmail, signUpWithEmail,
      resetPassword, continueAsGuest,
      resendVerificationEmail, checkEmailVerified,
      signOut, updateUserProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Firebase error messages ───────────────────
const firebaseErrorMessage = (code: string): string => {
  switch (code) {
    case 'auth/user-not-found':         return 'No account found with this email.';
    case 'auth/wrong-password':         return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential':     return 'Incorrect email or password.';
    case 'auth/email-already-in-use':   return 'An account with this email already exists.';
    case 'auth/invalid-email':          return 'Please enter a valid email address.';
    case 'auth/weak-password':          return 'Password must be at least 6 characters.';
    case 'auth/too-many-requests':      return 'Too many attempts. Please try again later.';
    case 'auth/network-request-failed': return 'Network error. Check your connection.';
    default:                            return 'Something went wrong. Please try again.';
  }
};