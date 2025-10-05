import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular/standalone';
import {CodeInputComponent, ModelPageComponent, PrimaryButtonComponent} from "../../../../shared/ui/templates/exports";
import { ToastService } from '../../../../shared/services/toast.service';
import { ValidationService } from '../../../../shared/services/validation.service';

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

  constructor(
    private navCtrl: NavController,
    private toastService: ToastService,
    private validationService: ValidationService
  ) { }

  ngOnInit() {}

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

    await this.toastService.success('Código validado com sucesso!');
    this.navCtrl.navigateForward('/new-password');
  }

  private async validateCode(code: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500));
    // TODO: Substituir por chamada real ao backend
    return true;
  }

  async onResendCode(): Promise<void> {
    await this.toastService.success('Código reenviado para seu e-mail!');
    // TODO: Implementar lógica de reenvio
  }

  get isCodeComplete(): boolean {
    return this.codeControl.value?.length === 6;
  }
}
