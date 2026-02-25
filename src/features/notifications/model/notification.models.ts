export type EnumStatus = 'ATIVO' | 'INATIVO' | string;

export interface NotificacaoResponse {
  id: number;
  usuarioId: number;
  titulo: string;
  mensagem: string;
  lida: boolean;
  reservaId: number | null;
  status: EnumStatus;
  dataCriacao: string;
  dataLeitura: string | null;
}
