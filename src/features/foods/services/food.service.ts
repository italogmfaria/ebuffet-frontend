import {inject, Injectable} from "@angular/core";
import {EnumCategoria} from "../../../core/enums/categoria.enum";
import {ComidaDetailDTO, ComidaListDTO, ComidaRequest, ComidaResponse, EnumStatus} from "../model/foods.model";
import {map, Observable} from "rxjs";
import {SpringPage} from "../../../core/models/page.model";
import {ApiClient} from "../../../core/api/api.client";

@Injectable({providedIn: 'root'})
export class FoodsApiService {
  private api = inject(ApiClient);
  private readonly basePath = '/comidas';

  listByBuffet(
    buffetId: number,
    opts?: {
      categoria?: EnumCategoria;
      status?: EnumStatus;
      page?: number;
      size?: number;
      sort?: string;
    }
  ): Observable<SpringPage<ComidaResponse>> {
    const params: Record<string, any> = {
      page: opts?.page ?? 0,
      size: opts?.size ?? 50,
      sort: opts?.sort ?? 'dataCriacao,DESC',
    };
    if (opts?.categoria) params['categoria'] = opts.categoria;
    if (opts?.status) params['status'] = opts.status;

    return this.api.get<SpringPage<ComidaResponse>>(
      this.basePath,
      params
    );
  }

  getAll(buffetId: number): Observable<ComidaListDTO[]> {
    return this.listByBuffet(buffetId).pipe(
      map(page => page.content.map((c: ComidaResponse) => ({...c, imageUrl: undefined})))
    );
  }

  getById(buffetId: number, id: number): Observable<ComidaDetailDTO> {
    return this.api
      .get<ComidaResponse>(`${this.basePath}/${id}`)
      .pipe(map(c => ({...c, imageUrl: undefined})));
  }

  create(request: ComidaRequest, ownerId: number): Observable<ComidaResponse> {
    const params = { ownerId: String(ownerId) };
    return this.api.post<ComidaResponse>(this.basePath, request, params);
  }

  update(id: number, request: ComidaRequest, ownerId: number): Observable<ComidaResponse> {
    const params = { ownerId: String(ownerId) };
    return this.api.put<ComidaResponse>(`${this.basePath}/${id}`, request, params);
  }

  delete(id: number, ownerId: number, soft: boolean = true): Observable<void> {
    const params = { ownerId: String(ownerId), soft: String(soft) };
    return this.api.delete<void>(`${this.basePath}/${id}`, params);
  }
}
