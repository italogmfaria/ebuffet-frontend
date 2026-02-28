import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavController, IonImg } from '@ionic/angular/standalone';
import { ModelPageComponent } from "../../../../shared/ui/templates/pages/model-page/model-page.component";
import { ImagePlaceholderComponent, PrimaryButtonComponent } from '../../../../shared/ui/templates/exports';
import { DetailBagdeComponent } from '../../../../shared/ui/templates/badges/detail-bagde/detail-bagde.component';
import { ThemeService } from '../../../../core/services/theme.service';
import { OrderService } from '../../../../features/orders/services/order.service';
import { ServicesApiService } from '../../../../features/services/api/services.api';
import { ServicoDetailDTO } from '../../../../features/services/model/services.model';
import { CategoriasLabels } from '../../../../core/enums/categoria.enum';
import { ToastService } from '../../../../core/services/toast.service';
import { EditStateService } from '../../../../core/services/edit-state.service';
import {Subscription} from "rxjs";

@Component({
    selector: 'app-service-details',
    templateUrl: './service-details.component.html',
    styleUrls: ['./service-details.component.scss'],
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
export class ServiceDetailsComponent implements OnInit, OnDestroy {
  serviceId = 0;
  serviceName = '';
  primaryColor$ = this.themeService.primaryColor$;
  secondaryColor$ = this.themeService.secondaryColor$;

  serviceDetails: ServicoDetailDTO | null = null;
  protected readonly CategoriasLabels = CategoriasLabels;

  isFromOrder = false;
  isViewOnly = false; // Para buffet visualizar sem adicionar
  private subs = new Subscription();

  // Navigation tracking
  private fromEdit: string = '';
  private editId: string = '';
  private fromPage: string = ''; // Página de origem (services, reserves, events, etc)
  private fromDetailsId: string = ''; // ID da reserva/evento quando vem de details

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private themeService: ThemeService,
    private orderService: OrderService,
    private servicesApiService: ServicesApiService,
    private toast: ToastService,
    private editStateService: EditStateService
  ) {}

  ngOnInit() {
    this.serviceId = Number(this.route.snapshot.paramMap.get('id'));
    this.subs.add(
      this.route.queryParams.subscribe(params => {
        this.serviceName = params['name'] || 'Detalhes do Serviço';
        this.isFromOrder = params['fromOrder'] === 'true';
        this.isViewOnly = params['viewOnly'] === 'true';

        // Capture edit mode params
        this.fromEdit = params['fromEdit'] || '';
        this.editId = params['editId'] || '';
        this.fromPage = params['fromPage'] || ''; // Captura página de origem
        this.fromDetailsId = params['fromDetailsId'] || ''; // ID da reserva/evento de details
      })
    );
    this.loadServiceDetails();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private loadServiceDetails() {
    this.fetchDetails(this.serviceId);
  }

  private fetchDetails(id: number) {
    this.subs.add(
      this.servicesApiService.getById(id).subscribe({
        next: service => {
          this.serviceDetails = service;
          this.serviceName = service?.nome || this.serviceName;
        },
        error: err => {
          console.error('Erro ao carregar detalhes do serviço', err);
          // this.toast?.error?.('Não foi possível carregar os detalhes.');
          this.navCtrl.back();
        }
      })
    );
  }

  onBackClick() {
    // Usa a mesma lógica inteligente de navegação
    this.onBackToOrder();
  }

  onAddToReserve() {
    if (!this.serviceDetails) return;

    if (this.fromEdit === 'reserve' || this.fromEdit === 'event') {
      const context = this.fromEdit === 'reserve' ? 'reserve-edit' : 'event-edit';

      // Usa EditStateService para gerenciar estado
      const wasAdded = this.editStateService.addItem(context, {
        id: this.serviceDetails.id,
        title: this.serviceDetails.nome,
        description: this.serviceDetails.descricao,
        imageUrl: this.serviceDetails.imageUrl || '',
        type: 'service'
      });

      if (wasAdded) {
        this.toast.success(`${this.serviceDetails.nome} adicionado!`);
      } else {
        const entityType = context === 'reserve-edit' ? 'reserva' : 'evento';
        this.toast.warning(`${this.serviceDetails.nome} já foi adicionado à ${entityType}!`);
      }

      // Redireciona de volta
      const route = context === 'reserve-edit' ? '/reserves/reserve-edit' : '/events/event-edit';
      this.navCtrl.navigateBack(route, {
        queryParams: { id: this.editId }
      });
    } else {
      // Contexto 'order' (carrinho normal)
      const wasAdded = this.orderService.addItem({
        id: this.serviceDetails.id,
        title: this.serviceDetails.nome,
        description: this.serviceDetails.descricao,
        imageUrl: this.serviceDetails.imageUrl || '',
        type: 'service'
      }, 'order');

      if (wasAdded) {
        this.toast.success(`${this.serviceDetails.nome} adicionado!`);
      } else {
        this.toast.warning(`${this.serviceDetails.nome} já foi adicionado ao pedido!`);
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
    } else if (this.fromPage === 'services') {
      // Voltando de services
      this.navCtrl.navigateBack('/client/services');
    } else if (this.isViewOnly) {
      // Se for viewOnly (buffet), volta usando histórico
      this.navCtrl.back();
    } else {
      // Default: volta para order ou services
      if (this.isFromOrder) {
        this.navCtrl.navigateBack('/client/order');
      } else {
        this.navCtrl.navigateBack('/client/services');
      }
    }
  }

  get isInViewMode(): boolean {
    return this.isFromOrder || !!this.fromEdit || this.isViewOnly;
  }
}
