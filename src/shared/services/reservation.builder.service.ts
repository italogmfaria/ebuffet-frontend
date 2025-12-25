import {Injectable} from '@angular/core';
import {ThemeService} from "./theme.service";
import {OrderService} from "./order.service";
import {
  EnderecoRequest,
  ReservaRequest, ReservationDetails, ReservationDraft,
} from "../../features/reservation/model/reservation.models";


@Injectable({
  providedIn: 'root'
})
export class ReservationBuilderService {
  private draft: ReservationDraft | null = null;

  constructor(
    private theme: ThemeService,
    private order: OrderService
  ) {
    const buffetId = this.theme.getBuffetIdSync?.() ?? null;
    if (buffetId) this.draft = { buffetId, foodIds: [], serviceIds: [] };
    const saved = localStorage.getItem('reservationDraft');
    if (saved) this.draft = JSON.parse(saved);
  }

  ensureDraft(buffetId: number) {
    if (!this.draft) this.draft = { buffetId, foodIds: [], serviceIds: [] };
    if (!this.draft.buffetId) this.draft.buffetId = buffetId;
    this.persist();
  }

  setDetails(details: ReservationDetails) {
    this.ensureBuffetIdIfMissing();
    if (!this.draft) return;
    this.draft.details = details;
    this.persist();
  }

  setAddress(address: EnderecoRequest) {
    this.ensureBuffetIdIfMissing();
    if (!this.draft) return;
    this.draft.address = address;
    this.persist();
  }

  captureCartSnapshot() {
    this.ensureBuffetIdIfMissing();
    if (!this.draft) return;

    const items = this.order.getOrderItems();
    const foods = items.filter(i => i.type === 'food' || !i.type);
    const services = items.filter(i => i.type === 'service');

    // Cardápio aceita apenas IDs
    const comidaIds = Array.from(new Set(
      foods.filter(f => !!f.id).map(f => Number(f.id))
    ));
    const servicoIds = Array.from(new Set(
      services.filter(s => !!s.id).map(s => Number(s.id))
    ));

    this.draft.foodIds = comidaIds.map(id => ({ id, quantity: 1 })); // mantemos quantity para futura evolução
    this.draft.serviceIds = servicoIds;

    this.persist();
  }

  getDraft(): ReservationDraft | null {
    return this.draft;
  }

  clear() {
    this.draft = null;
    localStorage.removeItem('reservationDraft');
  }

  /** Monta exatamente o ReservaRequest do backend */
  buildReservaRequest(): ReservaRequest {
    if (!this.draft) throw new Error('Draft da reserva não encontrado');
    const { buffetId, details, address, foodIds, serviceIds } = this.draft;
    if (!buffetId) throw new Error('buffetId é obrigatório');
    if (!details) throw new Error('Detalhes da reserva não informados');
    if (!address) throw new Error('Endereço da reserva não informado');

    const observacoesParts: string[] = [];
    if ((details as any).nome) observacoesParts.push(`Nome: ${(details as any).nome}`);
    if ((details as any).descricao) observacoesParts.push(`Descrição: ${(details as any).descricao}`);
    const observacoes = observacoesParts.length ? observacoesParts.join(' | ') : undefined;

    const comidaIds = (foodIds ?? []).map(f => f.id);
    const servicoIds = serviceIds ?? [];

    return {
      buffetId,
      qtdPessoas: details.qtdPessoas,
      dataDesejada: toIsoDate(details.dataDesejada),       // <-- ISO yyyy-MM-dd
      horarioDesejado: toIsoTime(details.horarioDesejado), // <-- HH:mm
      endereco: {
        ...address,
        cep: String(address.cep).replace(/\D/g, '')        // garante só números
      },
      comidaIds: comidaIds.length ? comidaIds : undefined,
      servicoIds: servicoIds.length ? servicoIds : undefined,
      observacoes
    };
  }

  private ensureBuffetIdIfMissing() {
    const bId = this.theme.getBuffetIdSync?.() ?? null;
    if (bId) this.ensureDraft(bId);
  }

  private persist() {
    localStorage.setItem('reservationDraft', JSON.stringify(this.draft));
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
