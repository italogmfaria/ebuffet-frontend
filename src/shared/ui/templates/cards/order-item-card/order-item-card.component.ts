import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ImagePlaceholderComponent } from '../../placeholders/image-placeholder/image-placeholder.component';
import {DeleteCircleComponent} from '../../exports';
import {ThemeService} from "../../../../../core/services/theme.service";

@Component({
  selector: 'app-order-item-card',
  templateUrl: './order-item-card.component.html',
  styleUrls: ['./order-item-card.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ImagePlaceholderComponent, DeleteCircleComponent]
})
export class OrderItemCardComponent implements OnInit {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() imageUrl: string = '';
  @Input() quantity: number = 1;
  @Output() cardClick = new EventEmitter<void>();
  @Output() removeClick = new EventEmitter<void>();
  @Output() quantityChange = new EventEmitter<number>();

  secondaryColor$ = this.themeService.secondaryColor$;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {}

  onCardClick() {
    this.cardClick.emit();
  }

  onRemoveClick(event: Event) {
    event.stopPropagation();
    this.removeClick.emit();
  }

  onDecrease(event: Event) {
    event.stopPropagation();
    if (this.quantity > 1) {
      this.quantity--;
      this.quantityChange.emit(this.quantity);
    }
  }

  onIncrease(event: Event) {
    event.stopPropagation();
    this.quantity++;
    this.quantityChange.emit(this.quantity);
  }
}

