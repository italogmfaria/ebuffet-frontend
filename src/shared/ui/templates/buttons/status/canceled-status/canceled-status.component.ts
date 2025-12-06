import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-canceled-status',
  templateUrl: './canceled-status.component.html',
  styleUrls: ['./canceled-status.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class CanceledStatusComponent {
  @Input() type: 'reserva' | 'evento' = 'reserva';

  constructor() {}

  get text(): string {
    return this.type === 'evento' ? 'CANCELADO' : 'CANCELADA';
  }
}

