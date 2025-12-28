import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { IonIcon, IonBadge, NavController } from '@ionic/angular/standalone';
import { filter } from 'rxjs/operators';
import {ThemeService} from "../../../../../core/services/theme.service";
import {OrderService} from "../../../../../features/orders/services/order.service";

@Component({
  selector: 'app-client-navbar',
  templateUrl: './client-navbar.component.html',
  styleUrls: ['./client-navbar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonIcon, IonBadge]
})
export class ClientNavbarComponent implements OnInit {
  @Input() cartItemCount = 0;
  secondaryColor$ = this.themeService.secondaryColor$;
  currentRoute = '';
  private currentSecondaryColor = '';

  hoveredIcon: string | null = null;

  constructor(
    private themeService: ThemeService,
    private navCtrl: NavController,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    // Subscribe to order items to update cart count automatically
    this.orderService.orderItems$.subscribe(() => {
      this.cartItemCount = this.orderService.getTotalItems();
    });

    // Subscribe to secondary color for use in getIconColor method
    this.secondaryColor$.subscribe(color => {
      this.currentSecondaryColor = color;
    });

    this.currentRoute = this.router.url;

    // Subscribe only to NavigationEnd events
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.urlAfterRedirects || event.url;
    });
  }

  navigate(route: string) {
    this.navCtrl.navigateForward(route);
  }

  isActive(route: string): boolean {
    // Exact match or starts with route followed by query params or slash
    return this.currentRoute === route ||
           this.currentRoute.startsWith(route + '/') ||
           this.currentRoute.startsWith(route + '?');
  }

  onIconHover(iconName: string) {
    this.hoveredIcon = iconName;
  }

  onIconLeave() {
    this.hoveredIcon = null;
  }

  getIconColor(iconName: string, route: string): string {
    if (this.isActive(route) || this.hoveredIcon === iconName) {
      return this.currentSecondaryColor;
    }
    return '#9e9e9e';
  }
}
