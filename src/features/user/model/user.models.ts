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
  buffetId: number | null;
  fotoUrl?: string | null;
}
