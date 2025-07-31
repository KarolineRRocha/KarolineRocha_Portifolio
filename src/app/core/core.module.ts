import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { ProjectsService } from './services/projects.service';
import { AuthService } from './services/auth.service';
import { FirebaseStorageService } from './services/firebase-storage.service';
import { GitHubSyncService } from './services/github-sync.service';
import { GitHubApiInterceptor } from './interceptors/github-api.interceptor';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    ProjectsService,
    AuthService,
    FirebaseStorageService,
    GitHubSyncService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GitHubApiInterceptor,
      multi: true
    }
  ]
})
export class CoreModule { }
