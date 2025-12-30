import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NotificacoesApiService } from '../../features/notifications/api/notificacoes-api.service';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private hasNewNotificationSubject = new BehaviorSubject<boolean>(false);
  public hasNewNotification$: Observable<boolean> = this.hasNewNotificationSubject.asObservable();

  private notificacoesApi = inject(NotificacoesApiService);
  private sessionService = inject(SessionService);

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
    const user = this.sessionService.getUser();
    if (!user?.id) {
      this.setHasNewNotification(false);
      return;
    }

    try {
      this.notificacoesApi.countUnread(user.id).subscribe({
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
