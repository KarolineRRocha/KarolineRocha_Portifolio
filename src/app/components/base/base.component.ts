import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoadingService } from '../../services/loading.service';
import { NotificationService } from '../../services/notification.service';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  template: ''
})
export abstract class BaseComponent implements OnDestroy {
  protected destroy$ = new Subject<void>();
  public isLoading = false;
  public loadingMessage = '';

  constructor(
    protected loadingService: LoadingService,
    protected notificationService: NotificationService,
    protected errorHandler: ErrorHandlerService
  ) {
    this.initializeSubscriptions();
  }

  private initializeSubscriptions(): void {
    this.loadingService.isLoading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isLoading => {
        this.isLoading = isLoading;
      });

    this.loadingService.loadingMessage$
      .pipe(takeUntil(this.destroy$))
      .subscribe(message => {
        this.loadingMessage = message;
      });
  }

  protected showLoading(message: string = 'Loading...'): void {
    this.loadingService.show(message);
  }

  protected hideLoading(): void {
    this.loadingService.hide();
  }

  protected showSuccess(message: string): void {
    this.notificationService.success(message);
  }

  protected showError(message: string): void {
    this.notificationService.error(message);
  }

  protected showWarning(message: string): void {
    this.notificationService.warning(message);
  }

  protected showInfo(message: string): void {
    this.notificationService.info(message);
  }

  protected handleError(error: any, context?: string): void {
    this.errorHandler.handleError(error, context);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
