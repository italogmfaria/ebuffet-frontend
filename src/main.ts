import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';
import { APP_INITIALIZER } from '@angular/core';

import { addIcons } from 'ionicons';
import {
  add,
  close,
  trash,
  pencil,
  image,
  notifications,
  logOut,
  help,
  chevronForward,
  removeCircleOutline
} from 'ionicons/icons';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { ThemeService } from './shared/services/theme.service';

addIcons({
  add,
  close,
  trash,
  pencil,
  image,
  notifications,
  help,
  'log-out': logOut,
  'chevron-forward': chevronForward,
  'remove-circle-outline': removeCircleOutline
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

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeTheme,
      deps: [ThemeService],
      multi: true
    }
  ],
}).catch(err => console.error(err));
