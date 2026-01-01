import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ModelPageComponent,
  SearchInputComponent,
  DefaultCategoriesComponent,
  ManageItemCardComponent,
  LoadingSpinnerComponent,
  ConfirmationModalComponent, AddCircleComponent
} from '../../../shared/ui/templates/exports';
import { IonInfiniteScroll, IonInfiniteScrollContent, NavController, ViewWillEnter } from '@ionic/angular/standalone';
import { ThemeService } from '../../../core/services/theme.service';
import { ToastService } from '../../../core/services/toast.service';
import { SessionService } from '../../../core/services/session.service';
import { ServicesApiService } from '../../../features/services/api/services.api';
import { ServicoListDTO } from '../../../features/services/model/services.model';
import { CategoriaIdMapping } from '../../../core/enums/categoria.enum';
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";

@Component({
  selector: 'app-manage-services',
  templateUrl: './manage-services.component.html',
  styleUrls: ['./manage-services.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModelPageComponent,
    SearchInputComponent,
    DefaultCategoriesComponent,
    ManageItemCardComponent,
    LoadingSpinnerComponent,
    IonInfiniteScrollContent,
    IonInfiniteScroll,
    ConfirmationModalComponent,
    AddCircleComponent
  ],
  host: { class: 'ion-page' }
})
export class ManageServicesComponent implements OnInit, OnDestroy, ViewWillEnter {
  primaryColor$ = this.themeService.primaryColor$;
  secondaryColor$ = this.themeService.secondaryColor$;
  accentColor$ = this.themeService.accentColor$;

  searchQuery = '';
  selectedCategory: string = 'todos';
  isLoading = true;
  showDeleteModal = false;
  serviceToDelete: ServicoListDTO | null = null;

  services: ServicoListDTO[] = [];
  filteredServices: ServicoListDTO[] = [];
  displayedServices: ServicoListDTO[] = [];

  // Lazy loading configuration
  private pageSize = 10;
  private currentPage = 0;

  private subscriptions = new Subscription();

  constructor(
    private navCtrl: NavController,
    private themeService: ThemeService,
    private servicesApiService: ServicesApiService,
    private toastService: ToastService,
    private sessionService: SessionService
  ) {}

  ngOnInit() {
    this.loadServices();
  }

  ionViewWillEnter() {
    this.loadServices();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  loadServices() {
    const buffetIdSync = this.themeService.getBuffetIdSync();
    if (buffetIdSync) {
      this.fetchServices(buffetIdSync);
      return;
    }

    this.subscriptions.add(
      this.themeService.buffetId$
        .pipe(filter((id): id is number => id !== null))
        .subscribe(id => this.fetchServices(id))
    );
  }

  private fetchServices(buffetId: number) {
    this.isLoading = true;
    this.subscriptions.add(
      this.servicesApiService.getAll(buffetId).subscribe({
        next: services => {
          this.services = services;
          this.applyFilters();
          this.isLoading = false;
        },
        error: err => {
          console.error('Erro ao carregar serviços', err);
          this.toastService.error('Não foi possível carregar os serviços.');
          this.isLoading = false;
        }
      })
    );
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.applyFilters();
  }

  onCategorySelect(categoryId: string) {
    this.selectedCategory = categoryId;
    this.applyFilters();
  }

  applyFilters() {
    this.currentPage = 0;
    let result = [...this.services];

    // Filter by category
    if (this.selectedCategory !== 'todos') {
      const categoryEnum = CategoriaIdMapping[this.selectedCategory];
      if (categoryEnum) {
        result = result.filter(service => service.categoria === categoryEnum);
      }
    }

    // Filter by search query
    if (this.searchQuery && this.searchQuery.trim() !== '') {
      const query = this.searchQuery.toLowerCase().trim();
      result = result.filter(service =>
        service.nome.toLowerCase().includes(query) ||
        service.descricao.toLowerCase().includes(query)
      );
    }

    this.filteredServices = result;
    this.loadMoreItems();
  }

  loadMoreItems() {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    const newItems = this.filteredServices.slice(start, end);

    if (this.currentPage === 0) {
      this.displayedServices = newItems;
    } else {
      this.displayedServices = [...this.displayedServices, ...newItems];
    }

    this.currentPage++;
  }

  onIonInfinite(event: any) {
    setTimeout(() => {
      const totalDisplayed = this.displayedServices.length;
      const totalAvailable = this.filteredServices.length;

      if (totalDisplayed < totalAvailable) {
        this.loadMoreItems();
      }

      event.target.complete();

      if (totalDisplayed >= totalAvailable) {
        event.target.disabled = true;
      }
    }, 500);
  }

  onServiceClick(service: ServicoListDTO) {
    this.navCtrl.navigateForward(`/admin/service-form/${service.id}`);
  }

  onEditService(service: ServicoListDTO) {
    this.navCtrl.navigateForward(`/admin/service-form/${service.id}`);
  }

  onDeleteService(service: ServicoListDTO) {
    this.serviceToDelete = service;
    this.showDeleteModal = true;
  }

  onDeleteModalClose() {
    this.showDeleteModal = false;
    this.serviceToDelete = null;
  }

  onDeleteModalConfirm() {
    this.showDeleteModal = false;
    this.serviceToDelete = null;
  }

  onDeleteModalCancel() {
    if (this.serviceToDelete) {
      this.deleteService(this.serviceToDelete);
    }
    this.showDeleteModal = false;
    this.serviceToDelete = null;
  }

  private deleteService(service: ServicoListDTO) {
    const user = this.sessionService.getUser();
    if (!user?.id) {
      this.toastService.error('Erro ao identificar usuário');
      return;
    }

    this.subscriptions.add(
      this.servicesApiService.delete(service.id, user.id, true).subscribe({
        next: () => {
          this.toastService.success('Serviço excluído com sucesso!');
          this.loadServices();
        },
        error: (err: any) => {
          console.error('Erro ao excluir serviço', err);
          this.toastService.error('Não foi possível excluir o serviço.');
        }
      })
    );
  }

  onAddService() {
    this.navCtrl.navigateForward('/admin/service-form');
  }

  onBackClick() {
    this.navCtrl.back();
  }
}

