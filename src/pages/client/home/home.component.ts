import { Component, OnInit } from '@angular/core';
import {CommonModule} from "@angular/common";
import { FormPageComponent } from '../../../shared/ui/templates/exports';
import { IonGrid } from "@ionic/angular/standalone";
import { ThemeService } from '../../../shared/config/theme.service';

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

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    const theme = this.themeService.getCurrentTheme();

    if (theme) {
      this.primaryColor = theme.primaryColor;
      this.secondaryColor = theme.secondaryColor;
      this.accentColor = theme.accentColor;
    }
  }

}
