import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelPageComponent, ClientNavbarComponent, OrderItemCardComponent, PrimaryButtonComponent, ConfirmationModalComponent } from '../../../shared/ui/templates/exports';
import { NavController } from '@ionic/angular/standalone';
import { ThemeService } from '../../../core/services/theme.service';
import { OrderService, OrderItem } from '../../../features/orders/services/order.service';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  standalone: true,
  imports: [CommonModule, ModelPageComponent, IonicModule, ClientNavbarComponent, OrderItemCardComponent, PrimaryButtonComponent, ConfirmationModalComponent],
  host: { class: 'ion-page' }
})
export class OrderComponent implements OnInit {
  primaryColor$ = this.themeService.primaryColor$;
  secondaryColor$ = this.themeService.secondaryColor$;
  accentColor$ = this.themeService.accentColor$;
  cartItemCount = 0;
  orderItems: OrderItem[] = [];
  foodItems: OrderItem[] = [];
  serviceItems: OrderItem[] = [];

  showFoodModal = false;
  showServiceModal = false;
  showRemoveModal = false;
  itemToRemove: string = '';

  constructor(
    private themeService: ThemeService,
    private navCtrl: NavController,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.orderService.orderItems$.subscribe((items) => {
      this.orderItems = items;
      this.cartItemCount = this.orderService.getTotalItems();

      this.foodItems = items.filter(item => item.type === 'food' || !item.type);
      this.serviceItems = items.filter(item => item.type === 'service');
    });
  }

  get hasItems(): boolean {
    return this.foodItems.length > 0 || this.serviceItems.length > 0;
  }

  onBackClick() {
    this.navCtrl.navigateBack('/client/home');
  }

  onRemoveFromOrder(title: string) {
    this.itemToRemove = title;
    this.showRemoveModal = true;
  }

  onRemoveModalClose() {
    this.showRemoveModal = false;
    this.itemToRemove = '';
  }

  onRemoveModalConfirm() {
    this.orderService.removeItem(this.itemToRemove);
    this.showRemoveModal = false;
    this.itemToRemove = '';
  }

  onRemoveModalCancel() {
    this.showRemoveModal = false;
    this.itemToRemove = '';
  }


  onFoodItemClick(item: OrderItem) {
    if (item.id) {
      this.navCtrl.navigateForward(`/client/foods/${item.id}`, {
        queryParams: {
          name: item.title,
          fromOrder: 'true'
        }
      });
    }
  }

  onServiceItemClick(item: OrderItem) {
    if (item.id) {
      this.navCtrl.navigateForward(`/client/services/${item.id}`, {
        queryParams: {
          name: item.title,
          fromOrder: 'true'
        }
      });
    }
  }

  onContinue() {
    if (this.foodItems.length === 0) {
      this.showFoodModal = true;
      return;
    }

    if (this.serviceItems.length === 0) {
      this.showServiceModal = true;
      return;
    }

    this.proceedToNextPage();
  }

  onFoodModalClose() {
    this.showFoodModal = false;
  }

  onFoodModalConfirm() {
    this.showFoodModal = false;
    this.navCtrl.navigateBack('/client/foods');
  }

  onFoodModalCancel() {
    this.showFoodModal = false;
    this.proceedToNextPage();
  }

  onServiceModalClose() {
    this.showServiceModal = false;
  }

  onServiceModalConfirm() {
    this.showServiceModal = false;
    this.navCtrl.navigateBack('/client/services');
  }

  onServiceModalCancel() {
    this.showServiceModal = false;
    this.proceedToNextPage();
  }

  private proceedToNextPage() {
    this.navCtrl.navigateForward('/client/order/order-details');
  }
}
