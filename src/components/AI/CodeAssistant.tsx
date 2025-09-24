import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Wand2,
  Save,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Paperclip,
  X,
  Server,
  Database
} from 'lucide-react';
import { Button } from '../ui/Button';
import { AIService } from '../../services/aiService';

interface CodeAssistantProps {
  currentCode: string;
  onCodeUpdate: (newCode: string) => void;
  onSaveCode: () => void;
  isSaving?: boolean;
  onGenerateBackend?: (request: string) => Promise<string>;
  onGenerateDatabase?: (request: string) => Promise<string>;
  showBackendOption?: boolean;
  showDatabaseOption?: boolean;
}

export const CodeAssistant: React.FC<CodeAssistantProps> = ({
  currentCode,
  onCodeUpdate,
  onSaveCode,
  isSaving = false,
  onGenerateBackend,
  onGenerateDatabase,
  showBackendOption = false,
  showDatabaseOption = false
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isGeneratingBackend, setIsGeneratingBackend] = useState(false);
  const [isGeneratingDatabase, setIsGeneratingDatabase] = useState(false);
  const [generationType, setGenerationType] = useState<'frontend' | 'backend' | 'database'>('frontend');
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if ((!inputValue.trim() && uploadedFiles.length === 0) || isLoading) return;

    let messageContent = inputValue;
    
    // Add file information to message if files are uploaded
    if (uploadedFiles.length > 0) {
      const fileInfo = uploadedFiles.map(file => `${file.name} (${file.type})`).join(', ');
      messageContent += `\n\nUploaded files: ${fileInfo}`;
    }

    const currentInput = inputValue;
    setInputValue('');
    setUploadedFiles([]); // Clear uploaded files after sending
    setIsLoading(true);
    setLastUpdate(`Applying: "${currentInput}"`);

    try {
      let modifiedCode = '';
      
      // Determine what type of code to generate based on user input
      const isBackendRequest = /backend|server|api|endpoint|express|node|auth|login|signup/i.test(messageContent);
      const isDatabaseRequest = /database|schema|table|sql|migration|model|postgres|mongo/i.test(messageContent);
      
      if (isBackendRequest && onGenerateBackend) {
        // Generate backend code
        modifiedCode = await onGenerateBackend(messageContent);
        setLastUpdate(`✓ Generated backend code: "${currentInput}"`);
      } else if (isDatabaseRequest && onGenerateDatabase) {
        // Generate database schema
        modifiedCode = await onGenerateDatabase(messageContent);
        setLastUpdate(`✓ Generated database schema: "${currentInput}"`);
      } else {
        // Enhance existing frontend code
        const modificationPrompt = `
Current HTML/CSS/JS code:
\`\`\`html
${currentCode}
\`\`\`

User request: "${messageContent}"

Please modify the code according to the user's request. Return ONLY the complete modified HTML code with inline CSS and JavaScript. Make sure the code is valid and functional.

Important:
- Keep all existing functionality
- Make minimal changes to achieve the request
- Ensure the code is complete and self-contained
- Use modern CSS and JavaScript practices
`;

        modifiedCode = await AIService.generateWebApp(modificationPrompt);
        setLastUpdate(`✓ Applied: "${currentInput}"`);
      }
      
      // Update the code immediately
      onCodeUpdate(modifiedCode);
      setHasUnsavedChanges(true);
      
    } catch (error) {
      console.error('AI Error:', error);
      setLastUpdate(`✗ Error: Failed to apply changes`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateBackend = async () => {
    if (!inputValue.trim() || !onGenerateBackend) return;

    setIsGeneratingBackend(true);
    setLastUpdate(`Generating backend: "${inputValue}"`);

    try {
      const backendCode = await onGenerateBackend(inputValue);
      setLastUpdate(`✓ Generated backend code`);
      setInputValue('');
    } catch (error) {
      console.error('Backend generation error:', error);
      setLastUpdate(`✗ Error: Failed to generate backend`);
    } finally {
      setIsGeneratingBackend(false);
    }
  };

  const handleGenerateDatabase = async () => {
    if (!inputValue.trim() || !onGenerateDatabase) return;

    setIsGeneratingDatabase(true);
    setLastUpdate(`Generating database schema: "${inputValue}"`);

    try {
      const databaseCode = await onGenerateDatabase(inputValue);
      onCodeUpdate(databaseCode);
      setHasUnsavedChanges(true);
      setLastUpdate(`✓ Generated database schema`);
      setInputValue('');
    } catch (error) {
      console.error('Database generation error:', error);
      setLastUpdate(`✗ Error: Failed to generate database schema`);
    } finally {
      setIsGeneratingDatabase(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSave = () => {
    onSaveCode();
    setHasUnsavedChanges(false);
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 flex-shrink-0">
      {/* Status Bar */}
      {(lastUpdate || hasUnsavedChanges) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-3 md:px-4 py-2 border-b border-purple-500/20 bg-gray-800/50 backdrop-blur-sm"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              {hasUnsavedChanges && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-1 text-xs text-orange-300 bg-orange-500/20 px-3 py-1 rounded-md border border-orange-500/30"
                >
                  <AlertCircle className="w-3 h-3" />
                  <span>Unsaved changes</span>
                </motion.div>
              )}
              {lastUpdate && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xs text-gray-300 truncate max-w-[200px] md:max-w-none"
                >
                  {lastUpdate}
                </motion.div>
              )}
            </div>
            
            {hasUnsavedChanges && (
              <Button
                onClick={handleSave}
                disabled={isSaving}
                size="sm"
                className="flex items-center space-x-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg text-sm"
              >
                <Save className="w-3 h-3" />
                <span>{isSaving ? 'Saving...' : 'Save'}</span>
              </Button>
            )}
          </div>
        </motion.div>
      )}

      {/* AI Input */}
      <div className="p-3 md:p-4 bg-gradient-to-r from-purple-900/80 to-blue-900/80 backdrop-blur-md border-t border-purple-400/30">
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

        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-2"
          >
            <div className="flex space-x-2">
              {/* File Upload Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 glass border border-white/30 rounded-xl hover:bg-white/10 transition-all duration-300 text-white flex-shrink-0"
              >
                <Paperclip className="w-4 h-4 md:w-5 md:h-5" />
              </motion.button>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Generation Type Selector */}
              <div className="mb-3">
                <div className="text-xs text-purple-200/70 mb-2 font-medium">GENERATE:</div>
                <div className="flex gap-1">
                  {(['frontend', 'backend', 'database'] as const).map((type) => (
                    <motion.button
                      key={type}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setGenerationType(type)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 capitalize ${
                        generationType === type
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white border border-purple-400/50 shadow-lg'
                          : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
                      }`}
                    >
                      {type}
                    </motion.button>
                  ))}
                </div>
              </div>

              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Describe the ${generationType} you want to build...`}
                className="flex-1 px-4 py-3 glass border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/50"
                disabled={isLoading || isGeneratingDatabase}
                autoFocus
              />

              {/* Database Generate Button */}
              {generationType === 'database' && (
                <Button
                  onClick={handleGenerateDatabase}
                  disabled={isGeneratingDatabase || !inputValue.trim()}
                  size="sm"
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 px-4 py-3 mr-2"
                >
                  {isGeneratingDatabase ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Wand2 className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <Database className="w-4 h-4" />
                  )}
                </Button>
              )}
              
              {/* Backend Generate Button */}
              {generationType === 'backend' && (
                <Button
                  onClick={handleGenerateBackend}
                  disabled={isGeneratingBackend || !inputValue.trim()}
                  size="sm"
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-4 py-3 mr-2"
                >
                  {isGeneratingBackend ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Wand2 className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <Server className="w-4 h-4" />
                  )}
                </Button>
              )}
              
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || isGeneratingBackend || isGeneratingDatabase || (!inputValue.trim() && uploadedFiles.length === 0)}
                size="sm"
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-4 py-3"
              >
                {isLoading || isGeneratingBackend || isGeneratingDatabase ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Wand2 className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </motion.div>
          
          {/* Loading Indicator */}
          <AnimatePresence>
            {(isLoading || isGeneratingBackend || isGeneratingDatabase) && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute -top-12 left-0 right-0 text-center"
              >
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-800/95 to-blue-800/95 backdrop-blur-md px-4 py-2 rounded-lg shadow-xl border border-purple-400/40">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="w-2 h-2 bg-purple-300 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-blue-300 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-teal-300 rounded-full"
                  />
                  <span className="text-xs text-purple-100 ml-2">
                    {isGeneratingBackend ? 'Generating backend...' : 
                     isGeneratingDatabase ? 'Generating database...' : 
                     'AI is updating code...'}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Helper text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xs text-purple-200/70 text-center mt-2 px-2"
          >
            Press Enter to generate code • Upload files for context • Describe any feature you want
            {(showBackendOption || showDatabaseOption) && (
              <span className="block mt-1">
                Use specialized buttons for backend/database generation
              </span>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};