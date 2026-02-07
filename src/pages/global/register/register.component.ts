import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalController } from "@ionic/angular/standalone";
import { ThemeService } from '../../../core/services/theme.service';
import { NavController, IonGrid, IonRow, IonCol } from "@ionic/angular/standalone";
import {
  PrimaryButtonComponent,
  OutlineButtonComponent,
  TextInputComponent,
  PasswordInputComponent,
  FormPageComponent
} from '../../../shared/ui/templates/exports';
import { TermsComponent } from './terms/terms.component';
import { ToastService } from '../../../core/services/toast.service';
import { ValidationService } from '../../../core/services/validation.service';
import {AuthApi} from "../../../features/auth/api/auth.api";
import {firstValueFrom} from "rxjs";
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [CommonModule, FormPageComponent, IonGrid, IonRow, IonCol, PrimaryButtonComponent, OutlineButtonComponent, TextInputComponent, PasswordInputComponent, ReactiveFormsModule],
  host: { class: 'ion-page' }
})
export class RegisterComponent implements OnInit {
  primaryColor$ = this.themeService.primaryColor$;
  secondaryColor$ = this.themeService.secondaryColor$;
  accentColor$ = this.themeService.accentColor$;
  registerForm: FormGroup;

  constructor(
    private navCtrl: NavController,
    private modalController: ModalController,
    private themeService: ThemeService,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private validationService: ValidationService,
    private authApi: AuthApi
  ) {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(15)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    // No need to load theme colors manually anymore
  }

  async goToTerms(event: any) {
    event.target.blur();
    const modal = await this.modalController.create({
      component: TermsComponent
    });
    return await modal.present();
  }

  async createAccount(event: any): Promise<void> {
    event.target.blur();

    const name = this.registerForm.get('name')?.value;
    const surname = this.registerForm.get('surname')?.value;
    const email = this.registerForm.get('email')?.value;
    const phone = this.registerForm.get('phone')?.value;
    const password = this.registerForm.get('password')?.value;

    // Validar campos obrigatórios
    const requiredValidation = this.validationService.validateRequiredFields({ name, surname, email, phone, password });
    if (!requiredValidation.isValid) {
      await this.toastService.warning(requiredValidation.message!);
      return;
    }

    // Validar nome
    const nameValidation = this.validationService.validateName(name, 'nome');
    if (!nameValidation.isValid) {
      await this.toastService.warning(nameValidation.message!);
      return;
    }

    // Validar sobrenome
    const surnameValidation = this.validationService.validateName(surname, 'sobrenome');
    if (!surnameValidation.isValid) {
      await this.toastService.warning(surnameValidation.message!);
      return;
    }

    // Validar email
    const emailValidation = this.validationService.validateEmail(email);
    if (!emailValidation.isValid) {
      await this.toastService.warning(emailValidation.message!);
      return;
    }

    // Validar telefone
    const phoneValidation = this.validationService.validatePhone(phone);
    if (!phoneValidation.isValid) {
      await this.toastService.warning(phoneValidation.message!);
      return;
    }

    // Validar senha
    const passwordValidation = this.validationService.validatePassword(password, 6);
    if (!passwordValidation.isValid) {
      await this.toastService.warning(passwordValidation.message!);
      return;
    }

    // Tentar registrar
    const isRegistered = await this.registerUser(name, surname, email, phone, password);

    if (!isRegistered) {
      await this.toastService.error('Este e-mail já está cadastrado. Tente outro.');
      return;
    }

    this.navCtrl.navigateForward('/register-confirmation');
  }

  private async registerUser(name: string, surname: string, email: string, phone: string, password: string): Promise<boolean> {
    const payload = {
      nome: `${name.trim()} ${surname.trim()}`.trim(),
      email,
      telefone: phone,
      senha: password,
      buffetId: environment.buffetId
    };

    try {
      const user = await firstValueFrom(this.authApi.register(payload));
      return !!user?.id;
    } catch (err: any) {
      const status = err?.status;
      const backendMsg =
        err?.error?.message ||
        err?.error?.detail ||
        (Array.isArray(err?.error?.fieldErrors) ? err.error.fieldErrors.map((e: any) => `${e.field}: ${e.message}`).join('\n') : null);

      if (status === 400 || status === 422) {
        await this.toastService.warning(backendMsg || 'Dados inválidos. Verifique os campos e tente novamente.');
      } else if (status === 409) {
        await this.toastService.error('Este e-mail já está cadastrado. Tente outro.');
      } else {
        await this.toastService.error(backendMsg || 'Não foi possível criar sua conta agora.');
      }
      return false;
    }
  }

  goToLogin(event: any) {
    event.target.blur();
    this.navCtrl.navigateForward('/login');
  }

  /**
   * Formata o telefone enquanto o usuário digita
   * Aceita formatos: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
   */
  formatPhone(value: string): string {
    // Remove tudo que não é dígito
    value = value.replace(/\D/g, '');

    // Limita a 11 dígitos
    value = value.substring(0, 11);

    // Aplica a formatação
    if (value.length <= 2) {
      return value.replace(/(\d{0,2})/, '($1');
    } else if (value.length <= 6) {
      return value.replace(/(\d{2})(\d{0,4})/, '($1) $2');
    } else if (value.length <= 10) {
      return value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
      // Celular com 11 dígitos: (XX) XXXXX-XXXX
      return value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  }

  onPhoneInput(value: string) {
    const formatted = this.formatPhone(value);
    this.registerForm.patchValue({ phone: formatted }, { emitEvent: false });
  }

  onBackClick() {
    this.navCtrl.navigateBack('/welcome');
  }

  get isFormValid(): boolean {
    const name = this.registerForm.get('name')?.value;
    const surname = this.registerForm.get('surname')?.value;
    const email = this.registerForm.get('email')?.value;
    const phone = this.registerForm.get('phone')?.value;
    const password = this.registerForm.get('password')?.value;
    return !!(name && surname && email && phone && password);
  }
}
