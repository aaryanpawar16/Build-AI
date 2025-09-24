import React from 'react';
import { motion } from 'framer-motion';
import { Type, Square, MousePointer, Image, Grid, List, FormInput as Form, Navigation, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store/useAppStore';

interface DraggableComponentProps {
  type: string;
  icon: React.ReactNode;
  label: string;
  index: number;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({ type, icon, label, index }) => {
  // Handle drag start - set the component type being dragged
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ componentType: type }));
    e.dataTransfer.effectAllowed = 'copy';
    
    // Visual feedback during drag
    const target = e.target as HTMLElement;
    target.style.opacity = '0.5';
  };

  // Reset visual feedback when drag ends
  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    target.style.opacity = '1';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.02, x: 5 }}
      whileTap={{ scale: 0.98 }}
      draggable={true} // Make the component draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="flex items-center space-x-3 p-3 rounded-xl cursor-grab active:cursor-grabbing glass border border-white/20 hover:glow-blue hover:bg-white/20 transition-all duration-300 select-none"
      style={{
        userSelect: 'none', // Prevent text selection
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
      }}
    >
      <div className="text-gray-700 group-hover:text-purple-600 transition-colors pointer-events-none">
        {icon}
      </div>
      <span className="text-sm font-medium text-gray-800 pointer-events-none">
        {label}
      </span>
    </motion.div>
  );
};

export const ComponentsLibrary: React.FC = () => {
  const { setAIAssistantOpen } = useAppStore();
  
  const components = [
    { type: 'text', icon: <Type className="w-4 h-4" />, label: 'Text' },
    { type: 'button', icon: <MousePointer className="w-4 h-4" />, label: 'Button' },
    { type: 'input', icon: <Square className="w-4 h-4" />, label: 'Input' },
    { type: 'card', icon: <Square className="w-4 h-4" />, label: 'Card' },
    { type: 'navbar', icon: <Navigation className="w-4 h-4" />, label: 'Navbar' },
    { type: 'form', icon: <Form className="w-4 h-4" />, label: 'Form' },
    { type: 'grid', icon: <Grid className="w-4 h-4" />, label: 'Grid' },
    { type: 'image', icon: <Image className="w-4 h-4" />, label: 'Image' },
  ];

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-48 md:w-56 lg:w-64 glass-card border-r border-white/20 p-3 md:p-4 overflow-y-auto backdrop-blur-md"
    >
      <Card variant="glass" className="border-white/30">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center space-x-2 text-sm md:text-base">
            <Grid className="w-5 h-5 text-purple-600" />
            <span>Components</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* AI Assistant Button */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Button
              onClick={() => setAIAssistantOpen(true)}
              className="w-full flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-sm md:text-base"
            >
              <Zap className="w-4 h-4" />
              <span className="hidden md:inline">AI Assistant</span>
              <span className="md:hidden">AI</span>
            </Button>
          </motion.div>
          
          <div className="flex items-center space-x-3 text-gray-500 mb-4 text-xs">
            <div className="h-px bg-gray-300 flex-1"></div>
            <span className="font-medium whitespace-nowrap">DRAG & DROP</span>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>
          
          <div className="space-y-2">
            {components.map((component, index) => (
              <DraggableComponent
                key={component.type}
                type={component.type}
                icon={component.icon}
                label={component.label}
                index={index}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};