import { Component, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonContent, NavController} from '@ionic/angular/standalone';
import { ThemeService } from '../../../shared/services/theme.service';
import { PrimaryButtonComponent, OutlineButtonComponent } from '../../../shared/ui/templates/exports';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  standalone: true,
  imports: [CommonModule, PrimaryButtonComponent, OutlineButtonComponent, IonContent],
  host: { class: 'ion-page' }
})
export class WelcomeComponent implements OnInit {
  primaryColor$ = this.themeService.primaryColor$;
  secondaryColor$ = this.themeService.secondaryColor$;
  accentColor$ = this.themeService.accentColor$;
  logo$ = this.themeService.logo$;

  constructor(private navCtrl: NavController, private themeService: ThemeService) {}

  ngOnInit() {
    // No need to load theme properties manually anymore
  }

  goToRegister(event: any) {
    event.target.blur();
    this.navCtrl.navigateForward('/register');
  }

  goToLogin(event: any) {
    event.target.blur();
    this.navCtrl.navigateForward('/login');
  }
}
