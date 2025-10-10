import { EnumCategoria } from '../../shared/enums/categoria.enum';

export interface Servico {
  id: number;
  nome: string;
  descricao: string;
  categoria: EnumCategoria;
  buffetId: number;
  imageUrl?: string;
  dataCriacao?: Date;
  dataAtualizacao?: Date;
}

// DTO para listagem de serviços
export interface ServicoListDTO {
  id: number;
  nome: string;
  descricao: string;
  categoria: EnumCategoria;
  imageUrl?: string;
}

// DTO para detalhes do serviço
export interface ServicoDetailDTO {
  id: number;
  nome: string;
  descricao: string;
  categoria: EnumCategoria;
  buffetId: number;
  imageUrl?: string;
  dataCriacao: Date;
  dataAtualizacao: Date;
}

// DTO para criar/atualizar serviço
export interface ServicoFormDTO {
  nome: string;
  descricao: string;
  categoria: EnumCategoria;
  buffetId: number;
  imageUrl?: string;
}

