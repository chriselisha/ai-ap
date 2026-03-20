import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, googleProvider } from '../lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendEmailVerification,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, increment, onSnapshot, serverTimestamp } from 'firebase/firestore';
import fpPromise from '@fingerprintjs/fingerprintjs';

interface UserProfile {
  user_id: string;
  email: string;
  login_provider: 'google' | 'email';
  plan_type: 'Free' | 'Starter' | 'Pro';
  credits_remaining: number;
  device_fingerprint?: string;
  ip_address?: string;
  account_created_at: any;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthReady: boolean;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  decrementCredits: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setProfile(null);
        setLoading(false);
        setIsAuthReady(true);
        return;
      }

      // If user exists, listen to their profile
      const unsubscribeProfile = onSnapshot(
        doc(db, 'users', currentUser.uid),
        (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          }
          setLoading(false);
          setIsAuthReady(true);
        },
        (error) => {
          console.error("Error fetching user profile:", error);
          setLoading(false);
          setIsAuthReady(true);
        }
      );

      return () => unsubscribeProfile();
    });

    return () => unsubscribe();
  }, []);

  const getFingerprint = async () => {
    try {
      const fp = await fpPromise.load();
      const result = await fp.get();
      return result.visitorId;
    } catch (e) {
      return 'unknown_fingerprint';
    }
  };

  const getIP = async () => {
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      return data.ip;
    } catch (e) {
      return 'unknown_ip';
    }
  };

  const handleNewUserSetup = async (currentUser: FirebaseUser, provider: 'google' | 'email') => {
    const userRef = doc(db, 'users', currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const fingerprint = await getFingerprint();
      const ip = await getIP();

      let startingCredits = 3;

      const hasClaimedInBrowser = localStorage.getItem('has_claimed_free_credits');
      if (hasClaimedInBrowser === 'true') {
        startingCredits = 0;
      }

      // Check if fingerprint or IP already used
      if (fingerprint !== 'unknown_fingerprint') {
        const fpRef = doc(db, 'fingerprints', fingerprint);
        const fpSnap = await getDoc(fpRef);
        if (fpSnap.exists()) {
          startingCredits = 0; // Already claimed free credits
        } else {
          await setDoc(fpRef, { used_by: currentUser.uid, created_at: serverTimestamp() }).catch(console.error);
        }
      }

      if (ip !== 'unknown_ip') {
        const ipRef = doc(db, 'ips', ip.replace(/\./g, '_')); // safe doc id
        const ipSnap = await getDoc(ipRef);
        if (ipSnap.exists()) {
          startingCredits = 0; // Already claimed free credits
        } else {
          await setDoc(ipRef, { used_by: currentUser.uid, created_at: serverTimestamp() }).catch(console.error);
        }
      }

      const newProfile: UserProfile = {
        user_id: currentUser.uid,
        email: currentUser.email || '',
        login_provider: provider,
        plan_type: 'Free',
        credits_remaining: startingCredits,
        device_fingerprint: fingerprint,
        ip_address: ip,
        account_created_at: serverTimestamp(),
        role: 'user'
      };

      await setDoc(userRef, newProfile);
      if (startingCredits > 0) {
        localStorage.setItem('has_claimed_free_credits', 'true');
      }
      setProfile(newProfile);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await handleNewUserSetup(result.user, 'google');
      setIsLoginModalOpen(false);
    } catch (error) {
      console.error("Error signing in with Google", error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setProfile(null);
  };

  const decrementCredits = async () => {
    if (!user || !profile) return false;
    if (profile.plan_type === 'Pro') return true; // Unlimited
    if (profile.credits_remaining <= 0) return false;

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        credits_remaining: increment(-1)
      });
      return true;
    } catch (error) {
      console.error("Error decrementing credits", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      isAuthReady,
      isLoginModalOpen,
      openLoginModal: () => setIsLoginModalOpen(true),
      closeLoginModal: () => setIsLoginModalOpen(false),
      signInWithGoogle,
      logout,
      decrementCredits
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
