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
          contactForm.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
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
