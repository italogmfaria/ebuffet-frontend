export interface ReservationDetails {
  nome: string;
  descricao: string;
  qtdPessoas: number;
  horarioDesejado: string;
  dataDesejada: string;
}

export interface ReservationDraft {
  buffetId: number;
  details?: ReservationDetails;
  address?: any;
  foodIds?: Array<{ id: number; quantity: number }>;
  serviceIds?: number[];
}

export interface EnderecoRequest {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  complemento?: string | null;
}

export interface ReservaRequest {
  buffetId: number;
  qtdPessoas: number;
  dataDesejada: string;
  horarioDesejado: string;
  endereco: EnderecoRequest;

  servicoIds?: number[];
  comidaIds?: number[];
  observacoes?: string | null;
}

export interface ReservaResponse {
  id: number;
  statusReserva: 'PENDENTE' | 'APROVADA' | 'CANCELADA' | string;
  status: 'ATIVO' | 'INATIVO' | string;
  buffetId: number;
  clienteId: number;
  eventoId: number | null;
  dataDesejada: string;
  horarioDesejado: string;
  qtdPessoas: number;
}
