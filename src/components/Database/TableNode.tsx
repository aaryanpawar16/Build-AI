import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { Table, Key, Hash, Type, Calendar, ToggleLeft } from 'lucide-react';
import { DatabaseField } from '../../types';

interface TableNodeProps {
  data: {
    name: string;
    fields: DatabaseField[];
  };
  selected: boolean;
}

export const TableNode: React.FC<TableNodeProps> = ({ data, selected }) => {
  const getFieldIcon = (type: string) => {
    switch (type) {
      case 'string':
        return <Type className="w-3 h-3" />;
      case 'number':
        return <Hash className="w-3 h-3" />;
      case 'boolean':
        return <ToggleLeft className="w-3 h-3" />;
      case 'date':
        return <Calendar className="w-3 h-3" />;
      case 'uuid':
        return <Key className="w-3 h-3" />;
      default:
        return <Type className="w-3 h-3" />;
    }
  };

  return (
    <div className={`
      bg-white rounded-lg border-2 shadow-lg min-w-[200px]
      ${selected ? 'border-blue-500' : 'border-gray-200'}
    `}>
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      {/* Table Header */}
      <div className="bg-gray-900 text-white px-4 py-2 rounded-t-lg flex items-center space-x-2">
        <Table className="w-4 h-4" />
        <span className="font-medium">{data.name}</span>
      </div>
      
      {/* Fields */}
      <div className="p-2">
        <div className="space-y-1">
          {/* Default ID field */}
          <div className="flex items-center space-x-2 px-2 py-1 text-xs text-gray-600 bg-gray-50 rounded">
            <Key className="w-3 h-3 text-yellow-500" />
            <span className="font-mono">id</span>
            <span className="text-gray-400">UUID (PK)</span>
          </div>
          
          {/* Custom fields */}
          {data.fields.map((field) => (
            <div key={field.id} className="flex items-center space-x-2 px-2 py-1 text-xs">
              {getFieldIcon(field.type)}
              <span className="font-mono font-medium">{field.name}</span>
              <span className="text-gray-400">{field.type}</span>
              {field.required && <span className="text-red-500">*</span>}
              {field.unique && <span className="text-blue-500">U</span>}
            </div>
          ))}
          
          {/* Default timestamps */}
          <div className="flex items-center space-x-2 px-2 py-1 text-xs text-gray-600 bg-gray-50 rounded">
            <Calendar className="w-3 h-3" />
            <span className="font-mono">created_at</span>
            <span className="text-gray-400">timestamp</span>
          </div>
          <div className="flex items-center space-x-2 px-2 py-1 text-xs text-gray-600 bg-gray-50 rounded">
            <Calendar className="w-3 h-3" />
            <span className="font-mono">updated_at</span>
            <span className="text-gray-400">timestamp</span>
          </div>
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};