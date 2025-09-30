import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormPageComponent } from '../../../shared/ui/templates/pages/form-page/form-page.component';
import {IonicModule} from "@ionic/angular";
import { environment } from '../../../environments/environment';
import {NavController} from "@ionic/angular/standalone";
import {
  PrimaryButtonComponent,
  OutlineButtonComponent,
  TextInputComponent,
  PasswordInputComponent
} from '../../../shared/ui/templates/exports';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [CommonModule, FormPageComponent, IonicModule, PrimaryButtonComponent, OutlineButtonComponent, TextInputComponent, PasswordInputComponent]
})
export class RegisterComponent implements OnInit {
  showPassword: boolean = false;
  primaryColor = '';
  secondaryColor = '';
  accentColor = '';

  constructor(private navCtrl: NavController) {}

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

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  goToTerms(event: any) {
    event.target.blur();
    this.navCtrl.navigateRoot('/terms');
  }

  createAccount(event: any) {
    event.target.blur();
    this.navCtrl.navigateRoot('/register-confirmation');
  }

  goToLogin(event: any) {
    event.target.blur();
    this.navCtrl.navigateRoot('/login');
  }

}
