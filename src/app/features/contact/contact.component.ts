// contact.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ContactComponent {
  contactForm: FormGroup;
  isSubmitting = false;
  submitMessage = '';
  submitMessageType: 'success' | 'error' | '' = '';

  // Your contact information
  personalInfo = {
    email: 'sakibhossain86@gmail.com',
    phone: '+8801811695986',
    whatsapp: '+8801811695986',
    location: 'Dhaka, Bangladesh'
  };

  socialLinks: SocialLink[] = [
    {
      platform: 'LinkedIn',
      url: 'https://linkedin.com/in/your-profile',
      icon: 'fab fa-linkedin',
      color: '#0077b5'
    },
    {
      platform: 'GitHub',
      url: 'https://github.com/your-username',
      icon: 'fab fa-github',
      color: '#333'
    },
    {
      platform: 'Twitter',
      url: 'https://twitter.com/your-username',
      icon: 'fab fa-twitter',
      color: '#1da1f2'
    },
    {
      platform: 'WhatsApp',
      url: `https://wa.me/${this.personalInfo.whatsapp.replace(/[+\s]/g, '')}`,
      icon: 'fab fa-whatsapp',
      color: '#25d366'
    }
  ];

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  // Form validation getters
  get name() { return this.contactForm.get('name'); }
  get email() { return this.contactForm.get('email'); }
  get subject() { return this.contactForm.get('subject'); }
  get message() { return this.contactForm.get('message'); }

  // Method 1: Send email using mailto (Simple approach)
  onSubmitMailto(): void {
    if (this.contactForm.valid) {
      const formData = this.contactForm.value as ContactForm;
      
      const mailtoUrl = this.generateMailtoUrl(formData);
      
      // Open default email client
      window.location.href = mailtoUrl;
      
      this.showSuccessMessage('Email client opened! Please send the email from your email application.');
      this.resetForm();
    } else {
      this.markFormGroupTouched();
    }
  }

  // Method 2: Send to WhatsApp
  sendToWhatsApp(): void {
    if (this.contactForm.valid) {
      const formData = this.contactForm.value as ContactForm;
      
      const whatsappMessage = this.generateWhatsAppMessage(formData);
      const whatsappUrl = `https://wa.me/${this.personalInfo.whatsapp.replace(/[+\s]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;
      
      // Open WhatsApp
      window.open(whatsappUrl, '_blank');
      
      this.showSuccessMessage('WhatsApp opened! Please send the message.');
      this.resetForm();
    } else {
      this.markFormGroupTouched();
    }
  }

  // Method 3: Send using EmailJS (Professional approach)
  async onSubmitEmailJS(): Promise<void> {
    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.submitMessage = 'Sending message...';
      this.submitMessageType = '';

      try {
        const formData = this.contactForm.value as ContactForm;
        
        // EmailJS implementation
        await this.sendEmailWithEmailJS(formData);
        
        this.showSuccessMessage('Message sent successfully! I will get back to you soon.');
        this.resetForm();
      } catch (error) {
        console.error('Email sending failed:', error);
        this.showErrorMessage('Failed to send message. Please try the WhatsApp option or contact me directly.');
      } finally {
        this.isSubmitting = false;
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  // Generate mailto URL
  private generateMailtoUrl(formData: ContactForm): string {
    const subject = encodeURIComponent(`Portfolio Contact: ${formData.subject}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Subject: ${formData.subject}\n\n` +
      `Message:\n${formData.message}\n\n` +
      `---\nSent from Portfolio Contact Form`
    );
    
    return `mailto:${this.personalInfo.email}?subject=${subject}&body=${body}`;
  }

  // Generate WhatsApp message
  private generateWhatsAppMessage(formData: ContactForm): string {
    return `*Portfolio Contact Form*\n\n` +
           `*Name:* ${formData.name}\n` +
           `*Email:* ${formData.email}\n` +
           `*Subject:* ${formData.subject}\n\n` +
           `*Message:*\n${formData.message}`;
  }

  private async sendEmailWithEmailJS(formData: ContactForm): Promise<void> {
    // First install EmailJS: npm install @emailjs/browser
    // Then uncomment and configure this:
    
    
    const emailjs = await import('@emailjs/browser');
    
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      subject: formData.subject,
      message: formData.message,
      to_email: this.personalInfo.email
    };

    await emailjs.send(
      'YOUR_SERVICE_ID',     // Replace with your EmailJS service ID
      'YOUR_TEMPLATE_ID',    // Replace with your EmailJS template ID
      templateParams,
      'YOUR_PUBLIC_KEY'      // Replace with your EmailJS public key
    );
    
    
    // For now, simulate the email sending
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  }

  // Quick contact methods
  callPhone(): void {
    window.location.href = `tel:${this.personalInfo.phone}`;
  }

  sendEmail(): void {
    window.location.href = `mailto:${this.personalInfo.email}`;
  }

  openWhatsApp(): void {
    const whatsappUrl = `https://wa.me/${this.personalInfo.whatsapp.replace(/[+\s]/g, '')}`;
    window.open(whatsappUrl, '_blank');
  }

  openSocialLink(link: SocialLink): void {
    window.open(link.url, '_blank');
  }

  // Utility methods
  private resetForm(): void {
    this.contactForm.reset();
    this.markFormGroupUntouched();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.contactForm.controls).forEach(key => {
      this.contactForm.get(key)?.markAsTouched();
    });
  }

  private markFormGroupUntouched(): void {
    Object.keys(this.contactForm.controls).forEach(key => {
      this.contactForm.get(key)?.markAsUntouched();
    });
  }

  private showSuccessMessage(message: string): void {
    this.submitMessage = message;
    this.submitMessageType = 'success';
    setTimeout(() => this.clearMessage(), 5000);
  }

  private showErrorMessage(message: string): void {
    this.submitMessage = message;
    this.submitMessageType = 'error';
    setTimeout(() => this.clearMessage(), 5000);
  }

  private clearMessage(): void {
    this.submitMessage = '';
    this.submitMessageType = '';
  }

  // Form validation helpers
  getFieldError(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is too short`;
      }
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }
}