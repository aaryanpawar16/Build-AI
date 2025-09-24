import React, { useCallback, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  NodeTypes,
} from 'react-flow-renderer';
import { motion } from 'framer-motion';
import { TestTube, Play, Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import { LogicBlock } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { LogicBlockNode } from './LogicBlockNode';
import { generateExpressCode } from '../../utils/codeGenerators';

const { useEffect } = React;
const nodeTypes: NodeTypes = {
  logicBlock: LogicBlockNode,
};

export const LogicFlowEditor: React.FC = () => {
  const { 
    logicBlocks, 
    addLogicBlock, 
    updateLogicBlock, 
    setAIAssistantOpen,
    updateGeneratedCode,
    user,
    saveProject
  } = useAppStore();
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [testMode, setTestMode] = useState(false);
  const [testInput, setTestInput] = useState('{"userId": "123", "data": "test"}');
  const [testResult, setTestResult] = useState('');

  // Auto-generate and store backend code when logic blocks change
  useEffect(() => {
    const backendCode = generateExpressCode(logicBlocks);
    updateGeneratedCode('backend', backendCode);
    
    // Auto-save if user is logged in
    if (user && logicBlocks.length > 0) {
      const timeoutId = setTimeout(() => {
        saveProject();
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [logicBlocks, updateGeneratedCode, user, saveProject]);
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeDragStop = useCallback((event: any, node: Node) => {
    updateLogicBlock(node.id, {
      position: { x: node.position.x, y: node.position.y }
    });
  }, [updateLogicBlock]);

  const addBlock = (type: LogicBlock['type']) => {
    const newBlock: LogicBlock = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: Math.random() * 400, y: Math.random() * 300 },
      data: {
        label: type.charAt(0).toUpperCase() + type.slice(1),
        config: {}
      },
      connections: []
    };
    
    addLogicBlock(newBlock);
    
    const newNode: Node = {
      id: newBlock.id,
      type: 'logicBlock',
      position: newBlock.position,
      data: newBlock.data
    };
    
    setNodes((nds) => [...nds, newNode]);
  };

  const handleTestLogic = async () => {
    setTestMode(true);
    try {
      const input = JSON.parse(testInput);
      // Simulate API test
      setTestResult(JSON.stringify({
        success: true,
        data: input,
        timestamp: new Date().toISOString()
      }, null, 2));
    } catch (error) {
      setTestResult(JSON.stringify({
        error: 'Invalid JSON input',
        message: error.message
      }, null, 2));
    }
  };
  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Backend Logic Flow</h2>
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
          <button
            onClick={() => addBlock('input')}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
          >
            + Input
          </button>
          <button
            onClick={() => addBlock('auth')}
            className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
          >
            + Auth
          </button>
          <button
            onClick={() => addBlock('database')}
            className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
          >
            + Database
          </button>
          <button
            onClick={() => addBlock('response')}
            className="px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors"
          >
            + Response
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDragStop={onNodeDragStop}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <Background variant="dots" gap={20} size={1} />
        </ReactFlow>
        </div>
        
        {/* Test Panel */}
        {testMode && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-l border-gray-200 bg-white p-4 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                <TestTube className="w-4 h-4" />
                <span>Test Logic</span>
              </h3>
              <button
                onClick={() => setTestMode(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Test Input (JSON)</label>
                <textarea
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
                  placeholder='{"key": "value"}'
                />
              </div>
              
              <Button onClick={handleTestLogic} size="sm" className="w-full">
                <Play className="w-4 h-4 mr-2" />
                Run Test
              </Button>
              
              {testResult && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Result</label>
                  <pre className="w-full h-32 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-xs font-mono overflow-auto">
                    {testResult}
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
      
      {!testMode && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setTestMode(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <TestTube className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
};