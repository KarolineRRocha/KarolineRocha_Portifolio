/**
 * Firebase Configuration for Deployment
 * This file is not ignored by .gitignore and can be used in CI/CD
 */

// Helper function to get environment variables safely
function getEnvVar(key: string, defaultValue: string = ''): string {
  // Try to get from window.__env__ first (for runtime injection)
  if (typeof window !== 'undefined' && window.__env__ && window.__env__[key]) {
    return window.__env__[key];
  }

  // Fallback to default value
  return defaultValue;
}

export const firebaseConfig = {
  apiKey: getEnvVar('FIREBASE_API_KEY', ''),
  authDomain: getEnvVar('FIREBASE_AUTH_DOMAIN', ''),
  databaseURL: getEnvVar('FIREBASE_DATABASE_URL', ''),
  projectId: getEnvVar('FIREBASE_PROJECT_ID', ''),
  storageBucket: getEnvVar('FIREBASE_STORAGE_BUCKET', ''),
  messagingSenderId: getEnvVar('FIREBASE_MESSAGING_SENDER_ID', ''),
  appId: getEnvVar('FIREBASE_APP_ID', ''),
  measurementId: getEnvVar('FIREBASE_MEASUREMENT_ID', '')
};

export const COLLECTIONS = {
  PROJECTS: 'projects',
  USERS: 'users',
  SYNC_DATA: 'sync_data'
};
