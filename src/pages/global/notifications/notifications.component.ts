import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular/standalone';
import { ModelPageComponent, NotificationCardComponent, NotificationModalComponent } from "../../../shared/ui/templates/exports";

interface Notification {
  id: number;
  title: string;
  description: string;
  isNew: boolean;
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
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  selectedNotification: Notification | null = null;
  showModal = false;

  constructor(private navCtrl: NavController) {}

  ngOnInit() {
    this.loadMockNotifications();
  }

  /**
   * Carrega notificações mockadas
   * TODO: Substituir por chamada ao backend
   */
  private loadMockNotifications() {
    this.notifications = [
      {
        id: 1,
        title: 'Reserva Aprovada',
        description: 'Sua reserva para o Casamento de João e Maria foi aprovada! A data do evento está confirmada para 15/12/2025. Por favor, entre em contato conosco para finalizar os detalhes do buffet e confirmar o número final de convidados.',
        isNew: true
      },
      {
        id: 2,
        title: 'Novo Serviço Disponível',
        description: 'Temos um novo serviço de decoração com flores naturais disponível para seus eventos! Entre em contato para saber mais detalhes e valores. Estamos oferecendo 10% de desconto para as primeiras reservas.',
        isNew: true
      },
      {
        id: 3,
        title: 'Lembrete: Evento Próximo',
        description: 'Seu evento "Aniversário de 15 anos" está agendado para daqui a 7 dias (20/12/2025). Não esqueça de confirmar os últimos detalhes com nossa equipe.',
        isNew: false
      },
      {
        id: 4,
        title: 'Pagamento Confirmado',
        description: 'Recebemos o pagamento da entrada da sua reserva. O valor restante deverá ser pago até 3 dias antes do evento. Obrigado pela preferência!',
        isNew: false
      },
      {
        id: 5,
        title: 'Alteração no Cardápio',
        description: 'Informamos que o item "Torta de Limão" foi temporariamente substituído por "Torta de Morango" no cardápio. Entre em contato se desejar fazer alguma alteração na sua reserva.',
        isNew: false
      }
    ];
  }

  onBackClick() {
    this.navCtrl.navigateBack('/client/home');
  }

  onNotificationClick(notification: Notification) {
    this.selectedNotification = notification;
    this.showModal = true;
  }

  onModalClose() {
    if (this.selectedNotification && this.selectedNotification.isNew) {
      // Marca a notificação como lida
      const index = this.notifications.findIndex(n => n.id === this.selectedNotification!.id);
      if (index !== -1) {
        this.notifications[index].isNew = false;
        // Reorganiza a lista: notificações não vistas no topo
        this.sortNotifications();
      }
    }
    this.showModal = false;
    this.selectedNotification = null;
  }

  /**
   * Reorganiza as notificações colocando as não vistas (isNew = true) no topo
   */
  private sortNotifications() {
    this.notifications.sort((a, b) => {
      // Se 'a' é nova e 'b' não é, 'a' vem antes
      if (a.isNew && !b.isNew) return -1;
      // Se 'b' é nova e 'a' não é, 'b' vem antes
      if (!a.isNew && b.isNew) return 1;
      // Se ambas têm o mesmo status, mantém a ordem original (por id)
      return a.id - b.id;
    });
  }
}
