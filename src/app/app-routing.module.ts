import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { TechnologiesPageComponent } from './technologies-page/technologies-page.component';
import { ProjectPageComponent } from './pages/project-page/project-page.component'; 
import { ContactPageComponent } from './pages/contact-page/contact-page.component';
import { UploadProjectComponent } from './pages/project-page/details-project/upload-project/upload-project.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'home', component: HomePageComponent },
  { path: 'about', component: AboutPageComponent },
  { path: 'technologies', component: TechnologiesPageComponent },
  { path: 'projects', component: ProjectPageComponent },
  { path: 'contact', component: ContactPageComponent },
  { path: 'upload-project', component: UploadProjectComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
