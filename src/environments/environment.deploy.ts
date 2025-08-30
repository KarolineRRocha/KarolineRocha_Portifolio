// Environment configuration for deployment
// This file is not ignored by .gitignore and can be used in CI/CD

// Declare global environment object
declare global {
  interface Window {
    __env__: any;
  }
}

// Helper function to get environment variables safely
function getEnvVar(key: string, defaultValue: string = ''): string {
  // Try to get from window.__env__ first (for runtime injection)
  if (typeof window !== 'undefined' && window.__env__ && window.__env__[key]) {
    return window.__env__[key];
  }

  // Fallback to default value
  return defaultValue;
}

export const environment = {
  production: true,

  // API Configuration
  apiUrl: getEnvVar('API_URL', 'https://your-production-api.com/api'),

  // GitHub Configuration
  github: {
    username: getEnvVar('GITHUB_USERNAME', 'KarolineRRocha'),
    apiUrl: 'https://api.github.com',
    token: getEnvVar('GITHUB_TOKEN', '')
  },

  // Email Configuration
  email: {
    serviceId: getEnvVar('EMAILJS_SERVICE_ID', ''),
    templateId: getEnvVar('EMAILJS_TEMPLATE_ID', ''),
    userId: getEnvVar('EMAILJS_USER_ID', '')
  },

  // Admin Configuration
  admin: {
    defaultUsername: getEnvVar('ADMIN_USERNAME', ''),
    defaultPassword: getEnvVar('ADMIN_PASSWORD', '')
  },

  // App Configuration
  app: {
    name: 'Karoline Rocha Portfolio',
    version: '1.0.0',
    description: 'Personal portfolio showcasing projects and skills'
  }
};
