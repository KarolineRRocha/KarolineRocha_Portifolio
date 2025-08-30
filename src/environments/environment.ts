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

  // Firebase Configuration - Local Environment (Development Mode)
  firebase: {
    // Detecção de ambiente
    isLocalEnvironment: true,
    isProductionEnvironment: false,
    
    // Configurações de performance
    enableRealTimeSync: true,        // ✅ Sincronização em tempo real para desenvolvimento
    enableAdminFeatures: true,       // ✅ Interface admin completa
    enableGitHubSync: true,          // ✅ GitHub sync ativo
    enableCache: false,              // ❌ Sem cache (dados sempre frescos)
    cacheDuration: 0,               // Cache de 0ms (sem cache)
    
    // Configurações de debug
    enableDebugMode: true,           // ✅ Logs detalhados
    enablePerformanceLogs: true,     // ✅ Logs de performance
    enableErrorLogs: true,           // ✅ Logs de erro detalhados
    
    // Configurações de segurança
    enableAdminAccess: true,         // ✅ Acesso admin completo
    enableWriteOperations: true,     // ✅ Operações de escrita
    enableDeleteOperations: true,    // ✅ Operações de exclusão
    
    // Configurações de interface
    showAdminControls: true,         // ✅ Mostrar controles admin
    showDevIndicators: true,         // ✅ Mostrar indicadores de desenvolvimento
    showDebugInfo: true              // ✅ Mostrar informações de debug
  },

  // App Configuration
  app: {
    name: 'Karoline Rocha Portfolio',
    version: '1.0.0',
    description: 'Personal portfolio showcasing projects and skills'
  }
};
