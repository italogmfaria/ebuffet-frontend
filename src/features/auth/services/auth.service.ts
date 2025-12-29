import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {AuthApi} from "../api/auth.api";
import {MeResponse} from "../model/auth.type";
const ACCESS_TOKEN_KEY = 'access_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(AuthApi);

  async login(email: string, password: string, sessionService: { login: (user?: any) => void }): Promise<{ success: boolean; roles?: string[] }> {
    try {
      const { token, roles } = await firstValueFrom(this.api.login({ username: email, password }));
      if (!token) return { success: false };

      localStorage.setItem(ACCESS_TOKEN_KEY, token);

      const me: MeResponse = await firstValueFrom(this.api.me());

      sessionService.login({
        id: me.id,
        nome: me.nome,
        email: me.email,
        telefone: me.telefone,
        roles: me.roles
      });

      return { success: true, roles: me.roles };
    } catch {
      try { localStorage.removeItem(ACCESS_TOKEN_KEY); } catch {}
      return { success: false };
    }
  }

  logout(sessionService: { logout: () => void }) {
    try { localStorage.removeItem(ACCESS_TOKEN_KEY); } catch {}
    sessionService.logout();
  }

  static getToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  static isTokenValid(): boolean {
    const token = AuthService.getToken();
    if (!token) return false;
    const claims = decodeJwt(token);
    if (!claims?.exp) return true;
    const nowSec = Math.floor(Date.now() / 1000);
    return claims.exp > nowSec;
  }
}

function decodeJwt(token: string): any | null {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    try {
      const payload = token.split('.')[1];
      const json = atob(payload);
      return JSON.parse(json);
    } catch {
      return null;
    }
  }
}
