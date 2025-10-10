import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import { FormPageComponent, ConfirmationModalComponent, ClientNavbarComponent } from '../../../shared/ui/templates/exports';
import { IonGrid, NavController } from "@ionic/angular/standalone";
import { ThemeService } from '../../../shared/services/theme.service';
import {HomeCarouselComponent} from "./home-carousel/home-carousel.component";
import {HomeCategoriesComponent} from "./home-categories/home-categories.component";
import {HomeCalendarComponent} from "./home-calendar/home-calendar.component";
import { SessionService } from '../../../shared/services/session.service';
import { OrderService } from '../../../shared/services/order.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, FormPageComponent, IonGrid, ConfirmationModalComponent, ClientNavbarComponent, HomeCarouselComponent, HomeCategoriesComponent, HomeCalendarComponent],
  host: { class: 'ion-page' }
})
export class HomeComponent implements OnInit {
  @Input() cartItemCount = 0;
  primaryColor$ = this.themeService.primaryColor$;
  secondaryColor$ = this.themeService.secondaryColor$;
  accentColor$ = this.themeService.accentColor$;
  showExitModal = false;

  // TODO: Buscar do backend quando implementar o service
  userName = 'Usuário';


  constructor(
    private themeService: ThemeService,
    private navCtrl: NavController,
    private sessionService: SessionService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    // Subscribe to order items to update cart count
    this.orderService.orderItems$.subscribe(() => {
      this.cartItemCount = this.orderService.getTotalItems();
    });

    // TODO: Implementar chamada ao backend para buscar dados do usuário
    // this.loadUserData();
  }

  onBackClick() {
    this.showExitModal = true;
  }

  onConfirmExit() {
    this.showExitModal = false;
    // Limpa sessão persistida e redireciona para a tela pública
    try {
      this.sessionService.logout();
    } catch (e) {
      console.error('Error while logging out', e);
    }
    this.navCtrl.navigateRoot('/welcome');
  }

  onCancelExit() {
    this.showExitModal = false;
  }

  onCloseModal() {
    this.showExitModal = false;
  }

  onNotificationClick() {
    this.navCtrl.navigateForward('/notifications');
  }

}
