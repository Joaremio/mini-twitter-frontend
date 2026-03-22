# Mini Twitter - B2Bit Challenge

Este é um projeto de Mini Twitter desenvolvido como parte de um desafio técnico para a vaga de Desenvolvedor Frontend. A aplicação permite criar, visualizar, curtir e gerenciar posts em tempo real, com suporte completo a Modo Dark e design responsivo.

## 🚀 Tecnologias

- **Framework: Next.js 15 (App Router)**

- **Estilização**: Tailwind CSS v4

- **Gerenciamento de Estado**: Zustand (Auth) & TanStack Query v5 (Data Fetching)

- **Formulários**: React Hook Form + Zod (Validação)

- **Ícones**: Lucide React

- **Notificações (Toast)**: Sonner

- **Containerização**: Docker

## 🛠️ Funcionalidades

- **CRUD de Posts**: Criação, listagem, edição e exclusão.

- **Busca em Tempo Real** : Filtro de posts por título

- **Autenticação Completa**: Registro, Login e Logout.

- **Sistema de Likes**: Toggle de likes em posts (apenas um por usuário).

## 📦 Como Rodar com Docker

A maneira mais fácil de iniciar o projeto é usando Docker:

```bash
# 1. Build da imagem
docker build -t mini-twitter-front .
```

```bash
# 2. Iniciar o container
docker run -p 3001:3000 -e NEXT_PUBLIC_API_URL=http://host.docker.internal:3000 mini-twitter-front
```

## 💻 Como Rodar Localmente

Certifique-se de ter o Node.js (v20+) instalado e o backend rodando na porta 3000.

```bash
# Instalar dependências
bun install

# 2. Configurar variável de ambiente
# Crie um arquivo .env.local com: NEXT_PUBLIC_API_URL=http://localhost:3000

# Iniciar em modo de desenvolvimento
bun run dev
```

## 🗄️ Diferenciais do Projeto

- **Modo Dark Dinâmico**: Suporte a temas claro/escuro e adaptação automática à preferência do sistema.

- **Componentização**: Arquitetura baseada em componentes reutilizáveis (ex: Input e PostCard).

- **Infinite Scroll**: Carregamento automático de novas páginas conforme o scroll do usuário.

- **UX/UI**: Feedbacks visuais de carregamento, Toasts de erro/sucesso e animações suaves com Tailwind.

- **Dockerizado**: Ambiente de desenvolvimento padronizado para facilitar a avaliação.

## 🗄️ Estrutura do Projeto

- `src/app/`: Rotas e Layouts (App Router).
- `src/components/`: Componentes reutilizáveis.
- `src/hooks/`: Hooks customizados.
- `src/services/`: Configuração do Axios e chamadas de API.
- `src/store/`: Gerenciamento de estado global (Zustand).
- `src/schemas/`: Validações Zod.
