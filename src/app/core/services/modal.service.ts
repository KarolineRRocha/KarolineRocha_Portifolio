import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalCount = 0;

  preventScroll(): void {
    this.modalCount++;
    if (this.modalCount === 1) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    }
  }

  enableScroll(): void {
    this.modalCount = Math.max(0, this.modalCount - 1);
    if (this.modalCount === 0) {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  }

  forceEnableScroll(): void {
    this.modalCount = 0;
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
  }
}
