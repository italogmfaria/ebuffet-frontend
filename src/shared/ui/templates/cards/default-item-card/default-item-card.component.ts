import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ImagePlaceholderComponent } from '../../placeholders/image-placeholder/image-placeholder.component';
import {CloseCircleComponent, AddCircleComponent} from "../../exports";
import {ThemeService} from "../../../../../core/services/theme.service";

@Component({
  selector: 'app-default-item-card',
  templateUrl: './default-item-card.component.html',
  styleUrls: ['./default-item-card.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ImagePlaceholderComponent, AddCircleComponent, CloseCircleComponent]
})
export class DefaultItemCardComponent implements OnInit {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() imageUrl: string = '';
  @Input() circleType: 'add' | 'close' | 'none' = 'none';
  @Input() quantity?: number;
  @Output() circleClick = new EventEmitter<{ title: string; description: string; imageUrl: string }>();
  @Output() cardClick = new EventEmitter<void>();

  secondaryColor$ = this.themeService.secondaryColor$;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    // No need to load theme colors manually anymore
  }

  onCardClick() {
    this.cardClick.emit();
  }

  onCircleClick(event: Event) {
    event.stopPropagation(); // Impede que o clique propague para o card pai
    this.circleClick.emit({
      title: this.title,
      description: this.description,
      imageUrl: this.imageUrl
    });
  }
}
