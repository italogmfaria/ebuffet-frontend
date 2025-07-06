import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Buffet} from "../../dtos/buffet-dto";

@Injectable({
  providedIn: 'root'
})
export class BuffetService {

  private apiUrl = 'http://localhost:8080/api/buffets';

  constructor(private http: HttpClient) {}

  getById(id: number): Observable<Buffet> {
    return this.http.get<Buffet>(`${this.apiUrl}/${id}`);
  }

  getMyBuffet(): Observable<Buffet> {
    return this.http.get<Buffet>(`${this.apiUrl}/me`);
  }
}
