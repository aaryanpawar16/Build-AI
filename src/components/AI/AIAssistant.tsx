import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Zap, Code, Lightbulb, Sparkles, Play, Eye, Wand2, Copy, Download, Plus, Upload, Image as ImageIcon, Paperclip } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store/useAppStore';
import { AIService } from '../../services/aiService';
import { ProjectService } from '../../services/projectService';
import Editor from '@monaco-editor/react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  generatedCode?: string;
}

export const AIAssistant: React.FC = () => {
  const { isAIAssistantOpen, setAIAssistantOpen, user, setCurrentProject } = useAppStore();
  const { setAIGeneratedCode, setActiveTab } = useAppStore();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI coding assistant powered by GPT-4o. I can help you create web applications using HTML, CSS, and JavaScript.\n\nJust describe what you want to build and I\'ll write the code line by line with live preview!\n\nExamples:\n• "Create a todo app with add/delete functionality"\n• "Build a calculator with all basic operations"\n• "Make a landing page for a restaurant"\n• "Create a weather app with API integration"\n• "Build a simple game like Snake or Tic-tac-toe"',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentCode, setCurrentCode] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [generationType, setGenerationType] = useState<'frontend' | 'backend' | 'database' | 'fullstack'>('frontend');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const typeCodeLineByLine = async (code: string) => {
    setIsTyping(true);
    setCurrentCode('');
    
    const lines = code.split('\n');
    let currentContent = '';
    
    for (let i = 0; i < lines.length; i++) {
      currentContent += lines[i] + '\n';
      setCurrentCode(currentContent);
      
      // Simulate typing delay - faster for shorter lines, slower for longer ones
      const delay = Math.min(Math.max(lines[i].length * 15, 50), 300);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    setIsTyping(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const validTypes = ['image/', 'application/pdf', 'text/', 'application/msword', 'application/vnd.openxmlformats-officedocument'];
      return validTypes.some(type => file.type.startsWith(type)) || file.size < 10 * 1024 * 1024; // 10MB limit
    });
    setUploadedFiles(prev => [...prev, ...validFiles]);
    
    if (validFiles.length !== files.length) {
      alert('Some files were skipped. Only images, PDFs, documents under 10MB are supported.');
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    let messageContent = inputValue;
    
    // Add file information to message if files are uploaded
    if (uploadedFiles.length > 0) {
      const fileInfo = uploadedFiles.map(file => `${file.name} (${file.type})`).join(', ');
      messageContent += `\n\nUploaded files: ${fileInfo}`;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageContent,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setUploadedFiles([]); // Clear uploaded files after sending
    setIsLoading(true);

    try {
      let generatedCode = '';
      let aiResponse = '';
      
      // Determine what type of code to generate based on user input
      const isBackendRequest = /backend|server|api|endpoint|database|auth|login|signup/i.test(currentInput);
      const isDatabaseRequest = /database|schema|table|model|migration|sql/i.test(currentInput);
      const isFullStackRequest = /full.?stack|complete.?app|entire.?application/i.test(currentInput);
      
      if (isFullStackRequest) {
        // Generate complete full-stack application
        const fullStackCode = await AIService.generateFullStackApp(currentInput);
        generatedCode = fullStackCode.frontend;
        
        // Store all generated code
        const { updateGeneratedCode } = useAppStore.getState();
        updateGeneratedCode('frontend', fullStackCode.frontend);
        updateGeneratedCode('backend', fullStackCode.backend);
        updateGeneratedCode('database', fullStackCode.database);
        
        aiResponse = `I've created a complete full-stack application for you! This includes:

**🎨 Frontend**: Modern responsive web application with interactive UI
**⚡ Backend**: Node.js/Express.js server with authentication and APIs  
**🗄️ Database**: PostgreSQL schema with relationships and security
**🚀 Deployment**: Docker and cloud deployment configurations

Watch as I write the frontend code line by line. You can switch to the Backend and Database tabs to see the complete server and schema code.

**Hackathon Ready Features:**
- User authentication and authorization
- RESTful API endpoints
- Database with proper relationships
- Responsive design for all devices
- Production deployment configs
- Comprehensive error handling`;
        
      } else if (isBackendRequest) {
        // Generate backend code
        generatedCode = await AIService.generateBackendCode(currentInput, generatedCode.frontend);
        
        const { updateGeneratedCode } = useAppStore.getState();
        updateGeneratedCode('backend', generatedCode);
        
        aiResponse = `I've created a complete Node.js/Express.js backend server for your project!

**🔧 Backend Features:**
- RESTful API endpoints
- JWT authentication middleware
- Input validation and sanitization
- Error handling and logging
- CORS configuration
- Database integration
- Security best practices

The backend code is now available in the Backend tab. It's ready for hackathon deployment!`;
        
      } else if (isDatabaseRequest) {
        // Generate database schema
        generatedCode = await AIService.generateDatabaseSchema(currentInput, generatedCode.backend);
        
        const { updateGeneratedCode } = useAppStore.getState();
        updateGeneratedCode('database', generatedCode);
        
        aiResponse = `I've created a complete database schema for your project!

**🗄️ Database Features:**
- Optimized table structure
- Proper relationships and constraints
- Indexes for performance
- Data validation rules
- Migration scripts
- Sample data and seeds
- Security configurations

The database schema is now available in the Database tab. Perfect for hackathon rapid development!`;
        
      } else {
        // Generate frontend code (default)
        generatedCode = await AIService.generateWebApp(currentInput);
        
        aiResponse = `I'll create a web application based on your request. Watch as I write the code line by line in the editor panel.

**Implementation Plan:**
- Complete HTML structure with semantic elements
- Modern CSS with responsive design and animations
- Interactive JavaScript functionality
- Clean, production-ready code

The live preview will update in real-time as I write the code. You can copy or download the final result when it's complete.`;
      }
      
      // Start typing animation
      typeCodeLineByLine(generatedCode);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        generatedCode: generatedCode
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Auto-save the project if user is logged in
      if (user) {
        await autoSaveProject(generatedCode);
      }
      
      // Store the generated code in the app state
      setAIGeneratedCode(generatedCode);
    } catch (error) {
      console.error('AI Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Sorry, I encountered an error generating the code. Please check your API key configuration and try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(currentCode);
  };

  const downloadCode = () => {
    const blob = new Blob([currentCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'app.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const autoSaveProject = async (code: string) => {
    if (!user || !currentCode) return;

    setIsSaving(true);
    try {
      const projectData = {
        name: `AI App - ${new Date().toLocaleString()}`,
        description: 'Generated by AI Assistant',
        components: [],
        logicBlocks: [],
        databaseTables: [],
        generatedCode: {
          frontend: code,
          backend: '// Backend code will be generated when logic blocks are added',
          database: '-- Database schema will be generated when tables are added'
        }
      };

      const { data, error } = await ProjectService.saveProject(projectData);
      if (error) {
        console.error('Error saving AI project:', error);
      } else {
        // Load the saved project into the store
        const { loadProject } = useAppStore.getState();
        loadProject({
          id: data.id,
          name: data.name,
          description: data.description,
          components: data.components || [],
          logicBlocks: data.logic_blocks || [],
          databaseTables: data.database_tables || [],
          generatedCode: data.generated_code || {
            frontend: code,
            backend: '// Backend code will be generated when logic blocks are added',
            database: '-- Database schema will be generated when tables are added'
          },
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at)
        });
        
        // Set as selected project for editing
        const { setSelectedProject } = useAppStore.getState();
        setSelectedProject(data);
        
        // Notify other components about the new project
        window.dispatchEvent(new CustomEvent('projectCreated', {
          detail: { project: data }
        }));
      }
    } catch (error) {
      console.error('Error saving AI project:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const quickActions = [
    { 
      icon: <Code className="w-4 h-4" />, 
      label: 'Todo App', 
      action: 'Create a modern todo app with add, delete, edit, and mark complete functionality. Include local storage and smooth animations.' 
    },
    { 
      icon: <Zap className="w-4 h-4" />, 
      label: 'Calculator', 
      action: 'Build a calculator app with all basic math operations, memory functions, and a clean modern design.' 
    },
    { 
      icon: <Lightbulb className="w-4 h-4" />, 
      label: 'Landing Page', 
      action: 'Create a beautiful landing page for a tech startup with hero section, features, testimonials, and contact form.' 
    },
    { 
      icon: <Play className="w-4 h-4" />, 
      label: 'Game', 
      action: 'Create a simple Snake game with score tracking, game over screen, and restart functionality.' 
    },
  ];

  return (
    <AnimatePresence>
      {isAIAssistantOpen && (
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
            className="w-full max-w-[95vw] h-[85vh] glass-strong rounded-2xl shadow-2xl flex flex-col lg:flex-row overflow-hidden border border-white/30"
          >
            {/* Chat Panel */}
            <div className="w-full lg:w-1/3 flex flex-col border-r border-white/20">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/20 bg-gradient-to-r from-purple-500/20 to-blue-500/20">
                <div className="flex items-center space-x-2 text-white flex-1">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                  <h2 className="text-base md:text-lg font-semibold">AI Assistant</h2>
                  <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full hidden sm:inline">GPT-4o</span>
                </div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAIAssistantOpen(false)}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </motion.div>
              </div>

              {/* Quick Actions */}
              <div className="p-4 border-b border-white/20 bg-white/5">
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setInputValue(action.action)}
                      className="flex items-center space-x-2 px-3 py-2 glass border border-white/20 rounded-lg text-sm hover:glow-blue transition-all duration-300 text-white"
                    >
                      {action.icon}
                      <span>{action.label}</span>
                    </motion.button>
                  ))}
                </div>
                
                {/* Full-Stack Quick Actions */}
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="text-xs text-white/60 mb-2 font-medium">FULL-STACK TEMPLATES</div>
                  <div className="grid grid-cols-1 gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setInputValue('Create a complete full-stack e-commerce app with user authentication, product catalog, shopping cart, payment integration, and admin dashboard')}
                      className="flex items-center space-x-2 px-3 py-2 glass border border-green-400/30 rounded-lg text-sm hover:bg-green-500/20 transition-all duration-300 text-green-200"
                    >
                      <Zap className="w-4 h-4" />
                      <span>E-commerce Platform</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setInputValue('Build a complete social media app with user profiles, posts, comments, likes, real-time chat, and notification system')}
                      className="flex items-center space-x-2 px-3 py-2 glass border border-blue-400/30 rounded-lg text-sm hover:bg-blue-500/20 transition-all duration-300 text-blue-200"
                    >
                      <Code className="w-4 h-4" />
                      <span>Social Media App</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setInputValue('Create a project management tool with team collaboration, task tracking, file sharing, time tracking, and reporting dashboard')}
                      className="flex items-center space-x-2 px-3 py-2 glass border border-purple-400/30 rounded-lg text-sm hover:bg-purple-500/20 transition-all duration-300 text-purple-200"
                    >
                      <Lightbulb className="w-4 h-4" />
                      <span>Project Manager</span>
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`
                        max-w-[85%] px-4 py-3 rounded-xl shadow-lg
                        ${message.type === 'user' 
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                          : 'glass-card text-gray-800 border border-white/30'
                        }
                      `}
                    >
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      
                      <div className={`text-xs mt-2 ${message.type === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="glass-card px-4 py-3 rounded-xl border border-white/30">
                      <div className="flex items-center space-x-2">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="w-2 h-2 bg-purple-400 rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                          className="w-2 h-2 bg-blue-400 rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                          className="w-2 h-2 bg-teal-400 rounded-full"
                        />
                        <span className="text-sm text-gray-600 ml-2">Generating with GPT-4o...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/20 bg-white/5">
                {/* File Upload Area */}
                {uploadedFiles.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-3 flex flex-wrap gap-2"
                  >
                    {uploadedFiles.map((file, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center space-x-2 bg-purple-500/20 border border-purple-400/30 rounded-lg px-3 py-2 text-sm text-purple-200"
                      >
                        <ImageIcon className="w-4 h-4" />
                        <span className="truncate max-w-[100px]">{file.name}</span>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-purple-300 hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                <div className="flex space-x-2">
                  {/* File Upload Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center w-12 h-12 glass border border-white/30 rounded-xl hover:bg-white/10 transition-all duration-300 text-white"
                  >
                    <Paperclip className="w-5 h-5" />
                  </motion.button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe what you want to build..."
                    className="flex-1 px-4 py-3 glass border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/50"
                    disabled={isLoading}
                  />
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleSendMessage}
                      disabled={isLoading || (!inputValue.trim() && uploadedFiles.length === 0)}
                      size="sm"
                      className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-4 py-3"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Code Editor Panel */}
            <div className="w-full lg:w-1/3 border-r border-white/20 flex flex-col bg-white/5">
              <div className="flex items-center justify-between p-4 border-b border-white/20">
                <h3 className="text-base md:text-lg font-semibold text-white flex items-center space-x-2">
                  <Code className="w-5 h-5 text-blue-400" />
                  <span>Code Editor</span>
                  {isTyping && (
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full flex items-center space-x-1"
                    >
                      <Wand2 className="w-3 h-3" />
                      <span>Writing...</span>
                    </motion.div>
                  )}
                </h3>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={copyCode}
                    disabled={!currentCode}
                    className="flex items-center space-x-1 px-2 py-1 bg-blue-500/20 text-blue-300 rounded-md text-xs hover:bg-blue-500/30 transition-colors disabled:opacity-50"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={downloadCode}
                    disabled={!currentCode}
                    className="flex items-center space-x-1 px-2 py-1 bg-green-500/20 text-green-300 rounded-md text-xs hover:bg-green-500/30 transition-colors disabled:opacity-50"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </motion.button>
                  {user && currentCode && !isTyping && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={async () => {
                        await autoSaveProject(currentCode);
                        // Switch to preview tab and close AI assistant
                        setActiveTab('preview');
                        setAIAssistantOpen(false);
                      }}
                      disabled={isSaving}
                      className="flex items-center space-x-1 px-3 py-1 bg-green-500/20 text-green-300 rounded-md text-xs hover:bg-green-500/30 transition-colors disabled:opacity-50"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{isSaving ? 'Saving...' : 'Save & Open'}</span>
                    </motion.button>
                  )}
                </div>
              </div>
              
              <div className="flex-1 relative">
                {currentCode ? (
                  <Editor
                    height="100%"
                    language="html"
                    value={currentCode}
                    theme="vs-dark"
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 13,
                      lineNumbers: 'on',
                      wordWrap: 'on',
                      automaticLayout: true,
                      scrollBeyondLastLine: false,
                      renderWhitespace: 'selection',
                      tabSize: 2,
                      folding: true,
                      lineDecorationsWidth: 0,
                      lineNumbersMinChars: 3,
                      glyphMargin: false,
                      contextmenu: false,
                      smoothScrolling: true,
                      cursorBlinking: 'smooth',
                      cursorSmoothCaretAnimation: 'on',
                    }}
                  />
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="h-full flex items-center justify-center"
                  >
                    <div className="text-center text-white/60">
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Code className="w-8 h-8 mx-auto mb-2 text-purple-300" />
                      </motion.div>
                      <p className="text-sm">Code will appear here</p>
                      <p className="text-xs text-white/40 mt-2">Ask me to create something to see live coding</p>
                    </div>
                  </motion.div>
                )}
                
                {/* Typing indicator overlay */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute bottom-4 right-4 glass-strong px-3 py-2 rounded-lg text-white text-xs flex items-center space-x-2"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Wand2 className="w-3 h-3 text-purple-400" />
                    </motion.div>
                    <span>AI is writing code...</span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Live Preview Panel */}
            <div className="w-1/3 flex flex-col bg-white/5">
              <div className="p-4 border-b border-white/20">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <Play className="w-5 h-5 text-green-400" />
                  <span>Live Preview</span>
                  {isTyping && (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="w-2 h-2 bg-green-400 rounded-full"
                    />
                  )}
                </h3>
              </div>
              
              <div className="flex-1 p-4">
                {currentCode ? (
                  <div className="h-full glass rounded-xl border border-white/20 overflow-hidden">
                    <iframe
                      srcDoc={currentCode}
                      className="w-full h-full border-none"
                      title="Live Preview"
                      sandbox="allow-scripts allow-same-origin"
                    />
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="h-full glass rounded-xl border-2 border-dashed border-white/30 flex items-center justify-center"
                  >
                    <div className="text-center text-white/60">
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Eye className="w-8 h-8 mx-auto mb-2 text-purple-300" />
                      </motion.div>
                      <p className="text-sm">Live preview will appear here</p>
                      <p className="text-xs text-white/40 mt-2">Watch your app come to life as AI writes the code</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};