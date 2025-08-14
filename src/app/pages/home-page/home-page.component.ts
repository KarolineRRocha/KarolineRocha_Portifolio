import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectsService, Project } from '../../core/services/projects.service';
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
  private projectsSubscription!: Subscription;

  constructor(
    private router: Router,
    private projectsService: ProjectsService
  ) { }

  ngOnInit() {
    this.startTypewriterEffect();
    this.loadProjects();

    // Subscribe to projects changes for automatic updates
    this.projectsSubscription = this.projectsService.projects$.subscribe(projects => {
      this.loadProjects();
    });
  }

  ngOnDestroy() {
    if (this.projectsSubscription) {
      this.projectsSubscription.unsubscribe();
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
    let allProjects = this.projectsService.getProjects();

    // Sort by creation date (newest first)
    allProjects.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // Newest first
    });

    // Show only the 3 most recent projects
    this.projects = allProjects.slice(0, 3);
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
