import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OrderService } from '../../features/orders/services/order.service';
import { environment } from '../../environments/environment';

interface SessionData {
  loggedIn: boolean;
  user?: any;
  timestamp?: number;
  buffetId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly storageKey = 'ebuffet_session_v1';
  private session: SessionData = { loggedIn: false };
  private _isAuthenticated$ = new BehaviorSubject<boolean>(false);
  private _initialized$ = new BehaviorSubject<boolean>(false);
  private orderService = inject(OrderService);

  constructor() {}

  public async init(): Promise<void> {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as SessionData;

        if (parsed.loggedIn && parsed.buffetId !== environment.buffetId) {
          this.clearSessionAndToken();
          return;
        }

        this.session = parsed;
      } else {
        this.session = { loggedIn: false };
      }
      this._isAuthenticated$.next(this.session.loggedIn);
    } catch (error) {
      this.session = { loggedIn: false };
      this._isAuthenticated$.next(false);
    } finally {
      this._initialized$.next(true);
    }
  }

  private clearSessionAndToken(): void {
    this.orderService.clearOrder();
    this.session = { loggedIn: false };
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem('access_token');
    this._isAuthenticated$.next(false);
  }

  public login(user?: any): void {
    // Clear cart when user logs in to prevent cart items from previous users
    this.orderService.clearOrder();

    this.session = {
      loggedIn: true,
      user,
      timestamp: Date.now(),
      buffetId: environment.buffetId
    };

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.session));
    } catch (e) {
      throw e;
    }

    this._isAuthenticated$.next(true);
  }

  public logout(): void {
    // Clear cart when user logs out
    this.orderService.clearOrder();

    this.session = { loggedIn: false };
    try {
      localStorage.removeItem(this.storageKey);
    } catch (e) {}
    this._isAuthenticated$.next(false);
  }

  public isAuthenticated(): boolean {
    return this.session.loggedIn;
  }

  public getUser(): any {
    return this.session.user;
  }

  public getUserRoles(): string[] {
    return this.session.user?.roles || [];
  }

  public hasRole(role: string): boolean {
    const roles = this.getUserRoles();
    return roles.includes(role);
  }

  public isAdmin(): boolean {
    return this.hasRole('ADMIN') || this.hasRole('BUFFET');
  }

  public isClient(): boolean {
    return this.hasRole('CLIENTE');
  }
}
