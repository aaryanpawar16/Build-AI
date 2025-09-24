import React, { useState } from 'react';
import { Plus, Table, Link, Zap, FolderSync as Sync } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import type { DatabaseTable, DatabaseField } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { SchemaVisualizer } from './SchemaVisualizer';
import { SupabaseService } from '../../services/supabaseService';
import { generateDatabaseSchema } from '../../utils/codeGenerators';

export const DatabaseBuilder: React.FC = () => {
  const { 
    databaseTables, 
    addDatabaseTable, 
    updateDatabaseTable, 
    setAIAssistantOpen,
    updateGeneratedCode,
    user,
    saveProject
  } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [newTable, setNewTable] = useState<Partial<DatabaseTable>>({
    name: '',
    fields: [],
    position: { x: 0, y: 0 },
    relations: []
  });

  // Auto-generate and store database code when tables change
  React.useEffect(() => {
    const databaseCode = generateDatabaseSchema(databaseTables);
    updateGeneratedCode('database', databaseCode);
    
    // Auto-save if user is logged in
    if (user && databaseTables.length > 0) {
      const timeoutId = setTimeout(() => {
        saveProject();
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [databaseTables, updateGeneratedCode, user, saveProject]);
  const addField = () => {
    const newField: DatabaseField = {
      id: `field-${Date.now()}`,
      name: '',
      type: 'string',
      required: false,
      unique: false
    };
    
    setNewTable(prev => ({
      ...prev,
      fields: [...(prev.fields || []), newField]
    }));
  };

  const updateField = (index: number, updates: Partial<DatabaseField>) => {
    setNewTable(prev => ({
      ...prev,
      fields: prev.fields?.map((field, i) => 
        i === index ? { ...field, ...updates } : field
      ) || []
    }));
  };

  const removeField = (index: number) => {
    setNewTable(prev => ({
      ...prev,
      fields: prev.fields?.filter((_, i) => i !== index) || []
    }));
  };

  const handleCreateTable = () => {
    if (newTable.name && newTable.fields?.length) {
      const table: DatabaseTable = {
        id: `table-${Date.now()}`,
        name: newTable.name,
        fields: newTable.fields,
        position: { x: Math.random() * 400, y: Math.random() * 300 },
        relations: []
      };
      
      addDatabaseTable(table);
      setNewTable({ name: '', fields: [], position: { x: 0, y: 0 }, relations: [] });
      setShowForm(false);
    }
  };

  const handleSyncSchema = async () => {
    setIsSyncing(true);
    try {
      await SupabaseService.syncSchema(databaseTables);
      // Show success message
    } catch (error) {
      console.error('Schema sync error:', error);
    } finally {
      setIsSyncing(false);
    }
  };
  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Database Schema</h2>
        <div className="flex space-x-2">
          <Button
            onClick={() => setAIAssistantOpen(true)}
            size="sm"
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Zap className="w-4 h-4" />
            <span>AI Generate</span>
          </Button>
          <Button
            onClick={handleSyncSchema}
            size="sm"
            variant="outline"
            disabled={isSyncing || databaseTables.length === 0}
            className="flex items-center space-x-2"
          >
            <Sync className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Sync to Supabase</span>
          </Button>
          <Button
            onClick={() => setShowForm(true)}
            size="sm"
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Table</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Table Form */}
        {showForm && (
          <div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto">
            <Card>
              <CardHeader>
                <CardTitle>Create New Table</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Table Name</label>
                  <input
                    type="text"
                    value={newTable.name || ''}
                    onChange={(e) => setNewTable(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="users, posts, orders..."
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Fields</label>
                    <Button variant="ghost" size="sm" onClick={addField}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {newTable.fields?.map((field, index) => (
                      <div key={field.id} className="border border-gray-200 rounded-md p-3">
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <input
                            type="text"
                            value={field.name}
                            onChange={(e) => updateField(index, { name: e.target.value })}
                            className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Field name"
                          />
                          <select
                            value={field.type}
                            onChange={(e) => updateField(index, { type: e.target.value as any })}
                            className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="string">String</option>
                            <option value="number">Number</option>
                            <option value="boolean">Boolean</option>
                            <option value="date">Date</option>
                            <option value="uuid">UUID</option>
                          </select>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <label className="flex items-center space-x-1">
                              <input
                                type="checkbox"
                                checked={field.required}
                                onChange={(e) => updateField(index, { required: e.target.checked })}
                                className="w-3 h-3"
                              />
                              <span className="text-xs text-gray-600">Required</span>
                            </label>
                            <label className="flex items-center space-x-1">
                              <input
                                type="checkbox"
                                checked={field.unique}
                                onChange={(e) => updateField(index, { unique: e.target.checked })}
                                className="w-3 h-3"
                              />
                              <span className="text-xs text-gray-600">Unique</span>
                            </label>
                          </div>
                          <button
                            onClick={() => removeField(index)}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={handleCreateTable} size="sm" className="flex-1">
                    Create Table
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Schema Visualizer */}
        <div className="flex-1">
          <SchemaVisualizer tables={databaseTables} />
        </div>
      </div>
    </div>
  );
};