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

    // Check if Firebase config is valid
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
      console.error('🔥 Firebase config is invalid:', firebaseConfig);
      return;
    }

    try {
      const app = initializeApp(firebaseConfig);
      this.db = getFirestore(app);
      console.log('🔥 Firebase initialized successfully');
      console.log('🔥 Database instance:', this.db);
      console.log('🔥 Database ready:', !!this.db);
      console.log('🔥 Database name:', this.db?.name);
      console.log('🔥 Database app:', this.db?.app?.name);
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
      console.log('🔥 loadProjects started');
      console.log('🔥 Database instance in loadProjects:', !!this.db);

      if (!this.db) {
        console.error('🔥 Database not initialized in loadProjects');
        return;
      }

      const projectsRef = collection(this.db, COLLECTIONS.PROJECTS);
      console.log('🔥 Projects collection reference created');

      // Temporarily remove orderBy to debug
      const q = query(projectsRef);
      console.log('🔥 Query created');

      onSnapshot(q, (snapshot) => {
        // Process all documents in the snapshot, not just changes
        const projects: Project[] = [];

        console.log('🔥 Firebase snapshot received, total documents:', snapshot.docs.length);
        console.log('🔥 Snapshot empty:', snapshot.empty);
        console.log('🔥 Snapshot metadata:', snapshot.metadata);
        console.log('🔥 Snapshot changes:', snapshot.docChanges().map(change => ({
          type: change.type,
          docId: change.doc.id,
          data: change.doc.data()
        })));

        // Process all documents in the snapshot
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          console.log('🔥 Document data:', data);

          const project = {
            id: doc.id,
            name: data['name'],
            description: data['description'],
            languages: data['languages'] || [],
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

          console.log('🔥 Raw uploadedImage from Firebase:', data['uploadedImage'] ? 'PRESENT' : 'NOT PRESENT');
          console.log('🔥 Raw uploadedImage type:', typeof data['uploadedImage']);
          console.log('🔥 Raw uploadedImage length:', typeof data['uploadedImage'] === 'string' ? data['uploadedImage'].length : 0);
          console.log('🔥 Raw uploadedImage start:', typeof data['uploadedImage'] === 'string' ? data['uploadedImage'].substring(0, 50) : 'N/A');

          console.log('🔥 Processing project:', project.name, 'category:', project.category, 'id:', project.id, 'uploadedImage:', project.uploadedImage ? 'present' : 'not present', 'uploadedImage length:', project.uploadedImage?.length || 0);
          projects.push(project);
        });

        // Sort projects by order
        projects.sort((a, b) => (a.order || 0) - (b.order || 0));

        console.log('🔥 Projects updated, total:', projects.length);
        console.log('🔥 Final projects with categories:', projects.map(p => ({
          name: p.name,
          category: p.category,
          id: p.id,
          order: p.order,
          uploadedImage: p.uploadedImage ? 'present' : 'not present',
          uploadedImageLength: p.uploadedImage?.length || 0
        })));
        console.log('🔥 Projects with uploadedImage:', projects.filter(p => p.uploadedImage).map(p => p.name));
        console.log('🔥 Emitting projects to subscribers...');
        this.projectsSubject.next(projects);
        console.log('🔥 Projects emitted successfully');
      }, (error) => {
        console.error('🔥 Error in onSnapshot:', error);
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
        console.error('🔥 Database not initialized!');
        throw new Error('Firebase database not initialized');
      }

      console.log('🔥 Database is initialized, proceeding...');
      const projectsRef = collection(this.db, COLLECTIONS.PROJECTS);
      const currentProjects = this.projectsSubject.value;

      console.log('🔥 Current projects count:', currentProjects.length);

      // Create a simple project object first (without shifting existing projects)
      const newProject = {
        name: projectData.name.trim(),
        description: projectData.description || '',
        languages: projectData.languages || [],
        imageUrl: projectData.imageUrl || '',
        uploadedImage: projectData.uploadedImage || '', // Ensure it's never undefined
        demoUrl: projectData.demoUrl || '',
        projectUrl: projectData.projectUrl || '',
        category: projectData.category || 'completed',
        createdAt: new Date(),
        updatedAt: new Date(),
        featured: false,
        order: 0 // Always add new projects at the top
      };

      console.log('🔥 Project data to save:', newProject);

      // Create the new project first
      console.log('🔥 Adding document to Firebase...');
      const docRef = await addDoc(projectsRef, newProject);
      console.log('🔥 Document created with ID:', docRef.id);

      // Wait a moment for Firebase to process
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Now shift all existing projects down by 1 to make room at the top
      if (currentProjects.length > 0) {
        console.log('🔥 Shifting existing projects down by 1 to make room at the top...');
        const shiftPromises = currentProjects.map(project => {
          const newOrder = (project.order || 0) + 1;
          console.log(`🔥 Shifting project "${project.name}" from order ${project.order} to ${newOrder}`);
          return updateDoc(doc(this.db, COLLECTIONS.PROJECTS, project.id), { order: newOrder });
        });
        await Promise.all(shiftPromises);
        console.log('🔥 All existing projects shifted down successfully');
      }

      const result: Project = {
        id: docRef.id,
        name: newProject.name,
        description: newProject.description,
        languages: newProject.languages,
        imageUrl: newProject.imageUrl,
        uploadedImage: newProject.uploadedImage,
        demoUrl: newProject.demoUrl,
        projectUrl: newProject.projectUrl,
        category: newProject.category,
        createdAt: newProject.createdAt,
        updatedAt: newProject.updatedAt,
        featured: newProject.featured,
        order: 0 // Final order is 0 (top)
      };

      console.log('🔥 Returning project:', result);
      console.log('🔥 Project saved successfully to Firebase');
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

      // Remove undefined values to prevent Firebase errors, but keep null values for explicit field clearing
      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, value]) => value !== undefined)
      );

      const updateData = {
        ...cleanUpdates,
        updatedAt: new Date()
      };

      console.log('🔥 Update data to send:', updateData);
      console.log('🔥 uploadedImage in updates:', updates['uploadedImage'] ? 'PRESENT' : 'NOT PRESENT');
      console.log('🔥 uploadedImage in cleanUpdates:', cleanUpdates['uploadedImage'] ? 'PRESENT' : 'NOT PRESENT');
      console.log('🔥 uploadedImage length in updates:', typeof updates['uploadedImage'] === 'string' ? updates['uploadedImage'].length : 0);
      console.log('🔥 uploadedImage length in cleanUpdates:', typeof cleanUpdates['uploadedImage'] === 'string' ? cleanUpdates['uploadedImage'].length : 0);
      console.log('🔥 Total update data size:', JSON.stringify(updateData).length);
      console.log('🔥 Firebase update data keys:', Object.keys(updateData));
      console.log('🔥 Firebase update data uploadedImage key exists:', 'uploadedImage' in updateData);
      console.log('🔥 Firebase update data uploadedImage value:', ('uploadedImage' in updateData && updateData['uploadedImage']) ? 'PRESENT' : 'NOT PRESENT');
      await updateDoc(projectRef, updateData);
      console.log('🔥 Firebase update successful');

      // Force refresh to ensure all subscribers get the updated data
      console.log('🔥 Forcing refresh after update...');
      await this.refreshProjects();

      // Get the updated document
      const updatedDoc = await getDoc(projectRef);
      if (updatedDoc.exists()) {
        const data = updatedDoc.data();
        console.log('🔥 Updated document data from Firebase:', data);
        console.log('🔥 Updated uploadedImage from Firebase:', data['uploadedImage'] ? 'PRESENT' : 'NOT PRESENT');
        console.log('🔥 Updated uploadedImage length from Firebase:', typeof data['uploadedImage'] === 'string' ? data['uploadedImage'].length : 0);
        console.log('🔥 Updated uploadedImage start from Firebase:', typeof data['uploadedImage'] === 'string' ? data['uploadedImage'].substring(0, 50) : 'N/A');

        const result = {
          id: updatedDoc.id,
          name: data['name'],
          description: data['description'],
          languages: data['languages'] || [],
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

  // Force refresh projects from Firebase
  async refreshProjects(): Promise<void> {
    console.log('🔥 Forcing refresh of projects from Firebase...');
    try {
      if (!this.db) {
        console.error('🔥 Database not initialized');
        return;
      }

      const projectsRef = collection(this.db, COLLECTIONS.PROJECTS);
      const snapshot = await getDocs(projectsRef);

      const projects: Project[] = [];
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const project = {
          id: doc.id,
          name: data['name'],
          description: data['description'],
          languages: data['languages'] || [],
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
        projects.push(project);
      });

      // Sort by order
      projects.sort((a, b) => (a.order || 0) - (b.order || 0));

      console.log('🔥 Refreshed projects from Firebase:', projects.length);
      this.projectsSubject.next(projects);
    } catch (error) {
      console.error('🔥 Error refreshing projects:', error);
    }
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
      project.languages.some(tech => tech.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Clears all projects from Firebase
   */
  async clearAllProjects(): Promise<void> {
    try {
      console.log('🗑️ Clearing all projects from Firebase...');

      if (!this.db) {
        console.error('❌ Firebase not initialized');
        throw new Error('Firebase not initialized');
      }

      const projectsRef = collection(this.db, COLLECTIONS.PROJECTS);
      const querySnapshot = await getDocs(projectsRef);

      console.log(`🗑️ Found ${querySnapshot.docs.length} projects to delete`);

      const deletePromises = querySnapshot.docs.map(doc => {
        console.log('🗑️ Deleting project:', doc.id);
        return deleteDoc(doc.ref);
      });

      await Promise.all(deletePromises);
      console.log('✅ All projects cleared from Firebase successfully');

      // Clear local projects array
      this.projectsSubject.next([]);
    } catch (error) {
      console.error('❌ Error clearing all projects from Firebase:', error);
      throw error;
    }
  }

}
