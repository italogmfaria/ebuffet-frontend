import { Component, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonContent, NavController} from '@ionic/angular/standalone';
import { environment } from '../../../environments/environment';
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

  constructor(private navCtrl: NavController) {}

  async ngOnInit() {
    try {
      const theme = await fetch(`assets/buffets/${environment.buffetId}/theme.json`).then(r => r.json());

      this.primaryColor = theme.primaryColor || '';
      this.secondaryColor = theme.secondaryColor || '';
      this.accentColor = theme.accentColor || '';
      this.logoUrl = theme.logo || '';

      if (this.primaryColor) {
        document.documentElement.style.setProperty('--ion-color-primary', this.primaryColor);
      }
      if (this.secondaryColor) {
        document.documentElement.style.setProperty('--ion-color-secondary', this.secondaryColor);
      }
    } catch (err) {
      console.warn('Erro ao carregar o theme.json na WelcomeComponent', err);
    }
  }

  goToRegister(event: any) {
    event.target.blur();
    this.navCtrl.navigateRoot('/register');
  }

  goToLogin(event: any) {
    event.target.blur();
    this.navCtrl.navigateRoot('/login');
  }
}
