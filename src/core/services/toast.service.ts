import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';

export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'danger',
  WARNING = 'warning',
  INFO = 'primary'
}

export interface ToastConfig {
  message: string;
  type?: ToastType;
  duration?: number;
  position?: 'top' | 'bottom' | 'middle';
  showCloseButton?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private defaultDuration = 3000;
  private defaultPosition: 'top' | 'bottom' | 'middle' = 'top';

  constructor(private toastController: ToastController) {}

  /**
   * Exibe um toast de sucesso
   */
  async success(message: string, duration?: number): Promise<void> {
    await this.show({
      message,
      type: ToastType.SUCCESS,
      duration: duration || this.defaultDuration
    });
  }

  /**
   * Exibe um toast de erro
   */
  async error(message: string, duration?: number): Promise<void> {
    await this.show({
      message,
      type: ToastType.ERROR,
      duration: duration || this.defaultDuration
    });
  }

  /**
   * Exibe um toast de aviso
   */
  async warning(message: string, duration?: number): Promise<void> {
    await this.show({
      message,
      type: ToastType.WARNING,
      duration: duration || this.defaultDuration
    });
  }

  /**
   * Exibe um toast informativo
   */
  async info(message: string, duration?: number): Promise<void> {
    await this.show({
      message,
      type: ToastType.INFO,
      duration: duration || this.defaultDuration
    });
  }

  /**
   * Exibe um toast personalizado
   */
  async show(config: ToastConfig): Promise<void> {
    const toast = await this.toastController.create({
      message: config.message,
      duration: config.duration || this.defaultDuration,
      position: config.position || this.defaultPosition,
      color: config.type || ToastType.INFO,
      cssClass: 'app-toast',
      buttons: config.showCloseButton ? [
        {
          text: 'Fechar',
          role: 'cancel'
        }
      ] : undefined
    });

    await toast.present();
  }

  /**
   * Fecha todos os toasts ativos
   */
  async dismissAll(): Promise<void> {
    const toast = await this.toastController.getTop();
    if (toast) {
      await this.toastController.dismiss();
    }
  }
}

