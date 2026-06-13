import { Component, input, model } from '@angular/core';
import { TableModule } from 'primeng/table';
import { SignUpResponse } from '../../../services/component.service';

@Component({
  selector: 'app-account-table',
  standalone: true,
  imports: [TableModule],
  templateUrl: './account-table.html',
  styleUrl: './account-table.scss'
})
export class AccountTableComponent {
  accounts = input<SignUpResponse[]>([]);
  loading = input<boolean>(false);
  selection = model<SignUpResponse[]>([]); // Using 'model' allows two-way signal binding!
}
