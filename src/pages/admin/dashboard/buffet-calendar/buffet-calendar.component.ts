import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
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
export class BuffetCalendarComponent implements OnInit, OnChanges {
  @Input() eventDates: string[] = [];

  selectedDate: string = '';
  primaryColor$ = this.themeService.primaryColor$;
  secondaryColor$ = this.themeService.secondaryColor$;
  accentColor$ = this.themeService.accentColor$;
  minDate: string = '2020-01-01';
  maxDate: string = '2030-12-31';

  highlightedDates: (isoString: string) => any;

  constructor(private themeService: ThemeService) {
    // Inicializa a função de highlight
    this.highlightedDates = this.createHighlightFn();
  }

  ngOnInit() {
    // Event dates are now received as Input from parent component
    this.highlightedDates = this.createHighlightFn();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Recria a função de highlight quando eventDates mudar
    if (changes['eventDates']) {
      this.highlightedDates = this.createHighlightFn();
    }
  }

  // Função factory que cria uma nova função de highlight
  private createHighlightFn() {
    return (isoString: string) => {
      // Extrai apenas a parte da data (YYYY-MM-DD) sem conversão de timezone
      const dateOnly = isoString.split('T')[0];

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
}

