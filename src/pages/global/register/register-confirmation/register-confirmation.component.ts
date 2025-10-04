import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ModelPageComponent} from "../../../../shared/ui/templates/pages/model-page/model-page.component";
import { PrimaryButtonComponent } from "../../../../shared/ui/templates/exports";
import {NavController} from "@ionic/angular/standalone";
import { ThemeService } from '../../../../shared/config/theme.service';

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
export class RegisterConfirmationComponent  implements OnInit {
  primaryColor = '';
  secondaryColor = '';
  accentColor = '';

  constructor(private navCtrl: NavController, private themeService: ThemeService) { }

  ngOnInit() {
    const theme = this.themeService.getCurrentTheme();

    if (theme) {
      this.primaryColor = theme.primaryColor;
      this.secondaryColor = theme.secondaryColor;
      this.accentColor = theme.accentColor;
    }
  }

  goToLogin(event: any) {
    event.target.blur();
    this.navCtrl.navigateForward('/login');
  }

}
