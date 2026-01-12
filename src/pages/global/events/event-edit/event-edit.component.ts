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
import { EventoService } from '../../../../features/events/api/evento.api.service';
import { ReservationsApiService } from '../../../../features/reservations/api/reservations-api.service';
import { SessionService } from '../../../../core/services/session.service';
import { OrderService } from '../../../../features/orders/services/order.service';
import { Subscription, switchMap } from 'rxjs';
import { EventoUpdateRequest, EnumStatusEvento, EnumStatus } from '../../../../features/events/model/events.models';

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
    SelectedInputComponent,
    SelectModalComponent,
    ConfirmationModalComponent
  ],
  host: { class: 'ion-page' }
})
export class EventEditComponent implements OnInit, OnDestroy {
  eventId: number = 0;
  eventTitle: string = 'Editar Evento';

  // Dados do evento
  eventName: string = '';
  eventDescription: string = '';
  eventStartDate: string = ''; // YYYY-MM-DD
  eventStartTime: string = ''; // HH:MM
  eventEndDate: string = ''; // YYYY-MM-DD
  eventEndTime: string = ''; // HH:MM
  eventValue: string = '';
  eventStatus: EnumStatusEvento = 'PENDENTE';
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

  secondaryColor$ = this.themeService.secondaryColor$;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private themeService: ThemeService,
    private eventoService: EventoService,
    private reservationsApi: ReservationsApiService,
    private sessionService: SessionService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.stateOptions = this.BRAZILIAN_STATES;

    this.subs.add(
      this.route.queryParams.subscribe(params => {
        this.eventId = Number(params['id'] || 0);
        if (this.eventId) {
          this.loadEvent();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  ionViewWillEnter() {
    // Captura itens adicionados ao carrinho durante a navegação
    const orderItems = this.orderService.getOrderItems();

    orderItems.forEach(item => {
      if (item.type === 'food') {
        // Verifica se a comida já não está na lista
        const exists = this.menuItems.some(m => m.id === item.id);
        if (!exists) {
          this.menuItems.push({
            id: item.id,
            title: item.title,
            description: item.description,
            imageUrl: item.imageUrl,
            quantity: item.quantity || 1
          });
        }
      } else if (item.type === 'service') {
        // Verifica se o serviço já não está na lista
        const exists = this.services.some(s => s.id === item.id);
        if (!exists) {
          this.services.push({
            id: item.id,
            title: item.title,
            description: item.description,
            imageUrl: item.imageUrl,
            quantity: item.quantity || 1
          });
        }
      }
    });

    // Limpa o carrinho após capturar os itens
    if (orderItems.length > 0) {
      this.orderService.clearOrder();
    }
  }

  private loadEvent() {
    const user = this.sessionService.getUser();
    if (!user?.id) return;

    this.isLoading = true;

    this.subs.add(
      this.eventoService.getById(this.eventId).pipe(
        switchMap((event) => {
          // Carregar dados do evento
          this.eventName = event.nome;
          this.eventDescription = event.descricao || '';
          this.eventStatus = event.statusEvento as EnumStatusEvento;
          this.status = event.status as EnumStatus;

          // Parse início (ISO datetime string)
          if (event.inicio) {
            const [date, time] = event.inicio.split('T');
            this.eventStartDate = date;
            this.eventStartTime = time ? time.substring(0, 5) : '';
          }

          // Parse fim (ISO datetime string)
          if (event.fim) {
            const [date, time] = event.fim.split('T');
            this.eventEndDate = date;
            this.eventEndTime = time ? time.substring(0, 5) : '';
          }

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

          if (reserva.endereco) {
            this.street = reserva.endereco.rua;
            this.number = reserva.endereco.numero;
            this.complement = reserva.endereco.complemento || '';
            this.neighborhood = reserva.endereco.bairro;
            this.city = reserva.endereco.cidade;
            this.state = reserva.endereco.estado;
            this.zipCode = reserva.endereco.cep;
          }

          // Carregar comidas e serviços
          this.menuItems = (reserva.comidas ?? []).map(c => ({
            id: c.id,
            title: c.nome,
            description: c.descricao,
            imageUrl: c.imagemUrl || '',
            quantity: 1
          }));

          this.services = (reserva.servicos ?? []).map(s => ({
            id: s.id,
            title: s.nome,
            description: s.descricao,
            imageUrl: s.imagemUrl || '',
            quantity: 1
          }));

          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erro ao carregar evento/reserva', err);
          this.isLoading = false;
        }
      })
    );
  }

  onBackClick() {
    this.navCtrl.back();
  }

  // Comidas (não editável via API de update - apenas visualização)
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

  // Serviços (não editável via API de update - apenas visualização)
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

    // Combina data e hora em ISO datetime string
    const inicio = `${this.eventStartDate}T${this.eventStartTime}:00`;
    const fim = `${this.eventEndDate}T${this.eventEndTime}:00`;

    // Extrair IDs das comidas e serviços
    const comidaIds = this.menuItems.map(item => item.id).filter(id => id !== undefined) as number[];
    const servicoIds = this.services.map(item => item.id).filter(id => id !== undefined) as number[];

    const body: EventoUpdateRequest = {
      nome: this.eventName,
      statusEvento: this.eventStatus,
      status: this.status,
      inicio,
      fim,
      valor: this.eventValue ? parseFloat(this.eventValue) : 0,
      descricao: this.eventDescription || undefined,
      comidaIds: comidaIds.length > 0 ? comidaIds : undefined,
      servicoIds: servicoIds.length > 0 ? servicoIds : undefined
    };

    this.subs.add(
      this.eventoService.update(this.eventId, body, user.id).subscribe({
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
