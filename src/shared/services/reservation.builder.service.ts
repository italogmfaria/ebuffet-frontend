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

    // Observações: combine nome + descrição (o back não tem nome/descrição)
    const observacoesParts: string[] = [];
    if ((details as any).nome) observacoesParts.push(`Nome: ${(details as any).nome}`);
    if ((details as any).descricao) observacoesParts.push(`Descrição: ${(details as any).descricao}`);
    const observacoes = observacoesParts.length ? observacoesParts.join(' | ') : undefined;

    // Apenas IDs (sem quantidades) conforme o contrato atual
    const comidaIds = (foodIds ?? []).map(f => f.id);
    const servicoIds = serviceIds ?? [];

    return {
      buffetId,
      qtdPessoas: details.qtdPessoas,
      dataDesejada: details.dataDesejada,      // "YYYY-MM-DD"
      horarioDesejado: details.horarioDesejado, // "HH:mm"
      endereco: address,
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
