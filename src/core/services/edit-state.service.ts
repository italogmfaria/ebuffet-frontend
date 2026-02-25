import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface EditItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  type: 'food' | 'service';
}

export interface EditState {
  foods: EditItem[];
  services: EditItem[];
}

type EditContext = 'reserve-edit' | 'event-edit';

/**
 * Serviço de gerenciamento de estado para edição de reservas e eventos.
 * Mantém o estado dos itens (comidas e serviços) durante a edição,
 * garantindo sincronização entre componentes e prevenindo duplicatas.
 */
@Injectable({
  providedIn: 'root'
})
export class EditStateService {
  private states = new Map<EditContext, BehaviorSubject<EditState>>();

  constructor() {
    // Inicializa os contextos
    this.states.set('reserve-edit', new BehaviorSubject<EditState>({ foods: [], services: [] }));
    this.states.set('event-edit', new BehaviorSubject<EditState>({ foods: [], services: [] }));
  }

  /**
   * Obtém o estado atual como Observable
   */
  getState$(context: EditContext): Observable<EditState> {
    return this.states.get(context)!.asObservable();
  }

  /**
   * Obtém o estado atual (snapshot)
   */
  getState(context: EditContext): EditState {
    return this.states.get(context)!.value;
  }

  /**
   * Define o estado completo (usado ao carregar do backend)
   */
  setState(context: EditContext, state: EditState): void {
    this.states.get(context)!.next(state);
  }

  /**
   * Adiciona um item (comida ou serviço)
   * @returns true se adicionado, false se já existe
   */
  addItem(context: EditContext, item: EditItem): boolean {
    const currentState = this.getState(context);

    if (item.type === 'food') {
      // Verifica duplicata
      const exists = currentState.foods.some(f => f.id === item.id);
      if (exists) {
        return false;
      }

      // Adiciona
      const newState: EditState = {
        ...currentState,
        foods: [...currentState.foods, item]
      };
      this.setState(context, newState);
      return true;
    } else {
      // Verifica duplicata
      const exists = currentState.services.some(s => s.id === item.id);
      if (exists) {
        return false;
      }

      // Adiciona
      const newState: EditState = {
        ...currentState,
        services: [...currentState.services, item]
      };
      this.setState(context, newState);
      return true;
    }
  }

  /**
   * Remove um item (comida ou serviço)
   */
  removeItem(context: EditContext, itemId: number, type: 'food' | 'service'): void {
    const currentState = this.getState(context);

    if (type === 'food') {
      const newState: EditState = {
        ...currentState,
        foods: currentState.foods.filter(f => f.id !== itemId)
      };
      this.setState(context, newState);
    } else {
      const newState: EditState = {
        ...currentState,
        services: currentState.services.filter(s => s.id !== itemId)
      };
      this.setState(context, newState);
    }
  }

  /**
   * Verifica se um item existe no estado
   */
  itemExists(context: EditContext, itemId: number, type: 'food' | 'service'): boolean {
    const state = this.getState(context);

    if (type === 'food') {
      return state.foods.some(f => f.id === itemId);
    } else {
      return state.services.some(s => s.id === itemId);
    }
  }

  /**
   * Limpa o estado (ao sair do componente)
   */
  clearState(context: EditContext): void {
    this.setState(context, { foods: [], services: [] });
  }

  /**
   * Obtém os IDs das comidas (para enviar ao backend)
   */
  getFoodIds(context: EditContext): number[] {
    const state = this.getState(context);
    return state.foods.map(f => f.id);
  }

  /**
   * Obtém os IDs dos serviços (para enviar ao backend)
   */
  getServiceIds(context: EditContext): number[] {
    const state = this.getState(context);
    return state.services.map(s => s.id);
  }
}
