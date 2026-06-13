import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SignUpResponse } from '../../services/component.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import * as AccountsActions from '../../store/accounts.actions';
import { selectAllAccounts, selectAccountsLoading, selectAccountsActionLoading } from '../../store/accounts.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [RouterLink, TableModule, ButtonModule, CardModule, ToastModule],
  providers: [MessageService],
  templateUrl: './account-list.html',
  styleUrl: './account-list.scss'
})
export class AccountListComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly messageService = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

  // States selected from NgRx Store
  protected accounts = this.store.selectSignal(selectAllAccounts);
  protected loading = this.store.selectSignal(selectAccountsLoading);
  protected actionLoading = this.store.selectSignal(selectAccountsActionLoading);

  // Local components selection state
  protected selectedAccounts = signal<SignUpResponse[]>([]);

  constructor() {
    // Listen for delete success to show notification and update local selection
    this.actions$.pipe(
      ofType(AccountsActions.deleteAccountSuccess),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(({ id, name }) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Record Removed',
        detail: `The record with name "${name}" has been removed.`,
        life: 4000
      });

      // Remove from selected list
      this.selectedAccounts.update(selected => selected.filter(acc => acc.id.toString() !== id));
    });

    // Listen for errors
    this.actions$.pipe(
      ofType(AccountsActions.loadAccountsFailure, AccountsActions.deleteAccountFailure),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(({ error }) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'An error occurred while communicating with the server. Is it running?',
        life: 4000
      });
      console.error('NgRx Account Error:', error);
    });
  }

  ngOnInit() {
    this.loadAccounts();
  }

  protected loadAccounts() {
    this.store.dispatch(AccountsActions.loadAccounts());
  }

  protected deleteSelected() {
    const selected = this.selectedAccounts();
    if (selected.length === 0) return;

    selected.forEach(account => {
      this.store.dispatch(AccountsActions.deleteAccount({ 
        id: account.id.toString(), 
        name: account.name 
      }));
    });
  }
}
