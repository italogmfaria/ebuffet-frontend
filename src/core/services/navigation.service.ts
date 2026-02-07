import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular/standalone';
import { SessionService } from './session.service';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  constructor(
    private navCtrl: NavController,
    private sessionService: SessionService
  ) {}

  /**
   * Navega de volta para a home do usuário baseado em suas roles
   */
  async navigateToHome(): Promise<void> {
    const user = this.sessionService.getUser();
    const roles = user?.roles || '';

    if (roles === 'BUFFET' || roles === 'ADMIN') {
      await this.navCtrl.navigateRoot('/admin/dashboard', { animated: true });
    } else {
      await this.navCtrl.navigateRoot('/client/home', { animated: true });
    }
  }
}
