import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  standalone: true,
  imports: [CommonModule, IonContent],
  host: { class: 'ion-page' }
})
export class IndexComponent implements OnInit {
  primaryColor$ = this.themeService.primaryColor$;
  logo$ = this.themeService.logo$;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    // No need to load theme properties manually anymore
  }
}
