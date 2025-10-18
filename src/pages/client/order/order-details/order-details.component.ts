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
import {ReservationBuilderService} from "../../../../shared/services/reservation.builder.service";

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
  reservationName = '';
  reservationDescription = '';
  peopleCount = '';
  desiredTime = '';
  desiredDate = '';

  showCalendarModal = false;

  primaryColor$ = this.themeService.primaryColor$;
  secondaryColor$ = this.themeService.secondaryColor$;

  constructor(
    private themeService: ThemeService,
    private navCtrl: NavController,
    private reservationBuilder: ReservationBuilderService
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
    if (!this.isFormValid) return;

    const qtd = Number(this.peopleCount);
    if (!Number.isFinite(qtd) || qtd <= 0) {
      return;
    }

    this.reservationBuilder.captureCartSnapshot();

    this.reservationBuilder.setDetails({
      nome: this.reservationName.trim(),
      descricao: this.reservationDescription.trim(),
      qtdPessoas: qtd,
      horarioDesejado: this.desiredTime,
      dataDesejada: this.desiredDate
    });

    this.proceedToNextPage();
  }

  private proceedToNextPage() {
    this.navCtrl.navigateForward('/client/order/order-address');
  }
}
