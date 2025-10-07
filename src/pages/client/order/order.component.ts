import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelPageComponent, ClientNavbarComponent } from '../../../shared/ui/templates/exports';
import { IonGrid, NavController } from '@ionic/angular/standalone';
import { ThemeService } from '../../../shared/services/theme.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  standalone: true,
  imports: [CommonModule, ModelPageComponent, IonGrid, ClientNavbarComponent],
  host: { class: 'ion-page' }
})
export class OrderComponent implements OnInit {
  primaryColor = '';
  secondaryColor = '';
  accentColor = '';
  cartItemCount = 1;

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
  }

  onBackClick() {
    this.navCtrl.navigateBack('/client/home');
  }
}
