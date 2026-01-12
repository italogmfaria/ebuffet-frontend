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
import { ReservationsApiService } from '../../../../features/reservations/api/reservations-api.service';
import { SessionService } from '../../../../core/services/session.service';
import { OrderService } from '../../../../features/orders/services/order.service';
import { Subscription, switchMap } from 'rxjs';
import { ReservaUpdateRequest } from '../../../../features/reservations/model/reservation.models';

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
    private reservationsApi: ReservationsApiService,
    private sessionService: SessionService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.stateOptions = this.BRAZILIAN_STATES;

    this.subs.add(
      this.route.queryParams.subscribe(params => {
        this.reserveId = Number(params['id'] || 0);
        if (this.reserveId) {
          this.loadReserve();
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
            imageUrl: item.imageUrl || '',
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
            imageUrl: item.imageUrl || '',
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

          // Carregar comidas e serviços (somente visualização - não editáveis via API de update)
          this.menuItems = (r.comidas ?? []).map(c => ({
            id: c.id,
            title: c.nome,
            description: c.descricao,
            imageUrl: c.imagemUrl || '',
            quantity: 1
          }));

          this.services = (r.servicos ?? []).map(s => ({
            id: s.id,
            title: s.nome,
            description: s.descricao,
            imageUrl: s.imagemUrl || '',
            quantity: 1
          }));

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
    this.navCtrl.back();
  }

  // Comidas (não editável via API de update - apenas visualização)
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
    this.reserveDate = date;
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
          // Atualizar comidas e serviços
          const comidaIds = this.menuItems.map(item => item.id).filter(id => id !== undefined) as number[];
          const servicoIds = this.services.map(item => item.id).filter(id => id !== undefined) as number[];

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
