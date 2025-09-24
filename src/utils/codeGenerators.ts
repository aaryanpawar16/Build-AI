import type { Component, LogicBlock, DatabaseTable } from '../types';

export const generateFrontendCode = (components: Component[]): string => {
  if (components.length === 0) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Canvas Generated App</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: 'Inter', sans-serif;
        }
        .glass {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .hover-scale:hover {
            transform: scale(1.05);
            transition: transform 0.3s ease;
        }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center">
    <div class="text-center text-white">
        <h1 class="text-4xl font-bold mb-4">Canvas App</h1>
        <p class="text-xl opacity-90">Your canvas components will appear here!</p>
    </div>
</body>
</html>`;
  }

  const componentCode = components.map(component => {
    const style = `position: absolute; left: ${component.position.x}px; top: ${component.position.y}px; width: ${component.size.width}px; height: ${component.size.height}px;`;

    switch (component.type) {
      case 'text':
        return `<div style="${style}" class="text-${component.properties.fontSize || 'base'} text-${component.properties.color || 'gray-800'} glass p-3 rounded-xl hover-scale">${component.properties.text || 'Text'}</div>`;
      case 'button':
        return `<button style="${style}" class="bg-${component.properties.backgroundColor || 'blue-500'} text-white px-4 py-2 rounded-xl hover:opacity-90 shadow-lg font-medium transition-all duration-300 hover-scale" onclick="alert('Button clicked!')">${component.properties.text || 'Button'}</button>`;
      case 'input':
        return `<input style="${style}" type="text" placeholder="${component.properties.placeholder || 'Enter text'}" class="glass border border-white/30 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800" />`;
      case 'card':
        return `<div style="${style}" class="glass rounded-2xl shadow-xl p-6 border border-white/30 hover-scale">${component.properties.text || 'Card content'}</div>`;
      case 'image':
        return `<div style="${style}" class="glass p-2 rounded-xl border border-white/30 hover-scale"><img src="${component.properties.src || 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'}" alt="${component.properties.alt || 'Image'}" class="rounded-lg object-cover w-full h-full" /></div>`;
      default:
        return `<div style="${style}" class="glass border-2 border-dashed border-white/30 rounded-xl p-4 text-gray-600">${component.type}</div>`;
    }
  }).join('\n      ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Canvas Generated App</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: 'Inter', sans-serif;
        }
        .glass {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .hover-scale:hover {
            transform: scale(1.05);
            transition: transform 0.3s ease;
        }
    </style>
</head>
<body class="min-h-screen relative">
    <div class="relative min-h-screen">
        ${componentCode}
    </div>
    <script>
        // Add interactivity to canvas components
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Canvas app loaded successfully');
            
            // Add click handlers for interactive elements
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                button.addEventListener('click', function() {
                    console.log('Button clicked:', this.textContent);
                });
            });
            
            const inputs = document.querySelectorAll('input');
            inputs.forEach(input => {
                input.addEventListener('input', function() {
                    console.log('Input changed:', this.value);
                });
            });
        });
    </script>
</body>
</html>`;
};

export const generateExpressCode = (logicBlocks: LogicBlock[]): string => {
  // Generate Express.js routes based on logic blocks
  const routes = logicBlocks.filter(block => block.type === 'input').map(inputBlock => {
    const authBlocks = logicBlocks.filter(block => block.type === 'auth' && inputBlock.connections.includes(block.id));
    const dbBlocks = logicBlocks.filter(block => block.type === 'database' && inputBlock.connections.includes(block.id));
    const responseBlocks = logicBlocks.filter(block => block.type === 'response' && inputBlock.connections.includes(block.id));

    const hasAuth = authBlocks.length > 0;
    const hasDb = dbBlocks.length > 0;

    return `
app.${inputBlock.data.method || 'get'}('${inputBlock.data.path || '/api/endpoint'}', ${hasAuth ? 'authenticateToken, ' : ''}async (req, res) => {
  try {
    ${hasAuth ? '// Authentication already verified by middleware' : ''}
    ${hasDb ? `
    // Database operation
    const result = await db.query('${dbBlocks[0]?.data.query || 'SELECT * FROM users'}');
    ` : ''}
    
    res.json({
      success: true,
      ${hasDb ? 'data: result.rows' : 'message: "Success"'}
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
    `;
  }).join('\n');

  return `
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.sendStatus(401);
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

${routes}

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
  `;
};

export const generateDatabaseSchema = (tables: DatabaseTable[]): string => {
  return tables.map(table => {
    const fields = table.fields.map(field => {
      const constraints = [];
      if (field.required) constraints.push('NOT NULL');
      if (field.unique) constraints.push('UNIQUE');
      if (field.defaultValue) constraints.push(`DEFAULT '${field.defaultValue}'`);

      const sqlType = field.type === 'string' ? 'TEXT' : 
                     field.type === 'number' ? 'INTEGER' : 
                     field.type === 'boolean' ? 'BOOLEAN' : 
                     field.type === 'date' ? 'TIMESTAMP' : 
                     field.type === 'uuid' ? 'UUID' : 'TEXT';

      return `  ${field.name} ${sqlType} ${constraints.join(' ')}`;
    }).join(',\n');

    return `
CREATE TABLE IF NOT EXISTS ${table.name} (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
${fields},
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
    `;
  }).join('\n');
};