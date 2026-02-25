import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonItem, IonInput, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eye, eyeOff } from 'ionicons/icons';

@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.scss'],
  standalone: true,
  imports: [CommonModule, IonItem, IonInput, IonButton, IonIcon],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true
    }
  ]
})
export class PasswordInputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Output() inputChange = new EventEmitter<string>();

  value: string = '';
  showPassword: boolean = false;

  onChange = (value: string) => {};
  onTouched = () => {};

  constructor() {
    addIcons({
      'eye': eye,
      'eye-off': eyeOff
    });
  }

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

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
