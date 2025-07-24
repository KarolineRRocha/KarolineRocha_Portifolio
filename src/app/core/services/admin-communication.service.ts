import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminCommunicationService {
  private adminLoginRequested = new Subject<void>();
  public adminLoginRequested$ = this.adminLoginRequested.asObservable();

  requestAdminLogin(): void {
    this.adminLoginRequested.next();
  }
}
