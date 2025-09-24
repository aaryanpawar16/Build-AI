import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store/useAppStore';
import { Palette, Type, Move, Trash2, Settings } from 'lucide-react';

export const PropertiesPanel: React.FC = () => {
  const { selectedComponent, updateComponent, removeComponent, setSelectedComponent } = useAppStore();

  if (!selectedComponent) {
    return (
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-64 glass-card border-l border-white/20 p-4 backdrop-blur-md"
      >
        <Card variant="glass" className="border-white/30">
          <CardContent>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center text-white/70 py-8"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Palette className="w-8 h-8 mx-auto mb-3 text-purple-300" />
              </motion.div>
              <p className="text-sm">Select a component to edit its properties</p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const handlePropertyChange = (property: string, value: string) => {
    updateComponent(selectedComponent.id, {
      properties: {
        ...selectedComponent.properties,
        [property]: value
      }
    });
  };

  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    updateComponent(selectedComponent.id, {
      position: {
        ...selectedComponent.position,
        [axis]: value
      }
    });
  };

  const handleSizeChange = (dimension: 'width' | 'height', value: number) => {
    updateComponent(selectedComponent.id, {
      size: {
        ...selectedComponent.size,
        [dimension]: value
      }
    });
  };

  const handleDelete = () => {
    removeComponent(selectedComponent.id);
    setSelectedComponent(null);
  };

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-48 md:w-56 lg:w-64 glass-card border-l border-white/20 p-3 md:p-4 overflow-y-auto backdrop-blur-md"
    >
      <Card variant="glass" className="border-white/30">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-gray-800 text-sm md:text-base">
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-purple-600" />
              <span className="capitalize hidden md:inline">{selectedComponent.type} Properties</span>
              <span className="capitalize md:hidden">{selectedComponent.type}</span>
            </div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="sm" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </motion.div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-3 md:space-y-4">
          {/* Text Content */}
          {(selectedComponent.type === 'text' || selectedComponent.type === 'button' || selectedComponent.type === 'card') && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Text</label>
              <input
                type="text"
                value={selectedComponent.properties.text || ''}
                onChange={(e) => handlePropertyChange('text', e.target.value)}
                className="w-full px-2 md:px-3 py-2 glass border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 placeholder-gray-500 text-sm"
              />
            </motion.div>
          )}

          {/* Input Placeholder */}
          {selectedComponent.type === 'input' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Placeholder</label>
              <input
                type="text"
                value={selectedComponent.properties.placeholder || ''}
                onChange={(e) => handlePropertyChange('placeholder', e.target.value)}
                className="w-full px-2 md:px-3 py-2 glass border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 placeholder-gray-500 text-sm"
              />
            </motion.div>
          )}

          {/* Image Source */}
          {selectedComponent.type === 'image' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="url"
                value={selectedComponent.properties.src || ''}
                onChange={(e) => handlePropertyChange('src', e.target.value)}
                className="w-full px-2 md:px-3 py-2 glass border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 placeholder-gray-500 text-sm"
                placeholder="https://example.com/image.jpg"
              />
            </motion.div>
          )}

          {/* Colors */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3"
          >
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Text Color</label>
              <select
                value={selectedComponent.properties.color || 'gray-800'}
                onChange={(e) => handlePropertyChange('color', e.target.value)}
                className="w-full px-2 md:px-3 py-2 glass border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 text-sm"
              >
                <option value="gray-800">Gray</option>
                <option value="blue-600">Blue</option>
                <option value="red-600">Red</option>
                <option value="green-600">Green</option>
                <option value="purple-600">Purple</option>
                <option value="yellow-600">Yellow</option>
              </select>
            </div>

            {selectedComponent.type === 'button' && (
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Background</label>
                <select
                  value={selectedComponent.properties.backgroundColor || 'blue-500'}
                  onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
                  className="w-full px-2 md:px-3 py-2 glass border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 text-sm"
                >
                  <option value="blue-500">Blue</option>
                  <option value="red-500">Red</option>
                  <option value="green-500">Green</option>
                  <option value="purple-500">Purple</option>
                  <option value="gray-500">Gray</option>
                  <option value="yellow-500">Yellow</option>
                </select>
              </div>
            )}
          </motion.div>

          {/* Typography */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Font Size</label>
            <select
              value={selectedComponent.properties.fontSize || 'base'}
              onChange={(e) => handlePropertyChange('fontSize', e.target.value)}
              className="w-full px-2 md:px-3 py-2 glass border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 text-sm"
            >
              <option value="xs">Extra Small</option>
              <option value="sm">Small</option>
              <option value="base">Base</option>
              <option value="lg">Large</option>
              <option value="xl">Extra Large</option>
              <option value="2xl">2X Large</option>
            </select>
          </motion.div>

          {/* Position */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="border-t border-white/20 pt-4"
          >
            <h4 className="text-xs md:text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Move className="w-4 h-4 mr-1 text-purple-600" />
              <span className="hidden md:inline">Position & Size</span>
              <span className="md:hidden">Pos & Size</span>
            </h4>
            
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">X</label>
                <input
                  type="number"
                  value={selectedComponent.position.x}
                  onChange={(e) => handlePositionChange('x', parseInt(e.target.value) || 0)}
                  className="w-full px-2 py-1 text-xs md:text-sm glass border border-white/30 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Y</label>
                <input
                  type="number"
                  value={selectedComponent.position.y}
                  onChange={(e) => handlePositionChange('y', parseInt(e.target.value) || 0)}
                  className="w-full px-2 py-1 text-xs md:text-sm glass border border-white/30 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-gray-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Width</label>
                <input
                  type="number"
                  value={selectedComponent.size.width}
                  onChange={(e) => handleSizeChange('width', parseInt(e.target.value) || 0)}
                  className="w-full px-2 py-1 text-xs md:text-sm glass border border-white/30 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Height</label>
                <input
                  type="number"
                  value={selectedComponent.size.height}
                  onChange={(e) => handleSizeChange('height', parseInt(e.target.value) || 0)}
                  className="w-full px-2 py-1 text-xs md:text-sm glass border border-white/30 rounded focus:outline-none focus:ring-1 focus:ring-purple-500 text-gray-800"
                />
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};