import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit, OnDestroy {
  @Output() loginSuccess = new EventEmitter<void>();
  @Output() loginCancel = new EventEmitter<void>();

  credentials = {
    username: '',
    password: ''
  };

  showPassword = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.preventScroll();
  }

  ngOnDestroy(): void {
    this.enableScroll();
  }

  private preventScroll(): void {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
  }

  private enableScroll(): void {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
  }

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Use AuthService for authentication
    if (this.authService.login(this.credentials)) {
      setTimeout(() => {
        this.isLoading = false;
        // Close modal immediately after successful login
        this.loginSuccess.emit();
      }, 1000);
    } else {
      setTimeout(() => {
        this.isLoading = false;
        this.errorMessage = 'Invalid credentials. Please try again.';
      }, 1000);
    }
  }

  onCancel() {
    this.enableScroll();
    this.loginCancel.emit();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
