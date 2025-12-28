import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormPageComponent, ClientNavbarComponent, SearchInputComponent, DefaultCategoriesComponent, DefaultItemCardComponent, LoadingSpinnerComponent} from '../../../shared/ui/templates/exports';
import {IonInfiniteScroll, IonInfiniteScrollContent, NavController} from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { OrderService } from '../../../features/orders/services/order.service';
import { ToastService } from '../../../core/services/toast.service';
import { ServicesApiService } from '../../../features/services/api/services.api';
import { ServicoListDTO } from '../../../features/services/model/services.model';
import { CategoriaIdMapping, CategoriasLabels, EnumCategoria } from '../../../core/enums/categoria.enum';
import {filter} from "rxjs/operators";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FormPageComponent,
    ClientNavbarComponent,
    SearchInputComponent,
    DefaultCategoriesComponent,
    DefaultItemCardComponent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    LoadingSpinnerComponent
  ],
  host: { class: 'ion-page' }
})
export class ServicesComponent implements OnInit, OnDestroy {
  primaryColor$ = this.themeService.primaryColor$;
  secondaryColor$ = this.themeService.secondaryColor$;
  accentColor$ = this.themeService.accentColor$;

  cartItemCount = 0;
  searchQuery: string = '';
  selectedCategory: string = 'todos';
  isLoading = true;

  services: ServicoListDTO[] = [];
  filteredServices: ServicoListDTO[] = [];
  displayedServices: ServicoListDTO[] = [];

  // Lazy loading configuration
  private pageSize = 10;
  private currentPage = 0;

  private subs = new Subscription();

  // Edit mode tracking
  private fromEdit: string = '';
  private editId: string = '';

  constructor(
    private themeService: ThemeService,
    private navCtrl: NavController,
    private orderService: OrderService,
    private toastService: ToastService,
    private servicesApiService: ServicesApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.subs.add(
      this.orderService.orderItems$.subscribe(() => {
        this.cartItemCount = this.orderService.getTotalItems();
      })
    );

    this.loadServices();

    this.subs.add(
      this.route.queryParams.subscribe(params => {
        const category = params['category'];
        if (category) {
          this.selectedCategory = category;
          this.applyFilters();
        }

        // Capture edit mode params
        this.fromEdit = params['fromEdit'] || '';
        this.editId = params['editId'] || '';
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  loadServices() {
    const buffetIdSync = this.themeService.getBuffetIdSync?.() ?? null;
    if (buffetIdSync) {
      this.fetchServices();
      return;
    }

    this.subs.add(
      this.themeService.buffetId$
        .pipe(filter((id): id is number => id !== null))
        .subscribe(id => this.fetchServices())
    );
  }

  private fetchServices() {
    this.isLoading = true;
    this.subs.add(
      this.servicesApiService.getAll().subscribe({
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

  onBackClick() {
    this.navCtrl.navigateBack('/client/home');
  }

  onNotificationClick() {
    this.navCtrl.navigateForward('/notifications');
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.applyFilters();
  }

  onCategorySelect(categoryId: string) {
    this.selectedCategory = categoryId;
    this.applyFilters();
  }

  private applyFilters() {
    let filtered = [...this.services];

    if (this.searchQuery) {
      const term = this.searchQuery.toLowerCase();

      const matchingCategories: EnumCategoria[] = [];
      Object.entries(CategoriasLabels).forEach(([key, label]) => {
        if (label.toLowerCase().includes(term)) {
          matchingCategories.push(key as EnumCategoria);
        }
      });

      filtered = filtered.filter(s =>
        s.nome.toLowerCase().includes(term) ||
        s.descricao.toLowerCase().includes(term) ||
        matchingCategories.includes(s.categoria)
      );
    }

    if (this.selectedCategory !== 'todos') {
      const enumCategoria = (CategoriaIdMapping as any)[this.selectedCategory];
      if (enumCategoria) {
        filtered = filtered.filter(s => s.categoria === enumCategoria);
      }
    }

    this.filteredServices = filtered;

    // Reset lazy loading
    this.currentPage = 0;
    this.loadMoreItems();
  }

  /**
   * Carrega mais itens para exibição (lazy loading)
   */
  private loadMoreItems() {
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

  /**
   * Chamado quando o usuário rola até o fim da lista
   */
  onIonInfinite(event: any) {
    const hasMoreItems = this.displayedServices.length < this.filteredServices.length;

    if (hasMoreItems) {
      setTimeout(() => {
        this.loadMoreItems();
        event.target.complete();
      }, 300);
    } else {
      event.target.complete();
    }
  }

  onAddToOrder(item: ServicoListDTO) {
    this.orderService.addItem({
      id: item.id,
      title: item.nome,
      description: item.descricao,
      imageUrl: item.imageUrl || '',
      type: 'service'
    });
    this.toastService.success(`${item.nome} adicionado ao pedido!`);

    // Redireciona para a página de edição se vier de lá
    if (this.fromEdit === 'reserve') {
      this.navCtrl.navigateForward('/reserves/reserve-edit', {
        queryParams: { id: this.editId }
      });
    } else if (this.fromEdit === 'event') {
      this.navCtrl.navigateForward('/events/event-edit', {
        queryParams: { id: this.editId }
      });
    }
  }

  onServiceClick(service: ServicoListDTO) {
    const queryParams: any = { name: service.nome };

    if (this.fromEdit) {
      queryParams.fromEdit = this.fromEdit;
      queryParams.editId = this.editId;
    }

    this.navCtrl.navigateForward(`/client/services/${service.id}`, { queryParams });
  }

  get isFromEdit(): boolean {
    return !!this.fromEdit;
  }
}
