import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ComponentService } from '../services/component.service';
import * as AccountsActions from './accounts.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class AccountsEffects {
  private readonly actions$ = inject(Actions);
  private readonly componentService = inject(ComponentService);

  loadAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.loadAccounts),
      mergeMap(() =>
        this.componentService.getAccounts().pipe(
          map((accounts) => AccountsActions.loadAccountsSuccess({ accounts })),
          catchError((error) => of(AccountsActions.loadAccountsFailure({ error })))
        )
      )
    )
  );

  addAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.addAccount),
      mergeMap(({ request }) =>
        this.componentService.signUp(request).pipe(
          map((account) => AccountsActions.addAccountSuccess({ account })),
          catchError((error) => of(AccountsActions.addAccountFailure({ error })))
        )
      )
    )
  );

  deleteAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.deleteAccount),
      mergeMap(({ id, name }) =>
        this.componentService.deleteAccount(id).pipe(
          map(() => AccountsActions.deleteAccountSuccess({ id, name })),
          catchError((error) => of(AccountsActions.deleteAccountFailure({ error })))
        )
      )
    )
  );
}
