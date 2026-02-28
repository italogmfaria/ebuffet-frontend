import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {OrderService} from "../../orders/services/order.service";
import {EnderecoRequest, ReservaRequest, ReservationDetails} from "../model/reservation.models";

type FlowState = {
  details?: ReservationDetails;
  address?: EnderecoRequest;
};

@Injectable({ providedIn: 'root' })
export class ReservationFlowService {
  private state$ = new BehaviorSubject<FlowState>({});

  constructor(
    private order: OrderService
  ) {}

  setDetails(details: ReservationDetails) {
    this.state$.next({ ...this.state$.value, details });
  }

  setAddress(address: EnderecoRequest) {
    this.state$.next({ ...this.state$.value, address });
  }

  getDetails(): ReservationDetails | undefined {
    return this.state$.value.details;
  }

  getAddress(): EnderecoRequest | undefined {
    return this.state$.value.address;
  }

  clear() {
    this.state$.next({});
  }

  buildReservaRequest(): ReservaRequest {
    const details = this.state$.value.details;
    if (!details) throw new Error('Detalhes da reserva não informados');

    const address = this.state$.value.address;
    if (!address) throw new Error('Endereço da reserva não informado');

    const items = this.order.getOrderItems();
    const foods = items.filter(i => i.type === 'food' || !i.type).filter(i => !!i.id);
    const services = items.filter(i => i.type === 'service').filter(i => !!i.id);

    const comidaIds = Array.from(new Set(foods.map(f => Number(f.id))));
    const servicoIds = Array.from(new Set(services.map(s => Number(s.id))));

    return {
      qtdPessoas: details.qtdPessoas,
      dataDesejada: toIsoDate(details.dataDesejada),
      horarioDesejado: toIsoTime(details.horarioDesejado),
      endereco: {
        ...address,
        cep: String(address.cep).replace(/\D/g, '')
      },
      comidaIds: comidaIds.length ? comidaIds : undefined,
      servicoIds: servicoIds.length ? servicoIds : undefined,
      titulo: details.titulo || undefined,
      descricao: details.descricao || undefined
    };
  }
}

function toIsoDate(dateStr: string): string {
  if (!dateStr) return dateStr;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dateStr);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;

  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
  }
  return dateStr;
}

function toIsoTime(timeStr: string): string {
  if (!timeStr) return timeStr;
  const m1 = /^(\d{2}):(\d{2})$/.exec(timeStr);
  if (m1) return timeStr;
  const m2 = /^(\d{2}):(\d{2}):(\d{2})$/.exec(timeStr);
  if (m2) return `${m2[1]}:${m2[2]}`;
  return timeStr;
}
