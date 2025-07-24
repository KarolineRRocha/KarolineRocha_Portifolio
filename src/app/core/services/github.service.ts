import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { ProjectsService, NewProjectData } from './projects.service';

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  homepage: string;
  language: string;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  stargazers_count: number;
  forks_count: number;
  archived: boolean;
  disabled: boolean;
  fork: boolean;
  private: boolean;
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class GitHubService {
  private readonly GITHUB_API_BASE = 'https://api.github.com';
  private readonly STORAGE_KEY = 'github_last_sync';
  private readonly SYNC_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

  constructor(
    private http: HttpClient,
    private projectsService: ProjectsService
  ) { }

  // Get user information
  getUserInfo(username: string): Observable<GitHubUser> {
    return this.http.get<GitHubUser>(`${this.GITHUB_API_BASE}/users/${username}`).pipe(
      catchError(error => {
        // Handle different types of errors gracefully
        if (error.status === 404) {
          console.warn(`GitHub user '${username}' not found`);
          return throwError(() => new Error(`User '${username}' not found on GitHub`));
        } else if (error.status === 403) {
          console.warn('GitHub API rate limit exceeded');
          return throwError(() => new Error('GitHub API rate limit exceeded. Please try again later.'));
        } else if (error.status === 0 || error.status >= 500) {
          console.warn('GitHub API server error or network issue');
          return throwError(() => new Error('Unable to connect to GitHub. Please check your internet connection.'));
        } else {
          console.error('Error fetching user info:', error);
          return throwError(() => new Error('Failed to fetch user information'));
        }
      })
    );
  }

  // Get all public repositories
  getPublicRepositories(username: string): Observable<GitHubRepo[]> {
    return this.http.get<GitHubRepo[]>(`${this.GITHUB_API_BASE}/users/${username}/repos`).pipe(
      map(repos => repos.filter(repo =>
        !repo.private &&
        !repo.archived &&
        !repo.disabled &&
        !repo.fork &&
        repo.description &&
        repo.description.length > 0
      )),
      map(repos => repos.sort((a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )),
      catchError(error => {
        // Handle different types of errors gracefully
        if (error.status === 404) {
          console.warn(`GitHub user '${username}' not found`);
          return of([]); // Return empty array instead of throwing error
        } else if (error.status === 403) {
          console.warn('GitHub API rate limit exceeded');
          return of([]); // Return empty array instead of throwing error
        } else if (error.status === 0 || error.status >= 500) {
          console.warn('GitHub API server error or network issue');
          return of([]); // Return empty array instead of throwing error
        } else {
          console.error('Error fetching repositories:', error);
          return of([]); // Return empty array instead of throwing error
        }
      })
    );
  }

  // Get repository details with topics
  getRepositoryDetails(username: string, repoName: string): Observable<GitHubRepo> {
    return this.http.get<GitHubRepo>(`${this.GITHUB_API_BASE}/repos/${username}/${repoName}`).pipe(
      catchError(error => {
        console.error('Error fetching repository details:', error);
        return throwError(() => new Error('Failed to fetch repository details'));
      })
    );
  }

  // Check for new repositories and update automatically
  checkForNewRepositories(username: string): Observable<{ newRepos: number; updated: number }> {
    return this.getPublicRepositories(username).pipe(
      map(repos => {
        const existingProjects = this.projectsService.getProjects();
        const existingRepoIds = existingProjects
          .filter(p => p.id.startsWith('github-'))
          .map(p => p.id.replace('github-', ''));

        const newRepos = repos.filter(repo =>
          !existingRepoIds.includes(repo.id.toString())
        );

        if (newRepos.length > 0) {
          console.log(`Found ${newRepos.length} new repositories:`, newRepos.map(r => r.name));

          // Process new repositories
          const result = this.processRepositories(newRepos);

          return {
            newRepos: result.added,
            updated: result.updated
          };
        }

        return { newRepos: 0, updated: 0 };
      }),
      catchError(error => {
        console.error('Error checking for new repositories:', error);
        return of({ newRepos: 0, updated: 0 });
      })
    );
  }

  // Auto-sync repositories with portfolio
  autoSyncRepositories(username: string): Observable<{ added: number; updated: number; total: number }> {
    return this.getPublicRepositories(username).pipe(
      map(repos => this.processRepositories(repos)),
      tap(result => {
        this.updateLastSync();
        console.log(`GitHub sync completed: ${result.added} added, ${result.updated} updated`);
      }),
      catchError(error => {
        console.error('Auto-sync failed:', error);
        // Return a default result instead of throwing error
        return of({ added: 0, updated: 0, total: 0 });
      })
    );
  }

  // Process repositories and add/update them in portfolio
  private processRepositories(repos: GitHubRepo[]): { added: number; updated: number; total: number } {
    let added = 0;
    let updated = 0;
    const existingProjects = this.projectsService.getProjects();

    // Sort repositories by creation date (newest first to show newest projects first)
    const sortedRepos = repos.sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Find the highest order number for new projects (only for truly new projects)
    // This ensures new projects appear at the top while keeping existing projects in their current order
    const maxOrder = existingProjects.length > 0 ? Math.max(...existingProjects.map(p => p.order || 0)) : 5;
    let nextOrder = Math.max(maxOrder + 1, 6); // Ensure minimum order is 6

    sortedRepos.forEach((repo) => {
      const projectId = `github-${repo.id}`;
      const formattedName = this.formatProjectName(repo.name);

      // Check if project already exists by GitHub ID
      let existingProject = existingProjects.find(p => p.id === projectId);

      // Also check if project exists by name (for backward compatibility)
      if (!existingProject) {
        existingProject = existingProjects.find(p =>
          p.name.toLowerCase() === formattedName.toLowerCase() ||
          p.projectUrl === repo.html_url ||
          // Check for exact name matches to prevent duplicates like "Upload"
          p.name.toLowerCase() === repo.name.toLowerCase()
        );
      }

      const projectData = {
        name: formattedName,
        description: repo.description || 'No description available',
        technologies: this.extractTechnologies(repo).join(', '),
        imageUrl: this.generateProjectImage(repo),
        demoUrl: repo.homepage || repo.html_url,
        projectUrl: repo.html_url,
        category: 'completed' as const,
        createdAt: new Date(repo.created_at),
        updatedAt: new Date(repo.pushed_at)
      };

      if (existingProject) {
        // Update existing project while preserving original order and data
        const updatedProject = this.projectsService.updateProject(existingProject.id, {
          ...projectData,
          technologies: this.extractTechnologies(repo), // Convert to array
          id: projectId, // Ensure GitHub ID is set
          createdAt: existingProject.createdAt, // Preserve original creation date
          featured: existingProject.featured, // Preserve featured status
          order: existingProject.order // Preserve existing order - DO NOT CHANGE
        });
        if (updatedProject) updated++;
      } else {
        // Add new project with next order number
        const newProjectData: NewProjectData = {
          name: projectData.name,
          description: projectData.description,
          technologies: projectData.technologies,
          imageUrl: projectData.imageUrl,
          demoUrl: projectData.demoUrl,
          projectUrl: projectData.projectUrl,
          category: projectData.category
        };

        // Create project with custom ID and metadata
        const project = this.projectsService.addProject(newProjectData);
        if (project) {
          // Update the project with GitHub-specific data and new order number
          this.projectsService.updateProject(project.id, {
            id: projectId,
            createdAt: projectData.createdAt,
            updatedAt: projectData.updatedAt,
            order: nextOrder // Assign new order number only for new projects
          });
          added++;
          nextOrder++; // Increment for next new project
        }
      }
    });

    return { added, updated, total: repos.length };
  }

  // Format project name for display
  private formatProjectName(repoName: string): string {
    return repoName
      .replace(/-/g, ' ')
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Extract technologies from repository
  private extractTechnologies(repo: GitHubRepo): string[] {
    const technologies: string[] = [];

    // Add primary language
    if (repo.language) {
      technologies.push(repo.language);
    }

    // Add topics as technologies
    if (repo.topics && repo.topics.length > 0) {
      technologies.push(...repo.topics.filter(topic =>
        !technologies.includes(topic) &&
        topic.length > 0
      ));
    }

    // Map common technologies
    const techMapping: { [key: string]: string } = {
      'javascript': 'JavaScript',
      'typescript': 'TypeScript',
      'html': 'HTML5',
      'css': 'CSS3',
      'scss': 'SCSS',
      'sass': 'Sass',
      'react': 'React',
      'vue': 'Vue.js',
      'angular': 'Angular',
      'node': 'Node.js',
      'express': 'Express.js',
      'mongodb': 'MongoDB',
      'mysql': 'MySQL',
      'postgresql': 'PostgreSQL',
      'firebase': 'Firebase',
      'aws': 'AWS',
      'docker': 'Docker',
      'kubernetes': 'Kubernetes',
      'git': 'Git',
      'github': 'GitHub',
      'gitlab': 'GitLab',
      'figma': 'Figma',
      'adobe': 'Adobe',
      'bootstrap': 'Bootstrap',
      'tailwind': 'Tailwind CSS',
      'material-ui': 'Material-UI',
      'ant-design': 'Ant Design',
      'redux': 'Redux',
      'vuex': 'Vuex',
      'pinia': 'Pinia',
      'jest': 'Jest',
      'cypress': 'Cypress',
      'webpack': 'Webpack',
      'vite': 'Vite',
      'next': 'Next.js',
      'nuxt': 'Nuxt.js',
      'gatsby': 'Gatsby',
      'wordpress': 'WordPress',
      'php': 'PHP',
      'laravel': 'Laravel',
      'python': 'Python',
      'django': 'Django',
      'flask': 'Flask',
      'java': 'Java',
      'spring': 'Spring',
      'csharp': 'C#',
      'dotnet': '.NET',
      'swift': 'Swift',
      'kotlin': 'Kotlin',
      'flutter': 'Flutter',
      'react-native': 'React Native',
      'expo': 'Expo'
    };

    return technologies.map(tech =>
      techMapping[tech.toLowerCase()] || tech
    ).filter((tech, index, arr) => arr.indexOf(tech) === index);
  }

  // Generate project image URL
  private generateProjectImage(repo: GitHubRepo): string {
    // Try to get project logo from various sources
    const logoUrl = this.getProjectLogo(repo);
    if (logoUrl) {
      return logoUrl;
    }

    // Fallback to generated image based on project name
    return this.generateFallbackImage(repo);
  }

  // Get project logo from various sources
  private getProjectLogo(repo: GitHubRepo): string | null {
    // 1. Try to get logo from GitHub repository (if it exists)
    const githubLogoUrl = this.getGitHubRepoLogo(repo);
    if (githubLogoUrl) {
      return githubLogoUrl;
    }

    // 2. Try to get logo based on primary technology
    const techLogoUrl = this.getTechnologyLogo(repo.language);
    if (techLogoUrl) {
      return techLogoUrl;
    }

    // 3. Try to get logo based on project name/keywords
    const nameLogoUrl = this.getProjectNameLogo(repo.name);
    if (nameLogoUrl) {
      return nameLogoUrl;
    }

    return null;
  }

  // Try to get logo from GitHub repository
  private getGitHubRepoLogo(repo: GitHubRepo): string | null {
    // Common logo file names in repositories
    const logoFiles = [
      'logo.png', 'logo.jpg', 'logo.svg', 'logo.jpeg',
      'icon.png', 'icon.svg', 'icon.jpg',
      'favicon.ico', 'favicon.png', 'favicon.svg',
      'readme.md', 'README.md', // Some repos have logos in README
      'assets/logo.png', 'assets/logo.svg',
      'public/logo.png', 'public/logo.svg',
      'src/assets/logo.png', 'src/assets/logo.svg'
    ];

    // For now, we'll use a more sophisticated approach to get repository logos
    // This could be enhanced with actual API calls to check for these files
    return this.checkRepositoryForLogo(repo);
  }

  // Check if repository has a logo file
  private checkRepositoryForLogo(repo: GitHubRepo): string | null {
    // Try to construct a potential logo URL based on common patterns
    const potentialLogoUrls = [
      `https://raw.githubusercontent.com/${repo.full_name}/main/logo.png`,
      `https://raw.githubusercontent.com/${repo.full_name}/main/logo.svg`,
      `https://raw.githubusercontent.com/${repo.full_name}/master/logo.png`,
      `https://raw.githubusercontent.com/${repo.full_name}/master/logo.svg`,
      `https://raw.githubusercontent.com/${repo.full_name}/main/assets/logo.png`,
      `https://raw.githubusercontent.com/${repo.full_name}/main/assets/logo.svg`,
      `https://raw.githubusercontent.com/${repo.full_name}/main/public/logo.png`,
      `https://raw.githubusercontent.com/${repo.full_name}/main/public/logo.svg`,
      `https://raw.githubusercontent.com/${repo.full_name}/main/src/assets/logo.png`,
      `https://raw.githubusercontent.com/${repo.full_name}/main/src/assets/logo.svg`
    ];

    // For now, return null as we'd need to make HTTP requests to check if these exist
    // In a production environment, you could implement a service to check these URLs
    return null;
  }

  // Get technology logo based on primary language
  private getTechnologyLogo(language: string): string | null {
    const techLogos: { [key: string]: string } = {
      'JavaScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
      'TypeScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
      'HTML': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
      'CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
      'React': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      'Angular': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
      'Vue': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
      'Node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      'Python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'Java': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
      'PHP': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
      'Laravel': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-plain.svg',
      'Docker': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
      'Git': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
      'GitHub': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
      'MongoDB': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
      'MySQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
      'PostgreSQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
      'Firebase': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
      'AWS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg',
      'Figma': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
      'Tailwind CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg',
      'Bootstrap': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg',
      'Sass': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg',
      'SCSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg'
    };

    return techLogos[language] || null;
  }

  // Get logo based on project name/keywords
  private getProjectNameLogo(projectName: string): string | null {
    const name = projectName.toLowerCase();

    // Map common project names to logos
    const projectLogos: { [key: string]: string } = {
      // Video/Media Projects
      'upload': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
      'video': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
      'media': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
      'stream': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',

      // Portfolio/Personal Projects
      'portfolio': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
      'personal': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
      'profile': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',

      // Blog/Content Projects
      'blog': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg',
      'cms': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg',
      'content': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg',

      // E-commerce Projects
      'ecommerce': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/shopify/shopify-original.svg',
      'shop': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/shopify/shopify-original.svg',
      'store': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/shopify/shopify-original.svg',

      // Gaming Projects
      'game': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg',
      'gaming': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
      'mundo dos jogos': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
      'jogos': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',

      // App Projects
      'app': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      'mobile': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      'react-native': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',

      // API/Backend Projects
      'api': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      'backend': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      'server': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',

      // Dashboard/Admin Projects
      'dashboard': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chartjs/chartjs-original.svg',
      'admin': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chartjs/chartjs-original.svg',
      'analytics': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chartjs/chartjs-original.svg',

      // Food/Cooking Projects
      'cookbook': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      'cooking': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      'recipe': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      'food': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',

      // Social/Community Projects
      'social': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      'community': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      'chat': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',

      // Learning/Education Projects
      'learning': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      'education': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      'tutorial': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',

      // Weather/Data Projects
      'weather': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
      'data': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
      'chart': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chartjs/chartjs-original.svg'
    };

    // Check for exact matches first
    if (projectLogos[name]) {
      return projectLogos[name];
    }

    // Check for partial matches (more flexible)
    for (const [keyword, logo] of Object.entries(projectLogos)) {
      if (name.includes(keyword) || keyword.includes(name)) {
        return logo;
      }
    }

    // Check for technology keywords in the name
    const techKeywords = {
      'react': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      'angular': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
      'vue': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
      'node': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      'python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'java': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
      'php': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
      'laravel': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-plain.svg',
      'docker': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
      'git': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
      'github': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
      'mongodb': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
      'mysql': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
      'postgres': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
      'firebase': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
      'aws': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg',
      'figma': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
      'tailwind': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg',
      'bootstrap': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg',
      'sass': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg',
      'scss': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg'
    };

    for (const [tech, logo] of Object.entries(techKeywords)) {
      if (name.includes(tech)) {
        return logo;
      }
    }

    return null;
  }

  // Generate fallback image when no logo is available
  private generateFallbackImage(repo: GitHubRepo): string {
    // Create a gradient image based on the repository name
    const colors = [
      '00d4ff,ffffff', // Blue to white
      'ff6b35,ffffff', // Orange to white
      '28a745,ffffff', // Green to white
      '6f42c1,ffffff', // Purple to white
      'fd7e14,ffffff', // Orange to white
      'e83e8c,ffffff', // Pink to white
      '20c997,ffffff', // Teal to white
      'dc3545,ffffff'  // Red to white
    ];

    const colorIndex = repo.id % colors.length;
    const colorset = colors[colorIndex];

    // Create a gradient image with the project name
    const projectName = encodeURIComponent(repo.name);
    return `https://via.placeholder.com/400x200/${colorset}?text=${projectName}`;
  }

  // Check if sync is needed
  shouldSync(): boolean {
    const lastSync = localStorage.getItem(this.STORAGE_KEY);
    if (!lastSync) return true;

    const lastSyncTime = new Date(lastSync).getTime();
    const now = new Date().getTime();

    return (now - lastSyncTime) > this.SYNC_INTERVAL;
  }

  // Update last sync timestamp
  private updateLastSync(): void {
    localStorage.setItem(this.STORAGE_KEY, new Date().toISOString());
  }

  // Get last sync time
  getLastSyncTime(): Date | null {
    const lastSync = localStorage.getItem(this.STORAGE_KEY);
    return lastSync ? new Date(lastSync) : null;
  }

  // Manual sync with specific username
  manualSync(username: string): Observable<{ added: number; updated: number; total: number }> {
    return this.autoSyncRepositories(username);
  }

  // Get sync status
  getSyncStatus(): { lastSync: Date | null; shouldSync: boolean; nextSync: Date | null } {
    const lastSync = this.getLastSyncTime();
    const shouldSync = this.shouldSync();
    const nextSync = lastSync ? new Date(lastSync.getTime() + this.SYNC_INTERVAL) : null;

    return { lastSync, shouldSync, nextSync };
  }

  // Get detailed sync information
  getDetailedSyncInfo(username: string): Observable<{
    totalRepos: number;
    eligibleRepos: number;
    existingProjects: number;
    newProjects: number;
    syncNeeded: boolean;
    lastSync: Date | null;
  }> {
    return this.getPublicRepositories(username).pipe(
      map(repos => {
        const existingProjects = this.projectsService.getProjects();
        const githubProjectIds = existingProjects
          .filter(p => p.id.startsWith('github-'))
          .map(p => p.id.replace('github-', ''));

        const eligibleRepos = repos.filter(repo =>
          !repo.private &&
          !repo.archived &&
          !repo.disabled &&
          !repo.fork &&
          repo.description &&
          repo.description.length > 0
        );

        const existingCount = eligibleRepos.filter(repo =>
          githubProjectIds.includes(repo.id.toString())
        ).length;

        return {
          totalRepos: repos.length,
          eligibleRepos: eligibleRepos.length,
          existingProjects: existingCount,
          newProjects: eligibleRepos.length - existingCount,
          syncNeeded: this.shouldSync(),
          lastSync: this.getLastSyncTime()
        };
      }),
      catchError(error => {
        console.error('Error getting detailed sync info:', error);
        return of({
          totalRepos: 0,
          eligibleRepos: 0,
          existingProjects: 0,
          newProjects: 0,
          syncNeeded: this.shouldSync(),
          lastSync: this.getLastSyncTime()
        });
      })
    );
  }
}
