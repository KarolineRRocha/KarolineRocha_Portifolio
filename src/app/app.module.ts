import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { TechnologiesComponent } from './components/technologies/technologies.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { FooterComponent } from './components/footer/footer.component';
import { LatestProjectsComponent } from './components/latest-projects/latest-projects.component';
import { ScrollTopComponent } from './components/scroll-top/scroll-top.component';
import { LoadingPageComponent } from './pages/loading-page/loading-page.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { ContactPageComponent } from './pages/contact-page/contact-page.component';
import { ProjectPageComponent } from './pages/project-page/project-page.component';
import { TopnavComponent } from './components/topnav/topnav.component';
import { UploadProjectComponent } from './pages/project-page/details-project/upload-project/upload-project.component';
import { TheyDevelopAndCookProjectComponent } from './pages/project-page/details-project/they-develop-and-cook-project/they-develop-and-cook-project.component';
import { TechnologiesPageComponent } from './technologies-page/technologies-page.component';

@NgModule({
  declarations: [
    AppComponent,
    TopnavComponent,
    HeaderComponent,
    TechnologiesComponent,
    HomePageComponent,
    FooterComponent,
    LatestProjectsComponent,
    ScrollTopComponent,
    LoadingPageComponent,
    AboutPageComponent,
    ContactPageComponent,
    ProjectPageComponent,
    UploadProjectComponent,
    TheyDevelopAndCookProjectComponent,
    TechnologiesPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
