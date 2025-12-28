import {inject, Injectable} from "@angular/core";
import {EnumCategoria} from "../../../core/enums/categoria.enum";
import {ComidaDetailDTO, ComidaListDTO, ComidaResponse, EnumStatus} from "../model/foods.model";
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
      `${this.basePath}`,
      params
    );
  }


  getAll(): Observable<ComidaListDTO[]> {
    return this.listByBuffet().pipe(
      map(page => page.content.map((c: ComidaResponse) => ({...c, imageUrl: undefined})))
    );
  }

  getById(id: number): Observable<ComidaDetailDTO> {
    return this.api
      .get<ComidaResponse>(`${this.basePath}/${id}`)
      .pipe(map(c => ({...c, imageUrl: undefined})));
  }
}
