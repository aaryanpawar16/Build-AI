import React from 'react';
import { motion } from 'framer-motion';
import { Layout, Server, Database, Eye } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../utils/cn';

const tabs = [
  { id: 'frontend', label: 'Frontend', icon: Layout },
  { id: 'backend', label: 'Backend', icon: Server },
  { id: 'database', label: 'Database', icon: Database },
  { id: 'preview', label: 'Preview', icon: Eye },
] as const;

export const TabNavigation: React.FC = () => {
  const { activeTab, setActiveTab } = useAppStore();

  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="h-10 md:h-12 glass-card border-b border-white/20 flex items-center px-3 md:px-6 backdrop-blur-md overflow-x-auto"
    >
      <div className="flex space-x-1 min-w-max">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'relative flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-300 whitespace-nowrap',
                isActive
                  ? 'text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/20'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <div className="relative z-10 flex items-center space-x-1 md:space-x-2">
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline md:inline">{tab.label}</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};