import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular/standalone';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Subscription } from 'rxjs';
import { ModelPageComponent } from "../../../../shared/ui/templates/pages/model-page/model-page.component";
import { TextInputComponent } from "../../../../shared/ui/templates/inputs/text-input/text-input.component";
import { PrimaryButtonComponent } from "../../../../shared/ui/templates/buttons/pills/primary-button/primary-button.component";
import { OutlineButtonComponent } from "../../../../shared/ui/templates/buttons/pills/outline-button/outline-button.component";
import { ImageCircleComponent } from "../../../../shared/ui/templates/buttons/circles/image-circle/image-circle.component";
import { ProfilePlaceholderComponent } from "../../../../shared/ui/templates/placeholders/profile-placeholder/profile-placeholder.component";
import { ThemeService } from '../../../../core/services/theme.service';
import { SessionService } from '../../../../core/services/session.service';
import { ValidationService } from '../../../../core/services/validation.service';
import { ToastService } from '../../../../core/services/toast.service';
import { UserApiService } from '../../../../features/user/api/user-api.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModelPageComponent,
    TextInputComponent,
    PrimaryButtonComponent,
    OutlineButtonComponent,
    ImageCircleComponent,
    ProfilePlaceholderComponent
  ]
})
export class ProfileEditComponent implements OnInit, OnDestroy {
  primaryColor$ = this.themeService.primaryColor$;
  secondaryColor$ = this.themeService.secondaryColor$;

  userName: string = '';
  userEmail: string = '';
  userPhone: string = '';
  userProfileImage: string | null = null;
  selectedPhotoFile: File | null = null;

  private subs = new Subscription();

  constructor(
    private themeService: ThemeService,
    private navCtrl: NavController,
    private sessionService: SessionService,
    private validationService: ValidationService,
    private toastService: ToastService,
    private userApi: UserApiService
  ) {}

  ngOnInit() {
    const user = this.sessionService.getUser();
    if (user) {
      this.userName = user.nome || '';
      this.userEmail = user.email || '';
      // Formatar telefone ao carregar
      const rawPhone = user.telefone || '';
      this.userPhone = this.formatPhoneStatic(rawPhone);
      // Carregar foto do perfil se existir
      this.userProfileImage = user.fotoUrl || null;
    }
  }

  /**
   * Formata o telefone (versão estática para uso no ngOnInit)
   */
  private formatPhoneStatic(value: string): string {
    if (!value) return '';

    // Remove tudo que não é dígito
    value = value.replace(/\D/g, '');

    // Limita a 11 dígitos
    value = value.substring(0, 11);

    // Aplica a formatação
    if (value.length <= 2) {
      return value.replace(/(\d{0,2})/, '($1');
    } else if (value.length <= 6) {
      return value.replace(/(\d{2})(\d{0,4})/, '($1) $2');
    } else if (value.length <= 10) {
      return value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
      // Celular com 11 dígitos: (XX) XXXXX-XXXX
      return value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  }

  onBackClick() {
    this.navCtrl.navigateBack('/client/profile');
  }

  async onImageClick() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
        promptLabelHeader: 'Selecione uma foto',
        promptLabelPhoto: 'Galeria',
        promptLabelPicture: 'Câmera',
        promptLabelCancel: 'Cancelar'
      });

      if (image.dataUrl) {
        this.userProfileImage = image.dataUrl;
        // Converter base64 para File
        this.selectedPhotoFile = this.dataUrlToFile(image.dataUrl, 'profile-photo.jpg');
        console.log('Imagem selecionada');
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
    }
  }

  /**
   * Converte dataUrl (base64) para File
   */
  private dataUrlToFile(dataUrl: string, filename: string): File {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  onCancel() {
    this.navCtrl.navigateBack('/client/profile');
  }

  /**
   * Formata o telefone enquanto o usuário digita
   * Aceita formatos: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
   */
  formatPhone(value: string) {
    if (!value) {
      this.userPhone = '';
      return;
    }

    // Remove tudo que não é dígito
    value = value.replace(/\D/g, '');

    // Limita a 11 dígitos
    value = value.substring(0, 11);

    // Aplica a formatação
    if (value.length <= 2) {
      value = value.replace(/(\d{0,2})/, '($1');
    } else if (value.length <= 6) {
      value = value.replace(/(\d{2})(\d{0,4})/, '($1) $2');
    } else if (value.length <= 10) {
      value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
      // Celular com 11 dígitos: (XX) XXXXX-XXXX
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    this.userPhone = value;
  }

  async onSave() {
    // Validar campos obrigatórios
    const requiredValidation = this.validationService.validateRequiredFields({
      nome: this.userName,
      email: this.userEmail,
      telefone: this.userPhone
    });
    if (!requiredValidation.isValid) {
      await this.toastService.warning(requiredValidation.message!);
      return;
    }

    // Validar nome
    const nameValidation = this.validationService.validateName(this.userName, 'nome');
    if (!nameValidation.isValid) {
      await this.toastService.warning(nameValidation.message!);
      return;
    }

    // Validar email
    const emailValidation = this.validationService.validateEmail(this.userEmail);
    if (!emailValidation.isValid) {
      await this.toastService.warning(emailValidation.message!);
      return;
    }

    // Validar telefone
    const phoneValidation = this.validationService.validatePhone(this.userPhone);
    if (!phoneValidation.isValid) {
      await this.toastService.warning(phoneValidation.message!);
      return;
    }

    // Remove formatação do telefone para salvar apenas os dígitos
    const cleanPhone = this.userPhone.replace(/\D/g, '');

    // Chamar API para atualizar perfil
    this.subs.add(
      this.userApi.updateProfile({
        nome: this.userName,
        email: this.userEmail,
        telefone: cleanPhone
      }, this.selectedPhotoFile || undefined).subscribe({
        next: (updatedUser) => {
          // Atualizar sessão local com dados retornados pelo backend
          this.sessionService.login(updatedUser);

          // Mostrar mensagem de sucesso
          this.toastService.success('Perfil atualizado com sucesso!');

          // Voltar para o perfil
          this.navCtrl.navigateBack('/client/profile');
        },
        error: async (err) => {
          console.error('Erro ao atualizar perfil', err);
          await this.toastService.error('Erro ao atualizar perfil. Tente novamente.');
        }
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
