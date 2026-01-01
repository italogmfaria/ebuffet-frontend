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

  // Lista de estados do Brasil
  private readonly BRAZILIAN_STATES: SelectOption[] = [
    { value: 'AC', label: 'AC - Acre' },
    { value: 'AL', label: 'AL - Alagoas' },
    { value: 'AP', label: 'AP - Amapá' },
    { value: 'AM', label: 'AM - Amazonas' },
    { value: 'BA', label: 'BA - Bahia' },
    { value: 'CE', label: 'CE - Ceará' },
    { value: 'DF', label: 'DF - Distrito Federal' },
    { value: 'ES', label: 'ES - Espírito Santo' },
    { value: 'GO', label: 'GO - Goiás' },
    { value: 'MA', label: 'MA - Maranhão' },
    { value: 'MT', label: 'MT - Mato Grosso' },
    { value: 'MS', label: 'MS - Mato Grosso do Sul' },
    { value: 'MG', label: 'MG - Minas Gerais' },
    { value: 'PA', label: 'PA - Pará' },
    { value: 'PB', label: 'PB - Paraíba' },
    { value: 'PR', label: 'PR - Paraná' },
    { value: 'PE', label: 'PE - Pernambuco' },
    { value: 'PI', label: 'PI - Piauí' },
    { value: 'RJ', label: 'RJ - Rio de Janeiro' },
    { value: 'RN', label: 'RN - Rio Grande do Norte' },
    { value: 'RS', label: 'RS - Rio Grande do Sul' },
    { value: 'RO', label: 'RO - Rondônia' },
    { value: 'RR', label: 'RR - Roraima' },
    { value: 'SC', label: 'SC - Santa Catarina' },
    { value: 'SP', label: 'SP - São Paulo' },
    { value: 'SE', label: 'SE - Sergipe' },
    { value: 'TO', label: 'TO - Tocantins' }
  ];

  constructor(
    private themeService: ThemeService,
    private navCtrl: NavController,
    private reservationsApi: ReservationsApiService,
    private reservationFlow: ReservationFlowService,
    private orderService: OrderService,
    private session: SessionService
  ) {}

  ngOnInit() {
    this.stateOptions = this.BRAZILIAN_STATES;
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
