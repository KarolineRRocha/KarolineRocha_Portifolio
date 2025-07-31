import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AdminCommunicationService } from '../../../core/services/admin-communication.service';
import { NotificationService } from '../../../services/notification.service';
import { GitHubSyncService } from '../../../core/services/github-sync.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  isAdmin = false;
  private authSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private adminCommunicationService: AdminCommunicationService,
    private notificationService: NotificationService,
    private githubSyncService: GitHubSyncService,
    private router: Router
  ) {
    this.isAdmin = this.authService.isAuthenticated();
  }

  ngOnInit(): void {
    // Subscribe to auth state changes
    this.authSubscription = this.authService.authState$.subscribe(
      (isAuthenticated: boolean) => {
        console.log('🔐 Footer: Auth state changed to:', isAuthenticated);
        this.isAdmin = isAuthenticated;
      }
    );

    // Initial check
    this.isAdmin = this.authService.isAuthenticated();
    console.log('🔐 Footer: Initial auth state:', this.isAdmin);
  }

  ngOnDestroy(): void {
    // Cleanup subscription
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  showAdminLogin(): void {
    if (this.isAdmin) {
      // If already logged in, show logout confirmation
      if (confirm('Do you want to logout?')) {
        this.performLogout();
      }
    } else {
      // If not logged in, show login modal
      this.adminCommunicationService.requestAdminLogin();
    }
  }

  private performLogout(): void {
    console.log('🔐 Footer logout initiated');

    // Call auth service logout (this will automatically update isAdmin via subscription)
    this.authService.logout();
    console.log('🔐 Auth service logout completed');

    // Stop auto sync
    this.githubSyncService.stopAutoSync();
    console.log('🔐 Auto sync stopped');

    // Show success message
    this.notificationService.success('Logged out successfully!');
    console.log('🔐 Logout completed successfully');

    // Scroll to top for better UX
    this.scrollToTop();
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
