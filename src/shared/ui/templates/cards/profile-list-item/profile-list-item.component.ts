import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { chevronForward } from 'ionicons/icons';
import {
  PendingStatusComponent,
  ApprovedStatusComponent,
  CanceledStatusComponent,
  CompletedStatusComponent
} from '../../exports';
import {ThemeService} from "../../../../../core/services/theme.service";

@Component({
  selector: 'app-profile-list-item',
  templateUrl: './profile-list-item.component.html',
  styleUrls: ['./profile-list-item.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    PendingStatusComponent,
    ApprovedStatusComponent,
    CanceledStatusComponent,
    CompletedStatusComponent
  ]
})
export class ProfileListItemComponent {
  @Input() title: string = '';
  @Input() status: 'pending' | 'approved' | 'canceled' | 'completed' = 'pending';
  @Input() type: 'reserva' | 'evento' = 'reserva';
  @Output() itemClick = new EventEmitter<void>();

  protected readonly chevronIcon = chevronForward;
  secondaryColor$ = this.themeService.secondaryColor$;

  constructor(private themeService: ThemeService) {}

  onItemClick() {
    this.itemClick.emit();
  }
}

