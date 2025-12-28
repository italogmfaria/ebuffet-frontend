import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonContent, IonIcon, NavController} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';
import { NotificationCircleComponent } from '../../buttons/circles/notification-circle/notification-circle.component';
import {ThemeService} from "../../../../../core/services/theme.service";
import {NotificationService} from "../../../../../core/services/notification.service";

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

  primaryColor$ = this.themeService.primaryColor$;
  secondaryColor$ = this.themeService.secondaryColor$;
  accentColor$ = this.themeService.accentColor$;
  banner$ = this.themeService.banner$;
  hasNewNotification = false;

  constructor(
    private navCtrl: NavController,
    private themeService: ThemeService,
    private notificationService: NotificationService
  ) {
    addIcons({ arrowBack });
  }

  ngOnInit() {
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
