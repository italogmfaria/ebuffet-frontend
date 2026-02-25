import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-user-circle',
  templateUrl: './user-circle.component.html',
  styleUrls: ['./user-circle.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class UserCircleComponent {
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
