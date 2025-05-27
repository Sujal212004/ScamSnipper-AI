import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Search, AlertTriangle, MessageCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSniperAI } from '../../hooks/useSniperAI';

const SniperAIAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isReady } = useSniperAI();

  const menuItems = [
    {
      icon: <Search className="h-5 w-5" />,
      label: 'Scan for Scams',
      path: '/scanner',
      color: 'text-primary-600'
    },
    {
      icon: <AlertTriangle className="h-5 w-5" />,
      label: 'Report Suspicious Activity',
      path: '/heatmap',
      color: 'text-warning-600'
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      label: 'Ask SniperAI',
      path: '/voice-detector',
      color: 'text-accent-600'
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden w-64"
          >
            <div className="p-2">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span className={item.color}>{item.icon}</span>
                  <span className="text-gray-700 font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg ${
          isOpen ? 'bg-primary-600' : 'bg-white'
        } transition-colors hover:scale-105 transform`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <X className={`h-6 w-6 text-white`} />
        ) : (
          <Shield className={`h-6 w-6 ${isReady ? 'text-primary-600' : 'text-gray-400'}`} />
        )}
      </motion.button>
    </div>
  );
};

export default SniperAIAgent;