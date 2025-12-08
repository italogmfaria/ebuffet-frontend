import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  FormPageComponent,
  ClientNavbarComponent,
  SearchInputComponent,
  DefaultCategoriesComponent,
  DefaultItemCardComponent,
  LoadingSpinnerComponent
} from '../../../shared/ui/templates/exports';
import {IonInfiniteScroll, IonInfiniteScrollContent, NavController} from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { ThemeService } from '../../../shared/services/theme.service';
import { OrderService } from '../../../shared/services/order.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ComidaListDTO } from '../../../features/foods/model/foods.model';
import { CategoriaIdMapping, CategoriasLabels, EnumCategoria } from '../../../features/shared/enums/categoria.enum';
import {Subscription} from "rxjs";
import {filter} from "rxjs/operators";
import {FoodsApiService} from "../../../shared/services/food.service";

@Component({
  selector: 'app-foods',
  templateUrl: './foods.component.html',
  styleUrls: ['./foods.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FormPageComponent,
    ClientNavbarComponent,
    SearchInputComponent,
    DefaultCategoriesComponent,
    DefaultItemCardComponent,
    LoadingSpinnerComponent,
    IonInfiniteScrollContent,
    IonInfiniteScroll
  ],
  host: { class: 'ion-page' }
})
export class FoodsComponent implements OnInit, OnDestroy {
  primaryColor$ = this.themeService.primaryColor$;
  secondaryColor$ = this.themeService.secondaryColor$;
  accentColor$ = this.themeService.accentColor$;

  cartItemCount = 0;
  searchQuery = '';
  selectedCategory: string = 'todos';
  isLoading = true;

  foods: ComidaListDTO[] = [];
  filteredFoods: ComidaListDTO[] = [];
  displayedFoods: ComidaListDTO[] = [];

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
    private foodsApiService: FoodsApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.subs.add(
      this.orderService.orderItems$.subscribe(() => {
        this.cartItemCount = this.orderService.getTotalItems();
      })
    );

    this.loadFoods();

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

  loadFoods() {
    const buffetIdSync = this.themeService.getBuffetIdSync();
    if (buffetIdSync) {
      this.fetchFoods(buffetIdSync);
      return;
    }

    this.subs.add(
      this.themeService.buffetId$
        .pipe(filter((id): id is number => id !== null))
        .subscribe(id => this.fetchFoods(id))
    );
  }

  private fetchFoods(buffetId: number) {
    this.isLoading = true;
    this.subs.add(
      this.foodsApiService.getAll(buffetId).subscribe({
        next: foods => {
          this.foods = foods;
          this.applyFilters();
          this.isLoading = false;
        },
        error: err => {
          console.error('Erro ao carregar comidas', err);
          this.toastService.error('Não foi possível carregar as comidas.');
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
    let filtered = [...this.foods];

    if (this.searchQuery) {
      const term = this.searchQuery.toLowerCase();

      const matchingCategories: EnumCategoria[] = [];
      Object.entries(CategoriasLabels).forEach(([key, label]) => {
        if (label.toLowerCase().includes(term)) {
          matchingCategories.push(key as EnumCategoria);
        }
      });

      filtered = filtered.filter(f =>
        f.nome.toLowerCase().includes(term) ||
        f.descricao.toLowerCase().includes(term) ||
        matchingCategories.includes(f.categoria)
      );
    }

    if (this.selectedCategory !== 'todos') {
      const enumCategoria = CategoriaIdMapping[this.selectedCategory];
      if (enumCategoria) {
        filtered = filtered.filter(f => f.categoria === enumCategoria);
      }
    }

    this.filteredFoods = filtered;

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
    const newItems = this.filteredFoods.slice(start, end);

    if (this.currentPage === 0) {
      this.displayedFoods = newItems;
    } else {
      this.displayedFoods = [...this.displayedFoods, ...newItems];
    }

    this.currentPage++;
  }

  /**
   * Chamado quando o usuário rola até o fim da lista
   */
  onIonInfinite(event: any) {
    const hasMoreItems = this.displayedFoods.length < this.filteredFoods.length;

    if (hasMoreItems) {
      setTimeout(() => {
        this.loadMoreItems();
        event.target.complete();
      }, 300);
    } else {
      event.target.complete();
    }
  }

  onAddToOrder(item: ComidaListDTO) {
    this.orderService.addItem({
      id: item.id,
      title: item.nome,
      description: item.descricao,
      imageUrl: item.imageUrl || '',
      type: 'food'
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

  onFoodClick(food: ComidaListDTO) {
    const queryParams: any = { name: food.nome };

    if (this.fromEdit) {
      queryParams.fromEdit = this.fromEdit;
      queryParams.editId = this.editId;
    }

    this.navCtrl.navigateForward(`/client/foods/${food.id}`, { queryParams });
  }

  get isFromEdit(): boolean {
    return !!this.fromEdit;
  }
}

