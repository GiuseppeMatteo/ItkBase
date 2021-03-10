import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppConfig } from 'src/app/app.config';

import { tap } from 'rxjs/operators';
import { UserModel } from 'src/app/shared/models/user.model';
import { TokenJWT } from 'src/app/shared/models/token.model';
import * as SessionKey from './auth.global';
import { Observable } from 'rxjs';
import JwtDecode from 'jwt-decode';

@Injectable()
export class AuthService {
  data: UserModel | undefined;
  error: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  login(Email: string, Password: string): Observable<TokenJWT> {
    return this.http.post<TokenJWT>(`${AppConfig.settings.UrlAPI}Users/Login`, {
      Email: `${btoa(Email)}`,
      Password: `${btoa(Password)}`,
    });
    // .pipe(
    //   tap((res) => {
    //     sessionStorage.setItem(
    //       SessionKey.TOKEN_DATA_SESSION,
    //       JSON.stringify(res)
    //     );

    //     let tmp: any = JwtDecode(res.token);
    //     sessionStorage.setItem(SessionKey.USER_DATA_SESSION, tmp['user']);
    //   })
    // );
  }

  // isLogged() {
  //   return !!sessionStorage.getItem(SessionKey.USER_DATA_SESSION);
  // }

  // public DeleteUserLogger() {
  //   sessionStorage.removeItem(SessionKey.USER_DATA_SESSION);
  // }

  // public GetUserLogged(): UserModel {
  //   return JSON.parse(sessionStorage.getItem(SessionKey.USER_DATA_SESSION));
  // }

  // public SetUserLogged(model: UserModel) {
  //   sessionStorage.setItem(SessionKey.USER_DATA_SESSION, JSON.stringify(model));
  // }

  refreshToken() {
    sessionStorage.removeItem(SessionKey.USER_DATA_SESSION);

    var header = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${sessionStorage.getItem(SessionKey.TOKEN_DATA_SESSION)}`
      ),
    };

    return this.http
      .get<TokenJWT>(`${AppConfig.settings.UrlAPI}Token/Refresh`, header)
      .pipe(
        tap((result) => {
          sessionStorage.setItem(
            SessionKey.TOKEN_DATA_SESSION,
            JSON.stringify(result.token)
          );
          let tmp: any = JwtDecode(result.token);
          sessionStorage.setItem(SessionKey.USER_DATA_SESSION, tmp['user']);
        })
      );
  }
}
