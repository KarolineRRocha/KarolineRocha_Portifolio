import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TypewriterService } from '../../../services/typewriter.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  typewriterText = '';
  private typewriterSubscription!: Subscription;

  constructor(
    private router: Router,
    private typewriterService: TypewriterService
  ) { }

  ngOnInit(): void {
    this.typewriterService.startTypewriter({
      phrases: [
        'Ready to create amazing things!',
        'Let\'s build something incredible!',
        'Code that makes a difference!',
        'Innovation through code!'
      ]
    });

    this.typewriterSubscription = this.typewriterService.typewriterText$.subscribe(
      text => this.typewriterText = text
    );
  }

    // Navigate to contact page and scroll to contact form
  navigateToContactForm(): void {
    // Navigate to contact page
    this.router.navigate(['/contact']).then(() => {
      // Wait for the page to load, then scroll to the contact form
      setTimeout(() => {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
          // Check device size and set appropriate header offset
          const width = window.innerWidth;
          let headerOffset = 0;
          
          if (width <= 768) {
            // Mobile: 3.75rem = 60px
            headerOffset = 60;
          } else if (width <= 900) {
            // Tablet Portrait: 4rem = 64px
            headerOffset = 64;
          } else if (width <= 1024) {
            // Tablet Landscape: 4.5rem = 72px
            headerOffset = 72;
          }
          
          const elementPosition = contactForm.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    });
  }

  ngOnDestroy(): void {
    if (this.typewriterSubscription) {
      this.typewriterSubscription.unsubscribe();
    }
    this.typewriterService.stopTypewriter();
  }
}
