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
-   `/login`: **Página de Login**
    -   Formulário para que usuários existentes acessem suas contas.
-   `/register`: **Página de Cadastro**
    -   Formulário para novos usuários criarem uma conta.

### Rotas Protegidas (Usuário Logado)

O acesso a estas rotas requer autenticação.

-   `/dashboard`: **Dashboard Principal**
    -   Página inicial do usuário logado. Exibe um resumo do progresso e links rápidos.
-   `/study-blocks`: **Listagem dos Blocos de Estudo**
    -   Exibe todos os blocos de estudo disponíveis, com seu status (bloqueado, desbloqueado, completo) e progresso.
-   `/study-blocks/[blockId]`: **Página de Estudo de um Bloco**
    -   Interface principal onde o usuário responde às questões de um bloco específico.
-   `/profile`: **Página de Perfil do Usuário**
    -   Permite ao usuário visualizar e editar suas informações pessoais, como nome, bio e futuramente a foto.

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
    pnpm --filter server exec pnpm seed
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
-   [x] **Listagem de Blocos de Estudo:** Página que exibe os blocos com status (bloqueado, desbloqueado, completo) e progresso.

### ⏳ Em Andamento

-   [ ] **Página de Estudo:** Interface para o usuário responder as questões de um bloco específico.
-   [ ] **Feedback de Respostas:** Lógica para mostrar se a resposta está certa ou errada e exibir a explicação.
-   [ ] **Sistema de Progressão:** Lógica no backend para desbloquear o próximo bloco após atingir o critério de acertos.

### 🎯 Próximos Passos

-   [ ] **Filtro de Questões:** Permitir que o usuário filtre questões por dificuldade dentro de um bloco.
-   [ ] **Simulado Final:** Geração de um simulado cronometrado com questões de todos os blocos.
-   [ ] **Certificado:** Geração automática de um certificado de conclusão após aprovação no simulado.
-   [ ] **Upload de Foto de Perfil:** Implementar a lógica de upload e armazenamento da imagem do usuário.

### 🚀 Futuro

-   [ ] **Integração com IA:** Geração de novas questões sob demanda usando uma API de IA.
-   [ ] **Dashboard de Desempenho:** Gráficos e estatísticas detalhadas do progresso do usuário.