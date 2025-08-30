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
  production: false,

  // API Configuration
  apiUrl: getEnvVar('PORTFOLIO_API_URL', 'http://localhost:3000/api'),

  // GitHub Configuration
  github: {
    username: getEnvVar('PORTFOLIO_GITHUB_USERNAME', 'KarolineRRocha'),
    apiUrl: 'https://api.github.com',
    token: getEnvVar('PORTFOLIO_GITHUB_TOKEN', '')
  },

  // Email Configuration
  email: {
    serviceId: getEnvVar('PORTFOLIO_EMAILJS_SERVICE_ID', ''),
    templateId: getEnvVar('PORTFOLIO_EMAILJS_TEMPLATE_ID', ''),
    userId: getEnvVar('PORTFOLIO_EMAILJS_USER_ID', '')
  },

  // Admin Configuration
  admin: {
    defaultUsername: getEnvVar('PORTFOLIO_ADMIN_USERNAME', ''),
    defaultPassword: getEnvVar('PORTFOLIO_ADMIN_PASSWORD', '')
  },

  // App Configuration
  app: {
    name: 'Karoline Rocha Portfolio',
    version: '1.0.0',
    description: 'Personal portfolio showcasing projects and skills'
  }
};
