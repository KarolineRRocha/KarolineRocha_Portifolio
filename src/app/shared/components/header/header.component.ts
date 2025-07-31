import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  // Typewriter effect for console.log text
  typewriterText = '';
  typewriterPhrases = [
    'Ready to create amazing things!',
    'Let\'s build something incredible!',
    'Code that makes a difference!',
    'Innovation through code!'
  ];
  currentPhraseIndex = 0;
  currentCharIndex = 0;
  isDeleting = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.startTypewriterEffect();
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

  // Typewriter effect
  private startTypewriterEffect(): void {
    setInterval(() => {
      const currentPhrase = this.typewriterPhrases[this.currentPhraseIndex];

      if (!this.isDeleting) {
        this.typewriterText = currentPhrase.substring(0, this.currentCharIndex + 1);
        this.currentCharIndex++;

        if (this.currentCharIndex === currentPhrase.length) {
          setTimeout(() => this.isDeleting = true, 2000);
        }
      } else {
        this.typewriterText = currentPhrase.substring(0, this.currentCharIndex - 1);
        this.currentCharIndex--;

        if (this.currentCharIndex === 0) {
          this.isDeleting = false;
          this.currentPhraseIndex = (this.currentPhraseIndex + 1) % this.typewriterPhrases.length;
        }
      }
    }, 100);
  }
}
