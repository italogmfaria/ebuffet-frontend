import { Component, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import { NavController } from '@ionic/angular/standalone';
import { environment } from '../../../environments/environment';
import {IonicModule} from "@ionic/angular";
import { PrimaryButtonComponent, OutlineButtonComponent } from '../../../shared/ui/templates/exports';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, PrimaryButtonComponent, OutlineButtonComponent]
})
export class WelcomeComponent implements OnInit {
  primaryColor = '';
  secondaryColor = '';
  accentColor = '';
  logoUrl = '';

  constructor(private navCtrl: NavController) {}

  async ngOnInit() {
    const theme = await fetch(`assets/buffets/${environment.buffetId}/theme.json`).then(r => r.json());

    this.primaryColor = theme.primaryColor;
    this.secondaryColor = theme.secondaryColor;
    this.accentColor = theme.accentColor;
    this.logoUrl = theme.logo;

    document.documentElement.style.setProperty('--ion-color-primary', theme.primaryColor);
    document.documentElement.style.setProperty('--ion-color-secondary', theme.secondaryColor);
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
