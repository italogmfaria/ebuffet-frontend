import {Component, inject, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonDatetime } from '@ionic/angular/standalone';
import { DetailBagdeComponent } from '../../../../shared/ui/templates/badges/detail-bagde/detail-bagde.component';
import { ThemeService } from '../../../../shared/services/theme.service';
import {EventoService} from "../../../../features/evento/api/evento.api";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-home-calendar',
  templateUrl: './home-calendar.component.html',
  styleUrls: ['./home-calendar.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonDatetime, DetailBagdeComponent],
})
export class HomeCalendarComponent implements OnInit {
  private themeService = inject(ThemeService);
  private eventoService = inject(EventoService);

  selectedDate = '';
  secondaryColor$ = this.themeService.secondaryColor$;
  accentColor$ = this.themeService.accentColor$;

  minDate = new Date().toISOString();
  maxDate = new Date(new Date().getFullYear() + 2, 11, 31).toISOString();

  unavailableDates: string[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadUnavailableDates();
  }

  loadUnavailableDates() {
    const dataInicio = this.toYMDLocal(new Date());
    const dataFim = this.toYMDLocal(
      new Date(new Date().getFullYear() + 2, 11, 31)
    );

    this.eventoService.getDatasIndisponiveis(dataInicio, dataFim).subscribe({
      next: (response) => {
        this.unavailableDates = response.datas;
        this.highlightedDates = this.createHighlightFn();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar datas indisponíveis:', error);
        this.isLoading = false;
      },
    });
  }

  private toYMDLocal(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private createHighlightFn() {
    return (isoString: string) => {
      const dateOnly = isoString.split('T')[0];

      if (this.unavailableDates.includes(dateOnly)) {
        let color = '#3880ff';
        this.secondaryColor$.subscribe((c) => (color = c)).unsubscribe();

        return {
          textColor: '#ffffff',
          backgroundColor: color,
        };
      }

      return undefined;
    };
  }

  highlightedDates = (isoString: string) => {
    const dateOnly = isoString.split('T')[0];

    if (this.unavailableDates.includes(dateOnly)) {
      let color = '#3880ff';
      this.secondaryColor$.subscribe(c => color = c).unsubscribe();

      return {
        textColor: '#ffffff',
        backgroundColor: color,
      };
    }
    return undefined;
  };

}
