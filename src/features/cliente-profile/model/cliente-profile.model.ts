export type UiStatus = 'pending' | 'approved' | 'canceled' | 'completed';

export interface ReserveItem {
  id: number;
  title: string;
  status: UiStatus;
}

export interface EventItem {
  id: number;
  reservaId: number;
  title: string;
  status: UiStatus;
}

export function mapReservaStatusToUi(status: string): UiStatus {
  switch (status) {
    case 'PENDENTE': return 'pending';
    case 'APROVADA': return 'approved';
    case 'CANCELADA': return 'canceled';
    default: return 'pending';
  }
}

export interface MenuItem {
  id?: number;
  title: string;
  description: string;
  imageUrl: string;
  quantity: number;
}

export interface ServiceItem {
  id?: number;
  title: string;
  description: string;
  imageUrl: string;
  quantity: number;
}
