import {inject, Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {EnumStatus, ServicoDetailDTO, ServicoListDTO, ServicoResponse} from '../model/services.model';
import {EnumCategoria} from '../../shared/enums/categoria.enum';
import {ApiClient} from "../../../shared/api/api.client";
import {SpringPage} from "../../shared/page/page";

@Injectable({
  providedIn: 'root'
})
export class ServicesApiService {

  private api = inject(ApiClient);
  private readonly basePath = '/servicos';

  listByBuffet(
    opts?: {
      categoria?: EnumCategoria;
      status?: EnumStatus;
      page?: number;
      size?: number;
      sort?: string;
      q?: string;
    }
  ): Observable<SpringPage<ServicoResponse>> {
    const params: Record<string, any> = {
      page: opts?.page ?? 0,
      size: opts?.size ?? 50,
      sort: opts?.sort ?? 'dataCriacao,DESC',
    };
    if (opts?.categoria) params['categoria'] = opts.categoria;
    if (opts?.status) params['status'] = opts.status;
    if (opts?.q) params['q'] = opts.q;

    return this.api.get<SpringPage<ServicoResponse>>(
      `${this.basePath}`,
      params
    );
  }

  getAll(): Observable<ServicoListDTO[]> {
    return this.listByBuffet().pipe(
      map(page => page.content.map((s: ServicoResponse) => ({...s, imageUrl: undefined})))
    );
  }

  getById(id: number): Observable<ServicoDetailDTO> {
    return this.api
      .get<ServicoResponse>(`${this.basePath}/${id}`)
      .pipe(map(s => ({ ...s, imageUrl: undefined })));
  }

  getServiceById(id: number) {
    return this.getById(id);
  }
}

