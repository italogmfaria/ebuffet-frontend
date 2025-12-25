import {inject, Injectable} from "@angular/core";
import {ApiClient} from "../../../shared/api/api.client";
import {Observable} from "rxjs";
import {DatasIndisponiveisResponse} from "../model/evento.models";

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
}
