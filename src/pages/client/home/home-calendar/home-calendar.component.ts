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
  secondaryColor: string = '';
  accentColor: string = '';
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
    const theme = this.themeService.getCurrentTheme();
    if (theme) {
      this.secondaryColor = theme.secondaryColor;
      this.accentColor = theme.accentColor;
    }
  }

  // Função para customizar a aparência de cada dia
  highlightedDates = (isoString: string) => {
    const date = new Date(isoString);
    const dateOnly = date.toISOString().split('T')[0];

    if (this.unavailableDates.includes(dateOnly)) {
      return {
        textColor: '#ffffff',
        backgroundColor: this.secondaryColor,
      };
    }

    return undefined;
  };
}
