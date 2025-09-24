import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/Layout/Header';
import { TabNavigation } from '../components/Navigation/TabNavigation';
import { ComponentsLibrary } from '../components/Layout/Sidebar';
import { Canvas } from '../components/Canvas/Canvas';
import { PropertiesPanel } from '../components/Properties/PropertiesPanel';
import { LogicFlowEditor } from '../components/Backend/LogicFlowEditor';
import { DatabaseBuilder } from '../components/Database/DatabaseBuilder';
import { PreviewPanel } from '../components/Preview/PreviewPanel';
import { AIAssistant } from '../components/AI/AIAssistant';
import { useAppStore } from '../store/useAppStore';

export const Builder: React.FC = () => {
  const { activeTab } = useAppStore();

  const renderContent = () => {
    const content = (() => {
      switch (activeTab) {
        case 'frontend':
          return (
            // No DndProvider needed - using HTML5 drag and drop directly
            <div className="flex h-full">
              <ComponentsLibrary />
              <Canvas />
              <PropertiesPanel />
            </div>
          );
        case 'backend':
          return <LogicFlowEditor />;
        case 'database':
          return <DatabaseBuilder />;
        case 'preview':
          return <PreviewPanel />;
        default:
          return (
            <div className="flex h-full">
              <ComponentsLibrary />
              <Canvas />
              <PropertiesPanel />
            </div>
          );
      }
    })();

    return (
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="flex-1 overflow-hidden"
      >
        {content}
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-screen flex flex-col"
    >
      <Header />
      <TabNavigation />
      {renderContent()}
      <AIAssistant />
    </motion.div>
  );
};