import { Injectable, OnDestroy } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';

import { BehaviorSubject, Observable, Subscription, throwError } from 'rxjs';
import {
  map,
  catchError,
  filter,
  switchMap,
  take,
  tap,
  concatMap,
} from 'rxjs/operators';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthService } from './auth/auth.service';
import { TokenJWT } from '../shared/models/token.model';
import { ExceptionModel } from '../shared/models/exception.model';
import { ServerErrorComponent } from '../shared/components/server-error.component';
import * as SessionKey from './auth/auth.global';
import { AppState } from '../reducers';
import { select, Store } from '@ngrx/store';
import { getToken, isLoggedIn } from './auth/auth.selectors';

@Injectable({ providedIn: 'root' })
export class HttpCustomInterceptor implements HttpInterceptor, OnDestroy {
  subscription: Subscription;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private store: Store<AppState>
  ) {}

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let isUserLogged: boolean = false;

    this.subscription = this.store
      .pipe(
        select(isLoggedIn),
        tap((res) => {
          isUserLogged = res;
          if (res)
            request = this.addToken(
              request,
              sessionStorage.getItem(SessionKey.TOKEN_DATA_SESSION)
            );
        })
      )
      .subscribe();

    request = request.clone({
      headers: request.headers.set('Accept', 'application/json'),
    });

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        return event;
      }),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          // Error custom message Http interceptor 401 //
          return this.handle401Error(request, next);
        } else {
          if (!isUserLogged && err.status === 404) {
          } else if (err.status == 500) {
            // Error custom message Http interceptor 500 //
            const dialogConfig = new MatDialogConfig();
            dialogConfig.disableClose = true;
            dialogConfig.autoFocus = true;
            dialogConfig.width = '50%';
            dialogConfig.data = err.error as ExceptionModel;
            this.dialog.open(ServerErrorComponent, dialogConfig);
          }
        }

        return throwError(err);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((jwt: TokenJWT) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(jwt.token);
          return next.handle(this.addToken(request, jwt.token));
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((jwt) => {
          return next.handle(this.addToken(request, jwt));
        })
      );
    }
  }
}
