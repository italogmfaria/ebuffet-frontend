import { Component, OnInit, forwardRef, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-code-input',
  templateUrl: './code-input.component.html',
  styleUrls: ['./code-input.component.scss'],
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CodeInputComponent),
      multi: true
    }
  ]
})
export class CodeInputComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  @ViewChildren('codeInput') codeInputs!: QueryList<ElementRef>;

  inputs = [
    { index: 0, value: '' },
    { index: 1, value: '' },
    { index: 2, value: '' },
    { index: 3, value: '' },
    { index: 4, value: '' },
    { index: 5, value: '' }
  ];

  disabled = false;
  private isProcessing = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() { }

  ngOnInit() {}

  ngAfterViewInit() {}

  trackByIndex(index: number): number {
    return index;
  }

  writeValue(value: string): void {
    if (value) {
      const digits = value.split('').slice(0, 6);
      digits.forEach((digit, idx) => {
        this.inputs[idx].value = digit;
      });
      for (let i = digits.length; i < 6; i++) {
        this.inputs[i].value = '';
      }
    } else {
      this.inputs.forEach(input => input.value = '');
    }

    setTimeout(() => {
      this.syncInputElements();
    });
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

  private syncInputElements(): void {
    if (this.codeInputs) {
      const inputElements = this.codeInputs.toArray();
      this.inputs.forEach((input, idx) => {
        if (inputElements[idx]) {
          inputElements[idx].nativeElement.value = input.value;
        }
      });
    }
  }

  onInputChange(event: Event, index: number): void {
    if (this.isProcessing) return;
    this.isProcessing = true;

    const input = event.target as HTMLInputElement;
    const currentValue = input.value;

    if (!currentValue) {
      this.inputs[index].value = '';
      input.value = '';
      this.emitValue();
      this.isProcessing = false;
      return;
    }

    const digits = currentValue.replace(/\D/g, '');

    if (!digits) {
      this.inputs[index].value = '';
      input.value = '';
      this.isProcessing = false;
      return;
    }

    const digit = digits.charAt(0);

    this.inputs[index].value = digit;
    input.value = digit;

    this.emitValue();

    if (index < 5) {
      setTimeout(() => {
        const inputElements = this.codeInputs.toArray();
        if (inputElements[index + 1]) {
          inputElements[index + 1].nativeElement.focus();
        }
        this.isProcessing = false;
      }, 50);
    } else {
      this.isProcessing = false;
    }
  }

  onInputKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;
    const inputElements = this.codeInputs.toArray();

    if (event.key === 'Backspace') {
      event.preventDefault();

      if (this.inputs[index].value) {
        this.inputs[index].value = '';
        input.value = '';
        this.emitValue();
      } else if (index > 0) {
        this.inputs[index - 1].value = '';
        inputElements[index - 1].nativeElement.value = '';
        inputElements[index - 1].nativeElement.focus();
        this.emitValue();
      }
      return;
    }

    if (event.key === 'Delete') {
      event.preventDefault();
      this.inputs[index].value = '';
      input.value = '';
      this.emitValue();
      return;
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      inputElements[index - 1].nativeElement.focus();
      return;
    }

    if (event.key === 'ArrowRight' && index < 5) {
      event.preventDefault();
      inputElements[index + 1].nativeElement.focus();
      return;
    }

    if (/^\d$/.test(event.key) && this.inputs[index].value) {
      event.preventDefault();
      this.inputs[index].value = event.key;
      input.value = event.key;
      this.emitValue();

      if (index < 5) {
        setTimeout(() => {
          inputElements[index + 1].nativeElement.focus();
        }, 50);
      }
      return;
    }
  }

  onInputPaste(event: ClipboardEvent, index: number): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text') || '';
    const digits = pastedData.replace(/\D/g, '').slice(0, 6 - index).split('');

    if (digits.length > 0) {
      digits.forEach((digit, offset) => {
        const targetIndex = index + offset;
        if (targetIndex < 6) {
          this.inputs[targetIndex].value = digit;
        }
      });

      this.syncInputElements();

      const nextEmptyIndex = this.inputs.findIndex((inp, idx) => idx > index && !inp.value);
      const focusIndex = nextEmptyIndex === -1 ? Math.min(index + digits.length, 5) : nextEmptyIndex;

      setTimeout(() => {
        const inputElements = this.codeInputs.toArray();
        inputElements[focusIndex]?.nativeElement.focus();
      }, 50);

      this.emitValue();
    }
  }

  onInputFocus(event: Event): void {
    this.onTouched();
  }

  private emitValue(): void {
    const code = this.inputs.map(input => input.value).join('');
    this.onChange(code);
  }
}
