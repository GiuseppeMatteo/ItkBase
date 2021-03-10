import { Component } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { login, logout } from './core/auth/auth.actions';
import { isLoggedIn, isLoggedOut } from './core/auth/auth.selectors';
import { AppState } from './reducers';
import * as SessionKey from './core/auth/auth.global';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'itk-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  loading = true;
  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;
  appVersion: string;

  constructor(private router: Router, private store: Store<AppState>) {
    this.appVersion = environment.version;
  }

  ngOnInit() {
    const userProfile = localStorage.getItem(SessionKey.USER_DATA_SESSION);

    if (userProfile) {
      this.store.dispatch(
        login({
          user: JSON.parse(userProfile),
          token: localStorage.getItem(SessionKey.TOKEN_DATA_SESSION),
        })
      );
    }

    this.router.events.subscribe((event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
    });

    this.isLoggedIn$ = this.store.pipe(select(isLoggedIn));

    this.isLoggedOut$ = this.store.pipe(select(isLoggedOut));
  }

  logout() {
    this.store.dispatch(logout());
  }
}
