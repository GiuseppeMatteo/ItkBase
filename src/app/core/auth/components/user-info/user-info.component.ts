import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getUser } from 'src/app/core/auth/auth.selectors';
import { AuthState } from 'src/app/core/auth/reducers';
import { UserModel } from '../../../../shared/models/user.model';

@Component({
  selector: 'itk-user-info',
  templateUrl: './user-info.component.html',
})
export class UserInfoComponent implements OnInit {
  user$: Observable<UserModel>;

  constructor(private store: Store<AuthState>) {}

  ngOnInit(): void {
    this.user$ = this.store.pipe(select(getUser));
  }
}
