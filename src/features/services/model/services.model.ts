import {EnumCategoria} from "../../../core/enums/categoria.enum";

export enum Categoria {
  Casamento = 'CASAMENTO',
  Aniversario = 'ANIVERSARIO',
  Formatura = 'FORMATURA',
  Confraternizacao = 'CONFRATERNIZACAO',
  Batizado = 'BATIZADO',
  Bodas = 'BODAS',
  ChaRevelacao = 'CHA_REVELACAO',
  Noivado = 'NOIVADO',
  Jantar = 'JANTAR',
  Almoco = 'ALMOCO',
  Natal = 'NATAL',
  Outros = 'OUTROS'
}

export enum EnumStatus {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
}

export interface ServicoResponse {
  id: number;
  nome: string;
  descricao: string;
  imagemUrl?: string;
  categoria: EnumCategoria;
  buffetId: number;
  dataCriacao: string;
  dataAtualizacao: string;
  status: EnumStatus;
}

export interface SpringPage<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ServicoListDTO extends ServicoResponse {
  imageUrl?: string;
}

export interface ServicoDetailDTO extends ServicoResponse {
  imageUrl?: string;
}

export interface ServicoRequest {
  nome: string;
  descricao: string;
  categoria: EnumCategoria;
  status: EnumStatus;
}
