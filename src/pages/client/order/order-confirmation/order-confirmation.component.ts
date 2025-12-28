import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular/standalone';
import {
  CheckCircleComponent,
  OutlineButtonComponent,
  WhatsappButtonComponent,
  PrimaryButtonComponent
} from '../../../../shared/ui/templates/exports';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    CheckCircleComponent,
    OutlineButtonComponent,
    WhatsappButtonComponent,
    PrimaryButtonComponent
  ]
})
export class OrderConfirmationComponent implements OnInit {
  primaryColor$ = this.themeService.primaryColor$;
  secondaryColor$ = this.themeService.secondaryColor$;
  accentColor$ = this.themeService.accentColor$;

  constructor(
    private themeService: ThemeService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {}

  onMyReservations() {
    this.navCtrl.navigateForward('/reserves');
  }

  onContactWhatsApp() {
    const phone = '5564992827727';
    const message = 'Olá! Gostaria de confirmar minha reserva.';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  }

  onGoBack() {
    this.navCtrl.navigateRoot('/client/home');
  }
}
