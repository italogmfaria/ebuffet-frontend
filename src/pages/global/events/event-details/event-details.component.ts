import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';

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

import { ThemeService } from '../../../../core/services/theme.service';
import { EventoService } from '../../../../features/events/api/evento.api.service';
import { ReservationsApiService } from '../../../../features/reservations/api/reservations-api.service';
import { mapEventoStatusToUi } from '../../../../features/events/model/events.models';
import {SessionService} from "../../../../core/services/session.service";
import {mapReservaStatusToUi, UiStatus} from "../../../../features/cliente-profile/model/cliente-profile.model";

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
export class EventDetailsComponent implements OnInit, OnDestroy {
  eventId = 0;
  reservaId = 0;

  eventTitle = 'Nome do Evento';
  eventStatus: 'pending' | 'approved' | 'canceled' | 'completed' = 'pending';

  reserveTitle: string = 'Reserva';
  reserveStatus: UiStatus = 'pending';

  showCancelModal = false;

  date = '';
  budgetValue = '';
  description = '';
  address = '';
  time = '';
  peopleCount = '';

  menuItems: MenuItem[] = [];
  services: ServiceItem[] = [];

  secondaryColor$ = this.themeService.secondaryColor$;

  private subs = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private themeService: ThemeService,
    private navCtrl: NavController,
    private eventoApi: EventoService,
    private reservasApi: ReservationsApiService,
    private sessionService: SessionService
  ) {}

  ngOnInit() {
    this.subs.add(
      this.route.queryParams.subscribe(params => {
        this.eventId = Number(params['id'] ?? 0);
        this.reservaId = Number(params['reservaId'] ?? 0);

        if (this.eventId) this.loadEvento();
        if (this.reservaId) this.loadReserve();
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private loadEvento() {
    this.subs.add(
      this.eventoApi.getById(this.eventId).subscribe({
        next: (ev) => {
          this.eventTitle = ev.nome || `Evento #${ev.id}`;
          this.eventStatus = mapEventoStatusToUi(ev.statusEvento);

          this.budgetValue = ev.valor != null && ev.valor !== ''
            ? `R$ ${ev.valor}`
            : '';

          if (ev.inicio) {
            this.date = this.formatDatePtBr(ev.inicio);
            this.time = this.formatTimePtBr(ev.inicio);
          }
        },
        error: (err) => console.error('Erro ao carregar evento', err)
      })
    );
  }

  private loadReserve() {
    const user = this.sessionService.getUser();
    if (!user?.id) return;

    this.subs.add(
      this.reservasApi.getById(this.reservaId, user.id).subscribe({
        next: (r) => {
          this.reserveStatus = mapReservaStatusToUi(r.statusReserva);

          this.date = this.formatDatePtBr(r.dataDesejada);
          this.time = this.formatTimePtBr(r.horarioDesejado);
          this.peopleCount = `${r.qtdPessoas} pessoa${r.qtdPessoas === 1 ? '' : 's'}`;

          this.reserveTitle = this.reserveTitle || `Reserva #${r.id}`;

          this.description = r.observacoes || '';

          this.address = r.endereco
            ? this.formatAddress(r.endereco)
            : '';

          this.menuItems = (r.comidas ?? []).map(c => ({
            id: c.id,
            title: c.nome,
            description: c.descricao,
            imageUrl: '',
            quantity: 1
          }));

          this.services = (r.servicos ?? []).map(s => ({
            id: s.id,
            title: s.nome,
            description: s.descricao,
            imageUrl: '',
            quantity: 1
          }));
        },
        error: (err) => console.error('Erro ao carregar reserva', err)
      })
    );
  }

  private formatDatePtBr(isoDateTime: string) {
    const d = new Date(isoDateTime);
    return d.toLocaleDateString('pt-BR');
  }

  private formatTimePtBr(isoDateTime: string) {
    const d = new Date(isoDateTime);
    return `${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} horas`;
  }

  onBackClick() {
    this.location.back();
  }

  onEdit() {
    this.navCtrl.navigateForward('/events/event-edit', {
      queryParams: {
        id: this.eventId,
        title: this.eventTitle,
        status: this.eventStatus,
        reservaId: this.reservaId
      }
    });
  }

  onContact() {
    // TODO: abrir WhatsApp com o contato do buffet
  }

  onCancel() {
    this.showCancelModal = true;
  }

  onCancelModalClose() {
    this.showCancelModal = false;
  }

  onCancelModalConfirm() {
    // TODO: ligar com endpoint de cancelar evento (quando existir)
    this.showCancelModal = false;
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
        queryParams: { name: item.title, fromOrder: 'true' }
      });
    }
  }

  onServiceItemClick(item: ServiceItem) {
    if (item.id) {
      this.navCtrl.navigateForward(`/client/services/${item.id}`, {
        queryParams: { name: item.title, fromOrder: 'true' }
      });
    }
  }

  private formatAddress(e: any): string {
    const parts = [
      `${e.rua ?? ''}${e.numero ? ', ' + e.numero : ''}`.trim(),
      e.bairro,
      `${e.cidade ?? ''}${e.estado ? ', ' + e.estado : ''}`.trim(),
      e.cep,
      e.complemento
    ].filter(Boolean);

    return parts.join(' - ');
  }
}
