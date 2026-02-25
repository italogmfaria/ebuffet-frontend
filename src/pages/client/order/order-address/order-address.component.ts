import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular/standalone';
import {
  ModelPageComponent,
  TextInputComponent,
  SelectedInputComponent,
  SelectModalComponent,
  PrimaryButtonComponent
} from '../../../../shared/ui/templates/exports';
import { ThemeService } from '../../../../core/services/theme.service';
import { SelectOption } from '../../../../shared/ui/templates/inputs/selected-input/selected-input.component';
import { BRAZILIAN_STATES } from '../../../../core/constants/brazilian-states.constant';
import {ReservationsApiService} from "../../../../features/reservations/api/reservations-api.service";
import {OrderService} from "../../../../features/orders/services/order.service";
import {SessionService} from "../../../../core/services/session.service";
import {ReservationFlowService} from "../../../../features/reservations/services/reservation-flow.service";

@Component({
  selector: 'app-order-address',
  templateUrl: './order-address.component.html',
  styleUrls: ['./order-address.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModelPageComponent,
    TextInputComponent,
    SelectedInputComponent,
    SelectModalComponent,
    PrimaryButtonComponent
  ]
})
export class OrderAddressComponent implements OnInit {
  street: string = '';
  number: string = '';
  complement: string = '';
  neighborhood: string = '';
  city: string = '';
  state: string = '';
  zipCode: string = '';
  stateOptions: SelectOption[] = [];
  showStateModal: boolean = false;

  primaryColor$ = this.themeService.primaryColor$;
  secondaryColor$ = this.themeService.secondaryColor$;


  constructor(
    private themeService: ThemeService,
    private navCtrl: NavController,
    private reservationsApi: ReservationsApiService,
    private reservationFlow: ReservationFlowService,
    private orderService: OrderService,
    private session: SessionService
  ) {}

  ngOnInit() {
    this.stateOptions = BRAZILIAN_STATES;
  }

  onStateInputClick() {
    this.showStateModal = true;
  }

  onStateSelected(stateValue: string) {
    this.state = stateValue;
    this.showStateModal = false;
  }

  onZipCodeChange(value: string) {
    const numbersOnly = value.replace(/\D/g, '');

    const limited = numbersOnly.substring(0, 8);

    if (limited.length <= 5) {
      this.zipCode = limited;
    } else {
      this.zipCode = `${limited.substring(0, 5)}-${limited.substring(5)}`;
    }
  }

  onZipCodeKeyPress(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    }

    const currentNumbers = this.zipCode.replace(/\D/g, '');
    if (currentNumbers.length >= 8) {
      event.preventDefault();
      return false;
    }

    return true;
  }

  get isFormValid(): boolean {
    return !!(
      this.street.trim() &&
      this.number.trim() &&
      this.neighborhood.trim() &&
      this.city.trim() &&
      this.state.trim() &&
      this.zipCode.replace(/\D/g, '').length === 8
    );
  }

  onBackClick() {
    this.navCtrl.navigateBack('/client/order/order-details');
  }

  onMakeReservation() {
    if (!this.isFormValid) return;

    this.reservationFlow.setAddress({
      rua: this.street,
      numero: this.number,
      bairro: this.neighborhood,
      cidade: this.city,
      estado: this.state,
      cep: this.zipCode,
      complemento: this.complement
    });

    this.confirmarReserva();
  }

  private confirmarReserva() {
    const user = this.session.getUser();
    if (!user?.id) return;

    let body;
    try {
      body = this.reservationFlow.buildReservaRequest();
    } catch (e) {
      console.error(e);
      return;
    }

    this.reservationsApi.create(user.id, body).subscribe({
      next: () => {
        this.orderService.clearOrder();
        this.reservationFlow.clear();
        this.navCtrl.navigateForward('/client/order/order-confirmation');
      },
      error: (err) => console.error(err)
    });
  }

}
