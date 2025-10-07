import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { NavController } from '@ionic/angular/standalone';
import { SessionService } from '../services/session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private sessionService: SessionService,
    private navCtrl: NavController
  ) {}

  canActivate(): boolean {
    console.log('[AuthGuard] Checking authentication...');
    const isAuthenticated = this.sessionService.isAuthenticated();
    console.log('[AuthGuard] Is authenticated?', isAuthenticated);

    if (!isAuthenticated) {
      console.log('[AuthGuard] Not authenticated, redirecting to welcome');
      this.navCtrl.navigateRoot('/welcome', { animated: true });
      return false;
    }

    console.log('[AuthGuard] Authentication verified, proceeding...');
    return true;
  }
}
