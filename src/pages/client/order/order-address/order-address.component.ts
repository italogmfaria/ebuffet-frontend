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
import { ThemeService } from '../../../../shared/services/theme.service';
import { ViaCepService, State } from '../../../../shared/services/viacep.service';
import { SelectOption } from '../../../../shared/ui/templates/inputs/selected-input/selected-input.component';

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
  isLoadingCep: boolean = false;
  stateOptions: SelectOption[] = [];
  showStateModal: boolean = false;

  primaryColor$ = this.themeService.primaryColor$;
  secondaryColor$ = this.themeService.secondaryColor$;

  constructor(
    private themeService: ThemeService,
    private navCtrl: NavController,
    private viaCepService: ViaCepService
  ) {}

  ngOnInit() {
    this.loadStates();
  }

  loadStates() {
    this.viaCepService.getStates().subscribe({
      next: (states: State[]) => {
        this.stateOptions = states.map(state => ({
          value: state.sigla,
          label: `${state.sigla} - ${state.nome}`
        }));
      },
      error: (err) => {
        console.error('Erro ao carregar estados:', err);
      }
    });
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

    if (limited.length === 8) {
      this.searchAddressByCep(this.zipCode);
    }
  }

  searchAddressByCep(cep: string) {
    this.isLoadingCep = true;
    this.viaCepService.getAddressByCep(cep).subscribe({
      next: (address) => {
        this.isLoadingCep = false;
        if (address) {
          this.city = address.city;
          this.state = address.state;
          console.log('Endereço encontrado:', address);
        } else {
          console.log('CEP não encontrado');
        }
      },
      error: (err) => {
        this.isLoadingCep = false;
        console.error('Erro ao buscar CEP:', err);
      }
    });
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
    if (this.isFormValid) {
      console.log('Endereço da reserva:', {
        street: this.street,
        number: this.number,
        complement: this.complement,
        neighborhood: this.neighborhood,
        city: this.city,
        state: this.state,
        zipCode: this.zipCode
      });

      this.navCtrl.navigateForward('/client/order/order-confirmation');
    }
  }
}
