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
import { ThemeService } from '../../../core/services/theme.service';
import { ToastService } from '../../../core/services/toast.service';
import { ValidationService } from '../../../core/services/validation.service';
import { SessionService } from '../../../core/services/session.service';
import {AuthService} from "../../../features/auth/services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, FormPageComponent, IonGrid, IonRow, IonCol, PrimaryButtonComponent, OutlineButtonComponent, TextInputComponent, PasswordInputComponent, ReactiveFormsModule],
  host: { class: 'ion-page' }
})
export class LoginComponent implements OnInit {
  primaryColor$ = this.themeService.primaryColor$;
  secondaryColor$ = this.themeService.secondaryColor$;
  accentColor$ = this.themeService.accentColor$;
  loginForm: FormGroup;

  constructor(
    private navCtrl: NavController,
    private themeService: ThemeService,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private validationService: ValidationService,
    private sessionService: SessionService,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
  }

  createAccount(event: any) {
    event.target.blur();
    this.navCtrl.navigateForward('/register');
  }

  async toDoLogin(event: any): Promise<void> {
    event.target.blur();

    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    const requiredValidation = this.validationService.validateRequiredFields({ email, password });
    if (!requiredValidation.isValid) {
      await this.toastService.warning(requiredValidation.message!);
      return;
    }

    const emailValidation = this.validationService.validateEmail(email);
    if (!emailValidation.isValid) {
      await this.toastService.warning(emailValidation.message!);
      return;
    }

    const passwordValidation = this.validationService.validatePassword(password, 6);
    if (!passwordValidation.isValid) {
      await this.toastService.warning(passwordValidation.message!);
      return;
    }

    const loginResult = await this.authService.login(email, password, this.sessionService);

    if (!loginResult.success) {
      await this.toastService.error('E-mail ou senha incorretos. Tente novamente.');
      return;
    }

    try {
      if (loginResult.roles?.includes('BUFFET') || loginResult.roles?.includes('ADMIN')) {
        await this.navCtrl.navigateRoot('/admin/dashboard', { animated: true });
      } else {
        await this.navCtrl.navigateRoot('/client/home', { animated: true });
      }
    } catch (error) {
      await this.toastService.error('Erro ao redirecionar. Tente novamente.');
    }
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
