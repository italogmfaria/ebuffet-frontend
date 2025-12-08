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
  selector: 'app-reserve-details',
  templateUrl: './reserve-details.component.html',
  styleUrls: ['./reserve-details.component.scss'],
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
export class ReserveDetailsComponent implements OnInit {
  reserveTitle: string = '';
  reserveStatus: string = '';
  previousStatus: string = ''; // Armazena o status anterior ao cancelamento
  showCancelModal: boolean = false; // Controla a exibição do modal de cancelamento

  // Dados mockados
  date: string = '12/09/2025';
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
      this.reserveTitle = params['title'] || 'Nome da Reserva';
      this.reserveStatus = params['status'] || '';
      // Armazena o status inicial apenas se não for cancelado
      if (this.reserveStatus !== 'canceled') {
        this.previousStatus = this.reserveStatus;
      }
    });
  }

  onBackClick() {
    this.location.back();
  }

  onEdit() {
    console.log('Editar reserva');
    this.navCtrl.navigateForward('/reserves/reserve-edit', {
      queryParams: {
        id: this.route.snapshot.queryParams['id'] || '',
        title: this.reserveTitle,
        status: this.reserveStatus
      }
    });
  }

  onContact() {
    console.log('Entrar em contato via WhatsApp');
    // TODO: Abrir WhatsApp
  }

  onCancel() {
    // Mostra o modal de confirmação
    this.showCancelModal = true;
  }

  onCancelModalClose() {
    this.showCancelModal = false;
  }

  onCancelModalConfirm() {
    if (this.reserveStatus === 'canceled') {
      // Descancelar - volta ao status anterior
      this.reserveStatus = this.previousStatus || 'pending';
      console.log('Reserva descancelada, voltando para:', this.reserveStatus);
    } else {
      // Cancelar - guarda o status atual e muda para canceled
      this.previousStatus = this.reserveStatus;
      this.reserveStatus = 'canceled';
      console.log('Reserva cancelada');
    }
    this.showCancelModal = false;
    // TODO: Implementar lógica de cancelamento/descancelamento no backend
  }

  onCancelModalCancel() {
    this.showCancelModal = false;
  }

  get isCanceled(): boolean {
    return this.reserveStatus === 'canceled';
  }

  get cancelButtonText(): string {
    return this.isCanceled ? 'Descancelar' : 'Cancelar';
  }

  get cancelModalTitle(): string {
    return this.isCanceled ? 'Descancelar reserva?' : 'Cancelar reserva?';
  }

  get cancelModalSubtitle(): string {
    return this.isCanceled
      ? 'Tem certeza que deseja<br>descancelar esta reserva?'
      : 'Tem certeza que deseja<br>cancelar esta reserva?';
  }

  get canEdit(): boolean {
    return this.reserveStatus === 'pending';
  }

  get canCancel(): boolean {
    return this.reserveStatus === 'pending';
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

