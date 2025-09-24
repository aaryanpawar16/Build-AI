import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { LandingPage } from './pages/LandingPage';
import { Builder } from './pages/Builder';
import { useAppStore } from './store/useAppStore';
import { ParticleBackground } from './components/Effects/ParticleBackground';

function App() {
  const { setCurrentProject } = useAppStore();

  useEffect(() => {
    // Initialize with a demo project
    setCurrentProject({
      name: 'My First App',
      components: [],
      logicBlocks: [],
      databaseTables: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }, [setCurrentProject]);

  return (
    <Router>
      <div className="App min-h-screen gradient-purple-blue">
        <ParticleBackground />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/builder" element={<Builder />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;