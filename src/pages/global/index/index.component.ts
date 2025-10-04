import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonContent, NavController} from '@ionic/angular/standalone';
import { ThemeService } from '../../../shared/config/theme.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  standalone: true,
  imports: [CommonModule, IonContent],
  host: { class: 'ion-page' }
})
export class IndexComponent implements OnInit {
  primaryColor = '';
  logoUrl = '';

  constructor(private navCtrl: NavController, private themeService: ThemeService) {}

  ngOnInit() {
    const theme = this.themeService.getCurrentTheme();

    if (theme) {
      this.primaryColor = theme.primaryColor;
      this.logoUrl = theme.logo;
    }

    setTimeout(() => {
      this.navCtrl.navigateRoot('/welcome');
    }, 3000);
  }
}
