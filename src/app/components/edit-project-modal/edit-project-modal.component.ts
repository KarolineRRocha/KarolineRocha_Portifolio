import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Project } from '../../core/services/projects.service';

@Component({
  selector: 'app-edit-project-modal',
  templateUrl: './edit-project-modal.component.html',
  styleUrls: ['./edit-project-modal.component.scss']
})
export class EditProjectModalComponent implements OnInit, OnDestroy {
  @Input() project: Project | null = null;
  @Output() save = new EventEmitter<Partial<Project>>();
  @Output() cancel = new EventEmitter<void>();

  editedProject: Partial<Project> = {};
  selectedFileName: string = '';

  ngOnInit() {
    this.preventScroll();
    if (this.project) {
      this.editedProject = {
        name: this.project.name,
        description: this.project.description,
        technologies: [...this.project.technologies],
        imageUrl: this.project.imageUrl,
        demoUrl: this.project.demoUrl || '',
        projectUrl: this.project.projectUrl || ''
      };
    }
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
    if (this.editedProject.name && this.editedProject.description) {
      this.save.emit(this.editedProject);
    }
  }

  onCancel() {
    this.enableScroll();
    this.cancel.emit();
  }

  addTechnology() {
    const tech = prompt('Enter technology name:');
    if (tech && tech.trim()) {
      if (!this.editedProject.technologies) {
        this.editedProject.technologies = [];
      }
      this.editedProject.technologies.push(tech.trim());
    }
  }

  removeTechnology(index: number) {
    if (this.editedProject.technologies) {
      this.editedProject.technologies.splice(index, 1);
    }
  }

  onImageUrlChange() {
    // Trigger image preview update
    const img = document.getElementById('project-image-preview') as HTMLImageElement;
    if (img && this.editedProject.imageUrl) {
      img.src = this.editedProject.imageUrl;
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;

      // Create a local URL for preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.editedProject.imageUrl = e.target.result;
        this.onImageUrlChange();
      };
      reader.readAsDataURL(file);
    }
  }
}
