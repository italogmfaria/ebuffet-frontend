import { Routes } from '@angular/router';
import { IndexComponent } from '../pages/global/index/index.component';
import { WelcomeComponent } from '../pages/global/welcome/welcome.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'index',
    pathMatch: 'full'
  },
  {
    path: 'index',
    component: IndexComponent
  },
  {
    path: 'welcome',
    component: WelcomeComponent
  }
];
