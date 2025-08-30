/**
 * Environment Variables Injection Script (Development)
 * Generated automatically from .env file
 */

(function () {
  'use strict';

  // Create the global environment object
  window.__env__ = window.__env__ || {};

  // Development environment variables loaded from .env file
  window.__env__ = {
    API_URL: 'http://localhost:3000/api',
    GITHUB_USERNAME: 'KarolineRRocha',
    GITHUB_TOKEN: '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',
    EMAILJS_SERVICE_ID: 'service_bmdnfpt',
    EMAILJS_TEMPLATE_ID: 'template_285h8vc',
    EMAILJS_USER_ID: 'ssxlTwO2Ygo7ZPE-0',
    ADMIN_USERNAME: 'emaildakarolineribeiro@gmail.com',
    ADMIN_PASSWORD: '!Kzd.0342!',
    FIREBASE_API_KEY: 'AIzaSyDCHHh4bA0Vu6EzRNHQYnrArZNsuPfa8F4',
    FIREBASE_AUTH_DOMAIN: 'karoline-portifolio.firebaseapp.com',
    FIREBASE_DATABASE_URL: 'https://karoline-portifolio-default-rtdb.europe-west1.firebasedatabase.app',
    FIREBASE_PROJECT_ID: 'karoline-portifolio',
    FIREBASE_STORAGE_BUCKET: 'karoline-portifolio.firebasestorage.app',
    FIREBASE_MESSAGING_SENDER_ID: '6738401934',
    FIREBASE_APP_ID: '1:6738401934:web:5c5448d710cca1f90607df',
    FIREBASE_MEASUREMENT_ID: 'G-CCEDGQ16LQ'
  };

  console.log('✅ Development environment variables loaded from .env');
  console.log('🔒 Environment variables loaded successfully (credentials hidden for security)');
})();
