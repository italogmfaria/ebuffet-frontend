import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export interface AddressData {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface State {
  id: number;
  sigla: string;
  nome: string;
}

@Injectable({
  providedIn: 'root'
})
export class ViaCepService {
  private readonly API_URL = 'https://viacep.com.br/ws';
  private readonly IBGE_API_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';

  constructor(private http: HttpClient) {}

  /**
   * Busca todos os estados do Brasil
   */
  getStates(): Observable<State[]> {
    return this.http.get<State[]>(this.IBGE_API_URL)
      .pipe(
        map(states => states.sort((a, b) => a.nome.localeCompare(b.nome))),
        catchError(() => of([]))
      );
  }

  /**
   * Busca endereço pelo CEP
   * @param cep CEP no formato 00000-000 ou 00000000
   */
  getAddressByCep(cep: string): Observable<AddressData | null> {
    // Remove caracteres não numéricos
    const cleanCep = cep.replace(/\D/g, '');

    // Valida se o CEP tem 8 dígitos
    if (cleanCep.length !== 8) {
      return of(null);
    }

    return this.http.get<ViaCepResponse>(`${this.API_URL}/${cleanCep}/json/`)
      .pipe(
        map(response => {
          if (response.erro) {
            return null;
          }
          return {
            street: '',
            neighborhood: '',
            city: response.localidade || '',
            state: response.uf || '',
            zipCode: this.formatCep(response.cep)
          };
        }),
        catchError(() => of(null))
      );
  }

  /**
   * Formata o CEP no padrão 00000-000
   */
  private formatCep(cep: string): string {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      return `${cleanCep.substring(0, 5)}-${cleanCep.substring(5)}`;
    }
    return cleanCep;
  }
}
