# Contributing to Karoline Rocha Portfolio

Thank you for your interest in contributing to my portfolio project! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Angular CLI (version 15 or higher)
- Firebase account (for backend functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/karoline-rocha-portfolio.git
   cd karoline-rocha-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `src/environments/environment.ts.example` to `src/environments/environment.ts`
   - Update the Firebase configuration with your own credentials

4. **Run the development server**
   ```bash
   npm start
   ```

## 🛠️ Development Guidelines

### Code Style

- Follow Angular style guide conventions
- Use TypeScript strict mode
- Follow ESLint and Prettier configurations
- Use meaningful variable and function names
- Add comments for complex logic

### File Structure

```
src/
├── app/
│   ├── components/          # Reusable components
│   ├── pages/              # Page components
│   ├── core/               # Core services and modules
│   ├── shared/             # Shared components and modules
│   └── models/             # TypeScript interfaces
├── assets/                 # Static assets
└── environments/           # Environment configurations
```

### Component Guidelines

- Use Angular CLI to generate components: `ng generate component component-name`
- Follow the naming convention: `kebab-case` for files, `PascalCase` for classes
- Implement OnDestroy for components with subscriptions
- Use Angular's change detection strategies appropriately

### Service Guidelines

- Keep services focused on a single responsibility
- Use dependency injection
- Handle errors gracefully
- Add proper TypeScript types

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Description**: Clear description of the issue
2. **Steps to reproduce**: Detailed steps to reproduce the bug
3. **Expected behavior**: What you expected to happen
4. **Actual behavior**: What actually happened
5. **Environment**: Browser, OS, and version information
6. **Screenshots**: If applicable

## 💡 Feature Requests

When suggesting new features:

1. **Description**: Clear description of the feature
2. **Use case**: Why this feature would be useful
3. **Implementation ideas**: Any thoughts on how to implement it
4. **Mockups**: If applicable, include design mockups

## 🔧 Pull Request Process

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
   - Follow the coding guidelines
   - Add tests if applicable
   - Update documentation if needed
4. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Create a Pull Request**
   - Provide a clear description of the changes
   - Reference any related issues
   - Include screenshots if UI changes are involved

### Commit Message Format

Use conventional commit format:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

## 🧪 Testing

- Write unit tests for services and components
- Test user interactions and edge cases
- Ensure responsive design works on different screen sizes
- Test cross-browser compatibility

## 📱 Responsive Design

- Ensure all components work on mobile, tablet, and desktop
- Test with different screen sizes
- Use CSS Grid and Flexbox for layouts
- Optimize images for different devices

## 🔒 Security

- Never commit sensitive information (API keys, passwords)
- Use environment variables for configuration
- Validate user inputs
- Follow Angular security best practices

## 📚 Documentation

- Update README.md if needed
- Add JSDoc comments for complex functions
- Document any new environment variables
- Update component documentation

## 🎨 Design Guidelines

- Follow the existing design system
- Use the defined color palette and typography
- Maintain consistency with existing components
- Consider accessibility (WCAG guidelines)

## 🤝 Code Review

All pull requests will be reviewed. Please:

- Respond to review comments promptly
- Make requested changes
- Test your changes thoroughly
- Ensure the build passes

## 📞 Contact

If you have questions or need help:

- Open an issue on GitHub
- Check existing issues and discussions
- Follow the project's code of conduct

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to my portfolio! Your help is greatly appreciated! 🎉
