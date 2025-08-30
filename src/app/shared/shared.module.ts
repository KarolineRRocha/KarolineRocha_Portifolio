import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Shared Components
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { TopnavComponent } from './components/topnav/topnav.component';
import { ScrollTopComponent } from './components/scroll-top/scroll-top.component';
import { EnvironmentIndicatorComponent } from './components/environment-indicator/environment-indicator.component';

// Shared Pipes
import { AssetPathPipe } from './pipes/asset-path.pipe';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    TopnavComponent,
    ScrollTopComponent,
    EnvironmentIndicatorComponent,
    AssetPathPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    TopnavComponent,
    ScrollTopComponent,
    EnvironmentIndicatorComponent,
    AssetPathPipe,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    CommonModule
  ]
})
export class SharedModule { }
