import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NotificacoesApiService } from '../../features/notifications/api/notificacoes-api.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private hasNewNotificationSubject = new BehaviorSubject<boolean>(false);
  public hasNewNotification$: Observable<boolean> = this.hasNewNotificationSubject.asObservable();

  private notificacoesApi = inject(NotificacoesApiService);

  constructor() {
    // Carregar estado inicial das notificações
    this.checkForNewNotifications();
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
   */
  async checkForNewNotifications(): Promise<void> {
    try {
      this.notificacoesApi.countUnread().subscribe({
        next: (count) => {
          this.setHasNewNotification(count > 0);
        },
        error: (err) => {
          console.error('Erro ao verificar notificações:', err);
          this.setHasNewNotification(false);
        }
      });
    } catch (error) {
      console.error('Erro ao verificar notificações:', error);
      this.setHasNewNotification(false);
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
