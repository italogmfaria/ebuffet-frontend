import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {
  ModelPageComponent,
  ClientNavbarComponent,
  LogoutCircleComponent,
  EditCircleComponent,
  ConfirmationModalComponent,
  ProfilePlaceholderComponent,
  ProfileListItemComponent
} from '../../../shared/ui/templates/exports';
import {NavController} from '@ionic/angular/standalone';
import { ThemeService } from '../../../shared/services/theme.service';
import { SessionService } from '../../../shared/services/session.service';
import { OrderService } from '../../../shared/services/order.service';

interface ReserveItem {
  title: string;
  status: 'pending' | 'approved' | 'canceled' | 'completed';
}

interface EventItem {
  title: string;
  status: 'pending' | 'approved' | 'canceled' | 'completed';
}

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
  host: { class: 'ion-page' }
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

  reserves: ReserveItem[] = [
    { title: 'Casamento', status: 'pending' },
    { title: 'Aniversário', status: 'approved' },
    { title: 'Confraternização', status: 'canceled' }
  ];

  events: EventItem[] = [
    { title: 'Casamento', status: 'pending' },
    { title: 'Chá Revelação', status: 'approved' },
    { title: 'Aniversário', status: 'completed' },
    { title: 'Confraternização', status: 'canceled' }
  ];

  constructor(
    private themeService: ThemeService,
    private navCtrl: NavController,
    private sessionService: SessionService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    // Inscrever no observable do carrinho
    this.orderService.orderItems$.subscribe(() => {
      this.cartItemCount = this.orderService.getTotalItems();
    });
  }

  /**
   * Ionic lifecycle: executado toda vez que a página está prestes a ser exibida
   * Usado para recarregar os dados do usuário quando voltar de profile-edit
   */
  ionViewWillEnter() {
    this.loadUserData();
  }

  /**
   * Carrega os dados do usuário da sessão
   */
  private loadUserData() {
    const user = this.sessionService.getUser();
    if (user) {
      this.userName = user.nome || 'Nome';
      this.userEmail = user.email || 'email@gmail.com';
      // Formatar telefone ao carregar
      this.userPhone = this.formatPhone(user.telefone || '');
      // TODO: Integrar com backend - user.profileImage ou user.fotoPerfil
      this.userProfileImage = null; // Mockado: null = sem imagem, mostra placeholder
      // Exemplo para quando integrar: this.userProfileImage = user.fotoPerfil || null;
    }
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
    console.log('Reserve clicked:', reserve);
    this.navCtrl.navigateForward('/reserves/reserve-details', {
      queryParams: { title: reserve.title, status: reserve.status }
    });
  }

  onEventClick(event: EventItem) {
    console.log('Event clicked:', event);
    this.navCtrl.navigateForward('/events/event-details', {
      queryParams: { title: event.title, status: event.status }
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
