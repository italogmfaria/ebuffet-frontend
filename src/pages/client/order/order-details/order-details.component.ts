import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular/standalone';
import {
  ModelPageComponent,
  TextInputComponent,
  TextareaInputComponent,
  CalendarInputComponent,
  CalendarModalComponent,
  PrimaryButtonComponent
} from '../../../../shared/ui/templates/exports';
import { ThemeService } from '../../../../shared/services/theme.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModelPageComponent,
    TextInputComponent,
    TextareaInputComponent,
    CalendarInputComponent,
    CalendarModalComponent,
    PrimaryButtonComponent
  ]
})
export class OrderDetailsComponent implements OnInit {
  reservationName: string = '';
  reservationDescription: string = '';
  peopleCount: string = '';
  desiredTime: string = '';
  desiredDate: string = '';

  showCalendarModal: boolean = false;

  primaryColor$ = this.themeService.primaryColor$;
  secondaryColor$ = this.themeService.secondaryColor$;

  constructor(
    private themeService: ThemeService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {}

  get isFormValid(): boolean {
    return !!(
      this.reservationName.trim() &&
      this.reservationDescription.trim() &&
      this.peopleCount.trim() &&
      this.desiredTime.trim() &&
      this.desiredDate.trim()
    );
  }

  onBackClick() {
    this.navCtrl.navigateBack('/client/order');
  }

  onCalendarInputClick() {
    this.showCalendarModal = true;
  }

  onCalendarModalClose() {
    this.showCalendarModal = false;
  }

  onDateSelected(date: string) {
    this.desiredDate = date;
    this.showCalendarModal = false;
  }

  onContinue() {
    if (this.isFormValid) {
      // Aqui você pode processar os dados do formulário
      console.log('Dados da reserva:', {
        name: this.reservationName,
        description: this.reservationDescription,
        peopleCount: this.peopleCount,
        desiredTime: this.desiredTime,
        desiredDate: this.desiredDate
      });

      // Navegar para order-address
      this.proceedToNextPage();
    }
  }

  private proceedToNextPage() {
    this.navCtrl.navigateForward('/client/order/order-address');
  }
}
