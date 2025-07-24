import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-scroll-top',
  templateUrl: './scroll-top.component.html',
  styleUrls: ['./scroll-top.component.scss']
})
export class ScrollTopComponent {
  isVisible = false;
  private readonly scrollThreshold = 300;

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isVisible = window.pageYOffset > this.scrollThreshold;
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
