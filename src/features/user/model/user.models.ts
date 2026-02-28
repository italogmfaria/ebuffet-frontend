export interface UpdateUserRequest {
  nome: string;
  email: string;
  telefone?: string | null;
}

export interface UserResponse {
  id: number;
  nome: string;
  email: string;
  telefone?: string | null;
  roles: string;
  fotoUrl?: string | null;
}
