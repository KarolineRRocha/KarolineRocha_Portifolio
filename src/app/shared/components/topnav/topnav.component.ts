import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.scss']
})
export class TopnavComponent {

  constructor(private router: Router) { }

  goToHome(): void {
    this.router.navigate(['/home']).then(() => {
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
