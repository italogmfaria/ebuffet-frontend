import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../../../core/api/api.client';
import { NotificacaoResponse } from '../model/notification.models';
import { SpringPage } from '../../../core/models/page.model';

@Injectable({ providedIn: 'root' })
export class NotificacoesApiService {
  private api = inject(ApiClient);
  private readonly basePath = '/notificacoes';

  list(
    opts?: { page?: number; size?: number; sort?: string }
  ): Observable<SpringPage<NotificacaoResponse>> {
    const params: Record<string, any> = {
      page: opts?.page ?? 0,
      size: opts?.size ?? 20,
      sort: opts?.sort ?? 'dataCriacao,DESC'
    };
    return this.api.get<SpringPage<NotificacaoResponse>>(this.basePath, params);
  }

  countUnread(): Observable<number> {
    return this.api.get<number>(`${this.basePath}/unread-count`);
  }

  markAsRead(id: number): Observable<NotificacaoResponse> {
    return this.api.put<NotificacaoResponse>(`${this.basePath}/${id}/mark-as-read`, {});
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.basePath}/${id}`);
  }
}
