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
import { Subscription } from "rxjs";
import { mapReservaStatusToUi, UiStatus } from "../../../features/cliente-profile/model/cliente-profile.model";

interface Event {
  id: number;
  title: string;
  description: string;
  status: UiStatus;
  reservaId: number;
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
    private reservationsApi: ReservationsApiService
  ) { }

  ngOnInit() {
    this.pageTitle = this.titleService.getEventsTitle();
    this.loadEvents();
  }

  /**
   * Carrega os eventos do usuário através da API de reservas
   */
  private loadEvents() {
    const user = this.sessionService.getUser();
    if (!user?.id) {
      console.error('Usuário não autenticado');
      return;
    }

    this.isLoading = true;
    this.subs.add(
      this.reservationsApi.listMine(user.id, { page: 0, size: 50, sort: 'dataCriacao,DESC' }).subscribe({
        next: (page) => {
          const content = page.content ?? [];

          // Filtrar apenas reservas que possuem evento
          this.events = content
            .filter(r => !!r.eventoId)
            .map(r => ({
              id: r.eventoId as number,
              reservaId: r.id,
              title: `Evento da Reserva #${r.id}`,
              description: this.buildDescription(r),
              status: mapReservaStatusToUi(r.statusReserva)
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

  /**
   * Constrói a descrição do evento com base nos dados da reserva
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

    if (reserva.observacoes) {
      parts.push(reserva.observacoes);
    }

    return parts.join(' • ') || 'Sem descrição disponível';
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
      queryParams: { id: event.id, reservaId: event.reservaId }
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
