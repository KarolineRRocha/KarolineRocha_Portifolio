# 🚀 Deployment & Security Guide - Karoline Rocha Portfolio

## 📋 Table of Contents

- [Overview](#overview)
- [Security Implementation](#security-implementation)
- [Environment Setup](#environment-setup)
- [Development Workflow](#development-workflow)
- [Production Deployment](#production-deployment)
- [Platform-Specific Guides](#platform-specific-guides)
- [Troubleshooting](#troubleshooting)
- [Security Best Practices](#security-best-practices)

## 🎯 Overview

This document provides comprehensive guidance for deploying the Karoline Rocha Portfolio application with proper security measures. The project implements a secure environment variable system that protects sensitive data while maintaining functionality across different deployment platforms.

### 🔒 Security Features

- **Environment Variable Protection**: All sensitive data stored in `.env` files
- **Zero Hardcoded Secrets**: No API keys or tokens in source code
- **Git-Safe Configuration**: Secure for public repositories
- **Multi-Environment Support**: Development and production configurations
- **Automated Scripts**: Streamlined setup and deployment processes

## 🛡️ Security Implementation

### Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   .env file     │    │  env.js script  │    │  Angular App    │
│  (local only)   │───▶│ (runtime vars)  │───▶│ (window.__env__)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Protected Data Types

- **GitHub API Tokens**: For repository data synchronization
- **EmailJS Credentials**: For contact form functionality
- **Firebase Configuration**: For database and storage
- **Admin Credentials**: For administrative access
- **API Endpoints**: For backend communication

## 🔧 Environment Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Git for version control
- Access to deployment platform (GitHub Pages, Vercel, Netlify, etc.)

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/KarolineRRocha/KarolineRocha_Portfolio.git
   cd KarolineRocha_Portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   ./setup-env.sh
   ```

4. **Edit the `.env` file with your actual values**
   ```bash
   nano .env
   ```

### Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `API_URL` | Backend API endpoint | Yes | `http://localhost:3000/api` |
| `GITHUB_USERNAME` | Your GitHub username | Yes | `KarolineRRocha` |
| `GITHUB_TOKEN` | GitHub Personal Access Token | Yes | `ghp_xxxxxxxxxx` |
| `EMAILJS_SERVICE_ID` | EmailJS service identifier | Yes | `service_xxxxx` |
| `EMAILJS_TEMPLATE_ID` | EmailJS template identifier | Yes | `template_xxxxx` |
| `EMAILJS_USER_ID` | EmailJS user identifier | Yes | `xxxxxxxxxx` |
| `ADMIN_USERNAME` | Admin login email | Yes | `admin@example.com` |
| `ADMIN_PASSWORD` | Admin login password | Yes | `secure_password` |
| `FIREBASE_API_KEY` | Firebase API key | Yes | `AIzaSyxxxxxxxxxx` |
| `FIREBASE_AUTH_DOMAIN` | Firebase auth domain | Yes | `project.firebaseapp.com` |
| `FIREBASE_DATABASE_URL` | Firebase database URL | Yes | `https://project.firebaseio.com` |
| `FIREBASE_PROJECT_ID` | Firebase project ID | Yes | `your-project-id` |
| `FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | Yes | `project.appspot.com` |
| `FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | Yes | `123456789` |
| `FIREBASE_APP_ID` | Firebase app ID | Yes | `1:123456789:web:xxxxx` |
| `FIREBASE_MEASUREMENT_ID` | Firebase analytics ID | No | `G-XXXXXXXXXX` |

## 🛠️ Development Workflow

### Available Scripts

#### Development Environment Setup
```bash
# Configure development environment with .env variables
./dev-env.sh
```

#### Start Development Server
```bash
# Start development server with hot reload
npm start
```

#### Build for Production
```bash
# Build production version with environment variables
./build-prod.sh
```

### Development Commands

| Command | Description | Output |
|---------|-------------|--------|
| `npm start` | Start development server | `http://localhost:4200` |
| `npm run build` | Build for development | `dist/KarolineRocha_Portfolio/` |
| `npm run build:prod` | Build for production | `dist/KarolineRocha_Portfolio/` |
| `npm run deploy:ghdocs` | Build for GitHub Pages | `docs/` |
| `npm run deploy` | Deploy to GitHub Pages | Live deployment |

### Development Best Practices

1. **Always use the development script**
   ```bash
   ./dev-env.sh  # Run before starting development
   ```

2. **Never commit `.env` files**
   - The `.env` file is automatically ignored by Git
   - Use `env.example` as a template

3. **Test environment variables**
   - Check browser console for environment loading messages
   - Verify all services are working correctly

## 🚀 Production Deployment

### Deployment Process

1. **Prepare environment variables**
   ```bash
   # Ensure .env file is configured for production
   nano .env
   ```

2. **Build for production**
   ```bash
   ./build-prod.sh
   ```

3. **Deploy the build output**
   - Upload contents of `dist/KarolineRocha_Portfolio/` to your hosting platform

### Build Output Structure

```
dist/KarolineRocha_Portfolio/
├── index.html              # Main HTML file
├── assets/                 # Static assets
│   ├── env.js             # Environment variables (injected)
│   ├── KLogo.svg          # Logo files
│   └── ...
├── main.xxxxx.js          # Main application bundle
├── polyfills.xxxxx.js     # Polyfills bundle
├── runtime.xxxxx.js       # Runtime bundle
└── styles.xxxxx.css       # Styles bundle
```

## 🌐 GitHub Pages Deployment

### Repository Setup

1. **Configure repository settings**
   - Go to Settings > Pages
   - Set source to "GitHub Actions"

2. **Set environment variables**
   - Go to Settings > Secrets and variables > Actions
   - Add all required environment variables:
     - `API_URL`
     - `GITHUB_USERNAME`
     - `GITHUB_TOKEN`
     - `EMAILJS_SERVICE_ID`
     - `EMAILJS_TEMPLATE_ID`
     - `EMAILJS_USER_ID`
     - `ADMIN_USERNAME`
     - `ADMIN_PASSWORD`
     - `FIREBASE_API_KEY`
     - `FIREBASE_AUTH_DOMAIN`
     - `FIREBASE_DATABASE_URL`
     - `FIREBASE_PROJECT_ID`
     - `FIREBASE_STORAGE_BUCKET`
     - `FIREBASE_MESSAGING_SENDER_ID`
     - `FIREBASE_APP_ID`
     - `FIREBASE_MEASUREMENT_ID`

3. **Deploy using GitHub Actions**
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

### Deployment Process

The GitHub Actions workflow will:
1. Build the application with production environment variables
2. Create the build artifacts in `dist/KarolineRocha_Portfolio/`
3. Deploy to GitHub Pages automatically
4. Make your site available at: `https://karolinerrocha.github.io/KarolineRocha_Portfolio/`

### Manual Deployment (Alternative)

If you prefer manual deployment:

1. **Build locally**
   ```bash
   ./build-prod.sh
   ```

2. **Deploy to gh-pages branch**
   ```bash
   npm run deploy
   ```

This will:
- Build the project for production
- Push the build to the `gh-pages` branch
- Deploy to GitHub Pages

## 🔧 Troubleshooting

### Common Issues

#### Environment Variables Not Loading

**Problem**: Application shows empty values for environment variables

**Solution**:
1. Check if `.env` file exists and has correct values
2. Run `./dev-env.sh` to regenerate environment script
3. Check browser console for error messages
4. Verify `src/assets/env.js` is being loaded

#### Build Failures

**Problem**: Production build fails with TypeScript errors

**Solution**:
1. Ensure all environment variables are set in `.env`
2. Check for missing dependencies: `npm install`
3. Clear cache: `npm run build -- --delete-output-path`
4. Verify TypeScript configuration

#### GitHub API Issues

**Problem**: GitHub data not loading

**Solution**:
1. Verify `GITHUB_TOKEN` is valid and has correct permissions
2. Check token expiration
3. Ensure `GITHUB_USERNAME` is correct
4. Test API access manually

#### EmailJS Issues

**Problem**: Contact form not sending emails

**Solution**:
1. Verify EmailJS credentials in `.env`
2. Check EmailJS service status
3. Ensure template is properly configured
4. Test EmailJS service manually

### Debug Commands

```bash
# Check environment variables
cat .env

# Verify build output
ls -la dist/KarolineRocha_Portfolio/

# Check for TypeScript errors
npx tsc --noEmit

# Test environment script
node -e "console.log(require('dotenv').config())"
```

## 🛡️ Security Best Practices

### Environment Variable Security

1. **Never commit `.env` files**
   - Always use `.gitignore` to exclude sensitive files
   - Use `env.example` as a template

2. **Use strong, unique tokens**
   - Generate new tokens for each environment
   - Rotate tokens regularly
   - Use least privilege principle

3. **Secure token storage**
   - Store tokens in secure password managers
   - Use environment-specific tokens
   - Never share tokens in public repositories

### Deployment Security

1. **Use HTTPS in production**
   - Configure SSL certificates
   - Redirect HTTP to HTTPS
   - Use secure headers

2. **Implement proper CORS**
   - Configure allowed origins
   - Restrict API access
   - Use secure cookies

3. **Regular security audits**
   - Update dependencies regularly
   - Monitor for security vulnerabilities
   - Review access logs

### Code Security

1. **Input validation**
   - Validate all user inputs
   - Sanitize data before processing
   - Use parameterized queries

2. **Error handling**
   - Don't expose sensitive information in errors
   - Log errors securely
   - Implement proper error boundaries

3. **Access control**
   - Implement proper authentication
   - Use role-based access control
   - Secure admin interfaces

## 📞 Support

### Getting Help

1. **Check documentation**
   - Review this guide thoroughly
   - Check `SECURITY.md` for security-specific information
   - Read `README.md` for general project information

2. **Common resources**
   - [Angular Security Guide](https://angular.io/guide/security)
   - [Firebase Security Rules](https://firebase.google.com/docs/rules)
   - [GitHub Security Best Practices](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure)

3. **Contact information**
   - Create an issue on GitHub for bugs
   - Check existing issues for solutions
   - Review project documentation

---

**⚠️ Important**: Always keep your environment variables secure and never commit them to version control. This guide ensures your application remains secure while being deployable to any platform.
