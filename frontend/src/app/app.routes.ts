import { Routes } from '@angular/router';
import { SignUpComponent } from './components/signup/signup';
import { AccountListComponent } from './components/account-list/account-list';

export const routes: Routes = [
  { path: '', component: SignUpComponent },
  { path: 'accounts', component: AccountListComponent },
  { path: '**', redirectTo: '' }
];
