import { Routes } from '@angular/router';
import { IndexComponent } from '../pages/global/index/index.component';
import { WelcomeComponent } from '../pages/global/welcome/welcome.component';
import {ModelPageComponent} from "../shared/ui/templates/pages/model-page/model-page.component";
import {FormPageComponent} from "../shared/ui/templates/pages/form-page/form-page.component";
import {RegisterComponent} from "../pages/global/register/register.component";
import {
  RegisterConfirmationComponent
} from "../pages/global/register/register-confirmation/register-confirmation.component";
import {TermsComponent} from "../pages/global/register/terms/terms.component";
import {LoginComponent} from "../pages/global/login/login.component";
import {ForgotPasswordComponent} from "../pages/global/login/forgot-password/forgot-password.component";
import {NewPasswordComponent} from "../pages/global/login/forgot-password/new-password/new-password.component";
import {HomeComponent} from "../pages/client/home/home.component";

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
  },
  {
    path: 'terms',
    component: TermsComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'new-password',
    component: NewPasswordComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'form-page',
    component: FormPageComponent
  }
];
