import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginAlert {
  email: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  location?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailAlertService {
  // Using EmailJS for automatic email sending
  private readonly EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send';
  private readonly SERVICE_ID = 'service_xyz123'; // Replace with your EmailJS service ID
  private readonly TEMPLATE_ID = 'template_abc456'; // Replace with your EmailJS template ID
  private readonly USER_ID = 'user_def789'; // Replace with your EmailJS user ID

  constructor(private http: HttpClient) { }

  sendLoginAlert(loginData: LoginAlert): Observable<any> {
    const templateParams = {
      to_email: 'emaildakarolineribeiro@gmail.com',
      from_name: 'Portfolio Security System',
      subject: '🔐 Security Alert - Admin Login Detected',
      message: this.formatLoginAlertMessage(loginData),
      login_email: loginData.email,
      login_time: loginData.timestamp,
      ip_address: loginData.ipAddress || 'Unknown',
      user_agent: loginData.userAgent || 'Unknown',
      location: loginData.location || 'Unknown'
    };

    return this.http.post(this.EMAILJS_ENDPOINT, {
      service_id: this.SERVICE_ID,
      template_id: this.TEMPLATE_ID,
      user_id: this.USER_ID,
      template_params: templateParams
    });
  }

  private formatLoginAlertMessage(loginData: LoginAlert): string {
    return `
🚨 SECURITY ALERT - ADMIN LOGIN DETECTED

Your portfolio admin panel has been accessed.

📧 Login Email: ${loginData.email}
⏰ Timestamp: ${loginData.timestamp}
🌐 IP Address: ${loginData.ipAddress || 'Unknown'}
📍 Location: ${loginData.location || 'Unknown'}
🖥️ User Agent: ${loginData.userAgent || 'Unknown'}

⚠️ SECURITY RECOMMENDATIONS:
• If this was you, no action is needed
• If this was NOT you, immediately:
  1. Change your admin password
  2. Review your account security
  3. Contact support if needed

🔒 This is an automated security notification from your portfolio admin panel.
    `;
  }

  // Alternative: Using a simple email service (for development/testing)
  // This method sends email without opening any tabs or showing alerts
  sendSimpleEmailAlert(loginData: LoginAlert): void {
    // Create a hidden form to send email via POST
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://formspree.io/f/your-form-id'; // Replace with your Formspree endpoint
    form.style.display = 'none';

    const subject = document.createElement('input');
    subject.type = 'hidden';
    subject.name = 'subject';
    subject.value = '🔐 Security Alert - Admin Login Detected';

    const email = document.createElement('input');
    email.type = 'hidden';
    email.name = 'email';
    email.value = 'emaildakarolineribeiro@gmail.com';

    const message = document.createElement('input');
    message.type = 'hidden';
    message.name = 'message';
    message.value = this.formatLoginAlertMessage(loginData);

    form.appendChild(subject);
    form.appendChild(email);
    form.appendChild(message);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }

  // Get client IP address using a free IP service
  getClientIP(): Promise<string> {
    return new Promise((resolve) => {
      this.http.get('https://api.ipify.org?format=json').subscribe({
        next: (response: any) => resolve(response.ip),
        error: () => resolve('Unknown')
      });
    });
  }

  // Get user location using IP geolocation
  getClientLocation(): Promise<string> {
    return new Promise((resolve) => {
      this.getClientIP().then(ip => {
        if (ip && ip !== 'Unknown') {
          this.http.get(`https://ipapi.co/${ip}/json/`).subscribe({
            next: (response: any) => {
              const location = `${response.city || ''}, ${response.country_name || ''}`.trim();
              resolve(location || 'Unknown');
            },
            error: () => resolve('Unknown')
          });
        } else {
          resolve('Unknown');
        }
      });
    });
  }
}
