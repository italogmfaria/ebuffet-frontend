import { Component, OnInit } from '@angular/core';
import {CommonModule} from "@angular/common";
import { FormPageComponent, QueryBadgeComponent, DetailBagdeComponent, ConfirmationModalComponent } from '../../../shared/ui/templates/exports';
import { IonGrid, NavController } from "@ionic/angular/standalone";
import { ThemeService } from '../../../shared/services/theme.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, FormPageComponent, IonGrid, ConfirmationModalComponent],
  host: { class: 'ion-page' }
})
export class HomeComponent implements OnInit {
  primaryColor = '';
  secondaryColor = '';
  accentColor = '';
  showExitModal = false;

  constructor(private themeService: ThemeService, private navCtrl: NavController) {}

  ngOnInit() {
    const theme = this.themeService.getCurrentTheme();

    if (theme) {
      this.primaryColor = theme.primaryColor;
      this.secondaryColor = theme.secondaryColor;
      this.accentColor = theme.accentColor;
    }
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

}
