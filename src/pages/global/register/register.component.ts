import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalController } from "@ionic/angular/standalone";
import { environment } from '../../../environments/environment';
import { NavController, IonGrid, IonRow, IonCol } from "@ionic/angular/standalone";
import {
  PrimaryButtonComponent,
  OutlineButtonComponent,
  TextInputComponent,
  PasswordInputComponent,
  FormPageComponent
} from '../../../shared/ui/templates/exports';
import { TermsComponent } from './terms/terms.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [CommonModule, FormPageComponent, IonGrid, IonRow, IonCol, PrimaryButtonComponent, OutlineButtonComponent, TextInputComponent, PasswordInputComponent],
  host: { class: 'ion-page' }
})
export class RegisterComponent implements OnInit {
  primaryColor = '';
  secondaryColor = '';
  accentColor = '';

  constructor(
    private navCtrl: NavController,
    private modalController: ModalController
  ) {}

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

  async goToTerms(event: any) {
    event.target.blur();
    const modal = await this.modalController.create({
      component: TermsComponent
    });
    return await modal.present();
  }

  createAccount(event: any) {
    event.target.blur();
    this.navCtrl.navigateForward('/register-confirmation');
  }

  goToLogin(event: any) {
    event.target.blur();
    this.navCtrl.navigateRoot('/login');
  }

}
