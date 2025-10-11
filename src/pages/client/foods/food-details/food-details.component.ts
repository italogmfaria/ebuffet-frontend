import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavController, IonImg } from '@ionic/angular/standalone';
import { ModelPageComponent } from "../../../../shared/ui/templates/pages/model-page/model-page.component";
import { ImagePlaceholderComponent, PrimaryButtonComponent } from '../../../../shared/ui/templates/exports';
import { DetailBagdeComponent } from '../../../../shared/ui/templates/badges/detail-bagde/detail-bagde.component';
import { ThemeService } from '../../../../shared/services/theme.service';
import { OrderService } from '../../../../shared/services/order.service';
import { ComidaDetailDTO } from '../../../../features/foods/model/foods.model';
import { CategoriasLabels } from '../../../../features/shared/enums/categoria.enum';
import {filter} from "rxjs/operators";
import {FoodsApiService} from "../../../../shared/services/food.service";
import {ToastService} from "../../../../shared/services/toast.service";
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

  private subs = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private themeService: ThemeService,
    private orderService: OrderService,
    private foodsApiService: FoodsApiService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.foodId = Number(this.route.snapshot.paramMap.get('id')) || 0;

    this.subs.add(
      this.route.queryParams.subscribe(params => {
        this.foodName = params['name'] || 'Detalhes da Comida';
      })
    );

    this.loadFoodDetails();
  }

  ngOnDestroy() { this.subs.unsubscribe(); }

  private loadFoodDetails() {
    const buffetIdSync = this.themeService.getBuffetIdSync();
    if (buffetIdSync) {
      this.fetchDetails(buffetIdSync, this.foodId);
      return;
    }

    this.subs.add(
      this.themeService.buffetId$
        .pipe(filter((id): id is number => id !== null))
        .subscribe(id => this.fetchDetails(id, this.foodId))
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
    this.navCtrl.navigateBack('/client/foods');
  }

  onAddToReserve() {
    if (!this.foodDetails) return;
    this.orderService.addItem({
      title: this.foodDetails.nome,
      description: this.foodDetails.descricao,
      imageUrl: this.foodDetails.imageUrl || ''
    });
    this.navCtrl.navigateForward('/client/order');
  }
}
