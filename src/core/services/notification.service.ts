import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private hasNewNotificationSubject = new BehaviorSubject<boolean>(true);
  public hasNewNotification$: Observable<boolean> = this.hasNewNotificationSubject.asObservable();

  constructor() {
    // TODO: Aqui você pode carregar o estado inicial das notificações
    // this.checkForNewNotifications();
  }

  /**
   * Retorna se há notificações novas
   */
  getHasNewNotification(): boolean {
    return this.hasNewNotificationSubject.value;
  }

  /**
   * Define se há notificações novas
   */
  setHasNewNotification(hasNew: boolean): void {
    this.hasNewNotificationSubject.next(hasNew);
  }

  /**
   * Verifica no backend se há notificações novas
   * TODO: Implementar chamada ao backend
   */
  async checkForNewNotifications(): Promise<void> {
    try {
      // Exemplo: const response = await this.http.get('/api/notifications/has-new').toPromise();
      // this.setHasNewNotification(response.hasNew);

      // Simulação para teste (remover quando implementar o backend)
      this.setHasNewNotification(true);
    } catch (error) {
      console.error('Erro ao verificar notificações:', error);
    }
  }

  /**
   * Marca todas as notificações como lidas
   */
  markAllAsRead(): void {
    this.setHasNewNotification(false);
    // TODO: Chamar endpoint do backend para marcar como lidas
  }
}
