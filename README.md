# Plataforma de Estudos de Direito Previdenciário (fs-nimes)

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)

## Descrição

**fs-nimes** é uma plataforma web full-stack projetada para ajudar estudantes e profissionais a aprofundar seus conhecimentos em Direito Previdenciário. O site oferece um sistema de aprendizado progressivo, dividido em blocos temáticos, com questões de múltipla escolha e certo/errado, culminando em um simulado final com certificado.

## Tecnologias Utilizadas

A arquitetura do projeto é um monorepo gerenciado com `pnpm`, contendo:

-   **Frontend:**
    -   Framework: **Next.js** (com App Router)
    -   Linguagem: **TypeScript**
    -   Estilização: **Tailwind CSS**
    -   Componentes de UI: **shadcn/ui**
    -   Requisições HTTP: **axios**
    -   Gerenciamento de Formulários: **React Hook Form** com **Zod**

-   **Backend:**
    -   Framework: **NestJS**
    -   Linguagem: **TypeScript**
    -   ORM: **Prisma**
    -   Banco de Dados: **PostgreSQL**
    -   Autenticação: **Passport.js** (com estratégia JWT)

---

## Telas da Aplicação (Mapa de Rotas)

Aqui está a estrutura de navegação e as principais telas da plataforma.

### Rotas Públicas (Usuário Deslogado)

-   `/`: **Landing Page**
    -   Apresentação da plataforma (Hero Section), com chamadas para cadastro e login.
-   `/auth`: **Página de Autenticação**
    -   Interface unificada para Login e Cadastro de usuários.

### Rotas Protegidas (Usuário Logado)

O acesso a estas rotas requer autenticação.

-   `/dashboard`: **Dashboard Principal**
    -   Página inicial do usuário logado. Exibe um resumo do progresso e links rápidos.
-   `/study-blocks`: **Listagem dos Blocos de Estudo**
    -   Exibe todos os blocos de estudo disponíveis, com seu status e progresso.
-   `/study-blocks/[blockId]`: **Página de Estudo de um Bloco**
    -   Interface principal onde o usuário responde às questões de um bloco específico.
-   `/study-blocks/[blockId]/complete`: **Página de Conclusão de Bloco**
    -   Exibe os resultados do usuário após finalizar um bloco.
-   `/profile`: **Página de Perfil do Usuário**
    -   Permite ao usuário visualizar e editar suas informações pessoais.
-   `/admin/questions`: **Gerenciamento de Questões**
    -   Interface para administradores listarem, criarem, editarem e deletarem questões.

---

## Como Rodar o Projeto

Siga os passos abaixo para configurar e rodar o ambiente de desenvolvimento local.

1.  **Clone o Repositório:**
    ```bash
    git clone <url-do-seu-repositorio>
    cd fs-nimes
    ```

2.  **Instale o `pnpm`** (se ainda não tiver):
    ```bash
    npm install -g pnpm
    ```

3.  **Configure as Variáveis de Ambiente:**
    -   No backend, crie o arquivo `apps/server/.env` e adicione sua `DATABASE_URL` do PostgreSQL e um segredo para o JWT.
        ```env
        # apps/server/.env
        DATABASE_URL="postgresql://user:password@localhost:5432/fs-nimes?schema=public"
        JWT_SECRET="SEU_SEGREDO_SUPER_SECRETO_AQUI"
        ```

4.  **Instale as Dependências:**
    Na raiz do projeto, rode:
    ```bash
    pnpm install
    ```

5.  **Aplique as Migrações do Banco de Dados:**
    Este comando criará todas as tabelas necessárias no seu banco.
    ```bash
    pnpm --filter server exec prisma migrate dev
    ```

6.  **Popule o Banco com Dados Iniciais (Opcional, mas Recomendado):**
    Este comando insere os blocos de estudo e questões iniciais.
    ```bash
    pnpm --filter server exec prisma db seed
    ```

7.  **Inicie os Servidores:**
    Você precisará de dois terminais abertos na raiz do projeto.

    -   **Terminal 1 (Backend):**
        ```bash
        pnpm --filter server start:dev
        ```
        O servidor do backend estará rodando em `http://localhost:3000`.

    -   **Terminal 2 (Frontend):**
        ```bash
        pnpm --filter client dev
        ```
        O servidor do frontend estará rodando em `http://localhost:3001`.

## Roadmap de Funcionalidades

### ✅ Concluído

-   [x] **Setup do Projeto:** Monorepo com `pnpm`, Next.js e NestJS.
-   [x] **Autenticação:** Cadastro e Login de usuário com JWT.
-   [x] **Banco de Dados:** Schema completo definido com Prisma e migrações iniciais.
-   [x] **Conteúdo Inicial:** Script de *seeding* para popular o banco com blocos e questões.
-   [x] **Perfil de Usuário:** Visualização e edição de nome e bio.
-   [x] **Modo Noturno:** Implementação de tema claro/escuro com `next-themes`.
-   [x] **Layout Principal:** Header e Sidebar persistentes em todas as telas da aplicação.
-   [x] **Fluxo de Estudo Completo:**
    -   [x] Listagem de Blocos com status (bloqueado, desbloqueado, completo) e progresso.
    -   [x] Interface para responder questões.
    -   [x] Feedback de respostas (certo/errado com explicação).
    -   [x] Sistema de progressão e desbloqueio de novos blocos.
    -   [x] Página de conclusão de bloco com resultados.
-   [x] **Dashboard de Desempenho v1:**
    -   [x] Endpoint de estatísticas no backend.
    -   [x] Exibição de aproveitamento, blocos concluídos e atalho para continuar estudando.
-   [x] **Gerenciamento de Questões (Admin):**
    -   [x] Interface para listar, criar, editar e deletar questões.

### 🎯 Próximos Passos

-   [ ] **Upload de Foto de Perfil:**
    -   **O quê:** Permitir que o usuário envie uma imagem para seu perfil.
    -   **Como:** Utilizar um serviço de armazenamento de terceiros (ex: AWS S3, Cloudinary). O frontend fará o upload diretamente para o serviço, que retornará uma URL. Essa URL será enviada ao backend para ser salva no campo `profileImage` do usuário.

-   [ ] **Simulado Final:**
    -   **O quê:** Gerar um simulado cronometrado com questões de todos os blocos após a conclusão de todos eles.
    -   **Como:** Criar um endpoint para selecionar questões aleatórias. A interface do simulado (`/simulation/start`) terá um cronômetro e, ao final, salvará o resultado na tabela `Simulation`.

-   [ ] **Geração de Certificado:**
    -   **O quê:** Gerar um certificado de conclusão após a aprovação no simulado final.
    -   **Como:** Criar uma nova página (`/certificate/[simulationId]`) que renderize o certificado. Utilizar uma biblioteca como `react-pdf` para permitir o download em PDF.

-   [ ] **Melhorias no Dashboard:**
    -   **O quê:** Adicionar visualizações gráficas das estatísticas.
    -   **Como:** Integrar uma biblioteca de gráficos (ex: Recharts, Chart.js) para exibir o aproveitamento ao longo do tempo ou por bloco de estudo.

### 🚀 Futuro

-   [ ] **Filtro de Questões:** Permitir que o usuário filtre questões por dificuldade ou tema para revisões personalizadas.
-   [ ] **Sistema de Roles:** Distinguir formalmente usuários (`USER`) de administradores (`ADMIN`) no backend para um controle de acesso mais robusto.
-   [ ] **Integração com IA:** Explorar a geração de novas questões ou explicações alternativas usando APIs de modelos de linguagem.