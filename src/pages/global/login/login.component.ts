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
import { ThemeService } from '../../../shared/config/theme.service';

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
        private navCtrl: NavController,
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

    createAccount(event: any) {
        event.target.blur();
        this.navCtrl.navigateForward('/register');
    }

    toDoLogin(event: any) {
        event.target.blur();
        this.navCtrl.navigateForward('/home');
    }

    goToForgotPassword(event: any) {
        event.target.blur();
        this.navCtrl.navigateForward('/forgot-password');
    }
}
