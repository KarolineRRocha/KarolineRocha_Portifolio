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
  apiUrl: getEnvVar('PORTFOLIO_API_URL', 'https://your-production-api.com/api'),

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

  // Firebase Configuration - Production Environment (Optimized Mode)
  firebase: {
    // Detecção de ambiente
    isLocalEnvironment: false,
    isProductionEnvironment: true,
    
    // Configurações de performance
    enableRealTimeSync: false,       // ❌ Sem sincronização em tempo real (economiza recursos)
    enableAdminFeatures: true,       // ✅ Interface admin disponível (para operações ocasionais)
    enableGitHubSync: false,         // ❌ GitHub sync desabilitado (desnecessário em produção)
    enableCache: true,               // ✅ Cache inteligente ativo
    cacheDuration: 300000,          // Cache de 5 minutos (300.000ms)
    
    // Configurações de debug
    enableDebugMode: false,          // ❌ Sem logs de debug (performance)
    enablePerformanceLogs: false,    // ❌ Sem logs de performance (performance)
    enableErrorLogs: true,           // ✅ Logs de erro básicos (para monitoramento)
    
    // Configurações de segurança
    enableAdminAccess: true,         // ✅ Acesso admin disponível (para operações ocasionais)
    enableWriteOperations: true,     // ✅ Operações de escrita (para adicionar projetos)
    enableDeleteOperations: false,   // ❌ Operações de exclusão desabilitadas (segurança)
    
    // Configurações de interface
    showAdminControls: true,         // ✅ Mostrar controles admin (para operações ocasionais)
    showDevIndicators: false,        // ❌ Sem indicadores de desenvolvimento (interface limpa)
    showDebugInfo: false             // ❌ Sem informações de debug (interface limpa)
  },

  // App Configuration
  app: {
    name: 'Karoline Rocha Portfolio',
    version: '1.0.0',
    description: 'Personal portfolio showcasing projects and skills'
  }
};
