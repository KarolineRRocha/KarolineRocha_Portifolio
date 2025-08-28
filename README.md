# Karoline Rocha - Frontend Developer Portfolio

A modern, responsive portfolio website built with Angular 16 and TypeScript, showcasing frontend development expertise through elegant design and interactive user experiences.

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

### Design & User Experience
- Animated floating elements and smooth transitions
- Interactive code window with typing animations
- Modern typography and professional color scheme
- Mobile-first responsive design
- Custom notifications and form validation

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
- **Angular 16** - Modern web framework
- **TypeScript** - Type-safe JavaScript
- **SCSS** - Advanced CSS preprocessing
- **CSS Grid & Flexbox** - Modern layout techniques

### Development Tools
- **Angular CLI** - Development and build tools
- **Git** - Version control
- **GitHub Pages** - Hosting and deployment

### External Services
- **EmailJS** - Contact form integration
- **GitHub API** - Project data synchronization

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

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
   Then edit the created environment files with your actual values.

4. Start development server
   ```bash
   ng serve
   ```

5. Open your browser and navigate to `http://localhost:4200`

### Build for Production
```bash
ng build --configuration production
```

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

1. Copy the example environment file:
   ```bash
   cp src/environments/environment.example.ts src/environments/environment.ts
   cp src/environments/environment.example.ts src/environments/environment.prod.ts
   ```

2. Configure your environment files with your actual values:
   ```typescript
   // environment.ts
   export const environment = {
     production: false,
     github: {
       username: 'your-github-username',
       apiUrl: 'https://api.github.com',
       token: 'your-github-personal-access-token'
     },
     email: {
       serviceId: 'your-emailjs-service-id',
       templateId: 'your-emailjs-template-id',
       userId: 'your-emailjs-user-id'
     },
     admin: {
       defaultUsername: 'your-admin-email',
       defaultPassword: 'your-secure-password'
     }
   };
   ```

### Required Services Setup

#### GitHub Personal Access Token
1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate new token with scopes: `public_repo`, `read:user`
3. Add the token to your environment files

#### EmailJS Configuration
1. Create an account at [EmailJS](https://www.emailjs.com/)
2. Set up email service and template
3. Get your Service ID, Template ID, and User ID
4. Add them to your environment files

### Security Notes
- Environment files are ignored by Git (see `.gitignore`)
- Use strong, unique passwords
- Rotate tokens regularly
- See [SECURITY.md](SECURITY.md) for detailed security guidelines

## Deployment

### GitHub Pages
1. Build the project
   ```bash
   ng build --configuration production
   ```

2. Deploy to GitHub Pages
   ```bash
   ng deploy --base-href=https://yourusername.github.io/your-repo/
   ```

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

**Made with Angular 16, TypeScript, and SCSS** 
