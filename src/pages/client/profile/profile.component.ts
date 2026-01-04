import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {
  ClientNavbarComponent,
  ConfirmationModalComponent,
  EditCircleComponent,
  LogoutCircleComponent,
  ModelPageComponent,
  ProfileListItemComponent,
  ProfilePlaceholderComponent
} from '../../../shared/ui/templates/exports';
import {NavController} from '@ionic/angular/standalone';
import {ThemeService} from '../../../core/services/theme.service';
import {SessionService} from '../../../core/services/session.service';
import {OrderService} from '../../../features/orders/services/order.service';
import {ReservationsApiService} from "../../../features/reservations/api/reservations-api.service";
import {EventoService} from "../../../features/events/api/evento.api.service";
import {Subscription} from "rxjs";
import {
  EventItem,
  mapReservaStatusToUi,
  ReserveItem
} from "../../../features/cliente-profile/model/cliente-profile.model";
import {mapEventoStatusToUi} from "../../../features/events/model/events.models";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    ModelPageComponent,
    ConfirmationModalComponent,
    ClientNavbarComponent,
    LogoutCircleComponent,
    EditCircleComponent,
    ProfilePlaceholderComponent,
    ProfileListItemComponent
  ],
  host: {class: 'ion-page'}
})
export class ProfileComponent implements OnInit {
  primaryColor$ = this.themeService.primaryColor$;
  secondaryColor$ = this.themeService.secondaryColor$;
  accentColor$ = this.themeService.accentColor$;
  @Input() cartItemCount = 0;

  userName = 'Nome';
  userEmail = 'email@gmail.com';
  userPhone = '(99) 999999999';
  userProfileImage: string | null = null; // URL da imagem ou null para mostrar placeholder

  showLogoutModal = false;

  reserves: ReserveItem[] = [];
  events: EventItem[] = [];

  private subs = new Subscription();

  constructor(
    private themeService: ThemeService,
    private navCtrl: NavController,
    private sessionService: SessionService,
    private orderService: OrderService,
    private reservationsApi: ReservationsApiService,
    private eventoService: EventoService
  ) {
  }

  ngOnInit() {
    this.subs.add(
      this.orderService.orderItems$.subscribe(() => {
        this.cartItemCount = this.orderService.getTotalItems();
      })
    );

    this.loadUserData();
    this.loadReservesAndEvents();
  }

  ionViewWillEnter() {
    this.loadUserData();
    this.loadReservesAndEvents();
  }

  private loadUserData() {
    const user = this.sessionService.getUser();
    if (user) {
      this.userName = user.nome || 'Nome';
      this.userEmail = user.email || 'email@gmail.com';
      this.userPhone = this.formatPhone(user.telefone || '');
      this.userProfileImage = null;
    }
  }

  private loadReservesAndEvents() {
    const user = this.sessionService.getUser();
    if (!user?.id) return;

    // Carrega reservas
    this.subs.add(
      this.reservationsApi.listMine(user.id, {page: 0, size: 50}).subscribe({
        next: (page) => {
          const content = page.content ?? [];

          this.reserves = content.slice(0, 3).map(r => ({
            id: r.id,
            title: r.titulo || `Reserva #${r.id}`,
            status: mapReservaStatusToUi(r.statusReserva)
          }));
        },
        error: (err) => console.error('Erro ao carregar reservas', err)
      })
    );

    // Carrega eventos usando o endpoint correto /eventos/me
    this.subs.add(
      this.eventoService.listMine(user.id, {page: 0, size: 50}).subscribe({
        next: (page) => {
          const content = page.content ?? [];

          this.events = content.slice(0, 4).map(e => ({
            id: e.id,
            reservaId: e.reservaId ?? 0,
            title: e.nome || `Evento #${e.id}`,
            status: mapEventoStatusToUi(e.statusEvento)
          }));
        },
        error: (err) => console.error('Erro ao carregar eventos', err)
      })
    );
  }

  /**
   * Formata o telefone para exibição
   */
  private formatPhone(value: string): string {
    if (!value) return '';

    // Remove tudo que não é dígito
    value = value.replace(/\D/g, '');

    // Limita a 11 dígitos
    value = value.substring(0, 11);

    // Aplica a formatação
    if (value.length <= 2) {
      return value.replace(/(\d{0,2})/, '($1');
    } else if (value.length <= 6) {
      return value.replace(/(\d{2})(\d{0,4})/, '($1) $2');
    } else if (value.length <= 10) {
      return value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
      // Celular com 11 dígitos: (XX) XXXXX-XXXX
      return value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  }

  onBackClick() {
    this.navCtrl.navigateBack('/client/home');
  }

  onLogout() {
    this.showLogoutModal = true;
  }

  onConfirmLogout() {
    this.showLogoutModal = false;
    try {
      this.sessionService.logout();
    } catch (e) {
      console.error('Erro ao fazer logout', e);
    }
    this.navCtrl.navigateRoot('/welcome');
  }

  onCancelLogout() {
    this.showLogoutModal = false;
  }

  onCloseModal() {
    this.showLogoutModal = false;
  }

  onEdit() {
    // TODO: Navigate to edit profile page
    this.navCtrl.navigateForward('/client/profile-edit');
  }

  onReserveClick(reserve: ReserveItem) {
    this.navCtrl.navigateForward('/reserves/reserve-details', {
      queryParams: {id: reserve.id}
    });
  }

  onEventClick(event: EventItem) {
    this.navCtrl.navigateForward('/events/event-details', {
      queryParams: {id: event.id, reservaId: event.reservaId}
    });
  }

  onViewAllReserves() {
    console.log('View all reserves');
    this.navCtrl.navigateForward('/reserves');
  }

  onViewAllEvents() {
    console.log('View all events');
    this.navCtrl.navigateForward('/events');
  }
}
