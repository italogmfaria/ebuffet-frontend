import { Component, Input, Output, EventEmitter, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonItem, IonInput, IonIcon } from '@ionic/angular/standalone';
import { ThemeService } from '../../../../services/theme.service';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonItem, IonInput, IonIcon],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchInputComponent),
      multi: true
    }
  ]
})
export class SearchInputComponent implements ControlValueAccessor, OnInit {
  @Input() placeholder: string = 'Pesquisar...';
  @Input() disabled: boolean = false;
  @Output() searchChange = new EventEmitter<string>();

  value: string = '';
  secondaryColor$ = this.themeService.secondaryColor$;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    // No need to load theme colors manually anymore
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (_: string) => {};
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

  onInputChange(event: any): void {
    const newValue = event?.detail?.value ?? '';
    this.value = newValue;
    this.onChange(newValue);
    this.searchChange.emit(newValue);
  }
}
