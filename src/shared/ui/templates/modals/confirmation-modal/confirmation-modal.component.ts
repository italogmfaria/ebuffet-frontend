import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QueryBadgeComponent, CloseCircleComponent, PrimaryButtonComponent, OutlineButtonComponent } from '../../exports';
import {ThemeService} from "../../../../../core/services/theme.service";

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
  standalone: true,
  imports: [
    QueryBadgeComponent,
    CloseCircleComponent,
    PrimaryButtonComponent,
    OutlineButtonComponent
  ]
})
export class ConfirmationModalComponent implements OnInit {
  secondaryColor = '';

  @Input() title: string = 'Deseja algo no cardápio?';
  @Input() subtitle: string = 'Não há nenhuma comida<br>inclusa na sua reserva.';
  @Input() outlineButtonText: string = 'Não';
  @Input() primaryButtonText: string = 'Sim';
  @Input() icon: string = 'help';
  @Input() iconColor: string = '#fff';

  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    const theme = this.themeService.getCurrentTheme?.() ?? this.themeService['currentTheme'];
    if (theme) {
      this.secondaryColor = theme.secondaryColor;
    }
  }

  onClose() {
    this.close.emit();
  }

  onCancel() {
    this.cancel.emit();
  }

  onConfirm() {
    this.confirm.emit();
  }
}
