import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import {CodeInputComponent, ModelPageComponent, PrimaryButtonComponent} from "../../../../shared/ui/templates/exports";
import { ToastService } from '../../../../core/services/toast.service';
import { ValidationService } from '../../../../core/services/validation.service';

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
  codeControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(6)
  ]);

  email: string = '';

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
    const code = this.codeControl.value || '';

    // Validar código
    const codeValidation = this.validationService.validateCode(code, 6);
    if (!codeValidation.isValid) {
      await this.toastService.warning(codeValidation.message!);
      return;
    }

    // Validar código no backend
    const isValid = await this.validateCode(code);

    if (!isValid) {
      await this.toastService.error('Código inválido ou expirado. Tente novamente.');
      return;
    }

    // Navega para new-password passando email e código
    this.navCtrl.navigateForward('/new-password', {
      queryParams: { email: this.email, code }
    });
  }

  private async validateCode(code: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500));
    // TODO: Substituir por chamada real ao backend
    return true;
  }

  async onResendCode(): Promise<void> {
    if (!this.email) {
      await this.toastService.error('Email não encontrado. Tente novamente.');
      this.navCtrl.navigateBack('/request-password-reset');
      return;
    }

    // TODO: Implementar lógica de reenvio para o email
    await this.toastService.success('Código reenviado para seu email!');
  }

  get isCodeComplete(): boolean {
    return this.codeControl.value?.length === 6;
  }
}
