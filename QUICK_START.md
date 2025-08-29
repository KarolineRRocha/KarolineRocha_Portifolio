# ⚡ Quick Start Guide - Karoline Rocha Portfolio

## 🚀 Get Started in 5 Minutes

### 1. Initial Setup
```bash
# Clone and setup
git clone https://github.com/KarolineRRocha/KarolineRocha_Portfolio.git
cd KarolineRocha_Portfolio
npm install
./setup-env.sh
```

### 2. Configure Environment
```bash
# Edit .env with your credentials
nano .env
```

### 3. Start Development
```bash
# Load environment variables
./dev-env.sh

# Start server
npm start
```

### 4. Access Application
🌐 **http://localhost:4200**

---

## 📋 Available Scripts

### Development
| Script | Command | Description |
|--------|---------|-------------|
| **Setup Environment** | `./setup-env.sh` | Create .env file from template |
| **Load Dev Variables** | `./dev-env.sh` | Load .env variables for development |
| **Start Server** | `npm start` | Start development server (port 4200) |
| **Build Dev** | `npm run build` | Build for development |

### Production
| Script | Command | Description |
|--------|---------|-------------|
| **Build Production** | `./build-prod.sh` | Build with production variables |
| **Deploy GitHub Pages** | `npm run deploy` | Deploy to GitHub Pages |
| **Build for Docs** | `npm run deploy:ghdocs` | Build for docs folder |

---

## 🔧 Common Commands

### Development Workflow
```bash
# Daily development routine
./dev-env.sh    # Load environment variables
npm start       # Start development server
# Make changes...
# Server auto-reloads on save
```

### Production Deployment
```bash
# Deploy to production
./build-prod.sh                    # Build with production config
# Upload dist/KarolineRocha_Portfolio/ to your hosting platform
```

### Troubleshooting
```bash
# Fix common issues
npm install                        # Reinstall dependencies
./dev-env.sh                       # Reload environment variables
npm run build -- --delete-output-path  # Clear build cache
```

---

## 🔒 Security Checklist

### ✅ Before Committing
- [ ] `.env` file is in `.gitignore`
- [ ] No hardcoded secrets in code
- [ ] Environment variables are properly configured
- [ ] All sensitive data is in `.env` file

### ✅ Before Deploying
- [ ] Production environment variables are set
- [ ] Build completes without errors
- [ ] All services are working correctly
- [ ] HTTPS is configured (if applicable)

---

## 🌐 GitHub Pages Deployment

### Automatic Deployment (Recommended)
```bash
# Just push to main branch - GitHub Actions will handle the rest
git add .
git commit -m "Update portfolio"
git push origin main
```

### Manual Deployment
```bash
# Build and deploy manually
./build-prod.sh
npm run deploy
```

Your site will be available at: **https://karolinerrocha.github.io/KarolineRocha_Portfolio/**

---

## 📞 Need Help?

### Quick Fixes
1. **Environment not loading**: Run `./dev-env.sh`
2. **Build errors**: Run `npm install` then `./build-prod.sh`
3. **Server not starting**: Check if port 4200 is free

### Documentation
- 📖 [Full Deployment Guide](DEPLOYMENT.md)
- 🔒 [Security Guide](SECURITY.md)
- 📚 [Main README](README.md)

### Support
- 🐛 [Create Issue](https://github.com/KarolineRRocha/KarolineRocha_Portfolio/issues)
- 📧 Check existing issues for solutions

---

**⚡ Pro Tip**: Always run `./dev-env.sh` before starting development to ensure your environment variables are loaded correctly!
