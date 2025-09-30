import { Component, OnInit, Input } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
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
  accentColor = '';

  constructor(private location: Location) {
    addIcons({ arrowBack });
  }

  goBack() {
    this.location.back();
  }

  async ngOnInit() {
    const theme = await fetch(`assets/buffets/${environment.buffetId}/theme.json`).then(r => r.json());

    this.primaryColor = theme.primaryColor;
    this.bannerUrl = theme.banner;
    this.accentColor = theme.accentColor;
    document.documentElement.style.setProperty('--ion-color-primary', theme.primaryColor);
  }
}
