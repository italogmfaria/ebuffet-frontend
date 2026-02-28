import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import { APP_INITIALIZER } from '@angular/core';

import { addIcons } from 'ionicons';
import {
  add,
  close,
  search,
  trash,
  pencil,
  image,
  notifications,
  logOut,
  help,
  chevronForward,
  removeCircleOutline,
  home,
  restaurant,
  cart,
  receipt,
  person,
  restaurantOutline,
  balloon,
  remove,
  calendar,
  arrowDownCircle,
  checkmark, checkmarkCircle, closeCircle, star
} from 'ionicons/icons';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { ThemeService } from './core/services/theme.service';
import {SessionService} from "./core/services/session.service";
import {authInterceptor} from "./core/interceptors/auth-interceptor";
import {userIdInterceptor} from "./core/interceptors/user-id.interceptor";

addIcons({
  add,
  close,
  trash,
  pencil,
  search,
  image,
  notifications,
  help,
  'log-out': logOut,
  'chevron-forward': chevronForward,
  'remove-circle-outline': removeCircleOutline,
  home,
  restaurant,
  cart,
  receipt,
  person,
  remove,
  'arrow-dropdown-circle': arrowDownCircle,
  'restaurant-outline': restaurantOutline,
  balloon,
  calendar,
  checkmark,
  'checkmark-circle': checkmarkCircle,
  'close-circle': close,
  star
});

function initializeTheme(themeService: ThemeService): () => Promise<void> {
  return () => {
    document.body.classList.add('theme-loading');
    return themeService.loadTheme().catch(error => {
      console.error('Theme initialization failed:', error);
      document.body.classList.remove('theme-loading');
    });
  };
}

function initSession(session: SessionService): () => Promise<void> {
  return () => session.init();
}


bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),

    provideHttpClient(
      withInterceptors([
        authInterceptor,
        userIdInterceptor
      ])
    ),

    { provide: APP_INITIALIZER, useFactory: initializeTheme, deps: [ThemeService], multi: true },
    { provide: APP_INITIALIZER, useFactory: initSession, deps: [SessionService], multi: true }
  ],
}).catch(err => console.error(err));
