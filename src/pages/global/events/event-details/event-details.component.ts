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
  ConfirmationModalComponent, BudgetModalComponent
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
    ConfirmationModalComponent,
    BudgetModalComponent
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
  showBudgetModal = false;
  showCompleteModal = false;

  date = '';
  budgetValue = '';
  description = '';
  address = '';
  time = '';
  peopleCount = '';
  clientName = '';
  clientEmail = '';
  clientPhone = '';

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

  get isAdmin(): boolean {
    return this.sessionService.isAdmin();
  }

  get isClient(): boolean {
    return !this.isAdmin;
  }

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

          // TODO: Backend precisa retornar objeto 'cliente' com nome e email
          // Carrega nome do cliente (para admin)
          // if (ev.cliente) {
          //   this.clientName = ev.cliente.nome || ev.cliente.email || 'Cliente não identificado';
          //   this.clientEmail = ev.cliente.email || '';
          //   this.clientPhone = ev.cliente.telefone || '';
          // } else if (ev.reserva?.cliente) {
          //   this.clientName = ev.reserva.cliente.nome || ev.reserva.cliente.email || 'Cliente não identificado';
          //   this.clientEmail = ev.reserva.cliente.email || '';
          //   this.clientPhone = ev.reserva.cliente.telefone || '';
          // }
          // Por enquanto, usar clienteId como fallback
          if (this.isAdmin) {
            this.clientName = `Cliente ID: ${ev.clienteId}`;
            this.clientEmail = 'Email não disponível';
            this.clientPhone = 'Telefone não disponível';
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

          this.reserveTitle = r.titulo || `Reserva #${r.id}`;

          this.description = r.descricao || '';

          this.address = r.endereco
            ? this.formatAddress(r.endereco)
            : '';

          // TODO: Backend precisa retornar objeto 'cliente' com nome e email
          // Carrega nome do cliente (para admin)
          // if (r.cliente) {
          //   this.clientName = r.cliente.nome || r.cliente.email || 'Cliente não identificado';
          //   this.clientEmail = r.cliente.email || '';
          //   this.clientPhone = r.cliente.telefone || '';
          // }
          // Por enquanto, usar clienteId como fallback
          if (this.isAdmin && !this.clientName) {
            this.clientName = `Cliente ID: ${r.clienteId}`;
            this.clientEmail = 'Email não disponível';
            this.clientPhone = 'Telefone não disponível';
          }

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

  private formatTimePtBr(timeString: string) {
    // Se for apenas hora (HH:MM:SS ou HH:MM), formatar diretamente
    if (timeString && !timeString.includes('T') && timeString.match(/^\d{2}:\d{2}/)) {
      const parts = timeString.split(':');
      return `${parts[0]}:${parts[1]} horas`;
    }
    // Caso contrário, tratar como ISO datetime
    const d = new Date(timeString);
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
    if (this.isAdmin) {
      // Admin entra em contato com o cliente
      if (this.clientPhone && this.clientPhone !== 'Telefone não disponível') {
        const phoneNumber = this.clientPhone.replace(/\D/g, ''); // Remove caracteres não numéricos
        const message = encodeURIComponent(`Olá! Sobre seu evento "${this.eventTitle}"`);
        window.open(`https://wa.me/55${phoneNumber}?text=${message}`, '_blank');
      } else {
        console.warn('Telefone do cliente não disponível');
      }
    } else {
      // Cliente entra em contato com o buffet
      // TODO: Implementar quando backend retornar telefone do buffet
      console.warn('Funcionalidade de contato com buffet ainda não implementada');
      // const buffetPhone = this.themeService.getBuffetPhone();
      // if (buffetPhone) {
      //   const phoneNumber = buffetPhone.replace(/\D/g, '');
      //   const message = encodeURIComponent(`Olá! Tenho dúvidas sobre o evento "${this.eventTitle}"`);
      //   window.open(`https://wa.me/55${phoneNumber}?text=${message}`, '_blank');
      // }
    }
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

  onComplete() {
    this.showCompleteModal = true;
  }

  onCompleteModalClose() {
    this.showCompleteModal = false;
  }

  onCompleteModalConfirm() {
    // TODO: Implementar conclusão do evento no backend
    this.showCompleteModal = false;
    console.log('Evento concluído');
  }

  onCompleteModalCancel() {
    this.showCompleteModal = false;
  }

  onEditBudget() {
    this.showBudgetModal = true;
  }

  onBudgetModalClose() {
    this.showBudgetModal = false;
  }

  onBudgetModalConfirm(value: string) {
    // TODO: Implementar atualização do valor orçado no backend
    this.showBudgetModal = false;
    this.budgetValue = `R$ ${value}`;
    console.log('Valor orçado atualizado:', value);
  }

  onBudgetModalCancel() {
    this.showBudgetModal = false;
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
    if (this.isAdmin) {
      // Admin pode cancelar/descancelar se pendente, agendado ou cancelado
      return this.eventStatus === 'pending' ||
             this.eventStatus === 'approved' ||
             this.eventStatus === 'canceled';
    } else {
      // Cliente pode cancelar apenas se pendente (não pode descancelar)
      return this.eventStatus === 'pending';
    }
  }

  get canComplete(): boolean {
    // Apenas admin pode concluir, se pendente ou aprovado
    return this.isAdmin && (this.eventStatus === 'pending' || this.eventStatus === 'approved');
  }

  get showEditBudget(): boolean {
    // Admin vê botão de editar valor orçado
    return this.isAdmin && this.canEdit;
  }

  get showEditEvent(): boolean {
    // Cliente vê botão de editar evento
    return this.isClient && this.canEdit;
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
