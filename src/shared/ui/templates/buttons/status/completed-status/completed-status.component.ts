import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-completed-status',
  templateUrl: './completed-status.component.html',
  styleUrls: ['./completed-status.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class CompletedStatusComponent {
  constructor() {}
}

