import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProjectsService, Project } from '../../core/services/projects.service';
import { Subscription } from 'rxjs';

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

  constructor(private projectsService: ProjectsService) { }

  ngOnInit() {
    console.log('LatestProjectsComponent initialized');
    this.loadProjects();

    // Subscribe to projects changes for automatic updates
    this.projectsSubscription = this.projectsService.projects$.subscribe(projects => {
      console.log('Projects updated, reloading latest projects');
      this.loadProjects();
    });
  }

  ngOnDestroy() {
    if (this.projectsSubscription) {
      this.projectsSubscription.unsubscribe();
    }
  }

  loadProjects() {
    // Get all projects and sort by creation date (newest first)
    let projects = this.projectsService.getProjects();

    // Sort by creation date (newest first)
    projects.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // Newest first
    });

    this.allProjects = projects;
    console.log('Loaded projects from service:', this.allProjects.map(p => p.name));
    console.log('Total projects:', this.allProjects.length);
    this.updateDisplayedProjects();
  }

  updateDisplayedProjects() {
    // Always show only the 3 most recent projects
    this.displayedProjects = this.allProjects.slice(0, this.maxProjects);
    console.log('Displayed projects (3 most recent):', this.displayedProjects.map(p => p.name));
  }

  get projects() {
    return this.displayedProjects;
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
