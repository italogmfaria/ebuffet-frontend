/**
 * Enum de categorias de eventos
 * Deve espelhar o enum EnumCategoria do backend
 */
export enum EnumCategoria {
  ALMOCO = 'ALMOCO',
  JANTAR = 'JANTAR',
  CASAMENTO = 'CASAMENTO',
  ANIVERSARIO = 'ANIVERSARIO',
  FORMATURA = 'FORMATURA',
  CONFRATERNIZACAO = 'CONFRATERNIZACAO',
  BATIZADO = 'BATIZADO',
  BODAS = 'BODAS',
  CHA_REVELACAO = 'CHA_REVELACAO',
  NOIVADO = 'NOIVADO',
  NATAL = 'NATAL',
  OUTROS = 'OUTROS'
}

/**
 * Labels legíveis para cada categoria
 */
export const CategoriasLabels: Record<EnumCategoria, string> = {
  [EnumCategoria.ALMOCO]: 'Almoço',
  [EnumCategoria.JANTAR]: 'Jantar',
  [EnumCategoria.CASAMENTO]: 'Casamento',
  [EnumCategoria.ANIVERSARIO]: 'Aniversário',
  [EnumCategoria.FORMATURA]: 'Formatura',
  [EnumCategoria.CONFRATERNIZACAO]: 'Confraternização',
  [EnumCategoria.BATIZADO]: 'Batizado',
  [EnumCategoria.BODAS]: 'Bodas',
  [EnumCategoria.CHA_REVELACAO]: 'Chá Revelação',
  [EnumCategoria.NOIVADO]: 'Noivado',
  [EnumCategoria.NATAL]: 'Natal',
  [EnumCategoria.OUTROS]: 'Outros'
};

/**
 * Mapeamento dos IDs do componente default-categories para os enums
 */
export const CategoriaIdMapping: Record<string, EnumCategoria> = {
  'almoco': EnumCategoria.ALMOCO,
  'jantar': EnumCategoria.JANTAR,
  'casamento': EnumCategoria.CASAMENTO,
  'aniversario': EnumCategoria.ANIVERSARIO,
  'formatura': EnumCategoria.FORMATURA,
  'confraternizacao': EnumCategoria.CONFRATERNIZACAO,
  'batizado': EnumCategoria.BATIZADO,
  'bodas': EnumCategoria.BODAS,
  'cha-revelacao': EnumCategoria.CHA_REVELACAO,
  'noivado': EnumCategoria.NOIVADO,
  'natal': EnumCategoria.NATAL,
  'outros': EnumCategoria.OUTROS
};
