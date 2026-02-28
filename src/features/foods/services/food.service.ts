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

  getAll(): Observable<ComidaListDTO[]> {
    return this.listByBuffet().pipe(
      map(page => page.content.map((c: ComidaResponse) => ({...c, imageUrl: c.imagemUrl})))
    );
  }

  getById(id: number): Observable<ComidaDetailDTO> {
    return this.api
      .get<ComidaResponse>(`${this.basePath}/${id}`)
      .pipe(map(c => ({...c, imageUrl: c.imagemUrl})));
  }

  create(request: ComidaRequest, ownerId: number, imagem?: File): Observable<ComidaResponse> {
    const params = { ownerId: String(ownerId) };

    const formData = new FormData();
    // Add JSON data as a blob
    const comidaBlob = new Blob([JSON.stringify(request)], { type: 'application/json' });
    formData.append('comida', comidaBlob);

    // Add image if provided
    if (imagem) {
      formData.append('imagem', imagem);
    }

    return this.api.post<ComidaResponse>(this.basePath, formData, params);
  }

  update(id: number, request: ComidaRequest, ownerId: number, imagem?: File): Observable<ComidaResponse> {
    const params = { ownerId: String(ownerId) };

    const formData = new FormData();
    // Add JSON data as a blob
    const comidaBlob = new Blob([JSON.stringify(request)], { type: 'application/json' });
    formData.append('comida', comidaBlob);

    // Add image if provided
    if (imagem) {
      formData.append('imagem', imagem);
    }

    return this.api.put<ComidaResponse>(`${this.basePath}/${id}`, formData, params);
  }

  delete(id: number, ownerId: number, soft: boolean = true): Observable<void> {
    const params = { ownerId: String(ownerId), soft: String(soft) };
    return this.api.delete<void>(`${this.basePath}/${id}`, params);
  }
}
