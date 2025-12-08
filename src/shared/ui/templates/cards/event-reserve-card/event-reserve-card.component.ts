import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  OpenCircleComponent,
  PendingStatusComponent,
  ApprovedStatusComponent,
  CanceledStatusComponent,
  CompletedStatusComponent
} from '../../exports';
import { ThemeService } from '../../../../services/theme.service';

@Component({
  selector: 'app-event-reserve-card',
  templateUrl: './event-reserve-card.component.html',
  styleUrls: ['./event-reserve-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    OpenCircleComponent,
    PendingStatusComponent,
    ApprovedStatusComponent,
    CanceledStatusComponent,
    CompletedStatusComponent
  ]
})
export class EventReserveCardComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() status: 'pending' | 'approved' | 'canceled' | 'completed' = 'pending';
  @Input() type: 'reserva' | 'evento' = 'reserva';

  @Output() cardClick = new EventEmitter<void>();
  @Output() openClick = new EventEmitter<void>();

  secondaryColor$ = this.themeService.secondaryColor$;

  constructor(private themeService: ThemeService) {}

  onCardClick() {
    this.cardClick.emit();
  }

  onOpenClick(event: Event) {
    event.stopPropagation();
    this.openClick.emit();
  }
}

