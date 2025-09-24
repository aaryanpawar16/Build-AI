import React, { useCallback, useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { Grid } from 'lucide-react';
import type { Component } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { CanvasComponent } from './CanvasComponent';
import { generateFrontendCode } from '../../utils/codeGenerators';

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const { 
    components, 
    addComponent, 
    selectedComponent, 
    setSelectedComponent,
    updateGeneratedCode,
    user,
    saveProject
  } = useAppStore();

  // Auto-generate and store code when components change
  useEffect(() => {
    const frontendCode = generateFrontendCode(components);
    updateGeneratedCode('frontend', frontendCode);
    
    // Auto-save if user is logged in
    if (user && components.length > 0) {
      const timeoutId = setTimeout(() => {
        saveProject();
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [components, updateGeneratedCode, user, saveProject]);

  // Handle drag over - CRITICAL: must prevent default to allow drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Essential for drop to work
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  // Handle drag leave - remove visual feedback
  const handleDragLeave = (e: React.DragEvent) => {
    // Only remove feedback if leaving the canvas entirely
    if (!canvasRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  // Handle drop - create new component
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    try {
      // Get the dragged component data
      const dragData = e.dataTransfer.getData('application/json');
      const { componentType } = JSON.parse(dragData);

      if (!componentType || !canvasRef.current) return;

      // Calculate drop position relative to canvas
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const x = Math.max(0, e.clientX - canvasRect.left - 60); // Offset for better positioning
      const y = Math.max(0, e.clientY - canvasRect.top - 20);

      // Create new component with default properties
      const newComponent: Component = {
        id: `${componentType}-${Date.now()}`,
        type: componentType as any,
        position: { x, y },
        size: getDefaultSize(componentType),
        properties: getDefaultProperties(componentType)
      };

      // Add component to state
      addComponent(newComponent);

      // Animate the new component entrance
      setTimeout(() => {
        const element = document.querySelector(`[data-component-id="${newComponent.id}"]`);
        if (element) {
          gsap.fromTo(element, 
            { scale: 0, opacity: 0, rotation: -10 },
            { scale: 1, opacity: 1, rotation: 0, duration: 0.5, ease: 'back.out(1.7)' }
          );
        }
      }, 50);

    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  // Get default size for each component type
  const getDefaultSize = (type: string) => {
    switch (type) {
      case 'input':
        return { width: 200, height: 45 };
      case 'card':
        return { width: 250, height: 150 };
      case 'button':
        return { width: 120, height: 40 };
      case 'image':
        return { width: 200, height: 150 };
      default:
        return { width: 120, height: 40 };
    }
  };

  // Get default properties for each component type
  const getDefaultProperties = (type: string) => {
    switch (type) {
      case 'text':
        return {
          text: 'Sample Text',
          color: 'gray-800',
          fontSize: 'base'
        };
      case 'button':
        return {
          text: 'Click Me',
          backgroundColor: 'blue-500',
          color: 'white'
        };
      case 'input':
        return {
          placeholder: 'Enter text here',
          color: 'gray-800'
        };
      case 'card':
        return {
          text: 'Card Content',
          color: 'gray-800'
        };
      case 'image':
        return {
          src: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
          alt: 'Image'
        };
      default:
        return {
          text: 'Content',
          color: 'gray-800'
        };
    }
  };

  // Handle canvas click - deselect component when clicking empty area
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedComponent(null);
    }
  };

  // Update drag over visual feedback with GSAP
  useEffect(() => {
    if (isDragOver && canvasRef.current) {
      gsap.to(canvasRef.current, {
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        duration: 0.3,
        ease: 'power2.out'
      });
    } else if (canvasRef.current) {
      gsap.to(canvasRef.current, {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }, [isDragOver]);

  return (
    <div className="flex-1 relative overflow-hidden">
      <div
        ref={canvasRef}
        className="h-full w-full relative glass transition-all duration-300"
        onClick={handleCanvasClick}
        onDragOver={handleDragOver} // Allow drag over
        onDragLeave={handleDragLeave} // Handle drag leave
        onDrop={handleDrop} // Handle drop
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }}
      >
        {/* Drop zone visual feedback */}
        {isDragOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 border-2 border-dashed border-purple-400 rounded-2xl glass-strong flex items-center justify-center"
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-purple-300 font-medium flex items-center space-x-2"
            >
              <Grid className="w-5 h-5" />
              <span>Drop component here</span>
            </motion.div>
          </motion.div>
        )}

        {/* Render all components */}
        <AnimatePresence>
          {components.map((component) => (
            <CanvasComponent
              key={component.id}
              component={component}
              isSelected={selectedComponent?.id === component.id}
            />
          ))}
        </AnimatePresence>

        {/* Empty state - only show when no components and not dragging */}
        {components.length === 0 && !isDragOver && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-center text-white/60">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-16 h-16 mx-auto mb-4 glass-strong rounded-full flex items-center justify-center"
              >
                <Grid className="w-8 h-8 text-purple-300" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};