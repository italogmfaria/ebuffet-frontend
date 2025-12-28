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
  ConfirmationModalComponent
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
    ConfirmationModalComponent
  ],
  host: { class: 'ion-page' }
})
export class ReserveDetailsComponent implements OnInit, OnDestroy {
  reserveId: number = 0;

  reserveTitle: string = 'Reserva';
  reserveStatus: UiStatus = 'pending';
  showCancelModal = false;

  date: string = '';
  time: string = '';
  peopleCount: string = '';
  description: string = '';
  address: string = '';

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

  ngOnInit() {
    this.subs.add(
      this.route.queryParams.subscribe(params => {
        this.reserveId = Number(params['id'] || 0);
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

    this.subs.add(
      this.reservationsApi.getById(this.reserveId, user.id).subscribe({
        next: (r) => {
          this.reserveStatus = mapReservaStatusToUi(r.statusReserva);

          this.date = this.formatDatePtBr(r.dataDesejada);
          this.time = this.formatTimePtBr(r.horarioDesejado);
          this.peopleCount = `${r.qtdPessoas} pessoa${r.qtdPessoas === 1 ? '' : 's'}`;

          this.reserveTitle = this.reserveTitle || `Reserva #${r.id}`;

          this.description = r.observacoes || '';

          this.address = r.endereco
            ? this.formatAddress(r.endereco)
            : '';

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
    return this.reserveStatus === 'pending';
  }

  get canCancel(): boolean {
    return this.reserveStatus === 'pending';
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
    // TODO: abrir whatsapp com número do buffet (precisa vir do backend ou theme.json)
    console.log('Entrar em contato via WhatsApp');
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

    this.subs.add(
      this.reservationsApi.cancel(this.reserveId, user.id).subscribe({
        next: (r) => {
          this.reserveStatus = mapReservaStatusToUi(r.statusReserva);
          this.loadReserve();
        },
        error: (err) => console.error('Erro ao cancelar reserva', err)
      })
    );
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

