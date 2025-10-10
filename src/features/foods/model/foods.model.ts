import { EnumCategoria } from '../../shared/enums/categoria.enum';

export interface Comida {
  id: number;
  nome: string;
  descricao: string;
  categoria: EnumCategoria;
  buffetId: number;
  imageUrl?: string;
  dataCriacao?: Date;
  dataAtualizacao?: Date;
}

// DTO para listagem de comidas
export interface ComidaListDTO {
  id: number;
  nome: string;
  descricao: string;
  categoria: EnumCategoria;
  imageUrl?: string;
}

// DTO para detalhes da comida
export interface ComidaDetailDTO {
  id: number;
  nome: string;
  descricao: string;
  categoria: EnumCategoria;
  buffetId: number;
  imageUrl?: string;
  dataCriacao: Date;
  dataAtualizacao: Date;
}

// DTO para criar/atualizar comida
export interface ComidaFormDTO {
  nome: string;
  descricao: string;
  categoria: EnumCategoria;
  buffetId: number;
  imageUrl?: string;
}
