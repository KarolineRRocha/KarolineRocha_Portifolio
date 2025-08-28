import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectsService, Project } from '../../core/services/projects.service';
import { AuthService } from '../../core/services/auth.service';
import { TypewriterService } from '../../services/typewriter.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, OnDestroy {
  typewriterText = '';
  private typewriterSubscription!: Subscription;

  // Projects properties
  projects: Project[] = [];
  isAdmin = false;
  private projectsSubscription!: Subscription;
  private authStateSubscription!: Subscription;

  constructor(
    private router: Router,
    private projectsService: ProjectsService,
    private authService: AuthService,
    private typewriterService: TypewriterService
  ) { }

  ngOnInit() {
    console.log('🏠 Home page: Initializing...');

    this.typewriterService.startTypewriter({
      phrases: [
        'Ready to create amazing things!',
        'Let\'s build something incredible!',
        'Code that makes a difference!',
        'Innovation through code!'
      ]
    });

    this.typewriterSubscription = this.typewriterService.typewriterText$.subscribe(
      text => this.typewriterText = text
    );

    // Set initial auth state
    this.isAdmin = this.authService.isAuthenticated();

    // Subscribe to projects changes for automatic updates
    this.projectsSubscription = this.projectsService.projects$.subscribe(projects => {
      console.log('🏠 Home page: Projects updated, reloading featured projects...');
      console.log('🏠 Home page: Received projects count:', projects.length);
      console.log('🏠 Home page: Projects received:', projects.map(p => ({
        name: p.name,
        order: p.order,
        imageUrl: p.imageUrl,
        uploadedImage: p.uploadedImage ? 'present' : 'not present',
        uploadedImageLength: p.uploadedImage?.length || 0
      })));

      // Force reload of featured projects
      this.loadProjects();

      // Force change detection
      setTimeout(() => {
        console.log('🏠 Home page: Change detection triggered');
      }, 100);
    });

    // Subscribe to auth state changes
    this.authStateSubscription = this.authService.authState$.subscribe(isAuthenticated => {
      this.isAdmin = isAuthenticated;
    });

    // Initial load
    this.loadProjects();
  }

  ngOnDestroy() {
    if (this.projectsSubscription) {
      this.projectsSubscription.unsubscribe();
    }
    if (this.authStateSubscription) {
      this.authStateSubscription.unsubscribe();
    }
    if (this.typewriterSubscription) {
      this.typewriterSubscription.unsubscribe();
    }
    this.typewriterService.stopTypewriter();
  }

    // Navigate to contact page and scroll to contact form
  navigateToContactForm(): void {
    this.router.navigate(['/contact']).then(() => {
      // Wait for the page to load, then scroll to the contact form
      setTimeout(() => {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
          // Check device size and set appropriate header offset
          const width = window.innerWidth;
          let headerOffset = 0;
          
          if (width <= 768) {
            // Mobile: 3.75rem = 60px
            headerOffset = 60;
          } else if (width <= 900) {
            // Tablet Portrait: 4rem = 64px
            headerOffset = 64;
          } else if (width <= 1024) {
            // Tablet Landscape: 4.5rem = 72px
            headerOffset = 72;
          }
          
          const elementPosition = contactForm.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    });
  }

  // Load projects from service
  loadProjects() {
    console.log('🏠 Home page: Loading projects...');

    // Get fresh data from service
    let allProjects = this.projectsService.getProjects();
    console.log('🏠 Home page: Total projects available:', allProjects.length);

    // Filter only completed projects for featured section
    const completedProjects = allProjects.filter(project => project.category === 'completed');
    console.log('🏠 Home page: Completed projects:', completedProjects.length);

    // Sort by order (as defined in projects page) - this reflects drag & drop changes
    completedProjects.sort((a, b) => {
      const orderA = a.order || 0;
      const orderB = b.order || 0;
      return orderA - orderB; // Lower order first (top of list)
    });

    // Show only the 3 first projects (top 3 in order)
    const newProjects = completedProjects.slice(0, 3);

    // Check if projects actually changed
    const projectsChanged = this.projects.length !== newProjects.length ||
      this.projects.some((oldProject, index) => {
        const newProject = newProjects[index];
        if (!newProject) return true;

        const uploadedImageChanged = oldProject.uploadedImage !== newProject.uploadedImage;

        // Debug: Log detailed comparison for uploadedImage
        if (oldProject.uploadedImage || newProject.uploadedImage) {
          console.log('🏠 Home page: UploadedImage comparison for project:', newProject.name, {
            oldUploadedImagePresent: !!oldProject.uploadedImage,
            newUploadedImagePresent: !!newProject.uploadedImage,
            oldUploadedImageLength: oldProject.uploadedImage?.length || 0,
            newUploadedImageLength: newProject.uploadedImage?.length || 0,
            uploadedImageChanged: uploadedImageChanged
          });
        }

        const hasChanges = !newProject ||
          oldProject.id !== newProject.id ||
          oldProject.name !== newProject.name ||
          oldProject.order !== newProject.order ||
          oldProject.imageUrl !== newProject.imageUrl ||
          uploadedImageChanged;

        if (hasChanges) {
          console.log('🏠 Home page: Changes detected for project:', newProject.name, {
            oldImageUrl: oldProject.imageUrl,
            newImageUrl: newProject.imageUrl,
            oldUploadedImage: oldProject.uploadedImage ? 'present' : 'not present',
            newUploadedImage: newProject.uploadedImage ? 'present' : 'not present',
            uploadedImageChanged: uploadedImageChanged
          });
        }

        return hasChanges;
      });

    if (projectsChanged) {
      console.log('🏠 Home page: Projects changed, updating featured projects...');
      this.projects = [...newProjects]; // Force new array reference
      console.log('🏠 Home page: Featured projects updated:', this.projects.length);
      console.log('🏠 Home page: Featured projects:', this.projects.map(p => ({ name: p.name, order: p.order, imageUrl: p.imageUrl })));
    } else {
      console.log('🏠 Home page: No changes detected in projects');
    }
  }



  // Timeline circle hover control method
  onProjectHover(projectIndex: number, isHovering: boolean) {
    const timelineNode = document.querySelector(`.timeline-project:nth-child(${projectIndex + 1}) .node-circle`) as HTMLElement;
    if (timelineNode) {
      if (isHovering) {
        timelineNode.classList.add('timeline-circle-hover');
      } else {
        timelineNode.classList.remove('timeline-circle-hover');
      }
    }
  }


}
