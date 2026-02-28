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
import { ComidaListDTO, EnumStatus } from '../../../features/foods/model/foods.model';
import { CategoriaIdMapping } from '../../../core/enums/categoria.enum';
import { Subscription } from "rxjs";
import { FoodsApiService } from "../../../features/foods/services/food.service";

@Component({
  selector: 'app-manage-foods',
  templateUrl: './manage-foods.component.html',
  styleUrls: ['./manage-foods.component.scss'],
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
export class ManageFoodsComponent implements OnInit, OnDestroy, ViewWillEnter {
  primaryColor$ = this.themeService.primaryColor$;
  secondaryColor$ = this.themeService.secondaryColor$;
  accentColor$ = this.themeService.accentColor$;

  searchQuery = '';
  selectedCategory: string = 'todos';
  isLoading = true;
  showDeleteModal = false;
  foodToDelete: ComidaListDTO | null = null;

  foods: ComidaListDTO[] = [];
  filteredFoods: ComidaListDTO[] = [];
  displayedFoods: ComidaListDTO[] = [];

  // Lazy loading configuration
  private pageSize = 10;
  private currentPage = 0;

  private subscriptions = new Subscription();

  constructor(
    private navCtrl: NavController,
    private themeService: ThemeService,
    private foodsApiService: FoodsApiService,
    private toastService: ToastService,
    private sessionService: SessionService
  ) {}

  ngOnInit() {
    this.loadFoods();
  }

  ionViewWillEnter() {
    this.loadFoods();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  loadFoods() {
    this.fetchFoods();
  }

  private fetchFoods() {
    this.isLoading = true;
    this.subscriptions.add(
      this.foodsApiService.listByBuffet({ status: EnumStatus.ATIVO }).subscribe({
        next: page => {
          this.foods = page.content.map((c: any) => ({...c, imageUrl: c.imagemUrl}));
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
    let result = [...this.foods];

    // Filter by category
    if (this.selectedCategory !== 'todos') {
      const categoryEnum = CategoriaIdMapping[this.selectedCategory];
      if (categoryEnum) {
        result = result.filter(food => food.categoria === categoryEnum);
      }
    }

    // Filter by search query
    if (this.searchQuery && this.searchQuery.trim() !== '') {
      const query = this.searchQuery.toLowerCase().trim();
      result = result.filter(food =>
        food.nome.toLowerCase().includes(query) ||
        food.descricao.toLowerCase().includes(query)
      );
    }

    this.filteredFoods = result;
    this.loadMoreItems();
  }

  loadMoreItems() {
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

  onIonInfinite(event: any) {
    setTimeout(() => {
      const totalDisplayed = this.displayedFoods.length;
      const totalAvailable = this.filteredFoods.length;

      if (totalDisplayed < totalAvailable) {
        this.loadMoreItems();
      }

      event.target.complete();

      if (totalDisplayed >= totalAvailable) {
        event.target.disabled = true;
      }
    }, 500);
  }

  onFoodClick(food: ComidaListDTO) {
    this.navCtrl.navigateForward(`/admin/food-form/${food.id}`);
  }

  onEditFood(food: ComidaListDTO) {
    this.navCtrl.navigateForward(`/admin/food-form/${food.id}`);
  }

  onDeleteFood(food: ComidaListDTO) {
    this.foodToDelete = food;
    this.showDeleteModal = true;
  }

  onDeleteModalClose() {
    this.showDeleteModal = false;
    this.foodToDelete = null;
  }

  onDeleteModalConfirm() {
    this.showDeleteModal = false;
    this.foodToDelete = null;
  }

  onDeleteModalCancel() {
    if (this.foodToDelete) {
      this.deleteFood(this.foodToDelete);
    }
    this.showDeleteModal = false;
    this.foodToDelete = null;
  }

  private deleteFood(food: ComidaListDTO) {
    const user = this.sessionService.getUser();
    if (!user?.id) {
      this.toastService.error('Erro ao identificar usuário');
      return;
    }

    this.subscriptions.add(
      this.foodsApiService.delete(food.id, user.id, true).subscribe({
        next: () => {
          this.toastService.success('Comida excluída com sucesso!');
          this.loadFoods();
        },
        error: (err: any) => {
          console.error('Erro ao excluir comida', err);
          this.toastService.error('Não foi possível excluir a comida.');
        }
      })
    );
  }

  onAddFood() {
    this.navCtrl.navigateForward('/admin/food-form');
  }

  onBackClick() {
    this.navCtrl.navigateBack('/admin/dashboard');
  }
}
