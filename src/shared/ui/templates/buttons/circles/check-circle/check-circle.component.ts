import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-check-circle',
  templateUrl: './check-circle.component.html',
  styleUrls: ['./check-circle.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class CheckCircleComponent {
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

