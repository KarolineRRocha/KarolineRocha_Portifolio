import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ContactForm } from '../../models/contact.interface';
import { ContactService } from '../../services/contact.service';
import { BaseComponent } from '../../components/base/base.component';
import { LoadingService } from '../../services/loading.service';
import { NotificationService } from '../../services/notification.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss'],

})
export class ContactPageComponent extends BaseComponent implements OnInit {
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
  showSuccessModal = false;
  showQuickContactModal = false;

  // Typewriter effect
  typewriterText = '';
  typewriterPhrases = [
    'Ready to Build Something Amazing?',
    'Let\'s Create Digital Magic Together',
    'Your Ideas + My Code = Success',
    'Innovation Starts Here'
  ];
  currentPhraseIndex = 0;
  currentCharIndex = 0;
  isDeleting = false;

  // Form progress
  focusedField = '';



  // Availability timeline
  availabilityTimeline = [
    {
      period: 'Morning (9AM - 12PM)',
      description: 'Best time for planning and creative work',
      available: true,
      active: true
    },
    {
      period: 'Afternoon (1PM - 5PM)',
      description: 'Peak productivity for development',
      available: true,
      active: false
    },
    {
      period: 'Evening (5PM - 9PM)',
      description: 'Available for meetings and collaboration',
      available: true,
      active: false
    },
    {
      period: 'Weekends',
      description: 'Limited availability for urgent projects',
      available: false,
      active: false
    }
  ];

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    protected override loadingService: LoadingService,
    protected override notificationService: NotificationService,
    protected override errorHandler: ErrorHandlerService
  ) {
    super(loadingService, notificationService, errorHandler);
  }

  ngOnInit(): void {
    this.startTypewriterEffect();
    this.updateFormProgress();
    this.startAvailabilityTimer();
  }

  async send(): Promise<void> {
    if (this.isSubmitting) return;

    this.isSubmitting = true;
    console.log('Starting email submission...');

    try {
      const contactForm: ContactForm = this.form.value;
      console.log('Form data:', contactForm);

      // Validate form using service
      const validation = this.contactService.validateContactForm(contactForm);
      if (!validation.isValid) {
        console.log('Validation errors:', validation.errors);
        this.notificationService.error(validation.errors.join(', '));
        return;
      }

      // Submit form using service
      const success = await this.contactService.submitContactForm(contactForm);

      if (success) {
        console.log('Email sent successfully!');
        this.showSuccessModal = true;
        this.form.reset();
        this.notificationService.success('Message sent successfully! You will receive a response soon.');
      } else {
        console.log('Failed to send email');
        this.notificationService.error('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error in send method:', error);
      this.errorHandler.handleError(error, 'ContactPageComponent.send');
      this.notificationService.error('An unexpected error occurred. Please try again.');
    } finally {
      this.isSubmitting = false;
    }
  }

  closeModal(): void {
    this.showSuccessModal = false;
  }

  // Navigation and interaction methods
  scrollToForm(): void {
    const element = document.getElementById('contact-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  showQuickContact(): void {
    this.showQuickContactModal = true;
  }

  closeQuickContactModal(): void {
    this.showQuickContactModal = false;
  }

  openLinkedIn(): void {
    window.open('https://www.linkedin.com/in/karoline-rrocha/', '_blank');
  }

  openGitHub(): void {
    window.open('https://github.com/KarolineRRocha', '_blank');
  }

  openEmail(): void {
    window.open('mailto:karoline.rrocha@gmail.com', '_blank');
  }



  // Typewriter effect
  private startTypewriterEffect(): void {
    setInterval(() => {
      const currentPhrase = this.typewriterPhrases[this.currentPhraseIndex];

      if (!this.isDeleting) {
        this.typewriterText = currentPhrase.substring(0, this.currentCharIndex + 1);
        this.currentCharIndex++;

        if (this.currentCharIndex === currentPhrase.length) {
          setTimeout(() => this.isDeleting = true, 2000);
        }
      } else {
        this.typewriterText = currentPhrase.substring(0, this.currentCharIndex - 1);
        this.currentCharIndex--;

        if (this.currentCharIndex === 0) {
          this.isDeleting = false;
          this.currentPhraseIndex = (this.currentPhraseIndex + 1) % this.typewriterPhrases.length;
        }
      }
    }, 100);
  }

  // Form progress tracking
  private updateFormProgress(): void {
    // Progress is now calculated dynamically via getter
  }



  setFocusedField(field: string): void {
    this.focusedField = field;
  }

  clearFocusedField(): void {
    this.focusedField = '';
  }

  getFormProgress(): number {
    const totalFields = 3;
    let filledFields = 0;

    if (this.form.get('from_name')?.value) filledFields++;
    if (this.form.get('from_email')?.value) filledFields++;
    if (this.form.get('message')?.value) filledFields++;

    return Math.round((filledFields / totalFields) * 100);
  }

  get formProgress(): number {
    return this.getFormProgress();
  }

  getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (!field?.errors || !field.touched) return '';

    if (field.errors['required']) {
      return `${fieldName === 'from_name' ? 'Name' : fieldName === 'from_email' ? 'Email' : 'Message'} is required`;
    }
    if (field.errors['pattern']) {
      return 'Please enter a valid email address';
    }
    return '';
  }

  shouldShowError(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field?.errors && field.touched);
  }


  // Availability timer
  private startAvailabilityTimer(): void {
    // Update immediately when component initializes
    this.updateAvailabilityStatus();

    // Update every minute
    setInterval(() => {
      this.updateAvailabilityStatus();
    }, 60000);
  }

  private updateAvailabilityStatus(): void {
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday

    this.availabilityTimeline.forEach((time, index) => {
      time.active = false;

      // Morning (9AM - 12PM)
      if (index === 0 && hour >= 9 && hour < 12) {
        time.active = true;
      }
      // Afternoon (1PM - 5PM)
      else if (index === 1 && hour >= 13 && hour < 17) {
        time.active = true;
      }
      // Evening (5PM - 9PM)
      else if (index === 2 && hour >= 17 && hour < 21) {
        time.active = true;
      }
      // Weekends - only active on weekends
      else if (index === 3 && (dayOfWeek === 0 || dayOfWeek === 6)) {
        time.active = true;
      }
    });

    // If no period is active, activate the most appropriate one based on current time
    const hasActivePeriod = this.availabilityTimeline.some(time => time.active);
    if (!hasActivePeriod) {
      if (hour >= 6 && hour < 12) {
        // Early morning to noon - activate morning
        this.availabilityTimeline[0].active = true;
      } else if (hour >= 12 && hour < 17) {
        // Noon to 5 PM - activate afternoon
        this.availabilityTimeline[1].active = true;
      } else if (hour >= 17 && hour < 22) {
        // 5 PM to 10 PM - activate evening
        this.availabilityTimeline[2].active = true;
      } else {
        // Late night - activate evening as default
        this.availabilityTimeline[2].active = true;
      }
    }
  }
}
