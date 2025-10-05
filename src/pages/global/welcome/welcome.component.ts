import { Component, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonContent, NavController} from '@ionic/angular/standalone';
import { ThemeService } from '../../../shared/services/theme.service';
import { PrimaryButtonComponent, OutlineButtonComponent } from '../../../shared/ui/templates/exports';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  standalone: true,
  imports: [CommonModule, PrimaryButtonComponent, OutlineButtonComponent, IonContent],
  host: { class: 'ion-page' }
})
export class WelcomeComponent implements OnInit {
  primaryColor = '';
  secondaryColor = '';
  accentColor = '';
  logoUrl = '';

  constructor(private navCtrl: NavController, private themeService: ThemeService) {}

  ngOnInit() {
    const theme = this.themeService.getCurrentTheme();

    if (theme) {
      this.primaryColor = theme.primaryColor;
      this.secondaryColor = theme.secondaryColor;
      this.accentColor = theme.accentColor;
      this.logoUrl = theme.logo;
    }
  }

  goToRegister(event: any) {
    event.target.blur();
    this.navCtrl.navigateForward('/register');
  }

  goToLogin(event: any) {
    event.target.blur();
    this.navCtrl.navigateForward('/login');
  }
}
