const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export class AIService {
  private static async callOpenAI(prompt: string, systemPrompt?: string): Promise<string> {
    try {
      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
            { role: 'user', content: prompt }
          ],
          max_tokens: 3000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API Error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        throw new Error('Invalid response structure from OpenAI API');
      }
      
      return data.choices[0].message.content || 'No response generated';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return `Error generating AI response: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  static async generateWebApp(description: string): Promise<string> {
    const systemPrompt = `You are an expert web developer. Generate complete, modern web applications using HTML, CSS, and JavaScript.

CRITICAL REQUIREMENTS:
- Return ONLY a complete HTML document that includes CSS and JavaScript inline
- Use modern CSS with flexbox/grid, animations, and responsive design
- Include interactive JavaScript functionality
- Make it visually appealing with gradients, shadows, and smooth animations
- Use modern design principles with good typography and spacing
- Ensure the code is production-ready and fully functional
- Do NOT include any explanations or markdown - just the HTML code

The HTML should be a complete, self-contained document that can be rendered directly in an iframe.`;
    
    const prompt = `Create a complete web application based on this description: "${description}". 

Make it modern, beautiful, and fully functional with:
- Clean, responsive design
- Smooth animations and transitions
- Interactive elements
- Modern CSS styling
- Working JavaScript functionality

Return only the complete HTML document with inline CSS and JavaScript.`;
    
    return await this.callOpenAI(prompt, systemPrompt);
  }

  static async modifyCode(currentCode: string, userRequest: string): Promise<string> {
    const systemPrompt = `You are an expert web developer. You will be given existing HTML/CSS/JS code and a user request to modify it.

CRITICAL REQUIREMENTS:
- Return ONLY the complete modified HTML document with inline CSS and JavaScript
- Make minimal changes to achieve the user's request while preserving existing functionality
- Ensure the code remains valid, functional, and self-contained
- Use modern CSS and JavaScript practices
- Do NOT include any explanations or markdown - just the HTML code
- Keep all existing features and functionality intact

The modified HTML should be a complete, self-contained document that can be rendered directly in an iframe.`;
    
    const prompt = `Current code:
\`\`\`html
${currentCode}
\`\`\`

User request: "${userRequest}"

Please modify the code according to the user's request. Keep all existing functionality and make only the necessary changes to fulfill the request.`;
    
    return await this.callOpenAI(prompt, systemPrompt);
  }
  static async chatAssistant(message: string): Promise<string> {
    const systemPrompt = `You are BuildAI's helpful assistant. You help users create web applications using HTML, CSS, and JavaScript.
    
When users ask for help or describe what they want to build, provide helpful guidance and suggestions.
Be concise, friendly, and focus on practical solutions.

If they describe something they want to build, suggest they ask you to "create" or "build" it so you can generate the actual code.`;
    
    return await this.callOpenAI(message, systemPrompt);
  }

  static async generateBackendCode(description: string, frontendCode?: string): Promise<string> {
    const systemPrompt = `You are an expert full-stack developer specializing in Node.js/Express.js backend development for hackathons.

CRITICAL REQUIREMENTS:
- Generate complete, production-ready Node.js/Express.js server code
- Include proper error handling, middleware, and security
- Use modern ES6+ syntax and best practices
- Include authentication, validation, and CORS
- Create RESTful API endpoints
- Add comprehensive comments explaining the code
- Make it hackathon-ready with quick setup
- Return ONLY the complete server.js code

The code should be ready to run with npm start and include all necessary dependencies.`;
    
    let prompt = `Create a complete Node.js/Express.js backend server for: "${description}"

Requirements:
- Complete Express.js server with all routes
- Authentication middleware (JWT)
- Input validation and sanitization
- Error handling and logging
- CORS configuration
- Database integration (MongoDB/PostgreSQL)
- Security best practices
- Environment variable configuration
- Comprehensive API documentation in comments
- Ready for hackathon deployment

Include package.json dependencies and setup instructions in comments.`;

    if (frontendCode) {
      prompt += `\n\nFrontend code context:\n\`\`\`html\n${frontendCode.substring(0, 2000)}\n\`\`\`\n\nCreate backend APIs that work with this frontend.`;
    }
    
    return await this.callOpenAI(prompt, systemPrompt);
  }

  static async generateDatabaseSchema(description: string, backendCode?: string): Promise<string> {
    const systemPrompt = `You are an expert database architect specializing in PostgreSQL and MongoDB for hackathon projects.

CRITICAL REQUIREMENTS:
- Generate complete database schema with tables/collections
- Include proper relationships, indexes, and constraints
- Add data validation and security rules
- Create sample data and seed scripts
- Include migration scripts
- Add comprehensive comments explaining the schema
- Make it hackathon-ready with quick setup
- Return complete SQL/NoSQL schema code

The schema should be production-ready and optimized for performance.`;
    
    let prompt = `Create a complete database schema for: "${description}"

Requirements:
- Complete table/collection definitions
- Primary keys, foreign keys, and indexes
- Data validation and constraints
- User authentication tables
- Sample data and seed scripts
- Migration scripts for easy setup
- Security considerations (RLS, permissions)
- Performance optimizations
- Comprehensive documentation in comments
- Ready for hackathon deployment

Include both PostgreSQL and MongoDB versions if applicable.`;

    if (backendCode) {
      prompt += `\n\nBackend code context:\n\`\`\`javascript\n${backendCode.substring(0, 2000)}\n\`\`\`\n\nCreate database schema that works with this backend.`;
    }
    
    return await this.callOpenAI(prompt, systemPrompt);
  }

  static async generateFullStackApp(description: string): Promise<{
    frontend: string;
    backend: string;
    database: string;
    deployment: string;
  }> {
    const systemPrompt = `You are an expert full-stack developer creating complete applications for hackathons.

CRITICAL REQUIREMENTS:
- Generate complete frontend, backend, and database code
- All components must work together seamlessly
- Include deployment configuration
- Add comprehensive setup instructions
- Make it hackathon-ready with quick deployment
- Use modern tech stack and best practices

Return a JSON object with frontend, backend, database, and deployment code.`;
    
    const prompt = `Create a complete full-stack application for: "${description}"

Generate:
1. Frontend: Modern HTML/CSS/JS with responsive design
2. Backend: Node.js/Express.js with authentication and APIs
3. Database: PostgreSQL schema with relationships
4. Deployment: Docker and cloud deployment configs

Make it production-ready and hackathon-optimized.

Return as JSON: {"frontend": "...", "backend": "...", "database": "...", "deployment": "..."}`;
    
    const response = await this.callOpenAI(prompt, systemPrompt);
    
    try {
      return JSON.parse(response);
    } catch {
      // Fallback if JSON parsing fails
      return {
        frontend: response,
        backend: '// Backend code generation failed',
        database: '-- Database schema generation failed',
        deployment: '# Deployment config generation failed'
      };
    }
  }

  static async enhanceExistingCode(
    codeType: 'frontend' | 'backend' | 'database',
    currentCode: string,
    enhancement: string
  ): Promise<string> {
    const systemPrompts = {
      frontend: `You are an expert frontend developer. Enhance existing HTML/CSS/JS code based on user requests.

CRITICAL REQUIREMENTS:
- Maintain all existing functionality
- Add requested enhancements seamlessly
- Use modern frontend practices
- Ensure mobile responsiveness
- Return complete enhanced code
- Add comments explaining changes`,

      backend: `You are an expert backend developer. Enhance existing Node.js/Express.js code based on user requests.

CRITICAL REQUIREMENTS:
- Maintain all existing API endpoints
- Add requested backend features
- Include proper error handling
- Maintain security best practices
- Return complete enhanced server code
- Add comments explaining changes`,

      database: `You are an expert database architect. Enhance existing database schema based on user requests.

CRITICAL REQUIREMENTS:
- Maintain existing tables and relationships
- Add requested database features
- Include migration scripts
- Maintain data integrity
- Return complete enhanced schema
- Add comments explaining changes`
    };

    const prompt = `Current ${codeType} code:
\`\`\`${codeType === 'database' ? 'sql' : codeType === 'backend' ? 'javascript' : 'html'}
${currentCode}
\`\`\`

Enhancement request: "${enhancement}"

Please enhance the code according to the request while maintaining all existing functionality.`;
    
    return await this.callOpenAI(prompt, systemPrompts[codeType]);
  }
}