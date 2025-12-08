import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular/standalone';
import {
  ModelPageComponent,
  DefaultItemCardComponent,
  PrimaryButtonComponent,
  CancelButtonComponent,
  WhatsappButtonComponent,
  PendingStatusComponent,
  ApprovedStatusComponent,
  CanceledStatusComponent,
  CompletedStatusComponent,
  ConfirmationModalComponent
} from '../../../../shared/ui/templates/exports';
import { ThemeService } from '../../../../shared/services/theme.service';

interface MenuItem {
  id?: number;
  title: string;
  description: string;
  imageUrl: string;
  quantity: number;
}

interface ServiceItem {
  id?: number;
  title: string;
  description: string;
  imageUrl: string;
  quantity: number;
}

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ModelPageComponent,
    DefaultItemCardComponent,
    PrimaryButtonComponent,
    CancelButtonComponent,
    WhatsappButtonComponent,
    PendingStatusComponent,
    ApprovedStatusComponent,
    CanceledStatusComponent,
    CompletedStatusComponent,
    ConfirmationModalComponent
  ],
  host: { class: 'ion-page' }
})
export class EventDetailsComponent implements OnInit {
  eventTitle: string = '';
  eventStatus: string = '';
  previousStatus: string = ''; // Armazena o status anterior ao cancelamento
  showCancelModal: boolean = false; // Controla a exibição do modal de cancelamento

  // Dados mockados
  date: string = '12/09/2025';
  budgetValue: string = 'R$ 5.000,00';
  description: string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis purus lorem, aliquet eu iaculis sed, sollicitudin quis velit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis purus lorem, aliquet eu iaculis sed, sollicitudin quis velit.';
  address: string = 'Rua Joaquim Justino, 39, Centro, Urutaí, Goiás, 7579000';
  time: string = '19:00 horas';
  peopleCount: string = '15 pessoas';

  menuItems: MenuItem[] = [
    {
      id: 1,
      title: 'Bolo de Casamento',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis purus lorem, aliquet eu iaculis sed, sollicitudin quis velit.',
      imageUrl: '',
      quantity: 1
    }
  ];

  services: ServiceItem[] = [
    {
      id: 1,
      title: 'Decoração de Casamento',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis purus lorem, aliquet eu iaculis sed, sollicitudin quis velit.',
      imageUrl: '',
      quantity: 1
    }
  ];

  secondaryColor$ = this.themeService.secondaryColor$;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private themeService: ThemeService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.eventTitle = params['title'] || 'Nome do Evento';
      this.eventStatus = params['status'] || '';
      // Armazena o status inicial apenas se não for cancelado
      if (this.eventStatus !== 'canceled') {
        this.previousStatus = this.eventStatus;
      }
    });
  }

  onBackClick() {
    this.location.back();
  }

  onEdit() {
    console.log('Editar evento');
    this.navCtrl.navigateForward('/events/event-edit', {
      queryParams: {
        id: this.route.snapshot.queryParams['id'] || '',
        title: this.eventTitle,
        status: this.eventStatus
      }
    });
  }

  onContact() {
    console.log('Entrar em contato via WhatsApp');
    // TODO: Abrir WhatsApp com o contato do buffet
  }

  onCancel() {
    // Mostra o modal de confirmação
    this.showCancelModal = true;
  }

  onCancelModalClose() {
    this.showCancelModal = false;
  }

  onCancelModalConfirm() {
    if (this.eventStatus === 'canceled') {
      // Descancelar - volta ao status anterior
      this.eventStatus = this.previousStatus || 'pending';
      console.log('Evento descancelado, voltando para:', this.eventStatus);
    } else {
      // Cancelar - guarda o status atual e muda para canceled
      this.previousStatus = this.eventStatus;
      this.eventStatus = 'canceled';
      console.log('Evento cancelado');
    }
    this.showCancelModal = false;
    // TODO: Implementar lógica de cancelamento/descancelamento no backend
  }

  onCancelModalCancel() {
    this.showCancelModal = false;
  }

  get isCanceled(): boolean {
    return this.eventStatus === 'canceled';
  }

  get cancelButtonText(): string {
    return this.isCanceled ? 'Descancelar' : 'Cancelar';
  }

  get cancelModalTitle(): string {
    return this.isCanceled ? 'Descancelar evento?' : 'Cancelar evento?';
  }

  get cancelModalSubtitle(): string {
    return this.isCanceled
      ? 'Tem certeza que deseja<br>descancelar este evento?'
      : 'Tem certeza que deseja<br>cancelar este evento?';
  }

  get canEdit(): boolean {
    return this.eventStatus === 'pending' || this.eventStatus === 'approved';
  }

  get canCancel(): boolean {
    return this.eventStatus === 'pending' || this.eventStatus === 'approved';
  }

  onFoodItemClick(item: MenuItem) {
    if (item.id) {
      this.navCtrl.navigateForward(`/client/foods/${item.id}`, {
        queryParams: {
          name: item.title,
          fromOrder: 'true'
        }
      });
    }
  }

  onServiceItemClick(item: ServiceItem) {
    if (item.id) {
      this.navCtrl.navigateForward(`/client/services/${item.id}`, {
        queryParams: {
          name: item.title,
          fromOrder: 'true'
        }
      });
    }
  }
}

