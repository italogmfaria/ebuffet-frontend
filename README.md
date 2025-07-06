src/
└── app/
├── core/                    # Serviços e utilitários globais
│   ├── services/            # Ex: auth.service.ts, api.service.ts
│   ├── guards/              # Route guards (ex: auth.guard.ts)
│   ├── interceptors/        # HTTP interceptors
│   └── core.config.ts       # Importações globais standalone (ex: HttpClientModule)
│
├── shared/                  # Componentes e pipes reutilizáveis
│   ├── components/          # Navbar, Footer, etc.
│   ├── pipes/               # Ex: date-format.pipe.ts
│   ├── directives/          # Ex: autofocus.directive.ts
│   └── shared.config.ts     # Declarações e imports standalone
│
├── features/                # Funcionalidades específicas (autonomia, escopo limitado)
│   ├── auth/                # Login, registro, recuperação de senha
│   ├── buffet/              # Gerenciamento de buffets
│   └── cliente/             # Visualização de pacotes e reservas
│
├── pages/                   # Páginas completas (rotas)
│   ├── dashboard/           # Página de dashboard do admin
│   ├── home/                # Página inicial pública ou de cliente
│   └── pages.config.ts      # Imports de páginas principais




ionic build
npx cap add android
npx cap open android

ionic build
npx cap copy
npx cap run android
