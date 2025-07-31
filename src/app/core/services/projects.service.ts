import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FirebaseStorageService } from './firebase-storage.service';

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  uploadedImage?: string; // Base64 string for uploaded image
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
  technologies: string[];
  imageUrl: string;
  uploadedImage?: string; // Base64 string for uploaded image
  demoUrl: string;
  projectUrl: string;
  category: 'completed' | 'coming-soon';
}

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private projectsSubject = new BehaviorSubject<Project[]>([]);
  public projects$ = this.projectsSubject.asObservable();

  constructor(private firebaseService: FirebaseStorageService) {
    console.log('📊 ProjectsService constructor called');
    // Subscribe to Firebase data changes
    this.firebaseService.projects$.subscribe(projects => {
      console.log('📊 ProjectsService received projects from Firebase:', projects.length);
      this.projectsSubject.next(projects);
    });
  }

  // Delegate all methods to Firebase service
  getProjects(): Project[] {
    return this.firebaseService.getProjects();
  }

  getCompletedProjects(): Project[] {
    return this.firebaseService.getCompletedProjects();
  }

  getComingSoonProjects(): Project[] {
    return this.firebaseService.getComingSoonProjects();
  }

  getFeaturedProjects(): Project[] {
    return this.firebaseService.getFeaturedProjects();
  }

  async addProject(projectData: NewProjectData): Promise<Project> {
    return await this.firebaseService.addProject(projectData);
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    return await this.firebaseService.updateProject(id, updates);
  }

  async deleteProject(id: string): Promise<boolean> {
    return await this.firebaseService.deleteProject(id);
  }

  async reorderProjects(projectIds: string[]): Promise<void> {
    return await this.firebaseService.reorderProjects(projectIds);
  }

  async toggleFeatured(id: string): Promise<boolean> {
    return await this.firebaseService.toggleFeatured(id);
  }

  async saveProjects(projects: Project[]): Promise<void> {
    return await this.firebaseService.saveProjects(projects);
  }

  exportProjects(): string {
    const projects = this.getProjects();
    return JSON.stringify(projects, null, 2);
  }

  async importProjects(jsonData: string): Promise<boolean> {
    try {
      const projects = JSON.parse(jsonData);
      await this.saveProjects(projects);
      return true;
    } catch (error) {
      console.error('Error importing projects:', error);
      return false;
    }
  }

  getProjectStats() {
    return this.firebaseService.getProjectStats();
  }

  searchProjects(query: string): Project[] {
    return this.firebaseService.searchProjects(query);
  }

  async testFirebaseConnection(): Promise<boolean> {
    return await this.firebaseService.testFirebaseConnection();
  }
}
