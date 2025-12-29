import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PrimaryButtonComponent } from '../../buttons/pills/primary-button/primary-button.component';
import { OutlineButtonComponent } from '../../buttons/pills/outline-button/outline-button.component';
import { BudgetInputComponent } from '../../inputs/budget-input/budget-input.component';

@Component({
  selector: 'app-budget-modal',
  templateUrl: './budget-modal.component.html',
  styleUrls: ['./budget-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, PrimaryButtonComponent, OutlineButtonComponent, BudgetInputComponent]
})
export class BudgetModalComponent {
  @Input() title: string = 'Definir Valor Orçado';
  @Input() subtitle: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  budgetValue: string = '';

  onClose() {
    this.close.emit();
  }

  onConfirm() {
    if (this.budgetValue && this.budgetValue.trim() !== '') {
      this.confirm.emit(this.budgetValue);
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  get isValid(): boolean {
    return !!(this.budgetValue && this.budgetValue.trim() !== '');
  }
}
