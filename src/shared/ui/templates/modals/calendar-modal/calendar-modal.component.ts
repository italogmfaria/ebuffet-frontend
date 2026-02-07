import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonDatetime } from '@ionic/angular/standalone';
import { CloseCircleComponent, PrimaryButtonComponent } from '../../exports';
import {ThemeService} from "../../../../../core/services/theme.service";

@Component({
  selector: 'app-calendar-modal',
  templateUrl: './calendar-modal.component.html',
  styleUrls: ['./calendar-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonDatetime,
    CloseCircleComponent,
    PrimaryButtonComponent
  ]
})
export class CalendarModalComponent implements OnInit {
  secondaryColor$ = this.themeService.secondaryColor$;
  accentColor$ = this.themeService.accentColor$;
  selectedDate: string = '';

  @Input() initialDate?: string;
  @Input() minDate?: string;
  @Input() maxDate?: string;
  @Input() unavailableDates?: string[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() dateSelected = new EventEmitter<string>();

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    if (this.initialDate) {
      this.selectedDate = this.initialDate;
    }

    // Define data mínima como hoje se não foi fornecida
    if (!this.minDate) {
      const today = new Date();
      this.minDate = today.toISOString();
    }
  }

  highlightedDates = (isoString: string) => {
    const date = new Date(isoString);
    const dateOnly = date.toISOString().split('T')[0];

    // Verificar se a data está na lista de indisponíveis
    if (this.unavailableDates && this.unavailableDates.includes(dateOnly)) {
      return {
        textColor: '#ffffff',
        backgroundColor: '#ff4444' // Vermelho para datas bloqueadas
      };
    }

    return undefined;
  };

  isDateEnabled = (isoString: string) => {
    const date = new Date(isoString);
    const dateOnly = date.toISOString().split('T')[0];

    // Bloquear datas indisponíveis
    return !(this.unavailableDates && this.unavailableDates.includes(dateOnly));
  };

  onClose() {
    this.close.emit();
  }

  onDateChange(event: any) {
    this.selectedDate = event.detail.value;
  }

  onConfirm() {
    if (this.selectedDate) {
      const date = new Date(this.selectedDate);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;

      this.dateSelected.emit(formattedDate);
    }
  }

  // Método auxiliar para obter a cor secundária para o botão
  getSecondaryColor(): string {
    let color = '#3880ff';
    this.secondaryColor$.subscribe((c) => (color = c)).unsubscribe();
    return color;
  }
}
