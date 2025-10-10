import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormPageComponent, ClientNavbarComponent, SearchInputComponent, DefaultCategoriesComponent, DefaultItemCardComponent} from '../../../shared/ui/templates/exports';
import { NavController } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { ThemeService } from '../../../shared/services/theme.service';
import { OrderService } from '../../../shared/services/order.service';
import { ToastService } from '../../../shared/services/toast.service';
import { FoodsApiService } from '../../../features/foods/api/foods.api';
import { ComidaListDTO } from '../../../features/foods/model/foods.model';
import { CategoriaIdMapping, CategoriasLabels, EnumCategoria } from '../../../features/shared/enums/categoria.enum';

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
    DefaultItemCardComponent
  ],
  host: { class: 'ion-page' }
})
export class FoodsComponent implements OnInit {
  primaryColor$ = this.themeService.primaryColor$;
  secondaryColor$ = this.themeService.secondaryColor$;
  accentColor$ = this.themeService.accentColor$;

  cartItemCount = 0;
  searchQuery: string = '';
  selectedCategory: string = 'todos';

  foods: ComidaListDTO[] = [];
  filteredFoods: ComidaListDTO[] = [];

  constructor(
    private themeService: ThemeService,
    private navCtrl: NavController,
    private orderService: OrderService,
    private toastService: ToastService,
    private foodsApiService: FoodsApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Subscribe to order items to update cart count
    this.orderService.orderItems$.subscribe(() => {
      this.cartItemCount = this.orderService.getTotalItems();
    });

    // Carrega as comidas do serviço
    this.loadFoods();

    // Captura o parâmetro de categoria da URL, se disponível
    this.route.queryParams.subscribe(params => {
      const category = params['category'];
      if (category) {
        this.selectedCategory = category;
        this.applyFilters();
      }
    });
  }

  loadFoods() {
    this.foodsApiService.getAllFoods().subscribe(foods => {
      this.foods = foods;
      this.applyFilters();
    });
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

    // Filtro por pesquisa
    if (this.searchQuery) {
      const term = this.searchQuery.toLowerCase();

      // Busca em categorias - encontra categorias que correspondem ao termo
      const matchingCategories: EnumCategoria[] = [];
      Object.entries(CategoriasLabels).forEach(([key, label]) => {
        if (label.toLowerCase().includes(term)) {
          matchingCategories.push(key as EnumCategoria);
        }
      });

      // Filtra por nome, descrição ou categoria
      filtered = filtered.filter(f =>
        f.nome.toLowerCase().includes(term) ||
        f.descricao.toLowerCase().includes(term) ||
        matchingCategories.includes(f.categoria)
      );
    }

    // Filtro por categoria selecionada (aplica depois da busca)
    if (this.selectedCategory !== 'todos') {
      const enumCategoria = CategoriaIdMapping[this.selectedCategory];
      if (enumCategoria) {
        filtered = filtered.filter(f => f.categoria === enumCategoria);
      }
    }

    this.filteredFoods = filtered;
  }

  onAddToOrder(item: ComidaListDTO) {
    this.orderService.addItem({
      title: item.nome,
      description: item.descricao,
      imageUrl: item.imageUrl || ''
    });
    this.toastService.success(`${item.nome} adicionado ao pedido!`);
  }

  onFoodClick(food: ComidaListDTO) {
    this.navCtrl.navigateForward(`/client/foods/${food.id}`, {
      queryParams: { name: food.nome }
    });
  }
}
