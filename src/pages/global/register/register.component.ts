import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalController } from "@ionic/angular/standalone";
import { ThemeService } from '../../../shared/config/theme.service';
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
    private modalController: ModalController,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    const theme = this.themeService.getCurrentTheme();

    if (theme) {
      this.primaryColor = theme.primaryColor;
      this.secondaryColor = theme.secondaryColor;
      this.accentColor = theme.accentColor;
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
    this.navCtrl.navigateForward('/login');
  }

}
