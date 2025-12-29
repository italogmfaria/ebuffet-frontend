import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonDatetime } from '@ionic/angular/standalone';
import { ThemeService } from '../../../../core/services/theme.service';
import { DetailBagdeComponent } from '../../../../shared/ui/templates/exports';

@Component({
  selector: 'app-buffet-calendar',
  templateUrl: './buffet-calendar.component.html',
  styleUrls: ['./buffet-calendar.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonDatetime, DetailBagdeComponent],
})
export class BuffetCalendarComponent implements OnInit {
  @Input() eventDays: number[] = [9, 14, 18, 31];

  selectedDate: string = '';
  primaryColor$ = this.themeService.primaryColor$;
  secondaryColor$ = this.themeService.secondaryColor$;
  accentColor$ = this.themeService.accentColor$;
  minDate: string = '2020-01-01';
  maxDate: string = '2030-12-31';

  // Datas com eventos (será gerado dinamicamente)
  eventDates: string[] = [];

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.generateEventDates();
  }

  generateEventDates() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    this.eventDates = this.eventDays.map(day => {
      const date = new Date(year, month, day);
      return date.toISOString().split('T')[0];
    });
  }

  // Função para customizar a aparência de cada dia com evento
  highlightedDates = (isoString: string) => {
    const date = new Date(isoString);
    const dateOnly = date.toISOString().split('T')[0];

    if (this.eventDates.includes(dateOnly)) {
      let color = '#8b5cf6'; // roxo padrão
      this.secondaryColor$.subscribe((c) => (color = c)).unsubscribe();

      return {
        textColor: '#ffffff',
        backgroundColor: color,
      };
    }

    return undefined;
  };
}

