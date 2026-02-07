import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
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
export class BudgetModalComponent implements OnInit, OnChanges {
  @Input() title: string = 'Definir Valor Orçado';
  @Input() subtitle: string = '';
  @Input() initialValue: string = ''; // Valor inicial para pré-preencher
  @Input() showBlockDayToggle: boolean = true; // Mostrar toggle de bloquear dia
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<{value: string, blockDay: boolean}>();
  @Output() cancel = new EventEmitter<void>();

  budgetValue: string = '';
  blockDay: boolean = false; // Por padrão, NÃO bloqueia o dia

  ngOnInit() {
    // Pré-preenche com o valor inicial se fornecido
    this.updateBudgetValue();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Atualiza o valor quando initialValue mudar
    if (changes['initialValue']) {
      this.updateBudgetValue();
    }
  }

  private updateBudgetValue() {
    if (this.initialValue) {
      this.budgetValue = this.initialValue;
    } else {
      this.budgetValue = '';
    }
  }

  onClose() {
    this.close.emit();
  }

  onConfirm() {
    if (this.budgetValue && this.budgetValue.trim() !== '') {
      this.confirm.emit({
        value: this.budgetValue,
        blockDay: this.blockDay
      });
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  get isValid(): boolean {
    return !!(this.budgetValue && this.budgetValue.trim() !== '');
  }
}
