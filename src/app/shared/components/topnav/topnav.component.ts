import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.scss']
})
export class TopnavComponent implements OnInit {
  activeRoute: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Subscribe to router events to detect current route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.activeRoute = event.url;
    });

    // Set initial active route
    this.activeRoute = this.router.url;
  }

  isActiveRoute(route: string): boolean {
    if (route === 'home') {
      return this.activeRoute === '/';
    }
    return this.activeRoute === `/${route}`;
  }

  hasActiveRoute(): boolean {
    return this.activeRoute !== '/';
  }

  goToHome(): void {
    this.router.navigate(['/']).then(() => {
      // Scroll to top after navigation
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    this.closeMobileMenu();
  }

  closeMobileMenu(): void {
    const navCheck = document.getElementById('nav-check') as HTMLInputElement;
    if (navCheck) {
      navCheck.checked = false;
    }
  }
}
