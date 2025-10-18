import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";

@Injectable({ providedIn: 'root' })
export class ApiClient {
  private http = inject(HttpClient);
  private baseUrl = environment.API_URL;

  /** Converte todos os parâmetros para string */
  private normalizeParams(params?: Record<string, any>): Record<string, string> | undefined {
    if (!params) return undefined;
    const normalized: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        normalized[key] = String(value);
      }
    }
    return normalized;
  }

  /** GET */
  get<T>(path: string, params?: Record<string, any>): Observable<T> {
    const normalized = this.normalizeParams(params);
    return this.http.get<T>(`${this.baseUrl}${path}`, { params: normalized });
  }

  /** POST */
  post<T>(path: string, body?: any, params?: Record<string, any>): Observable<T> {
    const normalized = this.normalizeParams(params);
    return this.http.post<T>(`${this.baseUrl}${path}`, body, { params: normalized });
  }

  /** PUT */
  put<T>(path: string, body?: any, params?: Record<string, any>): Observable<T> {
    const normalized = this.normalizeParams(params);
    return this.http.put<T>(`${this.baseUrl}${path}`, body, { params: normalized });
  }

  /** DELETE */
  delete<T>(path: string, params?: Record<string, any>): Observable<T> {
    const normalized = this.normalizeParams(params);
    return this.http.delete<T>(`${this.baseUrl}${path}`, { params: normalized });
  }
}
