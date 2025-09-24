export class DeploymentService {
  private static vercelToken = import.meta.env.VITE_VERCEL_TOKEN;
  private static netlifyToken = import.meta.env.VITE_NETLIFY_TOKEN;

  static async deployToVercel(projectData: {
    name: string;
    files: Record<string, string>;
  }) {
    try {
      const response = await fetch('https://api.vercel.com/v13/deployments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.vercelToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: projectData.name,
          files: Object.entries(projectData.files).map(([path, content]) => ({
            file: path,
            data: btoa(content),
            encoding: 'base64'
          })),
          projectSettings: {
            framework: 'react',
            buildCommand: 'npm run build',
            outputDirectory: 'dist'
          }
        })
      });

      const data = await response.json();
      return { success: response.ok, data, error: response.ok ? null : data };
    } catch (error) {
      return { success: false, data: null, error };
    }
  }

  static async generateDeploymentConfig(projectType: 'frontend' | 'fullstack') {
    const configs: Record<string, any> = {
      'vercel.json': {
        version: 2,
        builds: [
          {
            src: 'package.json',
            use: '@vercel/node'
          }
        ],
        routes: [
          {
            src: '/api/(.*)',
            dest: '/api/$1'
          },
          {
            src: '/(.*)',
            dest: '/$1'
          }
        ]
      },
      'package.json': {
        name: 'buildai-generated-app',
        version: '1.0.0',
        scripts: {
          dev: 'vite',
          build: 'vite build',
          preview: 'vite preview'
        },
        dependencies: {
          react: '^18.3.1',
          'react-dom': '^18.3.1',
          '@supabase/supabase-js': '^2.56.1'
        },
        devDependencies: {
          '@vitejs/plugin-react': '^4.3.1',
          vite: '^5.4.2',
          tailwindcss: '^3.4.1',
          autoprefixer: '^10.4.18',
          postcss: '^8.4.35'
        }
      }
    };

    return configs;
  }
}