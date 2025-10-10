import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavController, IonImg } from '@ionic/angular/standalone';
import { ModelPageComponent } from "../../../../shared/ui/templates/pages/model-page/model-page.component";
import { ImagePlaceholderComponent, PrimaryButtonComponent } from '../../../../shared/ui/templates/exports';
import { DetailBagdeComponent } from '../../../../shared/ui/templates/badges/detail-bagde/detail-bagde.component';
import { ThemeService } from '../../../../shared/services/theme.service';
import { OrderService } from '../../../../shared/services/order.service';
import { FoodsApiService } from '../../../../features/foods/api/foods.api';
import { ComidaDetailDTO } from '../../../../features/foods/model/foods.model';
import { CategoriasLabels } from '../../../../features/shared/enums/categoria.enum';

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
export class FoodDetailsComponent implements OnInit {
  foodId: number = 0;
  foodName: string = '';
  primaryColor$ = this.themeService.primaryColor$;
  secondaryColor$ = this.themeService.secondaryColor$;

  foodDetails: ComidaDetailDTO | null = null;
  protected readonly CategoriasLabels = CategoriasLabels;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private themeService: ThemeService,
    private orderService: OrderService,
    private foodsApiService: FoodsApiService
  ) { }

  ngOnInit() {
    // Captura o ID da rota
    this.foodId = Number(this.route.snapshot.paramMap.get('id'));

    // Captura o nome da comida dos query params
    this.route.queryParams.subscribe(params => {
      this.foodName = params['name'] || 'Detalhes da Comida';
    });

    this.loadFoodDetails();
  }

  loadFoodDetails() {
    this.foodsApiService.getFoodById(this.foodId).subscribe(food => {
      this.foodDetails = food;
      if (this.foodDetails) {
        this.foodName = this.foodDetails.nome;
      }
    });
  }

  onBackClick() {
    this.navCtrl.navigateBack('/client/foods');
  }

  onAddToReserve() {
    if (this.foodDetails) {
      this.orderService.addItem({
        title: this.foodDetails.nome,
        description: this.foodDetails.descricao,
        imageUrl: this.foodDetails.imageUrl || ''
      });

      this.navCtrl.navigateForward('/client/order');
    }
  }
}
