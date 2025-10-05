import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { IonIcon, IonBadge, NavController } from '@ionic/angular/standalone';
import { ThemeService } from '../../../../services/theme.service';

@Component({
  selector: 'app-client-navbar',
  templateUrl: './client-navbar.component.html',
  styleUrls: ['./client-navbar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonIcon, IonBadge]
})
export class ClientNavbarComponent implements OnInit {
  @Input() cartItemCount = 0;
  secondaryColor = '';
  currentRoute = '';

  hoveredIcon: string | null = null;

  constructor(
    private themeService: ThemeService,
    private navCtrl: NavController,
    private router: Router
  ) {}

  ngOnInit() {
    const theme = this.themeService.getCurrentTheme();
    if (theme) {
      this.secondaryColor = theme.secondaryColor;
    }

    this.currentRoute = this.router.url;

    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  navigate(route: string) {
    this.navCtrl.navigateForward(route);
  }

  isActive(route: string): boolean {
    return this.currentRoute === route;
  }

  onIconHover(iconName: string) {
    this.hoveredIcon = iconName;
  }

  onIconLeave() {
    this.hoveredIcon = null;
  }

  getIconColor(iconName: string, route: string): string {
    if (this.isActive(route) || this.hoveredIcon === iconName) {
      return this.secondaryColor;
    }
    return '#9e9e9e';
  }
}
