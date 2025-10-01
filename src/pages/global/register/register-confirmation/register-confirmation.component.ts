import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {ModelPageComponent} from "../../../../shared/ui/templates/pages/model-page/model-page.component";
import { PrimaryButtonComponent } from "../../../../shared/ui/templates/exports";
import { Router } from '@angular/router';
import {NavController} from "@ionic/angular/standalone";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-register-confirmation',
  templateUrl: './register-confirmation.component.html',
  styleUrls: ['./register-confirmation.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ModelPageComponent,
    PrimaryButtonComponent
  ]
})
export class RegisterConfirmationComponent  implements OnInit {
  primaryColor = '';
  secondaryColor = '';
  accentColor = '';

  constructor(private navCtrl: NavController) { }

  async ngOnInit() {
    try {
      const theme = await fetch(`assets/buffets/${environment.buffetId}/theme.json`).then(r => r.json());

      this.primaryColor = theme.primaryColor || '';
      this.secondaryColor = theme.secondaryColor || '';
      this.accentColor = theme.accentColor || '';

      if (this.primaryColor) {
        document.documentElement.style.setProperty('--ion-color-primary', this.primaryColor);
      }
      if (this.secondaryColor) {
        document.documentElement.style.setProperty('--ion-color-secondary', this.secondaryColor);
      }
      if (this.accentColor) {
        document.documentElement.style.setProperty('--ion-color-tertiary', this.accentColor);
      }
    } catch (err) {
      console.warn('Erro ao carregar o theme.json', err);
    }
  }

  goToLogin(event: any) {
    event.target.blur();
    this.navCtrl.navigateRoot('/login');
  }

}
