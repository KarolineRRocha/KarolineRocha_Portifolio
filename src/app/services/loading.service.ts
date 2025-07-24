import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  private loadingMessagesSubject = new BehaviorSubject<string>('');
  public loadingMessage$ = this.loadingMessagesSubject.asObservable();

  show(message: string = 'Loading...'): void {
    this.loadingMessagesSubject.next(message);
    this.isLoadingSubject.next(true);
  }

  hide(): void {
    this.isLoadingSubject.next(false);
    this.loadingMessagesSubject.next('');
  }

  getIsLoading(): boolean {
    return this.isLoadingSubject.value;
  }

  getLoadingMessage(): string {
    return this.loadingMessagesSubject.value;
  }
}
