import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonContent, IonIcon, NavController} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';
import { ThemeService } from '../../../../services/theme.service';
import { NotificationService } from '../../../../services/notification.service';
import { NotificationCircleComponent } from '../../buttons/circles/notification-circle/notification-circle.component';

@Component({
  selector: 'app-form-page',
  templateUrl: './form-page.component.html',
  styleUrls: ['./form-page.component.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon, NotificationCircleComponent]
})
export class FormPageComponent implements OnInit {
  @Input() title: string = '';
  @Input() backRoute: string = '';
  @Input() hasNavbar: boolean = false;
  @Input() showNotification: boolean = false;
  @Output() backClick = new EventEmitter<void>();
  @Output() notificationClick = new EventEmitter<Event>();

  primaryColor = '';
  secondaryColor = '';
  bannerUrl = '';
  accentColor = '';
  hasNewNotification = false;

  constructor(
    private navCtrl: NavController,
    private themeService: ThemeService,
    private notificationService: NotificationService
  ) {
    addIcons({ arrowBack });
  }

  ngOnInit() {
    const theme = this.themeService.getCurrentTheme();

    if (theme) {
      this.primaryColor = theme.primaryColor;
      this.secondaryColor = theme.secondaryColor;
      this.bannerUrl = theme.banner;
      this.accentColor = theme.accentColor;
    }

    // Observa mudanças no estado de notificações
    this.notificationService.hasNewNotification$.subscribe(hasNew => {
      this.hasNewNotification = hasNew;
    });
  }

  goBack() {
    if (this.backRoute) {
      this.navCtrl.navigateBack(this.backRoute);
      return;
    }

    if (this.backClick.observed) {
      this.backClick.emit();
      return;
    }

    try {
      this.navCtrl.back();
    } catch (error) {
      this.navCtrl.navigateRoot('/welcome');
    }
  }

  onNotificationClick(event: Event) {
    this.notificationClick.emit(event);
  }
}
