import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { NavController } from '@ionic/angular/standalone';
import { SessionService } from '../services/session.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private sessionService: SessionService,
    private navCtrl: NavController
  ) {}

  canActivate(): boolean {
    const isLogged = this.sessionService.isAuthenticated();
    const token = localStorage.getItem('access_token');

    if (!isLogged || !token) {
      this.sessionService.logout();
      this.navCtrl.navigateRoot('/welcome', { animated: true });
      return false;
    }

    if (!isJwtValid(token)) {
      this.sessionService.logout();
      this.navCtrl.navigateRoot('/welcome', { animated: true });
      return false;
    }

    return true;
  }
}

function isJwtValid(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload?.exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch {
    return false;
  }
}
