import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SignUpService, SignUpResponse } from '../../services/signup.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [RouterLink, TableModule, ButtonModule, CardModule, ToastModule],
  providers: [MessageService],
  templateUrl: './account-list.html',
  styleUrl: './account-list.scss'
})
export class AccountListComponent implements OnInit {
  private readonly signUpService = inject(SignUpService);
  private readonly messageService = inject(MessageService);

  protected accounts = signal<SignUpResponse[]>([]);
  protected selectedAccounts = signal<SignUpResponse[]>([]);
  protected loading = signal(true);

  ngOnInit() {
    this.loadAccounts();
  }

  protected loadAccounts() {
    this.loading.set(true);

    this.signUpService.getAccounts().subscribe({
      next: (data) => {
        this.accounts.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not load the accounts list. Is the server running?',
          life: 4000
        });
        console.error('Error loading accounts:', err);
      }
    });
  }

  protected deleteSelected() {
    const selected = this.selectedAccounts();
    if (selected.length === 0) return;

    this.loading.set(true);

    const deleteRequests = selected.map(account => 
      this.signUpService.deleteAccount(account.id.toString())
    );

    forkJoin(deleteRequests).subscribe({
      next: () => {
        selected.forEach(account => {
          this.messageService.add({
            severity: 'success',
            summary: 'Record Removed',
            detail: `The record with name "${account.name}" has been removed.`,
            life: 4000
          });
        });

        this.selectedAccounts.set([]);
        this.loadAccounts();
      },
      error: (err) => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not delete the selected account(s).',
          life: 4000
        });
        console.error('Error deleting accounts:', err);
      }
    });
  }
}
