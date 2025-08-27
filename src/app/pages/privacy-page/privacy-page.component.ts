import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy-page',
  templateUrl: './privacy-page.component.html',
  styleUrls: ['./privacy-page.component.scss']
})
export class PrivacyPageComponent {
  constructor(private router: Router) { }

  // Navigate to contact page and scroll to contact form
  navigateToContactForm(): void {
    // Navigate to contact page
    this.router.navigate(['/contact']).then(() => {
      // Wait for the page to load, then scroll to the contact form
      setTimeout(() => {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
          contactForm.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 300); // Give the page time to render
    });
  }
}
