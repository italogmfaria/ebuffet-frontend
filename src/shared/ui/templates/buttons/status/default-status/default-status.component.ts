import { Component, OnInit, Output, EventEmitter, Input, OnChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonChip } from '@ionic/angular/standalone';
import {
  PendingStatusComponent,
  ApprovedStatusComponent,
  CanceledStatusComponent,
  CompletedStatusComponent
} from '../../../exports';
import {ThemeService} from "../../../../../../core/services/theme.service";

interface StatusItem {
  id: string;
  name: string;
  selected: boolean;
}

@Component({
  selector: 'app-default-status',
  templateUrl: './default-status.component.html',
  styleUrls: ['./default-status.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonChip,
    PendingStatusComponent,
    ApprovedStatusComponent,
    CanceledStatusComponent,
    CompletedStatusComponent
  ]
})
export class DefaultStatusComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() selectedStatusId: string = 'todos';
  @Input() type: 'reserva' | 'evento' = 'reserva';
  @Output() statusSelected = new EventEmitter<string>();
  @ViewChild('statusContainer') statusContainer!: ElementRef<HTMLDivElement>;

  primaryColor$ = this.themeService.primaryColor$;
  secondaryColor$ = this.themeService.secondaryColor$;
  accentColor$ = this.themeService.accentColor$;

  statusItems: StatusItem[] = [];

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.buildStatusItems();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.scrollToSelectedStatus();
    }, 100);
  }

  ngOnChanges() {
    if (this.statusItems.length > 0) {
      this.buildStatusItems();
      this.updateSelectedStatus();
      setTimeout(() => {
        this.scrollToSelectedStatus();
      }, 100);
    }
  }

  private buildStatusItems() {
    // Adiciona "TODOS" primeiro
    this.statusItems = [
      { id: 'todos', name: 'TODOS', selected: this.selectedStatusId === 'todos' }
    ];

    // Status comuns a ambos
    this.statusItems.push({
      id: 'pending',
      name: 'PENDENTE',
      selected: this.selectedStatusId === 'pending'
    });

    if (this.type === 'reserva') {
      // Status específicos de RESERVA
      this.statusItems.push(
        {
          id: 'approved',
          name: 'APROVADA',
          selected: this.selectedStatusId === 'approved'
        },
        {
          id: 'canceled',
          name: 'CANCELADA',
          selected: this.selectedStatusId === 'canceled'
        }
      );
    } else {
      // Status específicos de EVENTO
      this.statusItems.push(
        {
          id: 'approved',
          name: 'AGENDADO',
          selected: this.selectedStatusId === 'approved'
        },
        {
          id: 'completed',
          name: 'CONCLUÍDO',
          selected: this.selectedStatusId === 'completed'
        },
        {
          id: 'canceled',
          name: 'CANCELADO',
          selected: this.selectedStatusId === 'canceled'
        }
      );
    }
  }

  private updateSelectedStatus() {
    this.statusItems = this.statusItems.map(status => ({
      ...status,
      selected: status.id === this.selectedStatusId
    }));
  }

  private scrollToSelectedStatus() {
    if (!this.statusContainer) return;

    const container = this.statusContainer.nativeElement;
    const selectedElement = container.querySelector(`#status-${this.selectedStatusId}`) as HTMLElement;

    if (selectedElement) {
      const containerWidth = container.offsetWidth;
      const elementLeft = selectedElement.offsetLeft;
      const elementWidth = selectedElement.offsetWidth;
      const scrollPosition = elementLeft - (containerWidth / 2) + (elementWidth / 2);

      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }

  onStatusClick(statusId: string, event: Event) {
    const target = event.currentTarget as HTMLElement;

    // Adiciona a animação de pulso
    target.style.animation = 'pulse 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

    // Remove a animação após completar
    setTimeout(() => {
      target.style.animation = '';
    }, 300);

    this.selectedStatusId = statusId;
    this.updateSelectedStatus();
    this.statusSelected.emit(statusId);
  }
}

