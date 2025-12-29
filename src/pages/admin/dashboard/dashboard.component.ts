import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular/standalone';
import { ThemeService } from '../../../core/services/theme.service';
import { SessionService } from '../../../core/services/session.service';
import {ConfirmationModalComponent, FormPageComponent} from "../../../shared/ui/templates/exports";
import { BuffetCalendarComponent } from './buffet-calendar/buffet-calendar.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormPageComponent,
    BuffetCalendarComponent,
    ConfirmationModalComponent
  ],
  host: { class: 'ion-page' }
})
export class DashboardComponent implements OnInit {
  primaryColor$ = this.themeService.primaryColor$;
  showExitModal = false;

  // Dias com eventos (exemplo)
  eventDays = [9, 14, 18, 31];

  constructor(
    private navCtrl: NavController,
    private themeService: ThemeService,
    private sessionService: SessionService
  ) {}

  ngOnInit() {}

  onBackClick() {
    this.showExitModal = true;
  }

  onConfirmExit() {
    this.showExitModal = false;
    try {
      this.sessionService.logout();
    } catch (e) {
      console.error('Error while logging out', e);
    }
    this.navCtrl.navigateRoot('/welcome');
  }

  onCancelExit() {
    this.showExitModal = false;
  }

  onCloseModal() {
    this.showExitModal = false;
  }

  navigateToFoods() {
    this.navCtrl.navigateForward('/admin/manage-foods');
  }

  navigateToServices() {
    this.navCtrl.navigateForward('/admin/manage-services');
  }

  navigateToReserves() {
    this.navCtrl.navigateForward('/reserves');
  }

  navigateToEvents() {
    this.navCtrl.navigateForward('/events');
  }
}
