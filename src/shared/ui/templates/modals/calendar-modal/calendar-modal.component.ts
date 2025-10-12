import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonDatetime } from '@ionic/angular/standalone';
import { ThemeService } from '../../../../services/theme.service';
import { CloseCircleComponent, PrimaryButtonComponent } from '../../exports';

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
  @Input() unavailableDates?: string[];

  @Output() close = new EventEmitter<void>();
  @Output() dateSelected = new EventEmitter<string>();

  defaultUnavailableDates: string[] = [
    '2025-10-11',
    '2025-10-15',
    '2025-10-19',
    '2025-10-31',
  ];

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    if (this.initialDate) {
      this.selectedDate = this.initialDate;
    }
  }

  highlightedDates = (isoString: string) => {
    const date = new Date(isoString);
    const dateOnly = date.toISOString().split('T')[0];

    const unavailableList = this.unavailableDates || this.defaultUnavailableDates;

    if (unavailableList.includes(dateOnly)) {
      let color = '#3880ff'; // fallback
      this.secondaryColor$.subscribe((c) => (color = c)).unsubscribe();

      return {
        textColor: '#ffffff',
        backgroundColor: color
      };
    }

    return undefined;
  };

  isDateEnabled = (isoString: string) => {
    const date = new Date(isoString);
    const dateOnly = date.toISOString().split('T')[0];

    const unavailableList = this.unavailableDates || this.defaultUnavailableDates;

    return !unavailableList.includes(dateOnly);
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
