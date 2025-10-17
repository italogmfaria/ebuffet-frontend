import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormPageComponent, ClientNavbarComponent, SearchInputComponent, DefaultCategoriesComponent, DefaultItemCardComponent} from '../../../shared/ui/templates/exports';
import { NavController } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { ThemeService } from '../../../shared/services/theme.service';
import { OrderService } from '../../../shared/services/order.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ServicesApiService } from '../../../features/services/api/services.api';
import { ServicoListDTO } from '../../../features/services/model/services.model';
import { CategoriaIdMapping, CategoriasLabels, EnumCategoria } from '../../../features/shared/enums/categoria.enum';
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
    DefaultItemCardComponent
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

  services: ServicoListDTO[] = [];
  filteredServices: ServicoListDTO[] = [];

  private subs = new Subscription();

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
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  loadServices() {
    const buffetIdSync = this.themeService.getBuffetIdSync?.() ?? null;
    if (buffetIdSync) {
      this.fetchServices(buffetIdSync);
      return;
    }

    this.subs.add(
      this.themeService.buffetId$
        .pipe(filter((id): id is number => id !== null))
        .subscribe(id => this.fetchServices(id))
    );
  }

  private fetchServices(buffetId: number) {
    this.subs.add(
      this.servicesApiService.getAll(buffetId).subscribe({
        next: services => {
          this.services = services;
          this.applyFilters();
        },
        error: err => {
          console.error('Erro ao carregar serviços', err);
          this.toastService.error('Não foi possível carregar os serviços.');
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
  }

  onServiceClick(service: ServicoListDTO) {
    this.navCtrl.navigateForward(`/client/services/${service.id}`, {
      queryParams: { name: service.nome }
    });
  }
}
