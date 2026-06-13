import { Routes } from '@angular/router';
import { SignUpComponent } from './components/signup/signup';
import { AccountListComponent } from './components/account-list/account-list';
import { signUpDeactivateGuard } from './guards/signup-deactivate.guard';

export const routes: Routes = [
  { 
    path: '', 
    component: SignUpComponent,
    canDeactivate: [signUpDeactivateGuard]
  },
  { path: 'accounts', component: AccountListComponent },
  { path: '**', redirectTo: '' }
];
