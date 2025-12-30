import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../../../core/api/api.client';
import { UpdateUserRequest, UserResponse } from '../model/user.models';

@Injectable({ providedIn: 'root' })
export class UserApiService {
  private api = inject(ApiClient);
  private readonly basePath = '/clientes';

  updateProfile(payload: UpdateUserRequest): Observable<UserResponse> {
    return this.api.put<UserResponse>(`${this.basePath}/me`, payload);
  }
}
