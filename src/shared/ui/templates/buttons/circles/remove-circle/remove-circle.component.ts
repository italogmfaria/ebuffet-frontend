import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-remove-circle',
  templateUrl: './remove-circle.component.html',
  styleUrls: ['./remove-circle.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class RemoveCircleComponent {
  @Input() disabled: boolean = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() customColor?: string;
  @Output() buttonClick = new EventEmitter<Event>();

  onClick(event: Event) {
    if (!this.disabled) {
      this.buttonClick.emit(event);
    }
  }
}
