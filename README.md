# Karoline Rocha - Frontend Developer Portfolio

A modern, responsive portfolio website built with Angular 16.2.12 and TypeScript, showcasing frontend development expertise through elegant design and interactive user experiences.

## Live Demo

**[View Portfolio](https://karolinerrocha.github.io/KarolineRocha_Portfolio/)**

## Overview

This portfolio demonstrates modern web development practices with a focus on:

- **Clean Design**: Professional aesthetics with smooth animations
- **Responsive Layout**: Optimized for all devices and screen sizes
- **Performance**: Fast loading times and optimized interactions
- **User Experience**: Intuitive navigation and seamless interactions
- **Modern Stack**: Built with Angular 16, TypeScript, and SCSS

## Features

### Recent Improvements (Latest Updates)
- **Enhanced Mobile Responsiveness**: Optimized breakpoints for all screen sizes (320px to 1400px+)
- **Improved Navigation**: Fixed scroll behavior with proper header offset calculation
- **Contact Form Optimization**: Responsive input sizing and 100vh minimum height on mobile
- **Cross-Component Consistency**: Unified navigation methods across all components
- **Performance Optimizations**: Reduced CSS conflicts and improved build efficiency

### Design & User Experience
- Animated floating elements and smooth transitions
- Interactive code window with typing animations
- Modern typography and professional color scheme
- Mobile-first responsive design with optimized breakpoints
- Custom notifications and form validation
- Smooth scroll navigation with proper offset handling
- Responsive form inputs with adaptive sizing

### Technical Features
- Component-based architecture with Angular 16
- TypeScript for type safety and better development experience
- SCSS for advanced styling and maintainable CSS
- Reactive forms with custom validation
- Route protection and secure admin access
- Lazy loading for optimal performance

### Admin Management
- Secure authentication system
- Project management with CRUD operations
- Image upload and management
- Real-time UI synchronization

## Tech Stack

### Frontend
- **Angular 16.2.12** - Modern web framework
- **TypeScript 4.9.5** - Type-safe JavaScript
- **SCSS** - Advanced CSS preprocessing
- **CSS Grid & Flexbox** - Modern layout techniques
- **RxJS 7.8.2** - Reactive programming library

### Development Tools
- **Angular CLI** - Development and build tools
- **Git** - Version control
- **GitHub Pages** - Hosting and deployment

### External Services
- **EmailJS** - Contact form integration
- **GitHub API** - Project data synchronization

## Getting Started

### Prerequisites
- Node.js (v18 or higher - LTS version recommended)
- npm or yarn package manager
- Angular CLI (v16 or higher)

### Quick Start

For a quick setup, see our **[⚡ Quick Start Guide](QUICK_START.md)**.

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/KarolineRRocha/KarolineRocha_Portfolio.git
   cd KarolineRocha_Portfolio
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment files (IMPORTANT!)
   ```bash
   ./setup-env.sh
   ```
   Then edit the `.env` file with your actual API keys and credentials.

   **🔒 Security Note**: Never commit the `.env` file to version control!

4. Start development server
   ```bash
   ./dev-env.sh  # Load environment variables
   npm start     # Start development server
   ```

5. Open your browser and navigate to `http://localhost:4200`

### Documentation

- **[⚡ Quick Start Guide](QUICK_START.md)** - Get started in 5 minutes
- **[🚀 Deployment Guide](DEPLOYMENT.md)** - Complete deployment instructions
- **[🔒 Security Guide](SECURITY.md)** - Security best practices
- **[🔧 GitHub Setup Guide](GITHUB_SETUP.md)** - Configure environment variables
- **[🔗 SPA Routing Guide](SPA_ROUTING.md)** - GitHub Pages routing configuration

### Build for Production

To build the project for production:

```bash
./build-prod.sh
```

The build artifacts will be stored in the `dist/KarolineRocha_Portfolio/` directory.

### Deploy to GitHub Pages

The project is configured for automatic deployment to GitHub Pages:

1. **Automatic Deployment**: Just push to the main branch - GitHub Actions will handle the build and deployment
2. **Manual Deployment**: Run `npm run deploy` to manually deploy to GitHub Pages

Your site will be available at: **https://karolinerrocha.github.io/KarolineRocha_Portfolio/**

## Project Structure

```
src/
├── app/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Main page components
│   ├── services/           # Business logic and API calls
│   ├── models/             # TypeScript interfaces
│   ├── constants/          # Application constants
│   └── shared/             # Shared utilities and pipes
├── assets/                 # Static assets (images, icons)
├── environments/           # Environment configurations
└── styles/                 # Global styles and variables
```

## Design System

### Color Palette
- **Primary**: `#00d4ff` (Bright cyan)
- **Accent**: `#ff1493` (Deep pink)
- **Dark**: `#1a1a1a` (Dark gray)
- **Light**: `#f8f9fa` (Light gray)

### Typography
- **Sans-serif**: Inter, system fonts
- **Monospace**: JetBrains Mono, Fira Code
- **Responsive**: Scalable font sizes

### Spacing
- Consistent spacing system (4px, 8px, 16px, 24px, 32px, 48px, 64px)
- Responsive breakpoints for different screen sizes

## Configuration

### Environment Setup

**⚠️ IMPORTANT: Never commit sensitive tokens or credentials to version control!**

The project uses a secure environment variable system. See the [Security Guide](SECURITY.md) for detailed setup instructions.

### Required Services Setup

#### GitHub Personal Access Token
1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate new token with scopes: `public_repo`, `read:user`
3. Add the token to your `.env` file

#### EmailJS Configuration
1. Create an account at [EmailJS](https://www.emailjs.com/)
2. Set up email service and template
3. Get your Service ID, Template ID, and User ID
4. Add them to your `.env` file

### Security Notes
- Environment variables are stored in `.env` files (ignored by Git)
- Use strong, unique passwords
- Rotate tokens regularly
- See [SECURITY.md](SECURITY.md) for detailed security guidelines

## Deployment

The project is configured for automatic deployment to GitHub Pages. See the [Deployment Guide](DEPLOYMENT.md) for detailed instructions.

## Security

### 🔒 Security Guidelines

This project follows strict security practices to protect sensitive information:

- **Environment Files**: Sensitive data is stored in environment files that are ignored by Git
- **Token Management**: API tokens and credentials are never committed to version control
- **Access Control**: Admin credentials are securely configured
- **Regular Updates**: Dependencies are regularly updated for security patches

For detailed security information, see [SECURITY.md](SECURITY.md).

### 🚨 If You Find a Security Issue

If you discover a security vulnerability, please:

1. **Do NOT create a public issue**
2. Contact the maintainer privately
3. Provide detailed information about the vulnerability
4. Allow time for the issue to be addressed

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow Angular style guide
- Use TypeScript strict mode
- Write meaningful commit messages
- Add tests for new features

## Contact

**Karoline Rocha** - Frontend Developer

- **Email**: [emaildakarolineribeiro@gmail.com](mailto:emaildakarolineribeiro@gmail.com)
- **LinkedIn**: [Karoline Rocha](https://www.linkedin.com/in/karoline-rrocha/)
- **GitHub**: [KarolineRRocha](https://github.com/KarolineRRocha)

---

**Made with Angular 16.2.12, TypeScript 4.9.5, and SCSS** 
# Test deploy with PORTFOLIO_ variables configured
