import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, setDoc, deleteDoc, onSnapshot, query, orderBy, limit, getDocs, addDoc, updateDoc } from 'firebase/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Project, NewProjectData } from './projects.service';
import { firebaseConfig, COLLECTIONS } from '../../../environments/firebase.config';

@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {
  private db: any;
  private projectsSubject = new BehaviorSubject<Project[]>([]);
  public projects$ = this.projectsSubject.asObservable();

  constructor() {
    console.log('🔥 FirebaseStorageService constructor called');
    console.log('🔥 Firebase config:', firebaseConfig);
    try {
      const app = initializeApp(firebaseConfig);
      this.db = getFirestore(app);
      console.log('🔥 Firebase initialized successfully');
      console.log('🔥 Database instance:', this.db);
      console.log('🔥 Loading projects...');
      this.loadProjects();
    } catch (error: any) {
      console.error('🔥 Error initializing Firebase:', error);
      console.error('🔥 Error details:', {
        message: error?.message,
        code: error?.code,
        stack: error?.stack
      });
    }
  }

  private async loadProjects(): Promise<void> {
    try {
      const projectsRef = collection(this.db, COLLECTIONS.PROJECTS);
      // Temporarily remove orderBy to debug
      const q = query(projectsRef);

      onSnapshot(q, (snapshot) => {
        // Process all documents in the snapshot, not just changes
        const projects: Project[] = [];

        console.log('🔥 Firebase snapshot received, total documents:', snapshot.docs.length);

        // Process all documents in the snapshot
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          const project = {
            id: doc.id,
            name: data['name'],
            description: data['description'],
            technologies: data['technologies'] || [],
            imageUrl: data['imageUrl'] || '',
            uploadedImage: data['uploadedImage'],
            demoUrl: data['demoUrl'],
            projectUrl: data['projectUrl'],
            category: data['category'] || 'completed',
            createdAt: data['createdAt']?.toDate() || new Date(),
            updatedAt: data['updatedAt']?.toDate() || new Date(),
            featured: data['featured'] || false,
            order: data['order'] || 0
          };

          console.log('🔥 Processing project:', project.name, 'category:', project.category, 'id:', project.id);
          projects.push(project);
        });

        // Sort projects by order
        projects.sort((a, b) => (a.order || 0) - (b.order || 0));

        console.log('🔥 Projects updated, total:', projects.length);
        console.log('🔥 Final projects with categories:', projects.map(p => ({ name: p.name, category: p.category, id: p.id })));
        this.projectsSubject.next(projects);
      });
    } catch (error) {
      console.error('Error loading projects from Firebase:', error);
    }
  }

  async saveProjects(projects: Project[]): Promise<void> {
    try {
      // Clear existing projects
      const projectsRef = collection(this.db, COLLECTIONS.PROJECTS);
      const snapshot = await getDocs(projectsRef);
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // Add new projects
      const addPromises = projects.map(project => {
        const { id, ...projectData } = project;
        return addDoc(projectsRef, {
          ...projectData,
          createdAt: new Date(project.createdAt),
          updatedAt: new Date(project.updatedAt)
        });
      });
      await Promise.all(addPromises);
    } catch (error) {
      console.error('Error saving projects to Firebase:', error);
      throw error;
    }
  }

  async addProject(projectData: NewProjectData): Promise<Project> {
    console.log('🔥 addProject called with data:', projectData);
    try {
      if (!this.db) {
        throw new Error('Firebase database not initialized');
      }

      const projectsRef = collection(this.db, COLLECTIONS.PROJECTS);
      const currentProjects = this.projectsSubject.value;

      // New projects always go to the top (order: 0)
      // Increment order of all existing projects
      const updatePromises = currentProjects.map(project => {
        const projectRef = doc(this.db, COLLECTIONS.PROJECTS, project.id);
        return updateDoc(projectRef, { order: (project.order || 0) + 1 });
      });

      // Create a simple, clean project object
      const newProject = {
        name: projectData.name.trim(),
        description: projectData.description || '',
        technologies: projectData.technologies || [],
        imageUrl: projectData.imageUrl || '',
        demoUrl: projectData.demoUrl || '',
        projectUrl: projectData.projectUrl || '',
        category: projectData.category || 'completed',
        createdAt: new Date(),
        updatedAt: new Date(),
        featured: false,
        order: 0 // New projects always at the top
      };

      console.log('🔥 Project data to save:', newProject);

      // First, update all existing projects to increment their order
      if (updatePromises.length > 0) {
        console.log('🔥 Updating existing projects order...');
        await Promise.all(updatePromises);
        console.log('🔥 Existing projects order updated');
      }

      // Then create the new project
      const docRef = await addDoc(projectsRef, newProject);
      console.log('🔥 Document created with ID:', docRef.id);

      const result: Project = {
        id: docRef.id,
        name: newProject.name,
        description: newProject.description,
        technologies: newProject.technologies,
        imageUrl: newProject.imageUrl,
        demoUrl: newProject.demoUrl,
        projectUrl: newProject.projectUrl,
        category: newProject.category,
        createdAt: newProject.createdAt,
        updatedAt: newProject.updatedAt,
        featured: newProject.featured,
        order: newProject.order
      };

      console.log('🔥 Returning project:', result);
      return result;
    } catch (error: any) {
      console.error('🔥 Error adding project to Firebase:', error);
      console.error('🔥 Error details:', {
        message: error?.message,
        code: error?.code,
        stack: error?.stack
      });
      throw error;
    }
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    try {
      console.log('🔥 Firebase updateProject called with ID:', id);
      console.log('🔥 Updates:', updates);

      const projectRef = doc(this.db, COLLECTIONS.PROJECTS, id);

      // Remove undefined values to prevent Firebase errors
      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, value]) => value !== undefined)
      );

      const updateData = {
        ...cleanUpdates,
        updatedAt: new Date()
      };

      console.log('🔥 Update data to send:', updateData);
      await updateDoc(projectRef, updateData);
      console.log('🔥 Firebase update successful');

      // Get the updated document
      const updatedDoc = await getDoc(projectRef);
      if (updatedDoc.exists()) {
        const data = updatedDoc.data();
        const result = {
          id: updatedDoc.id,
          name: data['name'],
          description: data['description'],
          technologies: data['technologies'] || [],
          imageUrl: data['imageUrl'] || '',
          uploadedImage: data['uploadedImage'],
          demoUrl: data['demoUrl'],
          projectUrl: data['projectUrl'],
          category: data['category'] || 'completed',
          createdAt: data['createdAt']?.toDate() || new Date(),
          updatedAt: data['updatedAt']?.toDate() || new Date(),
          featured: data['featured'] || false,
          order: data['order'] || 0
        };
        console.log('🔥 Updated project data:', result);
        return result;
      }
      console.log('🔥 Document not found after update');
      return null;
    } catch (error) {
      console.error('🔥 Error updating project in Firebase:', error);
      throw error;
    }
  }

  async deleteProject(id: string): Promise<boolean> {
    try {
      const projectRef = doc(this.db, COLLECTIONS.PROJECTS, id);
      await deleteDoc(projectRef);
      return true;
    } catch (error) {
      console.error('Error deleting project from Firebase:', error);
      return false;
    }
  }

  async reorderProjects(projectIds: string[]): Promise<void> {
    try {
      const updatePromises = projectIds.map((projectId, index) => {
        const projectRef = doc(this.db, COLLECTIONS.PROJECTS, projectId);
        return updateDoc(projectRef, { order: index + 1 });
      });
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error reordering projects in Firebase:', error);
      throw error;
    }
  }

  async toggleFeatured(id: string): Promise<boolean> {
    try {
      const projectRef = doc(this.db, COLLECTIONS.PROJECTS, id);
      const projectDoc = await getDoc(projectRef);

      if (projectDoc.exists()) {
        const currentFeatured = projectDoc.data()['featured'] || false;
        await updateDoc(projectRef, { featured: !currentFeatured });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error toggling featured in Firebase:', error);
      return false;
    }
  }

  getProjects(): Project[] {
    return this.projectsSubject.value;
  }

  getCompletedProjects(): Project[] {
    const allProjects = this.projectsSubject.value;
    console.log('🔥 getCompletedProjects called');
    console.log('🔥 Total projects:', allProjects.length);
    console.log('🔥 All projects with categories:', allProjects.map(p => ({ name: p.name, category: p.category, id: p.id })));

    const completedProjects = allProjects
      .filter(p => p.category === 'completed')
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    console.log('🔥 Completed projects after filter:', completedProjects.length);
    console.log('🔥 Completed projects:', completedProjects.map(p => ({ name: p.name, category: p.category, id: p.id })));

    return completedProjects;
  }

  getComingSoonProjects(): Project[] {
    return this.projectsSubject.value
      .filter(p => p.category === 'coming-soon')
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  getFeaturedProjects(): Project[] {
    return this.projectsSubject.value
      .filter(p => p.featured)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  getProjectStats() {
    const projects = this.projectsSubject.value;
    return {
      total: projects.length,
      completed: projects.filter(p => p.category === 'completed').length,
      comingSoon: projects.filter(p => p.category === 'coming-soon').length,
      featured: projects.filter(p => p.featured).length
    };
  }

  searchProjects(query: string): Project[] {
    const projects = this.projectsSubject.value;
    const lowerQuery = query.toLowerCase();

    return projects.filter(project =>
      project.name.toLowerCase().includes(lowerQuery) ||
      project.description.toLowerCase().includes(lowerQuery) ||
      project.technologies.some(tech => tech.toLowerCase().includes(lowerQuery))
    );
  }

  // Test method to check Firebase connectivity
  async testFirebaseConnection(): Promise<boolean> {
    try {
      console.log('🔥 Testing Firebase connection...');
      if (!this.db) {
        console.error('🔥 Database not initialized');
        return false;
      }

      const projectsRef = collection(this.db, COLLECTIONS.PROJECTS);
      console.log('🔥 Testing read access...');
      const snapshot = await getDocs(projectsRef);
      console.log('🔥 Firebase connection test successful. Documents count:', snapshot.docs.length);

      // Test write access with a dummy document
      console.log('🔥 Testing write access...');
      const testDoc = {
        name: 'Test Project',
        description: 'Test description',
        technologies: ['Test'],
        imageUrl: '',
        demoUrl: '',
        projectUrl: '',
        category: 'completed',
        createdAt: new Date(),
        updatedAt: new Date(),
        featured: false,
        order: 999
      };

      const docRef = await addDoc(projectsRef, testDoc);
      console.log('🔥 Write test successful, document ID:', docRef.id);

      // Clean up - delete the test document
      await deleteDoc(docRef);
      console.log('🔥 Test document cleaned up');

      return true;
    } catch (error: any) {
      console.error('🔥 Firebase connection test failed:', error);
      console.error('🔥 Error details:', {
        message: error?.message,
        code: error?.code,
        stack: error?.stack
      });
      return false;
    }
  }
}
