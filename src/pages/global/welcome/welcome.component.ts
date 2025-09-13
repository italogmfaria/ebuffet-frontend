import { Component, OnInit } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonButton]
})
export class WelcomeComponent implements OnInit {
  primaryColor = '';
  secondaryColor = '';
  textColor = '';
  bannerUrl = '';

  async ngOnInit() {
    const theme = await fetch(`assets/buffets/${environment.buffetId}/theme.json`).then(r => r.json());

    this.primaryColor = theme.primaryColor;
    this.secondaryColor = theme.secondaryColor;
    this.textColor = theme.textColor;
    this.bannerUrl = theme.banner;

    document.documentElement.style.setProperty('--ion-color-primary', theme.primaryColor);
    document.documentElement.style.setProperty('--ion-color-secondary', theme.secondaryColor);
  }
}
