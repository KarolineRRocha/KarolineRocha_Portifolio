import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, setDoc, deleteDoc, onSnapshot, query, orderBy, limit, getDocs, addDoc, updateDoc } from 'firebase/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Project, NewProjectData } from './projects.service';
import { firebaseConfig, COLLECTIONS } from '../../../environments/firebase.config';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SmartFirebaseService {
  private db: any;
  private projectsSubject = new BehaviorSubject<Project[]>([]);
  public projects$ = this.projectsSubject.asObservable();
  
  private cache: Project[] = [];
  private lastCacheUpdate = 0;
  private unsubscribe: (() => void) | null = null;

  constructor() {
    this.initializeFirebase();
  }

  private initializeFirebase(): void {
    if (environment.firebase.enableDebugMode) {
      console.log('🔥 SmartFirebaseService: Initializing with environment config:', {
        isLocal: environment.firebase.isLocalEnvironment,
        isProduction: environment.firebase.isProductionEnvironment,
        realTimeSync: environment.firebase.enableRealTimeSync,
        cacheEnabled: environment.firebase.enableCache,
        cacheDuration: environment.firebase.cacheDuration
      });
    }

    // Check if Firebase config is valid
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
      console.error('🔥 SmartFirebaseService: Firebase config is invalid:', firebaseConfig);
      return;
    }

    try {
      const app = initializeApp(firebaseConfig);
      this.db = getFirestore(app);
      
      if (environment.firebase.enableDebugMode) {
        console.log('🔥 SmartFirebaseService: Firebase initialized successfully');
      }

      this.setupDataListener();
    } catch (error: any) {
      console.error('🔥 SmartFirebaseService: Error initializing Firebase:', error);
    }
  }

  private setupDataListener(): void {
    if (environment.firebase.enableRealTimeSync) {
      this.setupRealTimeListener();
    } else {
      this.setupCachedListener();
    }
  }

  private setupRealTimeListener(): void {
    // Para desenvolvimento local - sincronização em tempo real
    if (environment.firebase.enableDebugMode) {
      console.log('🔄 SmartFirebaseService: Setting up real-time listener');
    }

    const q = query(collection(this.db, COLLECTIONS.PROJECTS), orderBy('order'));
    
    this.unsubscribe = onSnapshot(q, (snapshot) => {
      const projects = this.processSnapshot(snapshot);
      this.projectsSubject.next(projects);
      
      if (environment.firebase.enableDebugMode) {
        console.log('🔄 SmartFirebaseService: Real-time update received:', projects.length, 'projects');
      }
    }, (error) => {
      console.error('🔥 SmartFirebaseService: Real-time listener error:', error);
    });
  }

  private setupCachedListener(): void {
    // Para produção - cache inteligente
    if (environment.firebase.enableDebugMode) {
      console.log('💾 SmartFirebaseService: Setting up cached listener');
    }

    const q = query(collection(this.db, COLLECTIONS.PROJECTS), orderBy('order'));
    
    this.unsubscribe = onSnapshot(q, (snapshot) => {
      const projects = this.processSnapshot(snapshot);
      
      // Aplicar cache inteligente
      if (this.shouldUpdateCache()) {
        this.cache = projects;
        this.lastCacheUpdate = Date.now();
        this.projectsSubject.next(projects);
        
        if (environment.firebase.enableDebugMode) {
          console.log('💾 SmartFirebaseService: Cache updated:', projects.length, 'projects');
        }
      } else {
        // Usar cache existente
        this.projectsSubject.next(this.cache);
        
        if (environment.firebase.enableDebugMode) {
          console.log('💾 SmartFirebaseService: Using cached data:', this.cache.length, 'projects');
        }
      }
    }, (error) => {
      console.error('🔥 SmartFirebaseService: Cached listener error:', error);
      // Em caso de erro, usar cache se disponível
      if (this.cache.length > 0) {
        this.projectsSubject.next(this.cache);
      }
    });
  }

  private shouldUpdateCache(): boolean {
    if (!environment.firebase.enableCache) {
      return true; // Sempre atualizar se cache estiver desabilitado
    }

    const cacheAge = Date.now() - this.lastCacheUpdate;
    const shouldUpdate = cacheAge > environment.firebase.cacheDuration;
    
    if (environment.firebase.enableDebugMode) {
      console.log('💾 SmartFirebaseService: Cache age:', cacheAge, 'ms, should update:', shouldUpdate);
    }

    return shouldUpdate;
  }

  private processSnapshot(snapshot: any): Project[] {
    const projects: Project[] = [];
    
    snapshot.docs.forEach((doc: any) => {
      const data = doc.data();
      
      if (environment.firebase.enableDebugMode) {
        console.log('🔥 SmartFirebaseService: Processing document:', doc.id, data);
      }

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

    // Sort projects by order
    projects.sort((a, b) => (a.order || 0) - (b.order || 0));

    return projects;
  }

  getProjects(): Project[] {
    return this.projectsSubject.value;
  }

  async addProject(projectData: NewProjectData): Promise<boolean> {
    // Verificar se operações de escrita estão habilitadas
    if (!environment.firebase.enableWriteOperations) {
      console.warn('⚠️ SmartFirebaseService: Write operations disabled in current environment');
      return false;
    }

    if (environment.firebase.enableDebugMode) {
      console.log('➕ SmartFirebaseService: Adding project:', projectData);
    }

    try {
      const docRef = await addDoc(collection(this.db, COLLECTIONS.PROJECTS), {
        ...projectData,
        createdAt: new Date(),
        updatedAt: new Date(),
        order: this.getNextOrder()
      });

      if (environment.firebase.enableDebugMode) {
        console.log('✅ SmartFirebaseService: Project added successfully:', docRef.id);
      }

      return true;
    } catch (error) {
      console.error('❌ SmartFirebaseService: Error adding project:', error);
      return false;
    }
  }

  async updateProject(projectId: string, updates: Partial<Project>): Promise<boolean> {
    if (!environment.firebase.enableWriteOperations) {
      console.warn('⚠️ SmartFirebaseService: Write operations disabled in current environment');
      return false;
    }

    try {
      const docRef = doc(this.db, COLLECTIONS.PROJECTS, projectId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date()
      });

      if (environment.firebase.enableDebugMode) {
        console.log('✅ SmartFirebaseService: Project updated successfully:', projectId);
      }

      return true;
    } catch (error) {
      console.error('❌ SmartFirebaseService: Error updating project:', error);
      return false;
    }
  }

  async deleteProject(projectId: string): Promise<boolean> {
    // Verificar se operações de exclusão estão habilitadas
    if (!environment.firebase.enableDeleteOperations) {
      console.warn('⚠️ SmartFirebaseService: Delete operations disabled in current environment');
      return false;
    }

    try {
      const docRef = doc(this.db, COLLECTIONS.PROJECTS, projectId);
      await deleteDoc(docRef);

      if (environment.firebase.enableDebugMode) {
        console.log('✅ SmartFirebaseService: Project deleted successfully:', projectId);
      }

      return true;
    } catch (error) {
      console.error('❌ SmartFirebaseService: Error deleting project:', error);
      return false;
    }
  }

  private getNextOrder(): number {
    const projects = this.getProjects();
    if (projects.length === 0) {
      return 0;
    }
    return Math.max(...projects.map(p => p.order || 0)) + 1;
  }

  // Métodos de utilidade
  isLocalEnvironment(): boolean {
    return environment.firebase.isLocalEnvironment;
  }

  isProductionEnvironment(): boolean {
    return environment.firebase.isProductionEnvironment;
  }

  isRealTimeSyncEnabled(): boolean {
    return environment.firebase.enableRealTimeSync;
  }

  isCacheEnabled(): boolean {
    return environment.firebase.enableCache;
  }

  isAdminFeaturesEnabled(): boolean {
    return environment.firebase.enableAdminFeatures;
  }

  // Cleanup
  ngOnDestroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      if (environment.firebase.enableDebugMode) {
        console.log('🧹 SmartFirebaseService: Cleanup completed');
      }
    }
  }
}
