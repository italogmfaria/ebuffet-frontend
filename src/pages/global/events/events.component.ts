import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular/standalone';
import { ModelPageComponent } from "../../../shared/ui/templates/pages/model-page/model-page.component";
import { LoadingSpinnerComponent } from "../../../shared/ui/templates/exports";
import { ThemeService } from '../../../shared/services/theme.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ModelPageComponent,
    LoadingSpinnerComponent
  ]
})
export class EventsComponent implements OnInit {
  secondaryColor$ = this.themeService.secondaryColor$;
  isLoading = false;

  constructor(
    private navCtrl: NavController,
    private themeService: ThemeService
  ) { }

  ngOnInit() {
    // TODO: Carregar eventos do backend
  }

  onBackClick() {
    this.navCtrl.navigateBack('/client/profile');
  }
}
