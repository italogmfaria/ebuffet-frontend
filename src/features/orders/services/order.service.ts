import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface OrderItem {
  id?: number;
  title: string;
  description: string;
  imageUrl?: string;
  quantity: number;
  price?: number;
  type?: 'food' | 'service';
}

export type OrderContext = 'order' | 'reserve-edit' | 'event-edit';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  // Contextos separados para cada uso
  private contexts: Map<OrderContext, BehaviorSubject<OrderItem[]>> = new Map([
    ['order', new BehaviorSubject<OrderItem[]>([])],
    ['reserve-edit', new BehaviorSubject<OrderItem[]>([])],
    ['event-edit', new BehaviorSubject<OrderItem[]>([])]
  ]);

  // Observables públicos para cada contexto
  public orderItems$ = this.contexts.get('order')!.asObservable();
  public reserveEditItems$ = this.contexts.get('reserve-edit')!.asObservable();
  public eventEditItems$ = this.contexts.get('event-edit')!.asObservable();

  // Contexto atual ativo (padrão: 'order')
  private currentContext: OrderContext = 'order';

  constructor() {
    // Load from localStorage if available (apenas para 'order')
    const savedItems = localStorage.getItem('orderItems');
    if (savedItems) {
      this.contexts.get('order')!.next(JSON.parse(savedItems));
    }
  }

  /**
   * Define o contexto ativo
   */
  setContext(context: OrderContext): void {
    this.currentContext = context;
  }

  /**
   * Obtém o contexto ativo
   */
  getContext(): OrderContext {
    return this.currentContext;
  }

  /**
   * Obtém os itens do contexto especificado (ou atual se não especificado)
   */
  getOrderItems(context?: OrderContext): OrderItem[] {
    const ctx = context || this.currentContext;
    return this.contexts.get(ctx)!.value;
  }

  /**
   * Verifica se um item existe no contexto OU em uma lista externa
   * @param itemId ID do item a verificar
   * @param context Contexto do OrderService
   * @param externalList Lista externa (ex: menuItems de reserve-edit)
   * @returns true se o item já existe (buffer OU lista externa)
   */
  itemExists(itemId: number, context?: OrderContext, externalList?: Array<{id?: number}>): boolean {
    const ctx = context || this.currentContext;
    const currentItems = this.contexts.get(ctx)!.value;

    // Verifica no buffer do OrderService
    const existsInBuffer = currentItems.some(i => i.id === itemId);

    // Verifica na lista externa (se fornecida)
    const existsInExternalList = externalList ? externalList.some(i => i.id === itemId) : false;

    return existsInBuffer || existsInExternalList;
  }

  /**
   * Adiciona item ao contexto especificado (ou atual se não especificado)
   * @returns true se o item foi adicionado, false se já existia
   */
  addItem(item: Omit<OrderItem, 'quantity'>, context?: OrderContext): boolean {
    const ctx = context || this.currentContext;
    const currentItems = this.contexts.get(ctx)!.value;

    // Verifica se item já existe pelo ID (evita duplicatas)
    const existingItemIndex = currentItems.findIndex(
      (i) => i.id === item.id
    );

    if (existingItemIndex === -1) {
      // Item novo, adiciona com quantity 1
      currentItems.push({ ...item, quantity: 1 });
      this.contexts.get(ctx)!.next([...currentItems]);

      // Salva no localStorage apenas para 'order'
      if (ctx === 'order') {
        this.saveToLocalStorage();
      }

      return true; // Item foi adicionado
    }

    return false; // Item já existia
  }

  /**
   * Remove item do contexto especificado (ou atual se não especificado)
   */
  removeItem(title: string, context?: OrderContext): void {
    const ctx = context || this.currentContext;
    const currentItems = this.contexts.get(ctx)!.value;
    const existingItemIndex = currentItems.findIndex(
      (i) => i.title === title
    );

    if (existingItemIndex > -1) {
      currentItems.splice(existingItemIndex, 1);
      this.contexts.get(ctx)!.next([...currentItems]);

      if (ctx === 'order') {
        this.saveToLocalStorage();
      }
    }
  }

  /**
   * Atualiza quantidade (usado apenas no contexto 'order')
   */
  updateQuantity(title: string, newQuantity: number): void {
    const currentItems = this.contexts.get('order')!.value;
    const existingItemIndex = currentItems.findIndex(
      (i) => i.title === title
    );

    if (existingItemIndex > -1) {
      currentItems[existingItemIndex].quantity = newQuantity;
      this.contexts.get('order')!.next([...currentItems]);
      this.saveToLocalStorage();
    }
  }

  /**
   * Retorna total de itens do contexto 'order'
   */
  getTotalItems(): number {
    return this.contexts.get('order')!.value.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Limpa os itens do contexto especificado (ou atual se não especificado)
   */
  clearOrder(context?: OrderContext): void {
    const ctx = context || this.currentContext;
    this.contexts.get(ctx)!.next([]);

    if (ctx === 'order') {
      localStorage.removeItem('orderItems');
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('orderItems', JSON.stringify(this.contexts.get('order')!.value));
  }
}
