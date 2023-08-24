import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss']
})
export class ContactPageComponent {

  notEmpity: any = 1;

  form: FormGroup = this.fb.group({
    from_name: ['', [Validators.required]],
    to_name: 'Admin',
    from_email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    message: ['', Validators.required]
  });

  constructor(private fb: FormBuilder) { }

  async send() {
    emailjs.init('ssxlTwO2Ygo7ZPE-0');
    let response = await emailjs.send("service_bmdnfpt", "template_285h8vc", {
      from_name: this.form.value.from_name,
      to_name: this.form.value.to_name,
      from_email: this.form.value.from_email,
      message: this.form.value.message,
    });

    /* alert('Message has been sent.'); */
    this.form.reset();
  }
}
