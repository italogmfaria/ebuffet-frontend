import { Component, OnInit } from '@angular/core';
import {CommonModule} from "@angular/common";
import { FormPageComponent, ConfirmationModalComponent, ClientNavbarComponent } from '../../../shared/ui/templates/exports';
import { IonGrid, NavController } from "@ionic/angular/standalone";
import { ThemeService } from '../../../shared/services/theme.service';
import {HomeCarouselComponent} from "./home-carousel/home-carousel.component";
import {HomeCategoriesComponent} from "./home-categories/home-categories.component";
import {HomeCalendarComponent} from "./home-calendar/home-calendar.component";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, FormPageComponent, IonGrid, ConfirmationModalComponent, ClientNavbarComponent, HomeCarouselComponent, HomeCategoriesComponent, HomeCalendarComponent],
  host: { class: 'ion-page' }
})
export class HomeComponent implements OnInit {
  primaryColor = '';
  secondaryColor = '';
  accentColor = '';
  showExitModal = false;

  // TODO: Buscar do backend quando implementar o service
  userName = 'Usuário';
  cartItemCount = 1; // Exemplo de contador do carrinho

  constructor(
    private themeService: ThemeService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    const theme = this.themeService.getCurrentTheme();

    if (theme) {
      this.primaryColor = theme.primaryColor;
      this.secondaryColor = theme.secondaryColor;
      this.accentColor = theme.accentColor;
    }

    // TODO: Implementar chamada ao backend para buscar dados do usuário
    // this.loadUserData();
  }

  onBackClick() {
    this.showExitModal = true;
  }

  onConfirmExit() {
    this.showExitModal = false;
    this.navCtrl.navigateBack('/welcome');
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
