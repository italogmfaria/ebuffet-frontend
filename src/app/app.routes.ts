import { Routes } from '@angular/router';
import { IndexComponent } from '../pages/global/index/index.component';
import { WelcomeComponent } from '../pages/global/welcome/welcome.component';
import {RegisterComponent} from "../pages/global/register/register.component";
import {
  RegisterConfirmationComponent
} from "../pages/global/register/register-confirmation/register-confirmation.component";
import {TermsComponent} from "../pages/global/register/terms/terms.component";
import {LoginComponent} from "../pages/global/login/login.component";
import {ForgotPasswordComponent} from "../pages/global/login/forgot-password/forgot-password.component";
import {NewPasswordComponent} from "../pages/global/login/forgot-password/new-password/new-password.component";
import {HomeComponent} from "../pages/client/home/home.component";
import {FoodsComponent} from "../pages/client/foods/foods.component";
import {OrderComponent} from "../pages/client/order/order.component";
import {ServicesComponent} from "../pages/client/services/services.component";
import {ProfileComponent} from "../pages/client/profile/profile.component";
import {NotificationsComponent} from "../pages/global/notifications/notifications.component";

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
    path: 'notifications',
    component: NotificationsComponent
  },
  // Rotas do cliente
  {
    path: 'client/home',
    component: HomeComponent
  },
  {
    path: 'client/foods',
    component: FoodsComponent
  },
  {
    path: 'client/order',
    component: OrderComponent
  },
  {
    path: 'client/services',
    component: ServicesComponent
  },
  {
    path: 'client/profile',
    component: ProfileComponent
  }
];
