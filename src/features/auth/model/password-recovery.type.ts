export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface VerifyCodeRequest {
  email: string;
  codigo: string;
}

export interface VerifyCodeResponse {
  valido: boolean;
}

export interface ResetPasswordRequest {
  email: string;
  codigo: string;
  novaSenha: string;
}

export interface ResetPasswordResponse {
  message: string;
}
