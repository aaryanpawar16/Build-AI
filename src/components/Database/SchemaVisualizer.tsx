import React from 'react';
import { Table } from 'lucide-react';
import ReactFlow, {
  Node,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  NodeTypes,
} from 'react-flow-renderer';
import type { DatabaseTable } from '../../types';
import { TableNode } from './TableNode';

const nodeTypes: NodeTypes = {
  table: TableNode,
};

interface SchemaVisualizerProps {
  tables: DatabaseTable[];
}

export const SchemaVisualizer: React.FC<SchemaVisualizerProps> = ({ tables }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    tables.map((table) => ({
      id: table.id,
      type: 'table',
      position: table.position,
      data: {
        name: table.name,
        fields: table.fields,
      },
    }))
  );
  
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  React.useEffect(() => {
    setNodes(tables.map((table) => ({
      id: table.id,
      type: 'table',
      position: table.position,
      data: {
        name: table.name,
        fields: table.fields,
      },
    })));
  }, [tables, setNodes]);

  if (tables.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-400">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Table className="w-8 h-8" />
          </div>
          <p className="text-lg font-medium">No tables yet</p>
          <p className="text-sm">Create your first table to see the schema visualization</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50"
      >
        <Controls />
        <Background variant="dots" gap={20} size={1} />
      </ReactFlow>
    </div>
  );
};