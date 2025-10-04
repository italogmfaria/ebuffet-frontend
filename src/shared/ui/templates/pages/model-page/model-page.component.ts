import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonContent, IonIcon, NavController} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {arrowBack} from 'ionicons/icons';
import { ThemeService } from '../../../../../shared/config/theme.service';

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

  constructor(private navCtrl: NavController, private themeService: ThemeService) {
    addIcons({ arrowBack });
  }

  ngOnInit() {
    const theme = this.themeService.getCurrentTheme();

    if (theme) {
      this.secondaryColor = theme.secondaryColor;
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
