import { Injectable, inject } from '@angular/core';
import { ApiClient } from '../../../core/api/api.client';
import { Observable } from 'rxjs';
import {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  VerifyCodeRequest,
  VerifyCodeResponse,
  ResetPasswordRequest,
  ResetPasswordResponse
} from '../model/password-recovery.type';

@Injectable({ providedIn: 'root' })
export class PasswordRecoveryApi {
  private api = inject(ApiClient);

  forgotPassword(payload: ForgotPasswordRequest): Observable<ForgotPasswordResponse> {
    return this.api.post<ForgotPasswordResponse>('/auth/password/forgot', payload);
  }

  verifyCode(payload: VerifyCodeRequest): Observable<VerifyCodeResponse> {
    return this.api.post<VerifyCodeResponse>('/auth/password/verify-code', payload);
  }

  resetPassword(payload: ResetPasswordRequest): Observable<ResetPasswordResponse> {
    return this.api.post<ResetPasswordResponse>('/auth/password/reset', payload);
  }
}
