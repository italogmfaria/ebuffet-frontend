import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import {CodeInputComponent, ModelPageComponent, PrimaryButtonComponent} from "../../../../shared/ui/templates/exports";
import { ToastService } from '../../../../core/services/toast.service';
import { ValidationService } from '../../../../core/services/validation.service';
import { PasswordRecoveryApi } from '../../../../features/auth/api/password-recovery.api';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ModelPageComponent,
        CodeInputComponent,
        ReactiveFormsModule,
        PrimaryButtonComponent
    ],
    host: { class: 'ion-page' }
})
export class ForgotPasswordComponent  implements OnInit {
  codeLength = 4;

  codeControl = new FormControl('', [
    Validators.required,
    Validators.minLength(4),
    Validators.maxLength(4)
  ]);

  email: string = '';
  isLoading = false;

  private passwordRecoveryApi = inject(PasswordRecoveryApi);

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private validationService: ValidationService
  ) { }

  ngOnInit() {
    // Captura o email passado via queryParams
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });
  }

  async onConfirm(): Promise<void> {
    if (this.isLoading) return;

    const code = this.codeControl.value || '';

    // Validar código
    const codeValidation = this.validationService.validateCode(code, this.codeLength);
    if (!codeValidation.isValid) {
      await this.toastService.warning(codeValidation.message!);
      return;
    }

    this.isLoading = true;

    try {
      const { valido } = await firstValueFrom(
        this.passwordRecoveryApi.verifyCode({ email: this.email, codigo: code })
      );

      if (!valido) {
        await this.toastService.error('Código inválido ou expirado. Tente novamente.');
        return;
      }

      // Navega para new-password passando email e código
      this.navCtrl.navigateForward('/new-password', {
        queryParams: { email: this.email, code }
      });
    } catch {
      await this.toastService.error('Erro ao validar código. Tente novamente.');
    } finally {
      this.isLoading = false;
    }
  }

  async onResendCode(): Promise<void> {
    if (!this.email) {
      await this.toastService.error('Email não encontrado. Tente novamente.');
      this.navCtrl.navigateBack('/request-password-reset');
      return;
    }

    try {
      await firstValueFrom(this.passwordRecoveryApi.forgotPassword({ email: this.email }));
      await this.toastService.success('Código reenviado para seu email!');
    } catch {
      await this.toastService.error('Erro ao reenviar código. Tente novamente.');
    }
  }

  get isCodeComplete(): boolean {
    return this.codeControl.value?.length === this.codeLength;
  }
}
