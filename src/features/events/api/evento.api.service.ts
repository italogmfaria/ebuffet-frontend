import {inject, Injectable} from "@angular/core";
import {ApiClient} from "../../../core/api/api.client";
import {map, Observable} from "rxjs";
import {DatasIndisponiveisResponse, EventCard, EventoResponse, EventoUpdateRequest, ClienteEventoUpdateRequest, mapEventoStatusToUi} from "../model/events.models";
import {SpringPage} from "../../../core/models/page.model";

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private api = inject(ApiClient);
  private readonly basePath = '/eventos';

  getDatasIndisponiveis(
    dataInicio: string,
    dataFim: string
  ): Observable<DatasIndisponiveisResponse> {
    return this.api.get<DatasIndisponiveisResponse>(
      `${this.basePath}/datas-indisponiveis`,
      {
        dataInicio,
        dataFim
      }
    );
  }

  listMine(
    clienteId: number,
    opts?: { page?: number; size?: number; sort?: string }
  ): Observable<SpringPage<EventoResponse>> {
    const params: Record<string, any> = {
      clienteId,
      page: opts?.page ?? 0,
      size: opts?.size ?? 50,
      sort: opts?.sort ?? 'dataCriacao,DESC',
    };

    return this.api.get<SpringPage<EventoResponse>>( `${this.basePath}/me`, params);
  }

  listByBuffet(
    opts?: { page?: number; size?: number; sort?: string }
  ): Observable<SpringPage<EventoResponse>> {
    const params: Record<string, any> = {
      page: opts?.page ?? 0,
      size: opts?.size ?? 50,
      sort: opts?.sort ?? 'dataCriacao,DESC',
    };

    return this.api.get<SpringPage<EventoResponse>>(this.basePath, params);
  }

  getAllMine(clienteId: number): Observable<EventCard[]> {
    return this.listMine(clienteId).pipe(
      map(page => (page.content ?? []).map(e => ({
        id: e.id,
        reservaId: e.reservaId ?? 0,
        title: e.nome ?? `Evento #${e.id}`,
        description: this.buildDescription(e),
        status: mapEventoStatusToUi(e.statusEvento),
      })))
    );
  }

  private buildDescription(e: EventoResponse): string {
    const inicio = e.inicio ? new Date(e.inicio).toLocaleString('pt-BR') : '';
    const fim = e.fim ? new Date(e.fim).toLocaleString('pt-BR') : '';
    const valor = e.valor != null && e.valor !== '' ? `Valor: R$ ${e.valor}` : '';
    return [
      inicio && `Início: ${inicio}`,
      fim && `Fim: ${fim}`,
      valor
    ].filter(Boolean).join(' • ');
  }

  getById(id: number): Observable<EventoResponse> {
    return this.api.get<EventoResponse>(`${this.basePath}/${id}`);
  }

  update(id: number, body: EventoUpdateRequest, ownerId: number): Observable<EventoResponse> {
    const params = { ownerId: String(ownerId) };
    return this.api.put<EventoResponse>(`${this.basePath}/${id}`, body, params);
  }

  updateByCliente(id: number, body: ClienteEventoUpdateRequest, clienteId: number): Observable<EventoResponse> {
    const params = { clienteId: String(clienteId) };
    return this.api.put<EventoResponse>(`${this.basePath}/${id}/cliente`, body, params);
  }

  updateValor(id: number, valor: number, ownerId: number): Observable<EventoResponse> {
    const body = { valor };
    const params = { ownerId: String(ownerId) };
    return this.api.put<EventoResponse>(`${this.basePath}/${id}/valor`, body, params);
  }

  concluir(id: number, ownerId: number): Observable<EventoResponse> {
    const params = { ownerId: String(ownerId) };
    return this.api.put<EventoResponse>(`${this.basePath}/${id}/concluir`, {}, params);
  }

  cancelar(id: number, ownerId: number): Observable<EventoResponse> {
    const params = { ownerId: String(ownerId) };
    return this.api.put<EventoResponse>(`${this.basePath}/${id}/cancelar`, {}, params);
  }

  cancelarPeloCliente(id: number, clienteId: number): Observable<EventoResponse> {
    const params = { clienteId: String(clienteId) };
    return this.api.put<EventoResponse>(`${this.basePath}/${id}/cliente/cancelar`, {}, params);
  }

  reverterCancelamento(id: number, ownerId: number): Observable<EventoResponse> {
    const params = { ownerId: String(ownerId) };
    return this.api.put<EventoResponse>(`${this.basePath}/${id}/reverter-cancelamento`, {}, params);
  }
}
