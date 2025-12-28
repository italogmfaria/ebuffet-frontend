import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import {
  ModelPageComponent,
  OrderItemCardComponent,
  PrimaryButtonComponent,
  TextInputComponent,
  TextareaInputComponent,
  CalendarInputComponent,
  CalendarModalComponent,
  SelectedInputComponent,
  SelectModalComponent,
  ConfirmationModalComponent
} from '../../../../shared/ui/templates/exports';
import { ThemeService } from '../../../../core/services/theme.service';
import { SelectOption } from '../../../../shared/ui/templates/inputs/selected-input/selected-input.component';
import { ViaCepService, State } from '../../../../core/services/viacep.service';

interface MenuItem {
  id?: number;
  title: string;
  description: string;
  imageUrl: string;
  quantity: number;
}

interface ServiceItem {
  id?: number;
  title: string;
  description: string;
  imageUrl: string;
  quantity: number;
}

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModelPageComponent,
    OrderItemCardComponent,
    PrimaryButtonComponent,
    TextInputComponent,
    TextareaInputComponent,
    CalendarInputComponent,
    CalendarModalComponent,
    SelectedInputComponent,
    SelectModalComponent,
    ConfirmationModalComponent
  ],
  host: { class: 'ion-page' }
})
export class EventEditComponent implements OnInit {
  eventId: string = '';
  eventTitle: string = 'Editar Evento';

  // Dados do evento
  eventName: string = '';
  eventDescription: string = '';
  peopleCount: string = '';
  eventTime: string = '';
  eventDate: string = '';

  // Endereço
  street: string = '';
  number: string = '';
  complement: string = '';
  neighborhood: string = '';
  city: string = '';
  state: string = '';
  zipCode: string = '';

  // Comidas e Serviços
  menuItems: MenuItem[] = [
    {
      id: 1,
      title: 'Bolo de Casamento',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis purus lorem, aliquet eu iaculis sed, sollicitudin quis velit.',
      imageUrl: '',
      quantity: 1
    }
  ];

  services: ServiceItem[] = [
    {
      id: 1,
      title: 'Decoração de Casamento',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis purus lorem, aliquet eu iaculis sed, sollicitudin quis velit.',
      imageUrl: '',
      quantity: 1
    }
  ];

  // Modais
  showCalendarModal: boolean = false;
  showStateModal: boolean = false;
  showRemoveFoodModal: boolean = false;
  showRemoveServiceModal: boolean = false;

  itemToRemove: string = '';

  stateOptions: SelectOption[] = [];
  isLoadingCep: boolean = false;

  secondaryColor$ = this.themeService.secondaryColor$;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private themeService: ThemeService,
    private viaCepService: ViaCepService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.eventId = params['id'] || '';
    });
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

  onBackClick() {
    this.navCtrl.back();
  }

  // Comidas
  onAddFoods() {
    this.navCtrl.navigateForward('/client/foods', {
      queryParams: { fromEdit: 'event', editId: this.eventId }
    });
  }

  onFoodItemClick(item: MenuItem) {
    if (item.id) {
      this.navCtrl.navigateForward(`/client/foods/${item.id}`, {
        queryParams: {
          name: item.title,
          fromEdit: 'event',
          editId: this.eventId
        }
      });
    }
  }

  onRemoveFood(title: string) {
    this.itemToRemove = title;
    this.showRemoveFoodModal = true;
  }

  onRemoveFoodModalClose() {
    this.showRemoveFoodModal = false;
    this.itemToRemove = '';
  }

  onRemoveFoodModalConfirm() {
    this.menuItems = this.menuItems.filter(item => item.title !== this.itemToRemove);
    this.showRemoveFoodModal = false;
    this.itemToRemove = '';
  }

  onRemoveFoodModalCancel() {
    this.showRemoveFoodModal = false;
    this.itemToRemove = '';
  }

  onFoodQuantityChange(title: string, newQuantity: number) {
    const item = this.menuItems.find(i => i.title === title);
    if (item) {
      item.quantity = newQuantity;
    }
  }

  // Serviços
  onAddServices() {
    this.navCtrl.navigateForward('/client/services', {
      queryParams: { fromEdit: 'event', editId: this.eventId }
    });
  }

  onServiceItemClick(item: ServiceItem) {
    if (item.id) {
      this.navCtrl.navigateForward(`/client/services/${item.id}`, {
        queryParams: {
          name: item.title,
          fromEdit: 'event',
          editId: this.eventId
        }
      });
    }
  }

  onRemoveService(title: string) {
    this.itemToRemove = title;
    this.showRemoveServiceModal = true;
  }

  onRemoveServiceModalClose() {
    this.showRemoveServiceModal = false;
    this.itemToRemove = '';
  }

  onRemoveServiceModalConfirm() {
    this.services = this.services.filter(item => item.title !== this.itemToRemove);
    this.showRemoveServiceModal = false;
    this.itemToRemove = '';
  }

  onRemoveServiceModalCancel() {
    this.showRemoveServiceModal = false;
    this.itemToRemove = '';
  }

  onServiceQuantityChange(title: string, newQuantity: number) {
    const item = this.services.find(i => i.title === title);
    if (item) {
      item.quantity = newQuantity;
    }
  }

  // Calendário
  onCalendarInputClick() {
    this.showCalendarModal = true;
  }

  onCalendarModalClose() {
    this.showCalendarModal = false;
  }

  onDateSelected(date: string) {
    this.eventDate = date;
    this.showCalendarModal = false;
  }

  // Estado
  onStateInputClick() {
    this.showStateModal = true;
  }

  onStateSelected(stateValue: string) {
    this.state = stateValue;
    this.showStateModal = false;
  }

  // CEP
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

  // Validação
  get isFormValid(): boolean {
    return !!(
      this.eventName.trim() &&
      this.eventDescription.trim() &&
      this.peopleCount.trim() &&
      this.eventTime.trim() &&
      this.eventDate.trim() &&
      this.street.trim() &&
      this.number.trim() &&
      this.neighborhood.trim() &&
      this.city.trim() &&
      this.state.trim() &&
      this.zipCode.replace(/\D/g, '').length === 8
    );
  }

  // Salvar
  onSave() {
    if (!this.isFormValid) return;

    console.log('Salvando evento:', {
      name: this.eventName,
      description: this.eventDescription,
      peopleCount: this.peopleCount,
      time: this.eventTime,
      date: this.eventDate,
      address: {
        street: this.street,
        number: this.number,
        complement: this.complement,
        neighborhood: this.neighborhood,
        city: this.city,
        state: this.state,
        zipCode: this.zipCode
      },
      foods: this.menuItems,
      services: this.services
    });

    // TODO: Implementar chamada ao backend
    this.navCtrl.navigateBack('/events/event-details', {
      queryParams: { id: this.eventId }
    });
  }
}

