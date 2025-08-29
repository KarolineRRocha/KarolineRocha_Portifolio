# Security Guidelines for Karoline Rocha Portfolio

## 🔒 Security Overview

This document outlines security best practices and guidelines for the Karoline Rocha Portfolio project.

## 🚨 Critical Security Measures

### 1. Environment Variables
- **NEVER** commit sensitive data to version control
- Use `.env` files for local development
- Use environment variables in production deployments
- Keep `.env` files in `.gitignore`

### 2. API Keys and Tokens
- Store all API keys in environment variables
- Rotate tokens regularly
- Use least privilege principle for token permissions
- Never expose tokens in client-side code

### 3. Firebase Security
- Configure Firebase Security Rules properly
- Use Firebase Authentication for user management
- Restrict database access with proper rules
- Enable Firebase App Check for additional security

## 📋 Environment Variables

### Required Variables

#### GitHub Configuration
```bash
GITHUB_USERNAME=your_github_username
GITHUB_TOKEN=your_github_personal_access_token
```

#### Email Configuration (EmailJS)
```bash
EMAILJS_SERVICE_ID=your_emailjs_service_id
EMAILJS_TEMPLATE_ID=your_emailjs_template_id
EMAILJS_USER_ID=your_emailjs_user_id
```

#### Admin Configuration
```bash
ADMIN_USERNAME=your_admin_email
ADMIN_PASSWORD=your_secure_password
```

#### Firebase Configuration
```bash
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_DATABASE_URL=your_database_url
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## 🔧 Setup Instructions

### Local Development
1. Copy `env.example` to `.env`
2. Fill in your actual values in `.env`
3. Run `npm start` to start development server

### Production Deployment
1. Set environment variables in your hosting platform
2. Never commit `.env` files
3. Use secure deployment practices

## 🛡️ Security Best Practices

### Code Security
- Use HTTPS in production
- Implement proper input validation
- Sanitize user inputs
- Use Content Security Policy (CSP)
- Implement rate limiting

### Authentication
- Use strong passwords
- Implement multi-factor authentication when possible
- Store passwords securely (hashed)
- Implement session management

### Data Protection
- Encrypt sensitive data at rest
- Use secure communication protocols
- Implement proper access controls
- Regular security audits

## 🚨 Incident Response

### If you suspect a security breach:
1. Immediately revoke compromised tokens
2. Change passwords and API keys
3. Review access logs
4. Update security measures
5. Document the incident

## 📞 Security Contacts

For security issues, please contact:
- Email: [Your Security Email]
- GitHub: [Your GitHub Profile]

## 🔄 Regular Security Tasks

- [ ] Rotate API tokens quarterly
- [ ] Update dependencies monthly
- [ ] Review Firebase security rules
- [ ] Audit environment variables
- [ ] Check for security vulnerabilities

## 📚 Additional Resources

- [GitHub Security Best Practices](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)
- [Angular Security Guide](https://angular.io/guide/security)
