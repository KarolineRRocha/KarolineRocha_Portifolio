import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProjectsService, Project, NewProjectData } from '../../core/services/projects.service';
import { GitHubService } from '../../core/services/github.service';
import { AuthService } from '../../core/services/auth.service';
import { AdminCommunicationService } from '../../core/services/admin-communication.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss']
})
export class ProjectPageComponent implements OnInit, OnDestroy {
  showMore = false;
  showLoginModal = false;
  showEditModal = false;
  showAddModal = false;
  editingProject: Project | null = null;

  // GitHub configuration
  githubUsername = 'karolinerrocha'; // Change this to your GitHub username
  githubUser: any = null;
  syncStatus: any = {};
  detailedSyncInfo: any = {};
  isSyncing = false;

  // Project data
  completedProjects: Project[] = [];
  comingSoonProjects: Project[] = [];
  hiddenProjects: Project[] = [];

  // New project form
  newProject: NewProjectData = {
    name: '',
    description: '',
    technologies: '',
    imageUrl: '',
    demoUrl: '',
    projectUrl: '',
    category: 'completed'
  };

  isAddingProject = false;
  showProjectStats = false;
  showGitHubConfig = false;
  projectStats: any = {};

  private destroy$ = new Subject<void>();
  private subscriptions = new Subscription();
  private syncInterval: any;

  constructor(
    private projectsService: ProjectsService,
    private githubService: GitHubService,
    private authService: AuthService,
    private adminCommunicationService: AdminCommunicationService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    // Force reset to ensure correct project order
    this.forceResetProjectOrder();

    // Add FreePlayFinder if it doesn't exist (without resetting everything)
    this.addFreePlayFinderIfMissing();

    // Load initial data
    this.loadProjects();
    this.loadProjectStats();
    this.loadGitHubStatus();

    // Subscribe to authentication changes
    this.subscriptions.add(
      this.authService.isAuthenticated$.subscribe(isAuthenticated => {
        // Authentication state changed
      })
    );

    // Subscribe to admin login requests from footer
    this.subscriptions.add(
      this.adminCommunicationService.adminLoginRequested$.subscribe(() => {
        this.showLogin();
      })
    );

    // Clean up any existing duplicates on initialization
    this.cleanupExistingDuplicates();

    // NO INITIAL GITHUB SYNC - Disabled to preserve manual changes
    // this.checkGitHubForChanges();

    // Set up automatic hourly syncing
    this.setupAutomaticSync();
  }

  // Force reset project order to ensure correct sequence
  private forceResetProjectOrder(): void {
    const projects = this.projectsService.getProjects();

    // Define the correct order for existing projects
    const correctOrder = [
      { id: 'cesaebookspace', order: 1 },
      { id: 'freeplayfinder', order: 2 },
      { id: 'ecofab', order: 3 },
      { id: 'upload', order: 4 },
      { id: 'jogo-quatro-em-linha', order: 5 },
      { id: 'they-develop-and-cook', order: 6 }
    ];

    let hasChanges = false;

    // Only update order for existing projects if they have wrong order
    correctOrder.forEach(({ id, order }) => {
      const project = projects.find(p => p.id === id);
      if (project && project.order !== order) {
        this.projectsService.updateProject(id, { order });
        hasChanges = true;
      }
    });

    // Only log if there were actual changes
    if (hasChanges) {
      console.log('Project order updated to ensure correct sequence');
    }
  }

  // Add FreePlayFinder if it doesn't exist, without resetting other projects
  private addFreePlayFinderIfMissing(): void {
    const projects = this.projectsService.getProjects();
    const freePlayFinderExists = projects.some(p => p.id === 'freeplayfinder');

    if (!freePlayFinderExists) {
      // Use the new selective update method
      const projectData = {
        id: 'freeplayfinder',
        name: 'FreePlayFinder',
        description: 'A gaming discovery platform that helps users find free-to-play games across multiple platforms. Features advanced filtering, user reviews, and personalized recommendations.',
        technologies: ['Angular', 'TypeScript', 'Node.js'],
        imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
        demoUrl: 'https://karolinerrocha.github.io/mundo-dos-jogos/',
        projectUrl: 'https://karolinerrocha.github.io/mundo-dos-jogos/',
        category: 'completed' as const,
        featured: true,
        order: 2
      };

      const wasAdded = this.projectsService.ensureProjectExists(projectData);

      if (wasAdded) {
        console.log('FreePlayFinder project added successfully');
      }
    } else {
      // Project exists, just ensure it has the correct order and demo URL
      const freePlayFinder = projects.find(p => p.id === 'freeplayfinder');
      if (freePlayFinder) {
        const updates: any = {};

        if (freePlayFinder.order !== 2) {
          updates.order = 2;
        }

        if (freePlayFinder.demoUrl === '#' || freePlayFinder.projectUrl === '#') {
          updates.demoUrl = 'https://karolinerrocha.github.io/mundoDosJogos/';
          updates.projectUrl = 'https://karolinerrocha.github.io/mundoDosJogos/';
        }

        if (Object.keys(updates).length > 0) {
          this.projectsService.updateProjectAttributes('freeplayfinder', updates);
          console.log('FreePlayFinder updated with correct order and demo URL');
        }
      }
    }

    // Fix any other projects with incorrect demo URLs
    this.updateOnlyChangedAttributes();
  }

  // Update only specific attributes that are wrong or have changed in GitHub
  // This preserves all other data including images, descriptions, etc.
  private updateOnlyChangedAttributes(): void {
    const result = this.projectsService.updateOnlyChangedAttributes();
    if (result.updated > 0) {
      console.log(`Updated ${result.updated} projects with correct GitHub information`);
      console.log(`Preserved ${result.preserved} projects unchanged`);
      this.loadProjects(); // Reload to show updated data
    }
  }

  // Clean up existing duplicates on component initialization
  private cleanupExistingDuplicates(): void {
    const result = this.projectsService.cleanupDuplicateProjects();
    if (result.removed > 0 || result.reordered > 0) {
      this.loadProjects(); // Reload projects after cleanup
    }
  }

  loadProjects(): void {
    const allCompletedProjects = this.projectsService.getCompletedProjects();

    if (this.isAdmin) {
      // When admin is logged in, show 5 projects + Create New card = 6 total cards
      // Hide the rest as hidden projects
      this.completedProjects = allCompletedProjects.slice(0, 5);
      this.hiddenProjects = allCompletedProjects.slice(5);
    } else {
      // When not admin, show 6 projects
      this.completedProjects = allCompletedProjects.slice(0, 6);
      this.hiddenProjects = allCompletedProjects.slice(6);
    }

    this.comingSoonProjects = this.projectsService.getComingSoonProjects();

    // Debug: Log current project data to see demo URLs
    console.log('🔍 Current project data:');
    this.completedProjects.forEach(project => {
      console.log(`Project: ${project.name}`);
      console.log(`  Demo URL: ${project.demoUrl}`);
      console.log(`  Project URL: ${project.projectUrl}`);
    });
  }

  loadProjectStats(): void {
    const projects = this.projectsService.getProjects();
    this.projectStats = {
      total: projects.length,
      completed: projects.filter(p => p.category === 'completed').length,
      comingSoon: projects.filter(p => p.category === 'coming-soon').length,
      hidden: this.hiddenProjects.length,
      featured: projects.filter(p => p.featured).length
    };
  }

  loadGitHubStatus(): void {
    // Only try to load GitHub info if we have a valid username
    if (!this.githubUsername || this.githubUsername.trim() === '') {
      return;
    }

    this.githubService.getUserInfo(this.githubUsername).subscribe({
      next: (user) => {
        this.githubUser = user;
      },
      error: (error) => {
        // Don't show error notification for GitHub API issues
        // This is expected behavior when offline or rate limited
        console.warn('GitHub user info not available:', error.message);
        this.githubUser = null;
      }
    });

    // Get sync status (this might be a property, not an observable)
    this.syncStatus = this.githubService.getSyncStatus();
  }

  showLogin(): void {
    this.showLoginModal = true;
  }

  hideLogin(): void {
    this.showLoginModal = false;
  }

  onLoginSuccess(): void {
    this.hideLogin();
  }

  onLoginCancel(): void {
    this.hideLogin();
  }

  logout(): void {
    this.authService.logout();
    this.notificationService.success('Logged out successfully');
  }

  autoSyncGitHub(): void {
    // DISABLED - No sync to prevent any unwanted updates to project data
    this.notificationService.warning('GitHub sync is disabled to preserve your manual changes. Your projects are safe and unchanged.');
    console.log('🚫 GitHub sync disabled to preserve manual changes');
  }

  saveNewProject(projectData: NewProjectData): void {
    this.isAddingProject = true;

    try {
      const newProject = this.projectsService.addProject(projectData);
      if (newProject) {
        this.notificationService.success(`Project "${newProject.name}" created successfully!`);
        this.loadProjects();
        this.loadProjectStats();
      } else {
        this.notificationService.error('Error creating project. Please try again.');
      }
    } catch (error) {
      this.notificationService.error('Error creating project. Please try again.');
    } finally {
      this.showAddModal = false;
      this.isAddingProject = false;
    }
  }

  deleteProject(projectId: string): void {
    this.notificationService.confirmDelete(
      'this project',
      () => {
        try {
          const success = this.projectsService.deleteProject(projectId);
          if (success) {
            this.notificationService.success('Project deleted successfully!');
            this.loadProjects();
            this.loadProjectStats();
          } else {
            this.notificationService.error('Error deleting project. Please try again.');
          }
        } catch (error) {
          this.notificationService.error('Error deleting project. Please try again.');
        }
      }
    );
  }

  updateProject(projectId: string, updates: Partial<Project>): void {
    try {
      const updatedProject = this.projectsService.updateProject(projectId, updates);
      if (updatedProject) {
        this.loadProjects();
        this.loadProjectStats();
      } else {
        this.notificationService.error('Error updating project. Please try again.');
      }
    } catch (error) {
      this.notificationService.error('Error updating project. Please try again.');
    }
  }

  toggleProjectFeatured(projectId: string): void {
    const projects = this.projectsService.getProjects();
    const project = projects.find(p => p.id === projectId);
    if (project) {
      this.updateProject(projectId, { featured: !project.featured });
      // Removed success notification - no longer showing featured status message
    }
  }

  cleanupProjects(): void {
    const result = this.projectsService.cleanupDuplicateProjects();

    if (result.removed > 0 || result.reordered > 0) {
      let message = `Cleanup completed! Removed: ${result.removed}, Reordered: ${result.reordered}`;

      this.notificationService.success(message);
    } else {
      this.notificationService.success('No duplicates found! All projects are already properly organized.');
    }

    this.loadProjects();
    this.loadProjectStats();
  }

  listAllProjects(): void {
    const projects = this.projectsService.getProjects();
    const message = `Total projects: ${projects.length}\n` +
      `Completed: ${projects.filter(p => p.category === 'completed').length}\n` +
      `Coming Soon: ${projects.filter(p => p.category === 'coming-soon').length}\n` +
      `Featured: ${projects.filter(p => p.featured).length}`;

    this.notificationService.info(message);
  }

  // Debug method to reset projects to default state
  resetToDefaultProjects(): void {
    if (confirm('This will reset all projects to their default state. Are you sure?')) {
      this.projectsService.resetToDefaultProjects();
      this.loadProjects();
      this.notificationService.success('Projects reset to default state');
    }
  }

  // Authentication methods
  get isAdmin(): boolean {
    return this.authService.isAuthenticated();
  }

  // UI methods
  toggleShowMore(): void {
    this.showMore = !this.showMore;

    const allCompletedProjects = this.projectsService.getCompletedProjects();

    if (this.showMore) {
      // Show all projects
      this.completedProjects = allCompletedProjects;
      this.hiddenProjects = [];
    } else {
      // Show limited projects based on admin status
      if (this.isAdmin) {
        // When admin is logged in, show 5 projects + Create New card = 6 total cards
        this.completedProjects = allCompletedProjects.slice(0, 5);
        this.hiddenProjects = allCompletedProjects.slice(5);
      } else {
        // When not admin, show 6 projects
        this.completedProjects = allCompletedProjects.slice(0, 6);
        this.hiddenProjects = allCompletedProjects.slice(6);
      }
    }
  }

  getShowMoreButtonText(): string {
    return this.showMore ? 'Show Less' : 'Show More Projects';
  }

  shouldShowMoreButton(): boolean {
    // Get all completed projects (not just the displayed ones)
    const allCompletedProjects = this.projectsService.getCompletedProjects();
    // Show button if there are more than 6 completed projects total
    // OR if admin is logged in and we have 6+ projects (since Create New card makes it 7+ total)
    return allCompletedProjects.length > 6 || (this.isAdmin && allCompletedProjects.length >= 6);
  }

  // Project management methods
  createNewProject(): void {
    this.showAddModal = true;
  }

  cancelAddProject(): void {
    this.showAddModal = false;
  }

  editProject(projectId: string): void {
    const project = this.projectsService.getProjects().find(p => p.id === projectId);
    if (!project) {
      this.notificationService.error('Project not found!');
      return;
    }

    this.editingProject = project;
    this.showEditModal = true;
  }

  saveProjectEdit(updatedData: Partial<Project>): void {
    if (!this.editingProject) return;

    try {
      const updatedProject = this.projectsService.updateProject(this.editingProject.id, updatedData);
      if (updatedProject) {
        this.loadProjects();
        this.loadProjectStats();
      } else {
        this.notificationService.error('Error updating project. Please try again.');
      }
    } catch (error) {
      this.notificationService.error('Error updating project. Please try again.');
    } finally {
      this.showEditModal = false;
      this.editingProject = null;
    }
  }

  cancelProjectEdit(): void {
    this.showEditModal = false;
    this.editingProject = null;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscriptions.unsubscribe();
    clearInterval(this.syncInterval); // Clear the interval on component destruction
  }

  // Set up automatic syncing every hour
  private setupAutomaticSync(): void {
    // COMPLETELY DISABLED - No automatic sync to prevent any unwanted updates
    // Only manual sync will be available when explicitly requested
    console.log('🕐 Automatic GitHub sync COMPLETELY DISABLED - No automatic updates');
  }

  // Check GitHub repositories in real-time to see if project attributes have changed
  private async checkGitHubForChanges(): Promise<void> {
    try {
      this.isSyncing = true;
      console.log('Checking GitHub for project changes...');
      const result = await this.projectsService.checkGitHubForChanges();

      if (result.rateLimited) {
        console.log('⚠️ GitHub API rate limit exceeded. Will retry on next sync.');
        return;
      }

      if (result.updated > 0) {
        console.log(`✅ Updated ${result.updated} projects with changes from GitHub`);
        console.log(`✅ Preserved ${result.preserved} projects unchanged`);
        if (result.errors > 0) {
          console.log(`⚠️ ${result.errors} projects had errors during GitHub check`);
        }
        // DO NOT call loadProjects() - this would refresh everything
        // Only the specific attributes were updated, no need to reload
        this.notificationService.success(`Updated ${result.updated} projects from GitHub`);
      } else {
        console.log(`✅ All projects are up to date with GitHub (${result.preserved} checked)`);
        if (result.errors > 0) {
          console.log(`⚠️ ${result.errors} projects had errors during GitHub check`);
        }
      }
    } catch (error) {
      console.error('Error checking GitHub for changes:', error);
    } finally {
      this.isSyncing = false;
    }
  }
}

