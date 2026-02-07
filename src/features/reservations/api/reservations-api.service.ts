import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {ApiClient} from "../../../core/api/api.client";
import {ReservaRequest, ReservaResponse, ReservaUpdateRequest} from "../model/reservation.models";
import {SpringPage} from "../../../core/models/page.model";

@Injectable({ providedIn: 'root' })
export class ReservationsApiService {
  private api = inject(ApiClient);

  create(clienteId: number, body: ReservaRequest): Observable<ReservaResponse> {
    return this.api.post<ReservaResponse>('/clientes/reservas', body, { clienteId });
  }

  getById(id: number, clienteId: number): Observable<ReservaResponse> {
    return this.api.get<ReservaResponse>(`/clientes/reservas/${id}`, { clienteId });
  }

  update(id: number, clienteId: number, body: ReservaUpdateRequest): Observable<ReservaResponse> {
    return this.api.put<ReservaResponse>(`/clientes/reservas/${id}`, body, { clienteId });
  }

  listMine(
    clienteId: number,
    opts?: { page?: number; size?: number; sort?: string }
  ): Observable<SpringPage<ReservaResponse>> {
    const params: Record<string, any> = {
      clienteId,
      page: opts?.page ?? 0,
      size: opts?.size ?? 20,
      sort: opts?.sort ?? 'dataCriacao,DESC'
    };
    return this.api.get<SpringPage<ReservaResponse>>('/clientes/reservas/me', params);
  }

  listByBuffet(
    ownerId: number,
    opts?: { page?: number; size?: number; sort?: string }
  ): Observable<SpringPage<ReservaResponse>> {
    const params: Record<string, any> = {
      ownerId,
      page: opts?.page ?? 0,
      size: opts?.size ?? 20,
      sort: opts?.sort ?? 'dataCriacao,DESC'
    };
    return this.api.get<SpringPage<ReservaResponse>>('/buffets/reservas', params);
  }

  updateItems(
    id: number,
    clienteId: number,
    payload: { comidaIds?: number[]; servicoIds?: number[] }
  ): Observable<ReservaResponse> {
    return this.api.put<ReservaResponse>(`/clientes/reservas/${id}/itens`, payload, { clienteId });
  }

  cancel(id: number, clienteId: number, motivo?: string): Observable<ReservaResponse> {
    const body = motivo ? { motivo } : {};
    return this.api.put<ReservaResponse>(`/clientes/reservas/${id}/cancelar`, body, { clienteId });
  }

  // Aprovar reserva com opção de bloquear dia no calendário
  approve(id: number, ownerId: number, valor?: number, blockDay?: boolean): Observable<ReservaResponse> {
    const body: any = {};
    if (valor !== undefined) {
      body.valor = valor;
    }
    if (blockDay !== undefined) {
      body.blockDay = blockDay;
    }
    return this.api.put<ReservaResponse>(`/buffets/reservas/aprovar/${id}`, body, { ownerId });
  }

  reverterCancelamento(id: number, ownerId: number): Observable<ReservaResponse> {
    return this.api.put<ReservaResponse>(`/buffets/reservas/reverter-cancelamento/${id}`, {}, { ownerId });
  }
}
