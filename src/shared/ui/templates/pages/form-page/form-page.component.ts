import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import {IonContent, IonIcon, NavController} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-form-page',
  templateUrl: './form-page.component.html',
  styleUrls: ['./form-page.component.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon]
})
export class FormPageComponent implements OnInit {
  @Input() title: string = '';
  primaryColor = '';
  bannerUrl = '';
  @Input() backRoute: string = '';
  @Output() backClick = new EventEmitter<void>();
  accentColor = '';

  constructor(private navCtrl: NavController) {
    addIcons({ arrowBack });
  }

  async ngOnInit() {
    const theme = await fetch(`assets/buffets/${environment.buffetId}/theme.json`).then(r => r.json());

    this.primaryColor = theme.primaryColor;
    this.bannerUrl = theme.banner;
    this.accentColor = theme.accentColor;
    document.documentElement.style.setProperty('--ion-color-primary', theme.primaryColor);
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
      this.navCtrl.navigateRoot('/welcome');
    }
  }
}
