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

  getAll(): Observable<ServicoListDTO[]> {
    return this.listByBuffet().pipe(
      map(page => page.content.map((s: ServicoResponse) => ({...s, imageUrl: s.imagemUrl})))
    );
  }

  getById(id: number): Observable<ServicoDetailDTO> {
    return this.api
      .get<ServicoResponse>(`${this.basePath}/${id}`)
      .pipe(map(s => ({ ...s, imageUrl: s.imagemUrl })));
  }

  getServiceById(id: number) {
    return this.getById(id);
  }

  create(request: ServicoRequest, ownerId: number, imagem?: File): Observable<ServicoResponse> {
    const params = { ownerId: String(ownerId) };

    const formData = new FormData();
    // Add JSON data as a blob
    const servicoBlob = new Blob([JSON.stringify(request)], { type: 'application/json' });
    formData.append('servico', servicoBlob);

    // Add image if provided
    if (imagem) {
      formData.append('imagem', imagem);
    }

    return this.api.post<ServicoResponse>(this.basePath, formData, params);
  }

  update(id: number, request: ServicoRequest, ownerId: number, imagem?: File): Observable<ServicoResponse> {
    const params = { ownerId: String(ownerId) };

    const formData = new FormData();
    // Add JSON data as a blob
    const servicoBlob = new Blob([JSON.stringify(request)], { type: 'application/json' });
    formData.append('servico', servicoBlob);

    // Add image if provided
    if (imagem) {
      formData.append('imagem', imagem);
    }

    return this.api.put<ServicoResponse>(`${this.basePath}/${id}`, formData, params);
  }

  delete(id: number, ownerId: number, soft: boolean = true): Observable<void> {
    const params = { ownerId: String(ownerId), soft: String(soft) };
    return this.api.delete<void>(`${this.basePath}/${id}`, params);
  }
}
