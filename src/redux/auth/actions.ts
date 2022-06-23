import { createAsyncAction } from '@lib/redux';

export const { login, loginSuccess, loginFail } = createAsyncAction(
  'login',
  'LOGIN'
);

export const { logout, logoutSuccess, logoutFail } = createAsyncAction(
  'logout',
  'LogOut'
);
