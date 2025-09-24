import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, CheckCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'info' | 'success';
  isVisible: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'info', 
  isVisible, 
  onClose 
}) => {
  const icons = {
    info: <Info className="w-5 h-5 text-blue-400" />,
    success: <CheckCircle className="w-5 h-5 text-green-400" />
  };

  const colors = {
    info: 'from-blue-500/20 to-purple-500/20 border-blue-400/30',
    success: 'from-green-500/20 to-emerald-500/20 border-green-400/30'
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className={`glass-strong border rounded-xl p-4 shadow-2xl bg-gradient-to-r ${colors[type]} max-w-sm mx-auto`}>
            <div className="flex items-center space-x-3">
              {icons[type]}
              <p className="text-white font-medium text-sm flex-1">
                {message}
              </p>
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};