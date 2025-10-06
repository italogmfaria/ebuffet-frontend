import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
    FormPageComponent,
    TextInputComponent,
    PasswordInputComponent,
    PrimaryButtonComponent,
    OutlineButtonComponent
} from '../../../shared/ui/templates/exports';
import {CommonModule} from "@angular/common";
import {NavController, IonGrid, IonRow, IonCol} from "@ionic/angular/standalone";
import { ThemeService } from '../../../shared/services/theme.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ValidationService } from '../../../shared/services/validation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [CommonModule, FormPageComponent, IonGrid, IonRow, IonCol, PrimaryButtonComponent, OutlineButtonComponent, TextInputComponent, PasswordInputComponent, ReactiveFormsModule],
    host: { class: 'ion-page' }
})
export class LoginComponent implements OnInit {
    primaryColor = '';
    secondaryColor = '';
    accentColor = '';
    loginForm: FormGroup;

    constructor(
        private navCtrl: NavController,
        private themeService: ThemeService,
        private formBuilder: FormBuilder,
        private toastService: ToastService,
        private validationService: ValidationService
    ) {
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

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

    async toDoLogin(event: any): Promise<void> {
        event.target.blur();

        const email = this.loginForm.get('email')?.value;
        const password = this.loginForm.get('password')?.value;

        // Validar campos obrigatórios
        const requiredValidation = this.validationService.validateRequiredFields({ email, password });
        if (!requiredValidation.isValid) {
            await this.toastService.warning(requiredValidation.message!);
            return;
        }

        // Validar email
        const emailValidation = this.validationService.validateEmail(email);
        if (!emailValidation.isValid) {
            await this.toastService.warning(emailValidation.message!);
            return;
        }

        // Validar senha
        const passwordValidation = this.validationService.validatePassword(password, 6);
        if (!passwordValidation.isValid) {
            await this.toastService.warning(passwordValidation.message!);
            return;
        }

        // Tentar autenticar
        const isAuthenticated = await this.authenticateUser(email, password);

        if (!isAuthenticated) {
            await this.toastService.error('E-mail ou senha incorretos. Tente novamente.');
            return;
        }

        this.navCtrl.navigateForward('/client/home');
    }

    private async authenticateUser(email: string, password: string): Promise<boolean> {
        await new Promise(resolve => setTimeout(resolve, 500));
        // TODO: Substituir por chamada real ao backend
        return true;
    }

    goToForgotPassword(event: any) {
        event.target.blur();
        this.navCtrl.navigateForward('/forgot-password');
    }

    get isFormValid(): boolean {
        const email = this.loginForm.get('email')?.value;
        const password = this.loginForm.get('password')?.value;
        return !!(email && password);
    }
}
