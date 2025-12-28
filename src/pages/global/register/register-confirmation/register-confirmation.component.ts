import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelPageComponent, PrimaryButtonComponent } from "../../../../shared/ui/templates/exports";
import { NavController } from "@ionic/angular/standalone";
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-register-confirmation',
  templateUrl: './register-confirmation.component.html',
  styleUrls: ['./register-confirmation.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ModelPageComponent,
    PrimaryButtonComponent
  ],
  host: { class: 'ion-page' }
})
export class RegisterConfirmationComponent implements OnInit {
  primaryColor$ = this.themeService.primaryColor$;
  secondaryColor$ = this.themeService.secondaryColor$;
  accentColor$ = this.themeService.accentColor$;

  constructor(private navCtrl: NavController, private themeService: ThemeService) { }

  ngOnInit() {
    // No need to load theme colors manually anymore
  }

  goToLogin(event: any) {
    event.target.blur();
    this.navCtrl.navigateForward('/login');
  }

}
