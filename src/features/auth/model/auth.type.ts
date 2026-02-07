export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
  telefone?: string | null;
}

export interface UserResponse {
  id: number;
  nome: string;
  email: string;
  telefone?: string | null;
  roles: string[];
  fotoUrl?: string | null;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  roles: string[];
}

export interface MeResponse {
  id: number;
  nome: string;
  email: string;
  telefone?: string | null;
  roles: string[];
  fotoUrl?: string | null;
}
