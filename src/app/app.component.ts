import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'webPortifolio';

  constructor(private router: Router) { }

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
