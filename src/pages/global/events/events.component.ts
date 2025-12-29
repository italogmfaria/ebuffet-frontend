import { Component, OnInit } from '@angular/core';
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
import {NavigationService} from "../../../core/services/navigation.service";
import {TitleService} from "../../../core/services/title.service";

interface Event {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'canceled' | 'completed';
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
export class EventsComponent implements OnInit {
  secondaryColor$ = this.themeService.secondaryColor$;
  isLoading = false;
  searchQuery = '';
  selectedStatus = 'todos';
  pageTitle = '';

  events: Event[] = [];
  filteredEvents: Event[] = [];

  constructor(
    private navCtrl: NavController,
    private themeService: ThemeService,
    private navigationService: NavigationService,
    private titleService: TitleService
  ) { }

  ngOnInit() {
    this.pageTitle = this.titleService.getEventsTitle();
    this.loadMockEvents();
  }

  /**
   * Carrega eventos mockados
   * TODO: Substituir por chamada ao backend
   */
  private loadMockEvents() {
    this.events = [
      {
        id: 1,
        title: 'Casamento',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis purus lorem, aliquet eu iaculis sed, sollicitudin quis velit.',
        status: 'pending'
      },
      {
        id: 2,
        title: 'Chá Revelação',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis purus lorem, aliquet eu iaculis sed, sollicitudin quis velit.',
        status: 'approved'
      },
      {
        id: 3,
        title: 'Aniversário',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis purus lorem, aliquet eu iaculis sed, sollicitudin quis velit.',
        status: 'completed'
      },
      {
        id: 4,
        title: 'Confraternização',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis purus lorem, aliquet eu iaculis sed, sollicitudin quis velit.',
        status: 'canceled'
      }
    ];
    this.applyFilters();
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

  async onBackClick() {
    await this.navigationService.navigateToHome();
  }
}
