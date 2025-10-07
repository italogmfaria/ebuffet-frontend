import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { ThemeService } from '../../../../shared/services/theme.service';
import { CommonModule } from '@angular/common';
import {
  PrimaryButtonComponent
} from "../../../../shared/ui/templates/buttons/pills/primary-button/primary-button.component";

@Component({
  selector: 'app-home-categories',
  templateUrl: './home-categories.component.html',
  styleUrls: ['./home-categories.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, PrimaryButtonComponent]
})
export class HomeCategoriesComponent implements OnInit {
  categories = [
    { name: 'Almoço', image: 'assets/images/categories-images/categories-image-1.png', route: '/almoço' },
    { name: 'Café da manhã', image: 'assets/images/categories-images/categories-image-2.png', route: '/cafe-da-manha' },
    { name: 'Happy Hour', image: 'assets/images/categories-images/categories-image-3.png', route: '/happy-hour' },
    { name: 'Jantar', image: 'assets/images/categories-images/categories-image-4.png', route: '/jantar' }
  ];

  secondaryColor = '';
  accentColor = '';

  constructor(
    public themeService: ThemeService,
    private navController: NavController,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    const theme = this.themeService.getCurrentTheme();
    if (theme) {
      this.secondaryColor = theme.secondaryColor;
      this.accentColor = theme.accentColor;

      if (this.secondaryColor) {
        this.renderer.setStyle(this.elementRef.nativeElement, '--secondary-color', this.secondaryColor);
      }
      if (this.accentColor) {
        this.renderer.setStyle(this.elementRef.nativeElement, '--accent-color', this.accentColor);
      }
    }
  }


  toCategories(_event?: Event) {
    this.navController.navigateForward('/client/foods');
  }

  navigateToCategory(route: string) {
    const category = route ? route.replace(/^\/+/, '') : '';
    const url = category ? `/client/foods?category=${encodeURIComponent(category)}` : '/client/foods';
    this.navController.navigateForward(url);
  }
}
