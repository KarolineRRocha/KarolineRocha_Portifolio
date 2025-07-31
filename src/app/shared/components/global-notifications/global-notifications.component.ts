import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NotificationService, Notification, ConfirmationDialog } from '../../../services/notification.service';

@Component({
  selector: 'app-global-notifications',
  templateUrl: './global-notifications.component.html',
  styleUrls: ['./global-notifications.component.scss'],
  animations: [
    trigger('notificationAnimation', [
      state('void', style({
        opacity: 0,
        transform: 'translateX(-100%)'
      })),
      state('*', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('void => *', [
        animate('300ms ease-out')
      ]),
      transition('* => void', [
        animate('200ms ease-in')
      ])
    ]),
    trigger('confirmationAnimation', [
      state('void', style({
        opacity: 0,
        transform: 'scale(0.8)'
      })),
      state('*', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      transition('void => *', [
        animate('200ms ease-out')
      ]),
      transition('* => void', [
        animate('150ms ease-in')
      ])
    ])
  ]
})
export class GlobalNotificationsComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  confirmationDialog: ConfirmationDialog | null = null;
  private destroy$ = new Subject<void>();

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    // Subscribe to notifications
    this.notificationService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notifications => {
        this.notifications = notifications;
      });

    // Subscribe to confirmation dialogs
    this.notificationService.confirmation$
      .pipe(takeUntil(this.destroy$))
      .subscribe(dialog => {
        this.confirmationDialog = dialog;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  removeNotification(id: string): void {
    this.notificationService.removeNotification(id);
  }

  onConfirm(): void {
    if (this.confirmationDialog) {
      this.confirmationDialog.onConfirm();
      this.notificationService.dismissConfirmation();
    }
  }

  onCancel(): void {
    if (this.confirmationDialog) {
      if (this.confirmationDialog.onCancel) {
        this.confirmationDialog.onCancel();
      }
      this.notificationService.dismissConfirmation();
    }
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  }

  getConfirmationIcon(type: string | undefined): string {
    switch (type) {
      case 'danger': return '🗑️';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '❓';
    }
  }
}
