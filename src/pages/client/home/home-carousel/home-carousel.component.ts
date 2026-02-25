import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-home-carousel',
  templateUrl: './home-carousel.component.html',
  styleUrls: ['./home-carousel.component.scss'],
  imports: [
    IonicModule,
    CommonModule
  ]
})
export class HomeCarouselComponent implements OnInit, OnDestroy {

  carouselImages: string[] = [];
  extendedImages: string[] = [];

  currentIndex = 0;
  autoPlayInterval: any;
  autoPlayDuration = 5000;
  isTransitioning = false;

  touchStartX = 0;
  touchEndX = 0;
  dragThreshold = 50;

  private carouselSubscription?: Subscription;

  constructor(private themeService: ThemeService) { }

  ngOnInit() {
    this.carouselSubscription = this.themeService.carouselImages$.subscribe(images => {
      if (images.length > 0) {
        this.stopAutoPlay();
        this.carouselImages = images;
        this.setupCarousel();
      }
    });
  }

  private setupCarousel() {
    this.extendedImages = [
      this.carouselImages[this.carouselImages.length - 1],
      ...this.carouselImages,
      this.carouselImages[0]
    ];

    this.currentIndex = 1;
    this.isTransitioning = false;

    this.startAutoPlay();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
    this.carouselSubscription?.unsubscribe();
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoPlayDuration);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  nextSlide() {
    if (this.isTransitioning) return;

    this.isTransitioning = true;
    this.currentIndex++;

    if (this.currentIndex === this.extendedImages.length - 1) {
      setTimeout(() => {
        this.isTransitioning = false;
        this.currentIndex = 1;
      }, 600);
    } else {
      setTimeout(() => {
        this.isTransitioning = false;
      }, 600);
    }
  }

  prevSlide() {
    if (this.isTransitioning) return;

    this.isTransitioning = true;
    this.currentIndex--;

    if (this.currentIndex === 0) {
      setTimeout(() => {
        this.isTransitioning = false;
        this.currentIndex = this.extendedImages.length - 2;
      }, 600);
    } else {
      setTimeout(() => {
        this.isTransitioning = false;
      }, 600);
    }
  }

  goToSlide(index: number) {
    if (this.isTransitioning) return;

    this.currentIndex = index + 1;
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  getTransform(): string {
    return `translateX(calc(-${this.currentIndex} * (90% + 10px)))`;
  }

  getTransitionStyle(): string {
    return this.isTransitioning ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
  }

  getActiveIndicatorIndex(): number {
    if (this.currentIndex === 0) {
      return this.carouselImages.length - 1;
    } else if (this.currentIndex === this.extendedImages.length - 1) {
      return 0;
    }
    return this.currentIndex - 1;
  }

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
    this.stopAutoPlay();
  }

  onTouchMove(event: TouchEvent) {
    this.touchEndX = event.touches[0].clientX;
  }

  onTouchEnd() {
    this.handleSwipe();
    this.startAutoPlay();
  }

  handleSwipe() {
    const swipeDistance = this.touchStartX - this.touchEndX;

    if (Math.abs(swipeDistance) > this.dragThreshold) {
      if (swipeDistance > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    }

    this.touchStartX = 0;
    this.touchEndX = 0;
  }

}
