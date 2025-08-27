import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectsService, Project } from '../../core/services/projects.service';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, OnDestroy {
  // Typewriter effect properties
  typewriterText = '';
  typewriterPhrases = [
    'Ready to create amazing things!',
    'Let\'s build something incredible!',
    'Code that makes a difference!',
    'Innovation through code!'
  ];
  currentPhraseIndex = 0;
  currentCharIndex = 0;
  isDeleting = false;

  // Projects properties
  projects: Project[] = [];
  isAdmin = false;
  private projectsSubscription!: Subscription;
  private authStateSubscription!: Subscription;

  constructor(
    private router: Router,
    private projectsService: ProjectsService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    console.log('🏠 Home page: Initializing...');
    this.startTypewriterEffect();

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
  }

  // Navigate to contact page and scroll to contact form
  navigateToContactForm(): void {
    this.router.navigate(['/contact']).then(() => {
      // Wait for the page to load, then scroll to the contact form
      setTimeout(() => {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
          contactForm.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
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

  // Typewriter effect
  private startTypewriterEffect(): void {
    setInterval(() => {
      const currentPhrase = this.typewriterPhrases[this.currentPhraseIndex];

      if (!this.isDeleting) {
        this.typewriterText = currentPhrase.substring(0, this.currentCharIndex + 1);
        this.currentCharIndex++;

        if (this.currentCharIndex === currentPhrase.length) {
          setTimeout(() => this.isDeleting = true, 2000);
        }
      } else {
        this.typewriterText = currentPhrase.substring(0, this.currentCharIndex - 1);
        this.currentCharIndex--;

        if (this.currentCharIndex === 0) {
          this.isDeleting = false;
          this.currentPhraseIndex = (this.currentPhraseIndex + 1) % this.typewriterPhrases.length;
        }
      }
    }, 100);
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


}
