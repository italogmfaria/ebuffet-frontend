import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular/standalone';
import { ModelPageComponent } from "../../../../../shared/ui/templates/pages/model-page/model-page.component";
import { PasswordInputComponent } from "../../../../../shared/ui/templates/inputs/password-input/password-input.component";
import { PrimaryButtonComponent } from "../../../../../shared/ui/templates/buttons/pills/primary-button/primary-button.component";

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
    private toastController: ToastController
  ) {
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit() {}

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  async onConfirm(): Promise<void> {
    const password = this.passwordForm.get('password')?.value;
    const confirmPassword = this.passwordForm.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      await this.showToast('Por favor, preencha todos os campos.', 'warning');
      return;
    }

    if (password.length < 6) {
      await this.showToast('A senha deve ter pelo menos 6 caracteres.', 'warning');
      return;
    }

    if (password !== confirmPassword) {
      await this.showToast('As senhas não coincidem. Por favor, verifique e tente novamente.', 'danger');
      return;
    }

    console.log('Nova senha definida:', password);

    this.showToast('Senha alterada com sucesso!', 'success');
    this.navCtrl.navigateForward('/login');
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

  get isFormValid(): boolean {
    const password = this.passwordForm.get('password')?.value;
    const confirmPassword = this.passwordForm.get('confirmPassword')?.value;
    return !!(password && confirmPassword);
  }
}
