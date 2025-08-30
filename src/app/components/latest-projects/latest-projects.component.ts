import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ProjectsService, Project } from '../../core/services/projects.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-latest-projects',
  templateUrl: './latest-projects.component.html',
  styleUrls: ['./latest-projects.component.scss']
})
export class LatestProjectsComponent implements OnInit, OnDestroy {
  allProjects: Project[] = [];
  displayedProjects: Project[] = [];
  maxProjects = 3; // Always show only 3 projects
  private projectsSubscription!: Subscription;
  private updateCounter = 0; // Counter to force re-renders

  constructor(
    private projectsService: ProjectsService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    console.log('📋 LatestProjects: Initializing...');

    // Subscribe to projects changes for automatic updates
    this.projectsSubscription = this.projectsService.projects$.subscribe(projects => {
      console.log('📋 LatestProjects: Projects updated, reloading featured projects...');
      console.log('📋 LatestProjects: Received projects count:', projects.length);
      console.log('📋 LatestProjects: Projects received:', projects.map(p => ({
        name: p.name,
        order: p.order,
        imageUrl: p.imageUrl,
        uploadedImage: p.uploadedImage ? 'present' : 'not present',
        uploadedImageLength: p.uploadedImage?.length || 0,
        description: p.description,
        languages: p.languages,
        updatedAt: p.updatedAt?.getTime()
      })));

      // Check if any project has uploadedImage
      const projectsWithUploadedImage = projects.filter(p => p.uploadedImage);
      console.log('📋 LatestProjects: Projects with uploadedImage in subscription:', projectsWithUploadedImage.length);
      projectsWithUploadedImage.forEach(p => {
        console.log('📋 LatestProjects: Project with uploadedImage in subscription:', p.name, 'Length:', p.uploadedImage?.length);
      });

      // Force reload of featured projects
      this.loadProjects();

      // Force change detection and image refresh with more aggressive approach
      setTimeout(() => {
        console.log('📋 LatestProjects: Change detection triggered');
        this.updateCounter++; // Increment counter to force re-render
        this.forceImageRefresh();
      }, 100);
    });

    // Initial load
    this.loadProjects();
  }

  ngOnDestroy() {
    if (this.projectsSubscription) {
      this.projectsSubscription.unsubscribe();
    }
  }

  // Environment detection methods
  isLocalEnvironment(): boolean {
    return this.projectsService.isLocalEnvironment();
  }

  isProductionEnvironment(): boolean {
    return this.projectsService.isProductionEnvironment();
  }

  isRealTimeSyncEnabled(): boolean {
    return this.projectsService.isRealTimeSyncEnabled();
  }

  isCacheEnabled(): boolean {
    return this.projectsService.isCacheEnabled();
  }

  isAdminFeaturesEnabled(): boolean {
    return this.projectsService.isAdminFeaturesEnabled();
  }

  showAdminControls(): boolean {
    return environment.firebase.showAdminControls && this.isAdminFeaturesEnabled();
  }

  showDevIndicators(): boolean {
    return environment.firebase.showDevIndicators && this.isLocalEnvironment();
  }

  getEnvironmentStatus(): string {
    if (this.isLocalEnvironment()) {
      return '🛠️ Development Mode';
    } else if (this.isProductionEnvironment()) {
      return '🚀 Production Mode';
    }
    return '❓ Unknown Mode';
  }

  getSyncStatus(): string {
    return this.isRealTimeSyncEnabled() ? '🔄 Real-time Sync' : '💾 Cached Mode';
  }

  loadProjects() {
    console.log('📋 LatestProjects: Loading projects...');

    // Get fresh data from service
    let projects = this.projectsService.getProjects();
    console.log('📋 LatestProjects: Total projects available:', projects.length);

    // Filter only completed projects for featured section
    const completedProjects = projects.filter(project => project.category === 'completed');
    console.log('📋 LatestProjects: Completed projects:', completedProjects.length);

    // Sort by order (as defined in projects page) - this reflects drag & drop changes
    completedProjects.sort((a, b) => {
      const orderA = a.order || 0;
      const orderB = b.order || 0;
      return orderA - orderB; // Lower order first (top of list)
    });

    this.allProjects = completedProjects;
    console.log('📋 LatestProjects: Loaded projects:', this.allProjects.map(p => ({
      name: p.name,
      order: p.order,
      imageUrl: p.imageUrl,
      uploadedImage: p.uploadedImage ? 'present' : 'not present',
      uploadedImageLength: p.uploadedImage?.length || 0,
      uploadedImageStart: p.uploadedImage?.substring(0, 50) || 'N/A'
    })));

    // Check if any project has uploadedImage
    const projectsWithUploadedImage = this.allProjects.filter(p => p.uploadedImage);
    console.log('📋 LatestProjects: Projects with uploadedImage:', projectsWithUploadedImage.length);
    projectsWithUploadedImage.forEach(p => {
      console.log('📋 LatestProjects: Project with uploadedImage:', p.name, 'Length:', p.uploadedImage?.length);
    });

    this.updateDisplayedProjects();
  }

  updateDisplayedProjects() {
    // Always show only the 3 first projects (top 3 in order)
    const newDisplayedProjects = this.allProjects.slice(0, this.maxProjects);

    // Check if displayed projects actually changed
    const projectsChanged = this.displayedProjects.length !== newDisplayedProjects.length ||
      this.displayedProjects.some((oldProject, index) => {
        const newProject = newDisplayedProjects[index];
        if (!newProject) return true;

        // Simple direct comparison for uploadedImage
        const uploadedImageChanged = oldProject.uploadedImage !== newProject.uploadedImage;

        // Debug: Log detailed comparison for uploadedImage
        if (oldProject.uploadedImage || newProject.uploadedImage) {
          console.log('📋 UploadedImage comparison for project:', newProject.name, {
            oldUploadedImagePresent: !!oldProject.uploadedImage,
            newUploadedImagePresent: !!newProject.uploadedImage,
            oldUploadedImageLength: oldProject.uploadedImage?.length || 0,
            newUploadedImageLength: newProject.uploadedImage?.length || 0,
            oldUploadedImageStart: oldProject.uploadedImage?.substring(0, 50) || 'N/A',
            newUploadedImageStart: newProject.uploadedImage?.substring(0, 50) || 'N/A',
            uploadedImageChanged: uploadedImageChanged
          });
        }

        const hasChanges =
          oldProject.id !== newProject.id ||
          oldProject.name !== newProject.name ||
          oldProject.description !== newProject.description ||
          oldProject.order !== newProject.order ||
          oldProject.imageUrl !== newProject.imageUrl ||
          uploadedImageChanged ||
          oldProject.demoUrl !== newProject.demoUrl ||
          oldProject.projectUrl !== newProject.projectUrl ||
          JSON.stringify(oldProject.languages) !== JSON.stringify(newProject.languages) ||
          oldProject.updatedAt?.getTime() !== newProject.updatedAt?.getTime();

        if (hasChanges) {
          console.log('📋 LatestProjects: Changes detected for project:', newProject.name, {
            oldImageUrl: oldProject.imageUrl,
            newImageUrl: newProject.imageUrl,
            oldUploadedImage: oldProject.uploadedImage ? 'present' : 'not present',
            newUploadedImage: newProject.uploadedImage ? 'present' : 'not present',
            uploadedImageChanged: uploadedImageChanged,
            oldUploadedImageLength: oldProject.uploadedImage?.length || 0,
            newUploadedImageLength: newProject.uploadedImage?.length || 0,
            oldUploadedImageStart: oldProject.uploadedImage?.substring(0, 50) || 'N/A',
            newUploadedImageStart: newProject.uploadedImage?.substring(0, 50) || 'N/A',
            oldUpdatedAt: oldProject.updatedAt?.getTime(),
            newUpdatedAt: newProject.updatedAt?.getTime()
          });
        }

        return hasChanges;
      });

    if (projectsChanged) {
      console.log('📋 LatestProjects: Displayed projects changed, updating...');
      this.updateCounter++; // Increment counter to force re-render
      this.displayedProjects = [...newDisplayedProjects]; // Force new array reference
      console.log('📋 LatestProjects: Featured projects updated:', this.displayedProjects.length);
      console.log('📋 LatestProjects: Featured projects:', this.displayedProjects.map(p => ({
        name: p.name,
        order: p.order,
        imageUrl: p.imageUrl,
        uploadedImage: p.uploadedImage ? 'present' : 'not present',
        uploadedImageLength: p.uploadedImage?.length || 0,
        description: p.description,
        languages: p.languages,
        demoUrl: p.demoUrl,
        projectUrl: p.projectUrl,
        updatedAt: p.updatedAt?.getTime()
      })));

      // Check if any displayed project has uploadedImage and force refresh
      const projectsWithUploadedImage = this.displayedProjects.filter(p => p.uploadedImage);
      if (projectsWithUploadedImage.length > 0) {
        console.log('📋 LatestProjects: Found projects with uploadedImage, forcing additional refresh');
        this.forceUploadedImageRefresh();
      }

      // Force change detection
      this.cdr.detectChanges();

      // Force another change detection after a short delay to ensure images are updated
      setTimeout(() => {
        this.cdr.detectChanges();
        console.log('📋 LatestProjects: Second change detection triggered');
      }, 100);
    } else {
      console.log('📋 LatestProjects: No changes detected in displayed projects');
    }
  }

  get projects() {
    return this.displayedProjects;
  }

  trackByProjectId(index: number, project: Project): string {
    // Include image information and update counter in the trackBy to force re-render when image changes
    const imageHash = project.uploadedImage ? this.hashCode(project.uploadedImage) : (project.imageUrl ? this.hashCode(project.imageUrl) : 0);
    const trackByValue = `${project.id}-${imageHash}-${project.updatedAt?.getTime() || 0}-${this.updateCounter}`;
    console.log('📋 trackByProjectId called for project:', project.name, 'trackByValue:', trackByValue, 'uploadedImage present:', !!project.uploadedImage);
    return trackByValue;
  }

  getImageSrc(project: Project): string {
    const imageUrl = project.uploadedImage || project.imageUrl;
    if (!imageUrl) return '';

    console.log('📋 getImageSrc called for project:', project.name, {
      uploadedImage: project.uploadedImage ? 'present' : 'not present',
      imageUrl: project.imageUrl,
      finalImageUrl: imageUrl,
      isBase64: imageUrl.startsWith('data:'),
      uploadedImageLength: project.uploadedImage?.length || 0,
      uploadedImageStart: project.uploadedImage?.substring(0, 50) || 'N/A',
      updatedAt: project.updatedAt?.getTime()
    });

    // For uploaded images (base64), return directly without cache-busting
    if (imageUrl.startsWith('data:')) {
      console.log('📋 Returning base64 image directly without cache-busting');
      return imageUrl;
    }

    // For URL images, add timestamp for cache-busting
    const timestamp = project.updatedAt ? project.updatedAt.getTime() : Date.now();
    const result = imageUrl + '?t=' + timestamp + '&c=' + this.updateCounter;
    console.log('📋 Returning URL image with timestamp and counter:', result);
    return result;
  }

  private hashCode(str: string): number {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  // Timeline circle hover control methods
  onProjectImageHover(projectIndex: number, isHovering: boolean) {
    const timelineNode = document.querySelector(`.timeline-project:nth-child(${projectIndex + 1}) .node-circle`) as HTMLElement;
    if (timelineNode) {
      if (isHovering) {
        timelineNode.classList.add('timeline-circle-hover');
      } else {
        timelineNode.classList.remove('timeline-circle-hover');
      }
    }
  }

  onProjectCardHover(projectIndex: number, isHovering: boolean) {
    const timelineNode = document.querySelector(`.timeline-project:nth-child(${projectIndex + 1}) .node-circle`) as HTMLElement;
    if (timelineNode) {
      if (isHovering) {
        timelineNode.classList.add('timeline-circle-hover');
      } else {
        timelineNode.classList.remove('timeline-circle-hover');
      }
    }
  }

  onImageLoad(projectName: string) {
    console.log('📋 Image loaded for project:', projectName);
  }

  onImageError(projectName: string) {
    console.log('📋 Image error for project:', projectName);
  }

  // Force refresh of the component
  forceRefresh() {
    console.log('📋 Force refreshing latest projects component');
    this.updateCounter++; // Increment counter to force re-render
    this.loadProjects();
    this.cdr.detectChanges();

    // Force multiple change detection cycles
    setTimeout(() => {
      this.cdr.detectChanges();
      console.log('📋 Second change detection cycle');
    }, 50);

    setTimeout(() => {
      this.cdr.detectChanges();
      console.log('📋 Third change detection cycle');
    }, 100);
  }

  // Force refresh of images specifically
  forceImageRefresh() {
    console.log('📋 Force refreshing images in latest projects component');
    // Force change detection to update images
    this.cdr.detectChanges();

    // Force another change detection after a short delay
    setTimeout(() => {
      this.cdr.detectChanges();
      console.log('📋 Image refresh change detection triggered');
    }, 50);
  }

  // Test method to simulate uploadedImage change
  testUploadedImageChange() {
    console.log('📋 Testing uploadedImage change simulation');
    if (this.displayedProjects.length > 0) {
      const firstProject = this.displayedProjects[0];
      console.log('📋 Before change - Project:', firstProject.name, 'uploadedImage present:', !!firstProject.uploadedImage);

      // Simulate a change by updating the updateCounter
      this.updateCounter++;
      console.log('📋 Update counter incremented to:', this.updateCounter);

      // Force change detection
      this.cdr.detectChanges();

      console.log('📋 After change - Project:', firstProject.name, 'uploadedImage present:', !!firstProject.uploadedImage);
    }
  }

  // Method to force refresh when uploadedImage changes
  forceUploadedImageRefresh() {
    console.log('📋 Force refreshing uploaded images specifically');
    this.updateCounter++;

    // Force multiple change detection cycles
    this.cdr.detectChanges();
    setTimeout(() => {
      this.cdr.detectChanges();
      console.log('📋 Second change detection for uploaded images');
    }, 50);
    setTimeout(() => {
      this.cdr.detectChanges();
      console.log('📋 Third change detection for uploaded images');
    }, 100);
  }
}
