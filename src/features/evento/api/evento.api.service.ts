import {inject, Injectable} from "@angular/core";
import {ApiClient} from "../../../shared/api/api.client";
import {map, Observable} from "rxjs";
import {DatasIndisponiveisResponse, EventCard, EventoResponse, mapEventoStatusToUi} from "../model/evento.models";
import {SpringPage} from "../../shared/page/page";

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
}
