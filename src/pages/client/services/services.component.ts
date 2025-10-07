import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormPageComponent, ClientNavbarComponent } from '../../../shared/ui/templates/exports';
import { IonGrid, NavController } from '@ionic/angular/standalone';
import { ThemeService } from '../../../shared/services/theme.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  standalone: true,
  imports: [CommonModule, FormPageComponent, IonGrid, ClientNavbarComponent],
  host: { class: 'ion-page' }
})
export class ServicesComponent implements OnInit {
  primaryColor = '';
  secondaryColor = '';
  accentColor = '';
  cartItemCount = 1;

  constructor(
    private themeService: ThemeService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    const theme = this.themeService.getCurrentTheme();
    if (theme) {
      this.primaryColor = theme.primaryColor;
      this.secondaryColor = theme.secondaryColor;
      this.accentColor = theme.accentColor;
    }
  }

  onBackClick() {
    this.navCtrl.navigateBack('/client/home');
  }

  onNotificationClick() {
    this.navCtrl.navigateForward('/notifications');
  }
}
