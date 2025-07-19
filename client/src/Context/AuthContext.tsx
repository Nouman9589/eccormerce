import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth, db } from '../firebase/Firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
  avatar?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to safely convert different date formats
  const safeToDate = (dateValue: unknown): Date => {
    if (!dateValue) return new Date();
    
    // If it's already a Date object
    if (dateValue instanceof Date) return dateValue;
    
    // If it has toDate method (Firestore Timestamp)
    if (typeof dateValue === 'object' && dateValue !== null && 'toDate' in dateValue) {
      try {
        return (dateValue as { toDate: () => Date }).toDate();
      } catch {
        return new Date();
      }
    }
    
    // If it's a string or number, try to parse it
    if (typeof dateValue === 'string' || typeof dateValue === 'number') {
      const parsedDate = new Date(dateValue);
      return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
    }
    
    // If it's an object with seconds property (Firestore server timestamp format)
    if (typeof dateValue === 'object' && dateValue !== null && 'seconds' in dateValue) {
      try {
        const timestamp = dateValue as { seconds: number; nanoseconds?: number };
        return new Date(timestamp.seconds * 1000);
      } catch {
        return new Date();
      }
    }
    
    return new Date();
  };

  // Initialize auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get additional user data from Firestore
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          const userData = userDoc.data();
          
          // Determine role - check email for admin privileges
          const shouldBeAdmin = firebaseUser.email?.toLowerCase().includes('admin') || false;
          const currentRole = userData?.role;
          
          // If user doesn't exist in Firestore or role needs updating
          if (!userDoc.exists() || (shouldBeAdmin && currentRole !== 'admin')) {
            // Generate proper name for admin users
            let userName = userData?.name || firebaseUser.displayName || '';
            if (!userName || userName === 'User') {
              if (shouldBeAdmin) {
                userName = 'Admin User';
              } else {
                userName = firebaseUser.email?.split('@')[0] || 'User';
              }
            }
            
            const newUserData = {
              email: firebaseUser.email || '',
              name: userName,
              role: shouldBeAdmin ? 'admin' : 'customer',
              avatar: userData?.avatar || firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${userName}&background=random`,
              phone: userData?.phone || '',
              address: userData?.address || {
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: ''
              },
              createdAt: userData?.createdAt || serverTimestamp()
            };
            
            // Update/create user document with correct role
            await setDoc(userDocRef, newUserData, { merge: true });
          }
          
          // Create user object for state
          // Ensure consistent name display
          let displayName = userData?.name || firebaseUser.displayName || '';
          if (!displayName || displayName === 'User') {
            if (shouldBeAdmin) {
              displayName = 'Admin User';
            } else {
              displayName = firebaseUser.email?.split('@')[0] || 'User';
            }
          }
          
          const user: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email!,
            name: displayName,
            role: shouldBeAdmin ? 'admin' : (userData?.role || 'customer'),
            avatar: userData?.avatar || firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${displayName}&background=random`,
            phone: userData?.phone,
            address: userData?.address,
            createdAt: safeToDate(userData?.createdAt),
          };
          
          setUser(user);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // User state will be updated by onAuthStateChanged listener
    } catch (error: unknown) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed';
      
      const firebaseError = error as { code?: string; message?: string };
      switch (firebaseError.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later';
          break;
        default:
          errorMessage = firebaseError.message || 'Login failed';
      }
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    setLoading(true);
    try {
      if (userData.password !== userData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (userData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );

      // Update the user's display name
      await updateProfile(userCredential.user, {
        displayName: userData.name
      });

      // Save additional user data to Firestore
      const userDoc = {
        name: userData.name,
        email: userData.email,
        role: userData.email.includes('admin') ? 'admin' : 'customer',
        avatar: `https://ui-avatars.com/api/?name=${userData.name}&background=random`,
        createdAt: serverTimestamp(),
        phone: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userDoc);

      // User state will be updated by onAuthStateChanged listener
    } catch (error: unknown) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed';
      
      const firebaseError = error as { code?: string; message?: string };
      switch (firebaseError.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password accounts are not enabled';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak';
          break;
        default:
          errorMessage = firebaseError.message || 'Registration failed';
      }
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      
      // Check if user document exists, create if not
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
          // Create user document for new Google users
          const userData = {
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || '',
            role: (firebaseUser.email?.includes('admin') ? 'admin' : 'customer') as 'admin' | 'customer',
            avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.displayName || firebaseUser.email}&background=random`,
            phone: '',
            address: {
              street: '',
              city: '',
              state: '',
              zipCode: '',
              country: ''
            },
            createdAt: serverTimestamp()
          };
          
          await setDoc(userDocRef, userData);
        }
      }
      
      // User state will be updated by onAuthStateChanged listener
    } catch (error: unknown) {
      console.error('Google sign-in error:', error);
      let errorMessage = 'Google sign-in failed';
      
      const firebaseError = error as { code?: string; message?: string };
      switch (firebaseError.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Google sign-in cancelled by user';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Google sign-in popup was blocked by your browser';
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = 'Google sign-in was cancelled';
          break;
        default:
          errorMessage = firebaseError.message || 'Google sign-in failed';
      }
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      // User state will be updated by onAuthStateChanged listener
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const updateUserProfile = async (userData: Partial<User>): Promise<void> => {
    if (!user) return;

    try {
      // Update in Firestore
      await setDoc(doc(db, 'users', user.id), userData, { merge: true });
      
      // Update local state
      setUser(prev => prev ? { ...prev, ...userData } : null);
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    signInWithGoogle,
    logout,
    updateProfile: updateUserProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 