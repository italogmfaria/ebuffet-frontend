import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular/standalone';
import {
  ModelPageComponent,
  LoadingSpinnerComponent,
  SearchInputComponent,
  EventReserveCardComponent,
  DefaultStatusComponent
} from "../../../shared/ui/templates/exports";
import { ThemeService } from '../../../core/services/theme.service';
import { NavigationService } from "../../../core/services/navigation.service";
import { TitleService } from "../../../core/services/title.service";
import { SessionService } from '../../../core/services/session.service';
import { ReservationsApiService } from "../../../features/reservations/api/reservations-api.service";
import { EventoService } from "../../../features/events/api/evento.api.service";
import { Subscription } from "rxjs";
import { mapReservaStatusToUi, UiStatus } from "../../../features/cliente-profile/model/cliente-profile.model";
import { mapEventoStatusToUi } from "../../../features/events/model/events.models";

interface Event {
  id: number;
  title: string;
  description: string;
  status: UiStatus;
  reservaId: number;
  clienteId: number;
}

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModelPageComponent,
    LoadingSpinnerComponent,
    SearchInputComponent,
    EventReserveCardComponent,
    DefaultStatusComponent
  ]
})
export class EventsComponent implements OnInit, OnDestroy {
  secondaryColor$ = this.themeService.secondaryColor$;
  isLoading = false;
  searchQuery = '';
  selectedStatus = 'todos';
  pageTitle = '';

  events: Event[] = [];
  filteredEvents: Event[] = [];

  private subs = new Subscription();

  constructor(
    private navCtrl: NavController,
    private themeService: ThemeService,
    private navigationService: NavigationService,
    private titleService: TitleService,
    private sessionService: SessionService,
    private reservationsApi: ReservationsApiService,
    private eventoService: EventoService
  ) { }

  ngOnInit() {
    this.pageTitle = this.titleService.getEventsTitle();
    this.loadEvents();
  }

  /**
   * Carrega os eventos do usuário através da API
   * Se o usuário tiver role BUFFET, carrega os eventos do buffet
   * Caso contrário, carrega os eventos do cliente através das reservas
   */
  private loadEvents() {
    const user = this.sessionService.getUser();
    if (!user?.id) {
      console.error('Usuário não autenticado');
      return;
    }

    this.isLoading = true;

    // Verifica se o usuário tem role BUFFET
    const isBuffetOwner = user.roles === 'BUFFET';

    if (isBuffetOwner) {
      // Para buffet owner, usar API de eventos direto
      this.subs.add(
        this.eventoService.listByBuffet({ page: 0, size: 50, sort: 'dataCriacao,DESC' }).subscribe({
          next: (page) => {
            const content = page.content ?? [];

            this.events = content.map(e => ({
              id: e.id,
              reservaId: e.reservaId ?? 0,
              clienteId: e.clienteId,
              title: e.nome || `Evento #${e.id}`,
              description: this.buildEventDescription(e),
              status: mapEventoStatusToUi(e.statusEvento)
            }));

            this.isLoading = false;
            this.applyFilters();
          },
          error: (err) => {
            console.error('Erro ao carregar eventos', err);
            this.isLoading = false;
            this.events = [];
            this.applyFilters();
          }
        })
      );
    } else {
      // Para cliente, usar API de eventos /eventos/me
      this.subs.add(
        this.eventoService.listMine(user.id, { page: 0, size: 50, sort: 'dataCriacao,DESC' }).subscribe({
          next: (page) => {
            const content = page.content ?? [];

            this.events = content.map(e => ({
              id: e.id,
              reservaId: e.reservaId ?? 0,
              clienteId: e.clienteId,
              title: e.nome || `Evento #${e.id}`,
              description: e.descricao || 'Evento confirmado',
              status: mapEventoStatusToUi(e.statusEvento)
            }));

            this.isLoading = false;
            this.applyFilters();
          },
          error: (err) => {
            console.error('Erro ao carregar eventos', err);
            this.isLoading = false;
            this.events = [];
            this.applyFilters();
          }
        })
      );
    }
  }

  /**
   * Constrói a descrição do evento com base nos dados da reserva (para clientes)
   */
  private buildDescription(reserva: any): string {
    const parts: string[] = [];

    if (reserva.dataDesejada) {
      const date = new Date(reserva.dataDesejada);
      parts.push(`Data: ${date.toLocaleDateString('pt-BR')}`);
    }

    if (reserva.horarioDesejado) {
      parts.push(`Horário: ${reserva.horarioDesejado}`);
    }

    if (reserva.qtdPessoas) {
      parts.push(`Pessoas: ${reserva.qtdPessoas}`);
    }

    if (reserva.descricao) {
      parts.push(reserva.descricao);
    }

    return parts.join(' • ') || 'Sem descrição disponível';
  }

  /**
   * Constrói a descrição do evento com base nos dados do evento (para buffet owners)
   */
  private buildEventDescription(evento: any): string {
    // Para buffet owners, mostrar apenas a descrição simples
    return evento.descricao || 'Evento confirmado';
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.applyFilters();
  }

  onStatusSelect(statusId: string) {
    this.selectedStatus = statusId;
    this.applyFilters();
  }

  private applyFilters() {
    let filtered = [...this.events];

    if (this.searchQuery) {
      const term = this.searchQuery.toLowerCase();
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(term) ||
        e.description.toLowerCase().includes(term)
      );
    }

    if (this.selectedStatus !== 'todos') {
      filtered = filtered.filter(e => e.status === this.selectedStatus);
    }

    this.filteredEvents = filtered;
  }

  onEventClick(event: Event) {
    this.navCtrl.navigateForward('/events/event-details', {
      queryParams: {
        id: event.id,
        reservaId: event.reservaId,
        clienteId: event.clienteId
      }
    });
  }

  onEventOpen(event: Event) {
    this.onEventClick(event);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  async onBackClick() {
    await this.navigationService.navigateToHome();
  }
}
