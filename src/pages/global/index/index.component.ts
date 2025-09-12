import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonText } from '@ionic/angular/standalone';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonText]
})
export class IndexComponent implements OnInit {
  primaryColor = '';

  async ngOnInit() {
    const theme = await fetch(`assets/buffets/${environment.buffetId}/theme.json`).then(r => r.json());
    
    this.primaryColor = theme.primaryColor;
    document.documentElement.style.setProperty('--ion-color-primary', theme.primaryColor);
  }
}