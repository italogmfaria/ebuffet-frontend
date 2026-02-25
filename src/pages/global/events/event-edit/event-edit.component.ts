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
  SelectedInputComponent,
  SelectModalComponent,
  ConfirmationModalComponent
} from '../../../../shared/ui/templates/exports';
import { ThemeService } from '../../../../core/services/theme.service';
import { SelectOption } from '../../../../shared/ui/templates/inputs/selected-input/selected-input.component';
import { BRAZILIAN_STATES } from '../../../../core/constants/brazilian-states.constant';
import { EventoService } from '../../../../features/events/api/evento.api.service';
import { ReservationsApiService } from '../../../../features/reservations/api/reservations-api.service';
import { SessionService } from '../../../../core/services/session.service';
import { OrderService } from '../../../../features/orders/services/order.service';
import { Subscription, switchMap } from 'rxjs';
import { EventoUpdateRequest, EnumStatusEvento, EnumStatus } from '../../../../features/events/model/events.models';
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
    SelectedInputComponent,
    SelectModalComponent,
    ConfirmationModalComponent
  ],
  host: { class: 'ion-page' }
})
export class EventEditComponent implements OnInit, OnDestroy {
  eventId: number = 0;
  reservaId: number = 0;
  clienteId: number = 0;
  eventTitle: string = 'Editar Evento';

  // Dados do evento
  eventName: string = '';
  eventDescription: string = '';
  eventStartDate: string = ''; // YYYY-MM-DD
  eventStartTime: string = ''; // HH:MM
  eventEndDate: string = ''; // YYYY-MM-DD
  eventEndTime: string = ''; // HH:MM
  eventValue: string = '';
  eventStatus: EnumStatusEvento = 'AGENDADO';
  status: EnumStatus = 'ATIVO';

  // Dados não salvos pela API (apenas visualização)
  peopleCount: string = '';
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
  showStateModal: boolean = false;
  showRemoveFoodModal: boolean = false;
  showRemoveServiceModal: boolean = false;

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
    private eventoService: EventoService,
    private reservationsApi: ReservationsApiService,
    private sessionService: SessionService,
    private orderService: OrderService,
    private toastService: ToastService,
    private editStateService: EditStateService
  ) {}

  ngOnInit() {
    this.stateOptions = BRAZILIAN_STATES;

    // Subscreve ao estado do EditStateService
    this.subs.add(
      this.editStateService.getState$('event-edit').subscribe(state => {
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
        this.eventId = Number(params['id'] || 0);
        this.reservaId = Number(params['reservaId'] || 0);
        this.clienteId = Number(params['clienteId'] || 0);
        if (this.eventId) {
          this.loadEvent();
        }
      })
    );
  }

  ngOnDestroy() {
    // Limpa o estado ao destruir o componente
    this.editStateService.clearState('event-edit');
    this.orderService.clearOrder('event-edit');
    this.subs.unsubscribe();
  }

  private loadEvent() {
    const user = this.sessionService.getUser();
    if (!user?.id) return;

    this.isLoading = true;

    this.subs.add(
      this.eventoService.getById(this.eventId).pipe(
        switchMap((event: any) => {
          // Carregar dados do evento
          this.eventName = event.nome ?? event.titulo ?? '';
          this.eventDescription = event.descricao || '';
          this.eventStatus = event.statusEvento as EnumStatusEvento;
          this.status = event.status as EnumStatus;

          const startFromEvento = this.parseDateTime(event.inicio);
          const endFromEvento = this.parseDateTime(event.fim);

          // Parse início (ISO datetime string)
          this.eventStartDate = startFromEvento.date || (event.dataDesejada ?? '');
          this.eventStartTime = startFromEvento.time || this.parseTimeOnly(event.horarioDesejado);

          // Parse fim (ISO datetime string)
          this.eventEndDate = endFromEvento.date || this.eventStartDate;
          this.eventEndTime = endFromEvento.time || this.eventStartTime;

          // Parse valor
          if (event.valor != null && event.valor !== '') {
            this.eventValue = String(event.valor);
          }

          // Carregar comidas e serviços da reserva associada
          return this.reservationsApi.getById(event.reservaId, event.clienteId);
        })
      ).subscribe({
        next: (reserva) => {
          // Carregar dados da reserva (endereço, qtd pessoas, comidas, serviços)
          this.peopleCount = String(reserva.qtdPessoas);

          if (!this.eventName) {
            this.eventName = reserva.titulo || '';
          }

          if (!this.eventDescription) {
            this.eventDescription = reserva.descricao || '';
          }

          if (!this.eventStartDate && reserva.dataDesejada) {
            this.eventStartDate = reserva.dataDesejada;
          }

          if (!this.eventStartTime && reserva.horarioDesejado) {
            this.eventStartTime = this.parseTimeOnly(reserva.horarioDesejado);
          }

          if (!this.eventEndDate) {
            this.eventEndDate = this.eventStartDate;
          }

          if (!this.eventEndTime) {
            this.eventEndTime = this.eventStartTime;
          }

          if (reserva.endereco) {
            this.street = reserva.endereco.rua;
            this.number = reserva.endereco.numero;
            this.complement = reserva.endereco.complemento || '';
            this.neighborhood = reserva.endereco.bairro;
            this.city = reserva.endereco.cidade;
            this.state = reserva.endereco.estado;
            this.zipCode = reserva.endereco.cep;
          }

          // Carregar comidas e serviços no EditStateService (primeira carga)
          const currentState = this.editStateService.getState('event-edit');
          if (currentState.foods.length === 0 && currentState.services.length === 0) {
            const foods = (reserva.comidas ?? []).map(c => ({
              id: c.id,
              title: c.nome,
              description: c.descricao,
              imageUrl: c.imagemUrl || '',
              type: 'food' as const
            }));

            const services = (reserva.servicos ?? []).map(s => ({
              id: s.id,
              title: s.nome,
              description: s.descricao,
              imageUrl: s.imagemUrl || '',
              type: 'service' as const
            }));

            this.editStateService.setState('event-edit', { foods, services });
          }

          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erro ao carregar evento/reserva', err);
          this.isLoading = false;
        }
      })
    );
  }

  private parseDateTime(value?: string | null): { date: string; time: string } {
    if (!value) {
      return { date: '', time: '' };
    }

    if (value.includes('T')) {
      const [date, time] = value.split('T');
      return {
        date: date ?? '',
        time: time ? time.substring(0, 5) : ''
      };
    }

    return { date: value, time: '' };
  }

  private parseTimeOnly(value?: string | null): string {
    if (!value) return '';
    return value.length >= 5 ? value.substring(0, 5) : value;
  }

  onBackClick() {
    this.orderService.clearOrder('event-edit');

    if (this.eventId && this.reservaId) {
      this.navCtrl.navigateBack('/events/event-details', {
        queryParams: {
          id: this.eventId,
          reservaId: this.reservaId,
          clienteId: this.clienteId
        }
      });
    } else {
      this.navCtrl.navigateBack('/events');
    }
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
    const itemToRemoveObj = this.menuItems.find(item => item.title === this.itemToRemove);
    if (itemToRemoveObj?.id) {
      this.editStateService.removeItem('event-edit', itemToRemoveObj.id, 'food');
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
    const itemToRemoveObj = this.services.find(item => item.title === this.itemToRemove);
    if (itemToRemoveObj?.id) {
      this.editStateService.removeItem('event-edit', itemToRemoveObj.id, 'service');
    }
    this.showRemoveServiceModal = false;
    this.itemToRemove = '';
  }

  onRemoveServiceModalCancel() {
    this.showRemoveServiceModal = false;
    this.itemToRemove = '';
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
      this.eventName.trim() &&
      this.eventStartDate.trim() &&
      this.eventStartTime.trim() &&
      this.eventEndDate.trim() &&
      this.eventEndTime.trim()
    );
  }

  // Salvar
  onSave() {
    if (!this.isFormValid || this.isSaving) return;

    const user = this.sessionService.getUser();
    if (!user?.id) return;

    this.isSaving = true;

    // Extrair IDs das comidas e serviços (apenas IDs únicos)
    const comidaIds = this.menuItems
      .map(item => item.id)
      .filter(id => id !== undefined) as number[];

    const servicoIds = this.services
      .map(item => item.id)
      .filter(id => id !== undefined) as number[];

    const body: any = {};

    // Comidas e serviços (sempre incluir, mesmo que vazio)
    if (comidaIds.length > 0) {
      body.comidaIds = comidaIds;
    }
    if (servicoIds.length > 0) {
      body.servicoIds = servicoIds;
    }

    // Quantidade de pessoas (se foi alterado)
    if (this.peopleCount) {
      body.qtdPessoas = parseInt(this.peopleCount);
    }

    // Data e hora de início (se foi alterado)
    if (this.eventStartDate && this.eventStartTime) {
      body.inicio = `${this.eventStartDate}T${this.eventStartTime}:00`;
    }

    // Data e hora de fim (se foi alterado)
    if (this.eventEndDate && this.eventEndTime) {
      body.fim = `${this.eventEndDate}T${this.eventEndTime}:00`;
    }

    // Endereço (se foi alterado)
    if (this.street && this.number && this.neighborhood && this.city && this.state && this.zipCode) {
      body.endereco = {
        rua: this.street,
        numero: this.number,
        bairro: this.neighborhood,
        cidade: this.city,
        estado: this.state,
        cep: this.zipCode,
        complemento: this.complement || undefined
      };
    }

    this.subs.add(
      this.eventoService.updateByCliente(this.eventId, body, user.id).subscribe({
        next: () => {
          this.isSaving = false;
          this.navCtrl.navigateBack('/events/event-details', {
            queryParams: { id: this.eventId }
          });
        },
        error: (err) => {
          console.error('Erro ao atualizar evento', err);
          this.isSaving = false;
          // TODO: Mostrar mensagem de erro ao usuário
        }
      })
    );
  }
}
