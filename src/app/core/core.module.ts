import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

// Core Services
import { EmailService } from '../services/email.service';
import { ContactService } from '../services/contact.service';
import { ErrorHandlerService } from '../services/error-handler.service';
import { LoadingService } from '../services/loading.service';
import { NotificationService } from '../services/notification.service';

// Additional Core Services
import { GitHubService } from './services/github.service';
import { ProjectsService } from './services/projects.service';
import { AuthService } from './services/auth.service';
import { AdminCommunicationService } from './services/admin-communication.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    EmailService,
    ContactService,
    ErrorHandlerService,
    LoadingService,
    NotificationService,
    GitHubService,
    ProjectsService,
    AuthService,
    AdminCommunicationService
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only.');
    }
  }
}
