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
  isAddingTech = false;
  newTech = '';
  editingTechIndex: number = -1;
  editingTechValue: string = '';

  ngOnInit() {
    this.preventScroll();
    if (this.project) {
      this.editedProject = {
        name: this.project.name,
        description: this.project.description,
        languages: [...this.project.languages],
        imageUrl: this.project.imageUrl,
        uploadedImage: this.project.uploadedImage,
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
    if (this.editedProject.name) {
      this.enableScroll(); // Restore scroll before emitting
      this.save.emit(this.editedProject);
    }
  }

  onCancel() {
    this.enableScroll();
    this.cancel.emit();
  }

  addLanguage() {
    if (this.newTech && this.newTech.trim()) {
      if (!this.editedProject.languages) {
        this.editedProject.languages = [];
      }
      this.editedProject.languages.push(this.newTech.trim());
      this.newTech = '';
      this.isAddingTech = false;
    }
  }

  startAddingTech() {
    this.isAddingTech = true;
  }

  cancelAddingLang() {
    this.isAddingTech = false;
    this.newTech = '';
  }

  startEditingLang(index: number, lang: string) {
    this.editingTechIndex = index;
    this.editingTechValue = lang;

    // Focus on the input after a short delay to ensure DOM is updated
    setTimeout(() => {
      const input = document.querySelector('.edit-lang-input') as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
    }, 10);
  }

  saveEditedLang() {
    if (this.editingTechValue && this.editingTechValue.trim() && this.editingTechIndex >= 0) {
      if (this.editedProject.languages) {
        this.editedProject.languages[this.editingTechIndex] = this.editingTechValue.trim();
      }
    }
    this.cancelEditingLang();
  }

  cancelEditingLang() {
    this.editingTechIndex = -1;
    this.editingTechValue = '';
  }

  moveTechnology(index: number, direction: 'left' | 'right') {
    if (!this.editedProject.languages) return;

    const languages = [...this.editedProject.languages];

    if (direction === 'left' && index > 0) {
      // Move left: swap with previous element
      [languages[index], languages[index - 1]] = [languages[index - 1], languages[index]];
    } else if (direction === 'right' && index < languages.length - 1) {
      // Move right: swap with next element
      [languages[index], languages[index + 1]] = [languages[index + 1], languages[index]];
    }

    this.editedProject.languages = languages;
  }

  removeLanguage(index: number) {
    if (this.editedProject.languages) {
      this.editedProject.languages.splice(index, 1);
    }
  }

  onImageUrlChange() {
    // Trigger image preview update
    const img = document.getElementById('project-image-preview') as HTMLImageElement;
    if (img) {
      img.src = this.editedProject.uploadedImage || this.editedProject.imageUrl || '';
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
        this.editedProject.uploadedImage = e.target.result;
        this.onImageUrlChange();
        console.log('📁 Image uploaded successfully:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2) + 'MB');
      };
      reader.readAsDataURL(file);
    }
  }

  removeUploadedImage() {
    this.editedProject.uploadedImage = ''; // Use empty string instead of null
    this.selectedFileName = '';
    this.onImageUrlChange();
    console.log('🗑️ Removed uploaded image, now using imageUrl only');
  }


}
