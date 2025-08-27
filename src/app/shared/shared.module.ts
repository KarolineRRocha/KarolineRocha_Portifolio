import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Shared Components
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { TopnavComponent } from './components/topnav/topnav.component';
import { ScrollTopComponent } from './components/scroll-top/scroll-top.component';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    TopnavComponent,
    ScrollTopComponent
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
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    CommonModule
  ]
})
export class SharedModule { }
