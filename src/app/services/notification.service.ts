import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  timestamp: Date;
  action?: {
    label: string;
    callback: () => void;
  };
}

export interface ConfirmationDialog {
  id: string;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: 'warning' | 'danger' | 'info';
  onConfirm: () => void;
  onCancel?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private confirmationSubject = new BehaviorSubject<ConfirmationDialog | null>(null);
  public confirmation$ = this.confirmationSubject.asObservable();

  success(message: string, duration: number = 5000): void {
    this.addNotification(message, 'success', duration);
  }

  error(message: string, duration: number = 8000): void {
    this.addNotification(message, 'error', duration);
  }

  warning(message: string, duration: number = 6000): void {
    this.addNotification(message, 'warning', duration);
  }

  info(message: string, duration: number = 4000): void {
    this.addNotification(message, 'info', duration);
  }

  // Show confirmation dialog
  confirm(
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    confirmLabel: string = 'Confirm',
    cancelLabel: string = 'Cancel',
    type: 'warning' | 'danger' | 'info' = 'warning'
  ): void {
    const dialog: ConfirmationDialog = {
      id: this.generateId(),
      title,
      message,
      confirmLabel,
      cancelLabel,
      type,
      onConfirm,
      onCancel
    };

    this.confirmationSubject.next(dialog);
  }

  // Confirm deletion
  confirmDelete(
    itemName: string,
    onConfirm: () => void,
    onCancel?: () => void
  ): void {
    this.confirm(
      'Confirm Deletion',
      `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
      onConfirm,
      onCancel,
      'Delete',
      'Cancel',
      'danger'
    );
  }

  // Dismiss confirmation dialog
  dismissConfirmation(): void {
    this.confirmationSubject.next(null);
  }

  private addNotification(message: string, type: Notification['type'], duration: number): void {
    const notification: Notification = {
      id: this.generateId(),
      message,
      type,
      duration,
      timestamp: new Date()
    };

    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);

    // Auto-remove notification after duration
    if (duration > 0) {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, duration);
    }
  }

  removeNotification(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const filteredNotifications = currentNotifications.filter(n => n.id !== id);
    this.notificationsSubject.next(filteredNotifications);
  }

  clearAll(): void {
    this.notificationsSubject.next([]);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
