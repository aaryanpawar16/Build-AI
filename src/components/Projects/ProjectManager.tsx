import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  FolderOpen, 
  Trash2, 
  Edit3, 
  Copy, 
  Cloud, 
  Eye, 
  Calendar,
  Search,
  Filter,
  X
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProjectService, ProjectData } from '../../services/projectService';
import { useAppStore } from '../../store/useAppStore';
import { DeploymentService } from '../../services/deploymentService';

interface ProjectManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (project: ProjectData) => void;
}

export const ProjectManager: React.FC<ProjectManagerProps> = ({ 
  isOpen, 
  onClose, 
  onSelectProject 
}) => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDeployed, setFilterDeployed] = useState<'all' | 'deployed' | 'undeployed'>('all');
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [deployingProjects, setDeployingProjects] = useState<Set<string>>(new Set());
  const { user } = useAppStore();

  const openProjectWithCodeAndPreview = (project: ProjectData) => {
    // Load project into store with all data
    const { 
      loadProject, 
      setSelectedProject, 
      setActiveTab,
      setOpenedProjectCode,
      setOpenedProjectPreview 
    } = useAppStore.getState();
    
    // Load the complete project data
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
    
    // Set as selected project for editing
    setSelectedProject(project);
    
    // Load the AI-generated code for editing
    const aiCode = project.generatedCode?.frontend || project.generated_code?.frontend || '';
    setOpenedProjectCode(aiCode);
    setOpenedProjectPreview(aiCode);
    
    // Switch to preview tab to show code and preview
    setActiveTab('preview');
  };

  useEffect(() => {
    if (isOpen && user) {
      loadProjects();
    }

    // Listen for new projects created by AI
    const handleProjectCreated = () => {
      if (isOpen && user) {
        loadProjects();
      }
    };

    window.addEventListener('projectCreated', handleProjectCreated);
    return () => window.removeEventListener('projectCreated', handleProjectCreated);
  }, [isOpen, user]);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await ProjectService.getProjects();
      if (error) {
        console.error('Error loading projects:', error);
      } else {
        setProjects(data || []);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewProject = async () => {
    if (!newProjectName.trim()) return;

    try {
      const newProject: ProjectData = {
        name: newProjectName,
        description: '',
        components: [],
        logicBlocks: [],
        databaseTables: [],
        generatedCode: {
          frontend: '',
          backend: '',
          database: ''
        }
      };

      const { data, error } = await ProjectService.saveProject(newProject);
      if (error) {
        console.error('Error creating project:', error);
      } else {
        setProjects(prev => [data, ...prev]);
        setNewProjectName('');
        setShowNewProjectForm(false);
        onSelectProject(data);
        onClose();
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await ProjectService.deleteProject(projectId);
      if (error) {
        console.error('Error deleting project:', error);
      } else {
        setProjects(prev => prev.filter(p => p.id !== projectId));
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const duplicateProject = async (project: ProjectData) => {
    const newName = `${project.name} (Copy)`;
    try {
      const { data, error } = await ProjectService.duplicateProject(project.id!, newName);
      if (error) {
        console.error('Error duplicating project:', error);
      } else {
        setProjects(prev => [data, ...prev]);
      }
    } catch (error) {
      console.error('Error duplicating project:', error);
    }
  };

  const handleOpenProject = (project: ProjectData) => {
    console.log('Opening project:', project);
    
    // Extract AI-generated code from project data
    const aiCode = project.generatedCode?.frontend || 
                   project.generated_code?.frontend || 
                   '';
    
    console.log('AI Code found:', aiCode ? 'Yes' : 'No', aiCode.length);
    
    // Load project into store with all data
    const { 
      loadProject, 
      setSelectedProject, 
      setActiveTab,
      setOpenedProjectCode,
      setOpenedProjectPreview,
      setEditedCode
    } = useAppStore.getState();
    
    // Load the complete project data
    loadProject({
      id: project.id!,
      name: project.name,
      description: project.description,
      components: project.components || [],
      logicBlocks: project.logicBlocks || [],
      databaseTables: project.databaseTables || [],
      generatedCode: project.generatedCode || project.generated_code || {
        frontend: '',
        backend: '',
        database: ''
      },
      createdAt: new Date(project.createdAt!),
      updatedAt: new Date(project.updatedAt!)
    });
    
    // Set as selected project and load AI code for editing
    setSelectedProject(project);
    setOpenedProjectCode(aiCode);
    setOpenedProjectPreview(aiCode);
    setEditedCode(aiCode);
    
    // Switch to preview tab
    setActiveTab('preview');
    
    // Close project manager
    onClose();
  };

  const deployProject = async (project: ProjectData) => {
    if (!project.generatedCode.frontend) {
      alert('Please generate code for this project before deploying');
      return;
    }

    setDeployingProjects(prev => new Set(prev).add(project.id!));

    try {
      const result = await DeploymentService.deployToVercel({
        name: project.name.toLowerCase().replace(/\s+/g, '-'),
        files: {
          'index.html': project.generatedCode.frontend,
          'package.json': JSON.stringify({
            name: project.name.toLowerCase().replace(/\s+/g, '-'),
            version: '1.0.0',
            scripts: {
              build: 'echo "Static site, no build needed"',
              start: 'echo "Static site"'
            }
          }, null, 2)
        }
      });

      if (result.success) {
        await ProjectService.updateDeploymentStatus(
          project.id!,
          true,
          result.data.url
        );
        
        setProjects(prev => prev.map(p => 
          p.id === project.id 
            ? { ...p, isDeployed: true, deploymentUrl: result.data.url }
            : p
        ));
      }
    } catch (error) {
      console.error('Deployment error:', error);
    } finally {
      setDeployingProjects(prev => {
        const newSet = new Set(prev);
        newSet.delete(project.id!);
        return newSet;
      });
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterDeployed === 'all' ||
                         (filterDeployed === 'deployed' && project.isDeployed) ||
                         (filterDeployed === 'undeployed' && !project.isDeployed);

    return matchesSearch && matchesFilter;
  });

  if (!user) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="w-full max-w-6xl h-[80vh] glass-strong rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/30"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/20 bg-gradient-to-r from-purple-500/20 to-blue-500/20">
              <div className="flex items-center space-x-3">
                <FolderOpen className="w-6 h-6 text-white" />
                <h2 className="text-xl font-semibold text-white">Project Manager</h2>
                <span className="text-sm bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
                  {projects.length} projects
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => setShowNewProjectForm(true)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Project</span>
                </Button>
                <Button variant="ghost" onClick={onClose} className="text-white hover:bg-white/20">
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="p-6 border-b border-white/20 bg-white/5">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 glass border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/50"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-white/70" />
                  <select
                    value={filterDeployed}
                    onChange={(e) => setFilterDeployed(e.target.value as any)}
                    className="glass border border-white/30 rounded-lg px-3 py-2 text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all" className="bg-gray-800">All Projects</option>
                    <option value="deployed" className="bg-gray-800">Deployed</option>
                    <option value="undeployed" className="bg-gray-800">Not Deployed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-white/60">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <p>Loading projects...</p>
                  </div>
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-white/60">
                    <FolderOpen className="w-12 h-12 mx-auto mb-4 text-purple-300" />
                    <p className="text-lg font-medium mb-2">
                      {searchTerm || filterDeployed !== 'all' ? 'No projects found' : 'No projects yet'}
                    </p>
                    <p className="text-sm text-white/40">
                      {searchTerm || filterDeployed !== 'all' 
                        ? 'Try adjusting your search or filter'
                        : 'Create your first project to get started'
                      }
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="group"
                    >
                      <Card className="glass-card h-full border-white/20 hover:glow-purple transition-all duration-300">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-gray-800 text-lg font-semibold mb-1">
                                {project.name}
                              </CardTitle>
                              {project.description && (
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {project.description}
                                </p>
                              )}
                            </div>
                            {project.isDeployed && (
                              <div className="flex items-center space-x-1 bg-green-500/20 text-green-700 px-2 py-1 rounded-full text-xs">
                                <Cloud className="w-3 h-3" />
                                <span>Live</span>
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        
                        <CardContent>
                          <div className="space-y-4">
                            {/* Project Stats */}
                            <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                              <div className="text-center">
                                <div className="font-medium text-gray-800">{project.components?.length || 0}</div>
                                <div>Components</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium text-gray-800">{project.logicBlocks?.length || 0}</div>
                                <div>Logic Blocks</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium text-gray-800">{project.databaseTables?.length || 0}</div>
                                <div>Tables</div>
                              </div>
                            </div>

                            {/* Last Updated */}
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <Calendar className="w-3 h-3" />
                              <span>
                                Updated {new Date(project.updatedAt || project.createdAt!).toLocaleDateString()}
                              </span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center space-x-2">
                              <Button
                                onClick={() => {
                                  openProjectWithCodeAndPreview(project);
                                  onClose();
                                }}
                                size="sm"
                                className="flex-1 flex items-center space-x-2"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>Open</span>
                              </Button>
                              
                              {project.isDeployed && project.deploymentUrl ? (
                                <Button
                                  onClick={() => window.open(project.deploymentUrl, '_blank')}
                                  size="sm"
                                  variant="outline"
                                  className="flex items-center space-x-1"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>View</span>
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => deployProject(project)}
                                  size="sm"
                                  variant="outline"
                                  disabled={deployingProjects.has(project.id!) || !project.generatedCode?.frontend}
                                  className="flex items-center space-x-1"
                                >
                                  <Cloud className="w-3 h-3" />
                                  <span>
                                    {deployingProjects.has(project.id!) ? 'Deploying...' : 'Deploy'}
                                  </span>
                                </Button>
                              )}
                              
                              <Button
                                onClick={() => duplicateProject(project)}
                                size="sm"
                                variant="ghost"
                                className="text-gray-600 hover:text-gray-800"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                              
                              <Button
                                onClick={() => deleteProject(project.id!)}
                                size="sm"
                                variant="ghost"
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* New Project Form */}
            <AnimatePresence>
              {showNewProjectForm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="w-full max-w-md"
                  >
                    <Card className="glass-strong border border-white/30">
                      <CardHeader>
                        <CardTitle className="text-white">Create New Project</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                              Project Name
                            </label>
                            <input
                              type="text"
                              value={newProjectName}
                              onChange={(e) => setNewProjectName(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && createNewProject()}
                              className="w-full px-4 py-3 glass border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/50"
                              placeholder="My Awesome App"
                              autoFocus
                            />
                          </div>
                          
                          <div className="flex space-x-3">
                            <Button
                              onClick={createNewProject}
                              disabled={!newProjectName.trim()}
                              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                            >
                              Create Project
                            </Button>
                            <Button
                              onClick={() => {
                                setShowNewProjectForm(false);
                                setNewProjectName('');
                              }}
                              variant="outline"
                              className="glass border-white/30 text-white hover:bg-white/20"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};