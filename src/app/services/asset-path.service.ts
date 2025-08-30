import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AssetPathService {

  private isLocalhost: boolean = false;
  private isGitHubPages: boolean = false;
  private basePath: string = '';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.detectEnvironment();
    }
  }

  private detectEnvironment(): void {
    const hostname = window.location.hostname;
    this.isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    this.isGitHubPages = hostname === 'karolinerrocha.github.io';
    this.basePath = this.isGitHubPages ? '/KarolineRocha_Portfolio' : '';
  }

  /**
   * Get the correct asset path for the current environment
   * @param path - The asset path (e.g., 'assets/image.png')
   * @returns The environment-appropriate asset path
   */
  getAssetPath(path: string): string {
    if (!isPlatformBrowser(this.platformId)) {
      return path; // Return as-is for server-side rendering
    }

    // Remove leading slash if present
    if (path.startsWith('/')) {
      path = path.substring(1);
    }

    // For localhost, return relative path
    if (this.isLocalhost) {
      return path;
    }

    // For GitHub Pages, return absolute path
    return `${this.basePath}/${path}`;
  }

  /**
   * Get the correct image path for the current environment
   * @param imagePath - The image path (e.g., 'assets/KLogo.svg')
   * @returns The environment-appropriate image path
   */
  getImagePath(imagePath: string): string {
    return this.getAssetPath(imagePath);
  }

  /**
   * Get the correct favicon path for the current environment
   * @param faviconPath - The favicon path
   * @returns The environment-appropriate favicon path
   */
  getFaviconPath(faviconPath: string): string {
    return this.getAssetPath(faviconPath);
  }

  /**
   * Check if running on localhost
   */
  isLocalEnvironment(): boolean {
    return this.isLocalhost;
  }

  /**
   * Check if running on GitHub Pages
   */
  isProductionEnvironment(): boolean {
    return this.isGitHubPages;
  }

  /**
   * Get the base path for the current environment
   */
  getBasePath(): string {
    return this.basePath;
  }
}
