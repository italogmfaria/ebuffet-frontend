import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CloseCircleComponent } from '../../exports';
import { ThemeService } from '../../../../services/theme.service';

@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    CloseCircleComponent
  ]
})
export class NotificationModalComponent {
  @Input() title: string = '';
  @Input() description: string = '';

  @Output() close = new EventEmitter<void>();

  secondaryColor$ = this.themeService.secondaryColor$;

  constructor(private themeService: ThemeService) {}

  onClose() {
    this.close.emit();
  }

  onBackdropClick() {
    this.close.emit();
  }
}

