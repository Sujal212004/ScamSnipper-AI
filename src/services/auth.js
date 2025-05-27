import { BADGES } from '../utils/constants';
import { generateId } from '../utils/helpers';

// Mock Firebase auth service for demo purposes
// In a real app, this would use actual Firebase authentication

// Store user data in localStorage to persist across sessions
const USER_STORAGE_KEY = 'scamsniper_user';

// Initialize user data
const initializeUser = () => {
  // Check if user exists in localStorage
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);
  if (storedUser) {
    return JSON.parse(storedUser);
  }
  return null;
};

// Get current user
export const getCurrentUser = () => {
  return initializeUser();
};

// Sign up new user
export const signUp = async (email, password, name) => {
  try {
    // In a real app, this would call Firebase Auth
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Create new user object
    const newUser = {
      uid: generateId(),
      email,
      name,
      photoURL: null,
      createdAt: new Date().toISOString(),
      points: 10,
      scansCompleted: 0,
      reportsSubmitted: 0,
      badges: [BADGES.NEWCOMER],
      phoneNumber: null,
      preferences: {
        notifications: true,
        smsAlerts: false,
        darkMode: false
      }
    };
    
    // Save to localStorage
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    
    return { user: newUser, success: true };
  } catch (error) {
    console.error('Sign up error:', error);
    throw new Error('Failed to create account. Please try again.');
  }
};

// Sign in existing user
export const signIn = async (email, password) => {
  try {
    // In a real app, this would call Firebase Auth
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // For demo purposes, we'll create a mock user if not exists
    const existingUser = getCurrentUser();
    
    if (existingUser && existingUser.email === email) {
      return { user: existingUser, success: true };
    }
    
    // Create a demo user for testing
    const demoUser = {
      uid: generateId(),
      email,
      name: email.split('@')[0],
      photoURL: null,
      createdAt: new Date().toISOString(),
      points: 75,
      scansCompleted: 3,
      reportsSubmitted: 1,
      badges: [BADGES.NEWCOMER, BADGES.FIRST_SCAN],
      phoneNumber: null,
      preferences: {
        notifications: true,
        smsAlerts: false,
        darkMode: false
      }
    };
    
    // Save to localStorage
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(demoUser));
    
    return { user: demoUser, success: true };
  } catch (error) {
    console.error('Sign in error:', error);
    throw new Error('Failed to sign in. Please check your credentials and try again.');
  }
};

// Sign out user
export const signOut = async () => {
  try {
    // In a real app, this would call Firebase Auth signOut
    // Clear user from localStorage
    localStorage.removeItem(USER_STORAGE_KEY);
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    throw new Error('Failed to sign out. Please try again.');
  }
};

// Update user profile
export const updateUserProfile = async (updates) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('No user signed in');
    }
    
    // Update user object
    const updatedUser = {
      ...currentUser,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    
    return { user: updatedUser, success: true };
  } catch (error) {
    console.error('Update profile error:', error);
    throw new Error('Failed to update profile. Please try again.');
  }
};

// Add points to user
export const addUserPoints = async (points, reason) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('No user signed in');
    }
    
    // Update points
    const updatedUser = {
      ...currentUser,
      points: currentUser.points + points,
      pointsHistory: [
        ...(currentUser.pointsHistory || []),
        {
          amount: points,
          reason,
          timestamp: new Date().toISOString()
        }
      ]
    };
    
    // Save to localStorage
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    
    return { user: updatedUser, success: true };
  } catch (error) {
    console.error('Add points error:', error);
    throw new Error('Failed to add points. Please try again.');
  }
};

// Award badge to user
export const awardBadge = async (badgeId) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('No user signed in');
    }
    
    // Check if user already has this badge
    if (currentUser.badges && currentUser.badges.some(badge => badge.id === badgeId)) {
      return { user: currentUser, success: true, alreadyAwarded: true };
    }
    
    // Get badge details
    const badge = BADGES[badgeId.toUpperCase()];
    if (!badge) {
      throw new Error('Invalid badge ID');
    }
    
    // Add badge and points
    const updatedUser = {
      ...currentUser,
      badges: [...(currentUser.badges || []), badge],
      points: currentUser.points + badge.points
    };
    
    // Save to localStorage
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    
    return { 
      user: updatedUser, 
      success: true, 
      badge,
      pointsAwarded: badge.points
    };
  } catch (error) {
    console.error('Award badge error:', error);
    throw new Error('Failed to award badge. Please try again.');
  }
};