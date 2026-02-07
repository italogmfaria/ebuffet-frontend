import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular/standalone';
import { ModelPageComponent, PrimaryButtonComponent, TextInputComponent } from '../../../../shared/ui/templates/exports';
import { ToastService } from '../../../../core/services/toast.service';
import { ValidationService } from '../../../../core/services/validation.service';

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
      // Enviar solicitação ao backend
      const success = await this.requestPasswordReset(email);

      if (success) {
        await this.toastService.success('Código de verificação enviado para seu email!');
        // Navega para a tela de inserir código, passando o email
        this.navCtrl.navigateForward('/forgot-password', {
          queryParams: { email }
        });
      } else {
        await this.toastService.error('Erro ao enviar código. Verifique o email e tente novamente.');
      }
    } catch (error) {
      await this.toastService.error('Erro ao processar solicitação. Tente novamente.');
    } finally {
      this.isLoading = false;
    }
  }

  private async requestPasswordReset(email: string): Promise<boolean> {
    // Simula chamada ao backend
    await new Promise(resolve => setTimeout(resolve, 1000));

    // TODO: Implementar chamada real ao backend
    // Exemplo:
    // return this.authService.requestPasswordReset(email).toPromise();

    return true;
  }

  onBackClick(): void {
    this.navCtrl.navigateBack('/login');
  }
}
