import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavController, IonImg } from '@ionic/angular/standalone';
import { ModelPageComponent } from "../../../../shared/ui/templates/pages/model-page/model-page.component";
import { ImagePlaceholderComponent, PrimaryButtonComponent } from '../../../../shared/ui/templates/exports';
import { DetailBagdeComponent } from '../../../../shared/ui/templates/badges/detail-bagde/detail-bagde.component';
import { ThemeService } from '../../../../core/services/theme.service';
import { OrderService } from '../../../../features/orders/services/order.service';
import { ComidaDetailDTO } from '../../../../features/foods/model/foods.model';
import { CategoriasLabels } from '../../../../core/enums/categoria.enum';
import { EditStateService } from '../../../../core/services/edit-state.service';
import {filter} from "rxjs/operators";
import {FoodsApiService} from "../../../../features/foods/services/food.service";
import {ToastService} from "../../../../core/services/toast.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-food-details',
    templateUrl: './food-details.component.html',
    styleUrls: ['./food-details.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        IonImg,
        ModelPageComponent,
        ImagePlaceholderComponent,
        PrimaryButtonComponent,
        DetailBagdeComponent
    ]
})
export class FoodDetailsComponent implements OnInit, OnDestroy {
  foodId = 0;
  foodName = '';
  primaryColor$ = this.themeService.primaryColor$;
  secondaryColor$ = this.themeService.secondaryColor$;

  foodDetails: ComidaDetailDTO | null = null;
  protected readonly CategoriasLabels = CategoriasLabels;

  isFromOrder: boolean = false;
  isViewOnly: boolean = false; // Para buffet visualizar sem adicionar
  private subs = new Subscription();

  // Navigation tracking
  private fromEdit: string = '';
  private editId: string = '';
  private fromPage: string = ''; // Página de origem (foods, reserves, events, etc)
  private fromDetailsId: string = ''; // ID da reserva/evento quando vem de details

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private themeService: ThemeService,
    private orderService: OrderService,
    private foodsApiService: FoodsApiService,
    private toast: ToastService,
    private editStateService: EditStateService
  ) {}

  ngOnInit() {
    this.foodId = Number(this.route.snapshot.paramMap.get('id')) || 0;

    this.subs.add(
      this.route.queryParams.subscribe(params => {
        this.foodName = params['name'] || 'Detalhes da Comida';
        this.isFromOrder = params['fromOrder'] === 'true';
        this.isViewOnly = params['viewOnly'] === 'true';
        this.fromEdit = params['fromEdit'] || '';
        this.editId = params['editId'] || '';
        this.fromPage = params['fromPage'] || ''; // Captura página de origem
        this.fromDetailsId = params['fromDetailsId'] || ''; // ID da reserva/evento de details
      })
    );

    this.loadFoodDetails();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private loadFoodDetails() {
    const buffetIdSync = this.themeService.getBuffetIdSync();
    if (buffetIdSync) {
      this.fetchDetails(buffetIdSync, this.foodId);
      return;
    }

    this.subs.add(
      this.themeService.buffetId$
        .pipe(filter((id): id is number => id !== null))
        .subscribe(buffetId => this.fetchDetails(buffetId, this.foodId))
    );
  }

  private fetchDetails(buffetId: number, id: number) {
    this.subs.add(
      this.foodsApiService.getById(buffetId, id).subscribe({
        next: (food) => {
          this.foodDetails = food;
          this.foodName = food?.nome || this.foodName;
        },
        error: (err) => {
          console.error('Erro ao carregar detalhes da comida', err);
          this.toast.error('Não foi possível carregar os detalhes.');
          this.navCtrl.navigateBack('/client/foods');
        }
      })
    );
  }

  onBackClick() {
    // Usa a mesma lógica inteligente de navegação
    this.onBackToOrder();
  }

  onAddToReserve() {
    if (!this.foodDetails) return;

    if (this.fromEdit === 'reserve' || this.fromEdit === 'event') {
      const context = this.fromEdit === 'reserve' ? 'reserve-edit' : 'event-edit';

      // Usa EditStateService para gerenciar estado
      const wasAdded = this.editStateService.addItem(context, {
        id: this.foodDetails.id,
        title: this.foodDetails.nome,
        description: this.foodDetails.descricao,
        imageUrl: this.foodDetails.imageUrl || '',
        type: 'food'
      });

      if (wasAdded) {
        this.toast.success(`${this.foodDetails.nome} adicionado!`);
      } else {
        const entityType = context === 'reserve-edit' ? 'reserva' : 'evento';
        this.toast.warning(`${this.foodDetails.nome} já foi adicionado à ${entityType}!`);
      }

      // Redireciona de volta
      const route = context === 'reserve-edit' ? '/reserves/reserve-edit' : '/events/event-edit';
      this.navCtrl.navigateBack(route, {
        queryParams: { id: this.editId }
      });
    } else {
      // Contexto 'order' (carrinho normal)
      const wasAdded = this.orderService.addItem({
        id: this.foodDetails.id,
        title: this.foodDetails.nome,
        description: this.foodDetails.descricao,
        imageUrl: this.foodDetails.imageUrl || '',
        type: 'food'
      }, 'order');

      if (wasAdded) {
        this.toast.success(`${this.foodDetails.nome} adicionado!`);
      } else {
        this.toast.warning(`${this.foodDetails.nome} já foi adicionado ao pedido!`);
      }

      this.navCtrl.navigateForward('/client/order');
    }
  }

  onBackToOrder() {
    // Navega de volta para a página de origem
    if (this.fromEdit === 'reserve') {
      // Voltando de reserve-edit
      this.navCtrl.navigateBack('/reserves/reserve-edit', {
        queryParams: { id: this.editId }
      });
    } else if (this.fromEdit === 'event') {
      // Voltando de event-edit
      this.navCtrl.navigateBack('/events/event-edit', {
        queryParams: { id: this.editId }
      });
    } else if (this.fromPage === 'reserves' && this.fromDetailsId) {
      // Voltando de reserve-details (detalhes de uma reserva específica)
      this.navCtrl.navigateBack('/reserves/reserve-details', {
        queryParams: { id: this.fromDetailsId }
      });
    } else if (this.fromPage === 'events' && this.fromDetailsId) {
      // Voltando de event-details (detalhes de um evento específico)
      this.navCtrl.navigateBack('/events/event-details', {
        queryParams: { id: this.fromDetailsId }
      });
    } else if (this.fromPage === 'reserves') {
      // Voltando de reserves (lista geral)
      this.navCtrl.navigateBack('/reserves');
    } else if (this.fromPage === 'events') {
      // Voltando de events (lista geral)
      this.navCtrl.navigateBack('/events');
    } else if (this.fromPage === 'foods') {
      // Voltando de foods
      this.navCtrl.navigateBack('/client/foods');
    } else if (this.isViewOnly) {
      // Se for viewOnly (buffet), volta usando histórico
      this.navCtrl.back();
    } else {
      // Default: volta para order ou foods
      if (this.isFromOrder) {
        this.navCtrl.navigateBack('/client/order');
      } else {
        this.navCtrl.navigateBack('/client/foods');
      }
    }
  }

  get isInViewMode(): boolean {
    return this.isFromOrder || !!this.fromEdit || this.isViewOnly;
  }
}
