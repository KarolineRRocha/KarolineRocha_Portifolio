import { Component, OnInit, OnDestroy } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ProjectsService, Project } from '../../core/services/projects.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { GitHubSyncService, SyncStatus } from '../../core/services/github-sync.service';
import { AdminCommunicationService } from '../../core/services/admin-communication.service';
import { FirebaseStorageService } from '../../core/services/firebase-storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss']
})
export class ProjectPageComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  completedProjects: Project[] = [];
  comingSoonProjects: Project[] = [];
  displayedProjects: Project[] = [];
  visibleCards: Array<{ type: 'project', project: Project } | { type: 'create' }> = [];
  isAdmin = false;
  showMore = false;
  syncStatus: SyncStatus | null = null;

  // Modal states

  showAddModal = false;
  showEditModal = false;
  editingProject: Project | null = null;

  private projectsSubscription: Subscription;
  private syncStatusSubscription: Subscription;

  private authStateSubscription: Subscription;


  constructor(
    private projectsService: ProjectsService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private githubSyncService: GitHubSyncService,
    private adminCommunicationService: AdminCommunicationService,
    private firebaseService: FirebaseStorageService
  ) {
    console.log('🚀 ProjectPageComponent constructor called');
    this.projectsSubscription = this.projectsService.projects$.subscribe(projects => {
      console.log('📊 Projects updated in component:', projects.length);
      console.log('📊 All projects:', projects.map(p => ({ id: p.id, name: p.name, category: p.category, order: p.order })));

      // Ensure projects array is never empty unless there are actually no projects
      if (projects.length === 0) {
        console.warn('⚠️ Received empty projects array, checking if this is correct');
      }

      this.projects = projects;
      this.completedProjects = this.projectsService.getCompletedProjects();
      console.log('📊 Completed projects:', this.completedProjects.length);
      console.log('📊 Completed projects:', this.completedProjects.map(p => ({ id: p.id, name: p.name, category: p.category, order: p.order })));

      this.comingSoonProjects = this.projectsService.getComingSoonProjects();
      console.log('📊 Coming soon projects:', this.comingSoonProjects.length);

      // Debug: Check if there are projects with undefined or null category
      const projectsWithInvalidCategory = projects.filter(p => !p.category);
      if (projectsWithInvalidCategory.length > 0) {
        console.warn('⚠️ Projects with invalid category:', projectsWithInvalidCategory);
      }

      // Debug: Check all projects and their categories
      console.log('🔍 All projects with categories:', projects.map(p => ({ name: p.name, category: p.category, id: p.id })));

      this.updateDisplayedProjects();
      this.updateVisibleCards();
    });

    this.syncStatusSubscription = this.githubSyncService.syncStatus$.subscribe(status => {
      this.syncStatus = status;
    });



    this.authStateSubscription = this.authService.authState$.subscribe(
      (isAuthenticated: boolean) => {
        console.log('🔐 ProjectPage: Auth state changed to:', isAuthenticated);
        console.log('🔐 Previous isAdmin value:', this.isAdmin);
        this.isAdmin = isAuthenticated;
        console.log('🔐 New isAdmin value:', this.isAdmin);
        this.updateVisibleCards(); // Update cards when auth state changes
        console.log('🔐 Updated visibleCards length:', this.visibleCards.length);
        console.log('🔐 Visible cards:', this.visibleCards.map(card => card.type === 'project' ? card.project.name : 'create'));
      }
    );
  }

  ngOnInit(): void {
    // Set initial auth state
    this.isAdmin = this.authService.isAuthenticated();
    console.log('🚀 ProjectPageComponent ngOnInit');
    console.log('🚀 isAdmin:', this.isAdmin);
    console.log('🚀 Initial projects count:', this.projects.length);
    console.log('🚀 Initial completed projects count:', this.completedProjects.length);

    // Não iniciar sincronização automática automaticamente
    // Será iniciada apenas quando admin fizer login
  }

  ngOnDestroy(): void {
    if (this.projectsSubscription) {
      this.projectsSubscription.unsubscribe();
    }
    if (this.syncStatusSubscription) {
      this.syncStatusSubscription.unsubscribe();
    }

    if (this.authStateSubscription) {
      this.authStateSubscription.unsubscribe();
    }


    // Parar sincronização automática
    this.githubSyncService.stopAutoSync();
  }



  /**
   * TrackBy function for project cards to optimize rendering
   */
  trackByProjectId(index: number, item: { type: 'project', project: Project } | { type: 'create' }): string {
    if (item.type === 'project') {
      return item.project.id;
    }
    return 'create-card';
  }

  /**
   * TrackBy function for project languages
   */
  trackByLanguage(index: number, lang: string): string {
    return lang;
  }

  /**
   * Handles drag and drop reordering of projects
   */
  onProjectDrop(event: CdkDragDrop<Array<{ type: 'project', project: Project } | { type: 'create' }>>): void {
    if (!this.isAdmin) {
      return; // Only admins can reorder
    }

    console.log('🔄 Project drop event:', event);
    console.log('🔄 Previous index:', event.previousIndex);
    console.log('🔄 Current index:', event.currentIndex);

    // Don't allow dropping the create card
    if (event.previousIndex === 0 && this.visibleCards[0].type === 'create') {
      console.log('⚠️ Cannot move create card');
      this.notificationService.warning('Cannot move the create project card');
      return;
    }

    // Don't allow dropping on the create card
    if (event.currentIndex === 0 && this.visibleCards[0].type === 'create') {
      console.log('⚠️ Cannot drop on create card');
      this.notificationService.warning('Cannot drop projects on the create card');
      return;
    }

    // Check if the position actually changed
    if (event.previousIndex === event.currentIndex) {
      console.log('🔄 No position change detected');
      return;
    }

    console.log('🔄 Moving project from position', event.previousIndex, 'to', event.currentIndex);

    // Move the item in the array
    moveItemInArray(this.visibleCards, event.previousIndex, event.currentIndex);

    // Update the order in Firebase for all projects
    this.updateProjectOrder();
  }

  /**
   * Reorders projects after deletion to fill the gap
   */
  private async reorderProjectsAfterDeletion(deletedOrder: number): Promise<void> {
    if (!this.isAdmin) {
      return;
    }

    try {
      console.log('🔄 Reordering projects after deletion of order:', deletedOrder);

      // Wait a bit more for Firebase to fully process the deletion
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get fresh data from Firebase
      const currentProjects = this.projectsService.getCompletedProjects();
      console.log('🔄 Current projects after deletion:', currentProjects.map(p => `${p.name} (order: ${p.order})`));

      // Get all completed projects that have order > deletedOrder
      const projectsToReorder = currentProjects.filter(project => (project.order || 0) > deletedOrder);

      console.log('🔄 Projects to reorder:', projectsToReorder.map(p => `${p.name} (order: ${p.order} -> ${(p.order || 0) - 1})`));

      if (projectsToReorder.length === 0) {
        console.log('🔄 No projects need reordering');
        return;
      }

      // Update order for each project (decrease by 1)
      const updatePromises = projectsToReorder.map(project => {
        const newOrder = (project.order || 0) - 1;
        console.log(`🔄 Updating ${project.name} from order ${project.order} to ${newOrder}`);
        return this.projectsService.updateProject(project.id, { order: newOrder });
      });

      await Promise.all(updatePromises);

      console.log('✅ Projects reordered successfully after deletion');
      this.notificationService.success(`Projects reordered successfully! ${projectsToReorder.length} projects updated.`);

    } catch (error) {
      console.error('❌ Error reordering projects after deletion:', error);
      this.notificationService.error('Failed to reorder projects after deletion. Please try again.');
    }
  }

  /**
   * Updates the order of projects in Firebase
   */
  private async updateProjectOrder(): Promise<void> {
    if (!this.isAdmin) {
      return;
    }

    try {
      console.log('🔄 Updating project order...');

      // Get only the project cards (exclude create card)
      const projectCards = this.visibleCards.filter(card => card.type === 'project');

      console.log('🔄 Project cards to update:', projectCards.map(card =>
        card.type === 'project' ? `${card.project.name} (ID: ${card.project.id})` : 'unknown'
      ));

      // Update order for each project
      const updatePromises = projectCards.map((card, index) => {
        if (card.type === 'project') {
          const newOrder = index;
          console.log(`🔄 Updating ${card.project.name} to order ${newOrder}`);
          return this.projectsService.updateProject(card.project.id, { order: newOrder });
        }
        return Promise.resolve();
      });

      await Promise.all(updatePromises);

      console.log('✅ Project order updated successfully');
      this.notificationService.success(`Project order updated successfully! ${projectCards.length} projects reordered.`);

      // The Firebase service will automatically update the projects through the observable
      // No need to manually refresh as the subscription will handle it

    } catch (error) {
      console.error('❌ Error updating project order:', error);
      this.notificationService.error('Failed to update project order. Please try again.');

      // Revert the visual change if the update failed
      this.updateVisibleCards();
    }
  }

  /**
   * Updates the displayed projects based on showMore state
   */
  private updateDisplayedProjects(): void {
    // Excludes the create project card from count
    const realProjects = this.completedProjects || [];
    console.log('🔄 updateDisplayedProjects called with:', realProjects.length, 'projects');

    if (this.showMore) {
      this.displayedProjects = realProjects;
    } else {
      this.displayedProjects = realProjects.slice(0, 6);
    }

    console.log('🔄 Displayed projects updated:', this.displayedProjects.length);

    // Update visible cards
    this.updateVisibleCards();
  }

  /**
   * Toggles between showing more or fewer projects
   */
  toggleShowMore(): void {
    this.showMore = !this.showMore;
    this.updateDisplayedProjects();
    this.updateVisibleCards();
  }

  /**
   * Updates visible cards based on projects and current state
   */
  private updateVisibleCards(): void {
    const cards: Array<{ type: 'project', project: Project } | { type: 'create' }> = [];

    // Ensure completedProjects is always an array
    const safeCompletedProjects = this.completedProjects || [];

    console.log('🔍 updateVisibleCards called:');
    console.log('🔍 isAdmin:', this.isAdmin);
    console.log('🔍 showMore:', this.showMore);
    console.log('🔍 completedProjects.length:', safeCompletedProjects.length);

    if (this.showMore) {
      // If "show more" is active, show all projects + create card if admin
      if (this.isAdmin) {
        cards.push({ type: 'create' }); // Card de criar sempre primeiro
        cards.push(...safeCompletedProjects.map(project => ({ type: 'project' as const, project })));
      } else {
        cards.push(...safeCompletedProjects.map(project => ({ type: 'project' as const, project })));
      }
    } else {
      // Se "show more" não está ativo, mostrar exatamente 6 cards
      if (this.isAdmin) {
        // Admin: 1 create card + up to 5 projects = 6 total cards
        cards.push({ type: 'create' }); // Card de criar sempre primeiro
        const projectsToShow = safeCompletedProjects.slice(0, 5);
        console.log('🔍 Admin mode - projectsToShow:', projectsToShow.length);
        cards.push(...projectsToShow.map(project => ({ type: 'project' as const, project })));
      } else {
        // Not admin: up to 6 projects
        const projectsToShow = safeCompletedProjects.slice(0, 6);
        console.log('🔍 Non-admin mode - projectsToShow:', projectsToShow.length);
        cards.push(...projectsToShow.map(project => ({ type: 'project' as const, project })));
      }
    }

    console.log('🔍 Cards to display:', cards.length);
    console.log('🔍 Cards:', cards.map(card => card.type === 'project' ? card.project.name : 'create'));

    this.visibleCards = cards;
  }

  /**
   * Verifica se deve mostrar o botão "mostrar mais"
   */
  shouldShowMoreButton(): boolean {
    // Só mostrar o botão se houver mais de 6 cards possíveis
    if (this.isAdmin) {
      // Admin: 5 projects + 1 create card = 6 cards
      // If there are more than 5 projects, show button
      return this.completedProjects.length > 5;
    } else {
      // Not admin: 6 projects
      // If there are more than 6 projects, show button
      return this.completedProjects.length > 6;
    }
  }

  /**
   * Gets the "show more" button text
   */
  getShowMoreButtonText(): string {
    return this.showMore ? 'Show Less' : 'Show More Projects';
  }





  /**
   * Shows project creation modal
   */
  createNewProject(): void {
    this.showAddModal = true;
  }

  /**
   * Hides project creation modal
   */
  cancelAddProject(): void {
    this.showAddModal = false;
  }

  /**
   * Shows project edit modal
   */
  editProject(project: Project): void {
    this.editingProject = { ...project };
    this.showEditModal = true;
  }

  /**
   * Hides project edit modal
   */
  cancelProjectEdit(): void {
    console.log('🔧 Canceling project edit, closing modal');
    this.showEditModal = false;
    this.editingProject = null;
  }

  async saveNewProject(projectData: any): Promise<void> {
    console.log('🚀 saveNewProject called with data:', projectData);
    console.log('🚀 Is admin:', this.isAdmin);

    if (!this.isAdmin) {
      console.error('❌ User is not authenticated as admin');
      this.notificationService.error('You must be logged in as admin to create projects');
      return;
    }

    // Validate that we have at least a name
    if (!projectData.name || projectData.name.trim() === '') {
      console.error('❌ Project name is required');
      this.notificationService.error('Project name is required');
      return;
    }

    try {
      console.log('🚀 Calling projectsService.addProject...');
      const newProject = await this.projectsService.addProject(projectData);
      console.log('🚀 addProject result:', newProject);

      if (newProject !== null) {
        console.log('🚀 Project created successfully:', newProject.name);
        this.notificationService.success(`Project "${newProject.name}" created successfully!`);
        this.showAddModal = false;
      } else {
        console.error('❌ addProject returned null');
        this.notificationService.error('Failed to create project - null result');
      }
    } catch (error: any) {
      console.error('❌ Error creating project:', error);
      console.error('❌ Error details:', {
        message: error?.message,
        code: error?.code,
        stack: error?.stack
      });

      // Provide more specific error messages based on error code
      if (error?.code === 'permission-denied') {
        this.notificationService.error('Permission denied. Please check your authentication.');
      } else if (error?.code === 'unavailable') {
        this.notificationService.error('Firebase service is unavailable. Please try again later.');
      } else if (error?.code === 'invalid-argument') {
        this.notificationService.error('Invalid project data. Please check all fields.');
      } else {
        this.notificationService.error(`Failed to create project: ${error?.message || 'Unknown error'}`);
      }
    }
  }

  async deleteProject(id: string): Promise<void> {
    const project = this.projects.find(p => p.id === id);
    if (!project) return;

    const confirmed = confirm(`Are you sure you want to delete the project "${project.name}"? This action cannot be undone.`);

    if (confirmed) {
      try {
        console.log('🗑️ Deleting project:', project.name, 'with order:', project.order);

        const success = await this.projectsService.deleteProject(id);
        if (success) {
          console.log('✅ Project deleted successfully, reordering remaining projects...');

          // Wait a moment for Firebase to process the deletion
          await new Promise(resolve => setTimeout(resolve, 500));

          // Reorder remaining projects to fill the gap
          await this.reorderProjectsAfterDeletion(project.order || 0);

          this.notificationService.success('Project deleted successfully!');
        } else {
          this.notificationService.error('Failed to delete project');
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        this.notificationService.error('Failed to delete project');
      }
    }
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    try {
      const updatedProject = await this.projectsService.updateProject(id, updates);
      if (updatedProject !== null) {
        this.notificationService.success(`Project "${updatedProject.name}" updated successfully!`);
      } else {
        this.notificationService.error('Failed to update project');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      this.notificationService.error('Failed to update project');
    }
  }

  async toggleProjectFeatured(id: string): Promise<void> {
    try {
      const success = await this.projectsService.toggleFeatured(id);
      if (success) {
        this.notificationService.success('Project featured status updated!');
      } else {
        this.notificationService.error('Failed to update featured status');
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
      this.notificationService.error('Failed to update featured status');
    }
  }

  async saveProjectEdit(updatedData: Partial<Project>): Promise<void> {
    console.log('🔧 saveProjectEdit called with:', updatedData);
    console.log('🔧 editingProject:', this.editingProject);

    if (!this.editingProject?.id) {
      console.error('❌ No project selected for editing');
      this.notificationService.error('No project selected for editing');
      return;
    }

    // Store current projects count for verification
    const currentProjectsCount = this.completedProjects.length;
    console.log('🔧 Current projects count before update:', currentProjectsCount);

    try {
      console.log('🔧 Updating project with ID:', this.editingProject.id);
      console.log('🔧 Updated data being sent:', updatedData);
      console.log('🔧 uploadedImage in updatedData:', updatedData['uploadedImage']);
      const updatedProject = await this.projectsService.updateProject(this.editingProject.id, updatedData);
      console.log('🔧 Update result:', updatedProject);

      if (updatedProject !== null) {
        // Wait a bit for Firebase to update and trigger the subscription
        await new Promise(resolve => setTimeout(resolve, 500));

        // Verify that projects are still available
        const newProjectsCount = this.completedProjects.length;
        console.log('🔧 Projects count after update:', newProjectsCount);

        if (newProjectsCount === 0 && currentProjectsCount > 0) {
          console.warn('⚠️ Projects disappeared after update, triggering manual refresh');
        }

        this.notificationService.success(`Project "${updatedProject.name}" updated successfully!`);
        console.log('🔧 Closing modal after successful update');
        this.showEditModal = false;
        this.editingProject = null;
      } else {
        console.error('❌ Update returned null');
        this.notificationService.error('Failed to update project');
        // Close modal even on error
        this.showEditModal = false;
        this.editingProject = null;
      }
    } catch (error) {
      console.error('❌ Error updating project:', error);
      this.notificationService.error('Failed to update project');
      // Close modal even on error
      this.showEditModal = false;
      this.editingProject = null;
    }
  }



  /**
   * Sincronização manual com GitHub
   * APENAS ADICIONA NOVOS REPOSITÓRIOS - não altera projetos existentes
   */
  async manualGitHubSync(): Promise<void> {
    console.log('🔄 Manual GitHub sync requested - ONLY ADDING NEW REPOSITORIES');
    try {
      // Use manual full sync that always checks for updates
      const status = await this.githubSyncService.manualFullSync().toPromise();
      console.log('🔄 Manual sync completed:', status);

      if (status) {
        const message = status.newRepos > 0
          ? `Sync completed: ${status.newRepos} new repositories added (existing projects preserved)`
          : 'Sync completed: No new repositories found (existing projects preserved)';
        this.notificationService.success(message);
      }
    } catch (error) {
      console.error('Manual sync error:', error);
      this.notificationService.error('Manual sync failed: ' + error);
    }
  }

  /**
 * Reset sync data and clear all projects (useful for testing)
 */
  resetSyncData(): void {
    console.log('🔄 Reset sync data button clicked');

    // Confirm with user before clearing all data
    const confirmed = confirm('⚠️ This will delete ALL projects from the application and database. Are you sure you want to continue?');
    if (!confirmed) {
      console.log('🔄 Reset cancelled by user');
      return;
    }

    try {
      console.log('🔄 Reset sync data and projects requested');

      // Clear sync data first
      this.githubSyncService.clearSyncData();

      // Clear all projects from Firebase
      this.firebaseService.clearAllProjects().then(() => {
        // Clear local projects
        this.projects = [];
        this.updateVisibleCards();

        this.notificationService.success('All projects and sync data cleared successfully.');
        console.log('✅ Reset completed - all projects and sync data cleared');
      }).catch((error) => {
        console.error('❌ Error clearing projects from Firebase:', error);
        this.notificationService.error('Failed to clear projects from database: ' + error);
      });

    } catch (error) {
      console.error('❌ Error resetting data:', error);
      this.notificationService.error('Failed to reset data: ' + error);
    }
  }

  /**
   * Force first sync mode
   */
  forceFirstSync(): void {
    this.githubSyncService.forceFirstSync();
    this.notificationService.info('Force sync mode activated. Next sync will re-sync all projects from GitHub.');
  }

  /**
   * Test sync functionality
   */
  async testSync(): Promise<void> {
    console.log('🧪 Test sync started');
    try {
      // Test direct sync without rate limit check
      console.log('🧪 Testing direct sync...');
      const status = await this.githubSyncService.syncWithGitHub().toPromise();
      console.log('🧪 Test sync completed:', status);
      if (status) {
        const message = status.newRepos > 0
          ? `Test sync completed: ${status.newRepos} new repositories added`
          : 'Test sync completed: No new repositories found';
        this.notificationService.success(message);
      } else {
        this.notificationService.warning('Test sync completed but no status returned');
      }
    } catch (error) {
      console.error('🧪 Test sync failed:', error);
      this.notificationService.error('Test sync failed: ' + error);
    }
  }





  /**
   * Formata data para exibição
   */
  formatDate(date: Date | null): string {
    if (!date) return 'Never';
    return new Date(date).toLocaleString();
  }

  /**
   * Verifica se está sincronizando
   */
  get isSyncing(): boolean {
    const syncing = this.syncStatus?.isSyncing || false;
    return syncing;
  }

  /**
   * Obtém status da sincronização
   */
  get syncStatusText(): string {
    if (!this.syncStatus) return 'No sync data';

    if (this.syncStatus.isSyncing) return 'Syncing with GitHub...';
    if (this.syncStatus.error) return `Error: ${this.syncStatus.error}`;

    const syncType = this.syncStatus.isFirstSync ? 'First sync' : 'Check for new repos';
    const lastSync = this.formatDate(this.syncStatus.lastSync);
    const reposInfo = `Repos: ${this.syncStatus.totalRepos}`;
    const stats = this.syncStatus.newRepos > 0
      ? ` | New: ${this.syncStatus.newRepos}`
      : '';

    return `${syncType} | Last: ${lastSync} | ${reposInfo}${stats}`;
  }
}

