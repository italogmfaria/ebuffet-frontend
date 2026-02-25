import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonItem, IonInput } from '@ionic/angular/standalone';

@Component({
  selector: 'app-budget-input',
  templateUrl: './budget-input.component.html',
  styleUrls: ['./budget-input.component.scss'],
  standalone: true,
  imports: [CommonModule, IonItem, IonInput],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BudgetInputComponent),
      multi: true
    }
  ]
})
export class BudgetInputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = '0,00';
  @Input() disabled: boolean = false;
  @Output() inputChange = new EventEmitter<string>();

  value: string = '';
  displayValue: string = '';

  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(value: string): void {
    this.value = value || '';
    this.displayValue = this.formatCurrency(this.value);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange(event: any) {
    const rawValue = event.detail.value || '';

    // Remove tudo exceto números
    const numbersOnly = rawValue.replace(/\D/g, '');

    // Converte para número e divide por 100 para ter os centavos
    const numericValue = parseInt(numbersOnly || '0', 10) / 100;

    // Formata para exibição
    this.displayValue = this.formatCurrency(numericValue.toFixed(2));

    // Armazena o valor limpo (sem formatação) para o modelo
    this.value = numericValue.toFixed(2);

    this.onChange(this.value);
    this.inputChange.emit(this.value);
  }

  onFocus(event: any) {
    // Quando o input recebe foco, mostra o valor formatado
    if (!this.value || this.value === '0.00') {
      this.displayValue = '';
    }
  }

  onBlur() {
    this.onTouched();

    // Se estiver vazio, formata como 0,00
    if (!this.value || this.value === '0.00') {
      this.value = '0.00';
      this.displayValue = this.formatCurrency('0.00');
    } else {
      this.displayValue = this.formatCurrency(this.value);
    }
  }

  /**
   * Formata um valor numérico para o padrão brasileiro (ex: 1.234,56)
   */
  private formatCurrency(value: string): string {
    if (!value) return '0,00';

    const [integerPart, decimalPart = '00'] = value.split('.');

    // Adiciona separadores de milhar
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `${formattedInteger},${decimalPart.padEnd(2, '0').substring(0, 2)}`;
  }

  /**
   * Retorna o valor formatado com o prefixo R$
   */
  get formattedWithPrefix(): string {
    return `R$ ${this.displayValue}`;
  }
}

