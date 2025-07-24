import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AdminCommunicationService } from '../../../core/services/admin-communication.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  isAdmin = false;

  constructor(
    private authService: AuthService,
    private adminCommunicationService: AdminCommunicationService,
    private router: Router
  ) {
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAdmin = isAuthenticated;
    });
  }

  showAdminLogin(): void {
    if (this.isAdmin) {
      // If already logged in, show logout confirmation
      if (confirm('Do you want to logout?')) {
        this.authService.logout();
        // Additional scroll to top for logout from footer
        this.scrollToTop();
      }
    } else {
      // If not logged in, show login modal
      this.adminCommunicationService.requestAdminLogin();
    }
  }

  // Handle quick link clicks and scroll to top
  onQuickLinkClick(): void {
    // Scroll to top after navigation
    setTimeout(() => {
      this.scrollToTop();
    }, 100);
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
}
