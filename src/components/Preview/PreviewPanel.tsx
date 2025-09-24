import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Code, Download, Save, FolderOpen, Zap, MessageCircle, Server, Database as DatabaseIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { MonacoEditor } from '../CodePreview/MonacoEditor';
import { useAppStore } from '../../store/useAppStore';
import { ProjectService } from '../../services/projectService';
import { DeploymentService } from '../../services/deploymentService';
import { supabase } from '../../services/supabaseService';
import { CodeAssistant } from '../AI/CodeAssistant';
import type { Project, ProjectData } from '../../types';
import { Toast } from '../ui/Toast';

export const PreviewPanel: React.FC = () => {
  const { 
    components, 
    logicBlocks, 
    databaseTables, 
    generatedCode,
    aiGeneratedCode,
    openedProjectCode,
    openedProjectPreview,
    isProjectLoading,
    editedCode,
    setGeneratedCode,
    selectedProject,
    setSelectedProject,
    setOpenedProjectCode,
    setOpenedProjectPreview,
    setIsProjectLoading,
    setEditedCode,
    user 
  } = useAppStore();
  
  const [viewMode, setViewMode] = useState<'canvas' | 'ai' | 'project'>('canvas');
  const [codeTab, setCodeTab] = useState<'frontend' | 'backend' | 'database'>('frontend');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedProjectForLoading, setSelectedProjectForLoading] = useState<Project | null>(null);
  const [showBackendAssistant, setShowBackendAssistant] = useState(false);
  const [showDeployToast, setShowDeployToast] = useState(false);

  // Real-time code state for AI assistant
  const [liveCode, setLiveCode] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initialize live code when project loads
  useEffect(() => {
    const currentCode = getCurrentCode();
    setLiveCode(currentCode);
    setHasUnsavedChanges(false);
  }, [selectedProjectForLoading, viewMode, codeTab, aiGeneratedCode, generatedCode]);

  // Handle code updates from AI assistant
  const handleCodeUpdate = (newCode: string) => {
    setLiveCode(newCode);
    setHasUnsavedChanges(true);
    
    // Update the appropriate code store
    if (selectedProjectForLoading) {
      setEditedCode(newCode);
    } else if (viewMode === 'ai') {
      // Update AI generated code
      const { setAIGeneratedCode } = useAppStore.getState();
      setAIGeneratedCode(newCode);
    } else {
      // Update canvas generated code
      const { updateGeneratedCode } = useAppStore.getState();
      updateGeneratedCode(codeTab, newCode);
    }
  };

  // Handle saving updated code
  const handleSaveUpdatedCode = async () => {
    if (!hasUnsavedChanges) return;

    if (selectedProjectForLoading && user) {
      await saveEditedCode();
    }
    
    setHasUnsavedChanges(false);
  };

  // Load user projects
  useEffect(() => {
    if (user) {
      loadProjects();
    }

    // Listen for new projects created by AI
    const handleProjectCreated = () => {
      if (user) {
        loadProjects();
      }
    };

    window.addEventListener('projectCreated', handleProjectCreated);
    return () => window.removeEventListener('projectCreated', handleProjectCreated);
  }, [user]);

  const deployProject = async (project: Project) => {
    if (!project || !user) return;

    // Show the deploy message popup
    setShowDeployToast(true);
    setTimeout(() => setShowDeployToast(false), 3000);
    return;

    setIsDeploying(true);
    try {
      // Get the current code to deploy
      const codeTodeploy = editedCode || openedProjectCode || project.generated_code?.frontend || '';
      
      if (!codeTodeploy) {
        throw new Error('No code available to deploy');
      }

      // Deploy to Vercel
      const deploymentResult = await DeploymentService.deployToVercel({
        name: project.name,
        code: codeTodeploy,
        projectId: project.id!
      });

      if (!deploymentResult.success) {
        throw new Error(deploymentResult.error || 'Deployment failed');
      }

      // Update project deployment status
      const updatedProject: ProjectData = {
        ...project,
        isDeployed: true,
        deploymentUrl: deploymentResult.url || '',
        deploymentConfig: {
          provider: 'vercel',
          deployedAt: new Date().toISOString(),
          ...deploymentResult.config
        }
      };

      const { error: updateError } = await ProjectService.updateDeploymentStatus(
        project.id!,
        true,
        deploymentResult.url || ''
      );

      if (updateError) {
        console.error('Failed to update deployment status:', updateError);
      }

      // Update local state
      setSelectedProjectForLoading(updatedProject);
      setSelectedProject(updatedProject);
      setProjects(prev => prev.map(p => 
        p.id === project.id ? updatedProject : p
      ));

      alert(`Project deployed successfully! URL: ${deploymentResult.url}`);
      
    } catch (error) {
      console.error('Deployment failed:', error);
      alert(`Deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsDeploying(false);
    }
  };

  const loadProjects = async () => {
    if (!user) return;
    
    setIsLoadingProjects(true);
    try {
      const { data: userProjects, error } = await ProjectService.getProjects();
      if (error) throw error;
      setProjects(userProjects || []);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const loadProject = async (project: Project) => {
    setIsProjectLoading(true);
    
    try {
      // Fetch the complete project data from backend
      const { data: fullProject, error } = await ProjectService.getProject(project.id!);
      if (error) {
        throw new Error(`Failed to load project: ${error.message}`);
      }
      
      if (!fullProject) {
        throw new Error('Project not found');
      }
      
      // Extract AI-generated code from the fetched project
      const aiCode = fullProject.generated_code?.frontend || 
                     fullProject.generatedCode?.frontend || 
                     '';
      
      console.log('Loaded project code length:', aiCode.length);
      
      // Load project into store
      const { loadProject: loadProjectIntoStore } = useAppStore.getState();
      loadProjectIntoStore(fullProject);
      
      // Set all the code states for editing and preview
      setSelectedProject(fullProject);
      setOpenedProjectCode(aiCode);
      setOpenedProjectPreview(aiCode);
      setEditedCode(aiCode);
      setSelectedProjectForLoading(fullProject);
      setViewMode('project');
      setShowProjectSelector(false);
      
    } catch (error) {
      console.error('Error loading project:', error);
      alert(`Failed to load project: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProjectLoading(false);
    }
  };

  const handleProjectSelect = (project: Project) => {
    loadProject(project);
  };

  const saveEditedCode = async () => {
    if (!selectedProjectForLoading || !user) return;

    setIsSaving(true);
    try {
      const currentCode = liveCode || editedCode || openedProjectCode || '';
      const projectData = {
        id: selectedProjectForLoading.id,
        name: selectedProjectForLoading.name,
        description: selectedProjectForLoading.description,
        components: selectedProjectForLoading.components,
        logicBlocks: selectedProjectForLoading.logic_blocks || selectedProjectForLoading.logicBlocks,
        databaseTables: selectedProjectForLoading.database_tables || selectedProjectForLoading.databaseTables,
        generatedCode: {
          frontend: currentCode,
          backend: selectedProjectForLoading.generated_code?.backend || selectedProjectForLoading.generatedCode?.backend || '',
          database: selectedProjectForLoading.generated_code?.database || selectedProjectForLoading.generatedCode?.database || ''
        },
        deploymentConfig: selectedProjectForLoading.deployment_config || selectedProjectForLoading.deploymentConfig,
        isDeployed: selectedProjectForLoading.is_deployed || selectedProjectForLoading.isDeployed,
        deploymentUrl: selectedProjectForLoading.deployment_url || selectedProjectForLoading.deploymentUrl
      };

      const { data: updatedProject, error } = await ProjectService.saveProject(projectData);
      if (error) throw error;
      
      setSelectedProjectForLoading(updatedProject);
      setSelectedProject(updatedProject);
      
      // Update the projects list
      setProjects(prev => prev.map(p => 
        p.id === selectedProjectForLoading.id ? updatedProject : p
      ));
      
    } catch (error) {
      console.error('Failed to save code:', error);
      alert('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save when code changes (debounced)
  useEffect(() => {
    if (!selectedProjectForLoading || !editedCode || editedCode === openedProjectCode) return;
    
    const timeoutId = setTimeout(() => {
      saveEditedCode();
    }, 2000); // Auto-save after 2 seconds of no changes
    
    return () => clearTimeout(timeoutId);
  }, [editedCode, selectedProjectForLoading, openedProjectCode]);

  const getCurrentCode = () => {
    // Return live code if it exists and has been modified
    if (liveCode && hasUnsavedChanges) {
      return liveCode;
    }
    
    if (selectedProjectForLoading) {
      // Use edited code if available, otherwise use the original project code
      if (editedCode) {
        return editedCode;
      }
      return openedProjectCode || '';
    }
    
    if (viewMode === 'ai' && aiGeneratedCode) {
      return aiGeneratedCode;
    }
    
    return generatedCode[codeTab] || '';
  };

  const getCurrentPreviewContent = () => {
    // Use live code for real-time preview updates
    if (liveCode) {
      return liveCode;
    }
    
    if (selectedProjectForLoading) {
      // Use edited code if available, otherwise use the original project code
      if (editedCode) {
        return editedCode;
      }
      return openedProjectPreview || '<div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: Arial, sans-serif; color: #666;">No project content to preview</div>';
    }
    
    if (viewMode === 'ai' && aiGeneratedCode) {
      return aiGeneratedCode;
    }
    
    return generatedCode.frontend || '<div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: Arial, sans-serif; color: #666;">No canvas content to preview</div>';
  };

  const generateBackendCode = async (userRequest: string) => {
    try {
      const currentFrontendCode = liveCode || getCurrentCode();
      const backendCode = await AIService.generateBackendCode(userRequest, currentFrontendCode);
      
      // Update the backend code in the store
      const { updateGeneratedCode } = useAppStore.getState();
      updateGeneratedCode('backend', backendCode);
      
      return backendCode;
    } catch (error) {
      console.error('Backend generation error:', error);
      return 'Error generating backend code';
    }
  };

  const generateDatabaseCode = async (userRequest: string) => {
    try {
      const currentBackendCode = generatedCode.backend;
      const databaseCode = await AIService.generateDatabaseSchema(userRequest, currentBackendCode);
      
      // Update the database code in the store
      const { updateGeneratedCode } = useAppStore.getState();
      updateGeneratedCode('database', databaseCode);
      
      return databaseCode;
    } catch (error) {
      console.error('Database generation error:', error);
      return 'Error generating database schema';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 p-3 md:p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">Preview & Deploy</h2>
          
          {user && (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowProjectSelector(!showProjectSelector)}
                className="flex items-center gap-2 text-sm"
              >
                <FolderOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Load Project</span>
              </Button>
              
              {selectedProject && (
                <>
                  <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                    <div className={`w-2 h-2 rounded-full ${isSaving ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                    <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Auto-saved'}</span>
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={() => deployProject(selectedProject)}
                    disabled={isDeploying}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-sm"
                  >
                    <Zap className="w-4 h-4" />
                    <span className="hidden sm:inline">{isDeploying ? 'Deploying...' : 'Deploy'}</span>
                    <span className="sm:hidden">{isDeploying ? '...' : 'Deploy'}</span>
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Project Selector */}
        {showProjectSelector && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <Card className="p-4">
              <h3 className="font-medium text-gray-800 mb-3">Select Project to Load</h3>
              {isLoadingProjects ? (
                <div className="text-center py-4 text-gray-500">Loading projects...</div>
              ) : projects.length === 0 ? (
                <div className="text-center py-4 text-gray-500">No projects found</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                  {projects.map((project) => (
                    <motion.div
                      key={project.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-purple-300 hover:bg-purple-50"
                      onClick={() => handleProjectSelect(project)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-800">{project.name}</h4>
                          <p className="text-sm text-gray-500 truncate">{project.description}</p>
                        </div>
                        {project.is_deployed && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {/* Current Project Info */}
        {selectedProjectForLoading && (
          <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-purple-800">{selectedProjectForLoading.name}</h3>
                <p className="text-sm text-purple-600">{selectedProjectForLoading.description}</p>
              </div>
              {selectedProjectForLoading.is_deployed && (
                <a
                  href={selectedProjectForLoading.deployment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-purple-600 hover:text-purple-800 underline"
                >
                  View Live
                </a>
              )}
            </div>
          </div>
        )}

        {/* View Toggle */}
        {!selectedProjectForLoading && (aiGeneratedCode || components.length > 0) && (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={viewMode === 'canvas' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('canvas')}
              className="flex items-center gap-2 text-sm"
            >
              <span className="hidden sm:inline">Canvas App</span>
              <span className="sm:hidden">Canvas</span>
            </Button>
            {aiGeneratedCode && (
              <Button
                variant={viewMode === 'ai' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('ai')}
                className="flex items-center gap-2 text-sm"
              >
                <span className="hidden sm:inline">AI Generated</span>
                <span className="sm:hidden">AI</span>
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Preview */}
        <div className="flex-1 border-r lg:border-r border-gray-200 order-2 lg:order-1">
          <div className="h-full bg-gray-50 p-2 md:p-4">
            {isProjectLoading ? (
              <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"
                  />
                  <p className="text-gray-600">Loading preview...</p>
                </div>
              </div>
            ) : (
            <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <iframe
                srcDoc={getCurrentPreviewContent()}
                className="w-full h-full border-0"
                title="Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
            )}
          </div>
        </div>

        {/* Code Editor */}
        <div className="w-full lg:w-1/2 flex flex-col relative order-1 lg:order-2">
          {/* Code Tabs */}
          {!selectedProjectForLoading && (
            <div className="border-b border-gray-200 p-2 overflow-x-auto">
              <div className="flex gap-1 min-w-max">
                {(['frontend', 'backend', 'database'] as const).map((tab) => (
                  <Button
                    key={tab}
                    variant={codeTab === tab ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCodeTab(tab)}
                    className="capitalize text-sm whitespace-nowrap"
                  >
                    {tab}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Editor */}
          <div className="flex-1">
            {isProjectLoading ? (
              <div className="h-full flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"
                  />
                  <p className="text-gray-600">Loading project...</p>
                </div>
              </div>
            ) : (
            <MonacoEditor
              value={liveCode || getCurrentCode()}
              onChange={(value) => {
                if (value !== undefined) {
                  handleCodeUpdate(value);
                }
              }}
              language={selectedProjectForLoading || codeTab === 'frontend' ? 'html' : codeTab === 'backend' ? 'javascript' : 'sql'}
              readOnly={false}
              title={selectedProjectForLoading ? `${selectedProjectForLoading.name} - Frontend Code` : `${codeTab} Code`}
            />
            )}
          </div>

          {/* AI Code Assistant */}
          <CodeAssistant
            currentCode={liveCode || getCurrentCode()}
            onCodeUpdate={handleCodeUpdate}
            onSaveCode={handleSaveUpdatedCode}
            isSaving={isSaving}
            onGenerateBackend={generateBackendCode}
            onGenerateDatabase={generateDatabaseCode}
            showBackendOption={codeTab === 'backend' || selectedProjectForLoading}
            showDatabaseOption={codeTab === 'database' || selectedProjectForLoading}
          />
        </div>
      </div>
      
      <Toast
        message="Our platform is deployed. We're now finalizing the pipeline to get user apps live with a single click."
        type="info"
        isVisible={showDeployToast}
        onClose={() => setShowDeployToast(false)}
      />
    </div>
  );
};