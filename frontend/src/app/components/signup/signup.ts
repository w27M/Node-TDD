import { Component, inject, signal, computed, DestroyRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SignUpRequest } from '../../services/component.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import * as AccountsActions from '../../store/accounts.actions';
import { selectAccountsActionLoading } from '../../store/accounts.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink, ToastModule, ConfirmationDialogComponent],
  providers: [MessageService],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class SignUpComponent {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly messageService = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

  // Form Fields
  protected name = signal('');
  protected email = signal('');
  protected password = signal('');
  protected passwordConfirmation = signal('');

  // Form Validation & Modification States
  protected isFormValid = computed(() => {
    return this.name().trim() !== '' &&
           this.email().trim() !== '' &&
           this.password().trim() !== '' &&
           this.passwordConfirmation().trim() !== '';
  });

  protected isFormDirty = computed(() => {
    return this.name().trim() !== '' ||
           this.email().trim() !== '' ||
           this.password().trim() !== '' ||
           this.passwordConfirmation().trim() !== '';
  });

  // Modal State
  protected showDiscardDialog = signal(false);

  // Deactivation promise resolver
  private deactivationPromiseResolver?: (allow: boolean) => void;

  // Status/Feedback Fields from NgRx
  protected loading = this.store.selectSignal(selectAccountsActionLoading);

  constructor() {
    // Listen for addition success to show feedback and reset the form
    this.actions$.pipe(
      ofType(AccountsActions.addAccountSuccess),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
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
    });

    // Listen for addition failure to show error feedback
    this.actions$.pipe(
      ofType(AccountsActions.addAccountFailure),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(({ error }) => {
      let errorDetail = 'An unexpected error occurred. Is the API server running?';
      
      if (error?.error?.errorMessage) {
        errorDetail = error.error.errorMessage;
      } else if (error?.error?.message) {
        errorDetail = error.error.message;
      } else if (error?.error?.error) {
        errorDetail = error.error.error;
      } else if (error?.message) {
        errorDetail = error.message;
      }
      
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: errorDetail,
        life: 4000
      });
      console.error('Sign up error:', error);
    });
  }

  // Deactivation Guard Handler called by Angular router guard
  public canDeactivate(): Promise<boolean> | boolean {
    if (this.isFormDirty()) {
      this.showDiscardDialog.set(true);
      return new Promise<boolean>((resolve) => {
        this.deactivationPromiseResolver = resolve;
      });
    }
    return true;
  }

  protected onDeactivateBack() {
    this.showDiscardDialog.set(false);
    if (this.deactivationPromiseResolver) {
      this.deactivationPromiseResolver(false);
      this.deactivationPromiseResolver = undefined;
    }
  }

  protected onDeactivateNext() {
    this.showDiscardDialog.set(false);
    if (this.deactivationPromiseResolver) {
      this.deactivationPromiseResolver(true);
      this.deactivationPromiseResolver = undefined;
    }
  }

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

    const requestData: SignUpRequest = {
      name: nameVal,
      email: emailVal,
      password: passwordVal,
      passwordConfirmation: passwordConfirmationVal
    };

    // Dispatch the NgRx Action
    this.store.dispatch(AccountsActions.addAccount({ request: requestData }));
  }
}
