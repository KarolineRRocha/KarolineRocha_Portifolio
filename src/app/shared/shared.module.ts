import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Shared Components
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { TopnavComponent } from './components/topnav/topnav.component';
import { ScrollTopComponent } from './components/scroll-top/scroll-top.component';

// Shared Directives (future)
// import { HighlightDirective } from './directives/highlight.directive';

// Shared Pipes (future)
// import { FilterPipe } from './pipes/filter.pipe';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    TopnavComponent,
    ScrollTopComponent,
    // HighlightDirective,
    // FilterPipe
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
    CommonModule,
    // HighlightDirective,
    // FilterPipe
  ]
})
export class SharedModule { }
