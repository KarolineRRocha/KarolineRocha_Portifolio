export interface ContactForm {
  from_name: string;
  to_name: string;
  from_email: string;
  message: string;
}

export interface EmailData extends Record<string, unknown> {
  from_name: string;
  to_name: string;
  from_email: string;
  message: string;
}

export interface EmailResponse {
  success: boolean;
  message: string;
}
