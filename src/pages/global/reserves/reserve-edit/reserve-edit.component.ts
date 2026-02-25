import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { BRAZILIAN_STATES } from '../../../../core/constants/brazilian-states.constant';
import { ReservationsApiService } from '../../../../features/reservations/api/reservations-api.service';
import { ReservaUpdateRequest } from '../../../../features/reservations/model/reservation.models';
import { SessionService } from '../../../../core/services/session.service';
import { OrderService } from '../../../../features/orders/services/order.service';
import { Subscription, switchMap } from 'rxjs';
import { EventoService } from '../../../../features/events/api/evento.api.service';
import { ToastService } from '../../../../core/services/toast.service';
import { EditStateService } from '../../../../core/services/edit-state.service';

interface MenuItem {
  id?: number;
  title: string;
  description: string;
  imageUrl: string;
}

interface ServiceItem {
  id?: number;
  title: string;
  description: string;
  imageUrl: string;
}

@Component({
  selector: 'app-reserve-edit',
  templateUrl: './reserve-edit.component.html',
  styleUrls: ['./reserve-edit.component.scss'],
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
export class ReserveEditComponent implements OnInit, OnDestroy {
  reserveId: number = 0;
  clienteId: number = 0;
  reserveTitle: string = 'Editar Reserva';

  // Dados da reserva
  reserveName: string = '';
  reserveDescription: string = '';
  peopleCount: string = '';
  reserveTime: string = '';
  reserveDate: string = '';

  // Endereço
  street: string = '';
  number: string = '';
  complement: string = '';
  neighborhood: string = '';
  city: string = '';
  state: string = '';
  zipCode: string = '';

  // Comidas e Serviços (mocado - não editado pela API de update)
  menuItems: MenuItem[] = [];
  services: ServiceItem[] = [];

  // Modais
  showCalendarModal: boolean = false;
  showStateModal: boolean = false;
  showRemoveFoodModal: boolean = false;
  showRemoveServiceModal: boolean = false;

  unavailableDates: string[] = [];
  itemToRemove: string = '';

  stateOptions: SelectOption[] = [];

  isLoading: boolean = false;
  isSaving: boolean = false;

  private subs = new Subscription();


  secondaryColor$ = this.themeService.secondaryColor$;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private themeService: ThemeService,
    private reservationsApi: ReservationsApiService,
    private sessionService: SessionService,
    private orderService: OrderService,
    private eventoService: EventoService,
    private toastService: ToastService,
    private editStateService: EditStateService
  ) {}

  ngOnInit() {
    this.stateOptions = BRAZILIAN_STATES;
    this.loadUnavailableDates();

    // Subscreve ao estado do EditStateService
    this.subs.add(
      this.editStateService.getState$('reserve-edit').subscribe(state => {
        this.menuItems = state.foods.map(f => ({
          id: f.id,
          title: f.title,
          description: f.description,
          imageUrl: f.imageUrl
        }));

        this.services = state.services.map(s => ({
          id: s.id,
          title: s.title,
          description: s.description,
          imageUrl: s.imageUrl
        }));
      })
    );

    this.subs.add(
      this.route.queryParams.subscribe(params => {
        this.reserveId = Number(params['id'] || 0);
        this.clienteId = Number(params['clienteId'] || 0);
        if (this.reserveId) {
          this.loadReserve();
        }
      })
    );
  }

  ngOnDestroy() {
    // Limpa o estado ao destruir o componente
    this.editStateService.clearState('reserve-edit');
    this.orderService.clearOrder('reserve-edit');
    this.subs.unsubscribe();
  }

  private loadReserve() {
    const user = this.sessionService.getUser();
    if (!user?.id) return;

    this.isLoading = true;

    this.subs.add(
      this.reservationsApi.getById(this.reserveId, user.id).subscribe({
        next: (r) => {
          this.reserveName = r.titulo || '';
          this.reserveDescription = r.descricao || '';
          this.peopleCount = String(r.qtdPessoas);
          this.reserveDate = this.formatDatePtBr(r.dataDesejada);
          this.reserveTime = this.formatTimePtBr(r.horarioDesejado);

          if (r.endereco) {
            this.street = r.endereco.rua;
            this.number = r.endereco.numero;
            this.complement = r.endereco.complemento || '';
            this.neighborhood = r.endereco.bairro;
            this.city = r.endereco.cidade;
            this.state = r.endereco.estado;
            this.zipCode = r.endereco.cep;
          }

          // Carregar comidas e serviços no EditStateService (primeira carga)
          const currentState = this.editStateService.getState('reserve-edit');
          if (currentState.foods.length === 0 && currentState.services.length === 0) {
            const foods = (r.comidas ?? []).map(c => ({
              id: c.id,
              title: c.nome,
              description: c.descricao,
              imageUrl: c.imagemUrl || '',
              type: 'food' as const
            }));

            const services = (r.servicos ?? []).map(s => ({
              id: s.id,
              title: s.nome,
              description: s.descricao,
              imageUrl: s.imagemUrl || '',
              type: 'service' as const
            }));

            this.editStateService.setState('reserve-edit', { foods, services });
          }

          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erro ao carregar reserva', err);
          this.isLoading = false;
        }
      })
    );
  }

  private formatDatePtBr(iso: string): string {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    if (!y || !m || !d) return iso;
    return `${d}/${m}/${y}`;
  }

  private formatTimePtBr(t: string): string {
    if (!t) return '';
    return t.length >= 5 ? t.substring(0, 5) : t;
  }

  private formatDateToIso(datePtBr: string): string {
    // Converte DD/MM/YYYY para YYYY-MM-DD
    const [d, m, y] = datePtBr.split('/');
    return `${y}-${m}-${d}`;
  }

  onBackClick() {
    this.orderService.clearOrder('reserve-edit');

    if (this.reserveId) {
      this.navCtrl.navigateBack('/reserves/reserve-details', {
        queryParams: {
          id: this.reserveId,
          clienteId: this.clienteId
        }
      });
    } else {
      this.navCtrl.navigateBack('/reserves');
    }
  }

  // Comidas
  onAddFoods() {
    this.navCtrl.navigateForward('/client/foods', {
      queryParams: { fromEdit: 'reserve', editId: this.reserveId }
    });
  }

  onFoodItemClick(item: MenuItem) {
    if (item.id) {
      this.navCtrl.navigateForward(`/client/foods/${item.id}`, {
        queryParams: {
          name: item.title,
          fromEdit: 'reserve',
          editId: this.reserveId
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
    const itemToRemoveObj = this.menuItems.find(item => item.title === this.itemToRemove);
    if (itemToRemoveObj?.id) {
      this.editStateService.removeItem('reserve-edit', itemToRemoveObj.id, 'food');
    }
    this.showRemoveFoodModal = false;
    this.itemToRemove = '';
  }

  onRemoveFoodModalCancel() {
    this.showRemoveFoodModal = false;
    this.itemToRemove = '';
  }

  // Serviços
  onAddServices() {
    this.navCtrl.navigateForward('/client/services', {
      queryParams: { fromEdit: 'reserve', editId: this.reserveId }
    });
  }

  onServiceItemClick(item: ServiceItem) {
    if (item.id) {
      this.navCtrl.navigateForward(`/client/services/${item.id}`, {
        queryParams: {
          name: item.title,
          fromEdit: 'reserve',
          editId: this.reserveId
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
    const itemToRemoveObj = this.services.find(item => item.title === this.itemToRemove);
    if (itemToRemoveObj?.id) {
      this.editStateService.removeItem('reserve-edit', itemToRemoveObj.id, 'service');
    }
    this.showRemoveServiceModal = false;
    this.itemToRemove = '';
  }

  onRemoveServiceModalCancel() {
    this.showRemoveServiceModal = false;
    this.itemToRemove = '';
  }

  // Calendário
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

    this.reserveDate = date;
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
      this.reserveName.trim() &&
      this.reserveDescription.trim() &&
      this.peopleCount.trim() &&
      this.reserveTime.trim() &&
      this.reserveDate.trim() &&
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
    if (!this.isFormValid || this.isSaving) return;

    const user = this.sessionService.getUser();
    if (!user?.id) return;

    this.isSaving = true;

    const body: ReservaUpdateRequest = {
      qtdPessoas: Number(this.peopleCount),
      dataDesejada: this.formatDateToIso(this.reserveDate),
      horarioDesejado: this.reserveTime,
      endereco: {
        rua: this.street,
        numero: this.number,
        bairro: this.neighborhood,
        cidade: this.city,
        estado: this.state,
        cep: this.zipCode.replace(/\D/g, ''),
        complemento: this.complement || null
      },
      titulo: this.reserveName,
      descricao: this.reserveDescription
    };

    // Atualizar dados básicos e depois comidas/serviços
    this.subs.add(
      this.reservationsApi.update(this.reserveId, user.id, body).pipe(
        switchMap(() => {
          // Obter IDs do EditStateService (única fonte da verdade)
          const comidaIds = this.editStateService.getFoodIds('reserve-edit');
          const servicoIds = this.editStateService.getServiceIds('reserve-edit');

          return this.reservationsApi.updateItems(this.reserveId, user.id, {
            comidaIds,
            servicoIds
          });
        })
      ).subscribe({
        next: () => {
          this.isSaving = false;
          this.navCtrl.navigateBack('/reserves/reserve-details', {
            queryParams: { id: this.reserveId }
          });
        },
        error: (err) => {
          console.error('Erro ao atualizar reserva', err);
          this.isSaving = false;
          // TODO: Mostrar mensagem de erro ao usuário
        }
      })
    );
  }
}
