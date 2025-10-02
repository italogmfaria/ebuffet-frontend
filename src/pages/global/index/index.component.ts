import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonContent, NavController} from '@ionic/angular/standalone';
import { environment } from '../../../environments/environment';

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

  constructor(private navCtrl: NavController) {}

  async ngOnInit() {
    try {
      const theme = await fetch(`assets/buffets/${environment.buffetId}/theme.json`).then(r => r.json());

      this.primaryColor = theme.primaryColor || '';
      this.logoUrl = theme.logo || '';
      if (this.primaryColor) {
        document.documentElement.style.setProperty('--ion-color-primary', theme.primaryColor);
      }

      setTimeout(() => {
        this.navCtrl.navigateRoot('/welcome');
      }, 3000);
    } catch (err) {
      console.warn('Erro ao carregar theme.json na IndexComponent', err);
      setTimeout(() => {
        this.navCtrl.navigateRoot('/welcome');
      }, 3000);
    }
  }
}
