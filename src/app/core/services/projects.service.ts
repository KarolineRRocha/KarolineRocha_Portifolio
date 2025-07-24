import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  demoUrl?: string;
  projectUrl?: string;
  category: 'completed' | 'coming-soon';
  createdAt: Date;
  updatedAt: Date;
  featured?: boolean;
  order?: number;
}

export interface NewProjectData {
  name: string;
  description: string;
  technologies: string;
  imageUrl: string;
  demoUrl: string;
  projectUrl: string;
  category: 'completed' | 'coming-soon';
}

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private readonly STORAGE_KEY = 'portfolio_projects';
  private projectsSubject = new BehaviorSubject<Project[]>([]);
  public projects$ = this.projectsSubject.asObservable();

  constructor() {
    this.loadProjects();
  }

  private loadProjects(): void {
    try {
      console.log(`📂 Loading projects from localStorage...`);
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        console.log(`📂 Found stored data, length: ${stored.length}`);
        const projects = JSON.parse(stored).map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt)
        }));
        console.log(`📂 Loaded ${projects.length} projects from localStorage`);
        this.projectsSubject.next(projects);
      } else {
        console.log(`📂 No stored data found, initializing default projects`);
        // Initialize with default projects
        this.initializeDefaultProjects();
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      console.log(`📂 Error parsing stored data, initializing default projects`);
      this.initializeDefaultProjects();
    }
  }

  private saveProjects(projects: Project[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
      this.projectsSubject.next(projects);
    } catch (error) {
      console.error('Error saving projects:', error);
    }
  }

  private initializeDefaultProjects(): void {
    console.log(`🔄 Initializing default projects - this should NOT happen during normal sync!`);
    const defaultProjects: Project[] = [
      {
        id: 'cesae-book-space',
        name: 'CESAE Book Space',
        description: 'Educational platform for CESAE students and teachers',
        technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
        imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
        demoUrl: undefined, // No GitHub Pages demo available
        projectUrl: 'https://github.com/KarolineRRocha/CESAE_Book_Space',
        category: 'completed',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        featured: true,
        order: 1
      },
      {
        id: 'freeplayfinder',
        name: 'FreePlayFinder',
        description: 'A gaming discovery platform that helps users find free-to-play games across multiple platforms. Features advanced filtering, user reviews, and personalized recommendations.',
        technologies: ['Angular', 'TypeScript', 'Node.js'],
        imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
        demoUrl: 'https://karolinerrocha.github.io/FreePlayFinder/',
        projectUrl: 'https://github.com/KarolineRRocha/FreePlayFinder',
        category: 'completed',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
        featured: true,
        order: 2
      },
      {
        id: 'ecofab',
        name: 'Ecofab',
        description: 'Sustainable manufacturing platform',
        technologies: ['Angular', 'TypeScript', 'SCSS', 'Firebase'],
        imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
        demoUrl: 'https://karolinerrocha.github.io/Ecofab/',
        projectUrl: 'https://github.com/KarolineRRocha/Ecofab',
        category: 'completed',
        createdAt: new Date('2024-02-20'),
        updatedAt: new Date('2024-02-20'),
        featured: true,
        order: 3
      },
      {
        id: 'upload',
        name: 'Upload',
        description: 'Video sharing platform built with Angular and TypeScript',
        technologies: ['Angular', 'TypeScript', 'SCSS'],
        imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
        demoUrl: 'https://karolinerrocha.github.io/Upload/',
        projectUrl: 'https://github.com/KarolineRRocha/Upload',
        category: 'completed',
        createdAt: new Date('2024-03-10'),
        updatedAt: new Date('2024-03-10'),
        featured: true,
        order: 4
      },
      {
        id: 'old-games',
        name: 'Old Games',
        description: 'Interactive gaming platform with multiple game categories',
        technologies: ['HTML5', 'CSS3', 'JavaScript'],
        imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
        demoUrl: 'https://karolinerrocha.github.io/Old_Games/',
        projectUrl: 'https://github.com/KarolineRRocha/Old_Games',
        category: 'completed',
        createdAt: new Date('2024-04-15'),
        updatedAt: new Date('2024-04-15'),
        featured: true,
        order: 5
      },
      {
        id: 'they-develop-and-cook',
        name: 'They Develop and Cook',
        description: 'Collaborative cookbook platform for developers',
        technologies: ['React', 'Node.js', 'MongoDB'],
        imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
        demoUrl: 'https://karolinerrocha.github.io/They_develop_and_cook/',
        projectUrl: 'https://github.com/KarolineRRocha/They_develop_and_cook',
        category: 'completed',
        createdAt: new Date('2024-10-20'),
        updatedAt: new Date('2024-10-20'),
        featured: true,
        order: 6
      },
      {
        id: 'project-7',
        name: 'Project 7',
        description: 'Exciting new project in development',
        technologies: ['Next.js', 'TypeScript', 'Tailwind'],
        imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
        category: 'coming-soon',
        createdAt: new Date('2024-12-15'),
        updatedAt: new Date('2024-12-15'),
        order: 7
      },
      {
        id: 'project-8',
        name: 'Project 8',
        description: 'Innovative web application',
        technologies: ['Vue.js', 'Firebase', 'Vuetify'],
        imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
        category: 'coming-soon',
        createdAt: new Date('2024-12-10'),
        updatedAt: new Date('2024-12-10'),
        order: 8
      }
    ];
    this.saveProjects(defaultProjects);
  }

  getProjects(): Project[] {
    return this.projectsSubject.value;
  }

  getCompletedProjects(): Project[] {
    return this.getProjects()
      .filter(p => p.category === 'completed')
      .sort((a, b) => (b.order || 0) - (a.order || 0)); // Keep existing order (highest first)
  }

  getComingSoonProjects(): Project[] {
    return this.getProjects()
      .filter(p => p.category === 'coming-soon')
      .sort((a, b) => (a.order || 0) - (b.order || 0)); // Sort by order field, lowest first
  }

  getFeaturedProjects(): Project[] {
    return this.getProjects()
      .filter(p => p.featured)
      .sort((a, b) => (b.order || 0) - (a.order || 0)); // Recent projects first
  }

  addProject(projectData: NewProjectData): Project {
    const projects = this.getProjects();

    // Find the highest order number and add 1 for the new project
    // This ensures new projects appear at the top while keeping existing projects in their current order
    const maxOrder = projects.length > 0 ? Math.max(...projects.map(p => p.order || 0)) : 5;
    const nextOrder = Math.max(maxOrder + 1, 6); // Ensure minimum order is 6

    const newProject: Project = {
      id: this.generateId(projectData.name),
      name: projectData.name,
      description: projectData.description,
      technologies: projectData.technologies.split(',').map(t => t.trim()).filter(t => t),
      imageUrl: projectData.imageUrl || '',
      demoUrl: projectData.demoUrl || undefined,
      projectUrl: projectData.projectUrl || undefined,
      category: projectData.category,
      createdAt: new Date(),
      updatedAt: new Date(),
      order: nextOrder // Assign highest order + 1 (newest on top)
    };

    projects.push(newProject);
    this.saveProjects(projects);
    return newProject;
  }

  updateProject(id: string, updates: Partial<Project>): Project | null {
    const projects = this.getProjects();
    const index = projects.findIndex(p => p.id === id);

    if (index === -1) return null;

    projects[index] = {
      ...projects[index],
      ...updates,
      updatedAt: new Date()
    };

    this.saveProjects(projects);
    return projects[index];
  }

  deleteProject(id: string): boolean {
    const projects = this.getProjects();
    const filtered = projects.filter(p => p.id !== id);

    if (filtered.length === projects.length) return false;

    this.saveProjects(filtered);
    return true;
  }

  reorderProjects(projectIds: string[]): void {
    const projects = this.getProjects();
    const updated = projects.map(project => ({
      ...project,
      order: projectIds.indexOf(project.id) + 1
    }));

    this.saveProjects(updated);
  }

  toggleFeatured(id: string): boolean {
    const project = this.getProjects().find(p => p.id === id);
    if (!project) return false;

    this.updateProject(id, { featured: !project.featured });
    return true;
  }

  exportProjects(): string {
    const projects = this.getProjects();
    return JSON.stringify(projects, null, 2);
  }

  importProjects(jsonData: string): boolean {
    try {
      const projects = JSON.parse(jsonData);
      if (Array.isArray(projects)) {
        this.saveProjects(projects);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing projects:', error);
      return false;
    }
  }

  private generateId(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  // Utility methods for automation
  getProjectStats() {
    const projects = this.getProjects();
    return {
      total: projects.length,
      completed: projects.filter(p => p.category === 'completed').length,
      comingSoon: projects.filter(p => p.category === 'coming-soon').length,
      featured: projects.filter(p => p.featured).length,
      lastUpdated: projects.length > 0 ?
        new Date(Math.max(...projects.map(p => p.updatedAt.getTime()))) : null
    };
  }

  searchProjects(query: string): Project[] {
    const projects = this.getProjects();
    const searchTerm = query.toLowerCase();

    return projects.filter(project =>
      project.name.toLowerCase().includes(searchTerm) ||
      project.description.toLowerCase().includes(searchTerm) ||
      project.technologies.some(tech => tech.toLowerCase().includes(searchTerm))
    );
  }

  // Clear localStorage and reset to default projects
  resetToDefaultProjects(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.initializeDefaultProjects();
  }

  // Clean up duplicate projects and ensure proper ordering
  cleanupDuplicateProjects(): { removed: number; reordered: number } {
    const projects = this.getProjects();
    const uniqueProjects = new Map<string, Project>();
    let removed = 0;
    let reordered = 0;

    // Remove duplicates based on name and URL
    projects.forEach(project => {
      const key = `${project.name.toLowerCase()}-${project.projectUrl}`;

      if (uniqueProjects.has(key)) {
        // Keep the one with the lower order (higher priority)
        const existing = uniqueProjects.get(key)!;
        if ((project.order || 0) < (existing.order || 0)) {
          uniqueProjects.set(key, project);
        }
        removed++;
      } else {
        uniqueProjects.set(key, project);
      }
    });

    // Additional cleanup for specific duplicates like "Upload"
    const uploadProjects = Array.from(uniqueProjects.values()).filter(p =>
      p.name.toLowerCase() === 'upload'
    );

    if (uploadProjects.length > 1) {
      // Keep only the first Upload project (lowest order)
      const sortedUploads = uploadProjects.sort((a, b) => (a.order || 0) - (b.order || 0));
      const keepUpload = sortedUploads[0];

      // Remove other Upload projects
      uploadProjects.slice(1).forEach(upload => {
        uniqueProjects.delete(`${upload.name.toLowerCase()}-${upload.projectUrl}`);
        removed++;
      });
    }

    // Convert back to array and reorder
    const cleanedProjects = Array.from(uniqueProjects.values());

    // Sort by creation date (newest first) and assign new order
    cleanedProjects.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    cleanedProjects.forEach((project, index) => {
      if (project.order !== index + 1) {
        project.order = index + 1;
        reordered++;
      }
    });

    this.saveProjects(cleanedProjects);
    return { removed, reordered };
  }

  // Update specific project attributes without resetting all projects
  updateProjectAttributes(projectId: string, updates: Partial<Project>): boolean {
    const projects = this.getProjects();
    const projectIndex = projects.findIndex(p => p.id === projectId);

    if (projectIndex === -1) return false;

    // Filter out undefined values to prevent overwriting existing data
    const filteredUpdates: Partial<Project> = {};
    Object.keys(updates).forEach(key => {
      const value = (updates as any)[key];
      if (value !== undefined && value !== null) {
        (filteredUpdates as any)[key] = value;
      }
    });

    // Only update the specific attributes that are provided and defined
    const updatedProject = {
      ...projects[projectIndex],
      ...filteredUpdates,
      updatedAt: new Date()
    };

    projects[projectIndex] = updatedProject;
    this.saveProjects(projects);
    return true;
  }

  // Check if a project exists and update only if needed
  ensureProjectExists(projectData: Partial<Project>): boolean {
    const projects = this.getProjects();
    const existingProject = projects.find(p => p.id === projectData.id);

    if (!existingProject) {
      // Project doesn't exist, add it
      const newProject: Project = {
        id: projectData.id!,
        name: projectData.name!,
        description: projectData.description!,
        technologies: projectData.technologies!,
        imageUrl: projectData.imageUrl || '',
        demoUrl: projectData.demoUrl,
        projectUrl: projectData.projectUrl,
        category: projectData.category!,
        createdAt: new Date(),
        updatedAt: new Date(),
        featured: projectData.featured || false,
        order: projectData.order || 1
      };

      projects.push(newProject);
      this.saveProjects(projects);
      return true;
    }

    return false; // Project already exists
  }

  // Merge GitHub data with existing projects, preserving manual changes
  mergeGitHubData(githubProjects: any[]): { added: number; updated: number; preserved: number } {
    const existingProjects = this.getProjects();
    let added = 0;
    let updated = 0;
    let preserved = 0;

    githubProjects.forEach(githubProject => {
      const existingProject = existingProjects.find(p =>
        p.name.toLowerCase() === githubProject.name.toLowerCase() ||
        p.projectUrl === githubProject.html_url ||
        p.demoUrl === githubProject.homepage
      );

      if (!existingProject) {
        // New project from GitHub - add it
        const newProject: Project = {
          id: this.generateId(githubProject.name),
          name: githubProject.name,
          description: githubProject.description || 'Project from GitHub',
          technologies: this.extractTechnologies(githubProject),
          imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
          demoUrl: githubProject.homepage || undefined,
          projectUrl: githubProject.html_url,
          category: 'completed',
          createdAt: new Date(githubProject.created_at),
          updatedAt: new Date(githubProject.updated_at),
          featured: false,
          order: existingProjects.length + 1
        };

        existingProjects.push(newProject);
        added++;
      } else {
        // Existing project - only update specific attributes that have changed
        const updates: Partial<Project> = {};
        let hasChanges = false;

        // Check if description has changed
        if (githubProject.description &&
          githubProject.description !== existingProject.description &&
          githubProject.description.trim() !== '') {
          updates.description = githubProject.description;
          hasChanges = true;
        }

        // Check if demo URL (homepage) has changed
        if (githubProject.homepage &&
          githubProject.homepage !== existingProject.demoUrl) {
          updates.demoUrl = githubProject.homepage;
          hasChanges = true;
        }

        // Check if project URL has changed
        if (githubProject.html_url &&
          githubProject.html_url !== existingProject.projectUrl) {
          updates.projectUrl = githubProject.html_url;
          hasChanges = true;
        }

        // Check if technologies have changed (based on language and topics)
        const newTechnologies = this.extractTechnologies(githubProject);
        const currentTechnologies = existingProject.technologies;

        if (newTechnologies.length > 0 &&
          JSON.stringify(newTechnologies.sort()) !== JSON.stringify(currentTechnologies.sort())) {
          updates.technologies = newTechnologies;
          hasChanges = true;
        }

        // Check if project was updated more recently on GitHub
        const githubUpdatedAt = new Date(githubProject.updated_at);
        const localUpdatedAt = new Date(existingProject.updatedAt);

        if (githubUpdatedAt > localUpdatedAt) {
          updates.updatedAt = githubUpdatedAt;
          hasChanges = true;
        }

        if (hasChanges) {
          this.updateProjectAttributes(existingProject.id, updates);
          updated++;
        } else {
          preserved++;
        }
      }
    });

    this.saveProjects(existingProjects);
    return { added, updated, preserved };
  }

  // Extract technologies from GitHub project data
  private extractTechnologies(githubProject: any): string[] {
    const technologies: string[] = [];

    // Check for common technology indicators in the project
    if (githubProject.topics && Array.isArray(githubProject.topics)) {
      technologies.push(...githubProject.topics);
    }

    // Add language if available
    if (githubProject.language) {
      technologies.push(githubProject.language);
    }

    return technologies.length > 0 ? technologies : ['JavaScript'];
  }

  // Update only specific attributes that are wrong or have changed in GitHub
  // This preserves all other data including images, descriptions, etc.
  updateOnlyChangedAttributes(): { updated: number; preserved: number } {
    const projects = this.getProjects();
    let updated = 0;
    let preserved = 0;

    projects.forEach(project => {
      const updates: Partial<Project> = {};
      let hasChanges = false;

      // Only update specific attributes that are wrong or have changed
      switch (project.id) {
        case 'cesae-book-space':
          if (project.name !== 'CESAE Book Space') {
            updates.name = 'CESAE Book Space';
            hasChanges = true;
          }
          if (project.projectUrl !== 'https://github.com/KarolineRRocha/CESAE_Book_Space') {
            updates.projectUrl = 'https://github.com/KarolineRRocha/CESAE_Book_Space';
            hasChanges = true;
          }
          if (project.demoUrl !== undefined) {
            updates.demoUrl = undefined; // No GitHub Pages demo available
            hasChanges = true;
          }
          break;

        case 'freeplayfinder':
          if (project.name !== 'FreePlayFinder') {
            updates.name = 'FreePlayFinder';
            hasChanges = true;
          }
          if (project.projectUrl !== 'https://github.com/KarolineRRocha/FreePlayFinder') {
            updates.projectUrl = 'https://github.com/KarolineRRocha/FreePlayFinder';
            hasChanges = true;
          }
          if (project.demoUrl !== 'https://karolinerrocha.github.io/FreePlayFinder/') {
            updates.demoUrl = 'https://karolinerrocha.github.io/FreePlayFinder/';
            hasChanges = true;
          }
          break;

        case 'ecofab':
          if (project.name !== 'Ecofab') {
            updates.name = 'Ecofab';
            hasChanges = true;
          }
          if (project.projectUrl !== 'https://github.com/KarolineRRocha/Ecofab') {
            updates.projectUrl = 'https://github.com/KarolineRRocha/Ecofab';
            hasChanges = true;
          }
          if (project.demoUrl !== 'https://karolinerrocha.github.io/Ecofab/') {
            updates.demoUrl = 'https://karolinerrocha.github.io/Ecofab/';
            hasChanges = true;
          }
          break;

        case 'upload':
          if (project.name !== 'Upload') {
            updates.name = 'Upload';
            hasChanges = true;
          }
          if (project.projectUrl !== 'https://github.com/KarolineRRocha/Upload') {
            updates.projectUrl = 'https://github.com/KarolineRRocha/Upload';
            hasChanges = true;
          }
          if (project.demoUrl !== 'https://karolinerrocha.github.io/Upload/') {
            updates.demoUrl = 'https://karolinerrocha.github.io/Upload/';
            hasChanges = true;
          }
          break;

        case 'old-games':
          if (project.name !== 'Old Games') {
            updates.name = 'Old Games';
            hasChanges = true;
          }
          if (project.projectUrl !== 'https://github.com/KarolineRRocha/Old_Games') {
            updates.projectUrl = 'https://github.com/KarolineRRocha/Old_Games';
            hasChanges = true;
          }
          if (project.demoUrl !== 'https://karolinerrocha.github.io/Old_Games/') {
            updates.demoUrl = 'https://karolinerrocha.github.io/Old_Games/';
            hasChanges = true;
          }
          break;

        case 'they-develop-and-cook':
          if (project.name !== 'They Develop and Cook') {
            updates.name = 'They Develop and Cook';
            hasChanges = true;
          }
          if (project.projectUrl !== 'https://github.com/KarolineRRocha/They_develop_and_cook') {
            updates.projectUrl = 'https://github.com/KarolineRRocha/They_develop_and_cook';
            hasChanges = true;
          }
          if (project.demoUrl !== 'https://karolinerrocha.github.io/They_develop_and_cook/') {
            updates.demoUrl = 'https://karolinerrocha.github.io/They_develop_and_cook/';
            hasChanges = true;
          }
          break;
      }

      if (hasChanges) {
        this.updateProjectAttributes(project.id, updates);
        updated++;
      } else {
        preserved++;
      }
    });

    return { updated, preserved };
  }

  // Check GitHub repositories in real-time to see if project attributes have changed
  async checkGitHubForChanges(): Promise<{ updated: number; preserved: number; errors: number; rateLimited: boolean }> {
    const projects = this.getProjects();
    let updated = 0;
    let preserved = 0;
    let errors = 0;
    let rateLimited = false;

    // GitHub API base URL
    const githubApiBase = 'https://api.github.com/repos/KarolineRRocha/';

    for (const project of projects) {
      try {
        // Extract repository name from project URL or use project ID
        let repoName = '';
        if (project.projectUrl && project.projectUrl.includes('github.com/KarolineRRocha/')) {
          repoName = project.projectUrl.split('github.com/KarolineRRocha/')[1];
        } else {
          // Map project IDs to repository names
          const repoMapping: { [key: string]: string } = {
            'cesae-book-space': 'CESAE_Book_Space',
            'freeplayfinder': 'FreePlayFinder',
            'ecofab': 'Ecofab',
            'upload': 'Upload',
            'old-games': 'Old_Games',
            'they-develop-and-cook': 'They_develop_and_cook'
          };
          repoName = repoMapping[project.id] || project.id;
        }

        if (!repoName) {
          console.warn(`Could not determine repository name for project: ${project.id}`);
          preserved++;
          continue;
        }

        // Fetch repository data from GitHub API
        const response = await fetch(`${githubApiBase}${repoName}`);

        // Check for rate limiting
        if (response.status === 403) {
          const errorData = await response.json();
          if (errorData.message && errorData.message.includes('rate limit')) {
            console.warn('GitHub API rate limit exceeded. Please try again later or use authenticated requests.');
            rateLimited = true;
            break; // Stop checking other repositories
          }
        }

        if (!response.ok) {
          console.warn(`Repository not found or access denied: ${repoName} (Status: ${response.status})`);
          preserved++;
          continue;
        }

        const repoData = await response.json();
        const updates: Partial<Project> = {};
        let hasChanges = false;

        // ONLY check repository name - convert underscores to spaces for display
        if (repoData.name) {
          const displayName = repoData.name.replace(/_/g, ' ');
          if (project.name !== displayName) {
            updates.name = displayName;
            hasChanges = true;
            console.log(`Repository name changed for ${project.id}: ${project.name} -> ${displayName}`);
          }
        }

        // ONLY check repository URL
        const correctRepoUrl = repoData.html_url;
        if (correctRepoUrl && project.projectUrl !== correctRepoUrl) {
          updates.projectUrl = correctRepoUrl;
          hasChanges = true;
          console.log(`Repository URL changed for ${project.id}: ${project.projectUrl} -> ${correctRepoUrl}`);
        }

        // ONLY check demo URL if GitHub has a homepage
        if (repoData.homepage) {
          const correctDemoUrl = `https://karolinerrocha.github.io/${repoData.name}/`;
          if (project.demoUrl !== correctDemoUrl) {
            updates.demoUrl = correctDemoUrl;
            hasChanges = true;
            console.log(`Demo URL changed for ${project.id}: ${project.demoUrl} -> ${correctDemoUrl}`);
          }
        }

        // DO NOT update description, technologies, imageUrl, or any other attributes
        // Preserve ALL manual changes including photos, technologies, descriptions, etc.

        // Apply updates if any changes were found
        if (hasChanges) {
          console.log(`🔄 Applying ONLY name/URL updates to ${project.id}:`, updates);
          this.updateProjectAttributes(project.id, updates);
          updated++;
        } else {
          preserved++;
        }

      } catch (error) {
        console.error(`Error checking GitHub for project ${project.id}:`, error);
        errors++;
      }
    }

    return { updated, preserved, errors, rateLimited };
  }
}
