import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser, signIn, signUp, signOut, updateUserProfile } from '../services/auth';

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state
  useEffect(() => {
    // Check if user is already logged in
    const user = getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  // Sign up function
  const register = async (email, password, name) => {
    setError(null);
    setLoading(true);
    try {
      const result = await signUp(email, password, name);
      setCurrentUser(result.user);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign in function
  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const result = await signIn(email, password);
      setCurrentUser(result.user);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const logout = async () => {
    setError(null);
    setLoading(true);
    try {
      await signOut();
      setCurrentUser(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    setError(null);
    setLoading(true);
    try {
      const result = await updateUserProfile(updates);
      setCurrentUser(result.user);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;