import { supabase } from './supabaseService';
import type { Component, LogicBlock, DatabaseTable } from '../types';

export interface ProjectData {
  id?: string;
  name: string;
  description?: string;
  components: Component[];
  logicBlocks: LogicBlock[];
  databaseTables: DatabaseTable[];
  generatedCode: {
    frontend: string;
    backend: string;
    database: string;
  };
  deploymentConfig?: any;
  isDeployed?: boolean;
  deploymentUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ProjectService {
  static async saveProject(projectData: ProjectData): Promise<{ data: any; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: { message: 'User not authenticated' } };
      }

      const projectPayload = {
        user_id: user.id,
        name: projectData.name,
        description: projectData.description || '',
        components: projectData.components,
        logic_blocks: projectData.logicBlocks,
        database_tables: projectData.databaseTables,
        generated_code: projectData.generatedCode,
        deployment_config: projectData.deploymentConfig || {},
        is_deployed: projectData.isDeployed || false,
        deployment_url: projectData.deploymentUrl || '',
        ...(projectData.id && { id: projectData.id })
      };

      const { data, error } = await supabase
        .from('projects')
        .upsert(projectPayload)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async getProjects(): Promise<{ data: ProjectData[] | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: { message: 'User not authenticated' } };
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async getProject(projectId: string): Promise<{ data: ProjectData | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: { message: 'User not authenticated' } };
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .eq('user_id', user.id)
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async deleteProject(projectId: string): Promise<{ error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { error: { message: 'User not authenticated' } };
      }

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('user_id', user.id);

      return { error };
    } catch (error) {
      return { error };
    }
  }

  static async updateDeploymentStatus(
    projectId: string, 
    isDeployed: boolean, 
    deploymentUrl?: string
  ): Promise<{ data: any; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: { message: 'User not authenticated' } };
      }

      const { data, error } = await supabase
        .from('projects')
        .update({
          is_deployed: isDeployed,
          deployment_url: deploymentUrl || '',
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)
        .eq('user_id', user.id)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async duplicateProject(projectId: string, newName: string): Promise<{ data: any; error: any }> {
    try {
      const { data: project, error: fetchError } = await this.getProject(projectId);
      
      if (fetchError || !project) {
        return { data: null, error: fetchError || { message: 'Project not found' } };
      }

      const duplicatedProject: ProjectData = {
        name: newName,
        description: project.description,
        components: project.components,
        logicBlocks: project.logicBlocks,
        databaseTables: project.databaseTables,
        generatedCode: project.generatedCode,
        deploymentConfig: project.deploymentConfig,
        isDeployed: false,
        deploymentUrl: ''
      };

      return await this.saveProject(duplicatedProject);
    } catch (error) {
      return { data: null, error };
    }
  }
}