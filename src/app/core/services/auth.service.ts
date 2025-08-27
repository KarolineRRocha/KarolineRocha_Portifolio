import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_KEY = 'portfolio_admin_authenticated';
  private authStateSubject = new BehaviorSubject<boolean>(false);
  public authState$ = this.authStateSubject.asObservable();

  constructor() {
    // Initialize auth state on service creation
    this.authStateSubject.next(this.isAuthenticated());
  }

  login(username: string, password: string): { success: boolean; message?: string } {
    console.log('🔐 AuthService.login called with:', { username, password: '***' });
    
    // Simple admin authentication
    if (username === 'emaildakarolineribeiro@gmail.com' && password === '!Kzd.0342!') {
      const authData = {
        isAuthenticated: true,
        username: 'admin',
        lastLogin: new Date()
      };
      localStorage.setItem(this.AUTH_KEY, JSON.stringify(authData));

      // Emit auth state change
      this.authStateSubject.next(true);
      console.log('🔐 AuthService: Login successful, auth state updated to true');

      console.log('🔐 AuthService.login: Authentication successful');
      return { success: true };
    }
    console.log('🔐 AuthService.login: Authentication failed');
    return {
      success: false,
      message: 'You do not have permissions to access this area.'
    };
  }

  logout(): void {
    console.log('🔐 AuthService logout called');
    console.log('🔐 Removing auth key from localStorage:', this.AUTH_KEY);

    localStorage.removeItem(this.AUTH_KEY);

    // Verify removal
    const remainingAuth = localStorage.getItem(this.AUTH_KEY);
    console.log('🔐 Auth data after removal:', remainingAuth);

    // Emit auth state change
    this.authStateSubject.next(false);
    console.log('🔐 AuthService: Logout completed, auth state updated to false');
  }

  isAuthenticated(): boolean {
    const authData = localStorage.getItem(this.AUTH_KEY);
    console.log('🔐 AuthService isAuthenticated called');
    console.log('🔐 Auth data from localStorage:', authData);

    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        const isAuth = parsed.isAuthenticated === true;
        console.log('🔐 Parsed auth data:', parsed);
        console.log('🔐 Is authenticated:', isAuth);
        return isAuth;
      } catch (error) {
        console.error('🔐 Error parsing auth data:', error);
        return false;
      }
    }
    console.log('🔐 No auth data found, returning false');
    return false;
  }

  getCurrentUser(): any {
    const authData = localStorage.getItem(this.AUTH_KEY);
    if (authData) {
      try {
        return JSON.parse(authData);
      } catch (error) {
        return null;
      }
    }
    return null;
  }
}
