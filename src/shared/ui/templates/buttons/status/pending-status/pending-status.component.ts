import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pending-status',
  templateUrl: './pending-status.component.html',
  styleUrls: ['./pending-status.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class PendingStatusComponent {
  constructor() {}
}

