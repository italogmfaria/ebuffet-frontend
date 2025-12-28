import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface SessionData {
  loggedIn: boolean;
  user?: any;
  timestamp?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly storageKey = 'ebuffet_session_v1';
  private session: SessionData = { loggedIn: false };
  private _isAuthenticated$ = new BehaviorSubject<boolean>(false);
  private _initialized$ = new BehaviorSubject<boolean>(false);

  constructor() {}

  public async init(): Promise<void> {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.session = JSON.parse(stored) as SessionData;
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

  public login(user?: any): void {
    this.session = {
      loggedIn: true,
      user,
      timestamp: Date.now()
    };

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.session));
    } catch (e) {
      throw e;
    }

    this._isAuthenticated$.next(true);
  }

  public logout(): void {
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
}
