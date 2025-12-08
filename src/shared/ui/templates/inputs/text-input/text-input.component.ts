import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonItem, IonInput } from '@ionic/angular/standalone';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
  standalone: true,
  imports: [CommonModule, IonItem, IonInput],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true
    }
  ]
})
export class TextInputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() disabled: boolean = false;
  @Input() maxlength?: number;
  @Input() inputmode?: string;
  @Input() showCounter: boolean = false;
  @Output() inputChange = new EventEmitter<string>();
  @Output() keypress = new EventEmitter<KeyboardEvent>();

  value: string = '';

  get characterCount(): string {
    if (!this.showCounter || !this.maxlength) return '';
    const current = this.value?.length || 0;
    return `${current}/${this.maxlength}`;
  }

  onChange = (value: string) => {};
  onTouched = () => {};

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

  onInputChange(event: any) {
    this.value = event.detail.value;
    this.onChange(this.value);
    this.inputChange.emit(this.value);
  }

  onBlur() {
    this.onTouched();
  }

  onKeyPress(event: KeyboardEvent) {
    this.keypress.emit(event);
  }
}
