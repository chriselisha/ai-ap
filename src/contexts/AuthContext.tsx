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
  uid: string;
  email: string;
  displayName: string;
  plan: 'free' | 'starter' | 'pro' | 'annual';
  credits: number;
  maxCredits: number;
  subscriptionStatus: string;
  createdAt: string;
  updatedAt: string;
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
  activateSubscription: (plan: 'starter' | 'pro' | 'annual') => Promise<void>;
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
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || '',
              plan: 'free',
              credits: 3,
              maxCredits: 3,
              subscriptionStatus: 'none',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
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
    if (userData.plan === 'pro' || userData.plan === 'annual') return true;
    if (userData.credits <= 0) return false;

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        credits: increment(-1),
        updatedAt: new Date().toISOString()
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

  const activateSubscription = async (plan: 'starter' | 'pro' | 'annual') => {
    if (!user) return;
    
    let credits = 0;
    let maxCredits = 0;
    
    if (plan === 'starter') {
      credits = 30;
      maxCredits = 30;
    } else if (plan === 'pro' || plan === 'annual') {
      credits = 999999;
      maxCredits = 999999;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        plan,
        credits,
        maxCredits,
        subscriptionStatus: 'active',
        updatedAt: new Date().toISOString()
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
