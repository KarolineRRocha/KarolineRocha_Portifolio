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
    try {
      emailjs.init(this.EMAILJS_USER_ID);
    } catch (error) {
      console.error('Failed to initialize EmailJS:', error);
    }
  }

  async sendEmail(emailData: EmailData): Promise<EmailResponse> {
    try {
      // Prepare the email data with the correct recipient
      const templateParams = {
        from_name: emailData.from_name,
        from_email: emailData.from_email,
        to_name: APP_CONSTANTS.EMAIL.DEFAULT_TO_NAME,
        to_email: APP_CONSTANTS.EMAIL.DEFAULT_TO_EMAIL,
        message: emailData.message,
        reply_to: emailData.from_email
      };

      console.log('Sending email with params:', templateParams);

      const response = await emailjs.send(
        this.EMAILJS_SERVICE_ID,
        this.EMAILJS_TEMPLATE_ID,
        templateParams
      );

      console.log('EmailJS response:', response);

      return {
        success: true,
        message: 'Email sent successfully!'
      };
    } catch (error: any) {
      console.error('Error sending email:', error);

      // Handle specific EmailJS errors
      let errorMessage = 'Failed to send email. Please try again.';

      if (error.status === 412) {
        errorMessage = 'Email service connection expired. Please contact the administrator to reconnect the email service.';
      } else if (error.status === 400) {
        errorMessage = 'Invalid email configuration. Please check the email service setup.';
      } else if (error.status === 429) {
        errorMessage = 'Too many email requests. Please try again later.';
      } else if (error.status >= 500) {
        errorMessage = 'Email service temporarily unavailable. Please try again later.';
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  // Alternative method using a different email service (if needed)
  async sendEmailAlternative(emailData: EmailData): Promise<EmailResponse> {
    try {
      // This could be implemented with a different email service
      // like SendGrid, Mailgun, or a custom backend endpoint

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from_name: emailData.from_name,
          from_email: emailData.from_email,
          to_name: APP_CONSTANTS.EMAIL.DEFAULT_TO_NAME,
          to_email: APP_CONSTANTS.EMAIL.DEFAULT_TO_EMAIL,
          message: emailData.message,
          reply_to: emailData.from_email
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        message: 'Email sent successfully!'
      };
    } catch (error) {
      console.error('Error sending email via alternative method:', error);
      return {
        success: false,
        message: 'Failed to send email. Please try again.'
      };
    }
  }
}
