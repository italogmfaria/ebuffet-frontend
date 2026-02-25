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
    ├── interceptors/       # Configurações de interceptors
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
