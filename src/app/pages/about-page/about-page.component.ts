import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AssetPathService } from '../../services/asset-path.service';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss']
})
export class AboutPageComponent {
  showCvModal = false;

  constructor(
    private router: Router,
    private assetPathService: AssetPathService
  ) { }

  openCvModal(): void {
    this.showCvModal = true;
    this.preventScroll();

    // Test CV accessibility when modal opens
    this.testCvAccess();
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

  // Test method to verify CV file accessibility
  testCvAccess(): void {
    const cvUrl = this.assetPathService.getAssetPath('assets/cv/karoline-rocha-cv.pdf');

    fetch(cvUrl, { method: 'HEAD' })
      .then(response => {
        console.log('CV file status:', response.status);
        console.log('CV file type:', response.headers.get('content-type'));
        console.log('CV file size:', response.headers.get('content-length'));

        if (response.ok) {
          console.log('✅ CV file is accessible');
        } else {
          console.log('❌ CV file is not accessible');
        }
      })
      .catch(error => {
        console.error('❌ Error checking CV file:', error);
      });
  }

  downloadCv(): void {
    const cvUrl = this.assetPathService.getAssetPath('assets/cv/karoline-rocha-cv.pdf');
    const fileName = 'Karoline-Rocha-CV.pdf';

    // Method 1: Try fetch and blob download (most reliable)
    fetch(cvUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Check if the response is actually a PDF
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/pdf')) {
          throw new Error('Invalid file type');
        }

        return response.blob();
      })
      .then(blob => {
        // Verify it's a PDF blob
        if (blob.type !== 'application/pdf') {
          throw new Error('Invalid blob type');
        }

        // Create blob URL
        const blobUrl = window.URL.createObjectURL(blob);

        // Create download link
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        link.style.display = 'none';

        // Trigger download
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);

        // Close modal
        this.showCvModal = false;
        this.enableScroll();

        console.log('CV download completed successfully');
      })
      .catch(error => {
        console.error('Fetch download failed:', error);

        // Method 2: Fallback to direct link with proper attributes
        const link = document.createElement('a');
        link.href = cvUrl;
        link.download = fileName;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.style.display = 'none';
        link.setAttribute('type', 'application/pdf');

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Close modal
        this.showCvModal = false;
        this.enableScroll();

        console.log('CV download initiated (fallback method)');
      })
      .catch(error => {
        console.error('Direct link download failed:', error);

        // Method 3: Final fallback - open in new tab
        try {
          const newWindow = window.open(cvUrl, '_blank', 'noopener,noreferrer');
          if (newWindow) {
            this.showCvModal = false;
            this.enableScroll();
            console.log('CV opened in new tab (final fallback)');
          } else {
            throw new Error('Popup blocked');
          }
        } catch (fallbackError) {
          console.error('All download methods failed:', fallbackError);

          // Method 4: Last resort - show user instructions
          this.showCvModal = false;
          this.enableScroll();
          alert('Download blocked by browser. Please right-click the link and select "Save as" or contact me directly for the CV.');
        }
      });
  }
}
