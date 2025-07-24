import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ProjectPageComponent } from './project-page.component';
import { AdminLoginComponent } from '../../components/admin-login/admin-login.component';
import { EditProjectModalComponent } from '../../components/edit-project-modal/edit-project-modal.component';
import { AddProjectModalComponent } from '../../components/add-project-modal/add-project-modal.component';

// Shared Module
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    ProjectPageComponent,
    AdminLoginComponent,
    EditProjectModalComponent,
    AddProjectModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    SharedModule
  ],
  exports: [
    ProjectPageComponent,
    AdminLoginComponent,
    EditProjectModalComponent,
    AddProjectModalComponent
  ]
})
export class ProjectModule { }
