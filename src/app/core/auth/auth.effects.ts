import { Injectable } from '@angular/core';
import { AuthActions } from './action-types';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as SessionKey from './auth.global';
import { Actions, createEffect, ofType } from '@ngrx/effects';

@Injectable()
export class AuthEffects {
  login$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.login),
        tap((action) => {
          localStorage.setItem(
            SessionKey.TOKEN_DATA_SESSION,
            JSON.stringify(action.token)
          );

          localStorage.setItem(
            SessionKey.USER_DATA_SESSION,
            JSON.stringify(action.user)
          );
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap((action) => {
          localStorage.removeItem(SessionKey.USER_DATA_SESSION);
          localStorage.removeItem(SessionKey.TOKEN_DATA_SESSION);

          this.router.navigateByUrl('/login');
        })
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private router: Router) {}
}
