import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from "@angular/common";
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-primary-button',
  templateUrl: './primary-button.component.html',
  styleUrls: ['./primary-button.component.scss'],
  standalone: true,
  imports: [CommonModule, IonButton]
})
export class PrimaryButtonComponent {
  @Input() text: string = '';
  @Input() disabled: boolean = false;
  @Input() type: 'button' | 'submit' = 'button';
  @Input() customColor?: string;
  @Output() buttonClick = new EventEmitter<Event>();

  onClick(event: Event) {
    if (!this.disabled) {
      this.buttonClick.emit(event);
    }
  }
}
