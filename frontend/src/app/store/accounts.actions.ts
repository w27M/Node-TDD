import { createAction, props } from '@ngrx/store';
import { SignUpRequest, SignUpResponse } from '../services/component.service';

// Load Accounts
export const loadAccounts = createAction('[Accounts] Load Accounts');
export const loadAccountsSuccess = createAction(
  '[Accounts] Load Accounts Success',
  props<{ accounts: SignUpResponse[] }>()
);
export const loadAccountsFailure = createAction(
  '[Accounts] Load Accounts Failure',
  props<{ error: any }>()
);

// Add Account
export const addAccount = createAction(
  '[Accounts] Add Account',
  props<{ request: SignUpRequest }>()
);
export const addAccountSuccess = createAction(
  '[Accounts] Add Account Success',
  props<{ account: SignUpResponse }>()
);
export const addAccountFailure = createAction(
  '[Accounts] Add Account Failure',
  props<{ error: any }>()
);

// Delete Account
export const deleteAccount = createAction(
  '[Accounts] Delete Account',
  props<{ id: string; name: string }>()
);
export const deleteAccountSuccess = createAction(
  '[Accounts] Delete Account Success',
  props<{ id: string; name: string }>()
);
export const deleteAccountFailure = createAction(
  '[Accounts] Delete Account Failure',
  props<{ error: any }>()
);
