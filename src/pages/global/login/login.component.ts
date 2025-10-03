import { Component, OnInit } from '@angular/core';
import {
    FormPageComponent,
    TextInputComponent,
    PasswordInputComponent,
    PrimaryButtonComponent,
    OutlineButtonComponent
} from '../../../shared/ui/templates/exports';
import {CommonModule} from "@angular/common";
import {NavController, IonGrid, IonRow, IonCol} from "@ionic/angular/standalone";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [CommonModule, FormPageComponent, IonGrid, IonRow, IonCol, PrimaryButtonComponent, OutlineButtonComponent, TextInputComponent, PasswordInputComponent],
    host: { class: 'ion-page' }
})
export class LoginComponent implements OnInit {
    primaryColor = '';
    secondaryColor = '';
    accentColor = '';

    constructor(
        private navCtrl: NavController
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

    createAccount(event: any) {
        event.target.blur();
        this.navCtrl.navigateForward('/register');
    }

    toDoLogin(event: any) {
        event.target.blur();
        this.navCtrl.navigateRoot('/home');
    }

    goToForgotPassword(event: any) {
        event.target.blur();
        this.navCtrl.navigateRoot('/forgot-password');
    }
}
