import {inject, Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {EnumStatus, ServicoDetailDTO, ServicoListDTO, ServicoRequest, ServicoResponse} from '../model/services.model';
import {EnumCategoria} from '../../../core/enums/categoria.enum';
import {ApiClient} from "../../../core/api/api.client";
import {SpringPage} from "../../../core/models/page.model";

@Injectable({
  providedIn: 'root'
})
export class ServicesApiService {

  private api = inject(ApiClient);
  private readonly basePath = '/servicos';

  listByBuffet(
    buffetId: number,
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
      this.basePath,
      params
    );
  }

  getAll(buffetId: number): Observable<ServicoListDTO[]> {
    return this.listByBuffet(buffetId).pipe(
      map(page => page.content.map((s: ServicoResponse) => ({...s, imageUrl: undefined})))
    );
  }

  getById(buffetId: number, id: number): Observable<ServicoDetailDTO> {
    return this.api
      .get<ServicoResponse>(`${this.basePath}/${id}`)
      .pipe(map(s => ({ ...s, imageUrl: undefined })));
  }

  getServiceById(buffetId: number, id: number) {
    return this.getById(buffetId, id);
  }

  create(request: ServicoRequest, ownerId: number): Observable<ServicoResponse> {
    const params = { ownerId: String(ownerId) };
    return this.api.post<ServicoResponse>(this.basePath, request, params);
  }

  update(id: number, request: ServicoRequest, ownerId: number): Observable<ServicoResponse> {
    const params = { ownerId: String(ownerId) };
    return this.api.put<ServicoResponse>(`${this.basePath}/${id}`, request, params);
  }

  delete(id: number, ownerId: number, soft: boolean = true): Observable<void> {
    const params = { ownerId: String(ownerId), soft: String(soft) };
    return this.api.delete<void>(`${this.basePath}/${id}`, params);
  }
}
