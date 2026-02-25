import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-approved-status',
  templateUrl: './approved-status.component.html',
  styleUrls: ['./approved-status.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ApprovedStatusComponent {
  @Input() type: 'reserva' | 'evento' = 'reserva';

  constructor() {}

  get text(): string {
    return this.type === 'evento' ? 'AGENDADO' : 'APROVADA';
  }
}

