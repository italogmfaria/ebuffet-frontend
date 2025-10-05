import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelPageComponent, ClientNavbarComponent, LogoutCircleComponent, EditCircleComponent } from '../../../shared/ui/templates/exports';
import { IonGrid, NavController } from '@ionic/angular/standalone';
import { ThemeService } from '../../../shared/services/theme.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [CommonModule, ModelPageComponent, IonGrid, ClientNavbarComponent, LogoutCircleComponent, EditCircleComponent],
  host: { class: 'ion-page' }
})
export class ProfileComponent implements OnInit {
  primaryColor = '';
  secondaryColor = '';
  accentColor = '';
  cartItemCount = 1;
  userName = 'Usuário';

  constructor(
    private themeService: ThemeService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    const theme = this.themeService.getCurrentTheme();
    if (theme) {
      this.primaryColor = theme.primaryColor;
      this.secondaryColor = theme.secondaryColor;
      this.accentColor = theme.accentColor;
    }
  }

  onBackClick() {
    this.navCtrl.navigateBack('/client/home');
  }

  onLogout() {
    // TODO: Implementar lógica de logout
    console.log('Logout clicked');
    this.navCtrl.navigateRoot('/welcome');
  }

  onEdit() {
    // TODO: Implementar lógica de edição de perfil
    console.log('Edit profile clicked');
  }
}
