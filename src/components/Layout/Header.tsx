import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Settings, Home, User, LogOut, FolderOpen, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store/useAppStore';
import { AuthModal } from '../Auth/AuthModal';
import { SupabaseService } from '../../services/supabaseService';
import { ProjectManager } from '../Projects/ProjectManager';
import { ProjectService, ProjectData } from '../../services/projectService';
import { Toast } from '../ui/Toast';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentProject, 
    setCurrentProject, 
    setAIAssistantOpen, 
    user, 
    setUser,
    components,
    logicBlocks,
    databaseTables,
    generatedCode
  } = useAppStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProjectManager, setShowProjectManager] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSupabaseToast, setShowSupabaseToast] = useState(false);

  const handleSignOut = async () => {
    await SupabaseService.signOut();
    setUser(null);
  };

  const saveCurrentProject = async () => {
    if (!user || !currentProject) return;

    setIsSaving(true);
    try {
      const projectData: ProjectData = {
        id: currentProject.id,
        name: currentProject.name,
        description: currentProject.description || '',
        components,
        logicBlocks,
        databaseTables,
        generatedCode
      };

      const { data, error } = await ProjectService.saveProject(projectData);
      if (error) {
        console.error('Error saving project:', error);
        alert('Failed to save project');
      } else {
        setCurrentProject(data);
        console.log('Project saved successfully:', data.name);
      }
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectProject = (project: ProjectData) => {
    // Load project with AI-generated code
    const { 
      loadProject, 
      setSelectedProject, 
      setActiveTab,
      setOpenedProjectCode,
      setOpenedProjectPreview 
    } = useAppStore.getState();
    
    loadProject({
      id: project.id!,
      name: project.name,
      description: project.description,
      components: project.components || [],
      logicBlocks: project.logicBlocks || [],
      databaseTables: project.databaseTables || [],
      generatedCode: project.generatedCode || {
        frontend: '',
        backend: '',
        database: ''
      },
      createdAt: new Date(project.createdAt!),
      updatedAt: new Date(project.updatedAt!)
    });
    
    // Set as selected project and load AI code
    setSelectedProject(project);
    const aiCode = project.generatedCode?.frontend || project.generated_code?.frontend || '';
    setOpenedProjectCode(aiCode);
    setOpenedProjectPreview(aiCode);
    
    // Switch to preview tab
    setActiveTab('preview');
  };

  const handleSupabaseClick = () => {
    setShowSupabaseToast(true);
    setTimeout(() => setShowSupabaseToast(false), 2000);
  };

  return (
    <>
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-14 md:h-16 glass-card border-b border-white/20 flex items-center justify-between px-3 md:px-6 shadow-lg backdrop-blur-md"
    >
      <div className="flex items-center space-x-4">
        <motion.div
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
            <Zap className="w-3 h-3 md:w-5 md:h-5 text-white" />
          </div>
          <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            BuildAI
          </h1>
        </motion.div>
        
        {currentProject && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xs md:text-sm text-gray-600 glass px-2 md:px-3 py-1 rounded-lg hidden sm:block"
          >
            Project: <span className="font-medium text-gray-800">{currentProject.name}</span>
          </motion.div>
        )}
      </div>

      <div className="flex items-center space-x-1 md:space-x-3">
        {user ? (
          <>
            <Button
              onClick={() => setShowProjectManager(true)}
              size="sm"
              variant="outline"
              className="flex items-center space-x-1 md:space-x-2 glass border-white/30 text-gray-700 hover:bg-white/20 text-sm"
            >
              <FolderOpen className="w-4 h-4" />
              <span className="hidden md:inline">Projects</span>
            </Button>
            
            {currentProject && (
              <div className="flex items-center space-x-1 md:space-x-2 glass px-2 md:px-3 py-1 rounded-lg">
                <Button
                  onClick={saveCurrentProject}
                  size="sm"
                  variant="outline"
                  disabled={isSaving}
                  className="flex items-center space-x-1 md:space-x-2 text-sm"
                >
                  <Save className="w-4 h-4" />
                  <span className="hidden md:inline">{isSaving ? 'Saving...' : 'Save'}</span>
                </Button>
              </div>
            )}
            
            <div className="flex items-center space-x-1 md:space-x-2 glass px-2 md:px-3 py-1 rounded-lg hidden lg:flex">
              <User className="w-4 h-4 text-gray-600" />
              <span className="text-xs md:text-sm text-gray-700 truncate max-w-[120px]">{user.email}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center space-x-1 md:space-x-2 text-gray-700 hover:text-gray-900 hover:bg-white/50 text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Sign Out</span>
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAuthModal(true)}
            className="flex items-center space-x-1 md:space-x-2 glass border-white/30 text-gray-700 hover:bg-white/20 text-sm"
          >
            <User className="w-4 h-4" />
            <span className="hidden md:inline">Sign In</span>
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="flex items-center space-x-1 md:space-x-2 text-gray-700 hover:text-gray-900 hover:bg-white/50 text-sm hidden sm:flex"
        >
          <Home className="w-4 h-4" />
          <span className="hidden lg:inline">Home</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setAIAssistantOpen(true)}
          className="flex items-center space-x-1 md:space-x-2 text-gray-700 hover:text-gray-900 hover:bg-white/50 text-sm"
        >
          <Zap className="w-4 h-4" />
          <span className="hidden md:inline">AI Assistant</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleSupabaseClick}
          className="text-gray-700 hover:text-gray-900 hover:bg-white/50 hidden lg:flex"
        >
          <span className="text-sm">Supabase</span>
        </Button>
        
        <Button variant="ghost" size="sm" className="text-gray-700 hover:text-gray-900 hover:bg-white/50 hidden lg:flex">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </motion.header>
    
    <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    <ProjectManager 
      isOpen={showProjectManager} 
      onClose={() => setShowProjectManager(false)}
      onSelectProject={handleSelectProject}
    />
    
    <Toast
      message="Coming soon"
      type="info"
      isVisible={showSupabaseToast}
      onClose={() => setShowSupabaseToast(false)}
    />
    </>
  );
};