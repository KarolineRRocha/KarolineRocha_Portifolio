import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminCredentials {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly ADMIN_KEY = 'portfolio_admin_authenticated';
  private readonly CREDENTIALS_KEY = 'portfolio_admin_credentials';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.checkAuthenticationStatus();
  }

  checkAuthenticationStatus(): boolean {
    const isAuth = localStorage.getItem(this.ADMIN_KEY) === 'true';
    this.isAuthenticatedSubject.next(isAuth);
    return isAuth;
  }

  // Login with credentials
  login(credentials: AdminCredentials): boolean {
    // Get credentials from environment
    const validCredentials = this.getValidCredentials();

    if (credentials.username === validCredentials.username &&
      credentials.password === validCredentials.password) {

      // Store authentication status
      localStorage.setItem(this.ADMIN_KEY, 'true');
      localStorage.setItem(this.CREDENTIALS_KEY, JSON.stringify(credentials));

      // Update authentication state
      this.isAuthenticatedSubject.next(true);

      // Scroll to top after successful login
      this.scrollToTop();

      return true;
    }

    return false;
  }

  logout(): void {
    localStorage.removeItem(this.ADMIN_KEY);
    localStorage.removeItem(this.CREDENTIALS_KEY);
    this.isAuthenticatedSubject.next(false);

    // Scroll to top after logout
    this.scrollToTop();
  }

  isAuthenticated(): boolean {
    return this.checkAuthenticationStatus();
  }

  // Get stored credentials (for display purposes)
  getStoredCredentials(): AdminCredentials | null {
    const stored = localStorage.getItem(this.CREDENTIALS_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  // Change admin password
  changePassword(newPassword: string): boolean {
    const currentCredentials = this.getStoredCredentials();
    if (!currentCredentials) return false;

    const newCredentials = {
      username: currentCredentials.username,
      password: newPassword
    };

    localStorage.setItem(this.CREDENTIALS_KEY, JSON.stringify(newCredentials));
    return true;
  }

  // Reset to default credentials
  resetToDefault(): void {
    const defaultCredentials = this.getValidCredentials();
    localStorage.setItem(this.CREDENTIALS_KEY, JSON.stringify(defaultCredentials));
  }

  getAuthStatus(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // Private method to scroll to top of the page
  private scrollToTop(): void {
    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  // Private method to get valid credentials from environment
  private getValidCredentials(): AdminCredentials {
    return {
      username: environment.admin.defaultUsername,
      password: environment.admin.defaultPassword
    };
  }
}
