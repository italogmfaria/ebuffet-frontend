import { Component, OnInit } from '@angular/core';
import {CommonModule} from "@angular/common";
import { FormPageComponent } from '../../../shared/ui/templates/exports';
import { IonGrid } from "@ionic/angular/standalone";
import {environment} from "../../../environments/environment";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, FormPageComponent, IonGrid],
  host: { class: 'ion-page' }
})
export class HomeComponent implements OnInit {
  primaryColor = '';
  secondaryColor = '';
  accentColor = '';

  constructor() {}

  async ngOnInit() {
    try {
      const theme = await fetch(`assets/buffets/${environment.buffetId}/theme.json`).then(r => r.json());

      this.primaryColor = theme.primaryColor || '';
      this.secondaryColor = theme.secondaryColor || '';
      this.accentColor = theme.accentColor || '';

      if (this.primaryColor) {
        document.documentElement.style.setProperty('--ion-color-primary', this.primaryColor);
      }
      if (this.secondaryColor) {
        document.documentElement.style.setProperty('--ion-color-secondary', this.secondaryColor);
      }
      if (this.accentColor) {
        document.documentElement.style.setProperty('--ion-color-tertiary', this.accentColor);
      }
    } catch (err) {
      console.warn('Erro ao carregar o theme.json', err);
    }
  }

}
