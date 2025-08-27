import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TechnologiesComponent } from './components/technologies/technologies.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LatestProjectsComponent } from './components/latest-projects/latest-projects.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { ContactPageComponent } from './pages/contact-page/contact-page.component';
import { TechnologiesPageComponent } from './pages/technologies-page/technologies-page.component';
import { GlobalNotificationsComponent } from './shared/components/global-notifications/global-notifications.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';

// Shared Module
import { SharedModule } from './shared/shared.module';

// Core Module
import { CoreModule } from './core/core.module';

// Feature Modules
import { ProjectModule } from './pages/project-page/project.module';

@NgModule({
  declarations: [
    AppComponent,
    TechnologiesComponent,
    HomePageComponent,
    LatestProjectsComponent,
    AboutPageComponent,
    ContactPageComponent,
    TechnologiesPageComponent,
    GlobalNotificationsComponent,
    AdminLoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    ProjectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
