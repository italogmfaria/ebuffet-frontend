import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {
  ModelPageComponent,
  ConfirmationModalComponent,
  TextInputComponent,
  TextareaInputComponent,
  SelectedInputComponent,
  SelectModalComponent,
  ImagePlaceholderComponent,
  PrimaryButtonComponent, ImageCircleComponent
} from '../../../shared/ui/templates/exports';
import { NavController } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { FoodsApiService } from '../../../features/foods/services/food.service';
import { ToastService } from '../../../core/services/toast.service';
import { SessionService } from '../../../core/services/session.service';
import { Subscription } from 'rxjs';
import { SelectOption } from '../../../shared/ui/templates/inputs/selected-input/selected-input.component';
import { EnumCategoria, CategoriasLabels } from '../../../core/enums/categoria.enum';

@Component({
  selector: 'app-food-form',
  templateUrl: './food-form.component.html',
  styleUrls: ['./food-form.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ModelPageComponent,
    TextInputComponent,
    TextareaInputComponent,
    SelectedInputComponent,
    SelectModalComponent,
    ImagePlaceholderComponent,
    PrimaryButtonComponent,
    ConfirmationModalComponent,
    ImageCircleComponent
  ],
  host: { class: 'ion-page' }
})
export class FoodFormComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  primaryColor$ = this.themeService.primaryColor$;
  secondaryColor$ = this.themeService.secondaryColor$;
  accentColor$ = this.themeService.accentColor$;

  isEditMode = false;
  foodId: number | null = null;
  pageTitle = 'Nova Comida';

  foodName = '';
  foodDescription = '';
  selectedCategory = '';
  imagePreview: string | null = null;
  selectedFile: File | null = null;

  showDeleteModal = false;
  showCategoryModal = false;
  categoryOptions: SelectOption[] = [];

  private subs = new Subscription();

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private themeService: ThemeService,
    private foodsApiService: FoodsApiService,
    private toastService: ToastService,
    private sessionService: SessionService
  ) {
    this.initializeCategoryOptions();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.foodId = Number(id);
      this.isEditMode = true;
      this.pageTitle = 'Editar Comida';
      this.loadFood(this.foodId);
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private initializeCategoryOptions() {
    this.categoryOptions = [
      { value: EnumCategoria.ALMOCO, label: CategoriasLabels[EnumCategoria.ALMOCO] },
      { value: EnumCategoria.JANTAR, label: CategoriasLabels[EnumCategoria.JANTAR] },
      { value: EnumCategoria.CASAMENTO, label: CategoriasLabels[EnumCategoria.CASAMENTO] },
      { value: EnumCategoria.ANIVERSARIO, label: CategoriasLabels[EnumCategoria.ANIVERSARIO] },
      { value: EnumCategoria.FORMATURA, label: CategoriasLabels[EnumCategoria.FORMATURA] },
      { value: EnumCategoria.CONFRATERNIZACAO, label: CategoriasLabels[EnumCategoria.CONFRATERNIZACAO] },
      { value: EnumCategoria.BATIZADO, label: CategoriasLabels[EnumCategoria.BATIZADO] },
      { value: EnumCategoria.BODAS, label: CategoriasLabels[EnumCategoria.BODAS] },
      { value: EnumCategoria.CHA_REVELACAO, label: CategoriasLabels[EnumCategoria.CHA_REVELACAO] },
      { value: EnumCategoria.NOIVADO, label: CategoriasLabels[EnumCategoria.NOIVADO] },
      { value: EnumCategoria.NATAL, label: CategoriasLabels[EnumCategoria.NATAL] },
      { value: EnumCategoria.OUTROS, label: CategoriasLabels[EnumCategoria.OUTROS] }
    ];
  }

  loadFood(id: number) {
    this.fetchFood(id);
  }

  private fetchFood(id: number) {
    this.subs.add(
      this.foodsApiService.getById(id).subscribe({
        next: (food) => {
          this.foodName = food.nome;
          this.foodDescription = food.descricao;
          this.selectedCategory = food.categoria;
          this.imagePreview = food.imageUrl || null;
        },
        error: (err: any) => {
          console.error('Erro ao carregar comida', err);
          this.toastService.error('Não foi possível carregar os dados da comida.');
          this.navCtrl.navigateBack('/admin/manage-foods');
        }
      })
    );
  }

  onImageSelect() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onCategoryClick() {
    this.showCategoryModal = true;
  }

  onCategoryModalClose() {
    this.showCategoryModal = false;
  }

  onCategorySelect(value: string) {
    this.selectedCategory = value;
    this.showCategoryModal = false;
  }

  onBackClick() {
    this.navCtrl.navigateBack('/admin/manage-foods');
  }

  onSubmit() {
    if (!this.foodName || !this.foodDescription || !this.selectedCategory) {
      this.toastService.warning('Preencha todos os campos obrigatórios.');
      return;
    }

    if (this.isEditMode && this.foodId) {
      this.updateFood(this.foodId);
    } else {
      this.createFood();
    }
  }

  private createFood() {
    const user = this.sessionService.getUser();
    if (!user?.id) {
      this.toastService.error('Erro ao identificar usuário');
      return;
    }

    this.subs.add(
      this.foodsApiService.create({
        nome: this.foodName,
        descricao: this.foodDescription,
        categoria: this.selectedCategory as EnumCategoria
      }, user.id, this.selectedFile || undefined).subscribe({
        next: () => {
          this.toastService.success('Comida criada com sucesso!');
          this.navCtrl.navigateBack('/admin/manage-foods');
        },
        error: (err: any) => {
          console.error('Erro ao criar comida', err);
          this.toastService.error('Não foi possível criar a comida.');
        }
      })
    );
  }

  private updateFood(id: number) {
    const user = this.sessionService.getUser();
    if (!user?.id) {
      this.toastService.error('Erro ao identificar usuário');
      return;
    }

    this.subs.add(
      this.foodsApiService.update(id, {
        nome: this.foodName,
        descricao: this.foodDescription,
        categoria: this.selectedCategory as EnumCategoria
      }, user.id, this.selectedFile || undefined).subscribe({
        next: () => {
          this.toastService.success('Comida atualizada com sucesso!');
          this.navCtrl.navigateBack('/admin/manage-foods');
        },
        error: (err: any) => {
          console.error('Erro ao atualizar comida', err);
          this.toastService.error('Não foi possível atualizar a comida.');
        }
      })
    );
  }

  onDeleteClick() {
    this.showDeleteModal = true;
  }

  onDeleteModalClose() {
    this.showDeleteModal = false;
  }

  onDeleteModalConfirm() {
    this.showDeleteModal = false;
  }

  onDeleteModalCancel() {
    if (this.isEditMode && this.foodId) {
      this.deleteFood(this.foodId);
    }
    this.showDeleteModal = false;
  }

  private deleteFood(id: number) {
    const user = this.sessionService.getUser();
    if (!user?.id) {
      this.toastService.error('Erro ao identificar usuário');
      return;
    }

    this.subs.add(
      this.foodsApiService.delete(id, user.id, true).subscribe({
        next: () => {
          this.toastService.success('Comida excluída com sucesso!');
          this.navCtrl.navigateBack('/admin/manage-foods');
        },
        error: (err: any) => {
          console.error('Erro ao excluir comida', err);
          this.toastService.error('Não foi possível excluir a comida.');
        }
      })
    );
  }
}
