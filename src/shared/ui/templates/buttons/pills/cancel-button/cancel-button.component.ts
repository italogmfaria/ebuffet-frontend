import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';

@Component({
  selector: 'app-cancel-button',
  templateUrl: './cancel-button.component.html',
  styleUrls: ['./cancel-button.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class CancelButtonComponent {
  @Input() text: string = '';
  @Input() disabled: boolean = false;
  @Input() type: 'button' | 'submit' = 'button';
  @Input() showIcon: boolean = true;
  @Output() buttonClick = new EventEmitter<Event>();

  constructor() {
    addIcons({
      'close': close
    });
  }

  onClick(event: Event) {
    if (!this.disabled) {
      this.buttonClick.emit(event);
    }
  }
}
