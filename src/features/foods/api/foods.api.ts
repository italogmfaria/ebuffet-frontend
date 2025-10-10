import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Comida, ComidaListDTO, ComidaDetailDTO } from '../model/foods.model';
import { EnumCategoria } from '../../shared/enums/categoria.enum';

@Injectable({
  providedIn: 'root'
})
export class FoodsApiService {

  // Dados mockados baseados nos componentes foods e food-details
  private mockFoods: Comida[] = [
    {
      id: 1,
      nome: 'Picanha na Brasa',
      descricao: 'Corte nobre de picanha bovina selecionada (aproximadamente 1,2 kg) preparada na brasa com sal grosso marinho e leve toque de alho. A carne é assada lentamente em fogo médio, garantindo uma crosta dourada por fora e suculência por dentro.\n\nAcompanhada de farofa de manteiga, vinagrete tradicional e arroz branco soltinho. Ideal para servir de 4 a 5 pessoas.\n\nIngredientes: picanha bovina premium, sal grosso, alho fresco, azeite de oliva extra virgem, arroz tipo 1, farinha de mandioca torrada, cebola roxa, tomate italiano, pimentão verde e salsinha fresca.',
      categoria: EnumCategoria.CASAMENTO,
      buffetId: 1,
      imageUrl: '',
      dataCriacao: new Date('2024-01-01'),
      dataAtualizacao: new Date('2024-01-01')
    },
    {
      id: 2,
      nome: 'Salmão Grelhado',
      descricao: 'Filé de salmão fresco norueguês (200g por porção) temperado com sal rosa do Himalaia, pimenta-do-reino moída na hora e azeite extra virgem português. Grelhado em temperatura controlada até atingir ponto perfeito, com casquinha dourada e interior rosado e macio.\n\nServido com purê de batatas rústico amanteigado (300g) e legumes frescos no vapor: brócolis ninja, cenoura baby e vagens francesas. Finalizado com fatias de limão siciliano e ervas aromáticas.\n\nIngredientes: salmão fresco, azeite, limão siciliano, batatas asterix, manteiga sem sal, leite integral, brócolis, cenoura, vagem, alho-poró e mix de ervas finas (tomilho, alecrim e manjericão).',
      categoria: EnumCategoria.ANIVERSARIO,
      buffetId: 1,
      imageUrl: '',
      dataCriacao: new Date('2024-01-01'),
      dataAtualizacao: new Date('2024-01-01')
    },
    {
      id: 3,
      nome: 'Camarão à Milanesa',
      descricao: 'Camarões gigantes argentinos (500g - aproximadamente 12 unidades) limpos e descascados, temperados com alho triturado, sal marinho e suco de limão tahiti. Empanados em três camadas: farinha de trigo, ovos batidos e farinha de rosca panko, fritos em óleo quente até ficarem dourados e crocantes.\n\nServidos com molho tártaro artesanal feito com maionese caseira, pepinos em conserva picados, alcaparras, mostarda dijon e ervas frescas. Acompanha arroz branco soltinho e batata palha crocante.\n\nIngredientes: camarões argentinos, farinha de trigo especial, ovos caipiras, panko, óleo de girassol, limão tahiti, alho, maionese, pepino agridoce, alcaparras, mostarda dijon, cebolinha e salsinha.',
      categoria: EnumCategoria.FORMATURA,
      buffetId: 1,
      imageUrl: '',
      dataCriacao: new Date('2024-01-01'),
      dataAtualizacao: new Date('2024-01-01')
    },
    {
      id: 4,
      nome: 'Lasanha Bolonhesa',
      descricao: 'Lasanha artesanal tradicional italiana feita com massa fresca de sêmola (500g) em camadas intercaladas. Recheio preparado com carne bovina moída de primeira (600g) refogada em molho de tomate caseiro, cebola, alho, cenoura ralada e manjericão fresco.\n\nCamadas generosas de queijo muçarela fatiado, presunto defumado e molho bechamel cremoso. Gratinada no forno a 180°C por 40 minutos até o queijo derreter e dourar. Polvilhada com queijo parmesão ralado e orégano.\n\nServe confortavelmente 6 pessoas. Ingredientes: massa de lasanha fresca, carne bovina moída, molho de tomate pelado, cebola, alho, cenoura, queijo muçarela, presunto, leite integral, farinha de trigo, manteiga, noz-moscada, orégano, azeite e manjericão fresco.',
      categoria: EnumCategoria.CONFRATERNIZACAO,
      buffetId: 1,
      imageUrl: '',
      dataCriacao: new Date('2024-01-01'),
      dataAtualizacao: new Date('2024-01-01')
    },
    {
      id: 5,
      nome: 'Frango à Parmegiana',
      descricao: 'Filé de peito de frango (150g por porção) levemente batido para maciez, empanado em farinha de rosca temperada e frito até dourar. Coberto generosamente com molho de tomate artesanal aromático e fatias grossas de queijo muçarela, levado ao forno para gratinar.\n\nFinalizado com queijo parmesão ralado fresco e orégano. Acompanha arroz branco soltinho (100g por pessoa) e batatas fritas crocantes cortadas em palito.\n\nServe de 4 a 5 pessoas no total. Ingredientes: peito de frango, farinha de rosca, farinha de trigo, ovos, molho de tomate, queijo muçarela, queijo parmesão ralado, azeite extra virgem, batatas, óleo para fritura, orégano e temperos naturais (alho, sal e pimenta).',
      categoria: EnumCategoria.BATIZADO,
      buffetId: 1,
      imageUrl: '',
      dataCriacao: new Date('2024-01-01'),
      dataAtualizacao: new Date('2024-01-01')
    },
    {
      id: 6,
      nome: 'Salada Caesar',
      descricao: 'Clássica salada americana com alface romana fresca e crocante (300g), tiras suculentas de peito de frango grelhado e temperado (150g), lascas generosas de queijo parmesão reggiano e croutons artesanais de pão italiano dourados no forno com azeite e alho.\n\nO molho Caesar é preparado na hora com maionese cremosa, pasta de anchovas, alho socado, mostarda dijon, suco de limão siciliano, azeite extra virgem e queijo parmesão ralado. Equilibrado e saboroso.\n\nServe de 2 a 3 pessoas. Ingredientes: alface romana, peito de frango, queijo parmesão reggiano, pão italiano, azeite extra virgem, alho, anchovas em conserva, maionese, mostarda dijon, limão siciliano e pimenta-do-reino moída na hora.',
      categoria: EnumCategoria.BODAS,
      buffetId: 1,
      imageUrl: '',
      dataCriacao: new Date('2024-01-01'),
      dataAtualizacao: new Date('2024-01-01')
    },
    {
      id: 7,
      nome: 'Torta de Limão',
      descricao: 'Torta refrescante e elegante com base crocante feita de biscoito maisena triturado (200g) e manteiga derretida, prensada em forma de aro removível. Recheio cremoso e aveludado preparado com leite condensado, creme de leite fresco e suco natural de limão tahiti espremido na hora.\n\nCoberta com merengue italiano aerado feito com claras em neve e açúcar, dourado delicadamente com maçarico. Sabor equilibrado entre o doce e o cítrico, com textura cremosa e refrescante.\n\nServe de 8 a 10 fatias generosas. Ingredientes: biscoito maisena, manteiga sem sal, leite condensado, creme de leite fresco, suco e raspas de limão tahiti, claras de ovos e açúcar refinado.',
      categoria: EnumCategoria.CHA_REVELACAO,
      buffetId: 1,
      imageUrl: '',
      dataCriacao: new Date('2024-01-01'),
      dataAtualizacao: new Date('2024-01-01')
    },
    {
      id: 8,
      nome: 'Bolo de Chocolate',
      descricao: 'Bolo de chocolate belga úmido e extremamente fofinho feito com cacau em pó 50% (100g), açúcar mascavo orgânico e manteiga de primeira. Massa aerada e aromática assada em ponto perfeito.\n\nRecheado e coberto com ganache cremosa de chocolate meio amargo (60% cacau) preparada com creme de leite fresco. Decorado artisticamente com raspas de chocolate ao leite e frutas vermelhas frescas (morangos e framboesas). Ideal para aniversários, celebrações e ocasiões especiais.\n\nServe de 10 a 12 pessoas generosamente. Ingredientes: farinha de trigo especial, ovos caipiras, açúcar mascavo, cacau em pó 50%, manteiga sem sal, leite integral, fermento químico, creme de leite fresco, chocolate meio amargo e frutas vermelhas para decoração.',
      categoria: EnumCategoria.NOIVADO,
      buffetId: 1,
      imageUrl: '',
      dataCriacao: new Date('2024-01-01'),
      dataAtualizacao: new Date('2024-01-01')
    },
    {
      id: 9,
      nome: 'Croissant Francês',
      descricao: 'Autêntico croissant artesanal de massa folhada laminada com 27 dobras de manteiga francesa, preparado com técnica tradicional parisiense. Fermentação natural lenta de 24 horas para desenvolvimento completo de sabor e textura.\n\nAssado em forno a lenha até atingir coloração dourada perfeita, com exterior crocante que estala ao morder e interior macio, aerado e amanteigado. Pode ser servido puro para apreciar a massa, com geleia artesanal de frutas vermelhas ou recheado com presunto parma e queijo brie.\n\nServe 6 unidades (aproximadamente 70g cada). Ingredientes: farinha de trigo francesa tipo 55, manteiga francesa de Normandia (40% de gordura), fermento biológico fresco, leite integral, açúcar refinado, sal marinho de Guérande e ovo para pincelar.',
      categoria: EnumCategoria.CAFE_DA_MANHA,
      buffetId: 1,
      imageUrl: '',
      dataCriacao: new Date('2024-01-01'),
      dataAtualizacao: new Date('2024-01-01')
    },
    {
      id: 10,
      nome: 'Tábua de Frios Premium',
      descricao: 'Seleção exclusiva de frios e queijos artesanais em tábua rústica de madeira. Inclui presunto cru curado Parma, salame italiano tipo Milano, copa defumada, queijos gouda holandês, brie cremoso francês e provolone picante italiano.\n\nAcompanhamentos gourmet: frutas secas selecionadas (damasco, tâmaras), castanhas torradas (caju, nozes, amêndoas), azeitonas verdes e pretas, geleias artesanais (pimenta, figo) e pães artesanais variados (ciabatta, baguete, italiano). Ideal para recepções elegantes ou happy hours sofisticados.\n\nServe de 6 a 8 pessoas confortavelmente. Ingredientes: queijos variados importados e nacionais, embutidos finos premium, frutas secas selecionadas, castanhas torradas sem sal, nozes pecan, uvas frescas sem sementes, azeitonas verdes e pretas, geleias artesanais e pães especiais.',
      categoria: EnumCategoria.HAPPY_HOUR,
      buffetId: 1,
      imageUrl: '',
      dataCriacao: new Date('2024-01-01'),
      dataAtualizacao: new Date('2024-01-01')
    },
    {
      id: 11,
      nome: 'Risoto de Funghi',
      descricao: 'Risoto italiano cremoso e aromático preparado com arroz arbóreo importado (300g), funghi secchi porcini hidratado em água morna, vinho branco seco italiano e caldo de legumes frescos preparado na hora. Processo tradicional de tostagem do arroz e adição gradual do caldo quente.\n\nFinalizado com manteiga italiana sem sal e queijo parmesão reggiano ralado fresco, criando textura cremosa e aveludada (all\'onda). Aroma intenso e sabor marcante de cogumelos selvagens.\n\nServe 4 pessoas generosamente. Ingredientes: arroz arbóreo italiano, funghi secchi porcini, cebola branca, alho, vinho branco seco, caldo de legumes caseiro (cenoura, salsão, cebola), manteiga italiana sem sal, azeite extra virgem, queijo parmesão reggiano, salsinha italiana e pimenta-do-reino preta.',
      categoria: EnumCategoria.JANTAR,
      buffetId: 1,
      imageUrl: '',
      dataCriacao: new Date('2024-01-01'),
      dataAtualizacao: new Date('2024-01-01')
    },
    {
      id: 12,
      nome: 'Filé com Fritas',
      descricao: 'Filé mignon premium (180g por porção) grelhado em alta temperatura para selar e manter os sucos internos. Temperado apenas com sal grosso marinho e pimenta-do-reino moída na hora para realçar o sabor natural da carne nobre.\n\nAcompanhado de batatas fritas artesanais cortadas em palito grosso, fritas duas vezes para garantir exterior crocante e interior macio, e arroz branco soltinho tipo agulhinha. Opcionalmente servido com molho madeira aromático à base de vinho tinto seco, fundo de carne e champignon paris fatiado.\n\nServe de 3 a 4 pessoas. Ingredientes: filé mignon, batatas inglesas, óleo vegetal para fritura, arroz tipo 1, alho, sal grosso, pimenta-do-reino em grãos, vinho tinto seco, champignon e manteiga (opcional para o molho).',
      categoria: EnumCategoria.ALMOCO,
      buffetId: 1,
      imageUrl: '',
      dataCriacao: new Date('2024-01-01'),
      dataAtualizacao: new Date('2024-01-01')
    },
    {
      id: 13,
      nome: 'Peru Natalino',
      descricao: 'Peru inteiro selecionado de aproximadamente 4,5kg marinado por 12 horas em vinho branco seco, ervas finas aromáticas (alecrim, sálvia, tomilho), alho socado e manteiga derretida. Processo lento de marinada para penetração completa dos sabores.\n\nAssado lentamente em baixa temperatura por 3 horas, regado periodicamente com o próprio suco, até a pele ficar dourada, crocante e brilhante. Recheado com farofa natalina de frutas secas cristalizadas (damasco, ameixa) e castanhas torradas (caju, nozes). Servido com molho agridoce de laranja feito com suco natural, açúcar caramelizado e raspas de casca.\n\nRendimento generoso: 10 a 12 pessoas. Ingredientes: peru inteiro fresco, vinho branco seco, alho, cebola roxa, alecrim fresco, sálvia, tomilho, manteiga sem sal, farinha de mandioca torrada, castanhas variadas, frutas secas cristalizadas, uvas passas sem sementes, suco e raspas de laranja pera.',
      categoria: EnumCategoria.NATAL,
      buffetId: 1,
      imageUrl: '',
      dataCriacao: new Date('2024-01-01'),
      dataAtualizacao: new Date('2024-01-01')
    }
  ];

  constructor() { }

  /**
   * Lista todas as comidas ativas
   */
  getAllFoods(): Observable<ComidaListDTO[]> {
    const foods: ComidaListDTO[] = this.mockFoods
      .map(f => ({
        id: f.id,
        nome: f.nome,
        descricao: f.descricao,
        categoria: f.categoria,
        imageUrl: f.imageUrl
      }));

    return of(foods).pipe(delay(300)); // Simula latência de rede
  }

  /**
   * Busca uma comida por ID
   */
  getFoodById(id: number): Observable<ComidaDetailDTO | null> {
    const food = this.mockFoods.find(f => f.id === id);

    if (!food) {
      return of(null).pipe(delay(300));
    }

    const detail: ComidaDetailDTO = {
      id: food.id,
      nome: food.nome,
      descricao: food.descricao,
      categoria: food.categoria,
      buffetId: food.buffetId,
      imageUrl: food.imageUrl,
      dataCriacao: food.dataCriacao || new Date(),
      dataAtualizacao: food.dataAtualizacao || new Date()
    };

    return of(detail).pipe(delay(300));
  }

  /**
   * Busca comidas por categoria
   */
  getFoodsByCategory(categoria: EnumCategoria): Observable<ComidaListDTO[]> {
    const foods: ComidaListDTO[] = this.mockFoods
      .filter(f => f.categoria === categoria)
      .map(f => ({
        id: f.id,
        nome: f.nome,
        descricao: f.descricao,
        categoria: f.categoria,
        imageUrl: f.imageUrl
      }));

    return of(foods).pipe(delay(300));
  }

  /**
   * Busca comidas por termo de pesquisa
   */
  searchFoods(searchTerm: string): Observable<ComidaListDTO[]> {
    const term = searchTerm.toLowerCase();
    const foods: ComidaListDTO[] = this.mockFoods
      .filter(f =>
        (f.nome.toLowerCase().includes(term) ||
         f.descricao.toLowerCase().includes(term))
      )
      .map(f => ({
        id: f.id,
        nome: f.nome,
        descricao: f.descricao,
        categoria: f.categoria,
        imageUrl: f.imageUrl
      }));

    return of(foods).pipe(delay(300));
  }

  // Métodos para quando integrar com backend real
  // createFood(food: ComidaFormDTO): Observable<Comida> { }
  // updateFood(id: number, food: ComidaFormDTO): Observable<Comida> { }
  // deleteFood(id: number): Observable<void> { }
}
