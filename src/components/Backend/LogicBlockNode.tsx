import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { Database, Shield, Upload, Download, Settings } from 'lucide-react';

interface LogicBlockNodeProps {
  data: {
    label: string;
    type: string;
    config: any;
  };
  selected: boolean;
}

export const LogicBlockNode: React.FC<LogicBlockNodeProps> = ({ data, selected }) => {
  const getIcon = () => {
    switch (data.type) {
      case 'input':
        return <Upload className="w-4 h-4" />;
      case 'auth':
        return <Shield className="w-4 h-4" />;
      case 'database':
        return <Database className="w-4 h-4" />;
      case 'response':
        return <Download className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  const getColor = () => {
    switch (data.type) {
      case 'input':
        return 'bg-blue-500';
      case 'auth':
        return 'bg-green-500';
      case 'database':
        return 'bg-purple-500';
      case 'response':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className={`
      px-4 py-3 rounded-lg border-2 bg-white shadow-md min-w-[120px]
      ${selected ? 'border-blue-500' : 'border-gray-200'}
      hover:shadow-lg transition-all duration-200
    `}>
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex items-center space-x-2">
        <div className={`w-8 h-8 rounded-md ${getColor()} flex items-center justify-center text-white`}>
          {getIcon()}
        </div>
        <div>
          <div className="font-medium text-sm text-gray-900">{data.label}</div>
          <div className="text-xs text-gray-500 capitalize">{data.type}</div>
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};