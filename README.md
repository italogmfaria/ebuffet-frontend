# eBuffet — Sistema de Gerenciamento Centralizado de Buffets e Eventos (Front-end)

O **eBuffet** é um aplicativo móvel para Android destinado ao gerenciamento centralizado de buffets e eventos, no qual clientes realizam reservas de forma estruturada e os responsáveis pelo buffet administram reservas, eventos, comidas, serviços e identidade visual em um único ambiente digital.
O front-end foi desenvolvido com Angular e Ionic, utilizando o Capacitor para empacotamento nativo Android, e se comunica com o back-end por meio de uma API RESTful, com autenticação baseada em JWT.
A plataforma adota arquitetura multi-tenant, permitindo que múltiplos buffets operem de forma independente com identidade visual personalizada, sem necessidade de instâncias separadas.

---

## Tecnologias Utilizadas

- TypeScript 5.8
- Angular 20 (standalone components)
- Ionic 8
- Angular Material 20
- RxJS 7.8
- Capacitor 7 (Android)
- SCSS / Angular Material Theming
- Feature-Sliced Design (FSD)
- Karma + Jasmine
- ESLint 9
- Node.js / npm

---

## Perfis de Usuários

O sistema contempla dois perfis com responsabilidades distintas. Não existe administrador global, cada buffet gerencia exclusivamente seus próprios dados.

**Cliente:** usuário final que utiliza o sistema para realizar reservas em buffets. Consulta comidas e serviços disponíveis, cria reservas informando data, horário, quantidade de pessoas e endereço, e acompanha o andamento de suas reservas e eventos.

**Buffet:** estabelecimento responsável pela oferta de serviços para eventos. Gerencia o cadastro de comidas e serviços, analisa reservas recebidas e decide sobre sua aprovação ou recusa. Cada buffet administra exclusivamente seus próprios dados, garantindo isolamento lógico no ambiente multi-buffet.

---

## Estrutura do Sistema

### Arquitetura

O projeto segue o padrão **Feature-Sliced Design (FSD)**, organizado em camadas de responsabilidade:

```
src/
├── app/          # Bootstrap, roteamento principal e componente raiz
├── pages/        # Páginas roteáveis separadas por área de acesso
│   ├── global/   # Páginas públicas e compartilhadas (login, cadastro, reservas, eventos)
│   ├── client/   # Área exclusiva do perfil Cliente
│   └── admin/    # Área exclusiva do perfil Buffet
├── features/     # Lógica de negócio por domínio (auth, foods, orders, reservations, etc.)
├── core/         # Utilitários globais (API client, guards, interceptors, enums, serviços)
├── shared/       # Componentes de UI reutilizáveis, assets e estilos
├── environments/ # Configuração de ambiente (URL da API, buffetId)
└── theme/        # Variáveis SCSS globais e tema Ionic
```

### Camada de Páginas

| Perfil          | Rota                       | Descrição                                                      |
|-----------------|----------------------------|----------------------------------------------------------------|
| Pública         | `/login`                   | Tela de login (Cliente e Buffet)                               |
| Pública         | `/register`                | Cadastro de novo cliente                                       |
| Pública         | `/forgot-password`         | Recuperação de senha por e-mail                                |
| Pública         | `/new-password`            | Redefinição de senha via código de verificação                 |
| Global          | `/notifications`           | Central de notificações (Cliente e Buffet)                     |
| Global          | `/reserves`                | Listagem e acompanhamento de reservas (Cliente e Buffet)       |
| Global          | `/events`                  | Listagem e acompanhamento de eventos (Cliente e Buffet)        |
| Cliente         | `/client/home`             | Tela inicial com carousel, categorias e calendário de datas    |
| Cliente         | `/client/foods`            | Catálogo de comidas disponíveis por categoria                  |
| Cliente         | `/client/order`            | Carrinho de seleção e criação de reserva                       |
| Cliente         | `/client/services`         | Catálogo de serviços adicionais por categoria                  |
| Cliente         | `/client/profile`          | Perfil do cliente (visualização e edição)                      |
| Buffet          | `/admin/dashboard`         | Dashboard com calendário de eventos agendados                  |
| Buffet          | `/admin/manage-foods`      | Gerenciamento de comidas (listar, cadastrar, editar, remover)  |
| Buffet          | `/admin/manage-services`   | Gerenciamento de serviços (listar, cadastrar, editar, remover) |

### Camada Core

- **ApiClient** — wrapper centralizado sobre o `HttpClient` do Angular com tipagem genérica
- **AuthGuard / RoleGuard** — proteção de rotas por autenticação e perfil (CLIENTE, BUFFET)
- **authInterceptor** — injeta o token JWT (`Bearer`) em todas as requisições autenticadas
- **buffetIdInterceptor** — injeta o header `X-Buffet-Id` para isolamento de dados por tenant
- **SessionService** — gerencia estado da sessão do usuário via `BehaviorSubject` com persistência em localStorage
- **ThemeService** — carrega e aplica dinamicamente o tema visual do buffet via CSS variables

### Funcionalidades por Perfil

**Cliente**
- Cadastro de conta e autenticação por JWT
- Redefinição de senha por verificação de e-mail
- Consulta ao catálogo de comidas e serviços do buffet
- Criação de reservas: seleção de comidas, serviços, data, horário, quantidade de pessoas e endereço
- Edição e cancelamento de reservas no estado *pendente*
- Acompanhamento do estado das reservas (*pendente*, *aprovada*, *cancelada*)
- Visualização e edição de eventos no estado *agendado*
- Gerenciamento de perfil (nome, e-mail, telefone, foto)
- Recebimento de notificações automáticas sobre mudanças de estado

**Buffet**
- Autenticação com credenciais fornecidas no cadastro do estabelecimento
- Gerenciamento de comidas: cadastro, listagem, edição e remoção com imagens via Cloudinary
- Gerenciamento de serviços: cadastro, listagem, edição e remoção com imagens via Cloudinary
- Gerenciamento de reservas recebidas: aprovação (com valor estimado e disponibilidade da data) ou recusa
- Gerenciamento de eventos originados de reservas aprovadas: atualização de estado, conclusão e reversão de cancelamento
- Dashboard com calendário de eventos agendados
- Recebimento de notificações automáticas sobre novas reservas e mudanças de estado

### Estados de Reservas e Eventos

| Entidade  | Estados possíveis                        | Transições                                              |
|-----------|------------------------------------------|---------------------------------------------------------|
| Reserva   | `PENDENTE` → `APROVADA` ou `CANCELADA`   | Buffet aprova ou recusa; Cliente cancela enquanto pendente |
| Evento    | `AGENDADO` → `CONCLUIDO` ou `CANCELADO` | Buffet conclui ou cancela; reversão de cancelamento disponível ao Buffet |

Toda reserva aprovada é automaticamente convertida em um evento com estado *agendado*.

### Sistema de Temas (Multi-Tenant)

Cada buffet possui uma pasta em `src/assets/buffets/{buffetId}/` com um arquivo `theme.json` que define identidade visual carregada dinamicamente na inicialização:

```json
{
  "primaryColor": "#aededc",
  "secondaryColor": "#009688",
  "accentColor": "#004b44",
  "logo": "assets/buffets/1/logo.png",
  "banner": "assets/buffets/1/banner.png",
  "buffetId": 1,
  "nameBuffet": "Buffet Oliveira",
  "carouselImages": [
    "assets/buffets/1/carousel/carousel-image-1.png",
    "assets/buffets/1/carousel/carousel-image-2.png",
    "assets/buffets/1/carousel/carousel-image-3.png",
    "assets/buffets/1/carousel/carousel-image-4.png"
  ]
}
```

### Configuração (environment.ts)

```typescript
export const environment = {
  production: false,
  buffetId: 1,
  API_URL: 'http://localhost:8080/api',
  TENANT_HEADER: 'X-Buffet-Id'
};
```

---

## Endpoints da API Consumidos

| Método | Rota                     | Ator           | Descrição                                          |
|--------|--------------------------|----------------|----------------------------------------------------|
| POST   | `/auth/login`            | Cliente, Buffet | Autenticação e obtenção do token JWT              |
| POST   | `/auth/register`         | Cliente        | Cadastro de novo cliente                           |
| GET    | `/auth/me`               | Cliente, Buffet | Dados do usuário autenticado                      |
| POST   | `/auth/request-reset`    | Cliente, Buffet | Solicitação de redefinição de senha               |
| POST   | `/auth/reset-password`   | Cliente, Buffet | Redefinição de senha com código de verificação    |
| GET    | `/comidas`               | Cliente        | Listagem de comidas disponíveis do buffet          |
| POST   | `/comidas`               | Buffet         | Cadastro de nova comida                            |
| PUT    | `/comidas/{id}`          | Buffet         | Atualização de comida existente                    |
| DELETE | `/comidas/{id}`          | Buffet         | Remoção (inativação) de comida                     |
| GET    | `/servicos`              | Cliente        | Listagem de serviços disponíveis do buffet         |
| POST   | `/servicos`              | Buffet         | Cadastro de novo serviço                           |
| PUT    | `/servicos/{id}`         | Buffet         | Atualização de serviço existente                   |
| DELETE | `/servicos/{id}`         | Buffet         | Remoção (inativação) de serviço                    |
| GET    | `/reservas`              | Cliente, Buffet | Listagem de reservas                              |
| POST   | `/reservas`              | Cliente        | Criação de reserva com comidas, serviços e dados do evento |
| PUT    | `/reservas/{id}`         | Cliente        | Edição de reserva no estado *pendente*             |
| PATCH  | `/reservas/{id}/aprovar` | Buffet         | Aprovação de reserva com valor estimado e disponibilidade |
| PATCH  | `/reservas/{id}/cancelar`| Cliente, Buffet | Cancelamento de reserva                          |
| GET    | `/eventos`               | Cliente, Buffet | Listagem de eventos                              |
| PUT    | `/eventos/{id}`          | Cliente, Buffet | Edição de evento no estado *agendado*            |
| PATCH  | `/eventos/{id}/concluir` | Buffet         | Conclusão de evento                                |
| GET    | `/notificacoes`          | Cliente, Buffet | Listagem de notificações do usuário              |
| POST   | `/arquivos/upload`       | Cliente, Buffet | Upload de imagens via Cloudinary                 |

---

## Como Executar

### Pré-requisitos

- Node.js 18+ e npm
- Angular CLI 20: `npm install -g @angular/cli`
- Back-end eBuffet em execução em `http://localhost:8080`
- Para Android: Java, Gradle e Android SDK (Android Studio)

### Instalação e execução web

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento (http://localhost:4200)
npm start

# Build de produção
npm run build:prod

# Executar testes
npm test

# Verificar lint
npm run lint
```

### Execução no Android

```bash
# Configuração inicial do projeto Android (primeira vez)
npm run setup:android

# Executar em dispositivo/emulador conectado
npm run android:run

# Abrir no Android Studio
npm run android:open

# Gerar APK debug
npm run android:apk:debug

# Gerar APK release
npm run android:apk:release

# Gerar AAB para publicação no Google Play
npm run android:aab:release
```

### Exemplos de uso

- Autenticação
- POST
- http://localhost:8080/api/auth/login
- Body JSON: `{ "email": "cliente@email.com", "senha": "senha123" }`
- Resposta esperada: `{ "token": "eyJhbGciOi...", "tipo": "CLIENTE" }`
-------------------------------------------------------------
- Criar reserva (Cliente)
- POST
- http://localhost:8080/api/reservas
- Headers: `X-Buffet-Id: 1`, `Authorization: Bearer {token}`
- Body JSON: `{ "data": "2026-04-15", "horario": "18:00", "qtdPessoas": 50, "descricao": "Aniversário", "endereco": { "rua": "Rua das Flores", "numero": "123", "cidade": "Goiânia", "estado": "GO", "cep": "74000-000" }, "comidas": [1, 2], "servicos": [3] }`
- Resposta esperada: `{ "id": 10, "status": "PENDENTE", "data": "2026-04-15" }`
-------------------------------------------------------------
- Aprovar reserva (Buffet)
- PATCH
- http://localhost:8080/api/reservas/10/aprovar
- Headers: `X-Buffet-Id: 1`, `Authorization: Bearer {token}`
- Body JSON: `{ "valorEstimado": 3500.00, "dataDisponivel": true }`
- Resposta esperada: `{ "id": 10, "status": "APROVADA", "evento": { "id": 5, "status": "AGENDADO" } }`
-------------------------------------------------------------
- Listar eventos (Cliente e Buffet)
- GET
- http://localhost:8080/api/eventos
- Headers: `X-Buffet-Id: 1`, `Authorization: Bearer {token}`
- Resposta esperada: `[{ "id": 5, "status": "AGENDADO", "valorEstimado": 3500.00, "data": "2026-04-15" }]`
