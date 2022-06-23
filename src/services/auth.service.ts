import cookie from 'js-cookie';
import { ILogin } from 'src/interfaces';
import { APIRequest, TOKEN } from './api-request';

export class AuthService extends APIRequest {
  public async login(data: ILogin) {
    return this.post('/auth/login', data);
  }

  setToken(token: string): void {
    cookie.set(TOKEN, token);
    this.setAuthHeaderToken(token);
  }

  getToken(): string {
    const token = cookie.get(TOKEN);
    return token;
  }

  removeToken(): void {
    cookie.remove(TOKEN);
  }

  updatePassword(password: string, userId?: string, source?: string) {
    const url = userId ? '/auth/users/password' : '/auth/users/password';
    return this.put(url, { userId, password, source });
  }

  resetPassword(data) {
    return this.post('/auth/users/forgot', data);
  }
}

export const authService = new AuthService();
