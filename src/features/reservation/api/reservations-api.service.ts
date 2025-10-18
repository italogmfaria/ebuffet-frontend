// features/reservations/api/reservations-api.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {ApiClient} from "../../../shared/api/api.client";
import {ReservaRequest, ReservaResponse} from "../model/reservation.models";
import {SpringPage} from "../../shared/page/page";

@Injectable({ providedIn: 'root' })
export class ReservationsApiService {
  private api = inject(ApiClient);

  create(clienteId: number, body: ReservaRequest): Observable<ReservaResponse> {
    return this.api.post<ReservaResponse>('/reservas', body, { clienteId });
  }

  getById(id: number): Observable<ReservaResponse> {
    return this.api.get<ReservaResponse>(`/reservas/${id}`);
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
    return this.api.get<SpringPage<ReservaResponse>>('/reservas/me', params);
  }

  updateItems(
    id: number,
    clienteId: number,
    payload: { comidaIds?: number[]; servicoIds?: number[] }
  ): Observable<ReservaResponse> {
    return this.api.put<ReservaResponse>(`/reservas/${id}/itens`, payload, { clienteId });
  }

  cancel(id: number, clienteId: number, motivo?: string): Observable<ReservaResponse> {
    const body = motivo ? { motivo } : {};
    return this.api.put<ReservaResponse>(`/reservas/${id}/cancelar`, body, { clienteId });
  }
}
