import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { ThemeService } from '../shared/config/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(private themeService: ThemeService) {
    this.themeService.loadTheme();
    this.setupStatusBar();
  }

  private async setupStatusBar() {
    const platform = Capacitor.getPlatform();
    if (platform === 'web') return;

    try {
      await StatusBar.setOverlaysWebView({ overlay: false });

      await StatusBar.setStyle({ style: Style.Dark });

      if (platform === 'android') {
        await StatusBar.setBackgroundColor({ color: '#eeeeee' });
      }
    } catch (err) {
      console.warn('StatusBar setup failed:', err);
    }
  }
}
