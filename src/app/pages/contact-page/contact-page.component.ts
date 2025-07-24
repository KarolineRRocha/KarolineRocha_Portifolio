import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ContactForm } from '../../models/contact.interface';
import { ContactService } from '../../services/contact.service';
import { BaseComponent } from '../../components/base/base.component';
import { LoadingService } from '../../services/loading.service';
import { NotificationService } from '../../services/notification.service';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss']
})
export class ContactPageComponent extends BaseComponent {
  form: FormGroup = this.fb.group({
    from_name: ['', [Validators.required]],
    to_name: ['Admin'],
    from_email: new FormControl('', [
      Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
    ]),
    message: ['', Validators.required]
  });

  isSubmitting = false;
  submitMessage = '';
  submitMessageType: 'success' | 'error' = 'success';

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    protected override loadingService: LoadingService,
    protected override notificationService: NotificationService,
    protected override errorHandler: ErrorHandlerService
  ) {
    super(loadingService, notificationService, errorHandler);
  }

  async send(): Promise<void> {
    if (this.isSubmitting) return;

    this.isSubmitting = true;
    this.submitMessage = '';

    try {
      const contactForm: ContactForm = this.form.value;

      // Validate form using service
      const validation = this.contactService.validateContactForm(contactForm);
      if (!validation.isValid) {
        this.showMessage(validation.errors.join(', '), 'error');
        return;
      }

      // Submit form using service
      const success = await this.contactService.submitContactForm(contactForm);

      if (success) {
        this.showMessage('Message sent successfully!', 'success');
        this.form.reset();
      } else {
        this.showMessage('Failed to send message. Please try again.', 'error');
      }
    } catch (error) {
      this.errorHandler.handleError(error, 'ContactPageComponent.send');
      this.showMessage('An unexpected error occurred. Please try again.', 'error');
    } finally {
      this.isSubmitting = false;
    }
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    this.submitMessage = message;
    this.submitMessageType = type;

    // Clear message after 5 seconds
    setTimeout(() => {
      this.submitMessage = '';
    }, 5000);
  }
}
