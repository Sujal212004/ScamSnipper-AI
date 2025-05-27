import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, Bell, Award, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from './common/Button';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  
  // Navigation links
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Scanner', path: '/scanner' },
    { name: 'Heatmap', path: '/heatmap' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];
  
  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Close mobile menu
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      closeMenu();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  return (
    <nav className="bg-white dark:bg-dark-bg shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center" onClick={closeMenu}>
              <Shield className="h-8 w-8 text-primary-600 dark:text-dark-accent" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-dark-text">ScamSnipper AI</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <div className="flex space-x-4">
              {navLinks.map(link => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === link.path
                      ? 'text-primary-600 dark:text-dark-accent bg-primary-50 dark:bg-dark-card'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-dark-accent hover:bg-gray-50 dark:hover:bg-dark-card'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            {/* Theme toggle */}
            <ThemeToggle />
            
            {/* Auth buttons */}
            <div className="ml-4 flex items-center">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  {/* Notifications */}
                  <button className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-dark-accent focus:outline-none">
                    <Bell className="h-6 w-6" />
                  </button>
                  
                  {/* User menu */}
                  <div className="relative">
                    <Link to="/profile" className="flex items-center">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 dark:bg-dark-card text-primary-600 dark:text-dark-accent">
                        <User className="h-5 w-5" />
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {currentUser?.name || currentUser?.email?.split('@')[0]}
                      </span>
                    </Link>
                  </div>
                  
                  {/* Logout button */}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="space-x-2">
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-dark-accent hover:bg-gray-100 dark:hover:bg-dark-card focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 px-4">
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === link.path
                    ? 'text-primary-600 dark:text-dark-accent bg-primary-50 dark:bg-dark-card'
                    : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-dark-accent hover:bg-gray-50 dark:hover:bg-dark-card'
                }`}
                onClick={closeMenu}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          {/* Mobile auth section */}
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-dark-border">
            {isAuthenticated ? (
              <div className="px-4 space-y-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-dark-card flex items-center justify-center">
                      <User className="h-6 w-6 text-primary-600 dark:text-dark-accent" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800 dark:text-dark-text">
                      {currentUser?.name || currentUser?.email?.split('@')[0]}
                    </div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {currentUser?.email}
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <Link
                    to="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-dark-accent hover:bg-gray-50 dark:hover:bg-dark-card"
                    onClick={closeMenu}
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-dark-accent hover:bg-gray-50 dark:hover:bg-dark-card"
                    onClick={closeMenu}
                  >
                    Dashboard
                  </Link>
                  <button
                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-dark-accent hover:bg-gray-50 dark:hover:bg-dark-card"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-4 flex flex-col space-y-2">
                <Link
                  to="/login"
                  className="block w-full px-4 py-2 text-center text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-card border border-gray-300 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-bg"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block w-full px-4 py-2 text-center text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-dark-accent dark:hover:bg-dark-highlight"
                  onClick={closeMenu}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;