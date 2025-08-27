import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { TechnologiesPageComponent } from './pages/technologies-page/technologies-page.component';
import { ProjectPageComponent } from './pages/project-page/project-page.component';
import { ContactPageComponent } from './pages/contact-page/contact-page.component';
import { PrivacyPageComponent } from './pages/privacy-page/privacy-page.component';
import { TermsPageComponent } from './pages/terms-page/terms-page.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'home', component: HomePageComponent },
  { path: 'about', component: AboutPageComponent },
  { path: 'technologies', component: TechnologiesPageComponent },
  { path: 'projects', component: ProjectPageComponent },
  { path: 'contact', component: ContactPageComponent },
  { path: 'privacy', component: PrivacyPageComponent },
  { path: 'terms', component: TermsPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
