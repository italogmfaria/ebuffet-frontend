import {EnumCategoria} from "../../../core/enums/categoria.enum";

export interface ComidaListDTO {
  id: number;
  nome: string;
  descricao: string;
  categoria: EnumCategoria;
  imageUrl?: string;
}

export enum EnumStatus {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
}

export interface ComidaResponse {
  id: number;
  nome: string;
  descricao: string;
  categoria: EnumCategoria;
  buffetId: number;
  status: EnumStatus;
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface ComidaListDTO extends ComidaResponse {
  imageUrl?: string;
}

export interface ComidaDetailDTO extends ComidaResponse {
  imageUrl?: string;
}

export interface ComidaRequest {
  nome: string;
  descricao: string;
  categoria: EnumCategoria;
}
