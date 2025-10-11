import {inject, Injectable} from "@angular/core";
import {EnumCategoria} from "src/features/shared/enums/categoria.enum";
import {ComidaDetailDTO, ComidaListDTO, ComidaResponse, EnumStatus} from "../../features/foods/model/foods.model";
import {map, Observable} from "rxjs";
import {SpringPage} from "../../features/shared/page/page";
import {ApiClient} from "../api/api.client";

@Injectable({providedIn: 'root'})
export class FoodsApiService {
  private api = inject(ApiClient);
  private readonly basePath = '/buffets';

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
      `${this.basePath}/${buffetId}/comidas`,
      params
    );
  }


  getAll(buffetId: number): Observable<ComidaListDTO[]> {
    return this.listByBuffet(buffetId).pipe(
      map(page => page.content.map(c => ({...c, imageUrl: undefined})))
    );
  }

  getById(buffetId: number, id: number): Observable<ComidaDetailDTO> {
    return this.api
      .get<ComidaResponse>(`${this.basePath}/${buffetId}/comidas/${id}`)
      .pipe(map(c => ({...c, imageUrl: undefined})));
  }
}
