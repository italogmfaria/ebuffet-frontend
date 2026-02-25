import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../../../core/api/api.client';
import { NotificacaoResponse } from '../model/notification.models';
import { SpringPage } from '../../../core/models/page.model';
import { SessionService } from '../../../core/services/session.service';

@Injectable({ providedIn: 'root' })
export class NotificacoesApiService {
  private api = inject(ApiClient);
  private sessionService = inject(SessionService);
  private readonly basePath = '/notificacoes';

  list(
    opts?: { page?: number; size?: number; sort?: string }
  ): Observable<SpringPage<NotificacaoResponse>> {
    const user = this.sessionService.getUser();
    if (!user?.id) {
      throw new Error('Usuário não autenticado');
    }

    const params: Record<string, any> = {
      usuarioId: user.id,
      page: opts?.page ?? 0,
      size: opts?.size ?? 20,
      sort: opts?.sort ?? 'dataCriacao,DESC'
    };
    return this.api.get<SpringPage<NotificacaoResponse>>(this.basePath, params);
  }

  countUnread(): Observable<number> {
    const user = this.sessionService.getUser();
    if (!user?.id) {
      throw new Error('Usuário não autenticado');
    }

    return this.api.get<number>(`${this.basePath}/unread-count`, { usuarioId: user.id });
  }

  markAsRead(id: number): Observable<NotificacaoResponse> {
    const user = this.sessionService.getUser();
    if (!user?.id) {
      throw new Error('Usuário não autenticado');
    }

    return this.api.put<NotificacaoResponse>(`${this.basePath}/${id}/mark-as-read`, {}, { usuarioId: user.id });
  }

  delete(id: number): Observable<void> {
    const user = this.sessionService.getUser();
    if (!user?.id) {
      throw new Error('Usuário não autenticado');
    }

    return this.api.delete<void>(`${this.basePath}/${id}`, { usuarioId: user.id });
  }
}
