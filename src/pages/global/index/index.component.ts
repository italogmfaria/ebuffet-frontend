import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular/standalone';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  standalone: true,
  imports: [CommonModule, IonContent]
})
export class IndexComponent implements OnInit {
  primaryColor = '';
  logoUrl = '';

  constructor(private navCtrl: NavController) {}

  async ngOnInit() {
    const theme = await fetch(`assets/buffets/${environment.buffetId}/theme.json`).then(r => r.json());

    this.primaryColor = theme.primaryColor;
    this.logoUrl = theme.logo;
    document.documentElement.style.setProperty('--ion-color-primary', theme.primaryColor);

    setTimeout(() => {
      this.navCtrl.navigateRoot('/welcome');
    }, 3000);
  }
}
