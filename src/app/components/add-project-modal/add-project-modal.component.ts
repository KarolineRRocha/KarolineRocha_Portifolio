import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { NewProjectData } from '../../core/services/projects.service';

@Component({
  selector: 'app-add-project-modal',
  templateUrl: './add-project-modal.component.html',
  styleUrls: ['./add-project-modal.component.scss']
})
export class AddProjectModalComponent implements OnInit, OnDestroy {
  @Output() save = new EventEmitter<NewProjectData>();
  @Output() cancel = new EventEmitter<void>();

  newProject: NewProjectData = {
    name: '',
    description: '',
    technologies: '',
    imageUrl: '',
    demoUrl: '',
    projectUrl: '',
    category: 'completed'
  };

  technologies: string[] = [];
  isAddingTech = false;
  newTech = '';
  selectedFileName: string = '';

  ngOnInit(): void {
    this.preventScroll();
  }

  ngOnDestroy(): void {
    this.enableScroll();
  }

  private preventScroll(): void {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
  }

  private enableScroll(): void {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
  }

  onSave() {
    if (this.newProject.name && this.newProject.description) {
      // Convert technologies array to comma-separated string
      this.newProject.technologies = this.technologies.join(', ');
      this.save.emit(this.newProject);
    }
  }

  onCancel() {
    this.enableScroll();
    this.cancel.emit();
  }

  addTechnology() {
    if (this.newTech && this.newTech.trim()) {
      this.technologies.push(this.newTech.trim());
      this.newTech = '';
      this.isAddingTech = false;
    }
  }

  removeTechnology(index: number) {
    this.technologies.splice(index, 1);
  }

  startAddingTech() {
    this.isAddingTech = true;
  }

  cancelAddingTech() {
    this.isAddingTech = false;
    this.newTech = '';
  }

  onImageUrlChange() {
    // Trigger image preview update
    const img = document.getElementById('new-project-image-preview') as HTMLImageElement;
    if (img && this.newProject.imageUrl) {
      img.src = this.newProject.imageUrl;
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;

      // Create a local URL for preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newProject.imageUrl = e.target.result;
        this.onImageUrlChange();
      };
      reader.readAsDataURL(file);
    }
  }

  resetForm() {
    this.newProject = {
      name: '',
      description: '',
      technologies: '',
      imageUrl: '',
      demoUrl: '',
      projectUrl: '',
      category: 'completed'
    };
    this.technologies = [];
    this.isAddingTech = false;
    this.newTech = '';
    this.selectedFileName = '';
  }
}
