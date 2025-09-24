import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Move } from 'lucide-react';
import type { Component } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../utils/cn';

interface CanvasComponentProps {
  component: Component;
  isSelected: boolean;
}

export const CanvasComponent: React.FC<CanvasComponentProps> = ({ 
  component, 
  isSelected 
}) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const { updateComponent, removeComponent, setSelectedComponent } = useAppStore();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedComponent(component);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeComponent(component.id);
  };

  const renderComponent = () => {
    const baseClasses = "relative transition-all duration-300";
    
    switch (component.type) {
      case 'text':
        return (
          <div 
            className={cn(
              baseClasses, 
              `text-${component.properties.fontSize || 'base'}`, 
              `text-${component.properties.color || 'gray-800'}`,
              'glass-card p-3 rounded-xl'
            )}
            style={{ padding: component.properties.padding || '12px' }}
          >
            {component.properties.text || 'Sample Text'}
          </div>
        );
      
      case 'button':
        return (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              baseClasses,
              `bg-${component.properties.backgroundColor || 'blue-500'}`,
              'text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium'
            )}
            style={{ 
              padding: component.properties.padding || '8px 16px',
              borderRadius: component.properties.borderRadius || '12px'
            }}
          >
            {component.properties.text || 'Button'}
          </motion.button>
        );
      
      case 'input':
        return (
          <input
            type="text"
            placeholder={component.properties.placeholder || 'Enter text'}
            className={cn(
              baseClasses,
              'glass-card border border-white/30 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:glow-purple w-full text-gray-800 placeholder-gray-500'
            )}
            style={{ 
              padding: component.properties.padding || '8px 12px',
              borderRadius: component.properties.borderRadius || '12px'
            }}
          />
        );
      
      case 'card':
        return (
          <div 
            className={cn(
              baseClasses,
              'glass-card rounded-2xl p-6 border border-white/30 shadow-xl'
            )}
            style={{ 
              padding: component.properties.padding || '24px',
              borderRadius: component.properties.borderRadius || '16px'
            }}
          >
            <div className="text-gray-800">
              {component.properties.text || 'Card Content'}
            </div>
          </div>
        );
      
      case 'image':
        return (
          <div className="glass-card p-2 rounded-xl">
            <img
              src={component.properties.src || 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'}
              alt={component.properties.alt || 'Image'}
              className={cn(baseClasses, 'rounded-lg object-cover w-full h-full')}
              style={{ 
                borderRadius: component.properties.borderRadius || '8px'
              }}
            />
          </div>
        );
      
      default:
        return (
          <div className={cn(baseClasses, 'glass border-2 border-dashed border-white/30 rounded-xl p-4 text-gray-600')}>
            {component.type}
          </div>
        );
    }
  };

  return (
    <motion.div
      ref={componentRef}
      data-component-id={component.id}
      initial={{ scale: 0, opacity: 0, rotate: -5 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      exit={{ scale: 0, opacity: 0, rotate: 5 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={cn(
        'absolute cursor-pointer group',
        isSelected ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-transparent glow-purple' : ''
      )}
      style={{
        left: component.position.x,
        top: component.position.y,
        width: component.size.width,
        height: component.size.height,
      }}
      onClick={handleClick}
    >
      {renderComponent()}
      
      {isSelected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -5 }}
          className="absolute -top-12 left-0 glass-strong text-white px-3 py-2 rounded-lg text-xs flex items-center space-x-2 shadow-xl"
        >
          <Move className="w-3 h-3" />
          <span className="capitalize">{component.type}</span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
            className="text-red-400 hover:text-red-300 ml-1"
          >
            <Trash2 className="w-3 h-3" />
          </motion.button>
        </motion.div>
      )}
      
      {/* Resize handles for selected component */}
      {isSelected && (
        <>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full cursor-se-resize shadow-lg"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.05 }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full cursor-ne-resize shadow-lg"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full cursor-sw-resize shadow-lg"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15 }}
            className="absolute -top-1 -left-1 w-3 h-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full cursor-nw-resize shadow-lg"
          />
        </>
      )}
    </motion.div>
  );
};