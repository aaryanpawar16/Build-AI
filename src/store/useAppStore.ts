import { create } from 'zustand';
import { generateFrontendCode, generateExpressCode, generateDatabaseSchema } from '../utils/codeGenerators';
import { ProjectService } from '../services/projectService';
import type { Component, LogicBlock, DatabaseTable, Project } from '../types';

interface AppState {
  currentProject: Project | null;
  components: Component[];
  logicBlocks: LogicBlock[];
  databaseTables: DatabaseTable[];
  selectedComponent: Component | null;
  selectedBlock: LogicBlock | null;
  activeTab: 'frontend' | 'backend' | 'database' | 'preview';
  isAIAssistantOpen: boolean;
  generatedCode: {
    frontend: string;
    backend: string;
    database: string;
  };
  aiGeneratedCode: string;
  selectedProject: any;
  openedProjectCode: string;
  openedProjectPreview: string;
  isProjectLoading: boolean;
  editedCode: string;
}

interface AppActions {
  setCurrentProject: (project: Project | null) => void;
  addComponent: (component: Component) => void;
  updateComponent: (id: string, updates: Partial<Component>) => void;
  removeComponent: (id: string) => void;
  setSelectedComponent: (component: Component | null) => void;
  addLogicBlock: (block: LogicBlock) => void;
  updateLogicBlock: (id: string, updates: Partial<LogicBlock>) => void;
  removeLogicBlock: (id: string) => void;
  setSelectedBlock: (block: LogicBlock | null) => void;
  addDatabaseTable: (table: DatabaseTable) => void;
  updateDatabaseTable: (id: string, updates: Partial<DatabaseTable>) => void;
  removeDatabaseTable: (id: string) => void;
  setActiveTab: (tab: 'frontend' | 'backend' | 'database' | 'preview') => void;
  setAIAssistantOpen: (open: boolean) => void;
  updateGeneratedCode: (type: 'frontend' | 'backend' | 'database', code: string) => void;
  user: any;
  setUser: (user: any) => void;
  loadProject: (project: Project) => void;
  saveProject: () => Promise<void>;
  setAIGeneratedCode: (code: string) => void;
  setSelectedProject: (project: any) => void;
  setOpenedProjectCode: (code: string) => void;
  setOpenedProjectPreview: (code: string) => void;
  setIsProjectLoading: (loading: boolean) => void;
  setEditedCode: (code: string) => void;
}

export const useAppStore = create<AppState & AppActions>((set, get) => ({
  currentProject: null,
  components: [],
  logicBlocks: [],
  databaseTables: [],
  selectedComponent: null,
  selectedBlock: null,
  activeTab: 'frontend',
  isAIAssistantOpen: false,
  generatedCode: {
    frontend: '',
    backend: '',
    database: ''
  },
  user: null,
  aiGeneratedCode: '',
  selectedProject: null,
  openedProjectCode: '',
  openedProjectPreview: '',
  isProjectLoading: false,
  editedCode: '',

  setCurrentProject: (project) => set({ currentProject: project }),
  
  addComponent: (component) => set((state) => ({
    components: [...state.components, component]
  })),
  
  updateComponent: (id, updates) => set((state) => ({
    components: state.components.map(comp => 
      comp.id === id ? { ...comp, ...updates } : comp
    )
  })),
  
  removeComponent: (id) => set((state) => ({
    components: state.components.filter(comp => comp.id !== id),
    selectedComponent: state.selectedComponent?.id === id ? null : state.selectedComponent
  })),
  
  setSelectedComponent: (component) => set({ selectedComponent: component }),
  
  addLogicBlock: (block) => set((state) => ({
    logicBlocks: [...state.logicBlocks, block]
  })),
  
  updateLogicBlock: (id, updates) => set((state) => ({
    logicBlocks: state.logicBlocks.map(block => 
      block.id === id ? { ...block, ...updates } : block
    )
  })),
  
  removeLogicBlock: (id) => set((state) => ({
    logicBlocks: state.logicBlocks.filter(block => block.id !== id),
    selectedBlock: state.selectedBlock?.id === id ? null : state.selectedBlock
  })),
  
  setSelectedBlock: (block) => set({ selectedBlock: block }),
  
  addDatabaseTable: (table) => set((state) => ({
    databaseTables: [...state.databaseTables, table]
  })),
  
  updateDatabaseTable: (id, updates) => set((state) => ({
    databaseTables: state.databaseTables.map(table => 
      table.id === id ? { ...table, ...updates } : table
    )
  })),
  
  removeDatabaseTable: (id) => set((state) => ({
    databaseTables: state.databaseTables.filter(table => table.id !== id)
  })),
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  setAIAssistantOpen: (open) => set({ isAIAssistantOpen: open }),
  
  updateGeneratedCode: (type, code) => set((state) => ({
    generatedCode: { ...state.generatedCode, [type]: code }
  })),
  
  // Auto-generate and store code when components change
  generateAndStoreCode: () => {
    const state = get();
    const frontendCode = generateFrontendCode(state.components);
    const backendCode = generateExpressCode(state.logicBlocks);
    const databaseCode = generateDatabaseSchema(state.databaseTables);
    
    set({
      generatedCode: {
        frontend: frontendCode,
        backend: backendCode,
        database: databaseCode
      }
    });
    
    // Auto-save if user is logged in and has a current project
    if (state.user && state.currentProject) {
      state.saveProject();
    }
  },
  
  setUser: (user) => set({ user }),
  
  loadProject: (project) => set({
    currentProject: project,
    components: project.components || [],
    logicBlocks: project.logicBlocks || [],
    databaseTables: project.databaseTables || [],
    generatedCode: project.generatedCode || {
      frontend: '',
      backend: '',
      database: ''
    }
  }),
  
  saveProject: async () => {
    const state = get();
    if (!state.user) return;
    
    try {
      const projectData = {
        id: state.currentProject?.id,
        name: state.currentProject?.name || 'Untitled Project',
        description: state.currentProject?.description || '',
        components: state.components,
        logicBlocks: state.logicBlocks,
        databaseTables: state.databaseTables,
        generatedCode: state.generatedCode
      };

      const { data, error } = await ProjectService.saveProject(projectData);
      if (error) {
        console.error('Error saving project:', error);
      } else {
        // Update current project with saved data
        set({
          currentProject: {
            id: data.id,
            name: data.name,
            description: data.description,
            components: data.components || [],
            logicBlocks: data.logic_blocks || [],
            databaseTables: data.database_tables || [],
            generatedCode: data.generated_code || state.generatedCode,
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at)
          }
        });
      }
    } catch (error) {
      console.error('Error saving project:', error);
    }
  },
  
  setAIGeneratedCode: (code) => set({ aiGeneratedCode: code }),
  
  setSelectedProject: (project) => set({ selectedProject: project }),
  
  setOpenedProjectCode: (code) => set({ openedProjectCode: code }),
  
  setOpenedProjectPreview: (code) => set({ openedProjectPreview: code }),
  
  setIsProjectLoading: (loading) => set({ isProjectLoading: loading }),
  
  setEditedCode: (code) => set({ editedCode: code })
}));