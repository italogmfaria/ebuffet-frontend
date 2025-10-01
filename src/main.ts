import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';

import { addIcons } from 'ionicons';
import {
  add,
  close,
  trash,
  pencil,
  image,
  notifications,
  chevronForward,
  removeCircleOutline
} from 'ionicons/icons';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

addIcons({
  add,
  close,
  trash,
  pencil,
  image,
  notifications,
  'chevron-forward': chevronForward,
  'remove-circle-outline': removeCircleOutline
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient()
  ],
}).catch(err => console.error(err));
