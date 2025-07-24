import { Injectable } from '@angular/core';

export interface ErrorInfo {
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private errors: ErrorInfo[] = [];

  handleError(error: any, context?: string): void {
    const errorInfo: ErrorInfo = {
      message: this.formatErrorMessage(error, context),
      type: 'error',
      timestamp: new Date()
    };

    this.errors.push(errorInfo);
    console.error('Error occurred:', errorInfo);

    // In a real application, you might want to send this to a logging service
    // this.logToExternalService(errorInfo);
  }

  handleWarning(message: string, context?: string): void {
    const warningInfo: ErrorInfo = {
      message: context ? `${context}: ${message}` : message,
      type: 'warning',
      timestamp: new Date()
    };

    this.errors.push(warningInfo);
    console.warn('Warning:', warningInfo);
  }

  getErrors(): ErrorInfo[] {
    return [...this.errors];
  }

  clearErrors(): void {
    this.errors = [];
  }

  private formatErrorMessage(error: any, context?: string): string {
    let message = 'An error occurred';

    if (typeof error === 'string') {
      message = error;
    } else if (error?.message) {
      message = error.message;
    } else if (error?.error?.message) {
      message = error.error.message;
    }

    return context ? `${context}: ${message}` : message;
  }

  // Method to send errors to external logging service (for future implementation)
  private logToExternalService(errorInfo: ErrorInfo): void {
    // Implementation for external logging service
    // Example: Sentry, LogRocket, etc.
  }
}
