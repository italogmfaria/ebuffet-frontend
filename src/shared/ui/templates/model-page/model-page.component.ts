import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {arrowBack, chevronBackOutline} from 'ionicons/icons';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-model-page',
  templateUrl: './model-page.component.html',
  styleUrls: ['./model-page.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon]
})
export class ModelPageComponent implements OnInit {
  @Input() title: string = '';
  @Output() backClick = new EventEmitter<void>();
  secondaryColor = '';

  constructor(private location: Location) {
    addIcons({ arrowBack });
  }

  async ngOnInit() {
    const theme = await fetch(`assets/buffets/${environment.buffetId}/theme.json`).then(r => r.json());
    this.secondaryColor = theme.secondaryColor;
  }

  goBack() {
    this.location.back();
  }
}
