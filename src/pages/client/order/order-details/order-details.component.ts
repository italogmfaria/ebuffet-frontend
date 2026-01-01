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
import { ThemeService } from '../../../../core/services/theme.service';
import { ValidationService } from '../../../../core/services/validation.service';
import { ToastService } from '../../../../core/services/toast.service';
import {ReservationFlowService} from "../../../../features/reservations/services/reservation-flow.service";

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
    private validationService: ValidationService,
    private toastService: ToastService,
    private reservationFlow: ReservationFlowService
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

  async onContinue() {
    if (!this.isFormValid) return;

    // Validar nome da reserva (máximo 20 caracteres)
    const nameValidation = this.validationService.validateReservationName(this.reservationName);
    if (!nameValidation.isValid) {
      await this.toastService.warning(nameValidation.message!);
      return;
    }

    const qtd = Number(this.peopleCount);
    if (!Number.isFinite(qtd) || qtd <= 0) {
      await this.toastService.warning('Por favor, insira uma quantidade válida de pessoas.');
      return;
    }

    this.reservationFlow.setDetails({
      titulo: this.reservationName,
      descricao: this.reservationDescription,
      qtdPessoas: Number(this.peopleCount),
      horarioDesejado: this.desiredTime,
      dataDesejada: this.desiredDate
    });

    this.proceedToNextPage();
  }

  private proceedToNextPage() {
    this.navCtrl.navigateForward('/client/order/order-address');
  }
}
