import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular/standalone';
import {ModelPageComponent} from "../../../../shared/ui/templates/pages/model-page/model-page.component";
import {CodeInputComponent} from "../../../../shared/ui/templates/inputs/code-input/code-input.component";
import {PrimaryButtonComponent} from "../../../../shared/ui/templates/buttons/pills/primary-button/primary-button.component";

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    standalone: true,
    imports: [
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
    private toastController: ToastController
  ) { }

  ngOnInit() {}

  async onConfirm(): Promise<void> {
    const code = this.codeControl.value;

    if (!code) {
      await this.showToast('Por favor, insira o código de recuperação.', 'warning');
      return;
    }

    if (code.length < 6) {
      await this.showToast('O código deve ter 6 dígitos.', 'warning');
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      await this.showToast('O código deve conter apenas números.', 'danger');
      return;
    }

    if (this.codeControl.valid) {
      console.log('Código confirmado:', code);

      // Simulação de validação do backend (remova isso quando integrar com o backend real)
      const isValid = await this.validateCode(code);

      if (!isValid) {
        await this.showToast('Código inválido ou expirado. Tente novamente.', 'danger');
        return;
      }

      await this.showToast('Código validado com sucesso!', 'success');
      this.navCtrl.navigateForward('/new-password');
    }
  }

  private async validateCode(code: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Substituir por chamada real ao backend

    return true;
  }

  async onResendCode(): Promise<void> {
    console.log('Reenviando código...');
    await this.showToast('Código reenviado para seu e-mail!', 'success');
  }

  async showToast(message: string, color: 'success' | 'danger' | 'warning' = 'danger'): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: color,
      cssClass: 'custom-toast'
    });
    await toast.present();
  }

  get isCodeComplete(): boolean {
    return this.codeControl.value?.length === 6;
  }
}
