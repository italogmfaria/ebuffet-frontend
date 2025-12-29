import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ThemeService } from '../../../../../core/services/theme.service';
import { CommonModule } from '@angular/common';
import { ImagePlaceholderComponent } from '../../placeholders/image-placeholder/image-placeholder.component';
import { EditCircleComponent } from "../../buttons/circles/edit-circle/edit-circle.component";
import { DeleteCircleComponent } from "../../buttons/circles/delete-circle/delete-circle.component";

@Component({
  selector: 'app-manage-item-card',
  templateUrl: './manage-item-card.component.html',
  styleUrls: ['./manage-item-card.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ImagePlaceholderComponent, EditCircleComponent, DeleteCircleComponent]
})
export class ManageItemCardComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() imageUrl: string = '';
  @Output() editClick = new EventEmitter<void>();
  @Output() deleteClick = new EventEmitter<void>();
  @Output() cardClick = new EventEmitter<void>();

  secondaryColor$ = this.themeService.secondaryColor$;

  constructor(private themeService: ThemeService) {}

  onCardClick() {
    this.cardClick.emit();
  }

  onEditClick(event: Event) {
    event.stopPropagation();
    this.editClick.emit();
  }

  onDeleteClick(event: Event) {
    event.stopPropagation();
    this.deleteClick.emit();
  }
}

