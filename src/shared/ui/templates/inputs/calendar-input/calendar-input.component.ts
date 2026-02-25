import {Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {IonIcon, IonInput, IonItem} from '@ionic/angular/standalone';
import {ThemeService} from "../../../../../core/services/theme.service";

@Component({
  selector: 'app-calendar-input',
  templateUrl: './calendar-input.component.html',
  styleUrls: ['./calendar-input.component.scss'],
  standalone: true,
  imports: [CommonModule, IonItem, IonInput, IonIcon],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CalendarInputComponent),
      multi: true
    }
  ]
})
export class CalendarInputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = 'Escolha a data';
  @Input() disabled: boolean = false;
  @Output() inputClick = new EventEmitter<void>();
  @Output() dateChange = new EventEmitter<string>();

  value: string = '';
  secondaryColor$ = this.themeService.secondaryColor$;

  onChange = (value: string) => {
  };
  onTouched = () => {
  };

  constructor(private themeService: ThemeService) {
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

  onInputClick() {
    if (!this.disabled) {
      this.onTouched();
      this.inputClick.emit();
    }
  }

  updateValue(value: string) {
    this.value = value;
    this.onChange(this.value);
    this.dateChange.emit(this.value);
  }
}
