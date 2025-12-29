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
import { EventoService } from "../../../features/events/api/evento.api.service";
import { Subscription } from "rxjs";
import { UiStatus } from "../../../features/events/model/events.models";

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
    private eventoService: EventoService
  ) { }

  ngOnInit() {
    this.pageTitle = this.titleService.getEventsTitle();
    this.loadEvents();
  }

  /**
   * Carrega os eventos do usuário através da API
   */
  private loadEvents() {
    const user = this.sessionService.getUser();
    if (!user?.id) {
      console.error('Usuário não autenticado');
      return;
    }

    this.isLoading = true;
    this.subs.add(
      this.eventoService.getAllMine(user.id).subscribe({
        next: (events) => {
          this.events = events;
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
      queryParams: { id: event.id, title: event.title, status: event.status }
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
