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
  balloon
} from 'ionicons/icons';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { ThemeService } from './shared/services/theme.service';
import {SessionService} from "./shared/services/session.service";
import {authInterceptor} from "./shared/interceptors/auth-interceptor";

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
  'restaurant-outline': restaurantOutline,
  balloon
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
      ])
    ),

    { provide: APP_INITIALIZER, useFactory: initializeTheme, deps: [ThemeService], multi: true },
    { provide: APP_INITIALIZER, useFactory: initSession, deps: [SessionService], multi: true }
  ],
}).catch(err => console.error(err));
