import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";

@Injectable({ providedIn: 'root' })
export class ApiClient {
  private http = inject(HttpClient);
  private baseUrl = environment.API_URL;

  /**
   * Realiza uma requisição GET
   */
  get<T>(endpoint: string, params?: Record<string, any>, headers?: Record<string, string>): Observable<T> {
    const options = {
      params: new HttpParams({ fromObject: params ?? {} }),
      headers: new HttpHeaders(headers ?? {})
    };
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, options);
  }

  /**
   * Realiza uma requisição POST
   */
  post<T>(endpoint: string, body: any, headers?: Record<string, string>): Observable<T> {
    const options = {
      headers: new HttpHeaders(headers ?? {})
    };
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body, options);
  }

  /**
   * Realiza uma requisição PUT
   */
  put<T>(endpoint: string, body: any, headers?: Record<string, string>): Observable<T> {
    const options = {
      headers: new HttpHeaders(headers ?? {})
    };
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body, options);
  }

  /**
   * Realiza uma requisição PATCH
   */
  patch<T>(endpoint: string, body: any, headers?: Record<string, string>): Observable<T> {
    const options = {
      headers: new HttpHeaders(headers ?? {})
    };
    return this.http.patch<T>(`${this.baseUrl}${endpoint}`, body, options);
  }

  /**
   * Realiza uma requisição DELETE
   */
  delete<T>(endpoint: string, headers?: Record<string, string>): Observable<T> {
    const options = {
      headers: new HttpHeaders(headers ?? {})
    };
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, options);
  }
}
