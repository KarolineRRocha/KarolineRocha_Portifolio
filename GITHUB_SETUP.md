# 🔧 GitHub Setup Guide - Environment Variables Configuration

## 📋 Overview

This guide will help you configure all the necessary environment variables in your GitHub repository for secure deployment to GitHub Pages.

## 🚀 Quick Setup

### 1. Access Repository Settings

1. Go to your GitHub repository: `https://github.com/KarolineRRocha/KarolineRocha_Portfolio`
2. Click on **Settings** tab
3. In the left sidebar, click on **Secrets and variables** → **Actions**

### 2. Add Environment Variables

Click on **New repository secret** and add each of the following variables:

## 🔑 Required Environment Variables

### GitHub Configuration

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `GITHUB_USERNAME` | `KarolineRRocha` | Your GitHub username |
| `GITHUB_TOKEN` | `ghp_xxxxxxxxxx` | GitHub Personal Access Token |

**To create a GitHub Personal Access Token:**
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click **Generate new token (classic)**
3. Select scopes: `public_repo`, `read:user`
4. Copy the generated token

### EmailJS Configuration

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `EMAILJS_SERVICE_ID` | `service_xxxxx` | Your EmailJS service ID |
| `EMAILJS_TEMPLATE_ID` | `template_xxxxx` | Your EmailJS template ID |
| `EMAILJS_USER_ID` | `xxxxxxxxxx` | Your EmailJS user ID |

**To get EmailJS credentials:**
1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Note your Service ID, Template ID, and User ID

### Firebase Configuration

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `FIREBASE_API_KEY` | `AIzaSyxxxxxxxxxx` | Firebase API key |
| `FIREBASE_AUTH_DOMAIN` | `project.firebaseapp.com` | Firebase auth domain |
| `FIREBASE_DATABASE_URL` | `https://project.firebaseio.com` | Firebase database URL |
| `FIREBASE_PROJECT_ID` | `your-project-id` | Firebase project ID |
| `FIREBASE_STORAGE_BUCKET` | `project.appspot.com` | Firebase storage bucket |
| `FIREBASE_MESSAGING_SENDER_ID` | `123456789` | Firebase messaging sender ID |
| `FIREBASE_APP_ID` | `1:123456789:web:xxxxx` | Firebase app ID |
| `FIREBASE_MEASUREMENT_ID` | `G-XXXXXXXXXX` | Firebase analytics ID (optional) |

**To get Firebase credentials:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings → General
4. Scroll down to "Your apps" section
5. Copy the configuration values

### Admin Configuration (Optional)

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `ADMIN_USERNAME` | `admin@example.com` | Admin login email |
| `ADMIN_PASSWORD` | `secure_password` | Admin login password |

### API Configuration (Optional)

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `API_URL` | `https://your-api.com/api` | Backend API URL |

## 🔒 Security Best Practices

### Token Security
- ✅ Use strong, unique tokens
- ✅ Rotate tokens regularly (every 90 days)
- ✅ Use least privilege principle
- ✅ Never share tokens publicly

### GitHub Token Permissions
- ✅ `public_repo` - For repository data access
- ✅ `read:user` - For user profile information
- ❌ Don't grant unnecessary permissions

### EmailJS Security
- ✅ Use HTTPS endpoints
- ✅ Validate email templates
- ✅ Monitor email sending limits

### Firebase Security
- ✅ Configure Firebase Security Rules
- ✅ Use Firebase Authentication
- ✅ Enable Firebase App Check
- ✅ Monitor Firebase usage

## 🧪 Testing Configuration

### Manual Validation
1. Go to your repository Actions tab
2. Click on "Validate Services" workflow
3. Click "Run workflow" → "Run workflow"
4. Check the results

### Automated Validation
The workflow will automatically validate:
- ✅ GitHub API access
- ✅ EmailJS configuration
- ✅ Firebase configuration
- ✅ Environment variables
- ✅ Build process

## 🚨 Troubleshooting

### Common Issues

#### GitHub Token Issues
**Problem**: "GitHub API access failed"
**Solution**:
1. Check if token is valid and not expired
2. Verify token has correct permissions
3. Regenerate token if necessary

#### EmailJS Issues
**Problem**: "EmailJS configuration invalid"
**Solution**:
1. Verify Service ID format: `service_xxxxx`
2. Verify Template ID format: `template_xxxxx`
3. Check EmailJS dashboard for correct values

#### Firebase Issues
**Problem**: "Firebase configuration invalid"
**Solution**:
1. Verify API Key format: `AIzaSyxxxxxxxxxx`
2. Check Project ID format: lowercase, no spaces
3. Ensure all Firebase config values are correct

#### Build Issues
**Problem**: "Build process failed"
**Solution**:
1. Check if all required variables are set
2. Verify Node.js version compatibility
3. Check for TypeScript compilation errors

### Debug Commands

```bash
# Check if secrets are accessible (run in workflow)
echo "Testing GitHub token..."
curl -H "Authorization: token ${{ secrets.GITHUB_TOKEN }}" https://api.github.com/user

# Test EmailJS format
echo "Testing EmailJS format..."
[[ "${{ secrets.EMAILJS_SERVICE_ID }}" =~ ^service_[a-zA-Z0-9]+$ ]] && echo "Valid" || echo "Invalid"

# Test Firebase format
echo "Testing Firebase format..."
[[ "${{ secrets.FIREBASE_API_KEY }}" =~ ^AIza[a-zA-Z0-9_-]{35}$ ]] && echo "Valid" || echo "Invalid"
```

## 📞 Support

### Getting Help
1. **Check workflow logs** in Actions tab
2. **Review validation report** from Validate Services workflow
3. **Check this guide** for common solutions
4. **Create an issue** if problem persists

### Useful Links
- [GitHub Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [Firebase Console](https://console.firebase.google.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

**⚠️ Important**: Never commit these secrets to your repository. Always use GitHub Secrets for sensitive information.
