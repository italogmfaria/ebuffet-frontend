import { Injectable, inject } from '@angular/core';
import { ApiClient } from '../../../shared/api/api.client';
import { Observable } from 'rxjs';
import {AuthRequest, AuthResponse, RegisterRequest, UserResponse} from "../model/auth.type";

@Injectable({ providedIn: 'root' })
export class AuthApi {
  private api = inject(ApiClient);

  login(payload: AuthRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/auth/login', payload);
  }

  register(payload: RegisterRequest): Observable<UserResponse> {
    return this.api.post<UserResponse>('/auth/register', payload);
  }
}
