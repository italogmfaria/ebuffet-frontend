import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-logout-circle',
  templateUrl: './logout-circle.component.html',
  styleUrls: ['./logout-circle.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class LogoutCircleComponent {
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
