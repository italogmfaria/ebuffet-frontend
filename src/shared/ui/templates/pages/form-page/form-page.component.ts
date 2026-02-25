import {Component, OnInit, OnDestroy, Input, Output, EventEmitter, inject, Injector} from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonContent, IonIcon, NavController} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';
import { NotificationCircleComponent } from '../../buttons/circles/notification-circle/notification-circle.component';
import {ThemeService} from "../../../../../core/services/theme.service";
import {NotificationService} from "../../../../../core/services/notification.service";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form-page',
  templateUrl: './form-page.component.html',
  styleUrls: ['./form-page.component.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon, NotificationCircleComponent]
})
export class FormPageComponent implements OnInit, OnDestroy {
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

  private notificationSubscription?: Subscription;
  private notificationService?: NotificationService;
  private injector = inject(Injector);

  constructor(
    private navCtrl: NavController,
    private themeService: ThemeService
  ) {
    addIcons({ arrowBack });
  }

  ngOnInit() {
    // Só carrega NotificationService se showNotification for true (lazy loading)
    if (this.showNotification) {
      // Injeta o serviço de forma lazy para evitar dependência circular
      this.notificationService = this.injector.get(NotificationService);

      // Verifica imediatamente se há novas notificações
      this.notificationService.checkForNewNotifications();

      // Observa mudanças no estado de notificações
      this.notificationSubscription = this.notificationService.hasNewNotification$.subscribe(hasNew => {
        this.hasNewNotification = hasNew;
      });
    }
  }

  ngOnDestroy() {
    // Desinscreve para evitar memory leaks
    this.notificationSubscription?.unsubscribe();
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
