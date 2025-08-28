export const environment = {
  production: false,

  // API Configuration
  apiUrl: 'http://localhost:3000/api', // Change this to your backend API URL

  // GitHub Configuration
  github: {
    username: 'YOUR_GITHUB_USERNAME',
    apiUrl: 'https://api.github.com',
    token: 'YOUR_GITHUB_PERSONAL_ACCESS_TOKEN' // Get from GitHub Settings > Developer settings > Personal access tokens
  },

  // Email Configuration (EmailJS)
  email: {
    serviceId: 'YOUR_EMAILJS_SERVICE_ID',
    templateId: 'YOUR_EMAILJS_TEMPLATE_ID',
    userId: 'YOUR_EMAILJS_USER_ID'
  },

  // Admin Configuration
  admin: {
    defaultUsername: 'YOUR_ADMIN_EMAIL',
    defaultPassword: 'YOUR_SECURE_PASSWORD'
  },

  // App Configuration
  app: {
    name: 'Karoline Rocha Portfolio',
    version: '1.0.0',
    description: 'Personal portfolio showcasing projects and skills'
  }
};
