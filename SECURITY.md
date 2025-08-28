# Security Guidelines

## 🔒 Important Security Information

This document outlines security best practices for this portfolio project.

## 🚨 Critical Security Notice

**NEVER commit sensitive information like API tokens, passwords, or personal access tokens to version control.**

## Environment Configuration

### Required Environment Variables

The following sensitive information should be configured in your environment files:

#### GitHub Configuration
- **GitHub Username**: Your GitHub username
- **GitHub Personal Access Token**: Required for GitHub API integration

#### Email Configuration (EmailJS)
- **Service ID**: EmailJS service identifier
- **Template ID**: EmailJS template identifier  
- **User ID**: EmailJS user identifier

#### Admin Configuration
- **Admin Email**: Administrator email address
- **Admin Password**: Secure administrator password

## Setup Instructions

### 1. Create Environment Files

Copy the example file and create your actual environment files:

```bash
# Copy the example file
cp src/environments/environment.example.ts src/environments/environment.ts
cp src/environments/environment.example.ts src/environments/environment.prod.ts
```

### 2. Configure Your Tokens

Edit the environment files with your actual values:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  github: {
    username: 'YOUR_ACTUAL_USERNAME',
    token: 'YOUR_ACTUAL_GITHUB_TOKEN'
  },
  // ... other configurations
};
```

### 3. GitHub Personal Access Token

To create a GitHub Personal Access Token:

1. Go to GitHub Settings
2. Navigate to Developer settings > Personal access tokens > Tokens (classic)
3. Generate new token
4. Select scopes: `public_repo`, `read:user`
5. Copy the token and use it in your environment file

### 4. EmailJS Configuration

To set up EmailJS:

1. Create an account at [EmailJS](https://www.emailjs.com/)
2. Create an email service
3. Create an email template
4. Get your Service ID, Template ID, and User ID
5. Add them to your environment files

## Security Best Practices

### ✅ Do's
- Use environment files for sensitive data
- Keep tokens private and secure
- Rotate tokens regularly
- Use strong, unique passwords
- Review access permissions periodically

### ❌ Don'ts
- Never commit tokens to version control
- Don't share tokens in public repositories
- Don't use the same token across multiple projects
- Don't store tokens in client-side code for production

## File Structure

```
src/environments/
├── environment.example.ts    # Template file (safe to commit)
├── environment.ts           # Development config (DO NOT COMMIT)
└── environment.prod.ts      # Production config (DO NOT COMMIT)
```

## Troubleshooting

### GitHub API 401 Error
If you get a 401 "Bad credentials" error:
1. Check if your GitHub token is valid
2. Ensure the token has the correct permissions
3. Verify the token hasn't expired
4. Regenerate the token if necessary

### EmailJS Issues
If email functionality isn't working:
1. Verify your EmailJS credentials
2. Check if your service is active
3. Ensure your template is properly configured

## Emergency Procedures

### If Tokens Are Exposed
1. **Immediately revoke the exposed token**
2. Generate a new token
3. Update your environment files
4. Check for any unauthorized access
5. Review your repository history

### Token Revocation
- **GitHub**: Go to Settings > Developer settings > Personal access tokens
- **EmailJS**: Contact EmailJS support if needed

## Support

For security-related issues or questions:
- Review this documentation
- Check the main README.md
- Contact the project maintainer

---

**Remember: Security is everyone's responsibility!** 🔐
