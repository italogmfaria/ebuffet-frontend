import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular/standalone';
import { ModelPageComponent, PasswordInputComponent, PrimaryButtonComponent } from "../../../../../shared/ui/templates/exports";
import { ToastService } from '../../../../../core/services/toast.service';
import { ValidationService } from '../../../../../core/services/validation.service';

@Component({
    selector: 'app-new-password',
    templateUrl: './new-password.component.html',
    styleUrls: ['./new-password.component.scss'],
    standalone: true,
    imports: [
        ModelPageComponent,
        PasswordInputComponent,
        PrimaryButtonComponent,
        ReactiveFormsModule
    ],
    host: { class: 'ion-page' }
})
export class NewPasswordComponent implements OnInit {
  passwordForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private toastService: ToastService,
    private validationService: ValidationService
  ) {
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  ngOnInit() {}

  async onConfirm(): Promise<void> {
    const password = this.passwordForm.get('password')?.value;
    const confirmPassword = this.passwordForm.get('confirmPassword')?.value;

    // Validar campos obrigatórios
    const requiredValidation = this.validationService.validateRequiredFields({ password, confirmPassword });
    if (!requiredValidation.isValid) {
      await this.toastService.warning(requiredValidation.message!);
      return;
    }

    // Validar senha
    const passwordValidation = this.validationService.validatePassword(password, 6);
    if (!passwordValidation.isValid) {
      await this.toastService.warning(passwordValidation.message!);
      return;
    }

    // Validar se senhas coincidem
    const matchValidation = this.validationService.validatePasswordMatch(password, confirmPassword);
    if (!matchValidation.isValid) {
      await this.toastService.error(matchValidation.message!);
      return;
    }

    // Se passou por todas as validações
    // TODO: Enviar para o backend

    this.navCtrl.navigateForward('/login');
  }

  get isFormValid(): boolean {
    const password = this.passwordForm.get('password')?.value;
    const confirmPassword = this.passwordForm.get('confirmPassword')?.value;
    return !!(password && confirmPassword);
  }
}
