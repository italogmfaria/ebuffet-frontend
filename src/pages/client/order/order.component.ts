import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelPageComponent, ClientNavbarComponent, DefaultItemCardComponent } from '../../../shared/ui/templates/exports';
import { NavController } from '@ionic/angular/standalone';
import { ThemeService } from '../../../shared/services/theme.service';
import { OrderService, OrderItem } from '../../../shared/services/order.service';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  standalone: true,
  imports: [CommonModule, ModelPageComponent, IonicModule, ClientNavbarComponent, DefaultItemCardComponent],
  host: { class: 'ion-page' }
})
export class OrderComponent implements OnInit {
  primaryColor$ = this.themeService.primaryColor$;
  secondaryColor$ = this.themeService.secondaryColor$;
  accentColor$ = this.themeService.accentColor$;
  cartItemCount = 0;
  orderItems: OrderItem[] = [];

  constructor(
    private themeService: ThemeService,
    private navCtrl: NavController,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    // Subscribe to order items
    this.orderService.orderItems$.subscribe((items) => {
      this.orderItems = items;
      this.cartItemCount = this.orderService.getTotalItems();
    });
  }

  onBackClick() {
    this.navCtrl.navigateBack('/client/home');
  }

  onRemoveFromOrder(title: string) {
    this.orderService.removeItem(title);
  }
}
