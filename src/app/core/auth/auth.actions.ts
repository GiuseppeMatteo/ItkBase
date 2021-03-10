import { createAction, props } from '@ngrx/store';
import { UserModel } from 'src/app/shared/models/user.model';

export const login = createAction(
  '[Login Page] User Login',
  props<{ user: UserModel; token: string }>()
);

export const logout = createAction('[User profile] Logout');
