import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Servico, ServicoListDTO, ServicoDetailDTO } from '../model/services.model';
import { EnumCategoria } from '../../shared/enums/categoria.enum';

@Injectable({
  providedIn: 'root'
})
export class ServicesApiService {

  // Dados mockados de serviços de buffet
  private mockServices: Servico[] = [
    {
      id: 1,
      nome: 'Decoração Completa',
      descricao: 'Decoração completa para o evento incluindo arranjos florais, iluminação temática, toalhas de mesa personalizadas e centro de mesa elegante. Nossa equipe cria um ambiente sofisticado e harmonioso que transforma qualquer espaço em um cenário memorável.\n\nInclui: 20 arranjos florais, iluminação LED colorida com controle de ambiente, toalhas de linho premium para todas as mesas, centros de mesa personalizados, painel decorativo para fotos e backdrop temático.\n\nPerfeito para eventos de 100 a 200 pessoas.',
      categoria: EnumCategoria.CASAMENTO,
      buffetId: 1,
      imageUrl: '',
      dataCriacao: new Date('2024-01-01'),
      dataAtualizacao: new Date('2024-01-01')
    },
    {
      id: 2,
      nome: 'Garçons Profissionais',
      descricao: 'Equipe experiente de garçons e garçonetes uniformizados para atendimento impecável aos seus convidados. Treinados em etiqueta e serviço de alto padrão, garantem agilidade e cordialidade durante todo o evento.\n\nInclui: Garçons uniformizados, coordenador de serviço, briefing pré-evento, atendimento de mesa americana ou francesa, serviço de welcome drink e limpeza durante o evento.\n\nDisponíveis em equipes de 5 a 20 profissionais conforme o número de convidados.',
      categoria: EnumCategoria.ANIVERSARIO,
      buffetId: 1,
      imageUrl: '',
      dataCriacao: new Date('2024-01-01'),
      dataAtualizacao: new Date('2024-01-01')
    },
    {
      id: 3,
      nome: 'DJ e Som Profissional',
      descricao: 'Serviço completo de DJ profissional com equipamento de som de alta qualidade, iluminação cênica e playlist personalizada. Criamos a trilha sonora perfeita para cada momento do seu evento, do coquetel à pista de dança.\n\nInclui: DJ profissional por 6 horas, sistema de som potente (até 500 pessoas), iluminação RGB programável, microfone sem fio, playlist personalizada e equipamento backup.\n\nConsulta prévia incluída para definir o estilo musical ideal.',
      categoria: EnumCategoria.FORMATURA,
      buffetId: 1,
      imageUrl: '',
      dataCriacao: new Date('2024-01-01'),
      dataAtualizacao: new Date('2024-01-01')
    },
    {
      id: 4,
      nome: 'Buffet Completo',
      descricao: 'Estrutura completa de buffet com mesas aquecidas, vitrine refrigerada e toda a louça necessária. Montagem e desmontagem incluídas, com equipe especializada para garantir a apresentação impecável dos alimentos.\n\nInclui: 3 mesas aquecidas profissionais, 2 vitrines refrigeradas, baixelas de inox, pegadores, travessas decorativas, suportes para doces, aparadores e guardanapos.\n\nCapacidade para servir até 300 pessoas com conforto.',
      categoria: EnumCategoria.CONFRATERNIZACAO,
      buffetId: 1,
      imageUrl: '',
      dataCriacao: new Date('2024-01-01'),
      dataAtualizacao: new Date('2024-01-01')
    },
    {
      id: 5,
      nome: 'Fotógrafo Profissional',
      descricao: 'Cobertura fotográfica completa do evento com fotógrafo profissional experiente. Registro de todos os momentos importantes com equipamento de última geração e edição profissional das fotos.\n\nInclui: Fotógrafo por 6 horas, segundo fotógrafo assistente, 300+ fotos editadas em alta resolução, álbum digital online, fotos em formato RAW disponíveis e entrega em até 15 dias.\n\nEstilos disponíveis: clássico, moderno, fotojornalístico ou artístico.',
      categoria: EnumCategoria.BATIZADO,
      buffetId: 1,
      imageUrl: '',
      dataCriacao: new Date('2024-01-01'),
      dataAtualizacao: new Date('2024-01-01')
    },
    {
      id: 6,
      nome: 'Bolo Personalizado 3kg',
      descricao: 'Bolo artístico personalizado de 3kg com decoração temática sob medida. Massa e recheio à escolha, com acabamento em pasta americana e detalhes em açúcar ou chocolate. Perfeito para celebrações intimistas.\n\nInclui: Bolo de 3kg (serve até 30 pessoas), consulta para definição do design, escolha de massas e recheios premium, topper personalizado e entrega no local do evento.\n\nOpções de massa: chocolate, baunilha, red velvet, cenoura ou limão. Recheios: brigadeiro, doce de leite, mousse ou ganache.',
      categoria: EnumCategoria.BODAS,
      buffetId: 1,
      imageUrl: '',
      dataCriacao: new Date('2024-01-01'),
      dataAtualizacao: new Date('2024-01-01')
    },
    {
      id: 7,
      nome: 'Animação Infantil',
      descricao: 'Equipe de animadores profissionais com brincadeiras, jogos e atividades recreativas para crianças de todas as idades. Diversão garantida com segurança e muita alegria.\n\nInclui: 2 animadores caracterizados, 3 horas de animação, brincadeiras tradicionais e modernas, pintura facial, balões de modelagem, música e coreografias.\n\nTemas disponíveis: super-heróis, princesas, circo, fazendinha e muito mais.',
      categoria: EnumCategoria.CHA_REVELACAO,
      buffetId: 1,
      imageUrl: '',
      dataCriacao: new Date('2024-01-01'),
      dataAtualizacao: new Date('2024-01-01')
    },
    {
      id: 8,
      nome: 'Barman e Open Bar',
      descricao: 'Serviço premium de barman profissional com open bar completo. Drinks clássicos e autorais preparados na hora, com apresentação impecável e ingredientes selecionados.\n\nInclui: Barman certificado, balcão bar completo, 15 tipos de bebidas (destilados, vinhos, cervejas), refrigerantes, sucos naturais, gelo decorativo, frutas frescas e utensílios profissionais.\n\nCardápio de drinks personalizável com criações exclusivas para o evento.',
      categoria: EnumCategoria.NOIVADO,
      buffetId: 1,
      imageUrl: '',
      dataCriacao: new Date('2024-01-01'),
      dataAtualizacao: new Date('2024-01-01')
    },
    {
      id: 9,
      nome: 'Coffee Break Executivo',
      descricao: 'Serviço completo de coffee break para eventos corporativos com seleção premium de bebidas quentes e frias, salgados e doces. Apresentação sofisticada e serviço discreto.\n\nInclui: Café gourmet, chás variados, sucos naturais, água aromatizada, mini croissants, mini pães de queijo, mini sanduíches, cookies e brownies. Montagem de mesa com toalha, louças e guardanapos.\n\nServe 50 pessoas com reposição durante 3 horas.',
      categoria: EnumCategoria.CAFE_DA_MANHA,
      buffetId: 1,
      imageUrl: '',
      dataCriacao: new Date('2024-01-01'),
      dataAtualizacao: new Date('2024-01-01')
    },
    {
      id: 10,
      nome: 'Tábua de Frios Premium',
      descricao: 'Seleção especial de queijos importados e nacionais, embutidos nobres, frutas frescas, castanhas, geleias artesanais e pães especiais. Montagem artística em tábua de madeira rústica.\n\nInclui: 8 tipos de queijos (brie, camembert, gorgonzola, parmesão, gouda defumado), 5 tipos de embutidos (presunto parma, salame italiano, copa), frutas da estação, mix de castanhas, mel, geleias e torradinhas.\n\nTábua de 80cm serve até 20 pessoas como entrada.',
      categoria: EnumCategoria.HAPPY_HOUR,
      buffetId: 1,
      imageUrl: '',
      dataCriacao: new Date('2024-01-01'),
      dataAtualizacao: new Date('2024-01-01')
    },
    {
      id: 11,
      nome: 'Ceia Completa',
      descricao: 'Serviço de ceia completa com pratos quentes e frios, entrada, prato principal, acompanhamentos e sobremesa. Equipe de cozinheiros prepara no local para máxima qualidade e sabor.\n\nInclui: Entrada (saladas variadas), prato principal (2 opções de carne), 4 acompanhamentos quentes, arroz branco e integral, farofa, vinagrete, sobremesa, cozinheiros e auxiliares.\n\nServe 100 pessoas com todo o equipamento necessário.',
      categoria: EnumCategoria.JANTAR,
      buffetId: 1,
      imageUrl: '',
      dataCriacao: new Date('2024-01-01'),
      dataAtualizacao: new Date('2024-01-01')
    },
    {
      id: 12,
      nome: 'Churrasco Completo',
      descricao: 'Serviço de churrasco com churrasqueiros profissionais, carnes nobres e todos os acompanhamentos. Montagem de churrasqueira, preparo e serviço durante todo o evento.\n\nInclui: Churrasqueiros experientes, 5 tipos de carne (picanha, costela, linguiça, frango, lombo), carvão premium, equipamento completo, farofa, vinagrete, pão de alho e saladas.\n\n400g de carne por pessoa, serve até 80 pessoas.',
      categoria: EnumCategoria.ALMOCO,
      buffetId: 1,
      imageUrl: '',
      dataCriacao: new Date('2024-01-01'),
      dataAtualizacao: new Date('2024-01-01')
    },
    {
      id: 13,
      nome: 'Decoração Natalina',
      descricao: 'Decoração temática completa de Natal com árvore decorada, guirlandas, pisca-piscas, arranjos festivos e ambientação natalina. Transformamos o espaço no espírito natalino.\n\nInclui: Árvore de Natal 2,5m decorada, guirlandas nas portas, pisca-pisca profissional, arranjos de mesa temáticos, Papai Noel decorativo, renas e bonecos de neve.\n\nMontagem e desmontagem incluídas, decoração para espaços de até 200m².',
      categoria: EnumCategoria.NATAL,
      buffetId: 1,
      imageUrl: '',
      dataCriacao: new Date('2024-01-01'),
      dataAtualizacao: new Date('2024-01-01')
    }
  ];

  constructor() { }

  /**
   * Lista todos os serviços
   */
  getAllServices(): Observable<ServicoListDTO[]> {
    const services: ServicoListDTO[] = this.mockServices
      .map(s => ({
        id: s.id,
        nome: s.nome,
        descricao: s.descricao,
        categoria: s.categoria,
        imageUrl: s.imageUrl
      }));

    return of(services).pipe(delay(300));
  }

  /**
   * Busca um serviço por ID
   */
  getServiceById(id: number): Observable<ServicoDetailDTO | null> {
    const service = this.mockServices.find(s => s.id === id);

    if (!service) {
      return of(null).pipe(delay(300));
    }

    const detail: ServicoDetailDTO = {
      id: service.id,
      nome: service.nome,
      descricao: service.descricao,
      categoria: service.categoria,
      buffetId: service.buffetId,
      imageUrl: service.imageUrl,
      dataCriacao: service.dataCriacao || new Date(),
      dataAtualizacao: service.dataAtualizacao || new Date()
    };

    return of(detail).pipe(delay(300));
  }

  /**
   * Busca serviços por categoria
   */
  getServicesByCategory(categoria: EnumCategoria): Observable<ServicoListDTO[]> {
    const services: ServicoListDTO[] = this.mockServices
      .filter(s => s.categoria === categoria)
      .map(s => ({
        id: s.id,
        nome: s.nome,
        descricao: s.descricao,
        categoria: s.categoria,
        imageUrl: s.imageUrl
      }));

    return of(services).pipe(delay(300));
  }

  /**
   * Busca serviços por termo de pesquisa
   */
  searchServices(searchTerm: string): Observable<ServicoListDTO[]> {
    const term = searchTerm.toLowerCase();
    const services: ServicoListDTO[] = this.mockServices
      .filter(s =>
        (s.nome.toLowerCase().includes(term) ||
         s.descricao.toLowerCase().includes(term))
      )
      .map(s => ({
        id: s.id,
        nome: s.nome,
        descricao: s.descricao,
        categoria: s.categoria,
        imageUrl: s.imageUrl
      }));

    return of(services).pipe(delay(300));
  }
}

