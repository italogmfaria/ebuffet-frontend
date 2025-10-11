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
import { AuthGuard } from '../shared/guards/auth.guard';
import {NotificationsComponent} from "../pages/global/notifications/notifications.component";
import {FoodsComponent} from "../pages/client/foods/foods.component";
import {FoodDetailsComponent} from "../pages/client/foods/food-details/food-details.component";
import {OrderComponent} from "../pages/client/order/order.component";
import {ServicesComponent} from "../pages/client/services/services.component";
import {ProfileComponent} from "../pages/client/profile/profile.component";
import { ServiceDetailsComponent } from '../pages/client/services/service-details/service-details.component';
import { OrderDetailsComponent } from '../pages/client/order/order-details/order-details.component';
import { OrderAddressComponent } from '../pages/client/order/order-address/order-address.component';
import { OrderConfirmationComponent } from '../pages/client/order/order-confirmation/order-confirmation.component';

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
    path: 'notifications',
    component: NotificationsComponent
  },
  // Rotas do cliente (protegidas)
  {
    path: 'client',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'foods',
        component: FoodsComponent
      },
      {
        path: 'foods/:id',
        component: FoodDetailsComponent
      },
      {
        path: 'order',
        component: OrderComponent
      },
      {
        path: 'order/order-details',
        component: OrderDetailsComponent
      },
      {
        path: 'order/order-address',
        component: OrderAddressComponent
      },
      {
        path: 'order/order-confirmation',
        component: OrderConfirmationComponent
      },
      {
        path: 'services',
        component: ServicesComponent
      },
      {
        path: 'services/:id',
        component: ServiceDetailsComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      }
    ]
  }
];
