# eBuffet Frontend

## Estrutura do Projeto (Feature Sliced Design)

```
src/
├── app/                     # App Layer - configuração global, routing, providers
│   ├── app.component.*      # Root component
│   ├── app.routes.ts        # Routing principal
│   └── main.ts             # Entry point
│
├── pages/                   # Pages Layer - páginas completas (rotas)
│   ├── global/             # Páginas globais
│   ├── client/             # Páginas do cliente
│   └── admin/              # Páginas do admin
│
├── widgets/                 # Widgets Layer - blocos de UI complexos
│
├── features/               # Features Layer - lógica de negócio (services)
│
├── entities/               # Entities Layer - entidades + API + Models
│
└── shared/                 # Shared Layer - código reutilizável
    ├── api/                # Configurações de API base
    ├── config/             # Configurações globais
    ├── lib/                # Bibliotecas e utilitários
    └── ui/                 # Componentes UI genéricos
```

## Comandos de Build

```bash
ionic build
npx cap add android
npx cap open android

ionic build
npx cap copy
npx cap run android
```
O src/global.scss continua sem os imports das folhas básicas do Ionic, por isso os web components perdem todo o CSS padrão quando você gera o bundle para Android.

O src/app/app.component.scss ainda referencia var(--secondary-color) e var(--primary-color), variáveis inexistentes no tema; os toolbars ficam sem cor quando o CSS é recompilado.

O fallback de tema em ThemeService grava strings vazias nas variáveis --ion-color-*; se a leitura do theme.json falhar no dispositivo, todos os componentes Ionic ficam sem cores ou contrastes válidos.
