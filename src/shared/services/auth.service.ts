import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {AuthApi} from "../../features/auth/api/auth.api";

const ACCESS_TOKEN_KEY = 'access_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(AuthApi);

  /**
   * Faz login usando email (mapeado para username) e salva o token.
   * Também atualiza a SessionService com dados mínimos do usuário.
   */
  async login(email: string, password: string, sessionService: { login: (user?: any) => void }): Promise<boolean> {
    try {
      const res = await firstValueFrom(this.api.login({ username: email, password }));
      if (!res?.token) return false;

      localStorage.setItem(ACCESS_TOKEN_KEY, res.token);

      // Decodifica claims básicas do JWT (se disponíveis)
      const claims = decodeJwt(res.token);
      const user = {
        email: claims?.email ?? email,
        sub: claims?.sub,
        roles: claims?.roles ?? claims?.authorities ?? []
      };

      sessionService.login(user);
      return true;
    } catch {
      return false;
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
    if (!claims?.exp) return true; // se o back não manda exp, não bloqueia
    const nowSec = Math.floor(Date.now() / 1000);
    return claims.exp > nowSec;
  }
}

/** Decodificador JWT seguro (sem libs) */
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
