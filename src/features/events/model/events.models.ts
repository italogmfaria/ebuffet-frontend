export interface DatasIndisponiveisResponse {
  datas: string[];
}

export type UiStatus = 'pending' | 'approved' | 'completed' | 'canceled';

export interface EventoResponse {
  id: number;
  nome: string;
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

export function mapEventoStatusToUi(
  status: 'PENDENTE' | 'AGENDADO' | 'CONCLUIDO' | 'CANCELADO' | string
): UiStatus {
  switch (status) {
    case 'PENDENTE':
      return 'pending';
    case 'AGENDADO':
      return 'approved';
    case 'CONCLUIDO':
      return 'completed';
    case 'CANCELADO':
      return 'canceled';
    default:
      return 'pending';
  }
}
