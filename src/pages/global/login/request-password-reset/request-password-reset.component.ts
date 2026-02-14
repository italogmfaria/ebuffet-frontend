import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular/standalone';
import { ModelPageComponent, PrimaryButtonComponent, TextInputComponent } from '../../../../shared/ui/templates/exports';
import { ToastService } from '../../../../core/services/toast.service';
import { ValidationService } from '../../../../core/services/validation.service';
import { PasswordRecoveryApi } from '../../../../features/auth/api/password-recovery.api';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-request-password-reset',
  templateUrl: './request-password-reset.component.html',
  styleUrls: ['./request-password-reset.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ModelPageComponent,
    TextInputComponent,
    ReactiveFormsModule,
    PrimaryButtonComponent
  ],
  host: { class: 'ion-page' }
})
export class RequestPasswordResetComponent implements OnInit {
  emailControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);

  isLoading = false;

  private passwordRecoveryApi = inject(PasswordRecoveryApi);

  constructor(
    private navCtrl: NavController,
    private toastService: ToastService,
    private validationService: ValidationService
  ) { }

  ngOnInit() {}

  async onSubmit(): Promise<void> {
    if (this.isLoading) return;

    const email = this.emailControl.value || '';

    // Validar email vazio
    if (!email.trim()) {
      await this.toastService.warning('Por favor, digite seu e-mail.');
      return;
    }

    // Validar formato do email
    const emailValidation = this.validationService.validateEmail(email);
    if (!emailValidation.isValid) {
      await this.toastService.warning(emailValidation.message!);
      return;
    }

    this.isLoading = true;

    try {
      await firstValueFrom(this.passwordRecoveryApi.forgotPassword({ email }));
      await this.toastService.success('Código de verificação enviado para seu email!');
      this.navCtrl.navigateForward('/forgot-password', {
        queryParams: { email }
      });
    } catch {
      await this.toastService.error('Erro ao enviar código. Verifique o email e tente novamente.');
    } finally {
      this.isLoading = false;
    }
  }

  onBackClick(): void {
    this.navCtrl.navigateBack('/login');
  }
}
