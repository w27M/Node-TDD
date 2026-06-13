import { createReducer, on } from '@ngrx/store';
import { SignUpResponse } from '../services/component.service';
import * as AccountsActions from './accounts.actions';

export interface AccountsState {
  accounts: SignUpResponse[];
  loading: boolean;
  actionLoading: boolean;
  error: any;
}

export const initialState: AccountsState = {
  accounts: [],
  loading: false,
  actionLoading: false,
  error: null
};

export const accountsReducer = createReducer(
  initialState,

  // Load Accounts
  on(AccountsActions.loadAccounts, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AccountsActions.loadAccountsSuccess, (state, { accounts }) => ({
    ...state,
    accounts,
    loading: false
  })),
  on(AccountsActions.loadAccountsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Add Account
  on(AccountsActions.addAccount, (state) => ({
    ...state,
    actionLoading: true,
    error: null
  })),
  on(AccountsActions.addAccountSuccess, (state, { account }) => ({
    ...state,
    accounts: [...state.accounts, account],
    actionLoading: false
  })),
  on(AccountsActions.addAccountFailure, (state, { error }) => ({
    ...state,
    actionLoading: false,
    error
  })),

  // Delete Account
  on(AccountsActions.deleteAccount, (state) => ({
    ...state,
    actionLoading: true,
    error: null
  })),
  on(AccountsActions.deleteAccountSuccess, (state, { id }) => ({
    ...state,
    accounts: state.accounts.filter(acc => acc.id.toString() !== id),
    actionLoading: false
  })),
  on(AccountsActions.deleteAccountFailure, (state, { error }) => ({
    ...state,
    actionLoading: false,
    error
  }))
);
