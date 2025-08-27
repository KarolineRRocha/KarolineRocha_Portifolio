import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthService } from './core/services/auth.service';
import { AdminCommunicationService } from './core/services/admin-communication.service';
import { GitHubSyncService } from './core/services/github-sync.service';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'webPortifolio';
  showLoginModal = false;
  private adminLoginSubscription!: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    private adminCommunicationService: AdminCommunicationService,
    private githubSyncService: GitHubSyncService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    // Scroll to top on page refresh
    this.scrollToTop();

    // Scroll to top on navigation
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => {
          this.scrollToTop();
        }, 100);
      });

    // Listen for admin login requests from footer
    this.adminLoginSubscription = this.adminCommunicationService.adminLoginRequested$.subscribe(() => {
      this.showLoginModal = true;
    });
  }

  ngOnDestroy(): void {
    if (this.adminLoginSubscription) {
      this.adminLoginSubscription.unsubscribe();
    }
  }

  onLoginSuccess(): void {
    this.showLoginModal = false;
    this.notificationService.success('Login successful! Welcome back!');
  }

  onLoginCancel(): void {
    this.showLoginModal = false;
  }

  // Listen for page load/refresh events
  @HostListener('window:load')
  onPageLoad() {
    this.scrollToTop();
  }

  // Listen for beforeunload events (page refresh)
  @HostListener('window:beforeunload')
  onBeforeUnload() {
    // Store a flag to indicate refresh
    sessionStorage.setItem('pageRefreshed', 'true');
  }

  // Check if page was refreshed and scroll to top
  @HostListener('window:pageshow')
  onPageShow() {
    if (sessionStorage.getItem('pageRefreshed') === 'true') {
      sessionStorage.removeItem('pageRefreshed');
      setTimeout(() => {
        this.scrollToTop();
      }, 50);
    }
  }

  private scrollToTop(): void {
    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
}
