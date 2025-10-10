import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelPageComponent, ClientNavbarComponent, LogoutCircleComponent, EditCircleComponent, ConfirmationModalComponent } from '../../../shared/ui/templates/exports';
import { IonGrid, NavController } from '@ionic/angular/standalone';
import { ThemeService } from '../../../shared/services/theme.service';
import { SessionService } from '../../../shared/services/session.service';
import { OrderService } from '../../../shared/services/order.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [CommonModule, ModelPageComponent, IonGrid, ConfirmationModalComponent, ClientNavbarComponent, LogoutCircleComponent, EditCircleComponent],
  host: { class: 'ion-page' }
})
export class ProfileComponent implements OnInit {
  primaryColor$ = this.themeService.primaryColor$;
  secondaryColor$ = this.themeService.secondaryColor$;
  accentColor$ = this.themeService.accentColor$;
  @Input() cartItemCount = 0;
  userName = 'Usuário';
  showLogoutModal = false;

  constructor(
    private themeService: ThemeService,
    private navCtrl: NavController
    ,private sessionService: SessionService
    ,private orderService: OrderService
  ) {}

  ngOnInit() {
    // Subscribe to order items to update cart count
    this.orderService.orderItems$.subscribe(() => {
      this.cartItemCount = this.orderService.getTotalItems();
    });
  }

  onBackClick() {
    this.navCtrl.navigateBack('/client/home');
  }

  onLogout() {
    // Abre modal de confirmação antes de efetuar o logout
    this.showLogoutModal = true;
  }

  onConfirmLogout() {
    this.showLogoutModal = false;
    try {
      this.sessionService.logout();
    } catch (e) {
      console.error('Error while logging out from profile', e);
    }
    this.navCtrl.navigateRoot('/welcome');
  }

  onCancelLogout() {
    this.showLogoutModal = false;
  }

  onCloseModal() {
    this.showLogoutModal = false;
  }

  onEdit() {
    // TODO: Implementar lógica de edição de perfil
    console.log('Edit profile clicked');
  }
}
