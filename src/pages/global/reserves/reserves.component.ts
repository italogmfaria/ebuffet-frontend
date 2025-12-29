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

interface Reserve {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'canceled' | 'completed';
}

@Component({
  selector: 'app-reserves',
  templateUrl: './reserves.component.html',
  styleUrls: ['./reserves.component.scss'],
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
export class ReservesComponent implements OnInit {
  secondaryColor$ = this.themeService.secondaryColor$;
  isLoading = false;
  searchQuery = '';
  selectedStatus = 'todos';
  pageTitle = '';

  reserves: Reserve[] = [];
  filteredReserves: Reserve[] = [];

  constructor(
    private navCtrl: NavController,
    private themeService: ThemeService,
    private navigationService: NavigationService,
    private titleService: TitleService
  ) { }

  ngOnInit() {
    this.pageTitle = this.titleService.getReservesTitle();
    this.loadMockReserves();
  }

  /**
   * Carrega reservas mockadas
   * TODO: Substituir por chamada ao backend
   */
  private loadMockReserves() {
    this.reserves = [
      {
        id: 1,
        title: 'Casamento',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis purus lorem, aliquet eu iaculis sed, sollicitudin quis velit.',
        status: 'pending'
      },
      {
        id: 2,
        title: 'Aniversário',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis purus lorem, aliquet eu iaculis sed, sollicitudin quis velit.',
        status: 'approved'
      },
      {
        id: 3,
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
    let filtered = [...this.reserves];

    // Filtrar por busca
    if (this.searchQuery) {
      const term = this.searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(term) ||
        r.description.toLowerCase().includes(term)
      );
    }

    // Filtrar por status
    if (this.selectedStatus !== 'todos') {
      filtered = filtered.filter(r => r.status === this.selectedStatus);
    }

    this.filteredReserves = filtered;
  }

  onReserveClick(reserve: Reserve) {
    this.navCtrl.navigateForward('/reserves/reserve-details', {
      queryParams: { id: reserve.id, title: reserve.title, status: reserve.status }
    });
  }

  onReserveOpen(reserve: Reserve) {
    this.onReserveClick(reserve);
  }

  async onBackClick() {
    await this.navigationService.navigateToHome();
  }
}
