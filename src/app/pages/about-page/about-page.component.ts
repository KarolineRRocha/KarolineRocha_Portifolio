import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss']
})
export class AboutPageComponent {
  showCvModal = false;

  constructor(private router: Router) { }

  openCvModal(): void {
    this.showCvModal = true;
    this.preventScroll();
  }

  closeCvModal(event: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.showCvModal = false;
    this.enableScroll();
  }

  // Handle quick link clicks and scroll to top
  onQuickLinkClick(): void {
    // Scroll to top after navigation
    setTimeout(() => {
      this.scrollToTop();
    }, 100);
  }

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

  private preventScroll(): void {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
  }

  private enableScroll(): void {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
  }

  // Private method to scroll to top of the page
  private scrollToTop(): void {
    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  downloadCv(): void {
    try {
      // TODO: Replace with actual CV file path when provided
      const cvUrl = 'assets/cv/karoline-rocha-cv.pdf'; // Update this path when you provide the CV

      // Method 1: Try direct download first
      const link = document.createElement('a');
      link.href = cvUrl;
      link.download = 'Karoline-Rocha-CV.pdf';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Close the modal after download attempt
      this.showCvModal = false;
      this.enableScroll();

      console.log('CV download initiated');

    } catch (error) {
      console.error('Error downloading CV:', error);

      // Fallback: Open in new tab if download fails
      try {
        window.open('assets/cv/karoline-rocha-cv.pdf', '_blank');
        this.showCvModal = false;
        this.enableScroll();
      } catch (fallbackError) {
        console.error('Fallback download also failed:', fallbackError);
        alert('Unable to download CV. Please check if the file exists.');
      }
    }
  }
}
