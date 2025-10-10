import { Component, OnInit, Output, EventEmitter, Input, OnChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../../services/theme.service';
import { IonChip } from '@ionic/angular/standalone';
import { EnumCategoria, CategoriasLabels } from '../../../../../../features/shared/enums/categoria.enum';

interface Category {
  id: string;
  name: string;
  selected: boolean;
}

@Component({
  selector: 'app-default-categories',
  templateUrl: './default-categories.component.html',
  styleUrls: ['./default-categories.component.scss'],
  standalone: true,
  imports: [CommonModule, IonChip]
})
export class DefaultCategoriesComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() selectedCategoryId: string = 'todos';
  @Output() categorySelected = new EventEmitter<string>();
  @ViewChild('categoriesContainer') categoriesContainer!: ElementRef<HTMLDivElement>;

  primaryColor$ = this.themeService.primaryColor$;
  secondaryColor$ = this.themeService.secondaryColor$;
  accentColor$ = this.themeService.accentColor$;

  categories: Category[] = [];

  // Mapeamento de enum para ID (usado no componente)
  private enumToIdMapping: Record<EnumCategoria, string> = {
    [EnumCategoria.CASAMENTO]: 'casamento',
    [EnumCategoria.ANIVERSARIO]: 'aniversario',
    [EnumCategoria.FORMATURA]: 'formatura',
    [EnumCategoria.CONFRATERNIZACAO]: 'confraternizacao',
    [EnumCategoria.BATIZADO]: 'batizado',
    [EnumCategoria.BODAS]: 'bodas',
    [EnumCategoria.CHA_REVELACAO]: 'cha-revelacao',
    [EnumCategoria.NOIVADO]: 'noivado',
    [EnumCategoria.JANTAR]: 'jantar',
    [EnumCategoria.ALMOCO]: 'almoco',
    [EnumCategoria.NATAL]: 'natal',
    [EnumCategoria.CAFE_DA_MANHA]: 'cafe',
    [EnumCategoria.HAPPY_HOUR]: 'happy-hour',
    [EnumCategoria.OUTROS]: 'outros'
  };

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    // Gera as categorias dinamicamente a partir do enum
    this.buildCategories();
  }

  ngAfterViewInit() {
    // Scroll inicial para a categoria selecionada
    setTimeout(() => {
      this.scrollToSelectedCategory();
    }, 100);
  }

  ngOnChanges() {
    // Atualiza a seleção quando o input muda
    if (this.categories.length > 0) {
      this.updateSelectedCategory();
      // Scroll para a categoria selecionada quando o input muda
      setTimeout(() => {
        this.scrollToSelectedCategory();
      }, 100);
    }
  }

  private buildCategories() {
    // Adiciona a categoria "TODOS" primeiro
    this.categories = [
      { id: 'todos', name: 'TODOS', selected: this.selectedCategoryId === 'todos' }
    ];

    // Adiciona todas as categorias do enum
    Object.values(EnumCategoria).forEach((enumValue) => {
      const id = this.enumToIdMapping[enumValue];
      const label = CategoriasLabels[enumValue].toUpperCase();

      this.categories.push({
        id: id,
        name: label,
        selected: id === this.selectedCategoryId
      });
    });
  }

  private updateSelectedCategory() {
    this.categories = this.categories.map(category => ({
      ...category,
      selected: category.id === this.selectedCategoryId
    }));
  }

  private scrollToSelectedCategory() {
    if (!this.categoriesContainer) return;

    const selectedElement = this.categoriesContainer.nativeElement.querySelector(`#category-${this.selectedCategoryId}`) as HTMLElement;

    if (selectedElement) {
      const container = this.categoriesContainer.nativeElement;
      const elementLeft = selectedElement.offsetLeft;
      const elementWidth = selectedElement.offsetWidth;
      const containerWidth = container.offsetWidth;

      // Calcula a posição de scroll para centralizar o elemento
      const scrollPosition = elementLeft - (containerWidth / 2) + (elementWidth / 2);

      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }

  onCategoryClick(selectedId: string) {
    this.categories = this.categories.map(category => ({
      ...category,
      selected: category.id === selectedId
    }));
    this.categorySelected.emit(selectedId);

    // Scroll para a categoria clicada
    setTimeout(() => {
      this.scrollToSelectedCategory();
    }, 0);
  }
}
