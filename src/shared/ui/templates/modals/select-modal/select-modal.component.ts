import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloseCircleComponent } from '../../buttons/circles/close-circle/close-circle.component';
import { SelectOption } from '../../inputs/selected-input/selected-input.component';

@Component({
  selector: 'app-select-modal',
  templateUrl: './select-modal.component.html',
  styleUrls: ['./select-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    CloseCircleComponent
  ]
})
export class SelectModalComponent {
  @Input() title: string = 'Selecione';
  @Input() options: SelectOption[] = [];
  @Input() selectedValue: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() optionSelected = new EventEmitter<string>();

  onClose() {
    this.close.emit();
  }

  onSelectOption(value: string) {
    this.optionSelected.emit(value);
  }

  isSelected(value: string): boolean {
    return this.selectedValue === value;
  }
}

