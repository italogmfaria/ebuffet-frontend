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

interface Reserve {
  id: number;
  title: string;
  description: string;
  status: UiStatus;
  dataDesejada: string;
  horarioDesejado: string;
  qtdPessoas: number;
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
export class ReservesComponent implements OnInit, OnDestroy {
  secondaryColor$ = this.themeService.secondaryColor$;
  isLoading = false;
  searchQuery = '';
  selectedStatus = 'todos';
  pageTitle = '';

  reserves: Reserve[] = [];
  filteredReserves: Reserve[] = [];

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
    this.pageTitle = this.titleService.getReservesTitle();
    this.loadReserves();
  }

  /**
   * Carrega as reservas do usuário através da API
   * Se o usuário for dono de buffet, carrega as reservas do buffet
   * Caso contrário, carrega as reservas do cliente
   */
  private loadReserves() {
    const user = this.sessionService.getUser();
    if (!user?.id) {
      console.error('Usuário não autenticado');
      return;
    }

    this.isLoading = true;

    // Se usuário tem buffetId, é um dono de buffet
    const isBuffetOwner = !!user.buffetId;
    const apiCall = isBuffetOwner
      ? this.reservationsApi.listByBuffet(user.id, { page: 0, size: 50, sort: 'dataCriacao,DESC' })
      : this.reservationsApi.listMine(user.id, { page: 0, size: 50, sort: 'dataCriacao,DESC' });

    this.subs.add(
      apiCall.subscribe({
        next: (page) => {
          const content = page.content ?? [];

          this.reserves = content.map(r => ({
            id: r.id,
            title: r.titulo || `Reserva #${r.id}`,
            description: this.buildDescription(r),
            status: mapReservaStatusToUi(r.statusReserva),
            dataDesejada: r.dataDesejada,
            horarioDesejado: r.horarioDesejado,
            qtdPessoas: r.qtdPessoas
          }));

          this.isLoading = false;
          this.applyFilters();
        },
        error: (err) => {
          console.error('Erro ao carregar reservas', err);
          this.isLoading = false;
          this.reserves = [];
          this.applyFilters();
        }
      })
    );
  }

  /**
   * Retorna a descrição da reserva
   */
  private buildDescription(reserva: any): string {
    return reserva.descricao || '';
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

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  async onBackClick() {
    await this.navigationService.navigateToHome();
  }
}
