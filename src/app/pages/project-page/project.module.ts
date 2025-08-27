import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { ProjectPageComponent } from './project-page.component';

import { EditProjectModalComponent } from '../../components/edit-project-modal/edit-project-modal.component';
import { AddProjectModalComponent } from '../../components/add-project-modal/add-project-modal.component';

// Shared Module
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    ProjectPageComponent,
    EditProjectModalComponent,
    AddProjectModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    DragDropModule
  ],
  exports: [
    ProjectPageComponent,
    EditProjectModalComponent,
    AddProjectModalComponent
  ]
})
export class ProjectModule { }
