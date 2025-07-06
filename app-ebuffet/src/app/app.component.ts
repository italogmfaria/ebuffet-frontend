import {Component, OnInit} from '@angular/core';
import {IonApp, IonContent, IonHeader, IonRouterOutlet, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import {ThemeService} from "./core/services/themes/theme.service";
import {environment} from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet, IonHeader, IonToolbar, IonTitle, IonContent],
})
export class AppComponent implements OnInit{

  logoUrl: string = '';
  backgroundImage: string = '';

  constructor(private themeService: ThemeService) {}

  async ngOnInit() {
    await this.themeService.loadTheme(environment.buffetId);
    const theme = this.themeService.getTheme();
    this.logoUrl = theme.logo;
    this.backgroundImage = theme.backgroundImage || '';
  }
}
