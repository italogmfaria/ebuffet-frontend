import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ThemeService } from '../../../../services/theme.service';
import { CommonModule } from '@angular/common';
import { ImagePlaceholderComponent } from '../../placeholders/image-placeholder/image-placeholder.component';
import {RemoveCircleComponent, AddCircleComponent} from "../../exports";

@Component({
  selector: 'app-default-item-card',
  templateUrl: './default-item-card.component.html',
  styleUrls: ['./default-item-card.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ImagePlaceholderComponent, AddCircleComponent, RemoveCircleComponent]
})
export class DefaultItemCardComponent implements OnInit {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() imageUrl: string = '';
  @Input() circleType: 'add' | 'remove' | 'none' = 'none';
  @Output() circleClick = new EventEmitter<{ title: string; description: string; imageUrl: string }>();

  secondaryColor$ = this.themeService.secondaryColor$;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    // No need to load theme colors manually anymore
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
