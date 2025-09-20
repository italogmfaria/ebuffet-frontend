import { Routes } from '@angular/router';
import { IndexComponent } from '../pages/global/index/index.component';
import { WelcomeComponent } from '../pages/global/welcome/welcome.component';
import {ModelPageComponent} from "../shared/ui/templates/model-page/model-page.component";
import {FormPageComponent} from "../shared/ui/templates/form-page/form-page.component";
import {RegisterComponent} from "../pages/global/register/register.component";
import {
  RegisterConfirmationComponent
} from "../pages/global/register/register-confirmation/register-confirmation.component";

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
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'register-confirmation',
    component: RegisterConfirmationComponent
  }
];
