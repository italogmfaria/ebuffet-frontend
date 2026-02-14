import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { ModelPageComponent, PasswordInputComponent, PrimaryButtonComponent } from "../../../../../shared/ui/templates/exports";
import { ToastService } from '../../../../../core/services/toast.service';
import { ValidationService } from '../../../../../core/services/validation.service';
import { PasswordRecoveryApi } from '../../../../../features/auth/api/password-recovery.api';
import { firstValueFrom } from 'rxjs';

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
  isLoading = false;

  private email = '';
  private code = '';
  private route = inject(ActivatedRoute);
  private passwordRecoveryApi = inject(PasswordRecoveryApi);

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

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      this.code = params['code'] || '';
    });
  }

  async onConfirm(): Promise<void> {
    if (this.isLoading) return;

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

    this.isLoading = true;

    try {
      await firstValueFrom(
        this.passwordRecoveryApi.resetPassword({
          email: this.email,
          codigo: this.code,
          novaSenha: password
        })
      );
      await this.toastService.success('Senha redefinida com sucesso!');
      this.navCtrl.navigateForward('/login');
    } catch {
      await this.toastService.error('Erro ao redefinir senha. Tente novamente.');
    } finally {
      this.isLoading = false;
    }
  }

  get isFormValid(): boolean {
    const password = this.passwordForm.get('password')?.value;
    const confirmPassword = this.passwordForm.get('confirmPassword')?.value;
    return !!(password && confirmPassword) && !this.isLoading;
  }
}
