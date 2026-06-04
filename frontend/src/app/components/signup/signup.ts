import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SignUpService, SignUpRequest } from '../../services/signup.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink, ToastModule],
  providers: [MessageService],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class SignUpComponent {
  private readonly signUpService = inject(SignUpService);
  private readonly messageService = inject(MessageService);

  // Form Fields
  protected name = signal('');
  protected email = signal('');
  protected password = signal('');
  protected passwordConfirmation = signal('');

  // Status/Feedback Fields
  protected loading = signal(false);

  protected onSubmit() {
    const nameVal = this.name();
    const emailVal = this.email();
    const passwordVal = this.password();
    const passwordConfirmationVal = this.passwordConfirmation();

    // Basic validation matching controller's required fields
    if (!nameVal || !emailVal || !passwordVal || !passwordConfirmationVal) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'All fields are required.',
        life: 4000
      });
      return;
    }

    if (passwordVal !== passwordConfirmationVal) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Passwords do not match.',
        life: 4000
      });
      return;
    }

    this.loading.set(true);

    const requestData: SignUpRequest = {
      name: nameVal,
      email: emailVal,
      password: passwordVal,
      passwordConfirmation: passwordConfirmationVal
    };

    this.signUpService.signUp(requestData).subscribe({
      next: () => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Success! Account created successfully!',
          life: 4000
        });
        // Reset form
        this.name.set('');
        this.email.set('');
        this.password.set('');
        this.passwordConfirmation.set('');
      },
      error: (err) => {
        this.loading.set(false);
        let errorDetail = 'An unexpected error occurred. Is the API server running?';
        
        if (err.error && err.error.errorMessage) {
          errorDetail = err.error.errorMessage;
        } else if (err.error && err.error.message) {
          errorDetail = err.error.message;
        } else if (err.error && err.error.error) {
          errorDetail = err.error.error;
        }
        
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorDetail,
          life: 4000
        });
        console.error('Sign up error:', err);
      }
    });
  }
}
