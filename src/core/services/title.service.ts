import { Injectable } from '@angular/core';
import { SessionService } from './session.service';

@Injectable({ providedIn: 'root' })
export class TitleService {
  constructor(private sessionService: SessionService) {}

  /**
   * Retorna o título apropriado para a página de eventos baseado nas roles do usuário
   */
  getEventsTitle(): string {
    const user = this.sessionService.getUser();
    const roles = user?.roles || [];

    if (roles.includes('BUFFET') || roles.includes('ADMIN')) {
      return 'Eventos';
    } else {
      return 'Meus Eventos';
    }
  }

  /**
   * Retorna o título apropriado para a página de reservas baseado nas roles do usuário
   */
  getReservesTitle(): string {
    const user = this.sessionService.getUser();
    const roles = user?.roles || [];

    if (roles.includes('BUFFET') || roles.includes('ADMIN')) {
      return 'Reservas';
    } else {
      return 'Minhas Reservas';
    }
  }

  /**
   * Verifica se o usuário é admin/buffet
   */
  isAdminOrBuffet(): boolean {
    return this.sessionService.isAdmin();
  }
}

