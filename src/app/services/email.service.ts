import { Injectable } from '@angular/core';
import { EmailData, EmailResponse } from '../models/contact.interface';
import { APP_CONSTANTS } from '../constants/app.constants';
import emailjs from '@emailjs/browser';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private readonly EMAILJS_USER_ID = APP_CONSTANTS.EMAIL.USER_ID;
  private readonly EMAILJS_SERVICE_ID = APP_CONSTANTS.EMAIL.SERVICE_ID;
  private readonly EMAILJS_TEMPLATE_ID = APP_CONSTANTS.EMAIL.TEMPLATE_ID;

  constructor() {
    this.initializeEmailJS();
  }

  private initializeEmailJS(): void {
    emailjs.init(this.EMAILJS_USER_ID);
  }

  async sendEmail(emailData: EmailData): Promise<EmailResponse> {
    try {
      const response = await emailjs.send(
        this.EMAILJS_SERVICE_ID,
        this.EMAILJS_TEMPLATE_ID,
        emailData
      );

      return {
        success: true,
        message: 'Email sent successfully!'
      };
    } catch (error) {
      console.error('Error sending email:', error);
      return {
        success: false,
        message: 'Failed to send email. Please try again.'
      };
    }
  }
}
