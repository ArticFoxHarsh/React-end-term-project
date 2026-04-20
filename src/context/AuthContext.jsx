/**
 * AuthContext.jsx
 * 
 * Provides authentication state to the entire application.
 * Wraps Firebase's onAuthStateChanged to expose user data and loading state.
 * 
 * Usage:
 *   const { user, loading, logout } = useContext(AuthContext);
 */

import React, { createContext, useEffect, useState } from 'react';
import { auth } from '../services/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';

/**
 * AuthContext
 * 
 * Context value shape:
 * {
 *   user: FirebaseUser | null,     // Authenticated user object or null
 *   loading: boolean,               // True while checking auth state
 *   logout: () => Promise<void>    // Function to sign out user
 * }
 */
const AuthContext = createContext();

/**
 * AuthProvider Component
 * 
 * Wraps the application and manages authentication state.
 * Must be placed at or near the root of the component tree.
 * 
 * Props:
 *   children: React components to render
 * 
 * Example:
 *   <AuthProvider>
 *     <App />
 *   </AuthProvider>
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Subscribe to Firebase auth state changes on mount
   * This listener runs on app startup and whenever auth state changes
   */
  useEffect(() => {
    // Subscribe to Firebase auth state changes using modular API
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      },
      (error) => {
        console.error('Auth state change error:', error);
        setLoading(false);
      }
    );

    // Cleanup: unsubscribe when component unmounts
    return () => unsubscribe();
  }, []);

  /**
   * Logout Handler
   * Signs out the current user from Firebase
   * 
   * Throws:
   *   Firebase auth errors if signOut fails
   */
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
