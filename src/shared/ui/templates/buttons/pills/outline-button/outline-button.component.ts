import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from "@angular/common";
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-outline-button',
  templateUrl: './outline-button.component.html',
  styleUrls: ['./outline-button.component.scss'],
  standalone: true,
  imports: [CommonModule, IonButton]
})
export class OutlineButtonComponent {
  @Input() text: string = '';
  @Input() disabled: boolean = false;
  @Input() type: 'button' | 'submit' = 'button';
  @Input() customBackgroundColor?: string;
  @Input() customTextColor?: string;
  @Output() buttonClick = new EventEmitter<Event>();

  onClick(event: Event) {
    if (!this.disabled) {
      this.buttonClick.emit(event);
    }
  }
}
