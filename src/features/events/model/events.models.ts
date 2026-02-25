export interface DatasIndisponiveisResponse {
  datas: string[];
}

export type UiStatus = 'pending' | 'approved' | 'completed' | 'canceled';

export type EnumStatusEvento = 'AGENDADO' | 'CONCLUIDO' | 'CANCELADO';
export type EnumStatus = 'ATIVO' | 'INATIVO';

export interface EventoResponse {
  id: number;
  nome: string;
  descricao?: string;
  statusEvento: string;
  status: string;
  buffetId: number;
  reservaId: number;
  clienteId: number;
  inicio: string;
  fim: string;
  valor: string | number | null;
}

export interface EventCard {
  id: number;
  title: string;
  description: string;
  status: UiStatus;
  reservaId: number;
}

export interface EventoUpdateRequest {
  nome: string;
  statusEvento: EnumStatusEvento;
  status: EnumStatus;
  inicio: string; // ISO datetime string
  fim: string; // ISO datetime string
  valor: number;
  descricao?: string;
  comidaIds?: number[];
  servicoIds?: number[];
}

export interface EnderecoRequest {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  complemento?: string;
}

export interface ClienteEventoUpdateRequest {
  comidaIds?: number[];
  servicoIds?: number[];
  qtdPessoas?: number;
  inicio?: string; // ISO datetime string
  fim?: string; // ISO datetime string
  endereco?: EnderecoRequest;
}

export function mapEventoStatusToUi(
  status: 'AGENDADO' | 'CONCLUIDO' | 'CANCELADO' | string
): UiStatus {
  switch (status) {
    case 'AGENDADO':
      return 'approved';
    case 'CONCLUIDO':
      return 'completed';
    case 'CANCELADO':
      return 'canceled';
    default:
      return 'approved'; // Default para AGENDADO
  }
}
