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
import {EventoService} from "../../../../features/events/api/evento.api.service";

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
  unavailableDates: string[] = [];

  primaryColor$ = this.themeService.primaryColor$;
  secondaryColor$ = this.themeService.secondaryColor$;

  constructor(
    private themeService: ThemeService,
    private navCtrl: NavController,
    private validationService: ValidationService,
    private toastService: ToastService,
    private reservationFlow: ReservationFlowService,
    private eventoService: EventoService
  ) {}

  ngOnInit() {
    this.loadUnavailableDates();
  }

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
    // Recarrega datas indisponíveis ao abrir o modal
    this.loadUnavailableDates();
  }

  onCalendarModalClose() {
    this.showCalendarModal = false;
  }

  onDateSelected(date: string) {
    // Validar se a data selecionada não está indisponível
    const dateISO = this.convertToISO(date);
    if (this.unavailableDates.includes(dateISO)) {
      this.toastService.warning('Esta data não está disponível. Por favor, escolha outra data.');
      return;
    }

    this.desiredDate = date;
    this.showCalendarModal = false;
  }

  private loadUnavailableDates() {
    // Busca datas indisponíveis dos próximos 6 meses
    const today = new Date();
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(today.getMonth() + 6);

    const dataInicio = this.formatToISO(today);
    const dataFim = this.formatToISO(sixMonthsLater);

    this.eventoService.getDatasIndisponiveis(dataInicio, dataFim).subscribe({
      next: (response) => {
        this.unavailableDates = response.datas || [];
      },
      error: (err) => {
        console.error('Erro ao carregar datas indisponíveis', err);
        this.unavailableDates = [];
      }
    });
  }

  private formatToISO(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private convertToISO(datePtBr: string): string {
    // Converte DD/MM/YYYY para YYYY-MM-DD
    const [day, month, year] = datePtBr.split('/');
    return `${year}-${month}-${day}`;
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
