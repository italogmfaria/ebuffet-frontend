import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular/standalone';
import { ModelPageComponent, NotificationCardComponent, NotificationModalComponent } from "../../../shared/ui/templates/exports";
import { NotificacoesApiService } from '../../../features/notifications/api/notificacoes-api.service';
import { SessionService } from '../../../core/services/session.service';
import { Subscription } from 'rxjs';

interface Notification {
  id: number;
  title: string;
  description: string;
  isNew: boolean;
  reservaId: number | null;
  dataCriacao: string;
}

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ModelPageComponent,
    NotificationCardComponent,
    NotificationModalComponent
  ]
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  selectedNotification: Notification | null = null;
  showModal = false;
  isLoading = false;

  private subs = new Subscription();

  constructor(
    private navCtrl: NavController,
    private notificacoesApi: NotificacoesApiService,
    private sessionService: SessionService
  ) {}

  ngOnInit() {
    this.loadNotifications();
  }

  /**
   * Carrega notificações do usuário através da API
   */
  private loadNotifications() {
    this.isLoading = true;
    this.subs.add(
      this.notificacoesApi.list({ page: 0, size: 50, sort: 'dataCriacao,DESC' }).subscribe({
        next: (page) => {
          const content = page.content ?? [];

          this.notifications = content.map(n => ({
            id: n.id,
            title: n.titulo,
            description: n.mensagem,
            isNew: !n.lida,
            reservaId: n.reservaId,
            dataCriacao: n.dataCriacao
          }));

          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erro ao carregar notificações', err);
          this.isLoading = false;
          this.notifications = [];
        }
      })
    );
  }

  onBackClick() {
    const user = this.sessionService.getUser();
    const isBuffetOwner = user?.roles === 'BUFFET';
    const homePath = isBuffetOwner ? '/admin/dashboard' : '/client/home';
    this.navCtrl.navigateBack(homePath);
  }

  onNotificationClick(notification: Notification) {
    this.selectedNotification = notification;
    this.showModal = true;
  }

  onModalClose() {
    if (this.selectedNotification && this.selectedNotification.isNew) {
      // Marca a notificação como lida via API
      this.subs.add(
        this.notificacoesApi.markAsRead(this.selectedNotification.id).subscribe({
          next: () => {
            // Atualiza localmente
            const index = this.notifications.findIndex(n => n.id === this.selectedNotification!.id);
            if (index !== -1) {
              this.notifications[index].isNew = false;
            }
          },
          error: (err) => console.error('Erro ao marcar notificação como lida', err)
        })
      );
    }
    this.showModal = false;
    this.selectedNotification = null;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
