# Estrutura do Projeto eBuffet Frontend

```
src/
├── app/
│   ├── core/
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── api.service.ts
│   │   │   ├── notification.service.ts
│   │   │   ├── calendar.service.ts
│   │   │   ├── food.service.ts
│   │   │   ├── service.service.ts
│   │   │   ├── order.service.ts
│   │   │   ├── reserve.service.ts
│   │   │   └── event.service.ts
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   ├── admin.guard.ts
│   │   │   └── client.guard.ts
│   │   ├── interceptors/
│   │   │   ├── auth.interceptor.ts
│   │   │   └── error.interceptor.ts
│   │   └── core.config.ts
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── navbar/
│   │   │   │   ├── navbar.component.ts
│   │   │   │   ├── navbar.component.html
│   │   │   │   └── navbar.component.scss
│   │   │   ├── footer/
│   │   │   │   ├── footer.component.ts
│   │   │   │   ├── footer.component.html
│   │   │   │   └── footer.component.scss
│   │   │   ├── loading/
│   │   │   │   ├── loading.component.ts
│   │   │   │   ├── loading.component.html
│   │   │   │   └── loading.component.scss
│   │   │   └── confirmation-modal/
│   │   │       ├── confirmation-modal.component.ts
│   │   │       ├── confirmation-modal.component.html
│   │   │       └── confirmation-modal.component.scss
│   │   ├── pipes/
│   │   │   ├── date-format.pipe.ts
│   │   │   ├── currency-format.pipe.ts
│   │   │   └── status-format.pipe.ts
│   │   ├── directives/
│   │   │   ├── autofocus.directive.ts
│   │   │   └── click-outside.directive.ts
│   │   └── shared.config.ts
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── login/
│   │   │   │   │   ├── login.component.ts
│   │   │   │   │   ├── login.component.html
│   │   │   │   │   └── login.component.scss
│   │   │   │   ├── register/
│   │   │   │   │   ├── register.component.ts
│   │   │   │   │   ├── register.component.html
│   │   │   │   │   └── register.component.scss
│   │   │   │   ├── register-confirmation/
│   │   │   │   │   ├── register-confirmation.component.ts
│   │   │   │   │   ├── register-confirmation.component.html
│   │   │   │   │   └── register-confirmation.component.scss
│   │   │   │   ├── forgot-password/
│   │   │   │   │   ├── forgot-password.component.ts
│   │   │   │   │   ├── forgot-password.component.html
│   │   │   │   │   └── forgot-password.component.scss
│   │   │   │   └── new-password/
│   │   │   │       ├── new-password.component.ts
│   │   │   │       ├── new-password.component.html
│   │   │   │       └── new-password.component.scss
│   │   │   └── auth.routes.ts
│   │   │
│   │   ├── client/
│   │   │   ├── components/
│   │   │   │   ├── home/
│   │   │   │   │   ├── home.component.ts
│   │   │   │   │   ├── home.component.html
│   │   │   │   │   └── home.component.scss
│   │   │   │   ├── foods/
│   │   │   │   │   ├── foods.component.ts
│   │   │   │   │   ├── foods.component.html
│   │   │   │   │   └── foods.component.scss
│   │   │   │   ├── food-details/
│   │   │   │   │   ├── food-details.component.ts
│   │   │   │   │   ├── food-details.component.html
│   │   │   │   │   └── food-details.component.scss
│   │   │   │   ├── services/
│   │   │   │   │   ├── services.component.ts
│   │   │   │   │   ├── services.component.html
│   │   │   │   │   └── services.component.scss
│   │   │   │   ├── service-details/
│   │   │   │   │   ├── service-details.component.ts
│   │   │   │   │   ├── service-details.component.html
│   │   │   │   │   └── service-details.component.scss
│   │   │   │   ├── order/
│   │   │   │   │   ├── order.component.ts
│   │   │   │   │   ├── order.component.html
│   │   │   │   │   └── order.component.scss
│   │   │   │   ├── order-details/
│   │   │   │   │   ├── order-details.component.ts
│   │   │   │   │   ├── order-details.component.html
│   │   │   │   │   └── order-details.component.scss
│   │   │   │   ├── order-address/
│   │   │   │   │   ├── order-address.component.ts
│   │   │   │   │   ├── order-address.component.html
│   │   │   │   │   └── order-address.component.scss
│   │   │   │   ├── without-food/
│   │   │   │   │   ├── without-food.component.ts
│   │   │   │   │   ├── without-food.component.html
│   │   │   │   │   └── without-food.component.scss
│   │   │   │   ├── without-service/
│   │   │   │   │   ├── without-service.component.ts
│   │   │   │   │   ├── without-service.component.html
│   │   │   │   │   └── without-service.component.scss
│   │   │   │   ├── order-confirmation/
│   │   │   │   │   ├── order-confirmation.component.ts
│   │   │   │   │   ├── order-confirmation.component.html
│   │   │   │   │   └── order-confirmation.component.scss
│   │   │   │   ├── profile/
│   │   │   │   │   ├── profile.component.ts
│   │   │   │   │   ├── profile.component.html
│   │   │   │   │   └── profile.component.scss
│   │   │   │   ├── edit-profile/
│   │   │   │   │   ├── edit-profile.component.ts
│   │   │   │   │   ├── edit-profile.component.html
│   │   │   │   │   └── edit-profile.component.scss
│   │   │   │   ├── my-reserves/
│   │   │   │   │   ├── my-reserves.component.ts
│   │   │   │   │   ├── my-reserves.component.html
│   │   │   │   │   └── my-reserves.component.scss
│   │   │   │   ├── reserve-details/
│   │   │   │   │   ├── reserve-details.component.ts
│   │   │   │   │   ├── reserve-details.component.html
│   │   │   │   │   └── reserve-details.component.scss
│   │   │   │   ├── my-events/
│   │   │   │   │   ├── my-events.component.ts
│   │   │   │   │   ├── my-events.component.html
│   │   │   │   │   └── my-events.component.scss
│   │   │   │   └── event-details/
│   │   │   │       ├── event-details.component.ts
│   │   │   │       ├── event-details.component.html
│   │   │   │       └── event-details.component.scss
│   │   │   └── client.routes.ts
│   │   │
│   │   ├── admin/
│   │   │   ├── components/
│   │   │   │   ├── dashboard/
│   │   │   │   │   ├── dashboard.component.ts
│   │   │   │   │   ├── dashboard.component.html
│   │   │   │   │   └── dashboard.component.scss
│   │   │   │   ├── my-foods/
│   │   │   │   │   ├── my-foods.component.ts
│   │   │   │   │   ├── my-foods.component.html
│   │   │   │   │   └── my-foods.component.scss
│   │   │   │   ├── edit-food/
│   │   │   │   │   ├── edit-food.component.ts
│   │   │   │   │   ├── edit-food.component.html
│   │   │   │   │   └── edit-food.component.scss
│   │   │   │   ├── new-food/
│   │   │   │   │   ├── new-food.component.ts
│   │   │   │   │   ├── new-food.component.html
│   │   │   │   │   └── new-food.component.scss
│   │   │   │   ├── delete-food/
│   │   │   │   │   ├── delete-food.component.ts
│   │   │   │   │   ├── delete-food.component.html
│   │   │   │   │   └── delete-food.component.scss
│   │   │   │   ├── my-services/
│   │   │   │   │   ├── my-services.component.ts
│   │   │   │   │   ├── my-services.component.html
│   │   │   │   │   └── my-services.component.scss
│   │   │   │   ├── edit-service/
│   │   │   │   │   ├── edit-service.component.ts
│   │   │   │   │   ├── edit-service.component.html
│   │   │   │   │   └── edit-service.component.scss
│   │   │   │   ├── new-service/
│   │   │   │   │   ├── new-service.component.ts
│   │   │   │   │   ├── new-service.component.html
│   │   │   │   │   └── new-service.component.scss
│   │   │   │   ├── delete-service/
│   │   │   │   │   ├── delete-service.component.ts
│   │   │   │   │   ├── delete-service.component.html
│   │   │   │   │   └── delete-service.component.scss
│   │   │   │   ├── reserves/
│   │   │   │   │   ├── reserves.component.ts
│   │   │   │   │   ├── reserves.component.html
│   │   │   │   │   └── reserves.component.scss
│   │   │   │   ├── admin-reserve-details/
│   │   │   │   │   ├── admin-reserve-details.component.ts
│   │   │   │   │   ├── admin-reserve-details.component.html
│   │   │   │   │   └── admin-reserve-details.component.scss
│   │   │   │   ├── estimated-cost/
│   │   │   │   │   ├── estimated-cost.component.ts
│   │   │   │   │   ├── estimated-cost.component.html
│   │   │   │   │   └── estimated-cost.component.scss
│   │   │   │   ├── events/
│   │   │   │   │   ├── events.component.ts
│   │   │   │   │   ├── events.component.html
│   │   │   │   │   └── events.component.scss
│   │   │   │   └── admin-event-details/
│   │   │   │       ├── admin-event-details.component.ts
│   │   │   │       ├── admin-event-details.component.html
│   │   │   │       └── admin-event-details.component.scss
│   │   │   └── admin.routes.ts
│   │   │
│   │   └── global/
│   │       ├── components/
│   │       │   ├── index/
│   │       │   │   ├── index.component.ts
│   │       │   │   ├── index.component.html
│   │       │   │   └── index.component.scss
│   │       │   ├── welcome/
│   │       │   │   ├── welcome.component.ts
│   │       │   │   ├── welcome.component.html
│   │       │   │   └── welcome.component.scss
│   │       │   ├── notifications/
│   │       │   │   ├── notifications.component.ts
│   │       │   │   ├── notifications.component.html
│   │       │   │   └── notifications.component.scss
│   │       │   ├── calendar/
│   │       │   │   ├── calendar.component.ts
│   │       │   │   ├── calendar.component.html
│   │       │   │   └── calendar.component.scss
│   │       │   ├── edit-event/
│   │       │   │   ├── edit-event.component.ts
│   │       │   │   ├── edit-event.component.html
│   │       │   │   └── edit-event.component.scss
│   │       │   ├── cancel-event/
│   │       │   │   ├── cancel-event.component.ts
│   │       │   │   ├── cancel-event.component.html
│   │       │   │   └── cancel-event.component.scss
│   │       │   ├── edit-reserve/
│   │       │   │   ├── edit-reserve.component.ts
│   │       │   │   ├── edit-reserve.component.html
│   │       │   │   └── edit-reserve.component.scss
│   │       │   └── cancel-reserve/
│   │       │       ├── cancel-reserve.component.ts
│   │       │       ├── cancel-reserve.component.html
│   │       │       └── cancel-reserve.component.scss
│   │       └── global.routes.ts
│   │
│   ├── pages/
│   │   ├── dashboard/
│   │   │   ├── dashboard.page.ts
│   │   │   ├── dashboard.page.html
│   │   │   └── dashboard.page.scss
│   │   ├── home/
│   │   │   ├── home.page.ts
│   │   │   ├── home.page.html
│   │   │   └── home.page.scss
│   │   └── pages.config.ts
│   │
│   ├── app.component.ts
│   ├── app.component.html
│   ├── app.component.scss
│   ├── app.routes.ts
│   └── main.ts
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── i18n/
│
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
│
├── theme/
│   ├── variables.scss
│   └── global.scss
│
├── index.html
├── main.ts
└── polyfills.ts
```

## Observações:

1. **Componentes Globais**: Ficam em `features/global/` pois são usados por diferentes tipos de usuário
2. **Separação por Perfil**: Client e Admin têm suas próprias pastas em `features/`
3. **Reutilização**: Componentes compartilhados ficam em `shared/`
4. **Serviços**: Centralizados em `core/services/`
5. **Rotas**: Cada feature tem seu próprio arquivo de rotas
6. **Pages**: Páginas principais que agregam componentes