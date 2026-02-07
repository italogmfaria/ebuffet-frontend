import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ViewWillEnter } from '@ionic/angular';
import { NavController } from '@ionic/angular/standalone';
import { ThemeService } from '../../../core/services/theme.service';
import { SessionService } from '../../../core/services/session.service';
import { EventoService } from '../../../features/events/api/evento.api.service';
import {ConfirmationModalComponent, FormPageComponent} from "../../../shared/ui/templates/exports";
import { BuffetCalendarComponent } from './buffet-calendar/buffet-calendar.component';
import { Subscription } from 'rxjs';

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
export class DashboardComponent implements OnInit, OnDestroy, ViewWillEnter {
  primaryColor$ = this.themeService.primaryColor$;
  showExitModal = false;

  // Datas com eventos (carregadas da API)
  eventDates: string[] = [];

  private subs = new Subscription();

  constructor(
    private navCtrl: NavController,
    private themeService: ThemeService,
    private sessionService: SessionService,
    private eventoService: EventoService
  ) {}

  ngOnInit() {
    this.loadEventDates();
  }

  ionViewWillEnter() {
    // Reload event dates when returning to dashboard
    this.loadEventDates();
  }

  private loadEventDates() {
    // Busca eventos de 3 meses atrás até 6 meses à frente
    const today = new Date();
    const startDate = new Date(today);
    startDate.setMonth(today.getMonth() - 3);
    const endDate = new Date(today);
    endDate.setMonth(today.getMonth() + 6);

    const dataInicio = startDate.toISOString().split('T')[0];
    const dataFim = endDate.toISOString().split('T')[0];

    this.subs.add(
      this.eventoService.getDatasIndisponiveis(dataInicio, dataFim).subscribe({
        next: (response) => {
          this.eventDates = response.datas || [];
        },
        error: (err) => {
          console.error('Erro ao carregar datas de eventos', err);
          this.eventDates = [];
        }
      })
    );
  }

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

  onNotificationClick() {
    this.navCtrl.navigateForward('/notifications');
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

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
