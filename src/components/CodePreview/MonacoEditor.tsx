import React from 'react';
import Editor from '@monaco-editor/react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

interface MonacoEditorProps {
  language: string;
  value: string;
  onChange?: (value: string | undefined) => void;
  title: string;
  readOnly?: boolean;
}

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
  language,
  value,
  onChange,
  title,
  readOnly = false
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-700">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <Editor
          height="100%"
          language={language}
          value={value}
          onChange={onChange}
          theme="vs-light"
          options={{
            readOnly,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            wordWrap: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            renderWhitespace: 'selection',
            tabSize: 2,
          }}
        />
      </CardContent>
    </Card>
  );
};