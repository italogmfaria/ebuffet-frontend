import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { NavController } from '@ionic/angular/standalone';
import { SessionService } from '../services/session.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private sessionService: SessionService,
    private navCtrl: NavController
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['roles'] as string[];

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const user = this.sessionService.getUser();
    const userRoles = user?.roles || [];

    const hasRole = requiredRoles.some(role => userRoles.includes(role));

    if (!hasRole) {
      // Redireciona para a área correta do usuário
      if (userRoles.includes('BUFFET') || userRoles.includes('ADMIN')) {
        this.navCtrl.navigateRoot('/admin/dashboard', { animated: true });
      } else {
        this.navCtrl.navigateRoot('/client/home', { animated: true });
      }
      return false;
    }

    return true;
  }
}

