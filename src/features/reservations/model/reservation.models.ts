export interface EnderecoResponse {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  complemento?: string | null;
}

export interface ComidaResumoResponse {
  id: number;
  nome: string;
  descricao: string;
}

export interface ServicoResumoResponse {
  id: number;
  nome: string;
  descricao: string;
}

export type EnumStatusReserva = 'PENDENTE' | 'APROVADA' | 'CANCELADA' | 'CONCLUIDA' | string;
export type EnumStatus = 'ATIVO' | 'INATIVO' | string;

export interface ReservaResponse {
  id: number;
  statusReserva: EnumStatusReserva;
  status: EnumStatus;

  buffetId: number;
  clienteId: number;
  eventoId: number | null;

  dataDesejada: string;
  horarioDesejado: string;
  qtdPessoas: number;

  observacoes?: string | null;
  endereco?: EnderecoResponse | null;
  comidas?: ComidaResumoResponse[];
  servicos?: ServicoResumoResponse[];
}


export interface ReservationDetails {
  nome: string;
  descricao: string;
  qtdPessoas: number;
  horarioDesejado: string;
  dataDesejada: string;
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

  comidaIds?: number[];
  servicoIds?: number[];
  observacoes?: string | null;
}
