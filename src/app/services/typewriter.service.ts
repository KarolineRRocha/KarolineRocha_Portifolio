import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface TypewriterConfig {
  phrases: string[];
  speed?: number;
  pauseTime?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TypewriterService {
  private typewriterTextSubject = new BehaviorSubject<string>('');
  public typewriterText$ = this.typewriterTextSubject.asObservable();

  private currentPhraseIndex = 0;
  private currentCharIndex = 0;
  private isDeleting = false;
  private intervalId: any;
  private config!: TypewriterConfig;

  constructor() { }

  startTypewriter(config: TypewriterConfig): void {
    this.config = {
      speed: 100,
      pauseTime: 2000,
      ...config
    };

    this.currentPhraseIndex = 0;
    this.currentCharIndex = 0;
    this.isDeleting = false;

    this.intervalId = setInterval(() => {
      const currentPhrase = this.config.phrases[this.currentPhraseIndex];

      if (!this.isDeleting) {
        this.typewriterTextSubject.next(currentPhrase.substring(0, this.currentCharIndex + 1));
        this.currentCharIndex++;

        if (this.currentCharIndex === currentPhrase.length) {
          setTimeout(() => this.isDeleting = true, this.config.pauseTime);
        }
      } else {
        this.typewriterTextSubject.next(currentPhrase.substring(0, this.currentCharIndex - 1));
        this.currentCharIndex--;

        if (this.currentCharIndex === 0) {
          this.isDeleting = false;
          this.currentPhraseIndex = (this.currentPhraseIndex + 1) % this.config.phrases.length;
        }
      }
    }, this.config.speed);
  }

  stopTypewriter(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getCurrentText(): string {
    return this.typewriterTextSubject.value;
  }
}
