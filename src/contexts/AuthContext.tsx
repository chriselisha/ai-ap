import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, googleProvider } from '../lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, increment, onSnapshot } from 'firebase/firestore';

export interface UserData {
  user_id: string;
  email: string;
  plan_type: string; // "Free", "Starter", "Pro", "Annual"
  credits_remaining: number;
  role: string;
  login_provider: string;
  account_created_at: string;
  device_fingerprint?: string;
  ip_address?: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  userData: UserData | null;
  loading: boolean;
  isAuthReady: boolean;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  decrementCredits: () => Promise<boolean>;
  refreshUserData: () => Promise<void>;
  activateSubscription: (plan: 'Starter' | 'Pro' | 'Annual') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setUserData(null);
        setLoading(false);
        setIsAuthReady(true);
        return;
      }

      const userDocRef = doc(db, 'users', currentUser.uid);
      const unsubscribeProfile = onSnapshot(
        userDocRef,
        async (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data() as UserData);
          } else {
            const newUserData: UserData = {
              user_id: currentUser.uid,
              email: currentUser.email || '',
              plan_type: 'Free',
              credits_remaining: 3,
              role: 'user',
              login_provider: 'google',
              account_created_at: new Date().toISOString(),
            };
            await setDoc(userDocRef, newUserData);
            setUserData(newUserData);
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

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setIsLoginModalOpen(false);
    } catch (error) {
      console.error("Error signing in with Google", error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUserData(null);
  };

  const decrementCredits = async () => {
    if (!user || !userData) return false;
    if (userData.plan_type === 'Pro' || userData.plan_type === 'Annual') return true;
    if (userData.credits_remaining <= 0) return false;

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

  const refreshUserData = async () => {
    if (!user) return;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUserData(userDoc.data() as UserData);
      }
    } catch (error) {
      console.error("Error refreshing user data", error);
    }
  };

  const activateSubscription = async (plan: 'Starter' | 'Pro' | 'Annual') => {
    if (!user) return;
    
    let credits_remaining = 0;
    
    if (plan === 'Starter') {
      credits_remaining = 30;
    } else if (plan === 'Pro' || plan === 'Annual') {
      credits_remaining = 999999;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        plan_type: plan,
        credits_remaining
      });
      await refreshUserData();
    } catch (error) {
      console.error("Error activating subscription", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userData,
      loading,
      isAuthReady,
      isLoginModalOpen,
      openLoginModal: () => setIsLoginModalOpen(true),
      closeLoginModal: () => setIsLoginModalOpen(false),
      signInWithGoogle,
      logout,
      decrementCredits,
      refreshUserData,
      activateSubscription
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
