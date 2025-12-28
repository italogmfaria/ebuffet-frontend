import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, NavController } from '@ionic/angular/standalone';
import { SessionService } from '../core/services/session.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private isInitialized = false;

  constructor(
    private sessionService: SessionService,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    if (this.isInitialized) {
      return;
    }

    await this.navCtrl.navigateRoot('/index', { animated: true });

    try {
      const [_] = await Promise.all([
        new Promise(resolve => setTimeout(resolve, 3000)),
        this.sessionService.init()
      ]);

      const isAuthenticated = this.sessionService.isAuthenticated();
      const targetRoute = isAuthenticated ? '/client/home' : '/welcome';

      await this.navCtrl.navigateRoot(targetRoute, {
        animated: true,
        skipLocationChange: false
      });
    } catch (e) {
      await this.navCtrl.navigateRoot('/welcome', { animated: true });
    } finally {
      this.isInitialized = true;
    }
  }
}
