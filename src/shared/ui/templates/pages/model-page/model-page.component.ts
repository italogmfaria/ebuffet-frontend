import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonContent, IonIcon, NavController} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {arrowBack} from 'ionicons/icons';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-model-page',
  templateUrl: './model-page.component.html',
  styleUrls: ['./model-page.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, IonContent]
})
export class ModelPageComponent implements OnInit {
  @Input() title: string = '';
  @Input() backRoute: string = '';
  @Output() backClick = new EventEmitter<void>();
  secondaryColor = '';

  constructor(private navCtrl: NavController) {
    addIcons({ arrowBack });
  }

  async ngOnInit() {
    try {
      const theme = await fetch(`assets/buffets/${environment.buffetId}/theme.json`).then(r => r.json());
      this.secondaryColor = theme.secondaryColor;
    } catch (error) {
      console.warn('Erro ao carregar tema:', error);
    }
  }

  goBack() {
    if (this.backRoute) {
      this.navCtrl.navigateBack(this.backRoute);
      return;
    }

    if (this.backClick.observed) {
      this.backClick.emit();
      return;
    }

    try {
      this.navCtrl.back();
    } catch (error) {
      this.navCtrl.navigateRoot('/index');
    }
  }
}
