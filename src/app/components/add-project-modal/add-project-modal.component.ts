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
    languages: [],
    imageUrl: '',
    uploadedImage: undefined,
    demoUrl: '',
    projectUrl: '',
    category: 'completed'
  };

  languages: string[] = [];
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
    console.log('📝 onSave called');
    console.log('📝 Project data:', this.newProject);
    console.log('📝 Languages:', this.languages);

    // Validate required fields
    if (!this.newProject.name || this.newProject.name.trim() === '') {
      alert('Project name is required');
      return;
    }





    // Use languages array directly
    this.newProject.languages = [...this.languages];

    // Create clean project data
    const projectData = {
      name: this.newProject.name.trim(),
      description: this.newProject.description || '',
      languages: this.languages || [],
      imageUrl: this.newProject.imageUrl || '',
      uploadedImage: this.newProject.uploadedImage,
      demoUrl: this.newProject.demoUrl || '',
      projectUrl: this.newProject.projectUrl || '',
      category: this.newProject.category || 'completed'
    };

    console.log('📝 Emitting project data:', projectData);
    this.save.emit(projectData);
  }

  onCancel() {
    this.enableScroll();
    this.cancel.emit();
  }

  addLanguage() {
    if (this.newTech && this.newTech.trim()) {
      this.languages.push(this.newTech.trim());
      this.newTech = '';
      this.isAddingTech = false;
    }
  }

  removeLanguage(index: number) {
    this.languages.splice(index, 1);
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
    if (img) {
      img.src = this.newProject.uploadedImage || this.newProject.imageUrl || '';
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        alert('Arquivo muito grande! O tamanho máximo é 5MB.');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Tipo de arquivo não suportado! Use JPG, PNG, GIF ou WebP.');
        return;
      }

      this.selectedFileName = file.name;

      // Create a local URL for preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newProject.uploadedImage = e.target.result;
        this.onImageUrlChange();
        console.log('📁 Image uploaded successfully:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2) + 'MB');
      };
      reader.readAsDataURL(file);
    }
  }

  removeUploadedImage() {
    this.newProject.uploadedImage = ''; // Use empty string instead of null
    this.selectedFileName = '';
    this.onImageUrlChange();
    console.log('🗑️ Removed uploaded image, now using imageUrl only');
  }



  resetForm() {
    this.newProject = {
      name: '',
      description: '',
      languages: [],
      imageUrl: '',
      uploadedImage: '',
      demoUrl: '',
      projectUrl: '',
      category: 'completed'
    };
    this.languages = [];
    this.isAddingTech = false;
    this.newTech = '';
    this.selectedFileName = '';
  }
}
