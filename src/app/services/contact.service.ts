import { Injectable } from '@angular/core';
import { ContactForm, EmailData } from '../models/contact.interface';
import { EmailService } from './email.service';
import { ErrorHandlerService } from './error-handler.service';
import { LoadingService } from './loading.service';
import { NotificationService } from './notification.service';
import { APP_CONSTANTS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  constructor(
    private emailService: EmailService,
    private errorHandler: ErrorHandlerService,
    private loadingService: LoadingService,
    private notificationService: NotificationService
  ) { }

  async submitContactForm(contactForm: ContactForm): Promise<boolean> {
    this.loadingService.show(APP_CONSTANTS.UI.LOADING_MESSAGES.SENDING_EMAIL);

    try {
      const emailData: EmailData = {
        from_name: contactForm.from_name,
        to_name: contactForm.to_name,
        from_email: contactForm.from_email,
        message: contactForm.message
      };

      const response = await this.emailService.sendEmail(emailData);

      if (response.success) {
        this.notificationService.success(SUCCESS_MESSAGES.CONTACT.MESSAGE_SENT);
        this.errorHandler.handleWarning('Contact form submitted successfully', 'ContactService');
        return true;
      } else {
        // Use the specific error message from the email service
        this.notificationService.error(response.message);
        this.errorHandler.handleError(new Error(response.message), 'ContactService');
        return false;
      }
    } catch (error) {
      this.errorHandler.handleError(error, 'ContactService.submitContactForm');
      this.notificationService.error(ERROR_MESSAGES.CONTACT.UNEXPECTED_ERROR);
      return false;
    } finally {
      this.loadingService.hide();
    }
  }

  validateContactForm(form: ContactForm): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!form.from_name?.trim()) {
      errors.push(ERROR_MESSAGES.CONTACT.NAME_REQUIRED);
    }

    if (!form.from_email?.trim()) {
      errors.push(ERROR_MESSAGES.CONTACT.EMAIL_REQUIRED);
    } else if (!this.isValidEmail(form.from_email)) {
      errors.push(ERROR_MESSAGES.CONTACT.EMAIL_INVALID);
    }

    if (!form.message?.trim()) {
      errors.push(ERROR_MESSAGES.CONTACT.MESSAGE_REQUIRED);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
}
