import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../../../core/api/api.client';
import { UpdateUserRequest, UserResponse } from '../model/user.models';

@Injectable({ providedIn: 'root' })
export class UserApiService {
  private api = inject(ApiClient);
  private readonly basePath = '/clientes';

  updateProfile(payload: UpdateUserRequest, foto?: File): Observable<UserResponse> {
    const formData = new FormData();

    // Add JSON data as a blob
    const clienteBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    formData.append('cliente', clienteBlob);

    // Add photo if provided
    if (foto) {
      formData.append('foto', foto);
    }

    return this.api.put<UserResponse>(`${this.basePath}/me`, formData);
  }
}
