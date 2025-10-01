import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { logoWhatsapp } from 'ionicons/icons';

@Component({
  selector: 'app-whatsapp-button',
  templateUrl: './whatsapp-button.component.html',
  styleUrls: ['./whatsapp-button.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class WhatsappButtonComponent {
  @Input() text: string = '';
  @Input() disabled: boolean = false;
  @Input() type: 'button' | 'submit' = 'button';
  @Input() showIcon: boolean = true;
  @Output() buttonClick = new EventEmitter<Event>();

  constructor() {
    addIcons({
      'logo-whatsapp': logoWhatsapp
    });
  }

  onClick(event: Event) {
    if (!this.disabled) {
      this.buttonClick.emit(event);
    }
  }
}
