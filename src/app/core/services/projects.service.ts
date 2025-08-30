import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SmartFirebaseService } from './smart-firebase.service';

export interface Project {
  id: string;
  name: string;
  description: string;
  languages: string[];
  imageUrl: string;
  uploadedImage?: string;
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
  languages: string[];
  imageUrl: string;
  uploadedImage?: string;
  demoUrl?: string;
  projectUrl?: string;
  category: 'completed' | 'coming-soon';
  featured?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private projectsSubject = new BehaviorSubject<Project[]>([]);
  public projects$ = this.projectsSubject.asObservable();

  constructor(private smartFirebaseService: SmartFirebaseService) {
    console.log('📊 ProjectsService constructor called');
    
    // Subscribe to SmartFirebase data changes
    this.smartFirebaseService.projects$.subscribe(projects => {
      console.log('📊 ProjectsService received projects from SmartFirebase:', projects.length);
      this.projectsSubject.next(projects);
    });
  }

  // Delegate all methods to SmartFirebase service
  getProjects(): Project[] {
    return this.smartFirebaseService.getProjects();
  }

  // Filter methods for different project categories
  getCompletedProjects(): Project[] {
    return this.getProjects().filter(project => project.category === 'completed');
  }

  getComingSoonProjects(): Project[] {
    return this.getProjects().filter(project => project.category === 'coming-soon');
  }

  getFeaturedProjects(): Project[] {
    return this.getProjects().filter(project => project.featured === true);
  }

  async addProject(projectData: NewProjectData): Promise<Project | null> {
    const success = await this.smartFirebaseService.addProject(projectData);
    if (success) {
      // Return the newly created project (we'll need to get it from the updated list)
      const projects = this.getProjects();
      return projects.find(p => p.name === projectData.name) || null;
    }
    return null;
  }

  async updateProject(projectId: string, updates: Partial<Project>): Promise<Project | null> {
    const success = await this.smartFirebaseService.updateProject(projectId, updates);
    if (success) {
      // Return the updated project
      const projects = this.getProjects();
      return projects.find(p => p.id === projectId) || null;
    }
    return null;
  }

  async deleteProject(projectId: string): Promise<boolean> {
    return this.smartFirebaseService.deleteProject(projectId);
  }

  async toggleFeatured(projectId: string): Promise<boolean> {
    const project = this.getProjects().find(p => p.id === projectId);
    if (project) {
      const updates = { featured: !project.featured };
      const success = await this.smartFirebaseService.updateProject(projectId, updates);
      return success;
    }
    return false;
  }

  async reorderProjects(projectIds: string[]): Promise<void> {
    const updatePromises = projectIds.map((projectId, index) => {
      return this.smartFirebaseService.updateProject(projectId, { order: index });
    });
    await Promise.all(updatePromises);
  }

  // Utility methods
  isLocalEnvironment(): boolean {
    return this.smartFirebaseService.isLocalEnvironment();
  }

  isProductionEnvironment(): boolean {
    return this.smartFirebaseService.isProductionEnvironment();
  }

  isRealTimeSyncEnabled(): boolean {
    return this.smartFirebaseService.isRealTimeSyncEnabled();
  }

  isCacheEnabled(): boolean {
    return this.smartFirebaseService.isCacheEnabled();
  }

  isAdminFeaturesEnabled(): boolean {
    return this.smartFirebaseService.isAdminFeaturesEnabled();
  }

  // Additional utility methods
  searchProjects(query: string): Project[] {
    const projects = this.getProjects();
    const lowerQuery = query.toLowerCase();
    return projects.filter(project => 
      project.name.toLowerCase().includes(lowerQuery) ||
      project.description.toLowerCase().includes(lowerQuery) ||
      project.languages.some(lang => lang.toLowerCase().includes(lowerQuery))
    );
  }

  getProjectStats() {
    const projects = this.getProjects();
    return {
      total: projects.length,
      completed: projects.filter(p => p.category === 'completed').length,
      comingSoon: projects.filter(p => p.category === 'coming-soon').length,
      featured: projects.filter(p => p.featured).length
    };
  }

  exportProjects(): string {
    const projects = this.getProjects();
    return JSON.stringify(projects, null, 2);
  }

  async importProjects(jsonData: string): Promise<boolean> {
    try {
      const projects = JSON.parse(jsonData);
      // This would need to be implemented in SmartFirebaseService
      // For now, return false
      console.warn('Import functionality not yet implemented in SmartFirebaseService');
      return false;
    } catch (error) {
      console.error('Error importing projects:', error);
      return false;
    }
  }

  async refreshProjects(): Promise<void> {
    // SmartFirebaseService handles this automatically
    // This method is kept for compatibility
    console.log('Projects refresh handled automatically by SmartFirebaseService');
  }
}
