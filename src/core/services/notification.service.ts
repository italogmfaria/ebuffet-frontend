import { Injectable, inject, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { NotificacoesApiService } from '../../features/notifications/api/notificacoes-api.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnDestroy {
  private hasNewNotificationSubject = new BehaviorSubject<boolean>(false);
  public hasNewNotification$: Observable<boolean> = this.hasNewNotificationSubject.asObservable();

  private notificacoesApi = inject(NotificacoesApiService);
  private checkSubscription?: Subscription;

  constructor() {
    // Carregar estado inicial das notificações
    this.checkForNewNotifications();
  }

  ngOnDestroy() {
    this.checkSubscription?.unsubscribe();
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
  checkForNewNotifications(): void {
    // Cancela verificação anterior se ainda estiver em andamento
    this.checkSubscription?.unsubscribe();

    this.checkSubscription = this.notificacoesApi.countUnread().subscribe({
      next: (count) => {
        this.setHasNewNotification(count > 0);
      },
      error: (err) => {
        console.error('Erro ao verificar notificações:', err);
        // Não altera o estado em caso de erro para evitar falsos negativos
      }
    });
  }

  /**
   * Marca todas as notificações como lidas
   */
  markAllAsRead(): void {
    this.setHasNewNotification(false);
    // TODO: Chamar endpoint do backend para marcar como lidas
  }
}
