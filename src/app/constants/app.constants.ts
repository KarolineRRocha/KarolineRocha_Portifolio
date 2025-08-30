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

export const APP_CONSTANTS = {
  // Email Configuration
  EMAIL: {
    USER_ID: getEnvVar('PORTFOLIO_EMAILJS_USER_ID', 'ssxlTwO2Ygo7ZPE-0'),
    SERVICE_ID: getEnvVar('PORTFOLIO_EMAILJS_SERVICE_ID', 'service_bmdnfpt'),
    TEMPLATE_ID: getEnvVar('PORTFOLIO_EMAILJS_TEMPLATE_ID', 'template_285h8vc'),
    DEFAULT_TO_NAME: 'Karoline Rocha',
    DEFAULT_TO_EMAIL: 'emaildakarolineribeiro@gmail.com'
  },

  // Form Validation
  VALIDATION: {
    EMAIL_PATTERN: '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$',
    MIN_NAME_LENGTH: 2,
    MAX_NAME_LENGTH: 50,
    MIN_MESSAGE_LENGTH: 10,
    MAX_MESSAGE_LENGTH: 1000
  },

  // UI Configuration
  UI: {
    NOTIFICATION_DURATION: {
      SUCCESS: 5000,
      ERROR: 8000,
      WARNING: 6000,
      INFO: 4000
    },
    LOADING_MESSAGES: {
      SENDING_EMAIL: 'Sending message...',
      LOADING: 'Loading...'
    }
  },

  // Routes
  ROUTES: {
    HOME: '/home',
    ABOUT: '/about_me',
    TECHNOLOGIES: '/technologies',
    PROJECTS: '/projects',
    CONTACT: '/contact'
  }
} as const;

export const ERROR_MESSAGES = {
  CONTACT: {
    NAME_REQUIRED: 'Name is required',
    EMAIL_REQUIRED: 'Email is required',
    EMAIL_INVALID: 'Please enter a valid email address',
    MESSAGE_REQUIRED: 'Message is required',
    SEND_FAILED: 'Failed to send message. Please try again.',
    UNEXPECTED_ERROR: 'An unexpected error occurred. Please try again.'
  },
  GENERAL: {
    UNEXPECTED_ERROR: 'An unexpected error occurred',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    VALIDATION_ERROR: 'Please check your input and try again.'
  }
} as const;

export const SUCCESS_MESSAGES = {
  CONTACT: {
    MESSAGE_SENT: 'Message sent successfully!'
  }
} as const;
