import { Component, OnInit } from '@angular/core';
import { ProjectsService, Project } from '../../core/services/projects.service';

@Component({
  selector: 'app-latest-projects',
  templateUrl: './latest-projects.component.html',
  styleUrls: ['./latest-projects.component.scss']
})
export class LatestProjectsComponent implements OnInit {
  allProjects: Project[] = [];
  displayedProjects: Project[] = [];
  showAllProjects = false;
  maxInitialProjects = 6;

  constructor(private projectsService: ProjectsService) { }

  ngOnInit() {
    console.log('LatestProjectsComponent initialized');
    this.loadProjects();
  }

  loadProjects() {
    // Get featured projects from the service
    this.allProjects = this.projectsService.getFeaturedProjects();
    console.log('Loaded projects from service:', this.allProjects.map(p => p.name));
    console.log('Total projects:', this.allProjects.length);
    this.updateDisplayedProjects();
  }

  updateDisplayedProjects() {
    this.displayedProjects = this.showAllProjects
      ? this.allProjects
      : this.allProjects.slice(0, this.maxInitialProjects);

    console.log('Displayed projects:', this.displayedProjects.map(p => p.name));
    console.log('Show more button should appear:', this.showMoreButton);
  }

  toggleShowMore() {
    this.showAllProjects = !this.showAllProjects;
    this.updateDisplayedProjects();
  }

  get showMoreButton() {
    return this.allProjects.length > this.maxInitialProjects;
  }

  get buttonText() {
    return this.showAllProjects ? 'Show Less' : 'Show More';
  }

  get projects() {
    return this.displayedProjects;
  }
}
