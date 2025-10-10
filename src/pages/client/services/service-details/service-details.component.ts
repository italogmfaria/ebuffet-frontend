import { Component, OnInit } from '@angular/core';
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
export class ServiceDetailsComponent implements OnInit {
  serviceId: number = 0;
  serviceName: string = '';
  primaryColor$ = this.themeService.primaryColor$;
  secondaryColor$ = this.themeService.secondaryColor$;

  serviceDetails: ServicoDetailDTO | null = null;
  protected readonly CategoriasLabels = CategoriasLabels;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private themeService: ThemeService,
    private orderService: OrderService,
    private servicesApiService: ServicesApiService
  ) { }

  ngOnInit() {
    // Captura o ID da rota
    this.serviceId = Number(this.route.snapshot.paramMap.get('id'));

    // Captura o nome do serviço dos query params
    this.route.queryParams.subscribe(params => {
      this.serviceName = params['name'] || 'Detalhes do Serviço';
    });

    this.loadServiceDetails();
  }

  loadServiceDetails() {
    this.servicesApiService.getServiceById(this.serviceId).subscribe(service => {
      this.serviceDetails = service;
      if (this.serviceDetails) {
        this.serviceName = this.serviceDetails.nome;
      }
    });
  }

  onBackClick() {
    this.navCtrl.navigateBack('/client/services');
  }

  onAddToReserve() {
    if (this.serviceDetails) {
      this.orderService.addItem({
        title: this.serviceDetails.nome,
        description: this.serviceDetails.descricao,
        imageUrl: this.serviceDetails.imageUrl || ''
      });

      this.navCtrl.navigateForward('/client/order');
    }
  }
}
