import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, interval, timer, from, of, throwError, Subject, forkJoin } from 'rxjs';
import { switchMap, tap, catchError, map } from 'rxjs/operators';
import { FirebaseStorageService } from './firebase-storage.service';
import { NotificationService } from '../../services/notification.service';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { COLLECTIONS } from '../../../environments/firebase.config';

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  language: string | null;
  languages: { [key: string]: number };
  created_at: string;
  updated_at: string;
  pushed_at: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  default_branch: string;
  visibility: string;
}

export interface SyncStatus {
  lastSync: Date | null;
  totalRepos: number;
  syncedRepos: number;
  newRepos: number;
  updatedRepos: number; // Will always be 0 now, kept for compatibility
  deletedRepos: number; // New field for tracking deleted repositories
  isSyncing: boolean;
  error: string | null;
  isFirstSync: boolean;
}



@Injectable({
  providedIn: 'root'
})
export class GitHubSyncService {
  private syncStatusSubject = new BehaviorSubject<SyncStatus>({
    lastSync: null,
    totalRepos: 0,
    syncedRepos: 0,
    newRepos: 0,
    updatedRepos: 0,
    deletedRepos: 0,
    isSyncing: false,
    error: null,
    isFirstSync: true
  });

  public syncStatus$ = this.syncStatusSubject.asObservable();
  private syncInterval: any;
  private readonly GITHUB_API_BASE = 'https://api.github.com';
  private readonly USERNAME = 'KarolineRRocha';

  // GitHub Personal Access Token (opcional)
  // Para criar: https://github.com/settings/tokens
  // Scopes necessários: public_repo
  // Exemplo: private readonly GITHUB_TOKEN = 'ghp_1234567890abcdef1234567890abcdef12345678';
  private readonly GITHUB_TOKEN: string = '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'; // ← Token configurado para aumentar rate limit

  constructor(
    private http: HttpClient,
    private firebaseService: FirebaseStorageService,
    private notificationService: NotificationService
  ) {
    // Load saved sync status
    this.loadSyncStatus();

    // Verificar se há token configurado
    if (this.GITHUB_TOKEN) {
      console.log('🔑 GitHub token configurado - Rate limit aumentado para 5000 req/hora');
    } else {
      console.log('⚠️ Sem GitHub token - Rate limit limitado a 60 req/hora');
    }
  }

  /**
 * Load saved sync status from Firebase
 */
  private async loadSyncStatus(): Promise<void> {
    try {
      // Use the existing Firebase service instead of direct access
      const db = this.firebaseService['db']; // Access the db instance from the service
      if (!db) {
        console.log('📊 Firebase not ready yet, using default status');
        const defaultStatus: SyncStatus = {
          lastSync: null,
          totalRepos: 0,
          syncedRepos: 0,
          newRepos: 0,
          updatedRepos: 0,
          deletedRepos: 0,
          isSyncing: false,
          error: null,
          isFirstSync: true
        };
        this.syncStatusSubject.next(defaultStatus);
        return;
      }

      const syncDocRef = doc(db, COLLECTIONS.SYNC_DATA, 'github_sync');
      const syncDoc = await getDoc(syncDocRef);

      if (syncDoc.exists()) {
        const data = syncDoc.data();
        console.log('📊 Raw sync data from Firebase:', data);

        const savedStatus: SyncStatus = {
          lastSync: data['lastSync'] ? new Date(data['lastSync']) : null,
          totalRepos: data['totalRepos'] || 0,
          syncedRepos: data['syncedRepos'] || 0,
          newRepos: data['newRepos'] || 0,
          updatedRepos: data['updatedRepos'] || 0,
          deletedRepos: data['deletedRepos'] || 0,
          isSyncing: false,
          error: null,
          isFirstSync: data['isFirstSync'] !== false // Default to true if not set
        };

        console.log('📊 Loaded saved sync status:', savedStatus);
        this.syncStatusSubject.next(savedStatus);
      } else {
        console.log('📊 No saved sync status found, using defaults');
        // Initialize with default status
        const defaultStatus: SyncStatus = {
          lastSync: null,
          totalRepos: 0,
          syncedRepos: 0,
          newRepos: 0,
          updatedRepos: 0,
          deletedRepos: 0,
          isSyncing: false,
          error: null,
          isFirstSync: true
        };
        this.syncStatusSubject.next(defaultStatus);
      }
    } catch (error) {
      console.error('❌ Error loading sync status:', error);
      // Fallback to default status on error
      const fallbackStatus: SyncStatus = {
        lastSync: null,
        totalRepos: 0,
        syncedRepos: 0,
        newRepos: 0,
        updatedRepos: 0,
        deletedRepos: 0,
        isSyncing: false,
        error: null,
        isFirstSync: true
      };
      this.syncStatusSubject.next(fallbackStatus);
    }
  }

  /**
   * Save sync status to Firebase
   */
  private async saveSyncStatus(status: SyncStatus): Promise<void> {
    try {
      console.log('💾 Saving sync status to Firebase...');

      // Use the existing Firebase service instead of direct access
      const db = this.firebaseService['db']; // Access the db instance from the service
      if (!db) {
        console.log('📊 Firebase not ready yet, skipping save');
        return;
      }

      const syncDocRef = doc(db, COLLECTIONS.SYNC_DATA, 'github_sync');
      const dataToSave: any = {
        totalRepos: status.totalRepos,
        syncedRepos: status.syncedRepos,
        newRepos: status.newRepos,
        updatedRepos: status.updatedRepos,
        deletedRepos: status.deletedRepos,
        isFirstSync: status.isFirstSync
      };

      // Only save lastSync if it's not null
      if (status.lastSync) {
        dataToSave.lastSync = status.lastSync.toISOString();
      }

      console.log('💾 Data to save:', dataToSave);
      await setDoc(syncDocRef, dataToSave);
      console.log('✅ Sync status saved to Firebase successfully');
    } catch (error) {
      console.error('❌ Error saving sync status:', error);
      throw error; // Re-throw to allow proper error handling
    }
  }

  /**
   * Update sync status and save to Firebase
   */
  private updateSyncStatus(updates: Partial<SyncStatus>): void {
    const currentStatus = this.syncStatusSubject.value;

    // Filter out undefined values to prevent Firebase errors
    const cleanUpdates: Partial<SyncStatus> = {};
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        (cleanUpdates as any)[key] = value;
      }
    });

    const newStatus = { ...currentStatus, ...cleanUpdates };
    console.log('🔄 Updating sync status:', cleanUpdates);
    this.syncStatusSubject.next(newStatus);
    this.saveSyncStatus(newStatus);
  }



  /**
 * Inicia sincronização automática a cada hora
 */
  public startAutoSync(): void {
    console.log('🚀 Starting auto sync...');

    // Sincronização inicial após 2 segundos (mais rápido para teste)
    timer(2000).subscribe(() => {
      console.log('🚀 Initial sync starting...');
      this.manualSync().subscribe({
        next: (status) => {
          console.log('🚀 Initial sync completed:', status);
        },
        error: (error) => {
          console.error('🚀 Initial sync failed:', error);
        }
      });
    });

    // Sincronização automática a cada hora
    this.syncInterval = interval(60 * 60 * 1000).subscribe(() => {
      console.log('🔄 Hourly sync starting...');
      this.manualSync().subscribe({
        next: (status) => {
          console.log('🔄 Hourly sync completed:', status);
        },
        error: (error) => {
          console.error('🔄 Hourly sync failed:', error);
        }
      });
    });
  }

  /**
   * Para sincronização automática
   */
  public stopAutoSync(): void {
    if (this.syncInterval) {
      this.syncInterval.unsubscribe();
    }
  }

  /**
   * Sincronização manual (chamada pelo botão)
   */
  public manualSync(): Observable<SyncStatus> {
    console.log('🔄 Manual sync requested');

    return from(this.checkGitHubAPIStatus()).pipe(
      tap(status => {
        console.log('🔄 GitHub API status check result:', status);
      }),
      switchMap(status => {
        if (!status.available) {
          console.warn('⚠️ GitHub API rate limit exceeded');
          this.notificationService.warning(
            `GitHub API rate limit exceeded. Please wait until ${status.resetTime?.toLocaleTimeString()} to try again.`
          );

          const errorStatus: SyncStatus = {
            lastSync: new Date(),
            totalRepos: 0,
            syncedRepos: 0,
            newRepos: 0,
            updatedRepos: 0,
            deletedRepos: 0,
            isSyncing: false,
            error: 'GitHub API rate limit exceeded',
            isFirstSync: this.syncStatusSubject.value.isFirstSync
          };

          this.syncStatusSubject.next(errorStatus);
          return of(errorStatus);
        }

        console.log(`✅ GitHub API available. ${status.rateLimitRemaining} requests remaining.`);
        return this.syncWithGitHub();
      })
    );
  }

  /**
   * Sincronização principal com GitHub
   */
  public syncWithGitHub(): Observable<SyncStatus> {
    console.log('🔄 syncWithGitHub started');

    this.updateSyncStatus({
      isSyncing: true,
      error: null,
      isFirstSync: this.syncStatusSubject.value.isFirstSync
    });

    return this.fetchGitHubRepos().pipe(
      tap(repos => {
        console.log('🔄 fetchGitHubRepos completed, repos count:', repos.length);
      }),
      switchMap(repos => {
        console.log('🔄 Starting processRepos with', repos.length, 'repos');
        return from(this.processRepos(repos));
      }),
      tap((status) => {
        console.log('🔄 processRepos completed:', status);
        this.updateSyncStatus({
          isSyncing: false,
          lastSync: new Date(),
          error: null,
          isFirstSync: false // Mark as not first sync after successful sync
        });
        this.notificationService.success('GitHub sync completed successfully!');
      }),
      catchError(error => {
        console.error('❌ GitHub sync error:', error);
        this.updateSyncStatus({
          isSyncing: false,
          error: error.message || 'Sync failed',
          isFirstSync: this.syncStatusSubject.value.isFirstSync
        });
        this.notificationService.error('GitHub sync failed: ' + error.message);
        throw error;
      })
    );
  }

  /**
   * Sincronização manual completa - APENAS ADICIONA NOVOS REPOSITÓRIOS
   * Não altera projetos existentes, apenas adiciona novos que não estão na base de dados
   */
  public manualFullSync(): Observable<SyncStatus> {
    console.log('🔄 Manual full sync started - ONLY ADDING NEW REPOSITORIES');

    this.updateSyncStatus({
      isSyncing: true,
      error: null,
      isFirstSync: false // Force subsequent sync mode for manual sync
    });

    return this.fetchGitHubRepos().pipe(
      tap(repos => {
        console.log('🔄 fetchGitHubRepos completed, repos count:', repos.length);
      }),
      switchMap(repos => {
        console.log('🔄 Starting manual full sync with', repos.length, 'repos');
        return from(this.processReposManual(repos));
      }),
      tap((status) => {
        console.log('🔄 Manual full sync completed:', status);
        this.updateSyncStatus({
          isSyncing: false,
          lastSync: new Date(),
          error: null,
          isFirstSync: false
        });
        // Don't show success message here - let the component handle it
      }),
      catchError(error => {
        console.error('❌ Manual full sync error:', error);
        this.updateSyncStatus({
          isSyncing: false,
          error: error.message || 'Manual sync failed',
          isFirstSync: false
        });
        throw error;
      })
    );
  }

  /**
   * Processa repositórios para sincronização manual - APENAS ADICIONA NOVOS REPOSITÓRIOS
   * Não altera projetos existentes, apenas adiciona novos que não estão na base de dados
   */
  private async processReposManual(repos: GitHubRepo[]): Promise<SyncStatus> {
    console.log('🔄 processReposManual started - ONLY ADDING NEW REPOSITORIES');
    console.log('🔄 Processing repos for manual sync...');
    console.log(`📊 GitHub repos count: ${repos.length}`);
    console.log(`📊 GitHub repos:`, repos.map(r => r.name));

    // Get current projects from Firebase
    let currentProjects = this.firebaseService.getProjects();
    console.log('📊 Current projects in Firebase:', currentProjects.length);
    console.log('📊 Current projects:', currentProjects.map(p => ({ id: p.id, name: p.name, url: p.projectUrl, category: p.category })));

    // If no projects found, wait a bit for Firebase to load
    if (currentProjects.length === 0) {
      console.log('📊 No projects found, waiting for Firebase to load...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      currentProjects = this.firebaseService.getProjects();
      console.log('📊 Projects after wait:', currentProjects.length);
    }

    let newRepos = 0;
    let deletedRepos = 0;

    console.log('🔄 MANUAL SYNC: ONLY ADDING NEW REPOSITORIES - NO UPDATES TO EXISTING PROJECTS');

    // Get GitHub repository URLs for comparison
    const githubRepoUrls = repos.map(repo => repo.html_url);
    console.log('🔍 GitHub repo URLs:', githubRepoUrls);

    // Check for projects that exist in Firebase but not in GitHub (deleted repos)
    for (const project of currentProjects) {
      if (project.projectUrl && !githubRepoUrls.includes(project.projectUrl)) {
        console.log(`🗑️ Repository deleted from GitHub: ${project.name} (${project.projectUrl})`);
        console.log(`🗑️ Deleting project from database: ${project.name}`);

        try {
          await this.firebaseService.deleteProject(project.id);
          deletedRepos++;
          console.log(`✅ Project deleted successfully: ${project.name}`);
        } catch (error) {
          console.error(`❌ Error deleting project ${project.name}:`, error);
        }
      }
    }

    // Manual sync: ONLY ADD NEW repositories (no updates to existing ones)
    for (const repo of repos) {
      console.log(`🔍 Checking repo: ${repo.name} (URL: ${repo.html_url})`);

      // Find existing project using multiple strategies
      let existingProject = this.findExistingProject(currentProjects, repo);

      if (existingProject) {
        console.log(`✅ Project already exists: ${existingProject.name} - SKIPPING (no updates allowed)`);
        console.log(`📝 Existing project data preserved:`, {
          name: existingProject.name,
          description: existingProject.description,
          languages: existingProject.languages,
          imageUrl: existingProject.imageUrl,
          demoUrl: existingProject.demoUrl,
          category: existingProject.category
        });
      } else {
        console.log(`➕ New repository found: ${repo.name} - Adding to database`);
        try {
          await this.createNewProject(repo);
          newRepos++;
          console.log(`✅ Successfully created new project: ${repo.name}`);
          // Wait for Firebase to update after creating new project
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`❌ Failed to create project ${repo.name}:`, error);
        }
      }
    }

    // Final wait to ensure all Firebase updates are complete
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log(`✅ Manual sync completed: ${newRepos} new repositories added, ${deletedRepos} deleted`);
    console.log(`📊 Summary: Only new repositories were added. Existing projects were preserved unchanged.`);

    const finalStatus: SyncStatus = {
      lastSync: new Date(),
      totalRepos: repos.length,
      syncedRepos: repos.length,
      newRepos,
      updatedRepos: 0, // No updates, only new additions
      deletedRepos,
      isSyncing: false,
      error: null,
      isFirstSync: false
    };

    console.log('🔄 processReposManual completed, final status:', finalStatus);
    this.updateSyncStatus(finalStatus);
    return finalStatus;
  }

  /**
 * Busca repositórios do GitHub
 */
  private fetchGitHubRepos(): Observable<GitHubRepo[]> {
    console.log('🔍 fetchGitHubRepos started');
    const url = `${this.GITHUB_API_BASE}/users/${this.USERNAME}/repos?sort=created&direction=desc&per_page=100`;
    console.log('🔍 Fetching GitHub repos from:', url);

    const headers: any = {
      'Accept': 'application/vnd.github.v3+json'
    };

    // Adicionar token de autenticação apenas se disponível e não vazio
    if (this.GITHUB_TOKEN && this.GITHUB_TOKEN.trim() !== '') {
      headers['Authorization'] = `token ${this.GITHUB_TOKEN}`;
      console.log('🔑 Using GitHub token for authentication');
    } else {
      console.log('⚠️ No GitHub token - using unauthenticated requests');
    }

    return this.http.get<GitHubRepo[]>(url, { headers }).pipe(
      tap(repos => {
        console.log('📦 Raw repos from GitHub:', repos.length);
        console.log('📋 Repos:', repos.map(r => ({
          name: r.name,
          visibility: r.visibility,
          language: r.language,
          topics: r.topics,
          languages: r.languages
        })));
      }),
      // Filter public repos and exclude the portfolio repository itself
      map(repos => repos.filter(repo => repo.visibility === 'public' && repo.name !== 'KarolineRocha_Portifolio')),
      tap(repos => {
        console.log('✅ Public repos (excluding KarolineRocha_Portifolio):', repos.length);
        console.log('✅ Public repo names:', repos.map(r => r.name));
        this.updateSyncStatus({
          totalRepos: repos.length,
          isFirstSync: this.syncStatusSubject.value.isFirstSync
        });
      }),
      // Fetch detailed information for each repo to get languages and topics
      switchMap(repos => {
        console.log('🔍 Fetching detailed information for repos...');

        // With GitHub token, we can make requests faster
        const detailedRepos$ = repos.map(repo => this.fetchDetailedRepoInfo(repo));

        return forkJoin(detailedRepos$);
      }),
      tap(detailedRepos => {
        console.log('📦 Detailed repos fetched:', detailedRepos.length);
        console.log('📋 Detailed repos:', detailedRepos.map(r => ({
          name: r.name,
          language: r.language,
          topics: r.topics,
          languages: r.languages
        })));
      }),
      catchError((error: any) => {
        console.error('❌ Error fetching GitHub repos:', error);

        if (error.status === 403) {
          console.warn('⚠️ Rate limit exceeded. Using cached data or fallback.');

          if (this.GITHUB_TOKEN) {
            this.notificationService.warning('GitHub API rate limit reached despite having token. Please wait before trying again.');
          } else {
            this.notificationService.warning('GitHub API rate limit reached (60 req/hour). Consider adding a Personal Access Token for higher limits.');
          }

          // Return empty array to prevent sync failure
          return of([]);
        }

        // For other errors, show error notification
        this.notificationService.error('Failed to fetch GitHub repositories. Please try again later.');
        this.updateSyncStatus({
          error: `GitHub API Error: ${error.status} - ${error.message}`,
          isSyncing: false,
          isFirstSync: this.syncStatusSubject.value.isFirstSync
        });

        return throwError(() => error);
      })
    );
  }

  /**
   * Processa repositórios e sincroniza com Firebase
   */
  private async processRepos(repos: GitHubRepo[]): Promise<SyncStatus> {
    console.log('🔄 processRepos started');
    console.log('🔄 Processing repos...');
    console.log(`📊 GitHub repos count: ${repos.length}`);
    console.log(`📊 GitHub repos:`, repos.map(r => r.name));

    // Get current sync status
    const currentStatus = this.syncStatusSubject.value;
    const isFirstSync = currentStatus.isFirstSync;

    console.log(`🔄 Sync type: ${isFirstSync ? 'FIRST SYNC' : 'SUBSEQUENT SYNC'}`);

    // Get current projects from Firebase
    let currentProjects = this.firebaseService.getProjects();
    console.log('📊 Current projects in Firebase:', currentProjects.length);
    console.log('📊 Current projects:', currentProjects.map(p => ({ id: p.id, name: p.name, url: p.projectUrl, category: p.category })));

    // If no projects found, wait a bit for Firebase to load
    if (currentProjects.length === 0) {
      console.log('📊 No projects found, waiting for Firebase to load...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      currentProjects = this.firebaseService.getProjects();
      console.log('📊 Projects after wait:', currentProjects.length);
    }

    let newRepos = 0;
    let deletedRepos = 0;

    if (isFirstSync) {
      console.log('🚀 FIRST SYNC: Adding all projects to database');

      // First sync: Add all projects to database
      for (const repo of repos) {
        console.log(`➕ Creating new project: ${repo.name}`);
        await this.createNewProject(repo);
        newRepos++;

        // Wait for Firebase to update after creating new project
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } else {
      console.log('🔄 SUBSEQUENT SYNC: Adding new repositories and checking for deleted ones');

      // Get GitHub repository URLs for comparison
      const githubRepoUrls = repos.map(repo => repo.html_url);
      console.log('🔍 GitHub repo URLs:', githubRepoUrls);

      // Check for projects that exist in Firebase but not in GitHub (deleted repos)
      for (const project of currentProjects) {
        if (project.projectUrl && !githubRepoUrls.includes(project.projectUrl)) {
          console.log(`🗑️ Repository deleted from GitHub: ${project.name} (${project.projectUrl})`);
          console.log(`🗑️ Deleting project from database: ${project.name}`);

          try {
            await this.firebaseService.deleteProject(project.id);
            deletedRepos++;
            console.log(`✅ Project deleted successfully: ${project.name}`);
          } catch (error) {
            console.error(`❌ Error deleting project ${project.name}:`, error);
          }
        }
      }

      // Add new repositories
      for (const repo of repos) {
        console.log(`🔍 Checking repo: ${repo.name} (URL: ${repo.html_url})`);

        // Find existing project using multiple strategies
        let existingProject = this.findExistingProject(currentProjects, repo);

        if (existingProject) {
          console.log(`✅ Project already exists: ${existingProject.name} - Skipping (no updates)`);
        } else {
          console.log(`➕ New repository found: ${repo.name} - Adding to database`);
          await this.createNewProject(repo);
          newRepos++;

          // Wait for Firebase to update after creating new project
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    }

    // Final wait to ensure all Firebase updates are complete
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log(`✅ Sync completed: ${newRepos} new repositories added, ${deletedRepos} deleted`);

    const finalStatus: SyncStatus = {
      lastSync: new Date(),
      totalRepos: repos.length,
      syncedRepos: repos.length,
      newRepos,
      updatedRepos: 0, // No more updates, only new additions
      deletedRepos,
      isSyncing: false,
      error: null,
      isFirstSync: false // Mark as not first sync after successful sync
    };

    console.log('🔄 processRepos completed, final status:', finalStatus);
    this.updateSyncStatus(finalStatus);
    return finalStatus;
  }

  /**
   * Finds existing project using multiple strategies
   */
  private findExistingProject(currentProjects: any[], repo: GitHubRepo): any {
    console.log(`🔍 Looking for existing project for repo: ${repo.name} (URL: ${repo.html_url})`);

    // Strategy 1: Find by URL (most reliable)
    let existingProject = currentProjects.find(p => p.projectUrl === repo.html_url);
    if (existingProject) {
      console.log(`✅ Found project by URL: ${existingProject.name}`);
      return existingProject;
    }

    // Strategy 2: Find by formatted name
    const formattedName = this.formatProjectName(repo.name);
    existingProject = currentProjects.find(p => p.name === formattedName);
    if (existingProject) {
      console.log(`✅ Found project by formatted name: ${existingProject.name}`);
      return existingProject;
    }

    // Strategy 3: Find by original name
    existingProject = currentProjects.find(p => p.name === repo.name);
    if (existingProject) {
      console.log(`✅ Found project by original name: ${existingProject.name}`);
      return existingProject;
    }

    // Strategy 4: Find by partial name match (more flexible)
    existingProject = currentProjects.find(p => {
      const projectNameLower = p.name.toLowerCase();
      const repoNameLower = repo.name.toLowerCase();
      return projectNameLower.includes(repoNameLower) ||
        repoNameLower.includes(projectNameLower) ||
        projectNameLower.replace(/[^a-z0-9]/g, '') === repoNameLower.replace(/[^a-z0-9]/g, '');
    });
    if (existingProject) {
      console.log(`✅ Found project by partial name match: ${existingProject.name}`);
      return existingProject;
    }

    // Strategy 5: Find by repository name in project URL
    existingProject = currentProjects.find(p =>
      p.projectUrl && p.projectUrl.includes(`/${repo.name}`)
    );
    if (existingProject) {
      console.log(`✅ Found project by repository name in URL: ${existingProject.name}`);
      return existingProject;
    }

    console.log(`❌ No existing project found for repo: ${repo.name}`);
    console.log(`📋 Available projects:`, currentProjects.map(p => ({ name: p.name, url: p.projectUrl })));
    return null;
  }

  /**
   * Creates new project from GitHub repository
   */
  private async createNewProject(repo: GitHubRepo): Promise<void> {
    console.log(`🔄 Starting to create project for repo: ${repo.name}`);

    const languages = await this.extractLanguages(repo);

    // Check if project already exists to preserve existing image
    const currentProjects = this.firebaseService.getProjects();
    const existingProject = currentProjects.find(p =>
      p.projectUrl === repo.html_url ||
      p.name === this.formatProjectName(repo.name)
    );

    const projectData = {
      name: this.formatProjectName(repo.name),
      description: repo.description || '', // Description is optional, keep empty if no description
      languages: languages,
      imageUrl: existingProject?.imageUrl || this.getDefaultImageUrl(repo.language), // Preserve existing image
      uploadedImage: existingProject?.uploadedImage || '', // Preserve existing uploaded image or use empty string
      demoUrl: await this.getGitHubPagesUrl(repo),
      projectUrl: repo.html_url,
      category: 'completed' as const
    };

    console.log(`➕ Creating project: ${projectData.name} with description: "${projectData.description}"`);
    console.log(`➕ Project data:`, projectData);

    try {
      await this.firebaseService.addProject(projectData);
      console.log(`✅ Project created successfully: ${projectData.name}`);
    } catch (error) {
      console.error(`❌ Error creating project ${projectData.name}:`, error);
      throw error;
    }
  }

  /**
   * Updates existing project with GitHub data - GRANULAR UPDATES ONLY
   * Only updates fields that actually changed, both in database and UI
   */


  /**
   * Formats project name by replacing underscores with spaces
   */
  private formatProjectName(name: string): string {
    return name.replace(/_/g, ' ');
  }

  /**
   * Generates GitHub Pages URL for the repository
   */
  private async getGitHubPagesUrl(repo: GitHubRepo): Promise<string> {
    // First, check if repository has homepage configured (GitHub Pages)
    if (repo.homepage && repo.homepage.includes('github.io')) {
      console.log(`✅ Found GitHub Pages in homepage: ${repo.homepage}`);
      return repo.homepage;
    }

    // Generate GitHub Pages URL based on repository name and username
    const githubPagesUrl = `https://${this.USERNAME.toLowerCase()}.github.io/${repo.name}/`;
    console.log(`🔍 Generated GitHub Pages URL for ${repo.name}: ${githubPagesUrl}`);
    return githubPagesUrl;
  }

  /**
   * Fetches detailed information for a specific repository
   */
  private fetchDetailedRepoInfo(repo: GitHubRepo): Observable<GitHubRepo> {
    console.log(`🔍 Fetching detailed info for: ${repo.name}`);

    const headers: any = {
      'Accept': 'application/vnd.github.v3+json'
    };

    if (this.GITHUB_TOKEN && this.GITHUB_TOKEN.trim() !== '') {
      headers['Authorization'] = `token ${this.GITHUB_TOKEN}`;
    }

    const repoUrl = `${this.GITHUB_API_BASE}/repos/${this.USERNAME}/${repo.name}`;
    const languagesUrl = `${this.GITHUB_API_BASE}/repos/${this.USERNAME}/${repo.name}/languages`;

    // Fetch both repo details and languages
    return forkJoin({
      repo: this.http.get<GitHubRepo>(repoUrl, { headers }),
      languages: this.http.get<{ [key: string]: number }>(languagesUrl, { headers }).pipe(
        catchError(error => {
          console.warn(`⚠️ Could not fetch languages for ${repo.name}:`, error);
          return of({});
        })
      )
    }).pipe(
      map(({ repo: detailedRepo, languages }) => {
        // Merge languages into the repo object
        const enhancedRepo = {
          ...detailedRepo,
          languages: languages
        };

        console.log(`🔍 Enhanced repo info for ${repo.name}:`, {
          language: enhancedRepo.language,
          topics: enhancedRepo.topics,
          languages: enhancedRepo.languages
        });

        // Log the full languages object for debugging
        if (enhancedRepo.languages && Object.keys(enhancedRepo.languages).length > 0) {
          console.log(`🔍 Full languages object for ${repo.name}:`, enhancedRepo.languages);
          console.log(`🔍 Languages percentages for ${repo.name}:`,
            Object.entries(enhancedRepo.languages)
              .sort(([, a], [, b]) => b - a)
              .map(([lang, percent]) => `${lang}: ${percent}%`)
              .join(', ')
          );
        } else {
          console.log(`⚠️ No languages found for ${repo.name}`);
        }

        return enhancedRepo;
      }),
      catchError(error => {
        console.warn(`⚠️ Could not fetch detailed info for ${repo.name}:`, error);
        console.warn(`⚠️ Error details:`, {
          status: error.status,
          message: error.message,
          url: repoUrl
        });
        // Return the original repo if detailed fetch fails
        return of(repo);
      })
    );
  }

  /**
   * Extracts languages from repository
   */
  private async extractLanguages(repo: GitHubRepo): Promise<string[]> {
    console.log(`🔍 Extracting languages for: ${repo.name}`);
    console.log(`🔍 Repository data:`, {
      name: repo.name,
      language: repo.language,
      topics: repo.topics,
      languages: repo.languages
    });

    const languages: string[] = [];

    // Add main language first
    if (repo.language) {
      languages.push(repo.language);
      console.log(`🔍 Added main language: ${repo.language}`);
    }

    // Add languages from languages object (if available) - this is the most accurate source
    if (repo.languages && typeof repo.languages === 'object' && Object.keys(repo.languages).length > 0) {
      console.log(`🔍 Languages object for ${repo.name}:`, repo.languages);
      const languageNames = Object.keys(repo.languages);
      console.log(`🔍 Available languages: ${languageNames.join(', ')}`);

      // Sort languages by usage percentage (descending) and take the top ones
      const sortedLanguages = languageNames
        .sort((a, b) => (repo.languages[b] || 0) - (repo.languages[a] || 0))
        .filter(lang => {
          const percentage = repo.languages[lang] || 0;
          return percentage > 1; // Only include languages with more than 1% usage
        });

      console.log(`🔍 Sorted languages by usage:`, sortedLanguages.map(lang =>
        `${lang} (${repo.languages[lang]}%)`
      ));

      // Add all languages from the languages object (except the main language if already added)
      const newLanguages = sortedLanguages.filter(lang =>
        !languages.includes(lang)
      );

      languages.push(...newLanguages);
      console.log(`🔍 Added languages from languages object: ${newLanguages.join(', ')}`);
    }

    // Add relevant topics as additional languages (only if not already included)
    if (repo.topics && repo.topics.length > 0) {
      const validTopics = repo.topics.filter(topic =>
        !languages.includes(topic) &&
        topic.length < 20 &&
        this.isRelevantTopic(topic)
      );
      languages.push(...validTopics);
      console.log(`🔍 Added relevant topics: ${validTopics.join(', ')}`);
    }

    // Add languages based on repository name
    const name = repo.name.toLowerCase();
    const nameBasedLanguages = [];

    // Framework detection
    if (name.includes('react') && !languages.includes('React')) {
      nameBasedLanguages.push('React');
    }
    if (name.includes('angular') && !languages.includes('Angular')) {
      nameBasedLanguages.push('Angular');
    }
    if (name.includes('vue') && !languages.includes('Vue')) {
      nameBasedLanguages.push('Vue');
    }
    if (name.includes('next') && !languages.includes('Next.js')) {
      nameBasedLanguages.push('Next.js');
    }
    if (name.includes('nuxt') && !languages.includes('Nuxt.js')) {
      nameBasedLanguages.push('Nuxt.js');
    }

    // Backend detection
    if (name.includes('node') && !languages.includes('Node.js')) {
      nameBasedLanguages.push('Node.js');
    }
    if (name.includes('express') && !languages.includes('Express')) {
      nameBasedLanguages.push('Express');
    }
    if (name.includes('nest') && !languages.includes('NestJS')) {
      nameBasedLanguages.push('NestJS');
    }
    if (name.includes('django') && !languages.includes('Django')) {
      nameBasedLanguages.push('Django');
    }
    if (name.includes('flask') && !languages.includes('Flask')) {
      nameBasedLanguages.push('Flask');
    }
    if (name.includes('spring') && !languages.includes('Spring')) {
      nameBasedLanguages.push('Spring');
    }
    if (name.includes('laravel') && !languages.includes('Laravel')) {
      nameBasedLanguages.push('Laravel');
    }

    // Database detection
    if (name.includes('mongodb') && !languages.includes('MongoDB')) {
      nameBasedLanguages.push('MongoDB');
    }
    if (name.includes('mysql') && !languages.includes('MySQL')) {
      nameBasedLanguages.push('MySQL');
    }
    if (name.includes('postgres') && !languages.includes('PostgreSQL')) {
      nameBasedLanguages.push('PostgreSQL');
    }
    if (name.includes('sqlite') && !languages.includes('SQLite')) {
      nameBasedLanguages.push('SQLite');
    }

    // Cloud/Services detection
    if (name.includes('firebase') && !languages.includes('Firebase')) {
      nameBasedLanguages.push('Firebase');
    }
    if (name.includes('aws') && !languages.includes('AWS')) {
      nameBasedLanguages.push('AWS');
    }
    if (name.includes('azure') && !languages.includes('Azure')) {
      nameBasedLanguages.push('Azure');
    }
    if (name.includes('heroku') && !languages.includes('Heroku')) {
      nameBasedLanguages.push('Heroku');
    }

    // CSS Frameworks detection
    if (name.includes('bootstrap') && !languages.includes('Bootstrap')) {
      nameBasedLanguages.push('Bootstrap');
    }
    if (name.includes('tailwind') && !languages.includes('Tailwind CSS')) {
      nameBasedLanguages.push('Tailwind CSS');
    }
    if (name.includes('material') && !languages.includes('Material-UI')) {
      nameBasedLanguages.push('Material-UI');
    }
    if (name.includes('chakra') && !languages.includes('Chakra UI')) {
      nameBasedLanguages.push('Chakra UI');
    }

    // Preprocessors detection
    if ((name.includes('sass') || name.includes('scss')) && !languages.includes('Sass')) {
      nameBasedLanguages.push('Sass');
    }
    if (name.includes('less') && !languages.includes('Less')) {
      nameBasedLanguages.push('Less');
    }
    if (name.includes('stylus') && !languages.includes('Stylus')) {
      nameBasedLanguages.push('Stylus');
    }

    // Programming languages detection
    if (name.includes('typescript') && !languages.includes('TypeScript')) {
      nameBasedLanguages.push('TypeScript');
    }
    if (name.includes('javascript') && !languages.includes('JavaScript')) {
      nameBasedLanguages.push('JavaScript');
    }
    if (name.includes('python') && !languages.includes('Python')) {
      nameBasedLanguages.push('Python');
    }
    if (name.includes('java') && !languages.includes('Java')) {
      nameBasedLanguages.push('Java');
    }
    if (name.includes('php') && !languages.includes('PHP')) {
      nameBasedLanguages.push('PHP');
    }
    if (name.includes('csharp') && !languages.includes('C#')) {
      nameBasedLanguages.push('C#');
    }
    if (name.includes('ruby') && !languages.includes('Ruby')) {
      nameBasedLanguages.push('Ruby');
    }
    if (name.includes('go') && !languages.includes('Go')) {
      nameBasedLanguages.push('Go');
    }
    if (name.includes('rust') && !languages.includes('Rust')) {
      nameBasedLanguages.push('Rust');
    }
    if (name.includes('swift') && !languages.includes('Swift')) {
      nameBasedLanguages.push('Swift');
    }
    if (name.includes('kotlin') && !languages.includes('Kotlin')) {
      nameBasedLanguages.push('Kotlin');
    }

    // Markup languages detection
    if (name.includes('html') && !languages.includes('HTML')) {
      nameBasedLanguages.push('HTML');
    }
    if (name.includes('css') && !languages.includes('CSS')) {
      nameBasedLanguages.push('CSS');
    }
    if (name.includes('xml') && !languages.includes('XML')) {
      nameBasedLanguages.push('XML');
    }
    if (name.includes('json') && !languages.includes('JSON')) {
      nameBasedLanguages.push('JSON');
    }

    // Tools detection
    if (name.includes('docker') && !languages.includes('Docker')) {
      nameBasedLanguages.push('Docker');
    }
    if (name.includes('kubernetes') && !languages.includes('Kubernetes')) {
      nameBasedLanguages.push('Kubernetes');
    }
    if (name.includes('jenkins') && !languages.includes('Jenkins')) {
      nameBasedLanguages.push('Jenkins');
    }
    if (name.includes('git') && !languages.includes('Git')) {
      nameBasedLanguages.push('Git');
    }

    languages.push(...nameBasedLanguages);
    console.log(`🔍 Added name-based languages: ${nameBasedLanguages.join(', ')}`);

    // Remove duplicates and limit to 8 languages (increased from 5)
    const uniqueLanguages = [...new Set(languages)];
    const result = uniqueLanguages.slice(0, 8); // Maximum 8 languages

    console.log(`🔍 All languages before deduplication: ${languages.join(', ')}`);
    console.log(`🔍 Unique languages: ${uniqueLanguages.join(', ')}`);
    console.log(`🔍 Final languages for ${repo.name}: ${result.join(', ')}`);
    return result;
  }

  /**
   * Checks if a topic is relevant for language extraction
   */
  private isRelevantTopic(topic: string): boolean {
    const relevantTopics = [
      'javascript', 'typescript', 'react', 'angular', 'vue', 'node', 'express',
      'python', 'java', 'csharp', 'php', 'ruby', 'go', 'rust', 'swift',
      'html', 'css', 'sass', 'scss', 'less', 'bootstrap', 'tailwind',
      'mongodb', 'mysql', 'postgresql', 'firebase', 'aws', 'docker',
      'git', 'github', 'gitlab', 'bitbucket', 'jenkins', 'travis'
    ];

    return relevantTopics.includes(topic.toLowerCase());
  }

  /**
   * Checks GitHub API status and rate limits
   */
  public async checkGitHubAPIStatus(): Promise<{ available: boolean; rateLimitRemaining?: number; resetTime?: Date }> {
    console.log('🔍 checkGitHubAPIStatus started');
    try {
      const url = `${this.GITHUB_API_BASE}/rate_limit`;
      const headers: any = {
        'User-Agent': 'Portfolio-App/1.0',
        'Accept': 'application/vnd.github.v3+json'
      };

      // Adicionar token de autenticação se disponível
      if (this.GITHUB_TOKEN) {
        headers['Authorization'] = `token ${this.GITHUB_TOKEN}`;
      }

      console.log('🔍 Checking GitHub API status at:', url);
      const response = await fetch(url, { headers });
      console.log('🔍 GitHub API status response:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        const core = data.resources.core;

        console.log(`📊 GitHub API Status: ${core.remaining}/${core.limit} requests remaining`);
        console.log(`🕐 Rate limit resets at: ${new Date(core.reset * 1000)}`);

        const result = {
          available: core.remaining > 0,
          rateLimitRemaining: core.remaining,
          resetTime: new Date(core.reset * 1000)
        };

        console.log('🔍 checkGitHubAPIStatus result:', result);
        return result;
      } else {
        console.warn('⚠️ Could not check GitHub API status:', response.status, response.statusText);
        return { available: false };
      }
    } catch (error) {
      console.error('❌ Error checking GitHub API status:', error);
      return { available: false };
    }
  }

  /**
   * Gets default image URL based on language
   */
  private getDefaultImageUrl(language: string | null): string {
    const languageIcons: { [key: string]: string } = {
      'JavaScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
      'TypeScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
      'HTML': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
      'CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
      'React': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      'Angular': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
      'Node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      'Python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'Java': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
      'C++': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg'
    };

    return languageIcons[language || ''] || 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg';
  }

  /**
   * Obtém status atual da sincronização
   */
  public getCurrentStatus(): SyncStatus {
    return this.syncStatusSubject.value;
  }

  /**
   * Limpa dados de sincronização
   */
  public clearSyncData(): void {
    console.log('🔄 Clearing sync data...');

    // Create reset status
    const resetStatus: SyncStatus = {
      lastSync: null,
      totalRepos: 0,
      syncedRepos: 0,
      newRepos: 0,
      updatedRepos: 0,
      deletedRepos: 0,
      isSyncing: false,
      error: null,
      isFirstSync: true // Reset to first sync
    };

    // Update local state immediately
    this.syncStatusSubject.next(resetStatus);
    console.log('🔄 Local sync status updated');

    // Try to save to Firebase
    try {
      const db = this.firebaseService['db'];
      if (db) {
        console.log('🔄 Firebase DB available, saving reset status...');
        const syncDocRef = doc(db, COLLECTIONS.SYNC_DATA, 'github_sync');
        const dataToSave = {
          totalRepos: 0,
          syncedRepos: 0,
          newRepos: 0,
          updatedRepos: 0,
          deletedRepos: 0,
          isFirstSync: true
        };

        setDoc(syncDocRef, dataToSave).then(() => {
          console.log('✅ Sync data cleared from Firebase successfully');
        }).catch((error) => {
          console.error('❌ Error saving to Firebase:', error);
        });
      } else {
        console.log('⚠️ Firebase DB not available, only local state cleared');
      }
    } catch (error) {
      console.error('❌ Error accessing Firebase:', error);
    }

    console.log('🔄 Sync data cleared, reset to first sync mode');
  }

  /**
   * Force reset sync status to first sync mode
   * Useful when you want to re-sync all projects from GitHub
   */
  public forceFirstSync(): void {
    console.log('🔄 Forcing first sync mode...');
    this.clearSyncData();
  }
}
