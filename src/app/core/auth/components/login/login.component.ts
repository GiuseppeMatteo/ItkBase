import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { noop } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { login } from 'src/app/core/auth/auth.actions';
import { AppState } from 'src/app/reducers';
import JwtDecode from 'jwt-decode';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  form: FormGroup;
  error: boolean = false;

  constructor(
    fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {
    this.form = fb.group({
      email: ['admin@intellitronika.com', [Validators.required]],
      password: ['itk.1', [Validators.required]],
    });
  }

  login() {
    const val = this.form.value;

    this.authService
      .login(val.email, val.password)
      .pipe(
        tap((res) => {
          this.error = false;
          let tmp: any = JwtDecode(res.token);

          this.store.dispatch(
            login({
              user: JSON.parse(tmp['user']),
              token: res.token,
            })
          );

          this.router.navigateByUrl('/home');
        })
      )
      .subscribe(noop, () => (this.error = true));
  }
}
