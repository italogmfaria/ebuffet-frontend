import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular/standalone';
import {
  ModelPageComponent,
  DefaultItemCardComponent,
  PrimaryButtonComponent,
  CancelButtonComponent,
  WhatsappButtonComponent,
  PendingStatusComponent,
  ApprovedStatusComponent,
  CanceledStatusComponent,
  CompletedStatusComponent,
  ConfirmationModalComponent, BudgetModalComponent
} from '../../../../shared/ui/templates/exports';
import { ThemeService } from '../../../../core/services/theme.service';
import {
  mapReservaStatusToUi,
  MenuItem,
  ServiceItem,
  UiStatus
} from "../../../../features/cliente-profile/model/cliente-profile.model";
import {Subscription} from "rxjs";
import {ReservationsApiService} from "../../../../features/reservations/api/reservations-api.service";
import {SessionService} from "../../../../core/services/session.service";

@Component({
  selector: 'app-reserve-details',
  templateUrl: './reserve-details.component.html',
  styleUrls: ['./reserve-details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ModelPageComponent,
    DefaultItemCardComponent,
    PrimaryButtonComponent,
    CancelButtonComponent,
    WhatsappButtonComponent,
    PendingStatusComponent,
    ApprovedStatusComponent,
    CanceledStatusComponent,
    CompletedStatusComponent,
    ConfirmationModalComponent,
    BudgetModalComponent
  ],
  host: { class: 'ion-page' }
})
export class ReserveDetailsComponent implements OnInit, OnDestroy {
  reserveId: number = 0;
  clienteId: number = 0; // ID do cliente da reserva

  reserveTitle: string = 'Reserva';
  reserveStatus: UiStatus = 'pending';
  showCancelModal = false;
  showApproveModal = false;

  date: string = '';
  time: string = '';
  peopleCount: string = '';
  description: string = '';
  address: string = '';
  clientName: string = '';
  clientEmail: string = '';
  clientPhone: string = '';

  menuItems: MenuItem[] = [];
  services: ServiceItem[] = [];

  secondaryColor$ = this.themeService.secondaryColor$;

  private subs = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private themeService: ThemeService,
    private navCtrl: NavController,
    private reservationsApi: ReservationsApiService,
    private sessionService: SessionService
  ) {}

  get isAdmin(): boolean {
    return this.sessionService.isAdmin();
  }

  get isClient(): boolean {
    return !this.isAdmin;
  }

  ngOnInit() {
    this.subs.add(
      this.route.queryParams.subscribe(params => {
        this.reserveId = Number(params['id'] || 0);
        this.clienteId = Number(params['clienteId'] || 0);
        this.reserveTitle = params['title'] || 'Reserva';

        if (this.reserveId) {
          this.loadReserve();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private loadReserve() {
    const user = this.sessionService.getUser();
    if (!user?.id) return;

    // Se for buffet owner, usa clienteId da reserva
    // Se for cliente, usa o próprio user.id
    const isBuffetOwner = user.roles === 'BUFFET';
    const clientIdToUse = isBuffetOwner ? this.clienteId : user.id;

    this.subs.add(
      this.reservationsApi.getById(this.reserveId, clientIdToUse).subscribe({
        next: (r) => {
          this.reserveStatus = mapReservaStatusToUi(r.statusReserva);

          this.date = this.formatDatePtBr(r.dataDesejada);
          this.time = this.formatTimePtBr(r.horarioDesejado);
          this.peopleCount = `${r.qtdPessoas} pessoa${r.qtdPessoas === 1 ? '' : 's'}`;

          this.reserveTitle = r.titulo || `Reserva #${r.id}`;

          this.description = r.descricao || '';

          this.address = r.endereco
            ? this.formatAddress(r.endereco)
            : '';

          // TODO: Backend precisa retornar objeto 'cliente' com nome e email
          // Carrega nome do cliente (para admin)
          // if (r.cliente) {
          //   this.clientName = r.cliente.nome || r.cliente.email || 'Cliente não identificado';
          //   this.clientEmail = r.cliente.email || '';
          //   this.clientPhone = r.cliente.telefone || '';
          // }
          // Por enquanto, usar clienteId como fallback
          if (this.isAdmin) {
            this.clientName = `Cliente ID: ${r.clienteId}`;
            this.clientEmail = 'Email não disponível';
            this.clientPhone = 'Telefone não disponível';
          }

          this.menuItems = (r.comidas ?? []).map(c => ({
            id: c.id,
            title: c.nome,
            description: c.descricao,
            imageUrl: '',
            quantity: 1
          }));

          this.services = (r.servicos ?? []).map(s => ({
            id: s.id,
            title: s.nome,
            description: s.descricao,
            imageUrl: '',
            quantity: 1
          }));
        },
        error: (err) => console.error('Erro ao carregar reserva', err)
      })
    );
  }

  private formatAddress(e: any): string {
    const parts = [
      `${e.rua ?? ''}${e.numero ? ', ' + e.numero : ''}`.trim(),
      e.bairro,
      `${e.cidade ?? ''}${e.estado ? ', ' + e.estado : ''}`.trim(),
      e.cep,
      e.complemento
    ].filter(Boolean);

    return parts.join(' - ');
  }

  onBackClick() {
    this.location.back();
  }

  get isCanceled(): boolean {
    return this.reserveStatus === 'canceled';
  }

  get canEdit(): boolean {
    // Cliente pode editar apenas se pendente
    return this.isClient && this.reserveStatus === 'pending';
  }

  get canCancel(): boolean {
    if (this.isAdmin) {
      // Admin pode cancelar se pendente, ou descancelar se cancelado
      // Reservas aprovadas NÃO podem ser canceladas (viram eventos)
      return this.reserveStatus === 'pending' ||
             this.reserveStatus === 'canceled';
    } else {
      // Cliente pode cancelar apenas se pendente (não pode descancelar)
      return this.reserveStatus === 'pending';
    }
  }

  get canApprove(): boolean {
    // Apenas admin pode aprovar, e apenas se pendente
    return this.isAdmin && this.reserveStatus === 'pending';
  }

  onEdit() {
    this.navCtrl.navigateForward('/reserves/reserve-edit', {
      queryParams: {
        id: this.reserveId,
        title: this.reserveTitle,
        status: this.reserveStatus
      }
    });
  }

  onContact() {
    if (this.isAdmin) {
      // Admin entra em contato com o cliente
      if (this.clientPhone && this.clientPhone !== 'Telefone não disponível') {
        const phoneNumber = this.clientPhone.replace(/\D/g, ''); // Remove caracteres não numéricos
        const message = encodeURIComponent(`Olá! Sobre sua reserva "${this.reserveTitle}"`);
        window.open(`https://wa.me/55${phoneNumber}?text=${message}`, '_blank');
      } else {
        console.warn('Telefone do cliente não disponível');
      }
    } else {
      // Cliente entra em contato com o buffet
      // TODO: Implementar quando backend retornar telefone do buffet
      console.warn('Funcionalidade de contato com buffet ainda não implementada');
      // const buffetPhone = this.themeService.getBuffetPhone();
      // if (buffetPhone) {
      //   const phoneNumber = buffetPhone.replace(/\D/g, '');
      //   const message = encodeURIComponent(`Olá! Tenho dúvidas sobre a reserva "${this.reserveTitle}"`);
      //   window.open(`https://wa.me/55${phoneNumber}?text=${message}`, '_blank');
      // }
    }
  }

  onCancel() {
    this.showCancelModal = true;
  }

  onCancelModalClose() {
    this.showCancelModal = false;
  }

  onCancelModalCancel() {
    this.showCancelModal = false;
  }

  onCancelModalConfirm() {
    this.showCancelModal = false;

    const user = this.sessionService.getUser();
    if (!user?.id) return;

    // Se for buffet owner, usa clienteId da reserva
    // Se for cliente, usa o próprio user.id
    const isBuffetOwner = user.roles === 'BUFFET';
    const clientIdToUse = isBuffetOwner ? this.clienteId : user.id;

    this.subs.add(
      this.reservationsApi.cancel(this.reserveId, clientIdToUse).subscribe({
        next: (r) => {
          this.reserveStatus = mapReservaStatusToUi(r.statusReserva);
          this.loadReserve();
        },
        error: (err) => console.error('Erro ao cancelar reserva', err)
      })
    );
  }

  onApprove() {
    this.showApproveModal = true;
  }

  onApproveModalClose() {
    this.showApproveModal = false;
  }

  onApproveModalConfirm(budgetValue: string) {
    // TODO: Implementar aprovação de reserva e criação de evento no backend
    this.showApproveModal = false;
    console.log('Reserva aprovada com valor orçado:', budgetValue);
    // Após aprovação, a reserva deve ter status 'approved' e um evento deve ser criado
  }

  onApproveModalCancel() {
    this.showApproveModal = false;
  }

  onFoodItemClick(item: MenuItem) {
    if (item.id) {
      this.navCtrl.navigateForward(`/client/foods/${item.id}`, {
        queryParams: { name: item.title, fromOrder: 'true' }
      });
    }
  }

  onServiceItemClick(item: ServiceItem) {
    if (item.id) {
      this.navCtrl.navigateForward(`/client/services/${item.id}`, {
        queryParams: { name: item.title, fromOrder: 'true' }
      });
    }
  }

  private formatDatePtBr(iso: string): string {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    if (!y || !m || !d) return iso;
    return `${d}/${m}/${y}`;
  }

  private formatTimePtBr(t: string): string {
    if (!t) return '';
    return t.length >= 5 ? `${t.substring(0, 5)} horas` : t;
  }
}

