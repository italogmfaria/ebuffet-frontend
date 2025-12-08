import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavController, IonImg } from '@ionic/angular/standalone';
import { ModelPageComponent } from "../../../../shared/ui/templates/pages/model-page/model-page.component";
import { ImagePlaceholderComponent, PrimaryButtonComponent } from '../../../../shared/ui/templates/exports';
import { DetailBagdeComponent } from '../../../../shared/ui/templates/badges/detail-bagde/detail-bagde.component';
import { ThemeService } from '../../../../shared/services/theme.service';
import { OrderService } from '../../../../shared/services/order.service';
import { ServicesApiService } from '../../../../features/services/api/services.api';
import { ServicoDetailDTO } from '../../../../features/services/model/services.model';
import { CategoriasLabels } from '../../../../features/shared/enums/categoria.enum';
import {filter} from "rxjs/operators";
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
  private subs = new Subscription();

  // Edit mode tracking
  private fromEdit: string = '';
  private editId: string = '';

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private themeService: ThemeService,
    private orderService: OrderService,
    private servicesApiService: ServicesApiService,
    // private toast: ToastService
  ) {}

  ngOnInit() {
    this.serviceId = Number(this.route.snapshot.paramMap.get('id'));
    this.subs.add(
      this.route.queryParams.subscribe(params => {
        this.serviceName = params['name'] || 'Detalhes do Serviço';
        this.isFromOrder = params['fromOrder'] === 'true';

        // Capture edit mode params
        this.fromEdit = params['fromEdit'] || '';
        this.editId = params['editId'] || '';
      })
    );
    this.loadServiceDetails();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private loadServiceDetails() {
    const buffetIdSync = this.themeService.getBuffetIdSync?.() ?? null;
    if (buffetIdSync) {
      this.fetchDetails(buffetIdSync, this.serviceId);
      return;
    }

    this.subs.add(
      this.themeService.buffetId$
        .pipe(filter((id): id is number => id !== null))
        .subscribe(id => this.fetchDetails(id, this.serviceId))
    );
  }

  private fetchDetails(buffetId: number, id: number) {
    this.subs.add(
      this.servicesApiService.getById(buffetId, id).subscribe({
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
    if (this.fromEdit === 'reserve') {
      this.navCtrl.navigateBack('/reserves/reserve-edit', {
        queryParams: { id: this.editId }
      });
    } else if (this.fromEdit === 'event') {
      this.navCtrl.navigateBack('/events/event-edit', {
        queryParams: { id: this.editId }
      });
    } else {
      this.navCtrl.back();
    }
  }

  onAddToReserve() {
    if (!this.serviceDetails) return;
    this.orderService.addItem({
      id: this.serviceDetails.id,
      title: this.serviceDetails.nome,
      description: this.serviceDetails.descricao,
      imageUrl: this.serviceDetails.imageUrl || '',
      type: 'service'
    });

    // Redireciona para a página de edição se vier de lá
    if (this.fromEdit === 'reserve') {
      this.navCtrl.navigateForward('/reserves/reserve-edit', {
        queryParams: { id: this.editId }
      });
    } else if (this.fromEdit === 'event') {
      this.navCtrl.navigateForward('/events/event-edit', {
        queryParams: { id: this.editId }
      });
    } else {
      this.navCtrl.navigateForward('/client/order');
    }
  }

  onBackToOrder() {
    this.navCtrl.back();
  }

  get isInViewMode(): boolean {
    return this.isFromOrder || !!this.fromEdit;
  }
}
