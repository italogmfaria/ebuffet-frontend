import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalController } from "@ionic/angular/standalone";
import { ThemeService } from '../../../shared/services/theme.service';
import { NavController, IonGrid, IonRow, IonCol } from "@ionic/angular/standalone";
import {
  PrimaryButtonComponent,
  OutlineButtonComponent,
  TextInputComponent,
  PasswordInputComponent,
  FormPageComponent
} from '../../../shared/ui/templates/exports';
import { TermsComponent } from './terms/terms.component';
import { ToastService } from '../../../shared/services/toast.service';
import { ValidationService } from '../../../shared/services/validation.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [CommonModule, FormPageComponent, IonGrid, IonRow, IonCol, PrimaryButtonComponent, OutlineButtonComponent, TextInputComponent, PasswordInputComponent, ReactiveFormsModule],
  host: { class: 'ion-page' }
})
export class RegisterComponent implements OnInit {
  primaryColor = '';
  secondaryColor = '';
  accentColor = '';
  registerForm: FormGroup;

  constructor(
    private navCtrl: NavController,
    private modalController: ModalController,
    private themeService: ThemeService,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private validationService: ValidationService
  ) {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
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
    const password = this.registerForm.get('password')?.value;

    // Validar campos obrigatórios
    const requiredValidation = this.validationService.validateRequiredFields({ name, surname, email, password });
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

    // Validar senha
    const passwordValidation = this.validationService.validatePassword(password, 6);
    if (!passwordValidation.isValid) {
      await this.toastService.warning(passwordValidation.message!);
      return;
    }

    // Tentar registrar
    const isRegistered = await this.registerUser(name, surname, email, password);

    if (!isRegistered) {
      await this.toastService.error('Este e-mail já está cadastrado. Tente outro.');
      return;
    }

    await this.toastService.success('Conta criada com sucesso!');
    this.navCtrl.navigateForward('/register-confirmation');
  }

  private async registerUser(name: string, surname: string, email: string, password: string): Promise<boolean> {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));

    // TODO: Substituir por chamada real ao backend
    // Exemplo: return this.authService.register(name, surname, email, password);

    return true;
  }

  goToLogin(event: any) {
    event.target.blur();
    this.navCtrl.navigateForward('/login');
  }

  get isFormValid(): boolean {
    const name = this.registerForm.get('name')?.value;
    const surname = this.registerForm.get('surname')?.value;
    const email = this.registerForm.get('email')?.value;
    const password = this.registerForm.get('password')?.value;
    return !!(name && surname && email && password);
  }
}
