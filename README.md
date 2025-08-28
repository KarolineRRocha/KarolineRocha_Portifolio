# Karoline Rocha - Frontend Developer Portfolio

A modern, responsive portfolio website built with Angular 16 and TypeScript, showcasing frontend development expertise through elegant design and interactive user experiences.

## Live Demo

**[View Portfolio](https://karolinerrocha.github.io/karoline-rocha-portifolio/)**

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
   git clone https://github.com/KarolineRRocha/karoline-rocha-portifolio.git
   cd karoline-rocha-portifolio
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start development server
   ```bash
   ng serve
   ```

4. Open your browser and navigate to `http://localhost:4200`

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
Create environment files for different deployment stages:

```typescript
// environment.ts
export const environment = {
  production: false,
  github: {
    username: 'your-github-username',
    apiUrl: 'https://api.github.com'
  },
  email: {
    serviceId: 'your-emailjs-service-id',
    templateId: 'your-emailjs-template-id',
    userId: 'your-emailjs-user-id'
  }
};
```

### Admin Configuration
Set up admin credentials in environment files:
```typescript
admin: {
  defaultUsername: 'your-admin-email',
  defaultPassword: 'your-secure-password'
}
```

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
