import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { ThemeService } from '../../../../core/services/theme.service';
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
    { name: 'Almoço', image: 'assets/images/categories-images/categories-image-1.png', route: '/almoco' },
    { name: 'Café da manhã', image: 'assets/images/categories-images/categories-image-2.png', route: '/cafe' },
    { name: 'Happy Hour', image: 'assets/images/categories-images/categories-image-3.png', route: '/happy-hour' },
    { name: 'Jantar', image: 'assets/images/categories-images/categories-image-4.png', route: '/jantar' }
  ];

  secondaryColor$ = this.themeService.secondaryColor$;
  accentColor$ = this.themeService.accentColor$;

  constructor(
    public themeService: ThemeService,
    private navController: NavController,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    // Subscribe to theme colors to update CSS variables
    this.secondaryColor$.subscribe(color => {
      if (color) {
        this.renderer.setStyle(this.elementRef.nativeElement, '--secondary-color', color);
      }
    });

    this.accentColor$.subscribe(color => {
      if (color) {
        this.renderer.setStyle(this.elementRef.nativeElement, '--accent-color', color);
      }
    });
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
