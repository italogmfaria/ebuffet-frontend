import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonDatetime } from '@ionic/angular/standalone';
import { DetailBagdeComponent } from '../../../../shared/ui/templates/badges/detail-bagde/detail-bagde.component';
import { ThemeService } from '../../../../shared/services/theme.service';

@Component({
  selector: 'app-home-calendar',
  templateUrl: './home-calendar.component.html',
  styleUrls: ['./home-calendar.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonDatetime, DetailBagdeComponent],
})
export class HomeCalendarComponent implements OnInit {
  selectedDate: string = '';
  secondaryColor$ = this.themeService.secondaryColor$;
  accentColor$ = this.themeService.accentColor$;
  minDate: string = '2020-01-01';
  maxDate: string = '2030-12-31';

  unavailableDates: string[] = [
    '2025-10-11',
    '2025-10-15',
    '2025-10-19',
    '2025-10-31',
  ];

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    // No need to load theme colors manually anymore
  }

  // Função para customizar a aparência de cada dia
  highlightedDates = (isoString: string) => {
    const date = new Date(isoString);
    const dateOnly = date.toISOString().split('T')[0];

    if (this.unavailableDates.includes(dateOnly)) {
      // Note: This will need to be updated to work with observables in the template
      // or subscribe to get the current value
      let color = '#3880ff'; // fallback
      this.secondaryColor$.subscribe((c) => (color = c)).unsubscribe();

      return {
        textColor: '#ffffff',
        backgroundColor: color,
      };
    }

    return undefined;
  };
}
