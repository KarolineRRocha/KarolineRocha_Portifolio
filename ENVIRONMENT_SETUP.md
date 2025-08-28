# Environment Setup Guide

## 🔐 Security Notice
This project contains sensitive configuration files that are **NOT** committed to the repository for security reasons.

## 📁 Environment Files Structure

```
src/environments/
├── environment.example.ts     # Template file (safe to commit)
├── environment.ts            # Development environment (ignored by git)
├── environment.prod.ts       # Production environment (ignored by git)
└── firebase.config.ts        # Firebase configuration (ignored by git)
```

## 🚀 Setup Instructions

### 1. Development Environment
Copy the example file and configure it with your actual values:

```bash
cp src/environments/environment.example.ts src/environments/environment.ts
```

### 2. Production Environment
Create the production environment file:

```bash
cp src/environments/environment.example.ts src/environments/environment.prod.ts
```

### 3. Firebase Configuration
Create your Firebase configuration file:

```bash
# Create firebase.config.ts with your actual Firebase credentials
```

## 🔧 Required Configuration

### GitHub Configuration
1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate a new token with appropriate permissions
3. Update `github.token` in your environment files

### EmailJS Configuration
1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Create a service and template
3. Get your Service ID, Template ID, and User ID
4. Update the `email` section in your environment files

### Firebase Configuration
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Get your Firebase configuration from Project Settings
3. Update `firebase.config.ts` with your actual values

### Admin Configuration
1. Set secure admin credentials
2. Update the `admin` section in your environment files

## ⚠️ Security Best Practices

1. **Never commit real credentials** to the repository
2. **Use environment variables** in production deployments
3. **Rotate tokens regularly** for security
4. **Use different credentials** for development and production
5. **Keep your `.env` files secure** and never share them

## 🚨 Important Notes

- The `.gitignore` file is configured to ignore all sensitive environment files
- Always use the `environment.example.ts` as a template
- Update this guide if you add new environment variables
- Consider using a secrets management service for production deployments

## 🔍 Verification

After setup, verify that:
- [ ] `environment.ts` contains your development credentials
- [ ] `environment.prod.ts` contains your production credentials
- [ ] `firebase.config.ts` contains your Firebase configuration
- [ ] No real credentials are committed to git
- [ ] The application builds and runs correctly

## 📞 Support

If you encounter issues with environment setup, check:
1. All required environment variables are set
2. Credentials are valid and have proper permissions
3. Firebase project is properly configured
4. GitHub token has necessary scopes
