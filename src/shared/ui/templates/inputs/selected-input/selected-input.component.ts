import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonItem, IonInput, IonIcon } from '@ionic/angular/standalone';
import {ThemeService} from "../../../../../core/services/theme.service";

export interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-selected-input',
  templateUrl: './selected-input.component.html',
  styleUrls: ['./selected-input.component.scss'],
  standalone: true,
  imports: [CommonModule, IonItem, IonInput, IonIcon],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectedInputComponent),
      multi: true
    }
  ]
})
export class SelectedInputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = 'Selecione uma opção';
  @Input() disabled: boolean = false;
  @Input() options: SelectOption[] = [];
  @Output() inputClick = new EventEmitter<void>();
  @Output() selectionChange = new EventEmitter<string>();

  value: string = '';
  secondaryColor$ = this.themeService.secondaryColor$;

  onChange = (value: string) => {};
  onTouched = () => {};

  constructor(private themeService: ThemeService) {}

  writeValue(value: string): void {
    this.value = value || '';
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

  onInputClick() {
    if (!this.disabled) {
      this.onTouched();
      this.inputClick.emit();
    }
  }

  updateValue(value: string) {
    this.value = value;
    this.onChange(this.value);
    this.selectionChange.emit(this.value);
  }

  get displayValue(): string {
    if (!this.value) return '';
    const option = this.options.find(opt => opt.value === this.value);
    return option ? option.label : this.value;
  }
}

