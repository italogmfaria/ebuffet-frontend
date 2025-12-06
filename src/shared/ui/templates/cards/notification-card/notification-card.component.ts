import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../services/theme.service';

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class NotificationCardComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() isNew: boolean = false;

  @Output() cardClick = new EventEmitter<void>();

  secondaryColor$ = this.themeService.secondaryColor$;

  constructor(private themeService: ThemeService) {}

  onCardClick() {
    this.cardClick.emit();
  }
}

