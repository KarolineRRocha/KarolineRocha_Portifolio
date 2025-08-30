import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SmartFirebaseService } from './smart-firebase.service';

export interface Project {
  id: string;
  name: string;
  description: string;
  languages: string[];
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

  async addProject(projectData: NewProjectData): Promise<boolean> {
    return this.smartFirebaseService.addProject(projectData);
  }

  async updateProject(projectId: string, updates: Partial<Project>): Promise<boolean> {
    return this.smartFirebaseService.updateProject(projectId, updates);
  }

  async deleteProject(projectId: string): Promise<boolean> {
    return this.smartFirebaseService.deleteProject(projectId);
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
}
